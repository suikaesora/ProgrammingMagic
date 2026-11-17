// 修行0（練習部）: 修行の掟。ゾルクの説明に従って、教材の使い方を学ぶ
import { tutorialSteps } from '../tutorial.js';

export default {
  id: 'l00',
  label: '掟',                    // 番号の代わりに表示するラベル（省略可）
  title: '修行の掟',
  summary: '修行のやり方と、エラーとのつきあい方を、ゾルクに教わろう。',
  difficulty: 1,                  // 難易度（星の数 1〜5）
  items: ['star', 'heart', 'flower'],  // 宝箱から出るアイテム（最大3つ）
  tutorial: tutorialSteps,        // 手順（練習部のみ）

  // 全体コード。/*@USER@*/ の位置に、お手本コードや学習者のコードが埋め込まれる
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>修行の掟</h2>
      <p>よく来た、レン。わしは大魔法使いゾルク。ここでは「プログラミング」という魔法を教える。</p>
      <p>プログラミングの魔法は、<strong>コード</strong>と呼ばれる呪文を書いて使う。コードは<strong>上の行から順番に</strong>実行される。</p>

      <h3>修行の進め方</h3>
      <ol>
        <li><strong>解説</strong>（この文章）を読み、まんなかの<strong>お手本コード</strong>を実行してみる</li>
        <li>お手本の数字や文字を書きかえて、何が変わるか試す（「リセット」で元にもどせる）</li>
        <li>わかったら<strong>課題</strong>へ進み、自分の手でコードを書く</li>
      </ol>

      <h3>エラーをおそれるな</h3>
      <p>コードをまちがえると<strong>エラー</strong>が出る。だが、エラーは失敗ではない。<strong>「ここがおかしいぞ」と教えてくれる手紙</strong>なのだ。</p>
      <ul>
        <li>エラーの出た行には色がつく。その行と、その<strong>1つ上の行</strong>をよく見る</li>
        <li><code>"</code> や <code>(</code> <code>)</code> の閉じ忘れ、全角の文字がまざっていないかを確かめる</li>
        <li>何度まちがえてもよい。大魔法使いのわしも、毎日エラーを出しておる</li>
      </ul>

      <details class="tips">
        <summary>💡 もっと知りたい人へ（TIPS）</summary>
        <p><code>//</code> から後ろは<strong>コメント</strong>といって、実行されないメモだ。自分へのメモや、説明を書いておくのに使う。</p>
        <p>コードは<strong>半角</strong>で書く。日本語入力（全角）のままだと、見た目がにていても別の文字になり、エラーになる。キーボードの「半角/全角」キーで切りかえよう。</p>
      </details>
    `,
    sampleCode: `// 「//」から後ろはメモ（コメント）。実行されない
print("ゾルクの道場へ、ようこそ");
render(200, 200, "zork");`,
    master: [
      'よく来たな、レン。わしがゾルクだぞよ。',
      'まずはお手本を動かしてみるのだぞよ。',
    ],
    // 行番号の横に表示するアイコン（省略可）{ 行番号: 画像パス }
    lineIcons: { 2: 'assets/icons/point.svg' },
  },

  task: {
    problemHtml: `
      <h3>課題：レンを呼び出せ</h3>
      <p><code>render</code> を使って、キャンバスのまんなか <code>(200, 200)</code> に<strong>レン</strong>（画像名 <code>"ren"</code>）を出そう。</p>
      <p>お手本の <code>"zork"</code> の部分が、画像の名前だったな。</p>
    `,
    answerCode: `// まんなかにレンを呼び出す
render(200, 200, "ren");`,
    // 行隠しを入れる行（1始まり）。省略すると自動で約8割を隠す
    hiddenLines: [1, 2],
    starterCode: `// ここにコードを書こう\n`,
    refs: ['render'],                 // 課題画面の「つかう命令」メモ（content/commands.js の名前）
    sprites: ['ren', 'zork'],         // 「つかう命令」メモに見本を出す画像（省略するとすべて）
    master: ['お手本の隠しは、はがすほど宝箱が減るぞよ。'],
    failMessage: 'おしいぞよ！ 画像の名前と、位置の数字をもう一度たしかめるのだぞよ。',
  },

  // クリア判定。result の中身は docs/コンテンツ作成ガイド.md を参照
  check(result) {
    return result.find('render', (c) => c.args[2] === 'ren' && c.args[0] === 200 && c.args[1] === 200).length > 0;
  },
};
