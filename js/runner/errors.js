// エラーメッセージを初学者向けの日本語にする

const RULES = [
  [/^(.+) is not defined$/, (m) => `「${m[1]}」という名前が見つかりません。スペルまちがいや、変数を作り忘れていないか確認しよう。`],
  [/^(.+) is not a function$/, (m) => `「${m[1]}」は関数ではないので、( ) をつけて呼び出せません。`],
  [/Cannot read propert(?:y|ies) of (undefined|null)(?: \(reading '(.+)'\))?/, (m) => `${m[1]} から${m[2] ? `「${m[2]}」を` : '値を'}取り出そうとしました。変数に値が入っているか確認しよう。`],
  [/Cannot set propert(?:y|ies) of (undefined|null)/, (m) => `${m[1]} に値を入れようとしました。`],
  [/Assignment to constant variable/, () => 'const で作った変数には、あとから値を入れなおせません。let を使おう。'],
  [/Cannot access '(.+)' before initialization/, (m) => `「${m[1]}」を作る前に使おうとしました。順番を確認しよう。`],
  [/Identifier '(.+)' has already been declared/, (m) => `「${m[1]}」という名前の変数を2回作っています。`],
  [/Unexpected token/, () => '書き方（文法）にまちがいがあります。カッコや記号の数・位置を確認しよう。'],
  [/Unexpected character/, () => '使えない文字が入っています。全角の記号やスペースになっていないか確認しよう。'],
  [/Unterminated string constant/, () => '文字列が閉じられていません。" や \' の数を確認しよう。'],
  [/Unterminated template/, () => 'テンプレート文字列（`）が閉じられていません。'],
  [/Unterminated comment/, () => 'コメント /* が閉じられていません。'],
  [/Unexpected end of input|Unexpected token \(\d+:\d+\)$/, () => 'コードが途中で終わっています。} や ) の閉じ忘れがないか確認しよう。'],
  [/Invalid or unexpected token/, () => '使えない文字が入っています。全角の記号やスペースになっていないか確認しよう。'],
  [/Maximum call stack size exceeded|too much recursion/, () => '関数が自分自身を呼び続けて止まらなくなりました。'],
  [/処理が長すぎる/, () => '処理が長すぎるため止めました。無限ループになっていないか確認しよう。'],
];

export function friendlyMessage(err) {
  const msg = String(err?.message ?? err);
  for (const [re, fn] of RULES) {
    const m = msg.match(re);
    if (m) return fn(m);
  }
  return null;
}

/**
 * エラーを画面表示用の形にする
 * @returns {{ title: string, message: string, original: string, line: number|null, userLine: number|null }}
 */
export function describeError(err, program, runtimeLine) {
  const isSyntax = err?.name === 'SyntaxError';
  const line = isSyntax && err.line ? err.line : runtimeLine ?? null;
  const userLine = program?.toUserLine(line) ?? null;
  const original = `${err?.name || 'Error'}: ${err?.message ?? err}`;
  const friendly = friendlyMessage(err) || (isSyntax ? '書き方（文法）にまちがいがあります。' : '実行中にエラーが起きました。');
  const where = userLine ? `${userLine}行目` : line ? '（修行の土台のコード）' : '';
  return {
    title: isSyntax ? '文法エラー' : 'エラー',
    message: friendly,
    original,
    line,
    userLine,
    where,
  };
}
