# コード修行（仮称）

インストラクショナル・デザインに基づく、JavaScript プログラミング学習 Web 教材です。
HTML + CSS + JavaScript のみの静的サイトで、ビルドは不要です。

## ローカルで動かす

```
python tools/devserver.py
```

http://127.0.0.1:8000/ を開いてください（`index.html` を直接開くと動きません）。

## 公開（GitHub Pages）

リポジトリのルートをそのまま公開すれば動きます（相対パスのみ使用）。

## フォルダ構成

```
index.html          入口
content/            ★ 教材の中身（修行・物語・アイテム・設定）… ここを編集する
css/theme.css       ★ 色・線・フォントの基準
assets/             画像（仮の SVG）
js/core/            保存・進捗・テーマ
js/runner/          コードの実行エンジン（通常実行・インタプリタ実行）
js/editor/          コードエリア・行隠し
js/ui/              ビジュアルエリア・師匠・練習部の手順など
js/scenes/          各画面（導入・ホーム・解説・課題・クリア・認定・装飾）
lib/acorn.js        JavaScript 構文解析ライブラリ（MIT License）
docs/               仕様書・コンテンツ作成ガイド
tools/devserver.py  確認用サーバ
```

コンテンツの書き方は [docs/コンテンツ作成ガイド.md](docs/コンテンツ作成ガイド.md) を参照してください。
