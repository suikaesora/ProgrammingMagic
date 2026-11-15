// 師匠エリア（画像＋台詞）
import { config } from '../../content/config.js';
import { escapeHtml } from '../core/format.js';

export function createMaster(host, lines = []) {
  host.innerHTML = `
    <div class="master">
      <img class="master-img" src="${config.master.image}" alt="${escapeHtml(config.master.name)}">
      <div class="master-bubble" role="status" aria-live="polite">
        <div class="master-name">${escapeHtml(config.master.name)}</div>
        <p class="master-text"></p>
        <button type="button" class="master-next btn btn-sm hidden" aria-label="次の台詞">つぎ ▶</button>
      </div>
    </div>`;
  const textEl = host.querySelector('.master-text');
  const nextBtn = host.querySelector('.master-next');
  const img = host.querySelector('.master-img');
  let queue = [];
  let idx = 0;

  function show(text) {
    textEl.innerHTML = text;
    textEl.classList.remove('is-new');
    void textEl.offsetWidth;
    textEl.classList.add('is-new');
    img.classList.remove('is-talk');
    void img.offsetWidth;
    img.classList.add('is-talk');
  }

  function renderQueue() {
    show(queue[idx] ?? '');
    nextBtn.classList.toggle('hidden', idx >= queue.length - 1);
  }

  nextBtn.addEventListener('click', () => {
    if (idx < queue.length - 1) { idx++; renderQueue(); }
  });

  const api = {
    /** 台詞の並びを設定（「つぎ」で進む） */
    setLines(ls) { queue = ls.length ? ls : ['']; idx = 0; renderQueue(); },
    /** すぐに1つの台詞を言わせる（HTML 可） */
    say(text) { queue = [text]; idx = 0; renderQueue(); },
  };
  api.setLines(lines);
  return api;
}
