#!/usr/bin/env python

import asyncio
import websockets

CONNECTIONS = set()


async def register(websocket):
    CONNECTIONS.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        CONNECTIONS.remove(websocket)


async def send_data():
    count = 1
    while True:
        if count >= 100:
            count = 2
        websockets.broadcast(CONNECTIONS, str(count))
        count += 1
        await asyncio.sleep(5)


async def main():
    async with websockets.serve(register, "localhost", 8765):
        await send_data()  # run forever


if __name__ == "__main__":
    print("Started Server")
    asyncio.run(main())
