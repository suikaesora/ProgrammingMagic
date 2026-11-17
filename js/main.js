// エントリーポイント
import { startRouter, go } from './router.js';
import { applyTheme } from './core/theme.js';
import { store } from './core/storage.js';
import { getLessons, getLesson, allowPreview } from './core/progress.js';
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
//   __app.open(10, 'task')  指定の修行だけを開く（番号か ID。'explain' か 'task'。進捗は変えない）
//   __app.lessons()    修行の番号と ID の一覧
window.__app = {
  state: () => JSON.parse(JSON.stringify(store.get())),
  lessons() {
    console.table(getLessons().map((l, i) => ({ 番号: i, id: l.id, title: l.title })));
  },
  open(which, part = 'explain') {
    const lesson = typeof which === 'number' ? getLessons()[which] : getLesson(which);
    if (!lesson) {
      console.warn(`修行「${which}」が見つかりません。__app.lessons() で一覧を見られます。`);
      return;
    }
    if (part !== 'explain' && part !== 'task') {
      console.warn("2つ目の引数は 'explain'（解説）か 'task'（課題）です。");
      return;
    }
    allowPreview(lesson.id);
    store.update((s) => {
      s.introSeen = true;
      s.avatar = s.avatar || config.avatars[0].id;
      delete s.attempts[lesson.id]; // 行隠し・お手本実行などを最初の状態にもどす
    });
    go(`#/lesson/${lesson.id}/${part}`);
  },
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
