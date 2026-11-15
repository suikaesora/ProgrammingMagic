// 全体コード（template）に学習者のコードを埋め込み、行番号の対応を管理する

export const USER_MARKER = '/*@USER@*/';

/**
 * @param {string|undefined} template 全体コード。USER_MARKER の位置に埋め込む
 * @param {string} userCode 学習者のコード（またはお手本コード）
 */
export function buildProgram(template, userCode) {
  const tpl = template ?? USER_MARKER;
  let idx = tpl.indexOf(USER_MARKER);
  let before, after;
  if (idx < 0) {
    console.warn('template に /*@USER@*/ がありません。末尾に追加します。');
    before = tpl + '\n';
    after = '';
  } else {
    before = tpl.slice(0, idx);
    after = tpl.slice(idx + USER_MARKER.length);
  }
  const startLine = before.split('\n').length;
  const userLineCount = userCode.split('\n').length;
  const endLine = startLine + userLineCount - 1;
  return {
    code: before + userCode + after,
    startLine,
    endLine,
    /** 全体コードの行番号 → 学習者コードの行番号（範囲外なら null） */
    toUserLine(line) {
      if (line == null) return null;
      return line >= startLine && line <= endLine ? line - startLine + 1 : null;
    },
  };
}
