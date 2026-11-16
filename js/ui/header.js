// 画面上部のバー
import { themeButton } from '../core/theme.js';
import { escapeHtml } from '../core/format.js';
import { lessonLabel } from '../core/progress.js';

/**
 * 修行画面のヘッダー（ホームへ・修行名・解説/課題タブ・テーマ切替）
 * @param {{ explainWarn?: boolean }} [opt] explainWarn: 解説タブに「見ると宝箱が減る」注意を付ける
 */
export function lessonHeader(lesson, part, { explainWarn = false } = {}) {
  const h = document.createElement('header');
  h.className = 'topbar';
  h.innerHTML = `
    <a class="btn btn-sm" href="#/home">← ホーム</a>
    <div class="topbar-title">
      <span class="badge badge-accent">${escapeHtml(lessonLabel(lesson))}</span>
      <span>${escapeHtml(lesson.title)}</span>
    </div>
    <nav class="tabs" aria-label="パート">
      <a class="tab ${part === 'explain' ? 'is-active' : ''}${explainWarn ? ' has-warn' : ''}" href="#/lesson/${lesson.id}/explain"${explainWarn ? ' title="課題の途中で見ると宝箱が1つ減ります"' : ''}>解説${explainWarn ? '<span class="tab-warn" aria-label="見ると宝箱が減ります">!</span>' : ''}</a>
      <a class="tab ${part === 'task' ? 'is-active' : ''}" href="#/lesson/${lesson.id}/task">課題</a>
    </nav>
    <div class="topbar-spacer"></div>`;
  h.appendChild(themeButton());
  return h;
}

/** シンプルなヘッダー（タイトル＋戻る） */
export function simpleHeader(title, { back = '#/home', backLabel = '← ホーム' } = {}) {
  const h = document.createElement('header');
  h.className = 'topbar';
  h.innerHTML = `
    ${back ? `<a class="btn btn-sm" href="${back}">${escapeHtml(backLabel)}</a>` : ''}
    <div class="topbar-title">${escapeHtml(title)}</div>
    <div class="topbar-spacer"></div>`;
  h.appendChild(themeButton());
  return h;
}
