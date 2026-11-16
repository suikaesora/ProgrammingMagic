// 学習者が使える命令の説明（課題画面の「つかう命令」メモに表示されます）
//
// 各修行の task.refs に、ここの名前を並べると表示されます。
//   refs: ['circle', 'fill']
// その修行だけで使う命令（template で用意した関数など）は、オブジェクトで直接書けます。
//   refs: ['circle', { sig: 'drawGround()', desc: '地面をかく（この修行で用意）' }]
//
// sig  : 書き方（コードの見た目そのまま）
// desc : 説明（HTML 可）

export const commands = {
  print:          { sig: 'print(値)', desc: '出力エリアに表示する。<code>print("x は " + x)</code> のように + でつなげられる' },
  background:     { sig: 'background("色")', desc: '画面全体をその色でぬる（前の絵が消える）' },
  fill:           { sig: 'fill("色")', desc: 'これからかく図形のぬりの色を決める。色は <code>"red"</code> <code>"gold"</code> <code>"#ff8800"</code> など' },
  noFill:         { sig: 'noFill()', desc: '図形の中をぬらない' },
  stroke:         { sig: 'stroke("色", 太さ)', desc: '図形のふちの線の色と太さ' },
  noStroke:       { sig: 'noStroke()', desc: 'ふちの線をかかない' },
  circle:         { sig: 'circle(x, y, 半径)', desc: '(x, y) を中心に円をかく' },
  ellipse:        { sig: 'ellipse(x, y, 横半径, 縦半径)', desc: 'だ円をかく' },
  rect:           { sig: 'rect(x, y, 幅, 高さ)', desc: '(x, y) を左上にして四角形をかく' },
  line:           { sig: 'line(x1, y1, x2, y2)', desc: '2つの点を結ぶ線をかく' },
  text:           { sig: 'text("文字", x, y, 大きさ)', desc: 'キャンバスに文字をかく' },
  render:         { sig: 'render(x, y, "画像名", 幅)', desc: '(x, y) がまんなかになるように画像をかく。幅は省略できる（縦横の比はそのまま）。使える画像は下のとおり' },
  random:         { sig: 'random(最小, 最大)', desc: '最小〜最大のでたらめな数（小数）' },
  randomInt:      { sig: 'randomInt(最小, 最大)', desc: '最小〜最大のでたらめな整数' },
  onFrame:        { sig: 'onFrame(() => { … });', desc: '{ } の中を1秒に約60回くりかえす' },
  keyIsDown:      { sig: 'keyIsDown("キー")', desc: 'そのキーを押している間は true。キーの名前：<code>"ArrowRight"</code>（→） <code>"ArrowLeft"</code>（←） <code>"ArrowUp"</code>（↑） <code>"ArrowDown"</code>（↓） <code>" "</code>（スペース）。キャンバスをクリックしてから押す' },
  waitKey:        { sig: 'let key = waitKey();', desc: 'キーが押されるまで待ち、押されたキーの名前を返す（<code>"1"</code> <code>"a"</code> <code>"ArrowUp"</code> <code>" "</code> など）。キャンバスをクリックしてから押す' },
  mouseX:         { sig: 'mouseX() / mouseY()', desc: 'マウスの位置' },
  mouseIsPressed: { sig: 'mouseIsPressed()', desc: 'マウスのボタンを押している間は true' },
  WIDTH:          { sig: 'WIDTH / HEIGHT', desc: 'キャンバスの幅と高さ（400）' },
};
