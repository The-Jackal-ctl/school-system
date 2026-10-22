
import os
import threading
import time
from pathlib import Path
from urllib.request import urlopen

import webview


HOST = "127.0.0.1"
PORT = 5000
APP_URL = f"http://{HOST}:{PORT}"


def load_desktop_config():
    config_path = Path(__file__).with_name("desktop.env")

    if not config_path.exists():
        raise RuntimeError(
            "desktop.env is missing. Create it using desktop.env.example "
            "and enter your local PostgreSQL connection settings."
        )

    for line in config_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()

        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key in ("DATABASE_URL", "SECRET_KEY") and value:
            os.environ[key] = value


def start_server():
    from app import app

    app.run(
        host=HOST,
        port=PORT,
        debug=False,
        use_reloader=False
    )


def wait_for_server(timeout=30):
    deadline = time.time() + timeout

    while time.time() < deadline:
        try:
            with urlopen(APP_URL, timeout=1):
                return
        except Exception:
            time.sleep(0.5)

    raise RuntimeError(
        "The local application did not start. "
        "Check the database configuration and application errors."
    )


if __name__ == "__main__":
    load_desktop_config()

    server_thread = threading.Thread(
        target=start_server,
        daemon=True
    )
    server_thread.start()

    wait_for_server()

    webview.create_window(
        "Soroti Elites School Management",
        APP_URL,
        width=1200,
        height=800,
        min_size=(900, 600)
    )

    webview.start()
