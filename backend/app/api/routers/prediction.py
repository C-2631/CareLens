"""
Disease Prediction & Diagnostic Inference Router
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid
import json
from app.api.schemas import DiseasePredictionRequest, DiseasePredictionResponse, PredictionItem
from app.ml.disease_classifier import disease_predictor
from app.data.medical_knowledge import SYMPTOMS_LIST, DISEASE_DETAILS
from app.core.security import get_optional_current_user, TokenData
from app.services.db_service import get_connection

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.get("/symptoms-list")
def get_all_symptoms():
    """Returns the complete list of 132 symptoms for multi-select auto-complete."""
    formatted = [
        {"id": sym, "label": sym.replace("_", " ").title()}
        for sym in SYMPTOMS_LIST
    ]
    return {"total": len(SYMPTOMS_LIST), "symptoms": formatted}

@router.get("/diseases-list")
def get_all_diseases():
    """Returns the catalog of 41 classified diseases with descriptions."""
    results = []
    for d_name, details in DISEASE_DETAILS.items():
        results.append({
            "name": d_name,
            "severity": details.get("severity", "MEDIUM"),
            "specialist": details.get("specialist", "General Physician"),
            "description": details.get("description", ""),
            "precautions": details.get("precautions", []),
            "diets": details.get("diets", []),
            "workouts": details.get("workouts", [])
        })
    return {"total": len(results), "diseases": results}

@router.post("/disease", response_model=DiseasePredictionResponse)
def predict_disease(
    req: DiseasePredictionRequest,
    current_user: Optional[TokenData] = Depends(get_optional_current_user)
):
    vitals_dict = req.vitals.model_dump() if req.vitals else {
        "systolic_bp": 120.0,
        "diastolic_bp": 80.0,
        "glucose_level": 95.0,
        "heart_rate": 72,
        "bmi": 24.0,
        "temperature": 98.6
    }

    # Execute ML Classifier + SHAP Attribution
    result = disease_predictor.predict(
        input_symptoms=req.symptoms,
        vitals=vitals_dict,
        top_k=3
    )

    top_preds = [PredictionItem(**p) for p in result["top_predictions"]]
    diagnosis_id = f"diag-{uuid.uuid4().hex[:8]}"

    # Save diagnosis to database and optionally add to Clinician Review Queue if needed
    try:
        conn = get_connection()
        cursor = conn.cursor()
        now_iso = datetime.now(timezone.utc).isoformat()
        patient_name = current_user.full_name if current_user else "Anonymous Patient"
        patient_id = req.patient_id or (current_user.user_id if current_user else "p-anon")

        cursor.execute("""
        INSERT INTO diagnoses (
            diagnosis_id, patient_id, patient_name, predicted_disease, confidence,
            risk_level, symptoms, vitals, clinician_status, clinician_notes,
            confirmed_disease, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            diagnosis_id,
            patient_id,
            patient_name,
            top_preds[0].disease,
            top_preds[0].confidence,
            top_preds[0].risk_level,
            json.dumps(req.symptoms),
            json.dumps(vitals_dict),
            "PENDING_REVIEW" if result["review_status"] == "PENDING_CLINICIAN_REVIEW" else "CONFIRMED",
            "Auto-generated ML inference case.",
            top_preds[0].disease,
            now_iso
        ))
        conn.commit()
        conn.close()
    except Exception:
        pass

    return DiseasePredictionResponse(
        status="SUCCESS",
        diagnosis_id=diagnosis_id,
        top_predictions=top_preds,
        shap_top_contributors=result["shap_contributors"],
        review_status=result["review_status"],
        lead_confidence=result["lead_confidence"],
        recommended_specialist=top_preds[0].specialist,
        disclaimer="CareLens decision-support result. Must be confirmed by an authorized clinician."
    )
