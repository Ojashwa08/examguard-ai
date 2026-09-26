"""
WebSocket Connection Manager & Real-Time Event Dispatcher.
Handles connection lifecycles, pub/sub channel subscriptions, heartbeat pings, and broadcast messaging.
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Set
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger("examguard.websocket_mgr")


class WebSocketManager:
    """
    Centralized manager for client WebSocket connections and multi-channel pub/sub broadcasting.
    """

    SUPPORTED_CHANNELS: Set[str] = {
        "telemetry",
        "incidents",
        "ledger",
        "proctoring",
        "chaos_simulation",
    }

    def __init__(self):
        # All connected clients mapped to their Metadata
        self.active_connections: Set[WebSocket] = set()
        # Pub/Sub channels mapping channel name to subscribed WebSockets
        self.channels: Dict[str, Set[WebSocket]] = {
            channel: set() for channel in self.SUPPORTED_CHANNELS
        }
        # Client metadata mapping (e.g., user_id, connection time)
        self.connection_metadata: Dict[WebSocket, dict] = {}

    async def connect(self, websocket: WebSocket, client_id: Optional[str] = None):
        """
        Accepts incoming connection and initializes connection tracking.
        """
        await websocket.accept()
        self.active_connections.add(websocket)
        self.connection_metadata[websocket] = {
            "client_id": client_id or f"anonymous_{id(websocket)}",
            "connected_at": datetime.utcnow().isoformat(),
            "subscriptions": set(),
        }
        logger.info(
            f"WebSocket client connected [{client_id}]. Total active connections: {len(self.active_connections)}"
        )

    def disconnect(self, websocket: WebSocket):
        """
        Removes client from active connections and all subscribed channels.
        """
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

        # Unsubscribe from all channels
        for channel_subscribers in self.channels.values():
            channel_subscribers.discard(websocket)

        # Clean up metadata
        client_meta = self.connection_metadata.pop(websocket, {})
        client_id = client_meta.get("client_id", "unknown")
        logger.info(
            f"WebSocket client disconnected [{client_id}]. Remaining connections: {len(self.active_connections)}"
        )

    async def subscribe(self, websocket: WebSocket, channel: str) -> bool:
        """
        Subscribes a connected client to a specific broadcast channel.
        """
        if channel not in self.SUPPORTED_CHANNELS:
            logger.warning(f"Attempted subscription to unsupported channel: {channel}")
            return False

        if websocket in self.active_connections:
            self.channels[channel].add(websocket)
            self.connection_metadata[websocket]["subscriptions"].add(channel)
            logger.debug(f"Client subscribed to channel '{channel}'")
            return True

        return False

    async def unsubscribe(self, websocket: WebSocket, channel: str) -> bool:
        """
        Unsubscribes a client from a channel.
        """
        if channel in self.channels:
            self.channels[channel].discard(websocket)
            if websocket in self.connection_metadata:
                self.connection_metadata[websocket]["subscriptions"].discard(channel)
            return True
        return False

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """
        Sends a direct JSON payload to a specific connected client.
        """
        try:
            await websocket.send_text(json.dumps(message))
        except Exception as e:
            logger.error(f"Error sending direct WebSocket message: {e}")
            self.disconnect(websocket)

    async def broadcast_to_channel(self, channel: str, payload: dict):
        """
        Broadcasts a JSON message to all clients subscribed to the target channel.
        """
        if channel not in self.channels:
            logger.warning(f"Attempted broadcast to unknown channel: {channel}")
            return

        subscribers = self.channels[channel]
        if not subscribers:
            return

        message_str = json.dumps({
            "channel": channel,
            "timestamp": datetime.utcnow().isoformat(),
            "data": payload,
        })

        disconnected_clients = []

        for websocket in list(subscribers):
            try:
                await websocket.send_text(message_str)
            except Exception as e:
                logger.error(f"Failed to broadcast on channel '{channel}': {e}")
                disconnected_clients.append(websocket)

        # Clean up dead connections
        for dead_ws in disconnected_clients:
            self.disconnect(dead_ws)

    async def broadcast_global(self, payload: dict):
        """
        Broadcasts a system-wide announcement to every connected WebSocket client.
        """
        message_str = json.dumps({
            "type": "GLOBAL_ANNOUNCEMENT",
            "timestamp": datetime.utcnow().isoformat(),
            "data": payload,
        })

        disconnected_clients = []

        for websocket in list(self.active_connections):
            try:
                await websocket.send_text(message_str)
            except Exception as e:
                logger.error(f"Failed global broadcast: {e}")
                disconnected_clients.append(websocket)

        for dead_ws in disconnected_clients:
            self.disconnect(dead_ws)

    def get_stats(self) -> dict:
        """
        Returns real-time connection and channel subscription metrics.
        """
        return {
            "total_connections": len(self.active_connections),
            "subscriptions": {
                channel: len(subscribers) for channel, subscribers in self.channels.items()
            },
        }


# Global singleton instance
ws_manager = WebSocketManager()