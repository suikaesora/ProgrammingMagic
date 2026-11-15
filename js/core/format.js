// 値を人が読みやすい文字列にする（print と変数表示で共通）

export const UNINIT = Symbol('uninitialized');

export function formatValue(v, depth = 0) {
  if (v === UNINIT) return '（まだ作られていない）';
  if (typeof v === 'string') return depth === 0 ? v : JSON.stringify(v);
  if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint') return String(v);
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return `ƒ ${v.name || '関数'}`;
  if (typeof v === 'symbol') return v.toString();
  if (depth > 2) return Array.isArray(v) ? '[…]' : '{…}';
  if (Array.isArray(v)) {
    const items = v.slice(0, 20).map((x) => formatValue(x, depth + 1));
    if (v.length > 20) items.push(`…他${v.length - 20}個`);
    return `[${items.join(', ')}]`;
  }
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  try {
    const keys = Object.keys(v).slice(0, 12);
    const body = keys.map((k) => `${k}: ${formatValue(v[k], depth + 1)}`).join(', ');
    return `{${body}${Object.keys(v).length > 12 ? ', …' : ''}}`;
  } catch (e) {
    return String(v);
  }
}

/** 変数表示用（文字列は "" つき） */
export function formatForVars(v) {
  if (typeof v === 'string') return JSON.stringify(v);
  return formatValue(v, 0);
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
