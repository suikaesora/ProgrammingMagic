// 修行11（最終課題）: モンスターと戦うゲームを作る

export default {
  id: 'l11',
  label: '最終',
  title: 'モンスターと戦うゲームを作る',
  summary: '「たたかう」「ぼうぎょ」でドラゴンと戦う、ターン制バトルを作ろう。コードを読みやすくする工夫も学ぶ。',
  difficulty: 5,
  items: ['sword', 'shieldgold', 'dragonegg'],

  // 修行の土台。drawStatus() は学習者のコードから使える
  template: `// ===== 修行の土台（自動で用意されています） =====
// drawStatus(hero, enemy) … 2人の名前と HP、コマンドの説明を画面にかく
function drawStatus(hero, enemy) {
  fill("#3b342c");
  text(enemy.name + "  HP " + enemy.hp, 200, 40, 20);
  text(hero.name + "  HP " + hero.hp, 30, 330, 20);
  text("1: たたかう　2: ぼうぎょ", 30, 362, 18);
}
// ===== ここから下にあなたのコードが入ります =====
/*@USER@*/`,

  explain: {
    html: `
      <h2>最終課題：バトルの設計図</h2>
      <p>いよいよ最後の修行だ。モンスターとたたかう<strong>ターン制バトル</strong>を作る。まずは設計図を見よ。</p>

      <h3>データ（まとめ魔法）</h3>
      <pre><code>const hero = { name: "レン", hp: 40, atk: 8, guard: false };
const enemy = { name: "ドラゴン", hp: 30, atk: 6, guard: false };</code></pre>
      <p><code>guard</code> は「いま、ぼうぎょしているか」を覚えておく値だ。ぼうぎょしていたら、受けるダメージが半分になる。</p>

      <h3>流れ</h3>
      <ol>
        <li>どちらかの HP が 0 になるまでくりかえす（<strong>ループ魔法</strong>：<code>hero.hp &gt; 0 &amp;&amp; enemy.hp &gt; 0</code> の間）
          <ol>
            <li>画面をかく</li>
            <li>コマンドをキーで選ぶ（<code>waitKey</code>）</li>
            <li><strong>レンの番</strong>：1 なら「たたかう」、2 なら「ぼうぎょ」</li>
            <li><strong>ドラゴンの番</strong>：まだ生きていたら、レンにこうげき</li>
          </ol>
        </li>
        <li>くりかえしが終わったら、画面をかきなおして、勝ったか負けたかを表示する</li>
      </ol>

      <h3>コードの工夫</h3>
      <p>if をたくさん重ねても、動くプログラムは作れる。だが長くなるほど読みにくく、まちがいも見つけにくくなる。最後の修行では、<strong>コードを短く、読みやすくする工夫</strong>を身につけるのだ。</p>

      <h4>工夫1：同じ処理は関数にまとめる</h4>
      <p>画面をかく処理は、<strong>くりかえしの中</strong>と<strong>くりかえしが終わったあと</strong>の2か所で使う。関数 <code>drawScreen()</code> にまとめておけば、何度でも1行で呼べて、直すときも1か所ですむ。</p>
      <p class="note">くりかえしは「HP が 0 になったとき」に終わる。そのあと画面をかきなおさないと、<strong>最後の HP が画面に出ないまま</strong>になってしまう。終わったあとにも <code>drawScreen();</code> を呼ぶのを忘れるな。</p>

      <h4>工夫2：オブジェクトを引数でわたす</h4>
      <p>レンのこうげきも、ドラゴンのこうげきも、「相手の HP を自分の atk だけへらす」のは同じだ。だれがだれをこうげきするかを<strong>引数</strong>でわたせば、1つの関数で両方に使える。</p>
      <pre><code>function attack(attacker, target) {
  target.hp = target.hp - attacker.atk;
}
attack(hero, enemy);  // レンがドラゴンをこうげき
attack(enemy, hero);  // ドラゴンがレンをこうげき</code></pre>
      <p>関数の中で <code>target.hp</code> を変えると、わたしたオブジェクト（<code>hero</code> や <code>enemy</code>）の中身がそのまま変わる。</p>

      <h4>工夫3：Math.max・Math.min で、はみ出さないようにする</h4>
      <table>
        <tr><th>書き方</th><th>意味</th><th>例</th></tr>
        <tr><td><code>Math.max(a, b)</code></td><td>a と b の<strong>大きいほう</strong></td><td><code>Math.max(-4, 0)</code> → 0</td></tr>
        <tr><td><code>Math.min(a, b)</code></td><td>a と b の<strong>小さいほう</strong></td><td><code>Math.min(34, 30)</code> → 30</td></tr>
      </table>
      <p><code>hp = Math.max(hp - 10, 0);</code> と書けば、HP が 0 より下にならない。<code>hp = Math.min(hp + 8, maxHp);</code> と書けば、最大 HP をこえない。「もし 0 より小さかったら 0 にする」という if を書かなくてすむ。</p>

      <h4>工夫4：比べた結果を、そのまま箱に入れる</h4>
      <p>比べた結果は true か false になるのだったな（<strong>計算魔法</strong>）。だから、次の2つは同じ意味だ。</p>
      <pre><code>if (key === "2") {
  hero.guard = true;
} else {
  hero.guard = false;
}

hero.guard = (key === "2");   // 1行ですむ</code></pre>

      <h3>この修行で用意されている命令</h3>
      <table>
        <tr><th>命令</th><th>意味</th></tr>
        <tr><td><code>drawStatus(hero, enemy)</code></td><td>2人の名前と HP、コマンドの説明を画面にかく</td></tr>
      </table>

      <h3>お手本：やくそうでHP回復</h3>
      <p>お手本コードは、バトルではなく「1を押すたびにやくそうでHPを回復し、満タンになったら終わる」プログラムだ。<strong>工夫1〜3</strong>を使っている。とくに、くりかえしが終わったあとの <code>drawScreen();</code> に注目せよ。</p>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）：さらに面白くするには</summary>
        <p>こうげきのダメージを <code>randomInt(6, 10)</code> にすると、毎回ちがうダメージになる。</p>
        <p>「3: やくそう」で HP を回復するコマンドを足してみよう。お手本の <code>heal</code> 関数がそのまま使えるはずだ。</p>
        <p>ドラゴンの行動を <code>randomInt(1, 3)</code> で選ぶようにすれば、ときどき強いこうげきをしてくる敵も作れる。</p>
        <p>ここまでの魔法を全部使えるおぬしなら、もう自分だけのゲームを作れるはずだ。</p>
      </details>
    `,
    sampleCode: `const ren = { name: "レン", hp: 10, maxHp: 30 };
// 画面をかく関数
function drawScreen() {
  background("white");
  render(200, 220, "ren");
  render(280, 160, "herb");
  fill("#3b342c");
  text("HP " + ren.hp + " / " + ren.maxHp, 140, 320, 24);
}
// who の HP を amount だけ回復する（maxHp はこえない）
function heal(who, amount) {
  who.hp = Math.min(who.hp + amount, who.maxHp);
  print(who.name + "のHPが回復した！");
}
while (ren.hp < ren.maxHp) {
  drawScreen();
  print("1 で やくそうを使う");
  let key = waitKey();
  if (key === "1") {
    heal(ren, 8);
  }
}
// 最後の HP を、画面にかきなおす
drawScreen();
print("HPがまんたんになった！");`,
    master: ['いよいよ最後の修行だぞよ。設計図をよく読むのだ。', '動くだけでなく、読みやすいコードを書くのが一人前の魔法使いだぞよ。'],
  },

  task: {
    problemHtml: `
      <h3>最終課題：ドラゴンとたたかえ！</h3>
      <p>コメントの場所に、足りないところを書こう。</p>
      <ol>
        <li><strong>データ</strong>：オブジェクト <code>hero</code>（<code>name</code> は <code>"レン"</code>、<code>hp</code> は <code>40</code>、<code>atk</code> は <code>8</code>、<code>guard</code> は <code>false</code>）と、<code>enemy</code>（<code>name</code> は <code>"ドラゴン"</code>、<code>hp</code> は <code>30</code>、<code>atk</code> は <code>6</code>、<code>guard</code> は <code>false</code>）を作ろう</li>
        <li><strong>画面をかく関数</strong> <code>drawScreen()</code>：ドラゴン（<code>"dragon"</code>）を (280, 170) に出して、<code>drawStatus(hero, enemy)</code> を呼ぶ（背景とレンをかく行は、お手本で見えている）</li>
        <li><strong>こうげきの関数</strong> <code>attack(attacker, target)</code>：
          <ul>
            <li>ダメージは <code>attacker.atk</code>。ただし <code>target.guard</code> が true なら半分にする</li>
            <li><code>target.hp</code> をダメージだけへらす。<code>Math.max</code> を使って、0 より下にならないようにする</li>
            <li>ダメージを print する行は、お手本で見えている（<code>damage</code> はダメージを入れた箱）</li>
          </ul>
        </li>
        <li><strong>バトル</strong>：
          <ul>
            <li>レンの番：<code>hero.guard</code> に「<code>key</code> が <code>"2"</code> か」を入れる。<code>key</code> が <code>"1"</code> なら、レンがドラゴンをこうげきする</li>
            <li>ドラゴンの番：ドラゴンの <code>hp</code> が 0 より大きければ、ドラゴンがレンをこうげきする</li>
          </ul>
        </li>
        <li><strong>勝ち負け</strong>：ドラゴンの <code>hp</code> が 0 なら <strong>クリア！</strong>、そうでなければ <strong>ゲームオーバー</strong> と print しよう（<code>text</code> で画面にも出すとかっこいいぞ）</li>
      </ol>
      <p>実行したらキャンバスをクリックして、<strong>1</strong>・<strong>2</strong> でたたかおう。</p>
    `,
    answerCode: `// 1. レンとドラゴンのデータ
const hero = { name: "レン", hp: 40, atk: 8, guard: false };
const enemy = { name: "ドラゴン", hp: 30, atk: 6, guard: false };
// 2. 画面をかく関数
function drawScreen() {
  background("#f5f1e8");
  render(110, 250, "ren", 90);
  render(280, 170, "dragon");
  drawStatus(hero, enemy);
}
// 3. こうげきの関数
function attack(attacker, target) {
  let damage = attacker.atk;
  if (target.guard) {
    damage = damage / 2;
  }
  target.hp = Math.max(target.hp - damage, 0);
  print(attacker.name + "のこうげき！ " + damage + " のダメージ");
}
// 4. バトル
print(enemy.name + "が あらわれた！");
while (hero.hp > 0 && enemy.hp > 0) {
  drawScreen();
  let key = waitKey();
  // レンの番（1: たたかう　2: ぼうぎょ）
  hero.guard = (key === "2");
  if (key === "1") {
    attack(hero, enemy);
  }
  // ドラゴンの番（ドラゴンが生きていたら）
  if (enemy.hp > 0) {
    attack(enemy, hero);
  }
}
// 5. 勝ち負け
drawScreen();
if (enemy.hp === 0) {
  text("ドラゴンをたおした！ クリア！", 50, 110, 24);
  print("クリア！");
} else {
  text("ゲームオーバー…", 120, 110, 28);
  print("ゲームオーバー");
}`,
    hiddenLines: [2, 3, 5, 8, 9, 12, 13, 14, 15, 16, 17, 26, 27, 28, 29, 31, 32, 33, 37, 38, 39, 40, 41, 42, 43],
    starterCode: `// 1. レンとドラゴンのデータ

// 2. 画面をかく関数

// 3. こうげきの関数

// 4. バトル
print(enemy.name + "が あらわれた！");
while (hero.hp > 0 && enemy.hp > 0) {
  drawScreen();
  let key = waitKey();
  // レンの番（1: たたかう　2: ぼうぎょ）

  // ドラゴンの番（ドラゴンが生きていたら）

}
// 5. 勝ち負け
drawScreen();
`,
    refs: [
      { sig: 'drawStatus(hero, enemy)', desc: '2人の名前と HP、コマンドの説明を画面にかく（この修行で用意）' },
      { sig: 'Math.max(a, b)', desc: 'a と b の大きいほう。<code>Math.max(hp - 10, 0)</code> で 0 より下にならない' },
      'waitKey',
      'background',
      'text',
      'render',
      'print',
    ],
    sprites: ['ren', 'dragon'],
    master: ['これが最後の修行だ。おぬしなら、きっとできるぞよ。'],
    failMessage: 'attack と drawScreen の関数、ダメージの計算（ぼうぎょなら半分、HP は 0 より下にならない）、最後のクリア／ゲームオーバーの表示をたしかめるのだぞよ。',
  },

  check(result) {
    const { hero, enemy, attack, drawScreen } = result.vars;
    if (!hero || !enemy || typeof hero !== 'object' || typeof enemy !== 'object') return false;
    if (typeof attack !== 'function' || typeof drawScreen !== 'function') return false;
    if (!result.keys.length) return false;
    // 押されたキーのとおりにバトルをやりなおして、HP が合っているかをたしかめる
    let h = 40;
    let e = 30;
    for (const k of result.keys) {
      if (h <= 0 || e <= 0) break;
      const guard = k === '2';
      if (k === '1') e = Math.max(e - 8, 0);
      if (e > 0) h = Math.max(h - (guard ? 3 : 6), 0);
    }
    if (hero.hp !== h || enemy.hp !== e) return false;
    if (e <= 0) return result.logs.some((l) => l.includes('クリア'));
    if (h <= 0) return result.logs.some((l) => l.includes('ゲームオーバー'));
    return false; // まだたたかいの途中
  },
};
