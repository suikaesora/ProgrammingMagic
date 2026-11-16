// 修行1: 命令魔法（関数の呼び出し）

export default {
  id: 'l01',
  title: '命令魔法の修行',
  summary: '命令の名前と材料を書いて、文字を出したり画像を呼び出したりしよう。',
  difficulty: 1,
  items: ['hat', 'ribbon', 'crown'],
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>命令魔法：命令の名前(材料)</h2>
      <p>プログラミングの魔法は、<strong>命令</strong>の組み合わせでできている。命令はいつもこの形で書く。</p>
      <pre><code>命令の名前(材料, 材料, …);</code></pre>
      <p>カッコの中の材料のことを<strong>引数（ひきすう）</strong>という。材料が2つ以上あるときは <code>,</code>（カンマ）で区切る。最後の <code>;</code> は「ここで1つの命令はおしまい」という印だ。</p>

      <h3>print：文字を出す命令</h3>
      <pre><code>print("こんにちは");</code></pre>
      <p>キャンバスの下の出力に文字を出す。<strong>文字は <code>"</code>（ダブルクオーテーション）で囲む</strong>のが決まりだ。</p>
      <p class="note"><code>"</code> は、<strong>Shift キーを押しながら 2</strong> で打てる。日本語入力はオフ（半角）にしておくこと。</p>

      <h3>render：画像を呼び出す命令</h3>
      <pre><code>render(x, y, "画像の名前");</code></pre>
      <p>キャンバスの <code>(x, y)</code> の位置に、画像を呼び出す。<code>(x, y)</code> は画像の<strong>まんなか</strong>になる。</p>
      <ul>
        <li>キャンバスは横 400 × 縦 400。左上が <code>(0, 0)</code>、右下が <code>(400, 400)</code></li>
        <li><strong>x は右へいくほど大きく、y は下へいくほど大きく</strong>なる（下が大きいのに注意）</li>
        <li>まんなかは <code>(200, 200)</code></li>
      </ul>
      <p>画像の名前も文字なので <code>"</code> で囲む。数字は囲まない。</p>

      <h3>よくあるまちがい</h3>
      <table>
        <tr><th>まちがい</th><th>正しい書き方</th></tr>
        <tr><td><code>print(こんにちは);</code></td><td><code>print("こんにちは");</code>（" を忘れない）</td></tr>
        <tr><td><code>print(”こんにちは”);</code></td><td>全角の ” ではなく半角の " を使う</td></tr>
        <tr><td><code>render(200 200 "ren");</code></td><td><code>render(200, 200, "ren");</code>（カンマで区切る）</td></tr>
      </table>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）</summary>
        <p>命令の名前は<strong>大文字と小文字を区別</strong>する。<code>Print</code> や <code>RENDER</code> では動かない。</p>
        <p><code>render</code> には4つ目の材料として<strong>幅</strong>を入れられる。<code>render(200, 200, "slime", 160);</code> と書くと、スライムが大きくなる（縦横の比はそのまま）。</p>
        <p>文字は <code>'</code>（シングルクオーテーション）で囲んでもよいが、この修行では <code>"</code> にそろえる。</p>
      </details>
    `,
    sampleCode: `print("いでよ、スライム！");
render(200, 120, "zork");
render(100, 280, "slime");
render(300, 280, "slime", 120);`,
    master: ['命令魔法は、すべての魔法の基本だわ。', '" は Shift を押しながら 2 で打つのだぞよ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：レンとスライムのにらみあい</h3>
      <ol>
        <li><code>(100, 250)</code> に<strong>レン</strong>（<code>"ren"</code>）を呼び出そう</li>
        <li><code>(300, 250)</code> に<strong>スライム</strong>（<code>"slime"</code>）を呼び出そう</li>
        <li><code>print</code> で <strong>いくぞ、スライム！</strong> と出そう</li>
      </ol>
    `,
    answerCode: `render(100, 250, "ren");
render(300, 250, "slime");
print("いくぞ、スライム！");`,
    hiddenLines: [1, 2, 3],
    starterCode: '',
    refs: ['render', 'print'],
    sprites: ['ren', 'slime'],
    master: ['画像の名前も、print の文字も、" で囲むのを忘れるでないぞよ。'],
    failMessage: '位置の数字・画像の名前・print の文字を、もう一度たしかめるのだぞよ。',
  },

  check(result) {
    const at = (name, x, y) => result.find('render', (c) => c.args[2] === name && c.args[0] === x && c.args[1] === y).length > 0;
    return at('ren', 100, 250) && at('slime', 300, 250) && result.logs.some((l) => l.includes('いくぞ'));
  },
};
