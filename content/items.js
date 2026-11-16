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

  // ---- 魔法の修行のアイテム（修行4〜11） ----
  { id: 'wand', name: '見習いの杖', image: 'assets/items/wand.svg', description: 'もし〜なら、の魔法がよく通る。' },
  { id: 'spellbook', name: '呪文の書', image: 'assets/items/spellbook.svg', description: 'if と else がびっしり書いてある。' },
  { id: 'crystal', name: '分かれ道の水晶', image: 'assets/items/crystal.svg', description: 'のぞくと2つの未来が見える。' },
  { id: 'candle', name: '終わらないろうそく', image: 'assets/items/candle.svg', description: '無限ループで燃え続ける…わけではない。' },
  { id: 'owl', name: 'ふくろう', image: 'assets/items/owl.svg', description: '同じことを何度でも聞いてくれる。' },
  { id: 'key', name: '金のかぎ', image: 'assets/items/key.svg', description: 'ループの出口をあけるかぎ。' },
  { id: 'ring', name: '段階の指輪', image: 'assets/items/ring.svg', description: 'i が1ずつ増えるたびに光る。' },
  { id: 'amulet', name: 'お守り', image: 'assets/items/amulet.svg', description: 'for 文のカッコの中を守ってくれる。' },
  { id: 'mushroom', name: 'ふえるキノコ', image: 'assets/items/mushroom.svg', description: '10回くりかえすと10個になる。' },
  { id: 'scroll', name: '命令の巻物', image: 'assets/items/scroll.svg', description: '自分で作った命令を書きとめておく。' },
  { id: 'gem', name: 'もどり石', image: 'assets/items/gem.svg', description: 'return すると手元にもどってくる。' },
  { id: 'feather', name: '引数の羽', image: 'assets/items/feather.svg', description: '材料をふわりと関数へとどける。' },
  { id: 'lantern', name: '六十のランタン', image: 'assets/items/lantern.svg', description: '1秒に60回またたく。' },
  { id: 'bell', name: 'フレームの鐘', image: 'assets/items/bell.svg', description: '鳴るたびに画面がかきかわる。' },
  { id: 'clover', name: '四つ葉', image: 'assets/items/clover.svg', description: '当たり判定がうまくいくおまじない。' },
  { id: 'potionred', name: '赤い薬', image: 'assets/items/potionred.svg', description: 'hp をまとめて回復。' },
  { id: 'potionblue', name: '青い薬', image: 'assets/items/potionblue.svg', description: 'mp もまとめて回復。' },
  { id: 'cat', name: '黒ねこ', image: 'assets/items/cat.svg', description: '名前も年も、ひとまとめにして覚えている。' },
  { id: 'dice', name: 'サイコロ', image: 'assets/items/dice.svg', description: 'randomInt(1, 6) の化身。' },
  { id: 'cookie', name: 'クッキー', image: 'assets/items/cookie.svg', description: 'じゃんけんの景品。' },
  { id: 'apple', name: 'りんご', image: 'assets/items/apple.svg', description: '勝っても負けても、おいしい。' },
  { id: 'sword', name: '勇気の剣', image: 'assets/items/sword.svg', description: 'たたかうコマンドの象徴。' },
  { id: 'shieldgold', name: '金の盾', image: 'assets/items/shieldgold.svg', description: 'ぼうぎょコマンドの象徴。' },
  { id: 'dragonegg', name: 'ドラゴンのたまご', image: 'assets/items/dragonegg.svg', description: 'いつか、きみのゲームの主役になるかも。' },
];

export function getItem(id) {
  return items.find((it) => it.id === id) || null;
}
