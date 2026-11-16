// 修行の一覧。ここに並べた順番が修行番号になります（0番目が練習部）。
// 新しい修行を追加するには：
//   1. lessonXX.js を作る（既存ファイルをコピーすると楽）
//   2. 下で import して lessons 配列に加える
//
// 内容は docs/教材修行設計概要.md にそって作っています。

import practice from './lesson00_practice.js'; // 0. 修行の掟
import lesson01 from './lesson01.js';           // 1. 命令魔法（関数の呼び出し）
import lesson02 from './lesson02.js';           // 2. 計算魔法（演算子）
import lesson03 from './lesson03.js';           // 3. 箱記憶魔法（変数）
import lesson04 from './lesson04.js';           // 4. 分岐魔法（if・waitKey）
import lesson05 from './lesson05.js';           // 5. ループ魔法（while）
import lesson06 from './lesson06.js';           // 6. 段階ループ魔法（for）
import lesson07 from './lesson07.js';           // 7. 命令生み出し魔法（関数の定義）
import lesson08 from './lesson08.js';           // 8. 高速ループ魔法（onFrame）
import lesson09 from './lesson09.js';           // 9. まとめ魔法（オブジェクト）
import lesson10 from './lesson10.js';           // 10. 応用編：JANKEN ゲーム
import lesson11 from './lesson11.js';           // 11. 最終課題：モンスターと戦うゲーム

export const lessons = [
  practice,
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
  lesson10,
  lesson11,
];
