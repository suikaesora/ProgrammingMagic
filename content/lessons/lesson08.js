// 修行8: 高速ループ魔法（onFrame によるゲームのメインループ）

export default {
  id: 'l08',
  title: '高速ループ魔法の修行',
  summary: '1秒に60回くりかえす onFrame で、キーで動くゲームを作ろう。',
  difficulty: 3,
  items: ['lantern', 'bell', 'clover'],
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>高速ループ魔法：ゲームの心臓</h2>
      <p>ゲームの画面は、<strong>1秒に60回</strong>かきなおされている。パラパラまんがのように、少しずつちがう絵を次々に見せることで、動いて見えるのだ。</p>
      <p>このくりかえしを<strong>メインループ</strong>という。この道場では <code>onFrame</code> という命令で作る。</p>
      <pre><code>onFrame(() =&gt; {
  // ここが1秒に約60回くりかえされる
});</code></pre>
      <p><code>() =&gt; { … }</code> は、前の修行のTIPSで紹介した「名前のない関数」だ。「毎回これを実行してくれ」と、関数そのものを <code>onFrame</code> にわたしている。</p>

      <h3>毎回することは3つ</h3>
      <ol>
        <li><strong>消す</strong>：<code>background("white");</code> で前の絵を消す</li>
        <li><strong>動かす</strong>：位置などの変数を少し変える</li>
        <li><strong>かく</strong>：今の位置に絵をかく</li>
      </ol>
      <pre><code>let x = 0;            // ← 位置の箱は onFrame の「外」で作る
onFrame(() =&gt; {
  background("white"); // 1. 消す
  x = x + 2;           // 2. 動かす
  render(x, 200, "slime"); // 3. かく
});</code></pre>
      <p class="note">位置などの変数は、<strong>onFrame の外</strong>で作ること。中で <code>let x = 0;</code> と書くと、毎回 0 にもどってしまい動かない。</p>

      <h3>キーで動かす：keyIsDown</h3>
      <p><code>keyIsDown("キー")</code> は、そのキーを<strong>押している間ずっと true</strong> になる。メインループの中で if と組み合わせると、押している間だけ動かせる。</p>
      <pre><code>if (keyIsDown("ArrowRight")) {
  x = x + 3;   // → を押している間、右へ
}</code></pre>
      <p>キーの名前：<code>"ArrowRight"</code>（→） <code>"ArrowLeft"</code>（←） <code>"ArrowUp"</code>（↑） <code>"ArrowDown"</code>（↓） <code>" "</code>（スペース）。キャンバスをクリックしてから押す。</p>
      <p class="note"><code>waitKey()</code> は「1回押すまで待つ」、<code>keyIsDown()</code> は「今押しているか調べるだけで待たない」。メインループの中では <code>keyIsDown()</code> を使う。</p>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）：ゲームに役立つ形</summary>
        <p><strong>当たり判定</strong>：2つのものの x の差が小さければ「ぶつかった」とみなせる。<code>Math.abs(a - b)</code> は a と b の差（マイナスなら プラスにしたもの）。</p>
        <pre><code>if (Math.abs(x - 350) &lt; 40) {
  text("ぶつかった！", 120, 100, 24);
}</code></pre>
        <p><strong>画面のはしで止める</strong>：<code>if (x &gt; WIDTH) { x = WIDTH; }</code>（<code>WIDTH</code> はキャンバスの幅 400）</p>
        <p><strong>時間をはかる</strong>：<code>let frame = 0;</code> を作って onFrame の中で <code>frame++</code> すれば、60 になったら1秒たったとわかる。</p>
      </details>
    `,
    sampleCode: `let x = 0;
onFrame(() => {
  background("white");
  render(x, 200, "slime");
  x = x + 2;
  // 右のはしをこえたら左にもどる
  if (x > WIDTH) {
    x = 0;
  }
  // スペースを押している間は、上に星を出す
  if (keyIsDown(" ")) {
    render(x, 130, "star");
  }
});`,
    master: ['ゲームは「消す・動かす・かく」のくりかえしだぞよ。', 'スペースキーも押してみるのだぞよ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：たからばこまで、すすめ！</h3>
      <ol>
        <li><strong>→キー</strong>を押している間、レンが右へ動くようにしよう（<code>x</code> を 3 ずつ増やす）</li>
        <li><strong>←キー</strong>を押している間、左へ動くようにしよう（<code>x</code> を 3 ずつ減らす）</li>
        <li><code>x</code> が <strong>300 より大きく</strong>なったら、<code>text("たからばこを見つけた！", 90, 100, 24);</code> で文字を出そう</li>
      </ol>
      <p>実行したらキャンバスをクリックして、レンをたからばこまで動かそう。</p>
    `,
    answerCode: `let x = 50;
onFrame(() => {
  background("white");
  render(350, 300, "chest");
  if (keyIsDown("ArrowRight")) {
    x = x + 3;
  }
  if (keyIsDown("ArrowLeft")) {
    x = x - 3;
  }
  if (x > 300) {
    text("たからばこを見つけた！", 90, 100, 24);
  }
  render(x, 300, "ren");
});`,
    // starterCode と同じ行は隠さない
    hiddenLines: [5, 6, 7, 8, 9, 10, 11, 12, 13],
    starterCode: `let x = 50;
onFrame(() => {
  background("white");
  render(350, 300, "chest");
  // ここに →キー・←キー・見つけたときの処理を書こう

  render(x, 300, "ren");
});`,
    refs: ['keyIsDown', 'text', 'onFrame', 'render', 'background'],
    sprites: ['ren', 'chest'],
    master: ['実行したら、キャンバスをクリックしてから矢印キーを押すのだぞよ。'],
    failMessage: '→キーで x が増えるか、x が 300 をこえたら文字が出るかをたしかめるのだぞよ。',
  },

  check(result) {
    if (typeof result.vars.x !== 'number' || result.vars.x <= 300) return false;
    return result.find('text', (c) => String(c.args[0]).includes('見つけた')).length > 0;
  },
};
