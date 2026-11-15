// 解説パート：文章解説 | お手本コード | ビジュアルエリア
import { lessonHeader } from '../ui/header.js';
import { createCodeEditor } from '../editor/codeEditor.js';
import { createVisualPanel } from '../ui/visualPanel.js';
import { mountTutorial } from '../ui/tutorial.js';
import { buildProgram } from '../runner/template.js';
import { bus } from '../core/bus.js';
import { go } from '../router.js';

export function mount(root, { lesson }) {
  const ex = lesson.explain || {};
  root.appendChild(lessonHeader(lesson, 'explain'));
  const main = document.createElement('main');
  main.className = 'layout-explain';
  main.innerHTML = `
    <section class="pane pane-text card" data-tut="explain-text">
      <div class="pane-head">解説</div>
      <article class="prose">${ex.html || ''}</article>
    </section>
    <section class="pane pane-code card" data-tut="sample-code">
      <div class="pane-head">お手本コード <span class="muted pane-note">書きかえて試せます</span></div>
      <div class="pane-editor"></div>
      <div class="pane-foot">
        <button type="button" class="btn btn-sm" data-act="reset">↺ リセット</button>
      </div>
    </section>
    <section class="pane pane-visual"></section>`;
  root.appendChild(main);

  const original = ex.sampleCode || '';
  const editor = createCodeEditor(main.querySelector('.pane-editor'), {
    value: original,
    lineIcons: ex.lineIcons || {},
    label: 'お手本コード',
  });
  main.querySelector('[data-act="reset"]').addEventListener('click', () => {
    panel.runner.stop();
    editor.setValue(original);
    editor.clearMarks();
  });

  const panel = createVisualPanel(main.querySelector('.pane-visual'), {
    lesson,
    kind: 'explain',
    masterLines: ex.master || [],
    getTarget: () => ({ program: buildProgram(ex.template ?? lesson.template, editor.getValue()), editor }),
    onGoTask: () => {
      bus.emit('nav:task');
      go(`#/lesson/${lesson.id}/task`);
    },
  });

  const endTutorial = mountTutorial({ lesson, scene: 'explain' });

  return () => {
    endTutorial();
    panel.destroy();
    editor.destroy();
  };
}
