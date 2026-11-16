// 練習部（修行0）の手順。上から順に進みます。
//
//  scene   : 'explain'（解説パート） | 'task'（課題パート）
//  target  : 光らせる要素（data-tut 属性の値）。null なら画面中央に吹き出しだけ
//  text    : 師匠の台詞
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
    text: 'よく来たな。ここが修行の画面じゃ。まずは画面の見方を教えよう。' },
  { scene: 'explain', target: 'explain-text', advance: 'next',
    text: '左は「解説エリア」。この修行で使う知識が書いてあるぞ。' },
  { scene: 'explain', target: 'sample-code', advance: 'next',
    text: 'まんなかは「お手本コード」。自由に書きかえてよい。下の「リセット」で元にもどせるぞ。' },
  { scene: 'explain', target: 'btn-run', advance: 'event:run:start',
    text: '「▶ 実行」を押すと、お手本コードが動く。押してみるのじゃ。' },
  { scene: 'explain', target: 'stage', advance: 'next',
    text: '結果はこのキャンバスに表示される。print の文字はその下の出力に出るぞ。' },
  { scene: 'explain', target: 'btn-step-auto', advance: 'event:step:start',
    text: '次は「🐢 ゆっくり実行」じゃ。コードが1行ずつ順番に動くようすを見られる。押してみよ。' },
  { scene: 'explain', target: 'side', advance: 'next',
    text: 'ゆっくり実行している間は、ここに変数の中身が出る。実行中の行はお手本コードに色がつくぞ。' },
  { scene: 'explain', target: 'controls', advance: 'next',
    text: '「⏭ 1行すすめる」は押すたびに1行だけ進む。一番上には今の状態が出るぞ。一時停止・止める・速さの調整もここじゃ。' },
  { scene: 'explain', target: 'btn-go-task', advance: 'event:nav:task',
    text: 'わかったら「課題へ」進むのじゃ。' },

  // ---- 課題パート ----
  { scene: 'task', target: 'problem', advance: 'next',
    text: '上には課題が書いてある。よく読むのじゃ。' },
  { scene: 'task', target: 'task-sample', advance: 'event:reveal',
    text: '左下は課題のお手本じゃが、隠されておる。クリックするとはがせるぞ。ためしに1枚はがしてみよ。' },
  { scene: 'task', target: 'lesson-info', advance: 'next',
    text: 'はがした割合は「解放率」としてここに出る。解放率が低いほど、クリアしたときの宝箱が多いぞ。課題の途中で解説にもどると宝箱が1つ減るから、よく考えるのじゃ。' },
  { scene: 'task', target: 'btn-sample-run', advance: 'next',
    text: '「お手本実行」を押すと、完成したときの動きを一度だけ見られる。' },
  { scene: 'task', target: 'user-code', advance: 'next', block: false,
    text: '右下が、あなたがコードを書く場所じゃ。課題のとおりに書いてみよ。' },
  { scene: 'task', target: 'btn-run', advance: 'event:clear', block: false,
    text: '書けたら「▶ 実行」。正しければクリアじゃ！' },
];
