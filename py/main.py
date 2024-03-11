import argparse
import os

import uvicorn
from api.core import client, emit, expose
from fastapi import FastAPI

app = FastAPI()
client(app)
_environ = os.environ.copy()


@expose
def main():
    print("hallo")
    emit(event="frompython", data={"message": "hallo from python "})


def init_argparse() -> argparse.ArgumentParser:
    """Initialises argparse and returns an argument parser

    Returns:
        argparse.ArgumentParser: Object for parsing CLI arguments
    """
    parser = argparse.ArgumentParser(
        description="Launches the Python API",
    )
    parser.add_argument(
        "--host",
        dest="host",
        default="127.0.0.1",
        help="Bind socket to host. [default: %(default)s]",
    )
    parser.add_argument(
        "--port",
        dest="port",
        default=8000,
        type=int,
        help="Bind socket to port. [default: %(default)s]",
    )
    parser.add_argument(
        "--log-level",
        dest="log_level",
        default="info",
        choices=["critical", "error", "warning", "info", "debug", "trace"],
        help="Log level. [default: %(default)s]",
    )
    parser.add_argument(
        "--secret",
        dest="secret",
        default=None,
        help="Server secret token. [default: %(default)s]",
    )
    return parser


if __name__ == "__main__":
    parser = init_argparse()
    args = parser.parse_args()

    # if args.secret:
    # _environ["SECRET_TOKEN"] = args.secret

    uvicorn.run(app, host=args.host, port=args.port, log_level=args.log_level)
