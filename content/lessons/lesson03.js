// 修行3: アニメーションとキー入力（全体コード template の使用例）

export default {
  id: 'l03',
  title: 'うごけ！ボール',
  summary: 'onFrame とキー入力で、ゲームのように動かそう。',
  difficulty: 3,
  items: ['note', 'leaf', 'balloon'],

  // 修行ごとの全体コード。学習者のコードは /*@USER@*/ に入る。
  // ここで定義した ground や drawGround() は学習者のコードから使える。
  template: `// ===== 修行の土台（自動で用意されています） =====
const ground = 320;
function drawGround() {
  fill("#8bc28c");
  rect(0, ground, WIDTH, HEIGHT - ground);
  fill("tomato");
}
// ===== ここから下にあなたのコードが入ります =====
/*@USER@*/`,

  explain: {
    html: `
      <h2>毎フレームくりかえす onFrame</h2>
      <p><code>onFrame(() =&gt; { … });</code> の中に書いたコードは、<strong>1秒に約60回</strong>くりかえし実行されます。</p>
      <p>毎回 <code>background("white")</code> で画面を消してから少しずらしてかくと、動いているように見えます。</p>

      <h3>もし〜なら：if 文</h3>
      <pre><code>if (条件) {
  // 条件が true のときだけ、ここが実行される
}</code></pre>
      <p>お手本では <code>x &gt; WIDTH</code>（右はしをこえた）ときだけ、<code>x</code> を 0 にもどしています。</p>

      <h3>キーを押しているか調べる</h3>
      <p><code>keyIsDown("キー")</code> は、そのキーを押している間だけ <code>true</code> になります。if 文の条件に使えます。</p>
      <p>キーの名前：<code>"ArrowRight"</code>（→） <code>"ArrowLeft"</code>（←） <code>"ArrowUp"</code>（↑） <code>"ArrowDown"</code>（↓） <code>" "</code>（スペース）</p>
      <p>お手本を実行したら<strong>キャンバスをクリック</strong>して、スペースキーを押してみよう。押している間だけボールが金色になります。</p>

      <p>この修行では <code>ground</code>（地面の高さ）と <code>drawGround()</code>（地面をかく）が最初から用意されています。</p>
    `,
    sampleCode: `let x = 0;
onFrame(() => {
  background("white");
  drawGround();
  // スペースキーを押している間は金色
  if (keyIsDown(" ")) {
    fill("gold");
  }
  circle(x, ground - 20, 20);
  x = x + 2;
  // 右はしをこえたら左にもどる
  if (x > WIDTH) {
    x = 0;
  }
});`,
    master: ['動きは「消して・ずらして・かく」のくりかえしじゃ。', 'if 文を使えば「〜のときだけ」動かせるぞ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：→キーで進め</h3>
      <p>変数 <code>x</code> を作り、<strong>→キーを押している間だけ</strong>ボールが右へ動くようにしよう。</p>
      <p>実行してキャンバスをクリックし、→キーで <code>x</code> を <strong>300以上</strong> にできたらクリア！</p>
    `,
    answerCode: `let x = 50;
onFrame(() => {
  background("white");
  drawGround();
  if (keyIsDown("ArrowRight")) {
    x = x + 4;
  }
  circle(x, ground - 20, 20);
});`,
    // 自動だと答えの if 行が見えてしまうので、→キーの処理（5〜7行目）だけを隠す。
    // ほかの行は starterCode と同じなので隠す意味がない
    hiddenLines: [5, 6, 7],
    starterCode: `let x = 50;
onFrame(() => {
  background("white");
  drawGround();
  // ここに →キーの処理を書こう

  circle(x, ground - 20, 20);
});`,
    failMessage: '→キーを押したときに x が増えるようになっているかな？',
    refs: [
      'keyIsDown',
      'circle',
      'background',
      'onFrame',
      { sig: 'drawGround()', desc: '地面をかく（この修行で用意）' },
      { sig: 'ground', desc: '地面の高さ（320）（この修行で用意）' },
    ],
  },

  check(result) {
    return typeof result.vars.x === 'number' && result.vars.x >= 300;
  },
};
