// 計装済みコードを関数にして実行できる形にする（通常実行・インタプリタ実行で共通）
//
// 安全性について：学習者のコードは同じページ内で動くため完全な隔離ではないが、
//  - window / document / localStorage などの危険な名前は引数で undefined に差し替える
//  - 無限ループは命令数の上限で止める
// という最低限の対策をしている。

import { HOOK_NAMES } from './instrument.js';
import { UNINIT } from '../core/format.js';

export class LoopLimitError extends Error {
  constructor() {
    super('処理が長すぎるため止めました');
    this.name = 'LoopLimitError';
  }
}

// 学習者のコードから見えなくする名前
const SHADOWED = [
  'window', 'document', 'globalThis', 'self', 'parent', 'top', 'opener', 'frames',
  'localStorage', 'sessionStorage', 'indexedDB', 'caches', 'cookieStore',
  'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'navigator', 'location', 'history',
  'alert', 'confirm', 'prompt', 'open', 'close', 'eval', 'importScripts', 'Worker',
];

/** 1区切り（1フレームや1ステップ）で実行できる命令数の上限 */
export const OPS_LIMIT = 3_000_000;

export function createHooks() {
  const genOf = new WeakMap();  // 通常関数 → ジェネレータ版
  const gens = new WeakSet();   // ジェネレータ版そのもの
  const state = { line: null, ops: 0, finalSnap: null };

  const tick = () => {
    if (++state.ops > OPS_LIMIT) throw new LoopLimitError();
  };

  function* invoke(f, thisArg, args, label) {
    if (typeof f !== 'function') {
      throw new TypeError(`${label ?? 'それ'} is not a function`);
    }
    const g = genOf.get(f) || (gens.has(f) ? f : null);
    if (g) return yield* g.apply(thisArg, args);
    return f.apply(thisArg, args);
  }

  const hooks = {
    __ln(line) { state.line = line; tick(); },
    __loop: tick,
    __s(line, snap) { state.line = line; tick(); return { line, snap }; },
    __t(f) { try { return f(); } catch (e) { return UNINIT; } },
    __reg(f, g) { genOf.set(f, g); gens.add(g); },
    __fn(g) {
      const f = function (...a) { return hooks.__drive(g.apply(this, a)); };
      genOf.set(f, g);
      gens.add(g);
      return f;
    },
    // ジェネレータを止まらずに最後まで動かす（ネイティブから呼ばれた関数用）
    __drive(it) {
      let r;
      while (!(r = it.next()).done) { /* 停止点は読み飛ばす */ }
      return r.value;
    },
    __call(f, args, label) { return invoke(f, undefined, args, label); },
    __callM(o, k, args) {
      const f = o[k];
      return invoke(f, o, args, `${typeof k === 'string' ? k : String(k)}`);
    },
    __final(fn) { state.finalSnap = fn; },
  };

  return {
    hooks,
    state,
    resetOps() { state.ops = 0; },
    /** 関数 fn を1行ずつ進めるためのジェネレータを作る（変換されていなければ一気に実行） */
    stepGenFor(fn, args = []) {
      const g = genOf.get(fn) || (gens.has(fn) ? fn : null);
      if (g) return g.apply(undefined, args);
      return (function* () { return fn(...args); })();
    },
    finalVars() {
      if (!state.finalSnap) return {};
      const raw = state.finalSnap();
      const out = {};
      for (const k in raw) if (raw[k] !== UNINIT) out[k] = raw[k];
      return out;
    },
  };
}

/**
 * @param {string} code 計装済みコード
 * @param {'normal'|'step'} mode
 * @param {object} hooks createHooks().hooks
 * @param {object} api 学習者に見せる関数（runtimeApi）
 * @returns {Function} normal: 実行関数 / step: ジェネレータを返す関数
 */
export function compile(code, mode, hooks, api) {
  const apiNames = Object.keys(api);
  const shadow = SHADOWED.filter((n) => !apiNames.includes(n));
  const names = [...HOOK_NAMES, ...apiNames, ...shadow];
  const values = [...HOOK_NAMES.map((n) => hooks[n]), ...apiNames.map((n) => api[n]), ...shadow.map(() => undefined)];
  // 内側の関数で包むことで、学習者が let text = … のように API と同じ名前を使ってもエラーにならない
  const body = mode === 'step'
    ? `return function* __main(){${code}\n};`
    : `(function __main(){${code}\n}).call(undefined);`;
  let fn;
  try {
    fn = new Function(...names, body);
  } catch (e) {
    // 計装の不具合などで生成コードが壊れた場合
    const err = new SyntaxError(`コードを準備できませんでした: ${e.message}`);
    err.internal = true;
    throw err;
  }
  if (mode === 'step') {
    const factory = fn(...values);
    return () => factory();
  }
  return () => fn(...values);
}
