"""
Patient Profile, Vitals & Health Trends Router
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import json
import uuid
from app.core.security import get_optional_current_user, TokenData
from app.services.db_service import get_connection
from app.api.schemas import VitalsData, ReviewSubmitRequest
from app.ml.sentiment_analyzer import sentiment_analyzer
from app.ml.risk_stratifier import risk_stratifier

router = APIRouter(prefix="/patient", tags=["Patient Portal"])

@router.get("/dashboard-summary")
def get_dashboard_summary(current_user: Optional[TokenData] = Depends(get_optional_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    user_id = current_user.user_id if current_user else "usr-pat-001"
    
    # Try getting patient record for current user or default to Priya Sharma (pat-001)
    cursor.execute("SELECT * FROM patient_profiles WHERE user_id = ? OR patient_id = 'pat-001'", (user_id,))
    p_row = cursor.fetchone()
    patient_id = p_row["patient_id"] if p_row else "pat-001"
    patient_name = p_row["full_name"] if p_row else (current_user.full_name if current_user else "Priya Sharma")

    # Get appointments for patient
    cursor.execute("SELECT * FROM appointments WHERE patient_id = ? ORDER BY appointment_date ASC", (patient_id,))
    appt_rows = cursor.fetchall()
    appointments = []
    for apt in appt_rows:
        appointments.append({
            "appointment_id": apt["appointment_id"],
            "doctor_name": apt["doctor_name"],
            "doctor_specialty": apt["doctor_specialty"],
            "date": apt["appointment_date"],
            "time": apt["appointment_time"],
            "reason": apt["reason"],
            "status": apt["status"]
        })

    # If none found, add default with Dr. Aditi Sharma (matching screenshot)
    if not appointments:
        appointments.append({
            "appointment_id": "apt-001",
            "doctor_name": "Dr. Aditi Sharma",
            "doctor_specialty": "General Physician",
            "date": "Apr 18, 2025",
            "time": "10:30 AM",
            "reason": "Routine Consultation",
            "status": "Upcoming"
        })

    # Recent activities (matching screenshot)
    recent_activities = [
        {"title": "Blood test report uploaded", "date": "Apr 15, 2025", "icon": "FileText"},
        {"title": "Medicine reminder (Metformin)", "date": "Apr 14, 2025", "icon": "Pill"},
        {"title": "Health risk assessment completed", "date": "Apr 12, 2025", "icon": "ShieldCheck"}
    ]

    # Health Overview Statuses (matching screenshot)
    health_overview = {
        "health_score": p_row["health_score"] if p_row else 78,
        "health_score_label": "Good",
        "heart_health": p_row["heart_health"] if p_row else "Good",
        "blood_pressure": p_row["blood_pressure_status"] if p_row else "Normal",
        "blood_sugar": p_row["blood_sugar_status"] if p_row else "Normal",
        "bmi_value": p_row["bmi_value"] if p_row else 22.4,
        "bmi_status": p_row["bmi_status"] if p_row else "Normal",
        "sleep_quality": p_row["sleep_quality"] if p_row else "7.5 hrs Good"
    }

    # Top recommendations (matching screenshot)
    recommendations = [
        {"title": "Maintain a balanced diet", "desc": "Rich in vegetables, fruits and protein", "icon": "Utensils", "color": "#f97316"},
        {"title": "Regular exercise", "desc": "At least 30 minutes daily", "icon": "Dumbbell", "color": "#06b6d4"},
        {"title": "Monitor blood sugar", "desc": "Keep track of your levels", "icon": "Droplets", "color": "#ef4444"}
    ]

    conn.close()

    return {
        "patient_id": patient_id,
        "patient_name": patient_name,
        "health_overview": health_overview,
        "appointments": appointments,
        "recent_activities": recent_activities,
        "recommendations": recommendations
    }

@router.post("/vitals")
def record_vitals(vitals: VitalsData, current_user: Optional[TokenData] = Depends(get_optional_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    patient_id = "pat-001"
    if current_user:
        cursor.execute("SELECT patient_id FROM patient_profiles WHERE user_id = ?", (current_user.user_id,))
        p_row = cursor.fetchone()
        if p_row:
            patient_id = p_row["patient_id"]

    vital_id = f"vit-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    cursor.execute("""
    INSERT INTO vitals (
        vital_id, patient_id, recorded_at, systolic_bp, diastolic_bp,
        glucose_level, heart_rate, temperature, bmi, cholesterol
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        vital_id, patient_id, now_iso,
        vitals.systolic_bp, vitals.diastolic_bp,
        vitals.glucose_level, vitals.heart_rate,
        vitals.temperature, vitals.bmi,
        vitals.cholesterol or 185.0
    ))

    conn.commit()
    conn.close()

    return {"status": "SUCCESS", "vital_id": vital_id, "message": "Vitals recorded successfully."}

@router.get("/all-profiles")
def get_all_patient_profiles(current_user: Optional[TokenData] = Depends(get_optional_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    # Get the 10 core rich patients or top 15
    cursor.execute("""
    SELECT * FROM patient_profiles
    ORDER BY patient_id ASC LIMIT 10
    """)
    rows = cursor.fetchall()
    patients = []

    for r in rows:
        p_id = r["patient_id"]

        # Parse JSON fields if string
        def parse_json(field_val, default):
            if not field_val:
                return default
            try:
                return json.loads(field_val)
            except Exception:
                return default

        allergies = parse_json(r["allergies"], [])
        chronic_conditions = parse_json(r["chronic_conditions"], [])
        current_medications = parse_json(r["current_medications"], [])

        # Get appointments for this patient
        cursor.execute("SELECT * FROM appointments WHERE patient_id = ?", (p_id,))
        appts = [dict(a) for a in cursor.fetchall()]

        # Get medication schedules for this patient
        cursor.execute("SELECT * FROM patient_med_schedules WHERE patient_id = ?", (p_id,))
        med_schedules = [dict(m) for m in cursor.fetchall()]

        # Get recent vitals
        cursor.execute("SELECT * FROM vitals WHERE patient_id = ? ORDER BY recorded_at DESC LIMIT 5", (p_id,))
        vitals_list = [dict(v) for v in cursor.fetchall()]

        patients.append({
            "patient_id": r["patient_id"],
            "user_id": r["user_id"],
            "full_name": r["full_name"],
            "age": r["age"],
            "gender": r["gender"],
            "blood_group": r["blood_group"],
            "reason_for_visit": r["reason_for_visit"],
            "risk_level": r["risk_level"],
            "status": r["status"],
            "admission_status": r["admission_status"],
            "bed_number": r["bed_number"],
            "assigned_doctor_id": r["assigned_doctor_id"],
            "assigned_doctor_name": r["assigned_doctor_name"],
            "assigned_doctor_specialty": r["assigned_doctor_specialty"],
            "assigned_nurse_name": r["assigned_nurse_name"],
            "allergies": allergies,
            "chronic_conditions": chronic_conditions,
            "current_medications": current_medications,
            "health_score": r["health_score"] or 78,
            "heart_health": r["heart_health"] or "Good",
            "blood_pressure_status": r["blood_pressure_status"] or "Normal (120/80)",
            "blood_sugar_status": r["blood_sugar_status"] or "Normal (95 mg/dL)",
            "bmi_value": r["bmi_value"] or 22.4,
            "bmi_status": r["bmi_status"] or "Normal",
            "sleep_quality": r["sleep_quality"] or "7.5 hrs Good",
            "appointments": appts,
            "medication_schedules": med_schedules,
            "vitals_history": vitals_list
        })

    conn.close()
    return {"total": len(patients), "patients": patients}

@router.get("/detail/{patient_id}")
def get_patient_detail(patient_id: str, current_user: Optional[TokenData] = Depends(get_optional_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM patient_profiles WHERE patient_id = ?", (patient_id,))
    r = cursor.fetchone()
    if not r:
        conn.close()
        raise HTTPException(status_code=404, detail="Patient profile not found")

    def parse_json(field_val, default):
        if not field_val:
            return default
        try:
            return json.loads(field_val)
        except Exception:
            return default

    allergies = parse_json(r["allergies"], [])
    chronic_conditions = parse_json(r["chronic_conditions"], [])
    current_medications = parse_json(r["current_medications"], [])

    cursor.execute("SELECT * FROM appointments WHERE patient_id = ?", (patient_id,))
    appts = [dict(a) for a in cursor.fetchall()]

    cursor.execute("SELECT * FROM patient_med_schedules WHERE patient_id = ?", (patient_id,))
    med_schedules = [dict(m) for m in cursor.fetchall()]

    cursor.execute("SELECT * FROM vitals WHERE patient_id = ? ORDER BY recorded_at DESC LIMIT 10", (patient_id,))
    vitals_list = [dict(v) for v in cursor.fetchall()]

    cursor.execute("SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY issued_date DESC", (patient_id,))
    prescriptions = [dict(pr) for pr in cursor.fetchall()]

    conn.close()

    return {
        "patient_id": r["patient_id"],
        "user_id": r["user_id"],
        "full_name": r["full_name"],
        "age": r["age"],
        "gender": r["gender"],
        "blood_group": r["blood_group"],
        "reason_for_visit": r["reason_for_visit"],
        "risk_level": r["risk_level"],
        "status": r["status"],
        "admission_status": r["admission_status"],
        "bed_number": r["bed_number"],
        "assigned_doctor_id": r["assigned_doctor_id"],
        "assigned_doctor_name": r["assigned_doctor_name"],
        "assigned_doctor_specialty": r["assigned_doctor_specialty"],
        "assigned_nurse_name": r["assigned_nurse_name"],
        "allergies": allergies,
        "chronic_conditions": chronic_conditions,
        "current_medications": current_medications,
        "health_score": r["health_score"] or 78,
        "heart_health": r["heart_health"] or "Good",
        "blood_pressure_status": r["blood_pressure_status"] or "Normal (120/80)",
        "blood_sugar_status": r["blood_sugar_status"] or "Normal (95 mg/dL)",
        "bmi_value": r["bmi_value"] or 22.4,
        "bmi_status": r["bmi_status"] or "Normal",
        "sleep_quality": r["sleep_quality"] or "7.5 hrs Good",
        "appointments": appts,
        "medication_schedules": med_schedules,
        "vitals_history": vitals_list,
        "prescriptions": prescriptions
    }

