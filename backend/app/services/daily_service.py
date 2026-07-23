import os
import requests
import json
import uuid
from datetime import datetime

class DailyService:
    def __init__(self):
        self.api_key = os.getenv("DAILY_API_KEY")
        self.base_url = "https://api.daily.co/v1"

    def create_room(self, room_name: str = None) -> dict:
        if not self.api_key:
            # Fallback for dev mode without API key
            return {
                "url": f"https://mock.daily.co/{room_name or uuid.uuid4().hex}",
                "name": room_name or uuid.uuid4().hex,
                "api_created": True,
                "privacy": "public"
            }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        payload = {
            "properties": {
                "enable_chat": True,
                "start_audio_off": False,
                "start_video_off": False
            }
        }
        
        if room_name:
            payload["name"] = room_name

        response = requests.post(f"{self.base_url}/rooms", headers=headers, json=payload)
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": response.text}

daily_service = DailyService()
