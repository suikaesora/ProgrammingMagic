// render(x, y, "画像名", 幅) で描ける画像の登録。
//
// 追加のしかた：
//   1. 画像を assets/sprites/ に置く（背景が透明な PNG。表示する幅の4倍くらいの大きさで描くとくっきり出る）
//   2. 下に1行足す。左の名前（例：slime）が、コードで書く「画像名」になる
//
// image  : 画像ファイルのパス
// avatar : true にすると、image の代わりにプレイヤーが導入部で選んだ姿（config.avatars）を使う
// width  : 幅を省略して render したときの幅（キャンバスは 400×400）。高さは縦横比から自動で決まる
// name   : 課題画面の「つかう命令」メモに出す表示名
//
// いま入っている画像は仮のものです。同じ名前の PNG で上書きすれば差し替わります。

export const sprites = {
  // 登場人物
  ren:    { avatar: true, width: 80, name: 'レン（あなた）' },
  zork:   { image: 'assets/master/master.png', width: 90, name: 'ゾルク' },

  // モンスター
  slime:  { image: 'assets/sprites/slime.png',  width: 80,  name: 'スライム' },
  dragon: { image: 'assets/sprites/dragon.png', width: 150, name: 'ドラゴン' },

  // 魔法・アイテム
  fire:   { image: 'assets/sprites/fire.png',   width: 60, name: 'ほのお' },
  herb:   { image: 'assets/sprites/herb.png',   width: 50, name: 'やくそう' },
  coin:   { image: 'assets/sprites/coin.png',   width: 40, name: 'コイン' },
  star:   { image: 'assets/sprites/star.png',   width: 40, name: 'ほし' },
  chest:  { image: 'assets/sprites/chest.png',  width: 70, name: 'たからばこ' },
  shield: { image: 'assets/sprites/shield.png', width: 60, name: 'たて' },

  // じゃんけん
  gu:     { image: 'assets/sprites/gu.png',    width: 80, name: 'グー' },
  choki:  { image: 'assets/sprites/choki.png', width: 80, name: 'チョキ' },
  pa:     { image: 'assets/sprites/pa.png',    width: 80, name: 'パー' },
};
