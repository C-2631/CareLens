"""
Tri-Tier Hybrid Medicine, Diet & Lifestyle Recommendation Router
"""

from fastapi import APIRouter, Depends
from typing import List, Dict, Any, Optional
from app.api.schemas import (
    MedicineRecommendationRequest, RecommendationResponse, RecommendationCandidate,
    ComprehensiveStudioRequest, ComprehensiveStudioResponse
)
from app.ml.hybrid_recommender import hybrid_recommender
from app.ml.disease_classifier import disease_predictor
from app.core.security import get_optional_current_user, TokenData
from app.services.db_service import get_connection
import json

router = APIRouter(prefix="/recommend", tags=["Recommendation"])

PRESET_CLINICAL_SCENARIOS = [
    {
        "id": "preset-1",
        "title": "Type 2 Diabetes with Stage 1 Hypertension",
        "subtitle": "Elevated Blood Glucose + High Blood Pressure + Penicillin Allergy",
        "patient": {"name": "Robert Davis", "age": 54, "gender": "Male"},
        "symptoms": ["fatigue", "irregular_sugar_level", "excessive_hunger", "polyuria", "dizziness"],
        "vitals": {
            "systolic_bp": 145.0,
            "diastolic_bp": 92.0,
            "glucose_level": 185.0,
            "heart_rate": 78,
            "temperature": 98.6,
            "bmi": 28.6
        },
        "allergies": ["Penicillin", "Amoxicillin"],
        "active_prescriptions": ["Amlodipine Besylate"]
    },
    {
        "id": "preset-2",
        "title": "Chronic GERD & Gastric Acidity",
        "subtitle": "Severe Acid Reflux + Chest Discomfort + NSAID Sensitivity",
        "patient": {"name": "Meera Patel", "age": 36, "gender": "Female"},
        "symptoms": ["stomach_pain", "acidity", "ulcers_on_tongue", "vomiting", "chest_pain"],
        "vitals": {
            "systolic_bp": 118.0,
            "diastolic_bp": 76.0,
            "glucose_level": 92.0,
            "heart_rate": 72,
            "temperature": 98.4,
            "bmi": 22.4
        },
        "allergies": ["Aspirin", "Ibuprofen"],
        "active_prescriptions": []
    },
    {
        "id": "preset-3",
        "title": "Cardiovascular Risk with Warfarin Anticoagulation",
        "subtitle": "Coronary Risk Profile + Active Warfarin (High DDI Conflict Testing)",
        "patient": {"name": "David Wilson", "age": 62, "gender": "Male"},
        "symptoms": ["chest_pain", "breathlessness", "sweating", "fast_heart_rate", "fatigue"],
        "vitals": {
            "systolic_bp": 155.0,
            "diastolic_bp": 98.0,
            "glucose_level": 110.0,
            "heart_rate": 88,
            "temperature": 98.6,
            "bmi": 29.2
        },
        "allergies": ["Sulfa Drugs"],
        "active_prescriptions": ["Warfarin Sodium", "Atorvastatin Calcium"]
    },
    {
        "id": "preset-4",
        "title": "Bronchial Asthma & Allergic Rhinitis",
        "subtitle": "Respiratory Wheezing + Airway Hypersensitivity + Environmental Triggers",
        "patient": {"name": "Ananya Sen", "age": 28, "gender": "Female"},
        "symptoms": ["cough", "breathlessness", "continuous_sneezing", "chills", "watering_from_eyes"],
        "vitals": {
            "systolic_bp": 115.0,
            "diastolic_bp": 75.0,
            "glucose_level": 88.0,
            "heart_rate": 82,
            "temperature": 98.8,
            "bmi": 21.0
        },
        "allergies": ["Dust Mites", "Pollen"],
        "active_prescriptions": ["Salbutamol Inhaler"]
    },
    {
        "id": "preset-5",
        "title": "Metabolic Syndrome & Dyslipidemia",
        "subtitle": "High BMI (33.5) + Hypercholesterolemia + Mild Liver Stress",
        "patient": {"name": "Rajesh Malhotra", "age": 48, "gender": "Male"},
        "symptoms": ["fatigue", "obesity", "swollen_legs", "lethargy", "loss_of_appetite"],
        "vitals": {
            "systolic_bp": 138.0,
            "diastolic_bp": 88.0,
            "glucose_level": 142.0,
            "heart_rate": 76,
            "temperature": 98.6,
            "bmi": 33.5
        },
        "allergies": [],
        "active_prescriptions": ["Metformin HCl"]
    }
]

@router.get("/presets")
def get_preset_scenarios():
    """Returns pre-configured clinical test scenarios for instant demonstration."""
    return {
        "status": "SUCCESS",
        "presets": PRESET_CLINICAL_SCENARIOS
    }

@router.post("/studio", response_model=ComprehensiveStudioResponse)
@router.post("/comprehensive", response_model=ComprehensiveStudioResponse)
def generate_comprehensive_recommendations(
    req: ComprehensiveStudioRequest,
    current_user: Optional[TokenData] = Depends(get_optional_current_user)
):
    """
    Main AI Recommendation Studio Endpoint.
    1. Runs ML Disease Classifier (Random Forest + XGBoost with SHAP)
    2. Runs Tri-Tier Hybrid Recommender (Content + Collab + Knowledge Graph)
    3. Runs Deterministic Non-Bypass Safety Shield (DDI + Allergy filter)
    4. Generates Precision Nutrition, Exercise Rx, and Specialist Referral Matching.
    """
    vitals_dict = req.vitals.dict() if req.vitals else {
        "systolic_bp": 120.0, "diastolic_bp": 80.0, "glucose_level": 95.0,
        "heart_rate": 72, "temperature": 98.6, "bmi": 24.0
    }

    # Step 1: Predict Disease
    prediction_result = disease_predictor.predict(
        input_symptoms=req.symptoms,
        vitals=vitals_dict,
        top_k=3
    )

    lead_disease = prediction_result["top_predictions"][0]["disease"]

    # Step 2: Generate Full 5D Recommendations
    full_recs = hybrid_recommender.recommend_full(
        predicted_disease=lead_disease,
        patient_allergies=req.patient_allergies,
        active_prescriptions=req.active_prescriptions,
        patient_conditions=req.patient_conditions,
        vitals=vitals_dict,
        age=req.age,
        gender=req.gender,
        alpha=req.alpha_collaborative or 0.40,
        beta=req.beta_sentiment or 0.15
    )

    return ComprehensiveStudioResponse(
        status="SUCCESS",
        diagnosis=prediction_result,
        medications=full_recs["medications"],
        lifestyle_interventions=full_recs["lifestyle_interventions"],
        precision_nutrition=full_recs["precision_nutrition"],
        lifestyle_exercise=full_recs["lifestyle_exercise"],
        safety_audit=full_recs["safety_audit"],
        specialist_referral=full_recs["specialist_referral"],
        algorithm_explainability=full_recs["algorithm_explainability"]
    )

@router.post("/simulate")
def simulate_recommendations(req: ComprehensiveStudioRequest):
    """
    Ultra-fast simulation endpoint optimized for live slider 'What-If' recalculations.
    """
    vitals_dict = req.vitals.dict() if req.vitals else {
        "systolic_bp": 120.0, "diastolic_bp": 80.0, "glucose_level": 95.0,
        "heart_rate": 72, "temperature": 98.6, "bmi": 24.0
    }

    prediction_result = disease_predictor.predict(
        input_symptoms=req.symptoms,
        vitals=vitals_dict,
        top_k=3
    )
    lead_disease = prediction_result["top_predictions"][0]["disease"]

    full_recs = hybrid_recommender.recommend_full(
        predicted_disease=lead_disease,
        patient_allergies=req.patient_allergies,
        active_prescriptions=req.active_prescriptions,
        patient_conditions=req.patient_conditions,
        vitals=vitals_dict,
        age=req.age,
        gender=req.gender,
        alpha=req.alpha_collaborative or 0.40,
        beta=req.beta_sentiment or 0.15
    )

    return {
        "status": "SUCCESS",
        "lead_disease": lead_disease,
        "diagnosis": prediction_result,
        "medications": full_recs["medications"],
        "precision_nutrition": full_recs["precision_nutrition"],
        "lifestyle_exercise": full_recs["lifestyle_exercise"],
        "safety_audit": full_recs["safety_audit"],
        "specialist_referral": full_recs["specialist_referral"],
        "algorithm_explainability": full_recs["algorithm_explainability"]
    }

@router.post("/medicine", response_model=RecommendationResponse)
def get_recommendations(
    req: MedicineRecommendationRequest,
    current_user: Optional[TokenData] = Depends(get_optional_current_user)
):
    allergies = req.patient_allergies or []
    active_prescriptions = req.active_prescriptions or []
    conditions = req.patient_conditions or []

    candidates = hybrid_recommender.recommend(
        predicted_disease=req.predicted_disease,
        patient_allergies=allergies,
        active_prescriptions=active_prescriptions,
        patient_conditions=conditions,
        patient_id=req.patient_id,
        category_filter=req.category_filter
    )

    candidate_objs = [RecommendationCandidate(**c) for c in candidates]

    return RecommendationResponse(
        disease=req.predicted_disease,
        total_candidates=len(candidate_objs),
        recommendations=candidate_objs,
        disclaimer="Candidate treatments displayed for clinical review and educational discussion."
    )

