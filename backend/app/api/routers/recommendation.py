"""
Tri-Tier Hybrid Medicine & Lifestyle Recommendation Router
"""

from fastapi import APIRouter, Depends
from typing import List, Dict, Any, Optional
from app.api.schemas import MedicineRecommendationRequest, RecommendationResponse, RecommendationCandidate
from app.ml.hybrid_recommender import hybrid_recommender
from app.core.security import get_optional_current_user, TokenData
from app.services.db_service import get_connection
import json

router = APIRouter(prefix="/recommend", tags=["Recommendation"])

@router.post("/medicine", response_model=RecommendationResponse)
def get_recommendations(
    req: MedicineRecommendationRequest,
    current_user: Optional[TokenData] = Depends(get_optional_current_user)
):
    allergies = req.patient_allergies or []
    active_prescriptions = req.active_prescriptions or []
    conditions = req.patient_conditions or []

    # If user is logged in and didn't provide explicit overrides, pull from patient profile
    if current_user and not allergies and not active_prescriptions:
        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT allergies, current_medications, chronic_conditions FROM patient_profiles WHERE user_id = ?", (current_user.user_id,))
            p_row = cursor.fetchone()
            if p_row:
                allergies = json.loads(p_row["allergies"] or "[]")
                active_prescriptions = json.loads(p_row["current_medications"] or "[]")
                conditions = json.loads(p_row["chronic_conditions"] or "[]")
            conn.close()
        except Exception:
            pass

    # Execute Hybrid Ranker + Hard Deterministic Safety Filter
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
