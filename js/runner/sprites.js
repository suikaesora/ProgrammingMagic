// content/sprites.js に登録した画像の読み込み。
// 画像の読み込みは非同期なので、起動時に loadSprites() で読み込みを始め、
// 実行前に spritesReady() を待ってから render() で同期的に描けるようにする。

import { sprites } from '../../content/sprites.js';
import { config } from '../../content/config.js';
import { store } from '../core/storage.js';

const loaded = new Map(); // 画像パス -> { img, ok }
let ready = null;

/** 画像の実際のパス。avatar: true のものは、いま選ばれている姿 */
export function spriteImage(name) {
  const def = sprites[name];
  if (!def) return null;
  if (def.avatar) {
    const a = config.avatars.find((x) => x.id === store.get().avatar) || config.avatars[0];
    return a.image;
  }
  return def.image;
}

function loadImage(src) {
  if (loaded.has(src)) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    const entry = { img, ok: false };
    loaded.set(src, entry);
    img.onload = () => { entry.ok = true; resolve(); };
    img.onerror = () => {
      console.warn(`画像（${src}）を読み込めませんでした`);
      resolve();
    };
    img.src = src;
  });
}

export function loadSprites() {
  if (ready) return ready;
  // 姿は途中で選ばれるので、選べる姿の画像はすべて読み込んでおく
  const srcs = new Set();
  for (const def of Object.values(sprites)) {
    if (def.avatar) config.avatars.forEach((a) => srcs.add(a.image));
    else srcs.add(def.image);
  }
  ready = Promise.all([...srcs].map(loadImage));
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
  const entry = loaded.get(spriteImage(name));
  const img = entry?.ok ? entry.img : null;
  // viewBox だけの SVG などで大きさが取れないときは正方形として扱う
  const aspect = img && img.naturalWidth > 0 && img.naturalHeight > 0 ? img.naturalHeight / img.naturalWidth : 1;
  return { img, width: def.width || 80, aspect };
}
