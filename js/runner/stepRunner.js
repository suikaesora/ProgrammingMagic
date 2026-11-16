// 実行の制御（通常実行・インタプリタ自動実行・インタプリタ手動実行・一時停止・再開・停止）

import { instrument } from './instrument.js';
import { createHooks, compile, WAIT_KEY, usesWaitKey } from './sandbox.js';
import { createRuntime } from './runtimeApi.js';
import { describeError } from './errors.js';

/**
 * 状態: 'idle' | 'running' | 'paused' | 'waiting'（waitKey でキー入力待ち） | 'done' | 'error'
 * モード: 'normal' | 'step'
 *
 * waitKey() を使うコードは、通常実行でもジェネレータ版（インタプリタ実行と同じ形）で動かし、
 * 止まらずに進めて（_drive）、キー入力待ちのところでだけ止まる。
 */
export class Runner {
  constructor({ canvas, onPrint, onLine, onVars, onError, onState, onCheckpoint }) {
    this.canvas = canvas;
    this.cb = {
      onPrint: onPrint || (() => {}),
      onLine: onLine || (() => {}),
      onVars: onVars || (() => {}),
      onError: onError || (() => {}),
      onState: onState || (() => {}),
      onCheckpoint: onCheckpoint || (() => {}),
    };
    this.state = 'idle';
    this.mode = null;
    this.speed = 400;
    this.rt = null;
    this.hs = null;
    this.gen = null;
    this.frames = 0;
    this.timer = null;
    this.raf = null;
    this.keys = [];             // waitKey() で受け取ったキーの記録（クリア判定用）
    this.sendValue = undefined; // 次の gen.next() に渡す値（受け取ったキー）
    this.stepAuto = false;
  }

  // ---------- 公開メソッド ----------

  /** 通常実行 */
  runNormal(program) {
    if (usesWaitKey(program.code)) { this._runDriven(program); return; }
    const main = this._prepare(program, 'normal');
    if (!main) return;
    this.mode = 'normal';
    this._setState('running');
    try {
      this.hs.resetOps();
      main();
    } catch (e) {
      this._fail(e);
      return;
    }
    this._checkpoint();
    if (this.state !== 'running') return;
    if (this.rt.frameFn) this._loopNormal();
    else this._finish();
  }

  /** インタプリタ実行（auto=true で自動、false で手動） */
  startStep(program, auto) {
    const factory = this._prepare(program, 'step');
    if (!factory) return;
    this.mode = 'step';
    this.phase = 'main';
    try {
      this.gen = factory();
    } catch (e) {
      this._fail(e);
      return;
    }
    this.stepAuto = auto;
    this._setState(auto ? 'running' : 'paused');
    this.stepOnce();
    if (auto && this.state === 'running') this._schedule();
  }

  /** 1ステップ進める（手動実行・一時停止中） */
  stepOnce() {
    if (this.mode !== 'step' || !this.gen) return;
    // 停止点のないフレームが続いても固まらないよう、数回まで続けて進める
    for (let guard = 0; guard < 3; guard++) {
      let r;
      try {
        this.hs.resetOps();
        r = this.gen.next(this.sendValue);
      } catch (e) {
        this._fail(e);
        return;
      }
      this.sendValue = undefined;
      if (!r.done) {
        if (r.value === WAIT_KEY) { this._beginWait(); return; }
        const { line, snap } = r.value;
        this.cb.onLine(this.program.toUserLine(line));
        let vars = {};
        try { vars = snap ? snap() : {}; } catch (e) { vars = {}; }
        this.cb.onVars(vars);
        return;
      }
      // 1つの区切り（本体 or 1フレーム）が終わった
      if (this.phase === 'frame') this.frames++;
      this._checkpoint();
      if (this.state === 'idle' || this.state === 'error') return;
      if (!this.rt.frameFn) {
        this.gen = null;
        this._finish();
        return;
      }
      this.phase = 'frame';
      this.gen = this.hs.stepGenFor(this.rt.frameFn);
    }
  }

  pause() {
    if (this.state !== 'running') return;
    this._clearTimers();
    this._setState('paused');
  }

  resume() {
    if (this.state !== 'paused') return;
    this._setState('running');
    if (this.mode === 'step') this._schedule();
    else if (this.rt?.frameFn) this._loopNormal();
    else this._finish();
  }

  stop() {
    this._clearTimers();
    this.sendValue = undefined;
    if (this.rt) this.rt.destroy();
    this.gen = null;
    if (this.state !== 'idle') {
      this._setState('idle');
    }
    this.cb.onLine(null);
  }

  setSpeed(ms) { this.speed = ms; }

  /** クリア判定などに渡す実行結果 */
  result() {
    const drawCalls = this.rt ? this.rt.drawCalls : [];
    let vars = {};
    try { vars = this.hs ? this.hs.finalVars() : {}; } catch (e) { vars = {}; }
    return {
      vars,
      logs: this.rt ? [...this.rt.logs] : [],
      keys: [...this.keys],
      drawCalls,
      frames: this.frames,
      error: this.lastError || null,
      // 便利関数
      count(type) { return drawCalls.filter((c) => c.type === type).length; },
      find(type, pred = () => true) { return drawCalls.filter((c) => c.type === type && pred(c)); },
    };
  }

  // ---------- 内部 ----------

  _prepare(program, mode) {
    this.stop();
    this.program = program;
    this.lastError = null;
    this.frames = 0;
    this.keys = [];
    this.sendValue = undefined;
    this.rt = createRuntime(this.canvas, {
      onPrint: (s) => this.cb.onPrint(s),
      onAsyncError: (e) => this._fail(e),
      onKey: (k) => this._onKey(k),
    });
    this.rt.reset();
    this.hs = createHooks();
    try {
      const { code } = instrument(program.code, { mode, userStart: program.startLine, userEnd: program.endLine });
      return compile(code, mode, this.hs.hooks, this.rt.api);
    } catch (e) {
      this._fail(e);
      return null;
    }
  }

  // ---------- キー入力待ち（waitKey） ----------

  /** waitKey を使うコードの通常実行：ジェネレータ版を用意して止まらずに進める */
  _runDriven(program) {
    const factory = this._prepare(program, 'step');
    if (!factory) return;
    this.mode = 'normal';
    this.phase = 'main';
    try {
      this.gen = factory();
    } catch (e) {
      this._fail(e);
      return;
    }
    this._setState('running');
    this._drive();
  }

  /** gen を止まらずに進める。キー入力待ちで止まり、本体が終わったら通常実行と同じ後始末をする */
  _drive() {
    this.hs.resetOps();
    for (;;) {
      let r;
      try {
        r = this.gen.next(this.sendValue);
      } catch (e) {
        this._fail(e);
        return;
      }
      this.sendValue = undefined;
      if (!r.done) {
        if (r.value === WAIT_KEY) { this._beginWait(); return; }
        continue; // 行ごとの停止点は読み飛ばす
      }
      this.gen = null;
      this._checkpoint();
      if (this.state !== 'running') return;
      // onFrame は今までどおり（命令から呼ばれる関数は中で止まらない）
      if (this.rt.frameFn) this._loopNormal();
      else this._finish();
      return;
    }
  }

  _beginWait() {
    this._clearTimers();
    this._checkpoint();
    if (this.state === 'idle' || this.state === 'error') return;
    this._setState('waiting');
  }

  /** キーが押された（runtime から呼ばれる） */
  _onKey(key) {
    if (this.state !== 'waiting' || !this.gen) return;
    this.keys.push(key);
    this.sendValue = key;
    if (this.mode === 'normal') {
      this._setState('running');
      this._drive();
      return;
    }
    // インタプリタ実行：待っていた行の次へ1つ進め、自動ならそのまま続ける
    this._setState(this.stepAuto ? 'running' : 'paused');
    this.stepOnce();
    if (this.stepAuto && this.state === 'running') this._schedule();
  }

  _schedule() {
    this._clearTimers();
    this.timer = setTimeout(() => {
      if (this.state !== 'running') return;
      this.stepOnce();
      if (this.state === 'running') this._schedule();
    }, this.speed);
  }

  _loopNormal() {
    const tick = () => {
      if (this.state !== 'running' || !this.rt?.frameFn) return;
      try {
        this.hs.resetOps();
        this.rt.frameFn();
      } catch (e) {
        this._fail(e);
        return;
      }
      this.frames++;
      this._checkpoint();
      if (this.state === 'running') this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  _checkpoint() {
    try {
      this.cb.onCheckpoint(this.result(), this);
    } catch (e) {
      console.error(e);
    }
  }

  _finish() {
    this._clearTimers();
    this._setState('done');
    this.cb.onLine(null);
  }

  _fail(e) {
    this._clearTimers();
    if (this.rt) this.rt.destroy();
    this.gen = null;
    if (e?.internal) console.error(e);
    const info = describeError(e, this.program, this.hs?.state.line);
    this.lastError = info;
    this._setState('error');
    this.cb.onLine(null);
    this.cb.onError(info);
  }

  _clearTimers() {
    if (this.timer) clearTimeout(this.timer);
    if (this.raf) cancelAnimationFrame(this.raf);
    this.timer = null;
    this.raf = null;
  }

  _setState(s) {
    this.state = s;
    this.cb.onState(s, this.mode);
  }
}
