// コレクションアイテムの定義。
// 修行データの items: ['star', ...] でここの id を指定します。
//
// 画像のファイル名は「修行のID-何番目」です（例：修行4の2つ目 → assets/items/l04-2.png）。
// 差し替えるときは、同じ名前の PNG（背景は透明、400×400 くらい）で上書きしてください。
// ※ id は保存データ（コレクション・デコレーション）で使っているので、変えないでください。

export const items = [
  // 修行0：修行の掟
  { id: 'star', name: 'きらきら星', image: 'assets/items/l00-1.png', description: 'はじめの一歩のあかし。' },

  // 修行1：命令魔法
  { id: 'hat', name: 'ぼうし', image: 'assets/items/l01-1.png', description: '変数のように中身を入れかえられる…？' },
  { id: 'ribbon', name: 'リボン', image: 'assets/items/l01-2.png', description: 'きゅっと結ぶ。' },
  { id: 'crown', name: 'かんむり', image: 'assets/items/l01-3.png', description: '王さまの気分。' },

  // 修行2：計算魔法
  { id: 'glasses', name: 'めがね', image: 'assets/items/l02-1.png', description: 'バグがよく見える。' },
  { id: 'cloud', name: 'くも', image: 'assets/items/l02-2.png', description: 'ふわふわ。' },
  { id: 'moon', name: 'お月さま', image: 'assets/items/l02-3.png', description: '夜ふかし修行のおともに。' },

  // 修行3：箱記憶魔法
  { id: 'note', name: '音符', image: 'assets/items/l03-1.png', description: 'ループするメロディ。' },
  { id: 'leaf', name: 'はっぱ', image: 'assets/items/l03-2.png', description: '何度でも芽吹く。' },
  { id: 'balloon', name: 'ふうせん', image: 'assets/items/l03-3.png', description: '毎フレームちょっとずつ上がる。' },

  // 修行4：分岐魔法
  { id: 'wand', name: '見習いの杖', image: 'assets/items/l04-1.png', description: 'もし〜なら、の魔法がよく通る。' },
  { id: 'spellbook', name: '呪文の書', image: 'assets/items/l04-2.png', description: 'if と else がびっしり書いてある。' },
  { id: 'crystal', name: '分かれ道の水晶', image: 'assets/items/l04-3.png', description: 'のぞくと2つの未来が見える。' },

  // 修行5：ループ魔法
  { id: 'candle', name: '終わらないろうそく', image: 'assets/items/l05-1.png', description: '無限ループで燃え続ける…わけではない。' },
  { id: 'owl', name: 'ふくろう', image: 'assets/items/l05-2.png', description: '同じことを何度でも聞いてくれる。' },
  { id: 'key', name: '金のかぎ', image: 'assets/items/l05-3.png', description: 'ループの出口をあけるかぎ。' },

  // 修行6：段階ループ魔法
  { id: 'ring', name: '段階の指輪', image: 'assets/items/l06-1.png', description: 'i が1ずつ増えるたびに光る。' },
  { id: 'amulet', name: 'お守り', image: 'assets/items/l06-2.png', description: 'for 文のカッコの中を守ってくれる。' },
  { id: 'mushroom', name: 'ふえるキノコ', image: 'assets/items/l06-3.png', description: '10回くりかえすと10個になる。' },

  // 修行7：命令生み出し魔法
  { id: 'scroll', name: '命令の巻物', image: 'assets/items/l07-1.png', description: '自分で作った命令を書きとめておく。' },
  { id: 'gem', name: 'もどり石', image: 'assets/items/l07-2.png', description: 'return すると手元にもどってくる。' },
  { id: 'feather', name: '引数の羽', image: 'assets/items/l07-3.png', description: '材料をふわりと関数へとどける。' },

  // 修行8：高速ループ魔法
  { id: 'lantern', name: '六十のランタン', image: 'assets/items/l08-1.png', description: '1秒に60回またたく。' },
  { id: 'bell', name: 'フレームの鐘', image: 'assets/items/l08-2.png', description: '鳴るたびに画面がかきかわる。' },
  { id: 'clover', name: '四つ葉', image: 'assets/items/l08-3.png', description: '当たり判定がうまくいくおまじない。' },

  // 修行9：まとめ魔法
  { id: 'potionred', name: '赤い薬', image: 'assets/items/l09-1.png', description: 'hp をまとめて回復。' },
  { id: 'potionblue', name: '青い薬', image: 'assets/items/l09-2.png', description: 'mp もまとめて回復。' },
  { id: 'cat', name: '黒ねこ', image: 'assets/items/l09-3.png', description: '名前も年も、ひとまとめにして覚えている。' },

  // 修行10：応用：JANKEN
  { id: 'dice', name: 'サイコロ', image: 'assets/items/l10-1.png', description: 'randomInt(1, 6) の化身。' },
  { id: 'cookie', name: 'クッキー', image: 'assets/items/l10-2.png', description: 'じゃんけんの景品。' },
  { id: 'apple', name: 'りんご', image: 'assets/items/l10-3.png', description: '勝っても負けても、おいしい。' },

  // 修行11：最終課題
  { id: 'sword', name: '勇気の剣', image: 'assets/items/l11-1.png', description: 'たたかうコマンドの象徴。' },
  { id: 'shieldgold', name: '金の盾', image: 'assets/items/l11-2.png', description: 'ぼうぎょコマンドの象徴。' },
  { id: 'dragonegg', name: 'ドラゴンのたまご', image: 'assets/items/l11-3.png', description: 'いつか、きみのゲームの主役になるかも。' },
];

export function getItem(id) {
  return items.find((it) => it.id === id) || null;
}
