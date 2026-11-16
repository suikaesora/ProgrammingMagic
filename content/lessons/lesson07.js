// 修行7: 命令生み出し魔法（関数の定義・引数・返り値）

export default {
  id: 'l07',
  title: '命令生み出し魔法の修行',
  summary: '自分だけの命令（関数）を作って、何度でも呼び出そう。',
  difficulty: 3,
  items: ['scroll', 'gem', 'feather'],
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>命令生み出し魔法：自分の命令を作る</h2>
      <p>これまで <code>print</code> や <code>render</code> を使ってきたが、命令は<strong>自分で作る</strong>こともできる。自分で作った命令を<strong>関数</strong>という。</p>
      <pre><code>function 命令の名前() {
  // 呼び出されたときに実行する中身
}</code></pre>
      <p>作っただけでは動かない。<strong>呼び出したときに</strong>中身が実行される。呼び出し方は、いつもの命令と同じだ。</p>
      <pre><code>function shout() {
  print("いくぞ！");
}
shout();   // 「いくぞ！」
shout();   // 何度でも呼べる</code></pre>

      <h3>材料を受け取る：引数</h3>
      <p>カッコの中に名前を書くと、呼び出すときにわたした材料が、その名前の箱に入る。</p>
      <pre><code>function summon(x, y) {
  render(x, y, "slime");
}
summon(100, 200);   // x に 100、y に 200 が入る
summon(300, 200);   // x に 300、y に 200 が入る</code></pre>

      <h3>答えを返す：return</h3>
      <p><code>return 値;</code> と書くと、その値が<strong>呼び出した場所にもどってくる</strong>。計算をする命令を作るときに使う。</p>
      <pre><code>function double(n) {
  return n * 2;
}
print(double(21));        // double(21) が 42 にかわって、42 と出る
let power = double(5);    // 箱に入れることもできる（10）</code></pre>

      <h3>関数のよいところ</h3>
      <ul>
        <li>同じことを何度も書かなくてよい</li>
        <li>中身を1か所なおせば、呼び出している全部がなおる</li>
        <li>名前がつくので、コードが読みやすくなる</li>
      </ul>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）：名前のない関数</summary>
        <p>関数は、こう書くこともできる。<code>=&gt;</code> は「アロー（矢印）」とよぶ。</p>
        <pre><code>const double = (n) =&gt; {
  return n * 2;
};</code></pre>
        <p>次の修行で使う <code>onFrame(() =&gt; { … });</code> の <code>() =&gt; { … }</code> も、この「名前のない関数」だ。命令の材料として、関数そのものをわたしているのだ。</p>
        <p><code>return</code> を実行すると、関数はそこで終わる。その下の行は実行されない。</p>
      </details>
    `,
    sampleCode: `function summon(x, y) {
  render(x, y, "slime");
  print("スライムがあらわれた！");
}
summon(100, 200);
summon(300, 200);

function double(n) {
  return n * 2;
}
print(double(21));`,
    master: ['よく使う魔法は、命令にしてしまうのだわ。', 'return は、答えを呼んだ場所へ返すのだぞよ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：命令を生み出せ</h3>
      <ol>
        <li>引数 <code>x</code> を受け取る関数 <code>appear</code> を作ろう。中身は：<code>(x, 250)</code> にスライムを出し、<strong>スライムがあらわれた！</strong> と print</li>
        <li><code>appear(100);</code> と <code>appear(300);</code> で2回呼び出そう</li>
        <li>引数 <code>atk</code> と <code>def</code> を受け取り、<strong><code>atk - def</code> を return する</strong>関数 <code>damage</code> を作ろう</li>
        <li><code>print(damage(12, 5));</code> で、ダメージ（7）を出そう</li>
      </ol>
    `,
    answerCode: `function appear(x) {
  render(x, 250, "slime");
  print("スライムがあらわれた！");
}
appear(100);
appear(300);

function damage(atk, def) {
  return atk - def;
}
print(damage(12, 5));`,
    hiddenLines: [1, 2, 3, 5, 6, 8, 9, 11],
    starterCode: '',
    refs: ['render', 'print'],
    sprites: ['slime'],
    master: ['作った関数は、呼び出さないと動かないぞよ。'],
    failMessage: '関数の名前（appear と damage）、引数、return をたしかめるのだぞよ。',
  },

  check(result) {
    const v = result.vars;
    if (typeof v.appear !== 'function' || typeof v.damage !== 'function') return false;
    const at = (x) => result.find('render', (c) => c.args[2] === 'slime' && c.args[0] === x && c.args[1] === 250).length > 0;
    // damage がちゃんと計算して返しているか、別の数でもためす
    let ok = false;
    try { ok = v.damage(20, 8) === 12 && v.damage(5, 5) === 0; } catch (e) { ok = false; }
    return ok && at(100) && at(300) && result.logs.includes('7');
  },
};
