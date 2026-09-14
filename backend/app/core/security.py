from datetime import datetime, timedelta, timezone
from typing import Optional, List
import hashlib
import hmac
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

class TokenData(BaseModel):
    user_id: str
    email: str
    role: str
    full_name: Optional[str] = None

def get_password_hash(password: str) -> str:
    salt = "carelens_salt_2026"
    return hashlib.sha256(f"{salt}{password}".encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hmac.compare_digest(get_password_hash(plain_password), hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        # For public or optional routes, if no token, raise 401
        raise credentials_exception
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        role: str = payload.get("role")
        full_name: str = payload.get("full_name")
        if user_id is None or role is None:
            raise credentials_exception
        return TokenData(user_id=user_id, email=email, role=role, full_name=full_name)
    except JWTError:
        raise credentials_exception

async def get_optional_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[TokenData]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        role: str = payload.get("role")
        full_name: str = payload.get("full_name")
        if user_id and role:
            return TokenData(user_id=user_id, email=email, role=role, full_name=full_name)
        return None
    except Exception:
        return None

class RequireRole:
    """Dependency for Role-Based Access Control (RBAC)."""
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = [r.lower() for r in allowed_roles]

    def __call__(self, current_user: TokenData = Depends(get_current_user)):
        if current_user.role.lower() not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of roles: {self.allowed_roles}"
            )
        return current_user

require_admin = RequireRole(["admin"])
require_staff = RequireRole(["staff", "doctor", "admin"])
require_patient = RequireRole(["user", "patient", "admin"])
require_any_authenticated = RequireRole(["user", "patient", "staff", "doctor", "admin", "analyst"])
