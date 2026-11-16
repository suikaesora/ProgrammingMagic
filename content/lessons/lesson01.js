// 修行1: 変数

export default {
  id: 'l01',
  title: '変数という箱',
  summary: '値に名前をつけて、何度でも使えるようにしよう。',
  difficulty: 1,
  items: ['hat', 'ribbon', 'crown'],
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>変数は「名前のついた箱」</h2>
      <p><code>let 名前 = 値;</code> と書くと、値を入れておく箱（変数）ができます。</p>
      <pre><code>let x = 100;</code></pre>
      <p>あとから <code>x = x + 120;</code> のように、中身を入れかえることもできます。</p>
      <p>「🐢 ゆっくり実行」を使うと、右下に<strong>変数の中身</strong>が表示されます。x がどう変わるか見てみよう。</p>
    `,
    sampleCode: `let x = 100;
let size = 40;
circle(x, 200, size);
x = x + 120;
circle(x, 200, size);
print("x は " + x);`,
    master: ['同じ数字を何度も書くなら、変数に入れるのじゃ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：おそろいの円</h3>
      <p>変数 <code>size</code> を作って <strong>60</strong> を入れよう。</p>
      <p>その <code>size</code> を使って、<code>(100, 200)</code> と <code>(300, 200)</code> に円をかこう。</p>
    `,
    answerCode: `let size = 60;
circle(100, 200, size);
circle(300, 200, size);`,
    // hiddenLines を省略すると自動で約8割の行を隠す
    starterCode: '',
    failMessage: '変数 size の値と、円の位置をたしかめよう。',
  },

  check(result) {
    const circles = result.drawCalls.filter((c) => c.type === 'circle');
    const has = (x) => circles.some((c) => c.args[0] === x && c.args[1] === 200 && c.args[2] === 60);
    return result.vars.size === 60 && has(100) && has(300);
  },
};
