// 修行2: くりかえし（for 文）

export default {
  id: 'l02',
  title: 'くりかえしの術',
  summary: 'for 文で、同じ動きを何度もくりかえそう。',
  difficulty: 2,
  items: ['glasses', 'cloud', 'moon'],
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>for 文でくりかえす</h2>
      <pre><code>for (let i = 0; i < 5; i++) {
  // ここが5回くりかえされる
}</code></pre>
      <p><code>i</code> は 0, 1, 2, 3, 4 と1ずつ増えていきます。</p>
      <p><code>40 + i * 80</code> のように i を計算に使うと、少しずつずれた位置に円をかけます。</p>
      <p><code>fill("色")</code> で塗りの色を変えられます。</p>
    `,
    sampleCode: `fill("gold");
for (let i = 0; i < 5; i++) {
  circle(40 + i * 80, 200, 30);
}`,
    master: ['1行ずつ実行で、i が増えていくようすを見るとよいぞ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：円の行列</h3>
      <p>for 文を使って、半径 15 の円を <strong>10個</strong>、横一列にならべよう。</p>
      <p>x 座標は 20, 60, 100, … と <strong>40ずつ</strong> 増やし、y 座標は 200 にしよう。</p>
    `,
    answerCode: `fill("skyblue");
for (let i = 0; i < 10; i++) {
  circle(20 + i * 40, 200, 15);
}`,
    hiddenLines: [1, 2, 3],
    starterCode: '',
    failMessage: '円の数と、x 座標の増え方をたしかめよう。',
  },

  check(result) {
    const xs = result.drawCalls
      .filter((c) => c.type === 'circle' && c.args[1] === 200 && c.args[2] === 15)
      .map((c) => c.args[0]);
    for (let i = 0; i < 10; i++) if (!xs.includes(20 + i * 40)) return false;
    return true;
  },
};
