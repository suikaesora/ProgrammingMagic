// コードの「計装」：Acorn で構文解析し、実行を見守るための呼び出しを差し込む。
//
// mode = 'normal'（通常実行）
//   各文の前に __ln(行) を入れ、エラー行の特定と無限ループ防止に使う。
// mode = 'step'（インタプリタ実行）
//   全体を function* にして、学習者の各文の前に yield __s(行, 変数スナップショット) を入れる。
//   学習者の関数もジェネレータに変換し、呼び出しを yield* で辿ることで関数の中も1行ずつ進める。
//
// 改行は増減させない（行番号がそのまま元のコードと一致する）。

import { parse } from '../../lib/acorn.js';

export class UserSyntaxError extends Error {
  constructor(message, line, column) {
    super(message);
    this.name = 'SyntaxError';
    this.line = line;
    this.column = column;
  }
}

export const HOOK_NAMES = ['__ln', '__loop', '__s', '__t', '__reg', '__fn', '__drive', '__call', '__callM', '__final'];

const SKIP_KEYS = new Set(['type', 'start', 'end', 'loc', 'range']);

function childNodes(node) {
  const out = [];
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const v = node[key];
    if (Array.isArray(v)) {
      for (const c of v) if (c && typeof c.type === 'string') out.push(c);
    } else if (v && typeof v.type === 'string') {
      out.push(v);
    }
  }
  // 同じ位置から始まる場合は大きいノードを先に（{ a = 1 } のような省略記法対策）
  return out.sort((a, b) => a.start - b.start || b.end - a.end);
}

function patternNames(p, out) {
  if (!p) return;
  switch (p.type) {
    case 'Identifier': out.push({ name: p.name, line: p.loc.start.line }); break;
    case 'ObjectPattern': p.properties.forEach((pr) => patternNames(pr.type === 'RestElement' ? pr.argument : pr.value, out)); break;
    case 'ArrayPattern': p.elements.forEach((e) => patternNames(e, out)); break;
    case 'AssignmentPattern': patternNames(p.left, out); break;
    case 'RestElement': patternNames(p.argument, out); break;
    default: break;
  }
}

const isFunctionNode = (n) => n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression';

function collectVarsDeep(node, out) {
  if (!node || typeof node.type !== 'string' || isFunctionNode(node)) return;
  if (node.type === 'VariableDeclaration' && node.kind === 'var') {
    node.declarations.forEach((d) => patternNames(d.id, out));
  }
  for (const c of childNodes(node)) collectVarsDeep(c, out);
}

function lexicalInto(statements, out) {
  for (const s of statements) {
    if (s.type === 'VariableDeclaration' && s.kind !== 'var') s.declarations.forEach((d) => patternNames(d.id, out));
    else if ((s.type === 'ClassDeclaration' || s.type === 'FunctionDeclaration') && s.id) out.push({ name: s.id.name, line: s.id.loc.start.line });
  }
}

function functionScopeNames(fn) {
  const out = [];
  if (fn.type === 'Program') {
    fn.body.forEach((s) => collectVarsDeep(s, out));
    lexicalInto(fn.body, out);
    return out;
  }
  fn.params.forEach((p) => patternNames(p, out));
  if (fn.body.type === 'BlockStatement') {
    fn.body.body.forEach((s) => collectVarsDeep(s, out));
    lexicalInto(fn.body.body, out);
  }
  return out;
}

const isPlainFn = (fn) => !fn.async && !fn.generator;

const newlines = (s) => '\n'.repeat((s.match(/\n/g) || []).length);

/**
 * @param {string} source 全体コード
 * @param {{mode:'normal'|'step', userStart:number, userEnd:number}} opts
 * @returns {{ code: string }}
 */
export function instrument(source, { mode = 'normal', userStart = 1, userEnd = Infinity } = {}) {
  let ast;
  try {
    ast = parse(source, { ecmaVersion: 'latest', sourceType: 'script', locations: true });
  } catch (e) {
    throw new UserSyntaxError(e.message.replace(/\s*\(\d+:\d+\)\s*$/, ''), e.loc?.line ?? 1, e.loc?.column ?? 0);
  }

  const step = mode === 'step';
  const inUser = (line) => line >= userStart && line <= userEnd;
  const scopes = [];
  let gid = 0;

  // ---- 変数スナップショット（その時点で見える学習者の変数） ----
  function snapshot(line) {
    const names = new Map();
    for (const s of scopes) {
      for (const n of s) {
        if (!inUser(n.line) || n.line > line) continue;
        names.delete(n.name);
        names.set(n.name, true);
      }
    }
    if (!names.size) return 'null';
    return '()=>({' + [...names.keys()].map((n) => `${JSON.stringify(n)}:__t(()=>${n})`).join(',') + '})';
  }

  function stmtPrefix(stmt, ctx) {
    if (stmt.type === 'FunctionDeclaration' || stmt.type === 'EmptyStatement') return '';
    const line = stmt.loc.start.line;
    if (step && ctx.gen && inUser(line)) return `yield __s(${line},${snapshot(line)});`;
    return `__ln(${line});`;
  }

  // ---- 汎用：元のテキストを保ちつつ子ノードだけ変換して出力 ----
  function emitSpan(start, end, children, ctx, hook) {
    let out = '';
    let pos = start;
    for (const k of children) {
      if (k.start < pos || k.end > end) continue;
      out += source.slice(pos, k.start);
      out += hook ? hook(k) : emit(k, ctx);
      pos = k.end;
    }
    return out + source.slice(pos, end);
  }
  const emitNode = (node, ctx, hook) => emitSpan(node.start, node.end, childNodes(node), ctx, hook);

  // 文の並び（Program / Block / case）。各文の前に停止点を入れる
  function emitBody(node, key, ctx) {
    const list = node[key];
    const set = new Set(list);
    let regs = '';
    if (step) {
      for (const s of list) {
        if (s.type === 'FunctionDeclaration' && isPlainFn(s)) {
          s.__gid = ++gid;
          regs += `__reg(${s.id.name},__g${s.__gid});`;
        }
      }
    }
    let first = true;
    return emitNode(node, ctx, (k) => {
      let pre = '';
      if (set.has(k)) {
        if (first) { pre += regs; first = false; }
        pre += stmtPrefix(k, ctx);
      }
      return pre + emit(k, ctx);
    });
  }

  // if / ループの本体。ブロックでなければ { } で包む
  function wrapStmt(k, ctx, isLoop) {
    if (k.type === 'BlockStatement') {
      const s = emit(k, ctx);
      return isLoop ? '{__loop();' + s.slice(1) : s;
    }
    return '{' + (isLoop ? '__loop();' : '') + stmtPrefix(k, ctx) + emit(k, ctx) + '}';
  }

  function emitParams(fn, ctx) {
    if (!fn.params.length) return '';
    return emitSpan(fn.params[0].start, fn.params[fn.params.length - 1].end, fn.params, ctx);
  }

  // 変換しない関数（メソッド・async・ジェネレータ、または通常実行モード）
  function emitPlainFunction(fn) {
    scopes.push(functionScopeNames(fn));
    const inner = { gen: false, noCall: false };
    const s = emitNode(fn, inner, (k) => {
      if (k === fn.body) return k.type === 'BlockStatement' ? emitBody(k, 'body', inner) : emit(k, inner);
      return emit(k, { gen: false, noCall: true });
    });
    scopes.pop();
    return s;
  }

  // インタプリタ実行用：関数をジェネレータに変換
  function emitFunction(fn, kind) {
    if (!step || !isPlainFn(fn)) return emitPlainFunction(fn);
    scopes.push(functionScopeNames(fn));
    const inner = { gen: true, noCall: false };
    const params = emitParams(fn, { gen: false, noCall: true });
    const paramsStart = fn.params.length ? fn.params[0].start : null;
    const paramsEnd = fn.params.length ? fn.params[fn.params.length - 1].end : null;
    const headNl = newlines(source.slice(fn.start, paramsStart ?? fn.body.start));
    const midNl = paramsEnd != null ? newlines(source.slice(paramsEnd, fn.body.start)) : '';
    let body;
    if (fn.body.type === 'BlockStatement') {
      body = emitBody(fn.body, 'body', inner);
    } else {
      const line = fn.body.loc.start.line;
      const pre = inUser(line) ? `yield __s(${line},${snapshot(line)});` : '';
      body = `{${pre}return (${emit(fn.body, inner)});}`;
    }
    scopes.pop();
    const sig = `(${headNl}${params}${midNl})`;
    if (kind === 'decl') {
      const id = fn.__gid ?? ++gid;
      return `function ${fn.id.name}(...__a){return __drive(__g${id}.apply(this,__a))}function* __g${id}${sig}${body}`;
    }
    if (kind === 'expr') return `__fn(function* ${fn.id ? fn.id.name : ''}${sig}${body})`;
    return `__fn((function*${sig}${body}).bind(this))`;
  }

  function emitCall(node, ctx) {
    const c = node.callee;
    if (!step || !ctx.gen || ctx.noCall || node.optional || c.type === 'Super' || c.type === 'Import') {
      return emitNode(node, ctx);
    }
    const args = node.arguments;
    const argsStart = args.length ? args[0].start : null;
    const argsEnd = args.length ? args[args.length - 1].end : null;
    const argText = args.length ? emitSpan(argsStart, argsEnd, args, ctx) : '';
    const nlBefore = newlines(source.slice(c.end, argsStart ?? node.end));
    const nlAfter = argsEnd != null ? newlines(source.slice(argsEnd, node.end)) : '';
    if (c.type === 'MemberExpression' && c.object.type !== 'Super' && c.property.type !== 'PrivateIdentifier' && !c.optional) {
      const obj = emit(c.object, ctx);
      const nlMid = newlines(source.slice(c.object.end, c.property.start));
      const key = c.computed ? emit(c.property, ctx) : JSON.stringify(c.property.name);
      return `(yield* __callM(${obj},${nlMid}${key},${nlBefore}[${argText}]${nlAfter}))`;
    }
    const label = JSON.stringify(source.slice(c.start, c.end).replace(/\s+/g, ' ').slice(0, 40));
    return `(yield* __call(${emit(c, ctx)},${nlBefore}[${argText}]${nlAfter},${label}))`;
  }

  function emit(node, ctx) {
    switch (node.type) {
      case 'BlockStatement':
      case 'StaticBlock': {
        const names = [];
        lexicalInto(node.body, names);
        scopes.push(names);
        const s = emitBody(node, 'body', ctx);
        scopes.pop();
        return s;
      }
      case 'SwitchStatement': {
        const names = [];
        node.cases.forEach((c) => lexicalInto(c.consequent, names));
        scopes.push(names);
        const s = emitNode(node, ctx);
        scopes.pop();
        return s;
      }
      case 'SwitchCase':
        return emitBody(node, 'consequent', ctx);
      case 'IfStatement':
        return emitNode(node, ctx, (k) => (k === node.consequent || k === node.alternate ? wrapStmt(k, ctx, false) : emit(k, ctx)));
      case 'WhileStatement':
      case 'DoWhileStatement':
        return emitNode(node, ctx, (k) => (k === node.body ? wrapStmt(k, ctx, true) : emit(k, ctx)));
      case 'ForStatement':
      case 'ForInStatement':
      case 'ForOfStatement': {
        const names = [];
        const decl = node.type === 'ForStatement' ? node.init : node.left;
        if (decl && decl.type === 'VariableDeclaration' && decl.kind !== 'var') decl.declarations.forEach((d) => patternNames(d.id, names));
        scopes.push(names);
        const s = emitNode(node, ctx, (k) => (k === node.body ? wrapStmt(k, ctx, true) : emit(k, ctx)));
        scopes.pop();
        return s;
      }
      case 'CatchClause': {
        const names = [];
        if (node.param) patternNames(node.param, names);
        scopes.push(names);
        const s = emitNode(node, ctx);
        scopes.pop();
        return s;
      }
      case 'FunctionDeclaration': return emitFunction(node, 'decl');
      case 'FunctionExpression': return emitFunction(node, 'expr');
      case 'ArrowFunctionExpression': return emitFunction(node, 'arrow');
      case 'Property':
        if (node.method || node.kind === 'get' || node.kind === 'set') {
          return emitNode(node, ctx, (k) => (k === node.value ? emitPlainFunction(k) : emit(k, ctx)));
        }
        return emitNode(node, ctx);
      case 'MethodDefinition':
        return emitNode(node, ctx, (k) => (k === node.value ? emitPlainFunction(k) : emit(k, ctx)));
      case 'ClassDeclaration':
      case 'ClassExpression':
        return emitNode(node, { gen: false, noCall: true });
      case 'ChainExpression':
        return emitNode(node, { ...ctx, noCall: true });
      case 'CallExpression':
        return emitCall(node, ctx);
      default:
        return emitNode(node, ctx);
    }
  }

  const topNames = functionScopeNames(ast);
  scopes.push(topNames);
  const body = emitBody(ast, 'body', { gen: step, noCall: false });
  scopes.pop();

  const finalNames = [...new Set(topNames.map((n) => n.name))];
  const finalSnap = finalNames.length
    ? '()=>({' + finalNames.map((n) => `${JSON.stringify(n)}:__t(()=>${n})`).join(',') + '})'
    : 'null';
  const code = body + `\n;__final(${finalSnap});`;
  return { code };
}
