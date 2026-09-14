"""
Authentication & RBAC Router
Handles user registration, login, JWT token issuance, and current user profile.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone
import uuid
import json
from app.core.security import (
    verify_password, get_password_hash, create_access_token,
    get_current_user, TokenData
)
from app.services.db_service import get_connection
from app.api.schemas import UserRegisterRequest, UserLoginRequest, TokenResponse, UserProfileResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(req: UserRegisterRequest):
    conn = get_connection()
    cursor = conn.cursor()

    # Check if email exists
    cursor.execute("SELECT user_id FROM users WHERE email = ?", (req.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    user_id = f"usr-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()
    role = req.role.lower()
    if role not in ["user", "staff", "admin", "analyst", "patient", "doctor"]:
        role = "user"
    if role == "patient": role = "user"
    if role == "doctor": role = "staff"

    # Insert user
    cursor.execute("""
    INSERT INTO users (user_id, email, password_hash, role, full_name, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, 1, ?)
    """, (user_id, req.email, get_password_hash(req.password), role, req.full_name, now_iso))

    # If patient/user role, create profile
    patient_id = f"p-{uuid.uuid4().hex[:6]}"
    if role == "user":
        cursor.execute("""
        INSERT INTO patient_profiles (
            patient_id, user_id, date_of_birth, age, gender, blood_group,
            allergies, chronic_conditions, current_medications, emergency_contact, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            patient_id,
            user_id,
            "1995-01-01",
            req.age or 30,
            req.gender or "Unspecified",
            "O+",
            json.dumps(req.allergies or []),
            json.dumps(req.chronic_conditions or []),
            json.dumps(req.current_medications or []),
            "Family Member",
            now_iso
        ))

    conn.commit()
    conn.close()

    token = create_access_token({
        "sub": user_id,
        "email": req.email,
        "role": role,
        "full_name": req.full_name
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user_id,
        email=req.email,
        role=role,
        full_name=req.full_name
    )

@router.post("/login", response_model=TokenResponse)
def login(req: UserLoginRequest):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT user_id, email, password_hash, role, full_name, is_active FROM users WHERE email = ?", (req.email,))
    row = cursor.fetchone()
    conn.close()

    if not row or not verify_password(req.password, row["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not row["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated."
        )

    token = create_access_token({
        "sub": row["user_id"],
        "email": row["email"],
        "role": row["role"],
        "full_name": row["full_name"]
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=row["user_id"],
        email=row["email"],
        role=row["role"],
        full_name=row["full_name"]
    )

@router.get("/me", response_model=UserProfileResponse)
def get_me(current_user: TokenData = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT user_id, email, role, full_name FROM users WHERE user_id = ?", (current_user.user_id,))
    u_row = cursor.fetchone()
    if not u_row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found.")

    profile_data = {
        "user_id": u_row["user_id"],
        "email": u_row["email"],
        "role": u_row["role"],
        "full_name": u_row["full_name"],
        "patient_id": None,
        "age": None,
        "gender": None,
        "blood_group": None,
        "allergies": [],
        "chronic_conditions": [],
        "current_medications": [],
        "emergency_contact": None
    }

    cursor.execute("SELECT * FROM patient_profiles WHERE user_id = ?", (current_user.user_id,))
    p_row = cursor.fetchone()
    if p_row:
        profile_data.update({
            "patient_id": p_row["patient_id"],
            "age": p_row["age"],
            "gender": p_row["gender"],
            "blood_group": p_row["blood_group"],
            "allergies": json.loads(p_row["allergies"] or "[]"),
            "chronic_conditions": json.loads(p_row["chronic_conditions"] or "[]"),
            "current_medications": json.loads(p_row["current_medications"] or "[]"),
            "emergency_contact": p_row["emergency_contact"]
        })

    conn.close()
    return UserProfileResponse(**profile_data)
