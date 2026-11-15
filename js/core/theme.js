// ライト/ダークの切り替え
import { store } from './storage.js';

function systemTheme() {
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function currentTheme() {
  return store.get().theme || systemTheme();
}

export function applyTheme() {
  document.documentElement.dataset.theme = currentTheme();
}

export function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  store.update((s) => { s.theme = next; });
  applyTheme();
}

/** ヘッダー等に置くテーマ切替ボタン */
export function themeButton() {
  const b = document.createElement('button');
  b.className = 'btn btn-icon btn-sm theme-toggle';
  const render = () => {
    const dark = currentTheme() === 'dark';
    b.textContent = dark ? '☾' : '☀';
    b.title = dark ? 'ライトモードにする' : 'ダークモードにする';
    b.setAttribute('aria-label', b.title);
  };
  b.addEventListener('click', () => { toggleTheme(); render(); });
  render();
  return b;
}
