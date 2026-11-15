// 学習者が使える描画・ゲーム用の命令。
// ここで api に加えたものは、すべての修行のコードからそのまま呼べる。
// 描画命令は drawCalls に記録され、クリア判定（check）で使える。

import { formatValue } from '../core/format.js';

const DEFAULTS = { fill: '#f08a5d', stroke: '#3b342c', lineWidth: 2 };
const MAX_RECORDS = 20000;
const MAX_LOGS = 1000;

export function createRuntime(canvas, { onPrint = () => {}, onAsyncError = () => {} } = {}) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const st = { fill: DEFAULTS.fill, stroke: DEFAULTS.stroke, lineWidth: DEFAULTS.lineWidth, useFill: true, useStroke: true };
  const drawCalls = [];
  const logs = [];
  const keys = new Set();
  const mouse = { x: 0, y: 0, down: false };
  const timers = new Set();
  let frameFn = null;
  let destroyed = false;

  const record = (type, args) => {
    if (drawCalls.length < MAX_RECORDS) {
      drawCalls.push({ type, args, fill: st.useFill ? st.fill : null, stroke: st.useStroke ? st.stroke : null });
    }
  };
  const num = (v, name) => {
    if (typeof v !== 'number' || Number.isNaN(v)) throw new TypeError(`${name} には数を入れてください（今は ${formatValue(v, 1)}）`);
    return v;
  };
  const paint = () => {
    if (st.useFill) { ctx.fillStyle = st.fill; ctx.fill(); }
    if (st.useStroke) { ctx.strokeStyle = st.stroke; ctx.lineWidth = st.lineWidth; ctx.stroke(); }
  };
  const wrapTimer = (cb) => () => {
    if (destroyed) return;
    try { cb(); } catch (e) { onAsyncError(e); }
  };

  // ---- 入力 ----
  const toCanvas = (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = Math.round(((e.clientX - r.left) / r.width) * W);
    mouse.y = Math.round(((e.clientY - r.top) / r.height) * H);
  };
  const GAME_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ']);
  const listeners = {
    keydown: (e) => { keys.add(e.key); if (GAME_KEYS.has(e.key)) e.preventDefault(); },
    keyup: (e) => { keys.delete(e.key); },
    blur: () => { keys.clear(); mouse.down = false; },
    pointermove: toCanvas,
    pointerdown: (e) => { toCanvas(e); mouse.down = true; canvas.focus(); },
    pointerup: () => { mouse.down = false; },
    pointerleave: () => { mouse.down = false; },
  };
  for (const [ev, fn] of Object.entries(listeners)) canvas.addEventListener(ev, fn);

  const api = {
    // 定数
    WIDTH: W,
    HEIGHT: H,
    ctx, // 上級者向け：Canvas 2D をそのまま使う

    // 出力
    print(...args) {
      if (logs.length >= MAX_LOGS) {
        if (logs.length === MAX_LOGS) { logs.push('…'); onPrint(`…（出力が${MAX_LOGS}行をこえたので、これ以降は表示しません）`); }
        return;
      }
      const s = args.map((a) => formatValue(a)).join(' ');
      logs.push(s);
      onPrint(s);
    },

    // 色・線
    fill(color) { st.fill = String(color); st.useFill = true; },
    noFill() { st.useFill = false; },
    stroke(color, width) { st.stroke = String(color); if (width != null) st.lineWidth = num(width, '線の太さ'); st.useStroke = true; },
    noStroke() { st.useStroke = false; },
    lineWidth(w) { st.lineWidth = num(w, '線の太さ'); },

    // 描画
    background(color = 'white') {
      ctx.save(); ctx.fillStyle = String(color); ctx.fillRect(0, 0, W, H); ctx.restore();
      record('background', [color]);
    },
    clear() { ctx.clearRect(0, 0, W, H); record('clear', []); },
    circle(x, y, r) {
      num(x, 'x'); num(y, 'y'); num(r, '半径');
      ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2); paint();
      record('circle', [x, y, r]);
    },
    ellipse(x, y, rx, ry) {
      num(x, 'x'); num(y, 'y'); num(rx, '横の半径'); num(ry, '縦の半径');
      ctx.beginPath(); ctx.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), 0, 0, Math.PI * 2); paint();
      record('ellipse', [x, y, rx, ry]);
    },
    rect(x, y, w, h) {
      num(x, 'x'); num(y, 'y'); num(w, '幅'); num(h, '高さ');
      ctx.beginPath(); ctx.rect(x, y, w, h); paint();
      record('rect', [x, y, w, h]);
    },
    line(x1, y1, x2, y2) {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = st.stroke; ctx.lineWidth = st.lineWidth; ctx.stroke();
      record('line', [x1, y1, x2, y2]);
    },
    text(str, x, y, size = 20) {
      ctx.font = `bold ${size}px "M PLUS Rounded 1c", sans-serif`;
      ctx.textBaseline = 'top';
      ctx.fillStyle = st.fill;
      ctx.fillText(String(str), x, y);
      record('text', [String(str), x, y, size]);
    },

    // 乱数
    random(min, max) {
      if (min === undefined) return Math.random();
      if (max === undefined) { max = min; min = 0; }
      return Math.random() * (max - min) + min;
    },
    randomInt(min, max) {
      if (max === undefined) { max = min; min = 0; }
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // アニメーション（毎フレーム呼ばれる関数を登録）
    onFrame(fn) {
      if (typeof fn !== 'function') throw new TypeError('onFrame には関数を渡してください');
      frameFn = fn;
    },

    // 入力
    keyIsDown(key) { return keys.has(key) || (typeof key === 'string' && keys.has(key.toLowerCase())); },
    mouseX() { return mouse.x; },
    mouseY() { return mouse.y; },
    mouseIsPressed() { return mouse.down; },

    // タイマー（停止ボタンで止まるように管理）
    setTimeout(cb, ms) { const id = window.setTimeout(wrapTimer(cb), ms); timers.add(['t', id]); return id; },
    setInterval(cb, ms) { const id = window.setInterval(wrapTimer(cb), ms); timers.add(['i', id]); return id; },
    clearTimeout(id) { window.clearTimeout(id); },
    clearInterval(id) { window.clearInterval(id); },
  };

  return {
    api,
    drawCalls,
    logs,
    get frameFn() { return frameFn; },
    /** 実行前の初期化：白で塗りつぶし、色設定を戻す */
    reset() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
    },
    destroy() {
      destroyed = true;
      for (const [kind, id] of timers) kind === 't' ? window.clearTimeout(id) : window.clearInterval(id);
      timers.clear();
      for (const [ev, fn] of Object.entries(listeners)) canvas.removeEventListener(ev, fn);
      frameFn = null;
    },
  };
}

/** ガイド表示用：学習者が使える命令の一覧 */
export const API_DOC = [
  ['print(値, …)', '出力エリアに表示'],
  ['background(色)', '画面全体を塗る'],
  ['fill(色) / noFill()', '塗りの色 / 塗らない'],
  ['stroke(色, 太さ) / noStroke()', '線の色 / 線なし'],
  ['circle(x, y, 半径)', '円'],
  ['ellipse(x, y, 横半径, 縦半径)', 'だ円'],
  ['rect(x, y, 幅, 高さ)', '四角形'],
  ['line(x1, y1, x2, y2)', '線'],
  ['text(文字, x, y, 大きさ)', '文字'],
  ['random(最小, 最大) / randomInt(最小, 最大)', '乱数'],
  ['onFrame(関数)', '毎フレーム実行'],
  ['keyIsDown("ArrowRight")', 'キーが押されているか'],
  ['mouseX() / mouseY() / mouseIsPressed()', 'マウス'],
  ['WIDTH / HEIGHT', 'キャンバスの大きさ'],
];
