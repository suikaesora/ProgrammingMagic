// 装飾部：コレクションのアイテムをキャラクターのまわりに飾る
//  移動（ドラッグ）・回転（上のハンドル）・拡縮（右下のハンドル）・削除・前後の入れ替え
import { config } from '../../content/config.js';
import { items, getItem } from '../../content/items.js';
import { store } from '../core/storage.js';
import { escapeHtml } from '../core/format.js';
import { simpleHeader } from '../ui/header.js';
import { confirmModal } from '../ui/modal.js';

const STAGE_W = 800;
const STAGE_H = 600;
const ITEM_SIZE = 110;
const CHAR = '__char';

let uidSeq = 0;
const newUid = () => `d${Date.now().toString(36)}${(uidSeq++).toString(36)}`;

export function mount(root) {
  const avatar = config.avatars.find((a) => a.id === store.get().avatar) || config.avatars[0];
  const deco = structuredClone(store.get().deco || { placed: [] });
  deco.placed = deco.placed || [];
  deco.charIndex = Math.min(deco.charIndex ?? 0, deco.placed.length);
  let selected = null;

  root.appendChild(simpleHeader('装飾部屋'));
  const main = document.createElement('main');
  main.className = 'deco';
  main.innerHTML = `
    <div class="deco-toolbar card">
      <button type="button" class="btn btn-sm" data-act="forward" title="1つ前へ">⬆ 前へ</button>
      <button type="button" class="btn btn-sm" data-act="backward" title="1つ後ろへ">⬇ 後ろへ</button>
      <button type="button" class="btn btn-sm" data-act="dup" title="複製">⧉ 複製</button>
      <button type="button" class="btn btn-sm btn-danger" data-act="delete" title="削除（Delete キー）">✕ 削除</button>
      <span class="deco-sep"></span>
      <button type="button" class="btn btn-sm" data-act="clear-all">ぜんぶ外す</button>
      <button type="button" class="btn btn-sm btn-primary" data-act="photo">📸 撮影モード</button>
      <span class="deco-help muted">ドラッグで移動・上の丸で回転・右下の角で拡大縮小</span>
    </div>
    <div class="deco-body">
      <div class="deco-stage-wrap">
        <div class="deco-stage" style="width:${STAGE_W}px;height:${STAGE_H}px">
          <div class="deco-floor"></div>
          <div class="deco-layer"></div>
        </div>
      </div>
      <aside class="deco-drawer card">
        <div class="pane-head">コレクション <span class="deco-count muted"></span></div>
        <div class="deco-grid"></div>
        <p class="muted deco-drawer-note">アイテムをクリックすると部屋に置けます。修行をクリアすると増えるよ。</p>
      </aside>
    </div>
    <button type="button" class="btn btn-sm deco-photo-exit">✕ 撮影モードを終わる（Esc）</button>`;
  root.appendChild(main);

  const stage = main.querySelector('.deco-stage');
  const wrap = main.querySelector('.deco-stage-wrap');
  const layer = main.querySelector('.deco-layer');
  const grid = main.querySelector('.deco-grid');
  let scale = 1;

  // ---- 保存 ----
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.update((s) => { s.deco = structuredClone(deco); }), 150);
  }

  // ---- 重なり順（キャラクターも1つの層として扱う） ----
  function combined() {
    const list = deco.placed.map((p) => p.uid);
    list.splice(deco.charIndex, 0, CHAR);
    return list;
  }
  function applyCombined(list) {
    const byUid = new Map(deco.placed.map((p) => [p.uid, p]));
    deco.charIndex = list.indexOf(CHAR);
    deco.placed = list.filter((u) => u !== CHAR).map((u) => byUid.get(u));
  }

  // ---- 描画 ----
  function fit() {
    const r = wrap.getBoundingClientRect();
    scale = Math.min(r.width / STAGE_W, r.height / STAGE_H) || 1;
    stage.style.transform = `scale(${scale})`;
    stage.style.left = `${(r.width - STAGE_W * scale) / 2}px`;
    stage.style.top = `${(r.height - STAGE_H * scale) / 2}px`;
  }

  function itemTransform(p) {
    return `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${p.rot}deg) scale(${p.scale})`;
  }

  function render() {
    layer.innerHTML = '';
    combined().forEach((uid, z) => {
      if (uid === CHAR) {
        const c = document.createElement('img');
        c.className = 'deco-char';
        c.src = avatar.image;
        c.alt = 'あなたのキャラクター';
        c.draggable = false;
        c.style.zIndex = String(z + 1);
        layer.appendChild(c);
        return;
      }
      const p = deco.placed.find((q) => q.uid === uid);
      const it = getItem(p.item);
      if (!it) return;
      const el = document.createElement('div');
      el.className = `deco-item${selected === uid ? ' is-selected' : ''}`;
      el.dataset.uid = uid;
      el.style.width = `${ITEM_SIZE}px`;
      el.style.height = `${ITEM_SIZE}px`;
      el.style.zIndex = String(z + 1);
      el.style.transform = itemTransform(p);
      el.style.setProperty('--inv', String(1 / p.scale));
      el.innerHTML = `
        <img src="${it.image}" alt="${escapeHtml(it.name)}" draggable="false">
        <span class="deco-h deco-h-rot" data-h="rot" title="回転"></span>
        <span class="deco-h deco-h-scale" data-h="scale" title="拡大縮小"></span>
        <span class="deco-h deco-h-del" data-h="del" title="削除">✕</span>`;
      layer.appendChild(el);
    });
    updateToolbar();
  }

  function updateEl(p) {
    const el = layer.querySelector(`[data-uid="${p.uid}"]`);
    if (!el) return;
    el.style.transform = itemTransform(p);
    el.style.setProperty('--inv', String(1 / p.scale));
  }

  function renderDrawer() {
    const owned = store.get().collection;
    const n = items.filter((it) => owned[it.id]).length;
    main.querySelector('.deco-count').textContent = `${n} / ${items.length}`;
    grid.innerHTML = items.map((it) => {
      const has = !!owned[it.id];
      return `
        <button type="button" class="deco-cell ${has ? '' : 'is-locked'}" data-item="${it.id}" ${has ? '' : 'disabled'}
          title="${has ? escapeHtml(`${it.name}：${it.description || ''}`) : 'まだ持っていない'}">
          <img src="${it.image}" alt="" draggable="false">
          <span>${has ? escapeHtml(it.name) : '？？？'}</span>
        </button>`;
    }).join('');
  }

  function updateToolbar() {
    main.querySelectorAll('[data-act="forward"],[data-act="backward"],[data-act="delete"],[data-act="dup"]').forEach((b) => { b.disabled = !selected; });
  }

  function select(uid) {
    selected = uid;
    layer.querySelectorAll('.deco-item').forEach((el) => el.classList.toggle('is-selected', el.dataset.uid === uid));
    updateToolbar();
  }

  function add(itemId, at) {
    const p = {
      uid: newUid(),
      item: itemId,
      x: at ? at.x : STAGE_W / 2 + (Math.random() - 0.5) * 200,
      y: at ? at.y : STAGE_H / 2 + (Math.random() - 0.5) * 120,
      rot: 0,
      scale: 1,
    };
    deco.placed.push(p);
    selected = p.uid;
    render();
    save();
  }

  function remove(uid) {
    const i = deco.placed.findIndex((p) => p.uid === uid);
    if (i < 0) return;
    if (i < deco.charIndex) deco.charIndex--;
    deco.placed.splice(i, 1);
    if (selected === uid) selected = null;
    render();
    save();
  }

  function moveZ(uid, dir) {
    const list = combined();
    const i = list.indexOf(uid);
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    applyCombined(list);
    render();
    save();
  }

  // ---- ポインター操作 ----
  const toStage = (e) => {
    const r = stage.getBoundingClientRect();
    return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale };
  };
  let drag = null;

  layer.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.deco-item');
    if (!el) { select(null); return; }
    const p = deco.placed.find((q) => q.uid === el.dataset.uid);
    const h = e.target.dataset.h;
    if (h === 'del') { remove(p.uid); return; }
    e.preventDefault();
    select(p.uid);
    const pt = toStage(e);
    if (h === 'rot') {
      drag = { p, mode: 'rot', a0: Math.atan2(pt.y - p.y, pt.x - p.x) * 180 / Math.PI - p.rot };
    } else if (h === 'scale') {
      drag = { p, mode: 'scale', d0: Math.hypot(pt.x - p.x, pt.y - p.y) || 1, s0: p.scale };
    } else {
      drag = { p, mode: 'move', dx: pt.x - p.x, dy: pt.y - p.y };
    }
    el.setPointerCapture(e.pointerId);
  });
  layer.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const pt = toStage(e);
    const { p } = drag;
    if (drag.mode === 'move') {
      p.x = Math.min(STAGE_W, Math.max(0, pt.x - drag.dx));
      p.y = Math.min(STAGE_H, Math.max(0, pt.y - drag.dy));
    } else if (drag.mode === 'rot') {
      let r = Math.atan2(pt.y - p.y, pt.x - p.x) * 180 / Math.PI - drag.a0;
      if (e.shiftKey) r = Math.round(r / 15) * 15;
      p.rot = Math.round(r);
    } else {
      const d = Math.hypot(pt.x - p.x, pt.y - p.y);
      p.scale = Math.min(5, Math.max(0.2, Math.round((drag.s0 * d / drag.d0) * 100) / 100));
    }
    updateEl(p);
  });
  const endDrag = () => { if (drag) { drag = null; save(); } };
  layer.addEventListener('pointerup', endDrag);
  layer.addEventListener('pointercancel', endDrag);
  stage.addEventListener('pointerdown', (e) => { if (e.target === stage || e.target.classList.contains('deco-floor')) select(null); });

  // ホイールで拡大縮小（選択中）
  stage.addEventListener('wheel', (e) => {
    const p = deco.placed.find((q) => q.uid === selected);
    if (!p) return;
    e.preventDefault();
    p.scale = Math.min(5, Math.max(0.2, Math.round(p.scale * (e.deltaY < 0 ? 1.08 : 0.92) * 100) / 100));
    updateEl(p);
    save();
  }, { passive: false });

  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.deco-cell');
    if (b && !b.disabled) add(b.dataset.item);
  });

  // ---- ツールバー ----
  main.querySelector('.deco-toolbar').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    const act = b.dataset.act;
    if (act === 'forward' && selected) moveZ(selected, +1);
    if (act === 'backward' && selected) moveZ(selected, -1);
    if (act === 'delete' && selected) remove(selected);
    if (act === 'dup' && selected) {
      const p = deco.placed.find((q) => q.uid === selected);
      deco.placed.push({ ...p, uid: newUid(), x: p.x + 24, y: p.y + 24 });
      selected = deco.placed[deco.placed.length - 1].uid;
      render();
      save();
    }
    if (act === 'clear-all' && deco.placed.length) {
      if (await confirmModal('飾ったアイテムをぜんぶ外しますか？', { ok: '外す', danger: true })) {
        deco.placed = [];
        deco.charIndex = 0;
        selected = null;
        render();
        save();
      }
    }
    if (act === 'photo') setPhoto(true);
  });

  function setPhoto(on) {
    root.classList.toggle('is-photo', on);
    if (on) select(null);
    requestAnimationFrame(fit);
  }
  main.querySelector('.deco-photo-exit').addEventListener('click', () => setPhoto(false));

  const onKey = (e) => {
    if (e.key === 'Escape') setPhoto(false);
    if (!selected || e.target.closest('input, textarea')) return;
    const p = deco.placed.find((q) => q.uid === selected);
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); remove(selected); return; }
    const step = e.shiftKey ? 10 : 2;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key] && p) {
      e.preventDefault();
      p.x += moves[e.key][0];
      p.y += moves[e.key][1];
      updateEl(p);
      save();
    }
  };
  document.addEventListener('keydown', onKey);

  const ro = new ResizeObserver(fit);
  ro.observe(wrap);

  renderDrawer();
  render();
  fit();

  return () => {
    document.removeEventListener('keydown', onKey);
    ro.disconnect();
    clearTimeout(saveTimer);
    store.update((s) => { s.deco = structuredClone(deco); });
  };
}
