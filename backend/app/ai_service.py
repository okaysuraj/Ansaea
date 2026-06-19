import os
import random

class AITherapistService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        # In a real environment, you'd initialize google.genai client here if key is present

    async def generate_response(self, user_text: str, doctor_name: str, doctor_specialty: str) -> str:
        if self.api_key:
            # Placeholder for actual LLM call
            # e.g., response = await client.generate_content(...)
            return f"[{doctor_name}] (AI Mode): I hear what you're saying about '{user_text}'. Let's explore that further with CBT techniques."
        
        # Fallback simulated response
        text_lower = user_text.lower()
        if "anxious" in text_lower or "panic" in text_lower or "stress" in text_lower:
            return f"I hear you, and it's completely natural to feel anxious. Let's take a slow breath together. Try inhaling for 4 seconds, hold, and release. Can you feel the stress starting to settle in your chest?"
        elif "sad" in text_lower or "depressed" in text_lower or "lonely" in text_lower:
            return f"I'm so sorry you're carrying this heavy weight today. You are not alone. What's one small, gentle action we can take for yourself right now?"
        elif "sleep" in text_lower or "tired" in text_lower or "insomnia" in text_lower:
            return f"Rest plays a massive role in our mental battery. If your mind is racing at night, try writing down those thoughts to challenge them, or log a water intake and sleep log."
        elif "help" in text_lower or "hurt" in text_lower:
            return f"I am right here with you. When things feel too intense, let's break them down into small, digestible pieces. Focus only on the next 5 minutes."
        elif "hello" in text_lower or "hi" in text_lower or "hey" in text_lower:
            return f"Hello! I am {doctor_name}. I specialize in {doctor_specialty}. I'm glad we connected today. How has your mental landscape been feeling over the last few hours?"
        else:
            responses = [
                f"Thank you for sharing that with me. It takes genuine strength to open up. Could you elaborate on what sparked these emotions?",
                f"I hear you. That sounds really challenging, but you're doing incredibly well just by observing and vocalizing these feelings. Let's unpack this further.",
                f"That's a very honest observation. Remember that thoughts are just mental events, not absolute facts. We can challenge them together.",
                f"I'm right here. Take all the time you need. We'll work through these layers step-by-step."
            ]
            return random.choice(responses)

ai_therapist = AITherapistService()
