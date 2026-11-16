// 修行10（応用編）: JANKEN ゲームを作る

export default {
  id: 'l10',
  label: '応用',
  title: 'JANKEN ゲームを作る',
  summary: 'これまでの魔法を組み合わせて、3回勝負のじゃんけんゲームを作ろう。',
  difficulty: 4,
  items: ['dice', 'cookie', 'apple'],

  // 修行の土台。waitHand() と randomHand() は学習者のコードから使える
  template: `// ===== 修行の土台（自動で用意されています） =====
// waitHand()   … 1・2・3 のキーが押されるまで待ち、"gu" "choki" "pa" のどれかを返す
// randomHand() … "gu" "choki" "pa" のどれかを、でたらめに返す
function waitHand() {
  while (true) {
    let key = waitKey();
    if (key === "1") { return "gu"; }
    if (key === "2") { return "choki"; }
    if (key === "3") { return "pa"; }
  }
}
function randomHand() {
  let n = randomInt(1, 3);
  if (n === 1) { return "gu"; }
  if (n === 2) { return "choki"; }
  return "pa";
}
// ===== ここから下にあなたのコードが入ります =====
/*@USER@*/`,

  explain: {
    html: `
      <h2>応用編：ゲームを組み立てる</h2>
      <p>ここからは、これまでの魔法を<strong>組み合わせて</strong>ゲームを作る。いきなり書き始めず、まず<strong>ゲームの流れ</strong>を言葉で考えるのがコツだ。</p>

      <h3>じゃんけん3回勝負の流れ</h3>
      <ol>
        <li>勝った数・負けた数の箱を用意する（<strong>箱記憶魔法</strong>）</li>
        <li>3回くりかえす（<strong>段階ループ魔法</strong>）
          <ol>
            <li>自分の手をキーで選ぶ（<strong>waitKey</strong>）</li>
            <li>相手の手をでたらめに決める（<strong>randomInt</strong>）</li>
            <li>2人の手を画面に出す（<strong>命令魔法</strong> render）</li>
            <li>勝ち・負け・あいこを決めて、数える（<strong>分岐魔法</strong>・<strong>計算魔法</strong>）</li>
          </ol>
        </li>
        <li>最後に結果を出す</li>
      </ol>

      <h3>この修行で用意されている命令</h3>
      <table>
        <tr><th>命令</th><th>意味</th></tr>
        <tr><td><code>waitHand()</code></td><td>1・2・3 のキーが押されるまで待ち、<code>"gu"</code>（グー）<code>"choki"</code>（チョキ）<code>"pa"</code>（パー）のどれかを返す</td></tr>
        <tr><td><code>randomHand()</code></td><td><code>"gu"</code> <code>"choki"</code> <code>"pa"</code> のどれかを、でたらめに返す</td></tr>
      </table>
      <p>手の名前は、そのまま画像の名前にもなっている。<code>render(100, 200, "gu");</code> でグーの絵が出る。</p>

      <h3>勝ち負けの決め方</h3>
      <ul>
        <li>2人の手が同じ → あいこ</li>
        <li>（自分がグー <strong>かつ</strong> 相手がチョキ）<strong>または</strong>（自分がチョキ かつ 相手がパー）<strong>または</strong>（自分がパー かつ 相手がグー） → 勝ち</li>
        <li>それ以外 → 負け</li>
      </ul>
      <p>「かつ」は <code>&amp;&amp;</code>、「または」は <code>||</code> だったな。長い条件は <code>( )</code> でくぎると読みやすい。</p>

      <h3>お手本：コイントス3回勝負</h3>
      <p>お手本コードは、じゃんけんではなく「コインの表か裏かを当てる」ゲームだ。流れはじゃんけんとそっくりなので、よく読んでから課題に進むとよい。</p>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）</summary>
        <p><code>randomInt(1, 3)</code> は 1・2・3 のどれかを、でたらめに返す命令だ。サイコロなら <code>randomInt(1, 6)</code>。</p>
        <p>画面に文字を出したいときは <code>text("かち！", 160, 80, 28);</code> も使える（文字・x・y・大きさ）。print とちがって、キャンバスの上に出る。</p>
        <p>「先に2勝したほうの勝ち」にしたいなら、for のかわりに <code>while (win &lt; 2 &amp;&amp; lose &lt; 2)</code> を使う手もある。</p>
      </details>
    `,
    sampleCode: `let hit = 0;
for (let round = 1; round <= 3; round++) {
  print(round + "回目：1 なら おもて、2 なら うら");
  let key = waitKey();
  let coin = randomInt(1, 2);
  background("white");
  if (coin === 1) {
    render(200, 150, "coin");
    print("おもて！");
  } else {
    render(200, 150, "star");
    print("うら！");
  }
  if ((key === "1" && coin === 1) || (key === "2" && coin === 2)) {
    hit = hit + 1;
    print("あたり！");
  } else {
    print("はずれ…");
  }
}
print("あたりは " + hit + " 回");`,
    master: ['まずはゲームの流れを、言葉で考えるのだわ。', 'お手本は、じゃんけんとよく似た流れだぞよ。'],
  },

  task: {
    problemHtml: `
      <h3>課題：じゃんけん3回勝負</h3>
      <p>くりかえし・手を選ぶ・画像を出すところまでは、最初から書いてある。足りないところを書こう。</p>
      <ol>
        <li><strong>勝ち負けの判定</strong>：あいこなら <strong>あいこ</strong>、勝ったら <code>win</code> を1増やして <strong>かち！</strong>、負けたら <code>lose</code> を1増やして <strong>まけ…</strong> と print</li>
        <li><strong>結果</strong>：3回終わったら <code>print("けっか：" + win + "勝 " + lose + "敗");</code> と出そう</li>
      </ol>
      <p>実行したらキャンバスをクリックして、<strong>1</strong>（グー）・<strong>2</strong>（チョキ）・<strong>3</strong>（パー）で手を出そう。</p>
    `,
    answerCode: `let win = 0;
let lose = 0;
for (let round = 1; round <= 3; round++) {
  print(round + "回戦！ 1:グー 2:チョキ 3:パー");
  let me = waitHand();
  let cpu = randomHand();
  background("white");
  render(100, 200, me);
  render(300, 200, cpu);
  if (me === cpu) {
    print("あいこ");
  } else if ((me === "gu" && cpu === "choki") || (me === "choki" && cpu === "pa") || (me === "pa" && cpu === "gu")) {
    win = win + 1;
    print("かち！");
  } else {
    lose = lose + 1;
    print("まけ…");
  }
}
print("けっか：" + win + "勝 " + lose + "敗");`,
    hiddenLines: [10, 11, 12, 13, 14, 15, 16, 17, 18, 20],
    starterCode: `let win = 0;
let lose = 0;
for (let round = 1; round <= 3; round++) {
  print(round + "回戦！ 1:グー 2:チョキ 3:パー");
  let me = waitHand();
  let cpu = randomHand();
  background("white");
  render(100, 200, me);
  render(300, 200, cpu);
  // ここに勝ち負けの判定を書こう

}
// ここに結果を出そう
`,
    refs: [
      { sig: 'waitHand()', desc: '1・2・3 のキーが押されるまで待ち、<code>"gu"</code> <code>"choki"</code> <code>"pa"</code> のどれかを返す（この修行で用意）' },
      { sig: 'randomHand()', desc: '<code>"gu"</code> <code>"choki"</code> <code>"pa"</code> のどれかを、でたらめに返す（この修行で用意）' },
      'render',
      'print',
    ],
    sprites: ['gu', 'choki', 'pa'],
    master: ['勝ちの条件は、&& と || を組み合わせるのだぞよ。'],
    failMessage: '3回勝負が終わったときの win と lose の数、「けっか」の表示をたしかめるのだぞよ。',
  },

  check(result) {
    // 毎回、自分の手（x=100）→ 相手の手（x=300）の順に出しているので、組にして勝ち負けを数えなおす
    const hands = ['gu', 'choki', 'pa'];
    const shown = result.find('render', (c) => hands.includes(c.args[2]));
    const me = shown.filter((c) => c.args[0] === 100).map((c) => c.args[2]);
    const cpu = shown.filter((c) => c.args[0] === 300).map((c) => c.args[2]);
    if (me.length !== 3 || cpu.length !== 3) return false;
    const beats = { gu: 'choki', choki: 'pa', pa: 'gu' };
    let win = 0;
    let lose = 0;
    for (let i = 0; i < 3; i++) {
      if (me[i] === cpu[i]) continue;
      if (beats[me[i]] === cpu[i]) win++;
      else lose++;
    }
    return result.vars.win === win && result.vars.lose === lose
      && result.logs.some((l) => l.includes('けっか') && l.includes(`${win}勝`) && l.includes(`${lose}敗`));
  },
};
