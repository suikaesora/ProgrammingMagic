// クリア画面：お祝い・解放率・宝箱（クリックで開く）・次へ
import { session } from '../core/session.js';
import { nextLesson, lessonLabel, allCleared } from '../core/progress.js';
import { store } from '../core/storage.js';
import { getItem } from '../../content/items.js';
import { escapeHtml } from '../core/format.js';
import { confetti } from '../ui/confetti.js';
import { go } from '../router.js';

const CHEST_SVG = `
<svg viewBox="0 0 120 100" class="chest-svg" aria-hidden="true">
  <g class="chest-lid">
    <path d="M12 44 Q12 14 60 14 Q108 14 108 44 Z" fill="var(--c-accent)" stroke="var(--c-line)" stroke-width="4" stroke-linejoin="round"/>
    <rect x="52" y="14" width="16" height="30" fill="#f2c94c" stroke="var(--c-line)" stroke-width="4"/>
  </g>
  <rect x="12" y="44" width="96" height="48" rx="6" fill="var(--c-accent)" stroke="var(--c-line)" stroke-width="4"/>
  <rect x="52" y="44" width="16" height="48" fill="#f2c94c" stroke="var(--c-line)" stroke-width="4"/>
  <rect x="54" y="52" width="12" height="14" rx="3" fill="var(--c-surface)" stroke="var(--c-line)" stroke-width="3"/>
</svg>`;

export function mount(root, { lesson }) {
  const info = session.lastClear;
  if (!info || info.lessonId !== lesson.id) {
    go('#/home');
    return;
  }
  const next = nextLesson(lesson.id);
  const goCert = allCleared() && (info.justCompletedAll || !store.get().certSeen);
  const pct = Math.round(info.rate * 100);

  root.innerHTML = `
    <main class="clear">
      <div class="clear-card card">
        <div class="clear-label">${escapeHtml(lessonLabel(lesson))}</div>
        <h1 class="clear-title">修行達成！</h1>
        <p class="clear-sub">「${escapeHtml(lesson.title)}」をクリアしました。</p>
        <div class="clear-rate">
          <span>コード解放率</span>
          <strong>${pct}%</strong>
          <span class="clear-rate-bar"><span style="width:${pct}%"></span></span>
        </div>
        <p class="clear-chest-note">${info.firstClear
          ? `宝箱が <strong>${info.chestItems.length}個</strong> 出てきた！ クリックして開けよう。`
          : '宝箱の中身は、はじめてクリアしたときに受け取りずみです。'}</p>
        <div class="chests">
          ${info.chestItems.map((id, i) => `
            <button type="button" class="chest" data-item="${id}" style="animation-delay:${0.2 + i * 0.15}s" aria-label="宝箱${i + 1}を開ける">
              ${CHEST_SVG}
              <span class="chest-item"></span>
            </button>`).join('')}
        </div>
        <div class="clear-actions">
          <a class="btn" href="#/home">修行選択へ</a>
          ${goCert
            ? '<a class="btn btn-primary btn-lg" href="#/cert">📜 認定へすすむ</a>'
            : next ? `<a class="btn btn-primary btn-lg" href="#/lesson/${next.id}/explain">次の修行へ →</a>` : ''}
        </div>
      </div>
    </main>`;

  const stopConfetti = confetti({ count: 120, duration: 3500 });

  root.querySelectorAll('.chest').forEach((c) => {
    c.addEventListener('click', () => {
      if (c.classList.contains('is-open')) return;
      const item = getItem(c.dataset.item);
      c.classList.add('is-open');
      const box = c.querySelector('.chest-item');
      box.innerHTML = item
        ? `<img src="${item.image}" alt=""><span class="chest-item-name">${escapeHtml(item.name)}</span>
           <span class="chest-item-note">${info.firstClear ? 'コレクションに追加！' : '入手ずみ'}</span>`
        : '<span class="chest-item-name">？</span>';
      const r = c.getBoundingClientRect();
      confetti({ count: 40, duration: 1800, origin: { x: r.left + r.width / 2, y: r.top + r.height / 3 } });
    });
  });

  return () => stopConfetti();
}
