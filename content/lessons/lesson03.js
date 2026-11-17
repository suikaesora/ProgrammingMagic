// 修行3: 箱記憶魔法（変数・let と const）

export default {
  id: 'l03',
  title: '箱記憶魔法の修行',
  summary: '値に名前をつけて箱にしまい、何度でも使ったり、まとめて変えたりしよう。',
  difficulty: 1,
  items: ['note', 'leaf', 'balloon'],
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>箱記憶魔法：変数</h2>
      <p>値に名前をつけて、<strong>箱</strong>にしまっておく魔法だ。この箱を<strong>変数</strong>という。</p>
      <pre><code>let hp = 50;      // hp という箱を作って、50 を入れる
print(hp);        // 箱の中身（50）が出てくる
print(hp + 10);   // 計算にも使える（60）</code></pre>

      <h3>中身を入れかえる</h3>
      <pre><code>hp = hp - 12;     // 「hp - 12」を計算して、hp に入れなおす（38 になる）</code></pre>
      <p class="note">この <code>=</code> は算数の「等しい」ではなく、<strong>「右の値を左の箱に入れる」</strong>という意味だ。2回目からは <code>let</code> をつけない。</p>

      <h3>let と const</h3>
      <table>
        <tr><th>書き方</th><th>意味</th></tr>
        <tr><td><code>let</code></td><td>あとから中身を<strong>入れかえられる</strong>箱</td></tr>
        <tr><td><code>const</code></td><td>中身を<strong>入れかえられない</strong>箱（入れかえようとするとエラー）</td></tr>
      </table>
      <p>変わる値（HP や位置）は <code>let</code>、変わらない値（名前や最大HP）は <code>const</code> にすると、うっかり書きかえる事故をふせげる。</p>

      <h3>変数のよいところ</h3>
      <p>同じ値を何度も使うときは、変数にしておくと、<strong>1か所を変えるだけで全部が変わる</strong>。</p>
      <pre><code>let y = 280;
render(100, y, "slime");
render(300, y, "slime");   // y を変えれば、2ひきまとめて動く</code></pre>

      <h3>名前のつけ方</h3>
      <ul>
        <li>英字で始める（<code>hp</code> <code>enemyHp</code> <code>x2</code> など）。数字で始めたり、空白を入れたりはできない</li>
        <li>大文字と小文字は別の名前になる（<code>hp</code> と <code>HP</code> は別の箱）</li>
        <li><code>let</code> や <code>if</code> のような、魔法の言葉そのものは名前にできない</li>
      </ul>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）：値の種類（データ型）</summary>
        <p>箱に入れる値には種類がある。</p>
        <table>
          <tr><th>種類</th><th>例</th></tr>
          <tr><td>数（number）</td><td><code>50</code> <code>3.5</code> <code>-4</code></td></tr>
          <tr><td>文字列（string）</td><td><code>"スライム"</code> <code>"1"</code></td></tr>
          <tr><td>真偽値（boolean）</td><td><code>true</code> <code>false</code></td></tr>
        </table>
        <p><code>50</code> と <code>"50"</code> は別物だ。<code>print(typeof 50);</code> と書くと、値の種類を調べられる。</p>
        <p><code>hp = hp - 12;</code> は <code>hp -= 12;</code> と短く書くこともできる。</p>
      </details>
    `,
    sampleCode: `let hp = 50;
print("HP: " + hp);
hp = hp - 12;
print("こうげきを受けた！ HP: " + hp);
const name = "スライム";
let y = 280;
render(100, y, "slime");
render(300, y, "slime");
print(name + "が2ひき あらわれた");`,
    master: ['変数は、値をしまっておく箱だぞよ。', '= は「等しい」ではなく「入れる」なのだぞよ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：スライム行列のお引っこし</h3>
      <ol>
        <li><code>let</code> で変数 <code>y</code> を作り、<strong>150</strong> を入れよう</li>
        <li>スライムを3びき、x が <code>100</code>・<code>200</code>・<code>300</code>、y が<strong>変数 <code>y</code></strong> の位置に出そう</li>
        <li><code>const</code> で変数 <code>name</code> を作り、<code>"スライム"</code> を入れよう</li>
        <li><code>print(name + "が3びき あらわれた！");</code> と出そう</li>
      </ol>
      <p>できたら、<strong><code>y</code> の数字だけを 300 に書きかえて</strong>、3びきまとめて下に引っこしさせよう。y が 300 になったらクリア！</p>
    `,
    answerCode: `let y = 300;
render(100, y, "slime");
render(200, y, "slime");
render(300, y, "slime");
const name = "スライム";
print(name + "が3びき あらわれた！");`,
    hiddenLines: [1, 2, 3, 4, 5, 6],
    starterCode: '',
    refs: ['render', 'print'],
    sprites: ['slime'],
    master: ['y を1か所変えるだけで、3びきとも動くのを見るのだぞよ。'],
    failMessage: '変数 y が 300 になっているか、3びきとも y の位置に出ているかをたしかめるのだぞよ。',
  },

  check(result) {
    const v = result.vars;
    if (v.y !== 300 || v.name !== 'スライム') return false;
    const at = (x) => result.find('render', (c) => c.args[2] === 'slime' && c.args[0] === x && c.args[1] === 300).length > 0;
    return at(100) && at(200) && at(300) && result.logs.some((l) => l.includes('スライムが3びき'));
  },
};
