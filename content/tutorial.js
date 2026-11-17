// 練習部（修行0：修行の掟）の手順。上から順に進みます。
//
//  scene   : 'explain'（解説パート） | 'task'（課題パート）
//  target  : 光らせる要素（data-tut 属性の値）。null なら画面中央に吹き出しだけ
//  text    : 師匠（ゾルク）の台詞
//  advance : 'next' … 吹き出しの「次へ」で進む
//            'event:<名前>' … その操作をしたら進む
//              run:start  … 「実行」を押した
//              step:start … 「ゆっくり実行」か「1行すすめる」を押した
//              nav:task   … 課題パートへ移動した
//              reveal     … 行隠しをはがした
//              clear      … 課題をクリアした
//  block   : false にすると、光らせた場所以外も操作できる（初期値 true）
//
// 使える target：explain-text, sample-code, lesson-info, stage, controls, btn-run,
//   btn-step-auto, btn-step-one, speed, side, btn-go-task,
//   problem, task-sample, user-code, btn-sample-run

export const tutorialSteps = [
  // ---- 解説パート ----
  { scene: 'explain', target: null, advance: 'next',
    text: 'よく来たな、レン。ここが修行の場だぞよ。まずは画面の見方を教えよう。' },
  { scene: 'explain', target: 'explain-text', advance: 'next',
    text: '左は「解説」。わしが書いた魔法の教えだ。修行の前に読むのだぞよ。' },
  { scene: 'explain', target: 'sample-code', advance: 'next',
    text: 'まんなかは「お手本コード」。自由に書きかえてよいぞよ。下の「リセット」で元にもどせる。' },
  { scene: 'explain', target: 'btn-run', advance: 'event:run:start',
    text: '「▶ 実行」を押すと、お手本コードが動く。押してみるのだぞよ。' },
  { scene: 'explain', target: 'stage', advance: 'next',
    text: '結果はこのキャンバスに出る。print の文字は、その下の出力に出るぞよ。' },
  { scene: 'explain', target: 'btn-step-auto', advance: 'event:step:start',
    text: '次は「🐢 ゆっくり実行」だ。コードが1行ずつ順番に動くようすを見られるぞよ。押してみよ。' },
  { scene: 'explain', target: 'side', advance: 'next',
    text: 'ゆっくり実行している間は、ここに変数の中身が出る。実行中の行は、お手本コードに色がつくぞよ。' },
  { scene: 'explain', target: 'controls', advance: 'next',
    text: '「⏭ 1行すすめる」は押すたびに1行だけ進む。一番上には今の状態が出るぞよ。' },
  { scene: 'explain', target: null, advance: 'next',
    text: 'まちがえるとエラーが出るが、こわがることはない。エラーは「ここがおかしい」と教えてくれる手紙だぞよ。' },
  { scene: 'explain', target: 'btn-go-task', advance: 'event:nav:task',
    text: 'わかったら「課題へ」進むのだぞよ。' },

  // ---- 課題パート ----
  { scene: 'task', target: 'problem', advance: 'next',
    text: '上には課題が書いてある。右には、使う命令の書き方メモもあるぞよ。' },
  { scene: 'task', target: 'task-sample', advance: 'event:reveal',
    text: '左下は課題のお手本だが、隠されておる。クリックするとはがせるぞよ。ためしに1枚はがしてみよ。' },
  { scene: 'task', target: 'lesson-info', advance: 'next',
    text: 'はがした割合は「解放率」としてここに出る。次の修行からは、解放率が低いほど、クリアしたときの宝箱が多くなるぞよ。課題の途中で解説にもどると宝箱が1つ減るから、気をつけるのだぞよ。この修行の宝箱は、いつも1つだ。' },
  { scene: 'task', target: 'btn-sample-run', advance: 'next',
    text: '「お手本実行」を押すと、完成したときの動きを一度だけ見られるぞよ。' },
  { scene: 'task', target: 'user-code', advance: 'next', block: false,
    text: '右下が、おぬしがコードを書く場所だ。課題のとおりに書いてみるのだぞよ。' },
  { scene: 'task', target: 'btn-run', advance: 'event:clear', block: false,
    text: '書けたら「▶ 実行」。正しければクリアだぞよ！' },
];
