// 修行5: ループ魔法（while 文）

export default {
  id: 'l05',
  title: 'ループ魔法の修行',
  summary: '条件が true の間、同じことをくりかえそう。無限ループにも気をつけよう。',
  difficulty: 2,
  items: ['candle', 'owl', 'key'],
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>ループ魔法：〜の間くりかえす</h2>
      <p><code>while</code> は、<strong>条件が true の間、{ } の中を何度もくりかえす</strong>魔法だ。</p>
      <pre><code>while (条件) {
  // 条件が true の間、ここをくりかえす
}</code></pre>

      <h3>動きを追ってみる</h3>
      <pre><code>let coin = 0;
while (coin &lt; 3) {
  coin = coin + 1;
  print(coin);
}</code></pre>
      <table>
        <tr><th>回</th><th>条件 <code>coin &lt; 3</code></th><th>したこと</th></tr>
        <tr><td>1回目</td><td>0 &lt; 3 → true</td><td>coin が 1 になり、1 と出す</td></tr>
        <tr><td>2回目</td><td>1 &lt; 3 → true</td><td>coin が 2 になり、2 と出す</td></tr>
        <tr><td>3回目</td><td>2 &lt; 3 → true</td><td>coin が 3 になり、3 と出す</td></tr>
        <tr><td>—</td><td>3 &lt; 3 → <strong>false</strong></td><td>くりかえしを終わって、次の行へ</td></tr>
      </table>
      <p>「ゆっくり実行」で、条件の行と中身の行を行ったり来たりするようすを見てみよう。</p>

      <h3>無限ループに気をつけろ</h3>
      <p>条件がいつまでも false にならないと、くりかえしが<strong>永遠に終わらない</strong>。これを<strong>無限ループ</strong>という。</p>
      <pre><code>let coin = 0;
while (coin &lt; 3) {
  print(coin);   // coin を増やし忘れている！ ずっと 0 &lt; 3 のまま…
}</code></pre>
      <p>本物のゲームなら画面が固まってしまう。この道場では、長すぎると「処理が長すぎるため止めました」というエラーで止めてくれる。<strong>中身の中で、条件に使う変数がちゃんと変わっているか</strong>を確かめること。</p>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）</summary>
        <p><code>break;</code> と書くと、その場でくりかえしを終わらせられる。</p>
        <p>くりかえしの中に <code>waitKey()</code> を入れると、キーが押されるたびに1周する。<code>while (true) { … }</code> のように条件がずっと true でも、キーを待つ間は止まっているので固まらない。ゲームの「ターン」を作るときに役立つ技だ。</p>
      </details>
    `,
    sampleCode: `let coin = 0;
while (coin < 5) {
  coin = coin + 1;
  render(coin * 65, 200, "coin");
  print("コインを " + coin + " まい ひろった");
}
print("ぜんぶで " + coin + " まい！");`,
    master: ['while は「〜の間くりかえす」魔法だわ。', '条件がいつか false になるようにするのだぞよ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：たおれるまで、こうげき！</h3>
      <p>スライムの HP は <strong>20</strong>。レンのこうげきは1回で <strong>6</strong> ダメージ。</p>
      <ol>
        <li><code>while</code> を使って、<strong>HP が 0 より大きい間</strong>、こうげきをくりかえそう</li>
        <li>1回こうげきするたびに、HP を 6 へらして、<code>print("のこりHP " + hp);</code> と出そう</li>
        <li>くりかえしが終わったら、<strong>スライムをたおした！</strong> と出そう</li>
      </ol>
    `,
    answerCode: `let hp = 20;
render(200, 200, "slime");
while (hp > 0) {
  hp = hp - 6;
  print("のこりHP " + hp);
}
print("スライムをたおした！");`,
    hiddenLines: [3, 4, 5, 6, 7],
    starterCode: `let hp = 20;
render(200, 200, "slime");
`,
    refs: ['print'],
    master: ['HP をへらし忘れると、無限ループになるぞよ。'],
    failMessage: 'のこりHP が 14 → 8 → 2 → -4 と出て、最後に「たおした」と出ているかをたしかめるのだぞよ。',
  },

  check(result) {
    // 「のこりHP」の行から数を取り出して、14, 8, 2, -4 の順になっているか
    const hps = result.logs.filter((l) => l.includes('HP')).map((l) => Number((l.match(/-?\d+/) || [])[0]));
    const ok = JSON.stringify(hps) === JSON.stringify([14, 8, 2, -4]);
    return ok && result.vars.hp === -4 && result.logs.some((l) => l.includes('たおした'));
  },
};
