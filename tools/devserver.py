"""ローカル確認用の簡易サーバ（キャッシュ無効）。

使い方（プロジェクトのフォルダで）:
    python tools/devserver.py          -> http://127.0.0.1:8000/
    python tools/devserver.py 8765     -> ポート指定
"""
import http.server
import os
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "application/javascript",
        ".mjs": "application/javascript",
        ".svg": "image/svg+xml",
        ".json": "application/json",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    print(f"http://127.0.0.1:{port}/ で起動しました（Ctrl+C で終了）")
    http.server.ThreadingHTTPServer(("127.0.0.1", port), NoCacheHandler).serve_forever()
