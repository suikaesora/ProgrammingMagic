// 練習部の手順オーバーレイ（対象を光らせ、師匠の吹き出しで説明する）
import { bus } from '../core/bus.js';
import { config } from '../../content/config.js';
import { isCleared } from '../core/progress.js';

let session = null; // { lessonId, index } 画面をまたいで進行を覚えておく

/**
 * @param {{ lesson: object, scene: 'explain'|'task' }} p
 * @returns {() => void} 片付け関数
 */
export function mountTutorial({ lesson, scene }) {
  const steps = lesson.tutorial;
  if (!steps || !steps.length) return () => {};
  const first = steps.findIndex((s) => s.scene === scene);
  if (first < 0) return () => {};
  if (!session || session.lessonId !== lesson.id || steps[session.index]?.scene !== scene) {
    session = { lessonId: lesson.id, index: first };
  }

  const root = document.createElement('div');
  root.className = 'tut-root';
  root.innerHTML = `
    <div class="tut-block"></div><div class="tut-block"></div><div class="tut-block"></div><div class="tut-block"></div>
    <div class="tut-ring"></div>
    <div class="tut-bubble card" role="dialog" aria-live="polite">
      <img class="tut-master" src="${config.master.image}" alt="">
      <div class="tut-body">
        <div class="tut-text"></div>
        <div class="tut-actions">
          <span class="tut-progress muted"></span>
          <button type="button" class="btn btn-sm tut-skip hidden">練習をとばす</button>
          <button type="button" class="btn btn-primary btn-sm tut-next">次へ ▶</button>
          <span class="tut-hint muted hidden">やってみよう！</span>
        </div>
      </div>
    </div>`;
  document.body.appendChild(root);
  const blocks = [...root.querySelectorAll('.tut-block')];
  const ring = root.querySelector('.tut-ring');
  const bubble = root.querySelector('.tut-bubble');
  const textEl = root.querySelector('.tut-text');
  const nextBtn = root.querySelector('.tut-next');
  const hint = root.querySelector('.tut-hint');
  const skipBtn = root.querySelector('.tut-skip');
  const progress = root.querySelector('.tut-progress');
  skipBtn.classList.toggle('hidden', !isCleared(lesson.id));

  let offEvent = null;
  let alive = true;

  const step = () => steps[session.index];
  const targetEl = () => (step().target ? document.querySelector(`[data-tut="${step().target}"]`) : null);

  function finish() {
    alive = false;
    if (offEvent) offEvent();
    clearInterval(timer);
    window.removeEventListener('resize', position);
    root.remove();
  }

  function advance() {
    if (offEvent) { offEvent(); offEvent = null; }
    session.index++;
    if (session.index >= steps.length) {
      session = null;
      finish();
      return;
    }
    if (steps[session.index].scene !== scene) {
      finish(); // 次の画面で続きを表示
      return;
    }
    render();
  }

  function render() {
    const s = step();
    textEl.textContent = s.text;
    const byNext = s.advance === 'next' || !s.advance;
    nextBtn.classList.toggle('hidden', !byNext);
    hint.classList.toggle('hidden', byNext);
    progress.textContent = `${session.index + 1} / ${steps.length}`;
    if (!byNext && s.advance.startsWith('event:')) {
      offEvent = bus.on(s.advance.slice(6), () => advance());
    }
    bubble.classList.remove('is-new');
    void bubble.offsetWidth;
    bubble.classList.add('is-new');
    position();
  }

  function position() {
    if (!alive) return;
    const s = step();
    const el = targetEl();
    const block = s.block !== false;
    const vw = innerWidth;
    const vh = innerHeight;
    if (!el) {
      ring.style.display = 'none';
      blocks.forEach((b, i) => {
        b.style.display = block && i === 0 ? 'block' : 'none';
        Object.assign(b.style, { left: '0px', top: '0px', width: `${vw}px`, height: `${vh}px` });
      });
      bubble.style.left = `${Math.max(16, (vw - bubble.offsetWidth) / 2)}px`;
      bubble.style.top = `${Math.max(16, (vh - bubble.offsetHeight) / 2)}px`;
      return;
    }
    const pad = 6;
    const r = el.getBoundingClientRect();
    const x1 = Math.max(0, r.left - pad);
    const y1 = Math.max(0, r.top - pad);
    const x2 = Math.min(vw, r.right + pad);
    const y2 = Math.min(vh, r.bottom + pad);
    ring.style.display = 'block';
    Object.assign(ring.style, { left: `${x1}px`, top: `${y1}px`, width: `${x2 - x1}px`, height: `${y2 - y1}px` });
    const rects = [
      [0, 0, vw, y1],          // 上
      [0, y2, vw, vh - y2],    // 下
      [0, y1, x1, y2 - y1],    // 左
      [x2, y1, vw - x2, y2 - y1], // 右
    ];
    blocks.forEach((b, i) => {
      b.style.display = block ? 'block' : 'none';
      const [l, t, w, h] = rects[i];
      Object.assign(b.style, { left: `${l}px`, top: `${t}px`, width: `${Math.max(0, w)}px`, height: `${Math.max(0, h)}px` });
    });
    // 吹き出しの位置：下 → 上 → 右 → 左 の順で空いている所
    const bw = bubble.offsetWidth;
    const bh = bubble.offsetHeight;
    const gap = 14;
    let left;
    let top;
    if (vh - y2 >= bh + gap) { top = y2 + gap; left = r.left; }
    else if (y1 >= bh + gap) { top = y1 - bh - gap; left = r.left; }
    else if (vw - x2 >= bw + gap) { left = x2 + gap; top = r.top; }
    else if (x1 >= bw + gap) { left = x1 - bw - gap; top = r.top; }
    else { left = vw - bw - 16; top = vh - bh - 16; }
    bubble.style.left = `${Math.min(Math.max(12, left), vw - bw - 12)}px`;
    bubble.style.top = `${Math.min(Math.max(12, top), vh - bh - 12)}px`;
  }

  nextBtn.addEventListener('click', advance);
  skipBtn.addEventListener('click', () => { session = null; finish(); });
  blocks.forEach((b) => b.addEventListener('click', () => {
    bubble.classList.remove('is-shake');
    void bubble.offsetWidth;
    bubble.classList.add('is-shake');
  }));
  window.addEventListener('resize', position);
  const timer = setInterval(position, 200);

  render();
  return finish;
}
