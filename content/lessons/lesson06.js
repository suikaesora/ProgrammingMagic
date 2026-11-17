// 修行6: 段階ループ魔法（for 文）

export default {
  id: 'l06',
  title: '段階ループ魔法の修行',
  summary: 'for 文で、数を1つずつ増やしながら、決まった回数くりかえそう。',
  difficulty: 3,
  items: ['ring', 'amulet', 'mushroom'],
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>段階ループ魔法：決まった回数くりかえす</h2>
      <p>「5回くりかえす」のように、<strong>回数が決まっているくりかえし</strong>には <code>for</code> を使う。少し形がむずかしいので、ゆっくり読むのだぞ。</p>
      <pre><code>for (let i = 0; i &lt; 5; i++) {
  // ここが5回くりかえされる
}</code></pre>

      <h3>カッコの中は3つの部分</h3>
      <p><code>;</code> で3つに区切られている。</p>
      <table>
        <tr><th>部分</th><th>意味</th><th>いつ？</th></tr>
        <tr><td><code>let i = 0</code></td><td>数える箱 <code>i</code> を作り、0 を入れる</td><td>最初に1回だけ</td></tr>
        <tr><td><code>i &lt; 5</code></td><td>つづける条件</td><td>毎回の始まりに調べる。false なら終わり</td></tr>
        <tr><td><code>i++</code></td><td><code>i</code> を1増やす（<code>i = i + 1</code> と同じ）</td><td>毎回の終わりに</td></tr>
      </table>

      <h3>i の動き</h3>
      <p><code>i</code> は 0 → 1 → 2 → 3 → 4 と増え、5 になったところで <code>i &lt; 5</code> が false になって終わる。だから<strong>5回</strong>だ。</p>
      <p>実は、前の修行の <code>while</code> で書くとこうなる。<code>for</code> はこれを1行にまとめたものだ。</p>
      <pre><code>let i = 0;
while (i &lt; 5) {
  // くりかえす中身
  i++;
}</code></pre>

      <h3>i を使って、少しずつずらす</h3>
      <p><code>i</code> を計算に使うと、くりかえすたびにちがう位置に出せる。</p>
      <pre><code>for (let i = 0; i &lt; 5; i++) {
  render(50 + i * 75, 200, "star");
}</code></pre>
      <table>
        <tr><th>i</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
        <tr><th>50 + i * 75</th><td>50</td><td>125</td><td>200</td><td>275</td><td>350</td></tr>
      </table>
      <p>「はじめの位置 + i × 間かく」の形をおぼえておくと便利だ。</p>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）</summary>
        <p><code>i--</code> にすると1ずつ減らせる。<code>for (let i = 3; i &gt; 0; i--)</code> は 3, 2, 1 のカウントダウン。</p>
        <p><code>i += 2</code> にすると2ずつ増える。</p>
        <p>for の中に for を入れると、たてと横の両方にならべられる（二重ループ）。</p>
        <pre><code>for (let row = 0; row &lt; 3; row++) {
  for (let col = 0; col &lt; 4; col++) {
    render(60 + col * 90, 80 + row * 100, "coin");
  }
}</code></pre>
      </details>
    `,
    sampleCode: `for (let i = 0; i < 5; i++) {
  render(50 + i * 75, 200, "star");
  print("i は " + i);
}`,
    master: ['for は回数が決まったくりかえしの魔法だぞよ。', 'ゆっくり実行で、i が増えるようすを見るのだぞよ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：コインの道とスライムの列</h3>
      <ol>
        <li><code>for</code> を使って、コイン（<code>"coin"</code>）を <strong>8まい</strong>ならべよう。x は <strong>25, 75, 125, …</strong> と 50 ずつ増やし、y は <strong>300</strong></li>
        <li>もう1つ <code>for</code> を使って、スライムを <strong>3びき</strong>ならべよう。x は <strong>100, 200, 300</strong>、y は <strong>150</strong></li>
      </ol>
      <p>ヒント：「はじめの位置 + i × 間かく」</p>
    `,
    answerCode: `for (let i = 0; i < 8; i++) {
  render(25 + i * 50, 300, "coin");
}
for (let i = 0; i < 3; i++) {
  render(100 + i * 100, 150, "slime");
}`,
    hiddenLines: [1, 2, 4, 5],
    starterCode: '',
    refs: ['render'],
    sprites: ['coin', 'slime'],
    master: ['何回くりかえすか、i がいくつから始まるかを考えるのだぞよ。'],
    failMessage: 'コインが 8 まい（x が 25 から 375 まで）、スライムが 3 びき出ているかをたしかめるのだぞよ。',
  },

  check(result) {
    const xs = (name, y) => new Set(result.find('render', (c) => c.args[2] === name && c.args[1] === y).map((c) => c.args[0]));
    const coins = xs('coin', 300);
    const slimes = xs('slime', 150);
    for (let i = 0; i < 8; i++) if (!coins.has(25 + i * 50)) return false;
    return [100, 200, 300].every((x) => slimes.has(x));
  },
};
