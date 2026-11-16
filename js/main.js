// エントリーポイント
import { startRouter } from './router.js';
import { applyTheme } from './core/theme.js';
import { store } from './core/storage.js';
import { getLessons } from './core/progress.js';
import { config } from '../content/config.js';
import { loadSprites } from './runner/sprites.js';

document.title = config.appTitle;
loadSprites(); // render() で使う画像を先に読み込んでおく
applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);

// 制作・確認用のデバッグ機能（ブラウザのコンソールから使う）
//   __app.unlockAll()  すべての修行をクリア済みにする
//   __app.reset()      進捗をすべて消す
//   __app.state()      保存内容を見る
window.__app = {
  state: () => JSON.parse(JSON.stringify(store.get())),
  reset() { store.reset(); location.hash = '#/intro'; location.reload(); },
  unlockAll() {
    store.update((s) => {
      s.introSeen = true;
      s.avatar = s.avatar || config.avatars[0].id;
      for (const l of getLessons()) {
        s.progress[l.id] = { cleared: true, bestRate: 0, clearedAt: Date.now() };
        for (const it of l.items || []) s.collection[it] = s.collection[it] || Date.now();
      }
    });
    location.hash = '#/home';
    location.reload();
  },
};

startRouter(document.getElementById('app'));
