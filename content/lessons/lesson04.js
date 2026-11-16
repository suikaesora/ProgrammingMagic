// 修行4: 分岐魔法（if 文）＋ キー入力を待つ waitKey()

export default {
  id: 'l04',
  title: '分岐魔法の修行',
  summary: '押されたキーによって、起きることを変えよう。',
  difficulty: 2,
  items: ['wand', 'spellbook', 'crystal'],
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>分岐魔法：もし〜なら</h2>
      <p>「もし〜なら、これをする」という魔法だ。<code>( )</code> の中の条件が <strong>true のときだけ</strong>、<code>{ }</code> の中が実行される。</p>
      <pre><code>if (条件) {
  // 条件が true のときだけ、ここが実行される
}</code></pre>
      <p>条件には、計算魔法の修行で学んだ<strong>比べる計算</strong>を使う。</p>

      <h3>そうでなければ：else</h3>
      <pre><code>if (hp &gt; 0) {
  print("まだ戦える");
} else {
  print("たおれてしまった…");   // 条件が false のときはこちら
}</code></pre>

      <h3>3つ以上に分ける：else if</h3>
      <pre><code>if (key === "1") {
  print("こうげき");
} else if (key === "2") {
  print("にげる");
} else {
  print("なにもしない");   // どれにも当てはまらないとき
}</code></pre>
      <p>上から順に調べて、<strong>最初に当てはまった1つだけ</strong>が実行される。</p>

      <h3>キーを待つ魔法：waitKey</h3>
      <pre><code>let key = waitKey();</code></pre>
      <p>キーが押されるまで、コードはこの行で<strong>止まって待つ</strong>。押されたら、そのキーの名前が箱 <code>key</code> に入って、次の行へ進む。</p>
      <ul>
        <li>実行したら、まず<strong>キャンバスをクリック</strong>してからキーを押す</li>
        <li>キーの名前は文字なので、比べるときは <code>key === "1"</code> のように <code>"</code> で囲む</li>
        <li>名前の例：<code>"1"</code> <code>"2"</code> <code>"a"</code> <code>" "</code>（スペース） <code>"ArrowUp"</code>（↑） <code>"Enter"</code></li>
      </ul>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）</summary>
        <p>条件には <code>&amp;&amp;</code>（かつ）や <code>||</code>（または）も使える。<code>if (key === "1" || key === "a") { … }</code> なら、1 でも a でも実行される。</p>
        <p><code>{ }</code> の中は、Tab キーで字下げ（インデント）しておくと、どこからどこまでが中身か見やすくなる。</p>
        <p>日本語入力がオンのままでも数字や英字のキーは受け取れるが、オフにしておくと安心だ。</p>
      </details>
    `,
    sampleCode: `render(300, 200, "slime");
print("スライムがあらわれた！");
print("1: こうげき　2: にげる");
let key = waitKey();
if (key === "1") {
  print("レンのこうげき！");
  render(300, 120, "star");
} else if (key === "2") {
  print("レンはにげだした！");
} else {
  print("……なにも おこらなかった");
}`,
    master: ['if は「もし〜なら」の魔法だわ。', '実行したら、キャンバスをクリックしてからキーを押すのだぞよ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：魔法をえらべ</h3>
      <p>最初から書いてあるコードは、キーが押されるのを待って、押されたキーを <code>key</code> に入れている。その下に続けて書こう。</p>
      <ul>
        <li><code>"1"</code> なら：ほのお（<code>"fire"</code>）を <code>(300, 250)</code> に出し、<strong>ほのおの魔法！</strong> と print</li>
        <li><code>"2"</code> なら：やくそう（<code>"herb"</code>）を <code>(100, 150)</code> に出し、<strong>HPが回復した！</strong> と print</li>
        <li>それ以外なら：<strong>なにもしなかった</strong> と print</li>
      </ul>
      <p>1 も 2 も、ほかのキーも、ためしてみよう。</p>
    `,
    answerCode: `render(100, 250, "ren");
render(300, 250, "slime");
print("1: ほのおの魔法　2: やくそう");
let key = waitKey();
if (key === "1") {
  render(300, 250, "fire");
  print("ほのおの魔法！");
} else if (key === "2") {
  render(100, 150, "herb");
  print("HPが回復した！");
} else {
  print("なにもしなかった");
}`,
    hiddenLines: [5, 6, 7, 8, 9, 10, 11, 12, 13],
    starterCode: `render(100, 250, "ren");
render(300, 250, "slime");
print("1: ほのおの魔法　2: やくそう");
let key = waitKey();
`,
    refs: ['waitKey', 'render', 'print'],
    sprites: ['fire', 'herb', 'ren', 'slime'],
    master: ['押したキーによって、起きることを変えるのだぞよ。'],
    failMessage: '押したキーに合った動きになっているか、画像の位置と print の文字をたしかめるのだぞよ。',
  },

  check(result) {
    const key = result.keys[0];
    if (key === undefined) return false; // まだキーが押されていない
    const fire = result.find('render', (c) => c.args[2] === 'fire');
    const herb = result.find('render', (c) => c.args[2] === 'herb');
    const said = (w) => result.logs.some((l) => l.includes(w));
    if (key === '1') return fire.some((c) => c.args[0] === 300 && c.args[1] === 250) && said('ほのおの魔法') && herb.length === 0;
    if (key === '2') return herb.some((c) => c.args[0] === 100 && c.args[1] === 150) && said('回復') && fire.length === 0;
    return said('なにもしなかった') && fire.length === 0 && herb.length === 0;
  },
};
