#!/usr/bin/env python3
"""Локальный сервер для LinguaClass.

Запуск:
    python serve.py            # порт 8000
    python serve.py 4173       # свой порт

Сервер слушает 0.0.0.0, поэтому приложение можно открыть и с телефона
в той же Wi-Fi сети — адрес печатается при старте.
"""

import http.server
import os
import socket
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


def lan_ip() -> str:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        s.close()


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    os.chdir(ROOT)

    handler = http.server.SimpleHTTPRequestHandler
    server = http.server.ThreadingHTTPServer(("0.0.0.0", port), handler)

    ip = lan_ip()
    print("\n  LinguaClass запущен\n")
    print(f"  Компьютер:  http://localhost:{port}/")
    print(f"  Телефон:    http://{ip}:{port}/   (та же Wi-Fi сеть)")
    print("\n  Остановить: Ctrl+C\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nСервер остановлен.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
