// 正規表現による基本的なシンタックスハイライト（完全な解析はしない）
import { escapeHtml } from '../core/format.js';

const KEYWORDS = [
  'let', 'const', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'break', 'continue',
  'new', 'class', 'extends', 'this', 'true', 'false', 'null', 'undefined', 'of', 'in', 'typeof',
  'switch', 'case', 'default', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'yield', 'instanceof',
];

const TOKEN_RE = new RegExp([
  '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?(?:\\*\\/|$))',                                           // 1 コメント
  '("(?:[^"\\\\\\n]|\\\\.)*"?|\'(?:[^\'\\\\\\n]|\\\\.)*\'?|`(?:[^`\\\\]|\\\\[\\s\\S])*`?)', // 2 文字列
  '(\\b\\d+(?:\\.\\d+)?\\b)',                                                                // 3 数値
  `(\\b(?:${KEYWORDS.join('|')})\\b)`,                                                       // 4 キーワード
  '([A-Za-z_$][\\w$]*)(?=\\s*\\()',                                                          // 5 関数呼び出し
].join('|'), 'g');

export function highlight(code) {
  let out = '';
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let m;
  while ((m = TOKEN_RE.exec(code))) {
    if (m[0] === '') { TOKEN_RE.lastIndex++; continue; }
    out += escapeHtml(code.slice(last, m.index));
    const cls = m[1] ? 'com' : m[2] ? 'str' : m[3] ? 'num' : m[4] ? 'kw' : 'fn';
    out += `<span class="tk-${cls}">${escapeHtml(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  out += escapeHtml(code.slice(last));
  return out;
}
