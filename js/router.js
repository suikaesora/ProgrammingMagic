// ハッシュ（#/home など）で画面を切り替える
import { store } from './core/storage.js';
import { getLesson, isUnlocked } from './core/progress.js';
import * as intro from './scenes/intro.js';
import * as home from './scenes/home.js';
import * as explain from './scenes/explain.js';
import * as task from './scenes/task.js';
import * as clear from './scenes/clear.js';
import * as cert from './scenes/cert.js';
import * as deco from './scenes/deco.js';
import * as epilogue from './scenes/epilogue.js';

const routes = [
  { re: /^\/intro$/, scene: intro, name: 'intro' },
  { re: /^\/home$/, scene: home, name: 'home' },
  { re: /^\/lesson\/([\w-]+)\/explain$/, scene: explain, name: 'explain', lesson: true },
  { re: /^\/lesson\/([\w-]+)\/task$/, scene: task, name: 'task', lesson: true },
  { re: /^\/clear\/([\w-]+)$/, scene: clear, name: 'clear', lesson: true },
  { re: /^\/epilogue$/, scene: epilogue, name: 'epilogue' },
  { re: /^\/cert$/, scene: cert, name: 'cert' },
  { re: /^\/deco$/, scene: deco, name: 'deco' },
];

let root = null;
let cleanup = null;

export function go(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

function resolve(path) {
  for (const r of routes) {
    const m = path.match(r.re);
    if (m) return { route: r, params: m.slice(1) };
  }
  return null;
}

function route() {
  const path = location.hash.replace(/^#/, '') || '/home';
  const s = store.get();
  let found = resolve(path);

  // ガード
  if (!s.introSeen && found?.route.name !== 'intro') return go('#/intro');
  if (s.introSeen && found?.route.name === 'intro') return go('#/home');
  if (!found) return go('#/home');
  let lesson = null;
  if (found.route.lesson) {
    lesson = getLesson(found.params[0]);
    if (!lesson || !isUnlocked(lesson.id)) return go('#/home');
  }

  if (cleanup) {
    try { cleanup(); } catch (e) { console.error(e); }
    cleanup = null;
  }
  root.innerHTML = '';
  root.className = `scene scene-${found.route.name}`;
  window.scrollTo(0, 0);
  cleanup = found.route.scene.mount(root, { lesson, params: found.params }) || null;
}

export function startRouter(el) {
  root = el;
  window.addEventListener('hashchange', route);
  route();
}
