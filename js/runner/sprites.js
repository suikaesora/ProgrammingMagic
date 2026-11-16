// content/sprites.js に登録した画像の読み込み。
// 画像の読み込みは非同期なので、起動時に loadSprites() で読み込みを始め、
// 実行前に spritesReady() を待ってから render() で同期的に描けるようにする。

import { sprites } from '../../content/sprites.js';

const loaded = new Map(); // 名前 -> { img, ok }
let ready = null;

export function loadSprites() {
  if (ready) return ready;
  ready = Promise.all(Object.entries(sprites).map(([name, def]) => new Promise((resolve) => {
    const img = new Image();
    const entry = { img, ok: false };
    loaded.set(name, entry);
    img.onload = () => { entry.ok = true; resolve(); };
    img.onerror = () => {
      console.warn(`画像「${name}」（${def.image}）を読み込めませんでした`);
      resolve();
    };
    img.src = def.image;
  })));
  return ready;
}

/** すべての画像の読み込みが終わるまで待つ（失敗した画像があっても待ち終わる） */
export function spritesReady() { return loadSprites(); }

/** 登録されている画像名の一覧 */
export function spriteNames() { return Object.keys(sprites); }

/**
 * 描画用の情報。登録されていなければ null。
 * @returns {{ img: HTMLImageElement|null, width: number, aspect: number } | null}
 */
export function getSprite(name) {
  const def = sprites[name];
  if (!def) return null;
  const entry = loaded.get(name);
  const img = entry?.ok ? entry.img : null;
  // viewBox だけの SVG などで大きさが取れないときは正方形として扱う
  const aspect = img && img.naturalWidth > 0 && img.naturalHeight > 0 ? img.naturalHeight / img.naturalWidth : 1;
  return { img, width: def.width || 80, aspect };
}
