// 修行11（最終課題）: モンスターと戦うゲームを作る

export default {
  id: 'l11',
  label: '最終',
  title: 'モンスターと戦うゲームを作る',
  summary: '「たたかう」「ぼうぎょ」でドラゴンと戦う、ターン制バトルを作ろう。',
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
      <pre><code>const hero = { name: "レン", hp: 40, atk: 8 };
const enemy = { name: "ドラゴン", hp: 30, atk: 6 };</code></pre>

      <h3>流れ</h3>
      <ol>
        <li>どちらかの HP が 0 になるまでくりかえす（<strong>ループ魔法</strong>：<code>hero.hp &gt; 0 &amp;&amp; enemy.hp &gt; 0</code> の間）
          <ol>
            <li>画面をかく（背景・キャラクター・<code>drawStatus</code>）</li>
            <li>コマンドをキーで選ぶ（<code>waitKey</code>）</li>
            <li><strong>レンの番</strong>：1 なら「たたかう」、2 なら「ぼうぎょ」</li>
            <li><strong>ドラゴンの番</strong>：まだ生きていたら、レンにこうげき。ぼうぎょしていたらダメージは半分</li>
          </ol>
        </li>
        <li>くりかえしが終わったら、勝ったか負けたかを表示する（<strong>分岐魔法</strong>）</li>
      </ol>

      <h3>「ぼうぎょしたか」を覚えておく</h3>
      <p>ぼうぎょの効果は、そのターンのドラゴンのこうげきにだけ効く。だから、ターンのはじめに <code>let guard = false;</code> と箱を作り、2 が押されたら <code>guard = true;</code> にしておく。ドラゴンの番で <code>if (guard)</code> と調べればよい。</p>
      <p class="note"><code>if (guard)</code> は <code>if (guard === true)</code> と同じ意味だ。</p>

      <h3>この修行で用意されている命令</h3>
      <table>
        <tr><th>命令</th><th>意味</th></tr>
        <tr><td><code>drawStatus(hero, enemy)</code></td><td>2人の名前と HP、コマンドの説明を画面にかく</td></tr>
      </table>

      <h3>お手本：やくそうでHP回復</h3>
      <p>お手本コードは、バトルではなく「1を押すたびにやくそうでHPを回復し、満タンになったら終わる」プログラムだ。<strong>オブジェクト・while・waitKey・if</strong> の組み合わせ方を、よく見ておくのだぞ。</p>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）：さらに面白くするには</summary>
        <p>こうげきのダメージを <code>randomInt(6, 10)</code> にすると、毎回ちがうダメージになる。</p>
        <p>「3: やくそう」で HP を回復するコマンドを足してみよう。</p>
        <p>ドラゴンの行動を <code>randomInt(1, 3)</code> で選ぶようにすれば、ときどき強いこうげきをしてくる敵も作れる。</p>
        <p>ここまでの魔法を全部使えるおぬしなら、もう自分だけのゲームを作れるはずだ。</p>
      </details>
    `,
    sampleCode: `const ren = { name: "レン", hp: 10, maxHp: 30 };
while (ren.hp < ren.maxHp) {
  background("white");
  render(200, 220, "ren");
  render(280, 160, "herb");
  fill("#3b342c");
  text("HP " + ren.hp + " / " + ren.maxHp, 140, 320, 24);
  print("1 で やくそうを使う");
  let key = waitKey();
  if (key === "1") {
    ren.hp = ren.hp + 8;
    if (ren.hp > ren.maxHp) {
      ren.hp = ren.maxHp;
    }
    print("HPが回復した！");
  }
}
print("HPがまんたんになった！");`,
    master: ['最後の修行だわ。設計図をよく読むのだぞよ。', 'お手本は、バトルと同じ形のくりかえしだぞよ。'],
  },

  task: {
    problemHtml: `
      <h3>最終課題：ドラゴンとたたかえ！</h3>
      <p>くりかえしの外側と、画面をかくところまでは最初から書いてある。コメントの場所を書こう。</p>
      <ol>
        <li><strong>レンの番</strong>：<code>"1"</code> なら ドラゴンの <code>hp</code> を <code>hero.atk</code> だけへらす。<code>"2"</code> なら <code>guard</code> を <code>true</code> にする</li>
        <li><strong>ドラゴンの番</strong>：ドラゴンの <code>hp</code> が 0 より大きければ、レンの <code>hp</code> を <code>enemy.atk</code> だけへらす。ただし <code>guard</code> が true なら、<strong>半分</strong>（<code>enemy.atk / 2</code>）だけへらす</li>
        <li><strong>勝ち負け</strong>：くりかえしが終わったら、ドラゴンの hp が 0 以下なら <strong>クリア！</strong>、そうでなければ <strong>ゲームオーバー</strong> と print しよう（<code>text</code> で画面にも出すとかっこいいぞ）</li>
      </ol>
      <p>実行したらキャンバスをクリックして、<strong>1</strong>・<strong>2</strong> でたたかおう。</p>
    `,
    answerCode: `const hero = { name: "レン", hp: 40, atk: 8 };
const enemy = { name: "ドラゴン", hp: 30, atk: 6 };
print(enemy.name + "が あらわれた！");
while (hero.hp > 0 && enemy.hp > 0) {
  background("#f5f1e8");
  render(110, 250, "ren", 90);
  render(280, 170, "dragon");
  drawStatus(hero, enemy);
  let key = waitKey();
  let guard = false;
  // レンの番
  if (key === "1") {
    enemy.hp = enemy.hp - hero.atk;
    print("レンのこうげき！ " + hero.atk + " のダメージ");
  } else if (key === "2") {
    guard = true;
    print("レンは みをまもっている");
  }
  // ドラゴンの番
  if (enemy.hp > 0) {
    let damage = enemy.atk;
    if (guard) {
      damage = damage / 2;
    }
    hero.hp = hero.hp - damage;
    print(enemy.name + "のこうげき！ " + damage + " のダメージ");
  }
}
// 勝ち負け
background("#f5f1e8");
drawStatus(hero, enemy);
if (enemy.hp <= 0) {
  render(200, 230, "ren", 110);
  text("ドラゴンをたおした！ クリア！", 50, 110, 24);
  print("クリア！");
} else {
  render(200, 200, "dragon");
  text("ゲームオーバー…", 120, 110, 28);
  print("ゲームオーバー");
}`,
    hiddenLines: [12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    starterCode: `const hero = { name: "レン", hp: 40, atk: 8 };
const enemy = { name: "ドラゴン", hp: 30, atk: 6 };
print(enemy.name + "が あらわれた！");
while (hero.hp > 0 && enemy.hp > 0) {
  background("#f5f1e8");
  render(110, 250, "ren", 90);
  render(280, 170, "dragon");
  drawStatus(hero, enemy);
  let key = waitKey();
  let guard = false;
  // レンの番（1: たたかう　2: ぼうぎょ）

  // ドラゴンの番（ドラゴンが生きていたら）

}
// 勝ち負け
background("#f5f1e8");
drawStatus(hero, enemy);
`,
    refs: [
      { sig: 'drawStatus(hero, enemy)', desc: '2人の名前と HP、コマンドの説明を画面にかく（この修行で用意）' },
      'waitKey',
      'text',
      'render',
      'print',
    ],
    sprites: ['ren', 'dragon'],
    master: ['これが最後の修行だわ。おぬしなら、きっとできるぞよ。'],
    failMessage: 'ダメージの計算（ぼうぎょなら半分）と、最後のクリア／ゲームオーバーの表示をたしかめるのだぞよ。',
  },

  check(result) {
    const { hero, enemy } = result.vars;
    if (!hero || !enemy || typeof hero !== 'object' || typeof enemy !== 'object') return false;
    if (!result.keys.length) return false;
    // 押されたキーのとおりにバトルをやりなおして、HP が合っているかをたしかめる
    let h = 40;
    let e = 30;
    for (const k of result.keys) {
      if (h <= 0 || e <= 0) break;
      let guard = false;
      if (k === '1') e -= 8;
      else if (k === '2') guard = true;
      if (e > 0) h -= guard ? 3 : 6;
    }
    if (hero.hp !== h || enemy.hp !== e) return false;
    if (e <= 0) return result.logs.some((l) => l.includes('クリア'));
    if (h <= 0) return result.logs.some((l) => l.includes('ゲームオーバー'));
    return false; // まだたたかいの途中
  },
};
