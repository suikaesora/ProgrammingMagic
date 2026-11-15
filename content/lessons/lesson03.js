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
      <p>この修行では <code>ground</code>（地面の高さ）と <code>drawGround()</code>（地面をかく）が最初から用意されています。</p>
      <p>キー入力は <code>keyIsDown("ArrowRight")</code> で調べられます（キャンバスをクリックしてから押そう）。</p>
    `,
    sampleCode: `let x = 0;
onFrame(() => {
  background("white");
  drawGround();
  circle(x, ground - 20, 20);
  x = x + 2;
  if (x > WIDTH) {
    x = 0;
  }
});`,
    master: ['動きは「消して・ずらして・かく」のくりかえしじゃ。'],
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
    starterCode: `let x = 50;
onFrame(() => {
  background("white");
  drawGround();
  // ここに →キーの処理を書こう

  circle(x, ground - 20, 20);
});`,
    failMessage: '→キーを押したときに x が増えるようになっているかな？',
  },

  check(result) {
    return typeof result.vars.x === 'number' && result.vars.x >= 300;
  },
};
