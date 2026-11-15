// ホーム（修行選択画面）：すごろく風の道に修行が並ぶ
import { config } from '../../content/config.js';
import { store } from '../core/storage.js';
import { getLessons, isCleared, isUnlocked, allCleared, currentLesson, lessonLabel, clearedCount } from '../core/progress.js';
import { themeButton } from '../core/theme.js';
import { escapeHtml } from '../core/format.js';
import { confirmModal } from '../ui/modal.js';
import { go } from '../router.js';

const NODE_GAP = 190;
const PAD_X = 110;
const ROW_Y = [90, 230];

function stars(n) {
  let s = '';
  for (let i = 1; i <= 5; i++) s += i <= n ? '★' : '<span class="off">★</span>';
  return `<span class="stars">${s}</span>`;
}

export function mount(root) {
  const lessons = getLessons();
  const avatar = config.avatars.find((a) => a.id === store.get().avatar) || config.avatars[0];
  const cur = currentLesson();
  const done = allCleared();

  const pos = lessons.map((_, i) => ({ x: PAD_X + i * NODE_GAP, y: ROW_Y[i % 2] }));
  const mapW = PAD_X * 2 + (lessons.length - 1) * NODE_GAP;
  const mapH = 340;

  // 道（クリア済みの区間は実線）
  let paths = '';
  for (let i = 0; i < lessons.length - 1; i++) {
    const a = pos[i];
    const b = pos[i + 1];
    const mx = (a.x + b.x) / 2;
    const solid = isCleared(lessons[i].id);
    paths += `<path d="M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}" class="map-road ${solid ? 'is-done' : ''}"/>`;
  }

  root.innerHTML = `
    <header class="topbar home-top">
      <div class="home-brand">
        <span class="home-logo">${escapeHtml(config.appTitle)}</span>
        <span class="muted home-sub">${escapeHtml(config.appSubtitle)}</span>
      </div>
      <div class="topbar-spacer"></div>
      <span class="badge">クリア ${clearedCount()} / ${lessons.length}</span>
      <a class="btn btn-sm" href="#/deco">🎀 装飾部屋</a>
      ${done ? '<a class="btn btn-sm btn-primary" href="#/cert">📜 認定証</a>' : ''}
      <button type="button" class="btn btn-sm btn-ghost home-reset" title="進捗を消す">リセット</button>
    </header>
    <main class="home">
      <h1 class="home-heading">修行をえらぼう</h1>
      <div class="map-scroll">
        <div class="map" style="width:${mapW}px;height:${mapH}px">
          <svg class="map-svg" width="${mapW}" height="${mapH}" aria-hidden="true">${paths}</svg>
          ${lessons.map((l, i) => {
            const cleared = isCleared(l.id);
            const open = isUnlocked(l.id);
            const state = cleared ? 'is-cleared' : open ? 'is-open' : 'is-locked';
            return `
            <button type="button" class="map-node ${state} ${l.id === cur.id ? 'is-current' : ''}" data-id="${l.id}"
              style="left:${pos[i].x}px;top:${pos[i].y}px" ${open ? '' : 'aria-disabled="true"'}
              aria-label="${escapeHtml(lessonLabel(l))} ${escapeHtml(l.title)} ${cleared ? 'クリア済み' : open ? '挑戦できる' : 'まだ挑戦できない'}">
              <span class="map-node-num">${l.label ? escapeHtml(l.label) : i}</span>
              <span class="map-node-flag">${cleared ? '✓' : open ? '' : '🔒'}</span>
            </button>
            <div class="map-label ${state}" style="left:${pos[i].x}px;top:${pos[i].y + 46}px">
              <div class="map-label-title">${escapeHtml(l.title)}</div>
              ${stars(l.difficulty || 1)}
            </div>`;
          }).join('')}
          <img class="map-avatar" src="${avatar.image}" alt="あなた"
            style="left:${pos[lessons.indexOf(cur)].x}px;top:${pos[lessons.indexOf(cur)].y - 62}px">
        </div>
      </div>
      <section class="home-detail card" aria-live="polite"></section>
    </main>`;
  root.querySelector('.home-top').appendChild(themeButton());

  const detail = root.querySelector('.home-detail');
  function showDetail(l) {
    const i = lessons.indexOf(l);
    const cleared = isCleared(l.id);
    const open = isUnlocked(l.id);
    const p = store.get().progress[l.id];
    root.querySelectorAll('.map-node').forEach((n) => n.classList.toggle('is-selected', n.dataset.id === l.id));
    detail.innerHTML = `
      <div class="home-detail-head">
        <span class="badge badge-accent">${escapeHtml(lessonLabel(l))}</span>
        <h2>${escapeHtml(l.title)}</h2>
        ${stars(l.difficulty || 1)}
        ${cleared ? '<span class="badge badge-success">クリア済み</span>' : open ? '<span class="badge">未クリア</span>' : '<span class="badge">🔒 まだ挑戦できない</span>'}
      </div>
      <p>${escapeHtml(l.summary || '')}</p>
      ${cleared && p ? `<p class="muted">最高記録：解放率 ${Math.round((p.bestRate ?? 0) * 100)}%</p>` : ''}
      ${open ? `
        <div class="home-detail-actions">
          <a class="btn btn-primary" href="#/lesson/${l.id}/explain">解説からはじめる</a>
          <a class="btn" href="#/lesson/${l.id}/task">課題へ</a>
        </div>` : `<p class="muted">ひとつ前の修行（${escapeHtml(lessonLabel(lessons[i - 1]))}）をクリアすると挑戦できます。</p>`}`;
  }

  root.querySelectorAll('.map-node').forEach((n) => {
    n.addEventListener('click', () => showDetail(lessons.find((l) => l.id === n.dataset.id)));
    n.addEventListener('dblclick', () => { if (isUnlocked(n.dataset.id)) go(`#/lesson/${n.dataset.id}/explain`); });
  });
  showDetail(cur);

  // 現在地が見えるようにスクロール
  const scroller = root.querySelector('.map-scroll');
  requestAnimationFrame(() => {
    scroller.scrollLeft = Math.max(0, pos[lessons.indexOf(cur)].x - scroller.clientWidth / 2);
  });

  root.querySelector('.home-reset').addEventListener('click', async () => {
    const ok = await confirmModal('すべての進捗・コレクション・装飾を消して最初からやり直しますか？\nこの操作は元に戻せません。', { ok: '消す', danger: true });
    if (ok) {
      store.reset();
      go('#/intro');
    }
  });
}
