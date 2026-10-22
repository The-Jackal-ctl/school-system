
import os
import threading
import webbrowser

from app import app


HOST = "127.0.0.1"
PORT = 5000
APP_URL = f"http://{HOST}:{PORT}"


def open_app():
    webbrowser.open(APP_URL)


if __name__ == "__main__":
    threading.Timer(1.5, open_app).start()

    app.run(
        host=HOST,
        port=PORT,
        debug=False,
        use_reloader=False
    )
