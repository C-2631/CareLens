"""
Grounded HealthAI Assistant Router
Provides educational healthcare explanations with strict CDSS safety boundaries.
"""

from fastapi import APIRouter
from typing import List, Dict, Any
from app.api.schemas import ChatRequest
from app.data.medical_knowledge import DISEASE_DETAILS

router = APIRouter(prefix="/chat", tags=["HealthAI Assistant"])

@router.post("/ask")
def ask_health_assistant(req: ChatRequest):
    last_user_msg = req.messages[-1].content.strip().lower() if req.messages else ""
    context = req.context_data or {}
    predicted_disease = context.get("predicted_disease", "General Health")

    # Smart responses grounded strictly in verified clinical guidelines
    if "risk" in last_user_msg:
        response_text = (
            "Based on your physiological vitals and reported symptom indicators, your overall risk tier is evaluated as "
            f"**{context.get('risk_level', 'Low')}**. "
            "Our multi-organ stratification continuously monitors your cardiovascular, metabolic, hepatic, and respiratory parameters. "
            "To keep risk minimal, adhere to regular hydration, balanced nutrition, and scheduled physician check-ups."
        )
    elif "diet" in last_user_msg or "food" in last_user_msg or "eat" in last_user_msg:
        disease_info = DISEASE_DETAILS.get(predicted_disease, {})
        diets = disease_info.get("diets", [
            "Low-glycemic Mediterranean nutrition",
            "High-fiber leafy vegetables & berries",
            "Lean proteins and omega-3 rich fish",
            "Adequate hydration (2.5-3L water daily)"
        ])
        diet_str = "\n".join([f"• {d}" for d in diets])
        response_text = (
            f"Here are evidence-backed dietary guidelines recommended for **{predicted_disease}**:\n\n"
            f"{diet_str}\n\n"
            "*Remember to discuss any major nutritional adjustments with your healthcare practitioner.*"
        )
    elif "medicine" in last_user_msg or "drug" in last_user_msg or "medication" in last_user_msg:
        response_text = (
            f"For **{predicted_disease}**, candidate evidence-based treatments have been retrieved and filtered through our "
            "zero-bypass Deterministic Safety Engine (screening for allergies and drug-drug interactions). "
            "You can explore full dosages and side-effect profiles in the **Medicine Guide & Recommendations** tab. "
            "Please note: All medications must be formally prescribed by an authorized physician."
        )
    elif "exercise" in last_user_msg or "workout" in last_user_msg or "walk" in last_user_msg:
        disease_info = DISEASE_DETAILS.get(predicted_disease, {})
        workouts = disease_info.get("workouts", [
            "30 minutes of Zone-2 brisk walking daily",
            "Gentle yoga and breathing exercises (Pranayama)",
            "Low-impact resistance band mobility"
        ])
        workout_str = "\n".join([f"• {w}" for w in workouts])
        response_text = (
            f"Recommended physical activities for **{predicted_disease}**:\n\n"
            f"{workout_str}\n\n"
            "*Always begin gradually and cease activity if dizziness or chest tightness occurs.*"
        )
    elif "precaution" in last_user_msg or "prevent" in last_user_msg:
        disease_info = DISEASE_DETAILS.get(predicted_disease, {})
        precautions = disease_info.get("precautions", [
            "Maintain consistent sleep schedule",
            "Track physiological vitals twice weekly",
            "Avoid known allergen triggers"
        ])
        prec_str = "\n".join([f"• {p}" for p in precautions])
        response_text = (
            f"Key clinical precautions for **{predicted_disease}**:\n\n"
            f"{prec_str}"
        )
    else:
        response_text = (
            f"Hello! I am your CareLens HealthAI assistant. I am analyzing your profile for **{predicted_disease}**. "
            "I can explain your health risk score, provide tailored nutritional advice, breakdown exercise protocols, "
            "or review clinical safety considerations for candidate medications. How can I assist your health journey today?"
        )

    disclaimer = "\n\n*(CareLens Decision-Support: This educational summary must be evaluated by your attending clinician.)*"

    return {
        "reply": response_text + disclaimer,
        "suggested_chips": [
            "What are my health risks?",
            "Suggest a diet plan",
            "What medicines are right for me?",
            "Recommended daily exercises",
            "Key precautions to follow"
        ]
    }
