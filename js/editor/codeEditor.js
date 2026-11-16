// 共通のコードエリア
//  - 左に行番号と画像アイコン（ガター）
//  - textarea の下にハイライト表示を重ねる
//  - Tab / Shift+Tab でインデント、Enter で自動インデント
//  - 実行中の行・エラー行のハイライト
//  - 行の上に重ねる要素（行隠しなど）用の overlay レイヤー

import { highlight } from './highlight.js';
import { config } from '../../content/config.js';

const ICONS = {
  exec: 'assets/icons/exec.svg',
  error: 'assets/icons/error.svg',
};

/**
 * @param {object} [opt]
 * @param {boolean} [opt.noCopy] コピー・切り取り・ドラッグで持ち出せなくする（課題のお手本用）
 * @param {() => void} [opt.onCopyBlocked] noCopy で持ち出しを止めたときに呼ばれる
 */
export function createCodeEditor(parent, { value = '', readOnly = false, lineIcons = {}, label = 'コード', noCopy = false, onCopyBlocked } = {}) {
  const host = document.createElement('div');
  host.className = 'code-editor';
  parent.appendChild(host);
  host.innerHTML = `
    <div class="ce-gutter" aria-hidden="true"><div class="ce-gutter-inner"></div></div>
    <div class="ce-main">
      <div class="ce-layer ce-marks"></div>
      <pre class="ce-highlight" aria-hidden="true"><code></code></pre>
      <div class="ce-layer ce-overlay"></div>
      <textarea class="ce-input" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea>
    </div>`;
  const gutter = host.querySelector('.ce-gutter-inner');
  const marksLayer = host.querySelector('.ce-marks');
  const pre = host.querySelector('.ce-highlight');
  const codeEl = pre.querySelector('code');
  const overlay = host.querySelector('.ce-overlay');
  const ta = host.querySelector('.ce-input');
  ta.setAttribute('aria-label', label);
  ta.value = value;
  ta.readOnly = readOnly;
  if (readOnly) host.classList.add('is-readonly');
  if (noCopy) {
    // 打った方が身につくので、お手本は写せないようにする
    // （textarea には隠した行も入っているので、全選択コピーで答えが漏れるのも防ぐ）
    host.classList.add('is-nocopy');
    const block = (e) => { e.preventDefault(); onCopyBlocked?.(); };
    ta.addEventListener('copy', block);
    ta.addEventListener('cut', block);
    ta.addEventListener('dragstart', block);
  }

  const INDENT = config.indent;
  const listeners = new Set();
  const marks = new Map();      // line -> kind ('exec' | 'error')
  const customIcons = { ...lineIcons };

  const lineHeight = () => parseFloat(getComputedStyle(host).getPropertyValue('--code-lh')) || 24;
  const padTop = () => parseFloat(getComputedStyle(ta).paddingTop) || 0;

  function lineCount() { return ta.value.split('\n').length; }

  function renderGutter() {
    const n = lineCount();
    let html = '';
    for (let i = 1; i <= n; i++) {
      const kind = marks.get(i);
      const icon = kind ? ICONS[kind] : customIcons[i];
      html += `<div class="ce-gl${kind ? ` is-${kind}` : ''}"><span class="ce-icon">${icon ? `<img src="${icon}" alt="">` : ''}</span><span class="ce-num">${i}</span></div>`;
    }
    gutter.innerHTML = html;
  }

  function renderMarks() {
    const lh = lineHeight();
    const top = padTop();
    marksLayer.innerHTML = '';
    for (const [line, kind] of marks) {
      const d = document.createElement('div');
      d.className = `ce-mark is-${kind}`;
      d.style.top = `${top + (line - 1) * lh}px`;
      d.style.height = `${lh}px`;
      marksLayer.appendChild(d);
    }
  }

  function render() {
    codeEl.innerHTML = highlight(ta.value) + '\n';
    renderGutter();
    renderMarks();
    syncScroll();
  }

  function syncScroll() {
    const x = ta.scrollLeft;
    const y = ta.scrollTop;
    pre.style.transform = `translate(${-x}px, ${-y}px)`;
    marksLayer.style.transform = `translate(0, ${-y}px)`;
    overlay.style.transform = `translate(0, ${-y}px)`;
    gutter.style.transform = `translateY(${-y}px)`;
  }

  function emitChange() {
    render();
    for (const fn of listeners) fn(ta.value);
  }

  // 元に戻す(Ctrl+Z)が効くよう、可能なら execCommand で挿入する
  function insertText(text) {
    ta.focus();
    let ok = false;
    try { ok = document.execCommand('insertText', false, text); } catch (e) { ok = false; }
    if (!ok) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
      emitChange();
    }
  }

  function selectedLineRange() {
    const v = ta.value;
    const s = v.lastIndexOf('\n', ta.selectionStart - 1) + 1;
    let endPos = ta.selectionEnd;
    if (endPos > ta.selectionStart && v[endPos - 1] === '\n') endPos--;
    let e = v.indexOf('\n', endPos);
    if (e < 0) e = v.length;
    return [s, e];
  }

  function indentLines(dedent) {
    const v = ta.value;
    const [s, e] = selectedLineRange();
    const lines = v.slice(s, e).split('\n');
    const selStart = ta.selectionStart;
    const selEnd = ta.selectionEnd;
    let firstDelta = 0;
    let total = 0;
    const out = lines.map((ln, i) => {
      let d;
      let res;
      if (dedent) {
        const m = ln.match(/^( {1,2}|\t)/);
        d = m ? -m[0].length : 0;
        res = ln.slice(-d || 0);
        if (!m) res = ln;
      } else {
        d = INDENT.length;
        res = INDENT + ln;
      }
      if (i === 0) firstDelta = d;
      total += d;
      return res;
    });
    ta.setSelectionRange(s, e);
    insertText(out.join('\n'));
    const ns = Math.max(s, selStart + firstDelta);
    ta.setSelectionRange(selStart === selEnd ? ns : s, selStart === selEnd ? ns : selEnd + total);
  }

  ta.addEventListener('keydown', (e) => {
    if (ta.readOnly) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      const multi = ta.value.slice(ta.selectionStart, ta.selectionEnd).includes('\n');
      if (e.shiftKey || multi) indentLines(e.shiftKey);
      else insertText(INDENT);
    } else if (e.key === 'Enter' && !e.isComposing) {
      e.preventDefault();
      const v = ta.value;
      const pos = ta.selectionStart;
      const lineStart = v.lastIndexOf('\n', pos - 1) + 1;
      const indent = v.slice(lineStart, pos).match(/^[ \t]*/)[0];
      const before = v.slice(lineStart, pos).trimEnd();
      const after = v[ta.selectionEnd];
      const opens = /[{([]$/.test(before);
      if (opens && after && /[})\]]/.test(after)) {
        insertText(`\n${indent}${INDENT}\n${indent}`);
        const p = pos + 1 + indent.length + INDENT.length;
        ta.setSelectionRange(p, p);
      } else {
        insertText(`\n${indent}${opens ? INDENT : ''}`);
      }
    } else if (e.key === '}' && !e.isComposing) {
      // 空白だけの行で } を打ったら1段戻す
      const v = ta.value;
      const pos = ta.selectionStart;
      const lineStart = v.lastIndexOf('\n', pos - 1) + 1;
      const head = v.slice(lineStart, pos);
      if (/^[ \t]+$/.test(head) && ta.selectionStart === ta.selectionEnd) {
        e.preventDefault();
        ta.setSelectionRange(lineStart, pos);
        insertText(head.slice(INDENT.length) + '}');
      }
    }
  });
  ta.addEventListener('input', emitChange);
  ta.addEventListener('scroll', syncScroll);

  const ro = new ResizeObserver(() => { renderMarks(); syncScroll(); });
  ro.observe(host);

  render();

  return {
    el: host,
    textarea: ta,
    overlay,
    getValue() { return ta.value; },
    setValue(v) {
      ta.value = v;
      render();
      for (const fn of listeners) fn(ta.value);
    },
    setReadOnly(ro) { ta.readOnly = ro; host.classList.toggle('is-readonly', ro); },
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    /** 行に印をつける kind: 'exec'（実行中）| 'error'。line=null で解除 */
    markLine(line, kind) {
      for (const [l, k] of [...marks]) if (k === kind) marks.delete(l);
      if (line != null) {
        marks.set(line, kind);
        if (kind === 'exec' || kind === 'error') this.scrollToLine(line);
      }
      renderGutter();
      renderMarks();
    },
    clearMarks() { marks.clear(); renderGutter(); renderMarks(); },
    setLineIcon(line, src) { if (src) customIcons[line] = src; else delete customIcons[line]; renderGutter(); },
    scrollToLine(line) {
      const lh = lineHeight();
      const y = padTop() + (line - 1) * lh;
      if (y < ta.scrollTop || y + lh > ta.scrollTop + ta.clientHeight) {
        ta.scrollTop = Math.max(0, y - ta.clientHeight / 2);
        syncScroll();
      }
    },
    /** 行 line の上端（スクロール前の座標） */
    lineTop(line) { return padTop() + (line - 1) * lineHeight(); },
    lineHeight,
    lineCount,
    focus() { ta.focus(); },
    destroy() { ro.disconnect(); listeners.clear(); },
  };
}
