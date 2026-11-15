// ビジュアルエリア：修行情報 / キャンバス（＋出力） / コントロールパネル / 師匠エリア（実行中は変数エリア）

import { Runner } from '../runner/stepRunner.js';
import { createMaster } from './master.js';
import { config } from '../../content/config.js';
import { lessonLabel } from '../core/progress.js';
import { bus } from '../core/bus.js';
import { escapeHtml, formatForVars, UNINIT } from '../core/format.js';

const SPEEDS = [1200, 700, 400, 180, 60]; // ミリ秒/ステップ（遅い→速い）

function starsHtml(n, max = 5) {
  let s = '';
  for (let i = 1; i <= max; i++) s += i <= n ? '★' : '<span class="off">★</span>';
  return `<span class="stars" aria-label="難易度 ${n}">${s}</span>`;
}

/**
 * @param {HTMLElement} host
 * @param {object} o
 * @param {object} o.lesson
 * @param {'explain'|'task'} o.kind
 * @param {() => {program, editor}} o.getTarget 実行するコードとハイライトするエディタ
 * @param {() => {program}|null} [o.getSampleTarget] 課題パート：お手本実行用
 * @param {boolean} [o.sampleRunUsed] お手本実行を使用済みか
 * @param {() => void} [o.onSampleRunUsed]
 * @param {() => void} [o.onGoTask]
 * @param {(result, runner, isSample:boolean) => void} [o.onCheckpoint]
 * @param {(state, mode, isSample:boolean) => void} [o.onState]
 * @param {string[]} [o.masterLines]
 */
export function createVisualPanel(host, o) {
  const { lesson, kind } = o;
  const { width, height } = config.canvas;
  host.classList.add('vp');
  host.innerHTML = `
    <div class="vp-info card" data-tut="lesson-info">
      <div class="vp-info-main">
        <span class="badge badge-accent">${escapeHtml(lessonLabel(lesson))}</span>
        <strong class="vp-title">${escapeHtml(lesson.title)}</strong>
        ${starsHtml(lesson.difficulty || 1)}
      </div>
      ${kind === 'task' ? `
      <div class="vp-rate" title="コード解放率 = はがした行数 / 隠れていた行数">
        <span class="vp-rate-label">解放率</span>
        <span class="vp-rate-bar"><span class="vp-rate-fill"></span></span>
        <span class="vp-rate-text">0/0</span>
      </div>` : ''}
    </div>
    <div class="vp-stage card" data-tut="stage">
      <div class="vp-canvas-wrap">
        <canvas width="${width}" height="${height}" tabindex="0" aria-label="実行結果のキャンバス"></canvas>
        <div class="vp-flash" aria-hidden="true"></div>
      </div>
      <div class="vp-output" aria-live="polite"><div class="vp-output-empty">print() の出力がここに出ます</div></div>
    </div>
    <div class="vp-controls card" data-tut="controls">
      <div class="vp-btns">
        <button type="button" class="btn btn-primary" data-act="run" data-tut="btn-run" title="ふつうに実行">▶ 実行</button>
        <button type="button" class="btn" data-act="step-auto" data-tut="btn-step-auto" title="1行ずつ自動で実行">1行ずつ</button>
        <button type="button" class="btn" data-act="step-one" data-tut="btn-step-one" title="手動で1行ずつ進める">1歩</button>
        <button type="button" class="btn btn-icon" data-act="pause" title="一時停止" aria-label="一時停止">❚❚</button>
        <button type="button" class="btn btn-icon" data-act="resume" title="再開" aria-label="再開">▶▶</button>
        <button type="button" class="btn btn-icon" data-act="stop" title="停止" aria-label="停止">■</button>
      </div>
      <div class="vp-btns vp-btns-sub">
        <label class="vp-speed" data-tut="speed" title="1行ずつ実行の速さ">
          <span>速さ</span>
          <input type="range" min="0" max="${SPEEDS.length - 1}" step="1">
        </label>
        ${kind === 'task' ? '<button type="button" class="btn btn-sm" data-act="sample-run" data-tut="btn-sample-run" title="完成形を1度だけ見られる">お手本実行</button>' : ''}
        ${kind === 'explain' ? '<button type="button" class="btn btn-success" data-act="go-task" data-tut="btn-go-task">課題へ →</button>' : ''}
      </div>
    </div>
    <div class="vp-side card" data-tut="side">
      <div class="vp-master"></div>
      <div class="vp-vars hidden">
        <div class="vp-vars-head">変数のようす <span class="vp-vars-line muted"></span></div>
        <table class="vp-vars-table"><tbody></tbody></table>
      </div>
    </div>`;

  const canvas = host.querySelector('canvas');
  const output = host.querySelector('.vp-output');
  const flash = host.querySelector('.vp-flash');
  const masterHost = host.querySelector('.vp-master');
  const varsBox = host.querySelector('.vp-vars');
  const varsBody = host.querySelector('.vp-vars-table tbody');
  const varsLine = host.querySelector('.vp-vars-line');
  const btn = (a) => host.querySelector(`[data-act="${a}"]`);
  const speedInput = host.querySelector('.vp-speed input');

  const master = createMaster(masterHost, o.masterLines || []);

  // 速さ
  const defaultIdx = SPEEDS.reduce((best, v, i) => (Math.abs(v - config.stepSpeedDefault) < Math.abs(SPEEDS[best] - config.stepSpeedDefault) ? i : best), 0);
  speedInput.value = String(defaultIdx);

  let currentEditor = null;
  let isSample = false;
  let prevVars = {};
  let sampleUsed = !!o.sampleRunUsed;

  // ---- 出力 ----
  function clearOutput() { output.innerHTML = ''; }
  function appendLog(text, cls = '') {
    const empty = output.querySelector('.vp-output-empty');
    if (empty) empty.remove();
    if (output.childElementCount > 300) output.firstElementChild.remove();
    const d = document.createElement('div');
    d.className = `vp-log ${cls}`;
    d.textContent = text;
    output.appendChild(d);
    output.scrollTop = output.scrollHeight;
    return d;
  }
  function appendError(info) {
    const empty = output.querySelector('.vp-output-empty');
    if (empty) empty.remove();
    const d = document.createElement('div');
    d.className = 'vp-log is-error';
    d.innerHTML = `<strong>${escapeHtml(info.title)}${info.where ? `（${escapeHtml(info.where)}）` : ''}</strong>
      <div>${escapeHtml(info.message)}</div>
      <div class="vp-err-orig">${escapeHtml(info.original)}</div>`;
    output.appendChild(d);
    output.scrollTop = d.offsetTop; // エラーの先頭が見えるように
  }

  // ---- 変数 ----
  function renderVars(vars) {
    if (!vars) { varsBody.innerHTML = ''; return; }
    const rows = [];
    for (const [k, v] of Object.entries(vars)) {
      if (v === UNINIT || typeof v === 'function') continue;
      const text = formatForVars(v);
      const changed = k in prevVars && prevVars[k] !== text;
      rows.push(`<tr class="${changed ? 'is-changed' : ''}"><th>${escapeHtml(k)}</th><td>${escapeHtml(text)}</td></tr>`);
      prevVars[k] = text;
    }
    varsBody.innerHTML = rows.join('') || '<tr><td class="muted" colspan="2">（まだ変数はありません）</td></tr>';
  }

  function showVars(on) {
    varsBox.classList.toggle('hidden', !on);
    masterHost.classList.toggle('hidden', on);
  }

  // ---- 実行 ----
  const runner = new Runner({
    canvas,
    onPrint: (s) => appendLog(s),
    onLine: (line) => {
      if (!currentEditor) return;
      currentEditor.markLine(line, 'exec');
      varsLine.textContent = line ? `（${line}行目の前）` : '';
    },
    onVars: (vars) => renderVars(vars),
    onError: (info) => {
      appendError(info);
      if (currentEditor && info.userLine) currentEditor.markLine(info.userLine, 'error');
      if (!(runner.mode === 'step')) {
        master.say(`エラーが出たようじゃ。${info.userLine ? `<b>${info.userLine}行目</b>あたりを` : 'コードを'}見直してみよ。`);
      }
      bus.emit('run:error', info);
    },
    onState: (state, mode) => {
      updateButtons();
      showVars(mode === 'step' && state !== 'idle');
      if (state === 'done') bus.emit('run:done', { mode, isSample });
      o.onState?.(state, mode, isSample);
    },
    onCheckpoint: (result, r) => o.onCheckpoint?.(result, r, isSample),
  });
  runner.setSpeed(SPEEDS[defaultIdx]);
  if (window.__app) window.__app.runner = runner; // デバッグ用
  speedInput.addEventListener('input', () => runner.setSpeed(SPEEDS[+speedInput.value]));

  function prepareRun(target, sample) {
    runner.stop();
    if (currentEditor) currentEditor.clearMarks();
    currentEditor = target.editor || null;
    if (currentEditor) currentEditor.clearMarks();
    isSample = sample;
    prevVars = {};
    renderVars(null);
    clearOutput();
    if (sample) appendLog('― お手本を実行中 ―', 'is-note');
  }

  function start(mode) {
    const target = o.getTarget();
    prepareRun(target, false);
    if (mode === 'normal') runner.runNormal(target.program);
    else runner.startStep(target.program, mode === 'step-auto');
    canvas.focus({ preventScroll: true });
    bus.emit('run:start', { mode });
    if (mode !== 'normal') bus.emit('step:start', { mode });
  }

  function updateButtons() {
    const s = runner.state;
    const step = runner.mode === 'step';
    btn('pause').disabled = s !== 'running';
    btn('resume').disabled = s !== 'paused';
    btn('stop').disabled = s === 'idle';
    btn('step-one').classList.toggle('btn-primary', step && s === 'paused');
    const sr = btn('sample-run');
    if (sr) sr.disabled = sampleUsed;
  }

  host.querySelector('.vp-controls').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    switch (b.dataset.act) {
      case 'run': start('normal'); break;
      case 'step-auto': start('step-auto'); break;
      case 'step-one':
        if (runner.mode === 'step' && runner.state === 'paused' && !isSample) runner.stepOnce();
        else start('step-one');
        break;
      case 'pause': runner.pause(); break;
      case 'resume': runner.resume(); break;
      case 'stop': runner.stop(); break;
      case 'go-task': o.onGoTask?.(); break;
      case 'sample-run': {
        if (sampleUsed) return;
        const t = o.getSampleTarget?.();
        if (!t) return;
        sampleUsed = true;
        o.onSampleRunUsed?.();
        prepareRun({ editor: null }, true);
        runner.runNormal(t.program);
        canvas.focus({ preventScroll: true });
        updateButtons();
        bus.emit('sample:run');
        break;
      }
      default: break;
    }
  });

  updateButtons();

  return {
    el: host,
    runner,
    master,
    canvas,
    setRevealRate(opened, total) {
      const fill = host.querySelector('.vp-rate-fill');
      const text = host.querySelector('.vp-rate-text');
      if (!fill) return;
      const rate = total ? opened / total : 0;
      fill.style.width = `${Math.round(rate * 100)}%`;
      text.textContent = `${opened}/${total}（${Math.round(rate * 100)}%）`;
    },
    flashClear(text = 'クリア！') {
      flash.textContent = text;
      flash.classList.remove('is-on');
      void flash.offsetWidth;
      flash.classList.add('is-on');
    },
    destroy() { runner.stop(); },
  };
}
