// 導入部：黒い画面に物語を一文字ずつ表示 → 見た目を選ぶ（最初の一回のみ・スキップ不可）
import { story, avatarPrompt } from '../../content/story.js';
import { config } from '../../content/config.js';
import { store } from '../core/storage.js';
import { getLessons } from '../core/progress.js';
import { escapeHtml } from '../core/format.js';
import { go } from '../router.js';

export function mount(root) {
  root.innerHTML = `
    <div class="intro">
      <div class="intro-story" aria-live="polite"><span class="intro-text"></span><span class="intro-caret">▍</span></div>
      <div class="intro-choose hidden">
        <h2 class="intro-q">${escapeHtml(avatarPrompt)}</h2>
        <div class="intro-avatars" role="radiogroup">
          ${config.avatars.map((a) => `
            <button type="button" class="intro-avatar" role="radio" aria-checked="false" data-id="${a.id}">
              <img src="${a.image}" alt="">
              <span>${escapeHtml(a.label)}</span>
            </button>`).join('')}
        </div>
        <button type="button" class="btn btn-primary btn-lg intro-go" disabled>この姿で修行をはじめる</button>
      </div>
    </div>`;
  const textEl = root.querySelector('.intro-text');
  const caret = root.querySelector('.intro-caret');
  const choose = root.querySelector('.intro-choose');
  const goBtn = root.querySelector('.intro-go');
  let selected = null;
  let timer = null;
  let i = 0;

  const chars = Array.from(story); // サロゲートペアも1文字として扱う
  function typeNext() {
    if (i >= chars.length) {
      caret.classList.add('is-done');
      timer = setTimeout(() => {
        choose.classList.remove('hidden');
        root.querySelector('.intro').classList.add('is-choosing');
      }, 900);
      return;
    }
    const ch = chars[i++];
    textEl.textContent += ch;
    const pause = /[。、！？」]/.test(ch) ? config.introPunctPause : ch === '\n' ? config.introPunctPause / 2 : config.introTypeSpeed;
    timer = setTimeout(typeNext, pause);
  }
  timer = setTimeout(typeNext, 800);

  root.querySelectorAll('.intro-avatar').forEach((b) => {
    b.addEventListener('click', () => {
      selected = b.dataset.id;
      root.querySelectorAll('.intro-avatar').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      goBtn.disabled = false;
    });
  });

  goBtn.addEventListener('click', () => {
    if (!selected) return;
    store.update((s) => { s.introSeen = true; s.avatar = selected; });
    go(`#/lesson/${getLessons()[0].id}/explain`);
  });

  return () => clearTimeout(timer);
}
