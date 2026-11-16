// 課題パート：問題 / お手本（行隠し） / コード記述 | ビジュアルエリア
import { lessonHeader } from '../ui/header.js';
import { createCodeEditor } from '../editor/codeEditor.js';
import { attachLineCovers, autoHiddenLines } from '../editor/lineCovers.js';
import { createVisualPanel } from '../ui/visualPanel.js';
import { mountTutorial } from '../ui/tutorial.js';
import { buildProgram } from '../runner/template.js';
import { store } from '../core/storage.js';
import { getAttempt, saveAttempt, recordClear, isCleared } from '../core/progress.js';
import { config } from '../../content/config.js';
import { commands } from '../../content/commands.js';
import { escapeHtml } from '../core/format.js';
import { session } from '../core/session.js';
import { bus } from '../core/bus.js';
import { go } from '../router.js';

const HINT_AFTER_FRAMES = 900; // アニメーション課題で、この回数フレームが進んでもクリアしなければヒント

/**
 * 「つかう命令」メモ。命令の書き方は課題の本質ではないので、見ても宝箱は減らない。
 * refs の要素は content/commands.js の名前か、{ sig, desc } オブジェクト。
 */
function refsHtml(refs) {
  if (!refs || !refs.length) return '';
  const items = refs.map((r) => {
    const c = typeof r === 'string' ? commands[r] : r;
    if (!c) { console.warn(`content/commands.js に命令 "${r}" がありません`); return ''; }
    return `<li><code class="refs-sig">${escapeHtml(c.sig)}</code><span class="refs-desc">${c.desc || ''}</span></li>`;
  }).join('');
  return `
    <aside class="problem-refs" aria-label="つかう命令">
      <div class="refs-head">📒 つかう命令 <span class="muted">（見ても宝箱は減らないぞ）</span></div>
      <ul class="refs-list">${items}</ul>
    </aside>`;
}

export function mount(root, { lesson }) {
  const tk = lesson.task || {};
  const attempt = getAttempt(lesson.id);
  const firstTry = !isCleared(lesson.id);
  // 課題を始めた印（これ以降に解説を見ると宝箱が減る）
  if (firstTry && !attempt.taskStarted) saveAttempt(lesson.id, { taskStarted: true });
  const explainPenalty = (config.explainPenalty ?? 1) > 0;
  root.appendChild(lessonHeader(lesson, 'task', { explainWarn: firstTry && explainPenalty && !attempt.explainViewed }));
  const main = document.createElement('main');
  main.className = 'layout-task';
  main.innerHTML = `
    <div class="task-left">
      <section class="pane pane-problem card" data-tut="problem">
        <div class="pane-head">課題</div>
        <div class="problem-body">
          <article class="prose">${tk.problemHtml || ''}</article>
          ${refsHtml(tk.refs)}
        </div>
      </section>
      <div class="task-codes">
        <section class="pane pane-code card" data-tut="task-sample">
          <div class="pane-head">お手本 <span class="muted pane-note">隠しをクリックではがせる</span></div>
          <div class="pane-editor sample-editor"></div>
        </section>
        <section class="pane pane-code card pane-user" data-tut="user-code">
          <div class="pane-head">あなたのコード <span class="muted pane-note">Tab でインデント</span></div>
          <div class="pane-editor user-editor"></div>
          <div class="pane-foot">
            <button type="button" class="btn btn-sm" data-act="reset-user" title="最初の状態にもどす">↺ 最初から</button>
          </div>
        </section>
      </div>
    </div>
    <section class="pane pane-visual"></section>`;
  root.appendChild(main);

  // ---- お手本（行隠し） ----
  const answer = tk.answerCode || '';
  const sampleEditor = createCodeEditor(main.querySelector('.sample-editor'), { value: '', readOnly: true, label: 'お手本' });
  const hidden = tk.hiddenLines || autoHiddenLines(answer);

  // ---- 学習者のコード ----
  const starter = tk.starterCode ?? '';
  const draft = store.get().drafts[lesson.id];
  const userEditor = createCodeEditor(main.querySelector('.user-editor'), {
    value: draft ?? starter,
    lineIcons: tk.lineIcons || {},
    label: 'あなたのコード',
  });
  let saveTimer = null;
  userEditor.onChange((v) => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.update((s) => { s.drafts[lesson.id] = v; }), 300);
    bus.emit('editor:change');
  });
  main.querySelector('[data-act="reset-user"]').addEventListener('click', () => {
    userEditor.setValue(starter);
    userEditor.clearMarks();
  });

  // ---- ビジュアルエリア ----
  let cleared = false;
  let hinted = false;
  const panel = createVisualPanel(main.querySelector('.pane-visual'), {
    lesson,
    kind: 'task',
    masterLines: tk.master || ['課題を読んで、右下にコードを書くのじゃ。'],
    sampleRunUsed: attempt.sampleRunUsed,
    getTarget: () => ({ program: buildProgram(lesson.template, userEditor.getValue()), editor: userEditor }),
    getSampleTarget: () => ({ program: buildProgram(lesson.template, answer) }),
    onSampleRunUsed: () => saveAttempt(lesson.id, { sampleRunUsed: true }),
    onCheckpoint: (result, runner, isSample) => {
      if (isSample || cleared) return;
      let ok = false;
      try { ok = !!lesson.check?.(result); } catch (e) { ok = false; }
      if (ok) {
        cleared = true;
        onClear(runner);
      } else if (result.frames >= HINT_AFTER_FRAMES && !hinted) {
        hinted = true;
        panel.master.say(tk.failMessage || 'まだクリアではないようじゃ。課題をもう一度読んでみよ。');
      }
    },
    onState: (state, mode, isSample) => {
      if (state === 'done' && !isSample && !cleared) {
        panel.master.say(tk.failMessage || 'まだクリアではないようじゃ。課題をもう一度読んでみよ。');
      }
    },
  });

  const covers = attachLineCovers(sampleEditor, answer, hidden, attempt.opened, (opened) => {
    saveAttempt(lesson.id, { opened });
    panel.setRevealRate(covers.openedCount, covers.total);
    bus.emit('reveal', { opened });
  });
  panel.setRevealRate(covers.openedCount, covers.total);
  if (firstTry && explainPenalty && attempt.explainViewed) panel.setExplainViewed(true);

  let leaveTimer = null;
  function onClear(runner) {
    runner.stop();
    const rate = covers.rate;
    session.lastClear = recordClear(lesson.id, rate);
    panel.flashClear('クリア！');
    bus.emit('clear', { lessonId: lesson.id });
    leaveTimer = setTimeout(() => go(`#/clear/${lesson.id}`), 1300);
  }

  const endTutorial = mountTutorial({ lesson, scene: 'task' });

  return () => {
    clearTimeout(leaveTimer);
    clearTimeout(saveTimer);
    store.update((s) => { s.drafts[lesson.id] = userEditor.getValue(); });
    endTutorial();
    panel.destroy();
    sampleEditor.destroy();
    userEditor.destroy();
  };
}
