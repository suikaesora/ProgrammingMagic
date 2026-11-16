// エピローグ：最終課題をクリアしたあと、導入部と同じように物語を一文字ずつ表示 → 認定へ
import { epilogue } from '../../content/story.js';
import { config } from '../../content/config.js';
import { allCleared } from '../core/progress.js';
import { go } from '../router.js';

export function mount(root) {
  if (!allCleared()) {
    go('#/home');
    return;
  }
  root.innerHTML = `
    <div class="intro">
      <div class="intro-story" aria-live="polite"><span class="intro-text"></span><span class="intro-caret">▍</span></div>
      <div class="intro-choose epilogue-next hidden">
        <a class="btn btn-primary btn-lg" href="#/cert">📜 認定証を受け取る</a>
      </div>
      <button type="button" class="btn btn-sm epilogue-skip">とばす ▶▶</button>
    </div>`;
  const textEl = root.querySelector('.intro-text');
  const caret = root.querySelector('.intro-caret');
  const next = root.querySelector('.epilogue-next');
  const skip = root.querySelector('.epilogue-skip');
  const chars = Array.from(epilogue);
  let i = 0;
  let timer = null;

  function showNext() {
    caret.classList.add('is-done');
    skip.classList.add('hidden');
    next.classList.remove('hidden');
  }

  function typeNext() {
    if (i >= chars.length) {
      timer = setTimeout(showNext, 900);
      return;
    }
    const ch = chars[i++];
    textEl.textContent += ch;
    const pause = /[。、！？」]/.test(ch) ? config.introPunctPause : ch === '\n' ? config.introPunctPause / 2 : config.introTypeSpeed;
    timer = setTimeout(typeNext, pause);
  }
  timer = setTimeout(typeNext, 800);

  // 2回目以降に見る人のために、とばせるようにする
  skip.addEventListener('click', () => {
    clearTimeout(timer);
    textEl.textContent = epilogue;
    i = chars.length;
    showNext();
  });

  return () => clearTimeout(timer);
}
