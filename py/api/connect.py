from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Optional, Union

import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .handler import event


class SIOManager:
    def __init__(self) -> None:
        self.active_connections: list[str] = []
        self.window_settings_ = {}
        self.sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
        self.sio_app = socketio.ASGIApp(
            socketio_server=self.sio, socketio_path="/__pyfast__/socket.io"
        )
        self._should_stop = False
        # self.loop = asyncio.get_event_loop()
        self.init_connection()

    def emit(self, event, data, room_id=None):
        asyncio.ensure_future(self.sio.emit(event=event, data=data, room=room_id))

    def onMassege(self, event: str, handler, namespace: Optional[str] = None):
        @self.sio.on(event=event, namespace=namespace)
        async def wrapper(*args, **kwargs):
            message_data = {}
            if len(args) > 0:
                message_data["sid"] = args[0]
                message_data["data"] = args[1]
            if len(kwargs) > 0:
                message_data.update(kwargs)

            await handler(message_data)

        asyncio.ensure_future(wrapper())

    def window_settings(
        self,
        height,
        width,
        x_position,
        y_position,
        document_title,
        window_icon: Union[str, Path],
        document_language,
        dark_mode,
        fullscreen,
    ):
        if height is not None:
            self.window_settings_["fullscreen"] = fullscreen

        if height is not None:
            self.window_settings_["height"] = height
        if width is not None:
            self.window_settings_["width"] = width
        if x_position is not None:
            self.window_settings_["x_position"] = x_position
        if y_position is not None:
            self.window_settings_["y_position"] = y_position
        if document_title is not None:
            self.window_settings_["document_title"] = document_title
        if window_icon is not None:
            self.window_settings_["window_icon"] = window_icon
        if document_language is not None:
            self.window_settings_["document_language"] = document_language
        if dark_mode is not None:
            self.window_settings_["dark_mode"] = dark_mode

    def init_connection(self):
        @self.sio.on("connect")
        async def handle_connect(sid, environ):
            print(f"Client connected: {sid}")

        @self.sio.on("disconnect")
        def handle_disconnect(sid):
            print("Disconnect")

        @self.sio.on("error")
        def handle_error(sid, error):
            print(f"Socket.IO error from {sid}: {error}")

        @self.sio.on("callpy")
        async def handle_message(sid, data: dict):
            print(data)
            func = data.get("key", None)
            args = data.get("args", [])
            result = event.callfunction(uuid=func, args=args)
            await self.sio.emit("event2", data=result)

    def connection(self, app: FastAPI):  # background
        app.mount("/__pyfast__/", self.sio_app)
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["http://localhost", "http://localhost:3000", "*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )


manager = SIOManager()
