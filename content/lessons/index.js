// 修行の一覧。ここに並べた順番が修行番号になります（0番目が練習部）。
// 新しい修行を追加するには：
//   1. lessonXX.js を作る（既存ファイルをコピーすると楽）
//   2. 下で import して lessons 配列に加える

import practice from './lesson00_practice.js';
import lesson01 from './lesson01.js';
import lesson02 from './lesson02.js';
import lesson03 from './lesson03.js';

export const lessons = [
  practice,
  lesson01,
  lesson02,
  lesson03,
];
