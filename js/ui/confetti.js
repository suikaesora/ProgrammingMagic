// 紙吹雪（単色の紙片。グラデーションは使わない）

function themeColors() {
  const cs = getComputedStyle(document.documentElement);
  const get = (n) => cs.getPropertyValue(n).trim();
  return [get('--c-accent'), get('--c-success'), get('--syn-number'), get('--syn-func'), '#f2c94c'].filter(Boolean);
}

/**
 * @param {{count?:number, duration?:number, origin?:{x:number,y:number}|null}} opts
 * @returns {() => void} 途中で止める関数
 */
export function confetti({ count = 140, duration = 4200, origin = null } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const resize = () => {
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);
  const colors = themeColors();
  const parts = Array.from({ length: count }, () => {
    const ox = origin ? origin.x : Math.random() * innerWidth;
    const oy = origin ? origin.y : -20 - Math.random() * innerHeight * 0.3;
    const ang = origin ? -Math.PI / 2 + (Math.random() - 0.5) * 1.6 : Math.PI / 2;
    const sp = origin ? 6 + Math.random() * 8 : 1 + Math.random() * 2;
    return {
      x: ox, y: oy,
      vx: Math.cos(ang) * sp + (origin ? 0 : (Math.random() - 0.5) * 1.5),
      vy: Math.sin(ang) * sp,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() < 0.3 ? 'circle' : 'rect',
    };
  });
  const start = performance.now();
  let raf;
  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    canvas.remove();
  };
  const frame = (t) => {
    const el = t - start;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalAlpha = el > duration - 800 ? Math.max(0, (duration - el) / 800) : 1;
    for (const p of parts) {
      p.vy += 0.12;
      p.vx *= 0.99;
      p.vy = Math.min(p.vy, 4.5);
      p.x += p.vx + Math.sin((el / 300) + p.rot) * 0.6;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (el < duration) raf = requestAnimationFrame(frame);
    else stop();
  };
  raf = requestAnimationFrame(frame);
  return stop;
}
