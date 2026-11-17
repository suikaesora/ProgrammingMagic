// 進捗・解放判定・報酬の付与
import { store } from './storage.js';
import { lessons } from '../../content/lessons/index.js';
import { config } from '../../content/config.js';

export function getLessons() { return lessons; }

export function lessonIndex(id) { return lessons.findIndex((l) => l.id === id); }

export function getLesson(id) { return lessons.find((l) => l.id === id) || null; }

export function lessonLabel(lesson) {
  const i = lessonIndex(lesson.id);
  return lesson.label ?? `修行 ${i}`;
}

export function nextLesson(id) {
  const i = lessonIndex(id);
  return i >= 0 && i + 1 < lessons.length ? lessons[i + 1] : null;
}

export function isCleared(id) { return !!store.get().progress[id]?.cleared; }

// ---- 制作・確認用：__app.open() で開いた修行は、解放前でも開ける ----
// 進捗には保存せず sessionStorage に置くので、タブを閉じれば元にもどる（再読み込みでは消えない）
const PREVIEW_KEY = 'programming-magic-preview';

function previewIds() {
  try { return JSON.parse(sessionStorage.getItem(PREVIEW_KEY)) || []; } catch (e) { return []; }
}

export function allowPreview(id) {
  const ids = previewIds();
  if (ids.includes(id)) return;
  try { sessionStorage.setItem(PREVIEW_KEY, JSON.stringify([...ids, id])); } catch (e) { /* 保存できなくても続ける */ }
}

/** 確認用に開いた修行か（クリアしても進捗・アイテムに記録しない） */
export function isPreview(id) { return previewIds().includes(id); }

/** 確認用に開いた修行をすべて元にもどす */
export function clearPreview() {
  try { sessionStorage.removeItem(PREVIEW_KEY); } catch (e) { /* 何もしない */ }
}

/** クリア済みの修行と、その1つ次の修行まで挑戦できる（確認用に開いた修行も） */
export function isUnlocked(id) {
  if (isPreview(id)) return true;
  const i = lessonIndex(id);
  if (i <= 0) return i === 0;
  return isCleared(lessons[i - 1].id);
}

export function allCleared() { return lessons.every((l) => isCleared(l.id)); }

export function clearedCount() { return lessons.filter((l) => isCleared(l.id)).length; }

/** 今挑戦すべき修行（未クリアで解放済みの最初のもの。全部クリアなら最後） */
export function currentLesson() {
  return lessons.find((l) => !isCleared(l.id) && isUnlocked(l.id)) || lessons[lessons.length - 1];
}

// ---- 挑戦中の状態（行隠しの解放・お手本実行の使用・課題開始後に解説を見たか） ----
export function getAttempt(id) {
  const a = store.get().attempts[id];
  return {
    opened: a?.opened ? [...a.opened] : [],
    sampleRunUsed: !!a?.sampleRunUsed,
    taskStarted: !!a?.taskStarted,     // 課題パートを一度でも開いた
    explainViewed: !!a?.explainViewed, // 課題を始めた後に解説を見た（宝箱が減る）
  };
}

/** 宝箱の数が決まっている修行か（items が1つだけなら、解放率や解説に関係なく宝箱は1つ） */
export function hasFixedChest(id) {
  return (getLesson(id)?.items || []).length <= 1;
}

/** 解説を開くと宝箱が減る状態か（未クリアで、課題を始めていて、まだ解説を見ていない） */
export function explainWouldPenalize(id) {
  if (isCleared(id) || hasFixedChest(id)) return false;
  const a = getAttempt(id);
  return a.taskStarted && !a.explainViewed;
}

export function saveAttempt(id, patch) {
  store.update((s) => { s.attempts[id] = { ...getAttempt(id), ...patch }; });
}

export function chestCount(rate) { return config.chestRule(rate); }

/**
 * クリアを記録し、報酬を決める。
 * 報酬（アイテム）は初回クリア時のみ。2回目以降は変化しない。
 */
export function recordClear(id, rate) {
  const lesson = getLesson(id);
  const first = !isCleared(id);
  const wasAll = allCleared();
  const explainViewed = first && !hasFixedChest(id) && getAttempt(id).explainViewed;
  const count = Math.max(1, chestCount(rate) - (explainViewed ? (config.explainPenalty ?? 1) : 0));
  const chestItems = (lesson.items || []).slice(0, count);

  // 確認用に開いた修行は、クリア画面を見せるだけで、進捗・アイテムには記録しない
  if (isPreview(id)) {
    store.update((s) => { delete s.attempts[id]; });
    return { lessonId: id, rate, firstClear: first, chestItems, explainViewed, justCompletedAll: false, preview: true };
  }

  store.update((s) => {
    const prev = s.progress[id];
    s.progress[id] = {
      cleared: true,
      bestRate: prev ? Math.min(prev.bestRate ?? 1, rate) : rate,
      clearedAt: prev?.clearedAt || Date.now(),
    };
    if (first) {
      for (const it of chestItems) if (!s.collection[it]) s.collection[it] = Date.now();
    }
    delete s.attempts[id];
  });
  return {
    lessonId: id,
    rate,
    firstClear: first,
    chestItems,
    explainViewed,
    justCompletedAll: !wasAll && allCleared(),
  };
}

// ---- コレクション ----
export function hasItem(itemId) { return !!store.get().collection[itemId]; }
