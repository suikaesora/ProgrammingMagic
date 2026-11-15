// 修行0（練習部）: 師匠の説明に従って、教材の使い方を学ぶ
import { tutorialSteps } from '../tutorial.js';

export default {
  id: 'l00',
  label: '練習',                 // 番号の代わりに表示するラベル（省略可）
  title: 'はじめての修行',
  summary: '修行のやり方を、師匠と一緒にたしかめよう。',
  difficulty: 1,                 // 難易度（星の数 1〜5）
  items: ['star', 'heart', 'flower'],  // 宝箱から出るアイテム（最大3つ）
  tutorial: tutorialSteps,       // 手順（練習部のみ）

  // 全体コード。/*@USER@*/ の位置に、お手本コードや学習者のコードが埋め込まれる
  template: `/*@USER@*/`,

  explain: {
    html: `
      <h2>コードは上から順に動く</h2>
      <p>プログラムは、<strong>上の行から順番に</strong>1行ずつ実行されます。</p>
      <p>お手本コードでは、次の2つの命令を使っています。</p>
      <ul>
        <li><code>print("文字")</code> … 下の出力エリアに文字を表示する</li>
        <li><code>circle(x, y, 半径)</code> … キャンバスに円をかく</li>
      </ul>
      <p>キャンバスは <strong>横400 × 縦400</strong>。左上が <code>(0, 0)</code>、右下が <code>(400, 400)</code> です。</p>
      <p>お手本コードの数字を書きかえて、もう一度実行してみよう。元に戻したいときは「リセット」ボタン。</p>
    `,
    sampleCode: `// 「//」から後ろはメモ（コメント）。実行されないよ
print("こんにちは、師匠！");
circle(200, 200, 60);`,
    master: [
      'ようこそ、わが道場へ。',
      'まずはお手本を動かしてみるのじゃ。',
    ],
    // 行番号の横に表示するアイコン（省略可）{ 行番号: 画像パス }
    lineIcons: { 2: 'assets/icons/point.svg' },
  },

  task: {
    problemHtml: `
      <h3>課題：まんなかに大きな円</h3>
      <p><code>circle</code> を使って、キャンバスのまんなか <code>(200, 200)</code> に <strong>半径 80</strong> の円をかこう。</p>
    `,
    answerCode: `print("修行開始！");
circle(200, 200, 80);`,
    // 行隠しを入れる行（1始まり）。省略すると自動で約8割を隠す
    hiddenLines: [2],
    starterCode: `// ここにコードを書こう\n`,
    master: ['お手本の隠しは、はがすほど宝箱が減るぞ。'],
    failMessage: 'おしい！ 位置と半径をもう一度たしかめよう。',
  },

  // クリア判定。result の中身は docs/コンテンツ作成ガイド.md を参照
  check(result) {
    return result.drawCalls.some((c) =>
      c.type === 'circle' && c.args[0] === 200 && c.args[1] === 200 && c.args[2] === 80);
  },
};
