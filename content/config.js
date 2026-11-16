// 教材全体の設定。文言や画像パスはここで変更できます。

export const config = {
  appTitle: 'コード修行',
  appSubtitle: 'JavaScript でゲームづくりの道をゆく',

  // キャンバスの大きさ（わかりやすい数）
  canvas: { width: 400, height: 400 },

  // 師匠
  master: {
    name: '師匠',
    image: 'assets/master/master.svg',
  },

  // 導入部で選ぶ見た目（「男・女」という語は使わない）
  avatars: [
    { id: 'a', label: 'すがた ひとつめ', image: 'assets/avatar/a.svg' },
    { id: 'b', label: 'すがた ふたつめ', image: 'assets/avatar/b.svg' },
  ],

  // 認定証（1枚の画像。差し替えはこのパスの画像を置き換えるだけ）
  certificateImage: 'assets/certificate.svg',

  // 導入部の文字送り速度（ミリ秒/文字）。句読点ではさらに待つ
  introTypeSpeed: 70,
  introPunctPause: 350,

  // インタプリタ自動実行の初期速度（ミリ秒/ステップ）
  stepSpeedDefault: 400,

  // コードエリアのインデント
  indent: '  ',

  // 課題で行隠しの位置が指定されていない場合、自動で隠す割合
  autoHideRatio: 0.8,

  // 宝箱の数（解放率が低いほど多い）
  chestRule(rate) {
    if (rate < 1 / 3) return 3;
    if (rate < 2 / 3) return 2;
    return 1;
  },

  // 課題を始めた後に解説を見たとき、宝箱をいくつ減らすか（宝箱は最低1つは残る。0 にすると減らさない）
  explainPenalty: 1,

  // 課題のお手本をコピーできるか（false：コピー・切り取り・ドラッグで持ち出せない。打った方が身につくため）
  allowSampleCopy: false,
};
