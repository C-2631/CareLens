"""
Pydantic API Request and Response Schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import List, Dict, Any, Optional

# --- Authentication Schemas ---
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "user"  # 'user', 'staff', 'admin'
    age: Optional[int] = 30
    gender: Optional[str] = "Unspecified"
    allergies: Optional[List[str]] = []
    chronic_conditions: Optional[List[str]] = []
    current_medications: Optional[List[str]] = []

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    role: str
    full_name: str

class UserProfileResponse(BaseModel):
    user_id: str
    email: str
    role: str
    full_name: str
    patient_id: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: List[str] = []
    chronic_conditions: List[str] = []
    current_medications: List[str] = []
    emergency_contact: Optional[str] = None

# --- Clinical & Prediction Schemas ---
class VitalsData(BaseModel):
    systolic_bp: float = Field(default=120.0, ge=60.0, le=260.0)
    diastolic_bp: float = Field(default=80.0, ge=40.0, le=180.0)
    glucose_level: float = Field(default=95.0, ge=40.0, le=500.0)
    heart_rate: int = Field(default=72, ge=30, le=220)
    temperature: float = Field(default=98.6, ge=92.0, le=108.0)
    bmi: float = Field(default=24.0, ge=10.0, le=70.0)
    cholesterol: Optional[float] = Field(default=185.0, ge=80.0, le=500.0)

class DiseasePredictionRequest(BaseModel):
    patient_id: Optional[str] = None
    symptoms: List[str]
    vitals: Optional[VitalsData] = None
    free_text_symptoms: Optional[str] = None

class PredictionItem(BaseModel):
    disease: str
    confidence: float
    risk_level: str
    severity: str
    specialist: str
    description: Optional[str] = ""
    precautions: Optional[List[str]] = []
    diets: Optional[List[str]] = []
    workouts: Optional[List[str]] = []

class DiseasePredictionResponse(BaseModel):
    status: str = "SUCCESS"
    diagnosis_id: Optional[str] = None
    top_predictions: List[PredictionItem]
    shap_top_contributors: Dict[str, str]
    review_status: str
    lead_confidence: float
    recommended_specialist: str
    disclaimer: str = "CareLens decision-support result. Must be confirmed by an authorized clinician."

# --- Recommendation Schemas ---
class MedicineRecommendationRequest(BaseModel):
    predicted_disease: str
    patient_allergies: Optional[List[str]] = []
    active_prescriptions: Optional[List[str]] = []
    patient_conditions: Optional[List[str]] = []
    patient_id: Optional[str] = None
    category_filter: Optional[str] = "All"

class RecommendationCandidate(BaseModel):
    id: str
    name: str
    generic_name: str
    drug_class: str
    category: str
    standard_dosage: str
    indications: List[str]
    contraindications: List[str]
    common_side_effects: List[str]
    match_percentage: int
    hybrid_score: float
    sentiment_score: float
    effectiveness_rating: float
    safety: Dict[str, Any]
    generic_substitute: Optional[Dict[str, Any]] = None

class RecommendationResponse(BaseModel):
    disease: str
    total_candidates: int
    recommendations: List[RecommendationCandidate]
    disclaimer: str = "Candidate treatments displayed for clinical review and educational discussion."

# --- Comprehensive Recommendation Studio Schemas ---
class ComprehensiveStudioRequest(BaseModel):
    symptoms: List[str] = []
    vitals: Optional[VitalsData] = None
    patient_allergies: Optional[List[str]] = []
    active_prescriptions: Optional[List[str]] = []
    patient_conditions: Optional[List[str]] = []
    age: Optional[int] = 35
    gender: Optional[str] = "Female"
    alpha_collaborative: Optional[float] = 0.40
    beta_sentiment: Optional[float] = 0.15

class ComprehensiveStudioResponse(BaseModel):
    status: str = "SUCCESS"
    diagnosis: Dict[str, Any]
    medications: List[Dict[str, Any]]
    lifestyle_interventions: List[Dict[str, Any]]
    precision_nutrition: Dict[str, Any]
    lifestyle_exercise: Dict[str, Any]
    safety_audit: Dict[str, Any]
    specialist_referral: Dict[str, Any]
    algorithm_explainability: Dict[str, Any]
    disclaimer: str = "AI Clinical Decision-Support System recommendation. Verify with licensed physician."

# --- Clinician Review Queue Schemas ---
class CaseReviewActionRequest(BaseModel):
    action: str  # 'CONFIRM' or 'OVERRIDE'
    clinician_notes: str
    confirmed_disease: Optional[str] = None

# --- Feedback & Review Schemas ---
class ReviewSubmitRequest(BaseModel):
    medicine_id: str
    medicine_name: str
    rating: int = Field(ge=1, le=10)
    review_text: str

# --- Chat & Assistant Schemas ---
class ChatMessage(BaseModel):
    role: str  # 'user', 'assistant', 'system'
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context_data: Optional[Dict[str, Any]] = None
