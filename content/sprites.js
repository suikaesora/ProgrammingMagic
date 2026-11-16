// render(x, y, "画像名", 幅) で描ける画像の登録。
//
// 追加のしかた：
//   1. 画像を assets/sprites/ に置く（背景が透明な PNG がおすすめ。SVG も可）
//   2. 下に1行足す。左の名前（例：slime）が、コードで書く「画像名」になる
//
// image : 画像ファイルのパス
// width : 幅を省略して render したときの幅（キャンバスは 400×400）。高さは縦横比から自動で決まる
// name  : 課題画面の「つかう命令」メモに出す表示名

export const sprites = {
  hero:   { image: 'assets/sprites/hero.svg',   width: 80, name: '勇者' },
  slime:  { image: 'assets/sprites/slime.svg',  width: 80, name: 'スライム' },
  potion: { image: 'assets/sprites/potion.svg', width: 40, name: 'やくそう' },
};
