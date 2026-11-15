// コレクションアイテムの定義。
// 修行データの items: ['star', ...] でここの id を指定します。
// 画像は assets/items/ に置いた SVG / PNG に差し替えてください。

export const items = [
  { id: 'star', name: 'きらきら星', image: 'assets/items/star.svg', description: 'はじめの一歩のあかし。' },
  { id: 'heart', name: 'ハート', image: 'assets/items/heart.svg', description: 'コードへの愛。' },
  { id: 'flower', name: 'お花', image: 'assets/items/flower.svg', description: '道場の庭に咲いていた。' },
  { id: 'hat', name: 'ぼうし', image: 'assets/items/hat.svg', description: '変数のように中身を入れかえられる…？' },
  { id: 'ribbon', name: 'リボン', image: 'assets/items/ribbon.svg', description: 'きゅっと結ぶ。' },
  { id: 'crown', name: 'かんむり', image: 'assets/items/crown.svg', description: '王さまの気分。' },
  { id: 'glasses', name: 'めがね', image: 'assets/items/glasses.svg', description: 'バグがよく見える。' },
  { id: 'cloud', name: 'くも', image: 'assets/items/cloud.svg', description: 'ふわふわ。' },
  { id: 'moon', name: 'お月さま', image: 'assets/items/moon.svg', description: '夜ふかし修行のおともに。' },
  { id: 'note', name: '音符', image: 'assets/items/note.svg', description: 'ループするメロディ。' },
  { id: 'leaf', name: 'はっぱ', image: 'assets/items/leaf.svg', description: '何度でも芽吹く。' },
  { id: 'balloon', name: 'ふうせん', image: 'assets/items/balloon.svg', description: '毎フレームちょっとずつ上がる。' },
];

export function getItem(id) {
  return items.find((it) => it.id === id) || null;
}
