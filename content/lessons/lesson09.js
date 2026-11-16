// 修行9: まとめ魔法（オブジェクト）

export default {
  id: 'l09',
  title: 'まとめ魔法の修行',
  summary: 'モンスターの名前・HP・位置を、1つのオブジェクトにまとめよう。',
  difficulty: 3,
  items: ['potionred', 'potionblue', 'cat'],
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>まとめ魔法：オブジェクト</h2>
      <p>モンスター1体には、名前・HP・こうげき力・位置…と、たくさんの値がある。ばらばらの変数にすると、モンスターが増えたときに大変だ。</p>
      <pre><code>let slimeName = "スライム";
let slimeHp = 12;
let slimeX = 300;   // 2体目、3体目…と増えたら？</code></pre>
      <p>そこで、関係のある値を<strong>1つの箱にまとめる</strong>。これを<strong>オブジェクト</strong>という。</p>
      <pre><code>const slime = {
  name: "スライム",
  hp: 12,
  x: 300,
  y: 200,
};</code></pre>
      <p><code>{ }</code> の中に「<strong>名前: 値</strong>」を <code>,</code> で区切って書く。</p>

      <h3>取り出す・変える</h3>
      <p><code>オブジェクト.名前</code> で中の値を使える。</p>
      <pre><code>render(slime.x, slime.y, "slime");
print(slime.name + " HP:" + slime.hp);   // スライム HP:12
slime.hp = slime.hp - 5;                 // HP を 7 にする</code></pre>
      <p class="note"><code>const</code> で作ったオブジェクトでも、<strong>中の値は変えられる</strong>。変えられないのは「slime という箱に、別のオブジェクトを入れなおすこと」だけだ。</p>

      <h3>関数もまとめられる</h3>
      <p>値だけでなく、関数も中に入れられる。そのモンスターの「行動」をまとめておけるのだ。</p>
      <pre><code>const slime = {
  name: "スライム",
  cry: () =&gt; {
    print("ぷるぷる！");
  },
};
slime.cry();   // ぷるぷる！</code></pre>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）</summary>
        <p><code>slime["hp"]</code> のように書いても取り出せる。名前を変数で指定したいときに使う。</p>
        <p>あとから <code>slime.mp = 5;</code> と書けば、新しい値を足せる。</p>
        <p>同じ形のオブジェクトをたくさん並べたいときは、<strong>配列</strong> <code>[ ]</code> という別のまとめ魔法を使う。<code>const enemies = [slime, bat];</code> のように書ける。いつか調べてみるとよい。</p>
      </details>
    `,
    sampleCode: `const slime = {
  name: "スライム",
  hp: 12,
  x: 300,
  y: 200,
  cry: () => {
    print("ぷるぷる！");
  },
};
render(slime.x, slime.y, "slime");
print(slime.name + " HP:" + slime.hp);
slime.hp = slime.hp - 5;
print(slime.name + " HP:" + slime.hp);
slime.cry();`,
    master: ['関係のある値は、まとめてしまうのだわ。', 'オブジェクト.名前 で取り出せるぞよ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：レンとドラゴンのデータ</h3>
      <ol>
        <li>オブジェクト <code>hero</code> を作ろう：<code>name</code> は <code>"レン"</code>、<code>hp</code> は <code>40</code>、<code>x</code> は <code>100</code>、<code>y</code> は <code>250</code>。さらに <code>shout</code> という関数を入れて、中で <strong>いくぞ！</strong> と print する</li>
        <li>オブジェクト <code>enemy</code> を作ろう：<code>name</code> は <code>"ドラゴン"</code>、<code>hp</code> は <code>30</code>、<code>atk</code> は <code>6</code>、<code>x</code> は <code>280</code>、<code>y</code> は <code>200</code></li>
        <li>それぞれの <code>x</code>・<code>y</code> を使って、レン（<code>"ren"</code>）とドラゴン（<code>"dragon"</code>）を出そう</li>
        <li><code>hero.shout();</code> を呼び出そう</li>
        <li>ドラゴンの <code>hp</code> を <strong>8</strong> へらして、<code>print(enemy.name + "のHP: " + enemy.hp);</code> と出そう</li>
      </ol>
    `,
    answerCode: `const hero = {
  name: "レン",
  hp: 40,
  x: 100,
  y: 250,
  shout: () => {
    print("いくぞ！");
  },
};
const enemy = {
  name: "ドラゴン",
  hp: 30,
  atk: 6,
  x: 280,
  y: 200,
};
render(hero.x, hero.y, "ren");
render(enemy.x, enemy.y, "dragon");
hero.shout();
enemy.hp = enemy.hp - 8;
print(enemy.name + "のHP: " + enemy.hp);`,
    hiddenLines: [2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21],
    starterCode: '',
    refs: ['render', 'print'],
    sprites: ['ren', 'dragon'],
    master: ['名前: 値 を , で区切るのを忘れるでないぞよ。'],
    failMessage: 'hero と enemy の中身の名前と値、ドラゴンの HP が 22 になっているかをたしかめるのだぞよ。',
  },

  check(result) {
    const { hero, enemy } = result.vars;
    if (!hero || !enemy || typeof hero !== 'object' || typeof enemy !== 'object') return false;
    const heroOk = hero.name === 'レン' && hero.hp === 40 && hero.x === 100 && hero.y === 250 && typeof hero.shout === 'function';
    const enemyOk = enemy.name === 'ドラゴン' && enemy.hp === 22 && enemy.atk === 6 && enemy.x === 280 && enemy.y === 200;
    const at = (name, x, y) => result.find('render', (c) => c.args[2] === name && c.args[0] === x && c.args[1] === y).length > 0;
    return heroOk && enemyOk && at('ren', 100, 250) && at('dragon', 280, 200)
      && result.logs.some((l) => l.includes('いくぞ'))
      && result.logs.some((l) => l.includes('ドラゴン') && l.includes('22'));
  },
};
