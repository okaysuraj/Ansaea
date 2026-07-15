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

    async def analyze_symptoms(self, symptoms: str) -> dict:
        if self.api_key:
            # Placeholder for actual LLM call to triage
            pass
        
        # Simulated intelligent triage
        symptoms_lower = symptoms.lower()
        if any(x in symptoms_lower for x in ["chest pain", "shortness of breath", "fainting", "severe bleeding", "stroke"]):
            return {
                "triage_level": "URGENT",
                "recommendation": "Please go to the nearest emergency room or call emergency services immediately.",
                "possible_conditions": ["Critical condition"]
            }
        elif any(x in symptoms_lower for x in ["fever", "cough", "headache", "nausea"]):
            return {
                "triage_level": "ROUTINE",
                "recommendation": "Schedule a general consultation. Rest and hydrate.",
                "possible_conditions": ["Viral Infection", "Common Cold"]
            }
        else:
            return {
                "triage_level": "NON-URGENT",
                "recommendation": "Monitor symptoms. Book an online consultation if they persist.",
                "possible_conditions": ["Undifferentiated symptoms"]
            }

    async def generate_clinical_note(self, transcript: str) -> dict:
        if self.api_key:
            # Placeholder for actual LLM call to generate SOAP
            pass
            
        # Simulated note generation
        return {
            "subjective": f"Patient reports experiencing symptoms as described in the transcript: '{transcript[:50]}...'",
            "objective": "Patient appears alert. Vitals are within normal ranges.",
            "assessment": "Likely stress-related fatigue or mild symptoms.",
            "plan": "1. Rest and hydration.\n2. Follow up in 1 week if symptoms persist.",
            "icd10_codes": ["R53.83", "F43.9"]
        }

    async def calculate_health_risk_score(self, vitals: list, habits: list) -> dict:
        # Mock calculation based on provided data
        score = 85
        risk_level = "Low"
        recommendations = ["Maintain current healthy habits"]
        
        if vitals and len(vitals) > 0:
            latest_vitals = vitals[-1]
            if latest_vitals.get("blood_pressure") == "high" or latest_vitals.get("bmi", 20) > 30:
                score -= 20
                risk_level = "Moderate"
                recommendations.append("Monitor blood pressure and consider a balanced diet.")
                
        return {
            "score": score,
            "risk_level": risk_level,
            "recommendations": recommendations,
            "disease_progression_warning": "No immediate risks detected."
        }

    async def extract_text_from_image(self, file_path_or_url: str) -> dict:
        if self.api_key:
            # Call to Gemini Vision model for OCR
            pass
            
        # Mock OCR extraction
        return {
            "extracted_text": "MOCK LAB REPORT\nPatient: John Doe\nTest: Complete Blood Count\nResult: Normal",
            "confidence": 0.95,
            "structured_data": {
                "patient_name": "John Doe",
                "test_name": "Complete Blood Count",
                "result_status": "Normal"
            }
        }

ai_therapist = AITherapistService()
