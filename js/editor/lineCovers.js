// お手本コードの「行隠し」。クリックするとはがれる（少しアニメーション）。
// 隠れている行は文字そのものを消しておくので、選択・コピーでも見えない。

import { config } from '../../content/config.js';

/** hiddenLines が未指定のとき、空行以外の約8割を自動で選ぶ */
export function autoHiddenLines(code, ratio = config.autoHideRatio) {
  const lines = code.split('\n');
  const candidates = lines.map((l, i) => (l.trim() ? i + 1 : null)).filter(Boolean);
  const hideCount = Math.round(candidates.length * ratio);
  // 均等に間引いて「見える行」を決める
  const showCount = candidates.length - hideCount;
  const show = new Set();
  for (let k = 0; k < showCount; k++) {
    show.add(candidates[Math.floor((k * candidates.length) / showCount)]);
  }
  return candidates.filter((n) => !show.has(n));
}

/**
 * @param editor createCodeEditor の戻り値（読み取り専用にしておく）
 * @param {string} code お手本コード
 * @param {number[]} hiddenLines 隠す行（1始まり）
 * @param {number[]} opened すでにはがした行
 * @param {(opened:number[]) => void} onReveal
 */
export function attachLineCovers(editor, code, hiddenLines, opened, onReveal) {
  const lines = code.split('\n');
  const hidden = hiddenLines.filter((n) => n >= 1 && n <= lines.length);
  const openSet = new Set(opened.filter((n) => hidden.includes(n)));

  const masked = () => lines.map((l, i) => (hidden.includes(i + 1) && !openSet.has(i + 1) ? '' : l)).join('\n');

  function layout() {
    editor.overlay.innerHTML = '';
    const lh = editor.lineHeight();
    for (const n of hidden) {
      if (openSet.has(n)) continue;
      const c = document.createElement('button');
      c.type = 'button';
      c.className = 'line-cover';
      c.style.top = `${editor.lineTop(n)}px`;
      c.style.height = `${lh}px`;
      c.title = 'クリックしてはがす';
      c.innerHTML = '<span class="line-cover-label">？ クリックではがす</span>';
      c.addEventListener('click', () => reveal(n, c));
      editor.overlay.appendChild(c);
    }
  }

  function reveal(n, el) {
    if (openSet.has(n)) return;
    openSet.add(n);
    el.classList.add('is-peeling');
    el.disabled = true;
    editor.setValue(masked());
    setTimeout(() => el.remove(), 650);
    onReveal([...openSet]);
  }

  editor.setValue(masked());
  layout();

  return {
    get total() { return hidden.length; },
    get openedCount() { return openSet.size; },
    get rate() { return hidden.length ? openSet.size / hidden.length : 0; },
    relayout: layout,
  };
}
