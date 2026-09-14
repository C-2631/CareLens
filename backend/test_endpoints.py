import sys
from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    client = TestClient(app)
    print("--- 1. Testing Health Endpoint ---")
    res = client.get("/health")
    assert res.status_code == 200
    print("Health check OK:", res.json())

    print("\n--- 2. Testing Patient All Profiles ---")
    res = client.get("/api/v1/patient/all-profiles")
    assert res.status_code == 200
    data = res.json()
    print(f"Total Patient Profiles returned: {data.get('total')}")
    assert data.get('total') >= 10

    print("\n--- 3. Testing Staff Schedule (OT Surgeries & Med Schedules) ---")
    res = client.get("/api/v1/staff/schedule")
    assert res.status_code == 200
    data = res.json()
    print(f"Total Surgeries in OT: {data.get('total_surgeries')}")
    print(f"Total Med Schedules: {data.get('total_med_schedules')}")
    assert data.get('total_surgeries') >= 20

    print("\n--- 4. Testing Admin Workforce Directory (Doctors, Nurses, Staff, Sweepers) ---")
    res = client.get("/api/v1/admin/workforce")
    assert res.status_code == 200
    data = res.json()
    stats = data.get("stats", {})
    print(f"Workforce stats: {stats}")
    assert stats.get("total_workforce") >= 500
    assert stats.get("total_doctors") >= 180
    assert stats.get("total_nurses") >= 220
    assert stats.get("total_staff") >= 100
    assert stats.get("total_sweepers") >= 30

    print("\n--- 5. Testing Admin Pharmacy Inventory (104 Medicines) ---")
    res = client.get("/api/v1/admin/pharmacy")
    assert res.status_code == 200
    data = res.json()
    stats = data.get("stats", {})
    print(f"Pharmacy inventory stats: {stats}")
    assert stats.get("total_medicines") >= 104

    print("\n--- 6. Testing Admin 1,000 Patient Directory ---")
    res = client.get("/api/v1/admin/patients-directory?limit=50&offset=0")
    assert res.status_code == 200
    data = res.json()
    print(f"Census Total: {data.get('total')}, Page items: {len(data.get('patients', []))}")
    assert data.get("total") == 1000
    assert len(data.get("patients", [])) == 50

    print("\n--- 7. Testing Disease Prediction AI ---")
    res = client.post("/api/v1/predict/disease", json={
        "symptoms": ["chest pain", "shortness of breath", "fatigue"],
        "vitals": {
            "systolic_bp": 145.0,
            "diastolic_bp": 92.0,
            "heart_rate": 88,
            "glucose_level": 110.0,
            "bmi": 26.5
        }
    })
    assert res.status_code == 200
    preds = res.json().get("top_predictions", [])
    print(f"Top predictions: {[p['disease'] for p in preds]}")

    print("\n--- 8. Testing Medicine Recommendation Engine ---")
    res = client.post("/api/v1/recommend/medicine", json={
        "predicted_disease": "Hypertension",
        "patient_id": "pat-001",
        "current_medications": ["Telmisartan 40mg"],
        "allergies": ["Penicillin"],
        "top_k": 3
    })
    assert res.status_code == 200
    meds = res.json().get("recommendations", [])
    print(f"Recommended medications: {[m['name'] for m in meds]}")

    print("\n==========================================")
    print("ALL BACKEND & DATABASE TESTS PASSED 100%")
    print("==========================================")

if __name__ == "__main__":
    run_tests()
