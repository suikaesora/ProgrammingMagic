// 修行2: 計算魔法（演算子）

export default {
  id: 'l02',
  title: '計算魔法の修行',
  summary: '足し算・比べる・「かつ」「または」で、冒険に必要な計算をしよう。',
  difficulty: 1,
  items: ['glasses', 'cloud', 'moon'],
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>計算魔法：コードに計算させる</h2>
      <p>コードは計算が得意だ。<code>print</code> の引数に計算を書くと、<strong>答え</strong>が出てくる。</p>
      <pre><code>print(12 + 30);   // 42 と出る
print("12 + 30"); // " で囲むと、ただの文字としてそのまま出る</code></pre>

      <h3>四則演算</h3>
      <table>
        <tr><th>書き方</th><th>意味</th><th>例</th></tr>
        <tr><td><code>+</code></td><td>たす</td><td><code>3 + 2</code> → 5</td></tr>
        <tr><td><code>-</code></td><td>ひく</td><td><code>3 - 2</code> → 1</td></tr>
        <tr><td><code>*</code></td><td>かける</td><td><code>3 * 2</code> → 6</td></tr>
        <tr><td><code>/</code></td><td>わる</td><td><code>6 / 2</code> → 3</td></tr>
        <tr><td><code>%</code></td><td>わったあまり</td><td><code>7 % 3</code> → 1</td></tr>
      </table>
      <p>算数と同じく、<code>*</code> と <code>/</code> が先に計算される。先に計算したいところは <code>( )</code> で囲む。</p>

      <h3>比べる計算（条件）</h3>
      <p>くらべた結果は、<strong>true（正しい）</strong>か <strong>false（正しくない）</strong>になる。</p>
      <table>
        <tr><th>書き方</th><th>意味</th><th>例</th></tr>
        <tr><td><code>&gt;</code> / <code>&lt;</code></td><td>より大きい / より小さい</td><td><code>5 &gt; 3</code> → true</td></tr>
        <tr><td><code>&gt;=</code> / <code>&lt;=</code></td><td>以上 / 以下</td><td><code>3 &gt;= 3</code> → true</td></tr>
        <tr><td><code>===</code></td><td>同じ</td><td><code>5 === 3</code> → false</td></tr>
        <tr><td><code>!==</code></td><td>ちがう</td><td><code>5 !== 3</code> → true</td></tr>
      </table>
      <p class="note">「同じ」は <code>=</code> を<strong>3つ</strong>つなげる。<code>=</code> 1つは別の意味（次の修行で教える）だ。</p>

      <h3>「かつ」「または」「ではない」（論理演算）</h3>
      <table>
        <tr><th>書き方</th><th>意味</th><th>例</th></tr>
        <tr><td><code>&amp;&amp;</code></td><td>かつ（両方 true なら true）</td><td><code>true &amp;&amp; false</code> → false</td></tr>
        <tr><td><code>||</code></td><td>または（どちらかが true なら true）</td><td><code>true || false</code> → true</td></tr>
        <tr><td><code>!</code></td><td>ではない（反対にする）</td><td><code>!true</code> → false</td></tr>
      </table>
      <p><code>|</code> は、Shift キーを押しながら <code>¥</code> キーで打てる。</p>

      <h3>命令の引数にも計算が書ける</h3>
      <pre><code>render(100 + 100, 150 * 2, "slime"); // (200, 300) に出る</code></pre>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）</summary>
        <p>文字と数を <code>+</code> でつなぐと、くっついた文字になる。<code>print("HP: " + 30);</code> → <code>HP: 30</code>。この技はこの先よく使う。</p>
        <p><code>7 / 2</code> は <code>3.5</code> のように小数になる。整数にしたいときは <code>Math.floor(7 / 2)</code>（切り捨て）を使う。</p>
        <p><code>==</code>（2つ）という書き方もあるが、思わぬ結果になることがあるので、この修行では <code>===</code> を使う。</p>
      </details>
    `,
    sampleCode: `print(12 + 30);
print(100 - 37);
print(6 * 7);
print(84 / 2);
print(10 % 3);
print(5 > 3);
print(5 === 3);
print(true && false);
print(true || false);
render(100 + 100, 150 * 2, "slime");`,
    master: ['計算はコードにまかせればよいぞよ。', '比べた結果は true か false になるのだぞよ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：冒険の計算</h3>
      <p>答えの数字を自分で計算して書くのではなく、<strong>計算の式を書いて</strong>コードに計算させよう。</p>
      <ol>
        <li>スライムを <strong>4</strong> ひきたおした。1ぴき <strong>15</strong> ゴールドなら、ぜんぶでいくら？ <code>print</code> で出そう</li>
        <li>HP <strong>80</strong> のレンが <strong>23</strong> のダメージを受けた。のこりの HP を出そう</li>
        <li>レベル <strong>12</strong> は <strong>10 以上</strong>か？ 比べた結果（true / false）を出そう</li>
        <li>扉を通るには「鍵を持っている」<strong>かつ</strong>「扉があいている」の両方が必要だ。いま、鍵は持っている（<code>true</code>）が、扉はあいていない（<code>false</code>）。扉を通れるか（true / false）を、<code>&amp;&amp;</code> を使った式で出そう</li>
        <li>コイン（<code>"coin"</code>）を、x が <code>50 * 4</code>、y が <code>300</code> の位置に出そう</li>
      </ol>
    `,
    answerCode: `// 1. ゴールドの合計
print(4 * 15);
// 2. のこりの HP
print(80 - 23);
// 3. レベル 12 は 10 以上？
print(12 >= 10);
// 4. 鍵を持っている(true) かつ 扉があいている(false)。扉を通れる？
print(true && false);
// 5. コインを出す
render(50 * 4, 300, "coin");`,
    hiddenLines: [2, 4, 6, 8, 10],
    starterCode: `// 1. ゴールドの合計

// 2. のこりの HP

// 3. レベル 12 は 10 以上？

// 4. 鍵を持っている(true) かつ 扉があいている(false)。扉を通れる？

// 5. コインを出す
`,
    refs: ['print', 'render'],
    sprites: ['coin'],
    master: ['答えを暗算するのではなく、式を書いてコードに計算させるのだぞよ。'],
    failMessage: '出力が 1〜4 の順にならんでいるか、コインの位置が (200, 300) になっているかをたしかめるのだぞよ。',
  },

  check(result) {
    // 1〜4 の答えが、この順番で出ているか
    const want = ['60', '57', 'true', 'false'];
    let from = 0;
    for (const w of want) {
      const i = result.logs.indexOf(w, from);
      if (i < 0) return false;
      from = i + 1;
    }
    return result.find('render', (c) => c.args[2] === 'coin' && c.args[0] === 200 && c.args[1] === 300).length > 0;
  },
};
