from typing import Any

from pydantic import BaseModel

from .connect import manager as con
from .handler import event as e


class JSResponse(BaseModel):
    key: str
    data: Any


def expose(method):
    return e.registerfunction(method)


def jsfunction(key: str, args):
    data_ = JSResponse(key=key, data=args)
    return con.emit("calljs", data=data_.model_dump_json(indent=2))


def emit(event, data, room_id=None):
    return con.emit(event=event, data=data, room_id=room_id)


def client(app):
    return con.connection(app=app)
