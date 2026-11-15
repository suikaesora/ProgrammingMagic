// ローカルストレージへの保存（1つのキーにまとめて保存）
// スキーマを変えたときは VERSION を上げ、migrate() に移行処理を書く。

const KEY = 'present-webapp:v1';
const VERSION = 1;

function defaults() {
  return {
    version: VERSION,
    introSeen: false,       // 導入部を見たか
    avatar: null,           // 選んだ見た目の id
    theme: null,            // 'light' | 'dark' | null(OS に従う)
    progress: {},           // { [lessonId]: { cleared, bestRate, clearedAt } }
    attempts: {},           // { [lessonId]: { opened: [行番号], sampleRunUsed } } 挑戦中の状態
    drafts: {},             // { [lessonId]: 課題で書きかけのコード }
    collection: {},         // { [itemId]: 入手日時 }
    deco: { placed: [] },   // 装飾部の配置 [{ uid, item, x, y, rot, scale, z }]
    certSeen: false,        // 認定証を一度見たか
  };
}

function migrate(data) {
  const base = defaults();
  if (!data || typeof data !== 'object') return base;
  // 足りない項目を補う（将来の項目追加に強くする）
  const merged = { ...base, ...data };
  merged.deco = { ...base.deco, ...(data.deco || {}) };
  merged.version = VERSION;
  return merged;
}

let available = true;
let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return migrate(raw ? JSON.parse(raw) : null);
  } catch (e) {
    available = false;
    return defaults();
  }
}

function save() {
  if (!available) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('保存に失敗しました', e);
  }
}

export const store = {
  /** 現在の状態（読み取り用） */
  get() { return state; },
  /** 状態を変更して保存する: store.update(s => { s.introSeen = true; }) */
  update(fn) {
    fn(state);
    save();
  },
  /** すべての進捗を消す */
  reset() {
    const keepTheme = state.theme;
    state = defaults();
    state.theme = keepTheme;
    save();
  },
  isPersistent() { return available; },
};
