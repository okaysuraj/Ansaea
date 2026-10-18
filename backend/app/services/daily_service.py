"""Create consultation rooms, with a configurable local development fallback."""

import os
import uuid

import httpx


class DailyService:
    def __init__(self):
        self.api_key = os.getenv("DAILY_API_KEY")
        self.base_url = "https://api.daily.co/v1"

    async def create_room(self, room_name: str | None = None) -> dict:
        name = room_name or f"ansaea-{uuid.uuid4().hex[:8]}"
        if not self.api_key:
            return {
                "url": os.getenv("VIDEO_FALLBACK_URL") or f"https://meet.jit.si/{name}",
                "name": name,
                "api_created": False,
                "privacy": "public",
            }

        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                f"{self.base_url}/rooms",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "name": name,
                    "properties": {
                        "enable_chat": True,
                        "start_audio_off": False,
                        "start_video_off": False,
                    },
                },
            )
            response.raise_for_status()
            return response.json()


daily_service = DailyService()
