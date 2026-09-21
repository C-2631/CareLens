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

    print("\n--- 9. Testing Clinical Recommendation Presets ---")
    res = client.get("/recommend/presets")
    assert res.status_code == 200
    presets = res.json().get("presets", [])
    print(f"Retrieved {len(presets)} clinical presets: {[p['title'] for p in presets]}")
    assert len(presets) >= 4

    print("\n--- 10. Testing Full AI Recommendation Studio Pipeline ---")
    studio_payload = {
        "symptoms": ["fatigue", "irregular_sugar_level", "polyuria", "dizziness"],
        "vitals": {
            "systolic_bp": 145.0,
            "diastolic_bp": 92.0,
            "glucose_level": 185.0,
            "heart_rate": 78,
            "temperature": 98.6,
            "bmi": 28.6
        },
        "patient_allergies": ["Penicillin"],
        "active_prescriptions": ["Amlodipine Besylate"],
        "patient_conditions": ["Hypertension"],
        "age": 54,
        "gender": "Male",
        "alpha_collaborative": 0.40,
        "beta_sentiment": 0.15
    }
    res = client.post("/recommend/studio", json=studio_payload)
    assert res.status_code == 200
    studio_data = res.json()
    assert studio_data.get("status") == "SUCCESS"
    diag = studio_data.get("diagnosis", {})
    top_preds = diag.get("top_predictions", [])
    lead_pred = top_preds[0] if top_preds else {}
    meds = studio_data.get("medications", [])
    diet = studio_data.get("precision_nutrition", {})
    workout = studio_data.get("lifestyle_exercise", {})
    safety = studio_data.get("safety_audit", {})
    spec = studio_data.get("specialist_referral", {})
    print(f"Lead Diagnosis: {lead_pred.get('disease')} (Confidence: {lead_pred.get('confidence', 0)*100:.1f}%)")
    print(f"Ranked Medications Count: {len(meds)}")
    print(f"Diet Recommendations: {len(diet.get('recommended_foods', []))} foods to eat, {len(diet.get('foods_to_avoid', []))} foods to avoid")
    print(f"Safety Status: {safety.get('overall_status')}, Screened Allergies: {safety.get('active_allergies_screened')}")
    print(f"Matched Specialist: {spec.get('recommended_specialty')} (Urgency: {spec.get('consultation_urgency')})")
    assert len(meds) > 0
    assert len(diet.get("recommended_foods", [])) > 0

    print("\n--- 11. Testing What-If Dynamic Biomarker Simulation ---")
    sim_payload = {
        "symptoms": ["fatigue", "irregular_sugar_level"],
        "vitals": {
            "systolic_bp": 170.0,
            "diastolic_bp": 105.0,
            "glucose_level": 240.0,
            "heart_rate": 95,
            "temperature": 99.0,
            "bmi": 32.0
        },
        "patient_allergies": ["Penicillin"],
        "active_prescriptions": ["Metformin HCl"]
    }
    res = client.post("/recommend/simulate", json=sim_payload)
    assert res.status_code == 200
    sim_data = res.json()
    assert sim_data.get("status") == "SUCCESS"
    sim_preds = sim_data.get("diagnosis", {}).get("top_predictions", [])
    sim_lead = sim_preds[0] if sim_preds else {}
    print(f"Simulation Condition: {sim_data.get('lead_disease')}, Prob: {sim_lead.get('confidence', 0)*100:.1f}%, Ranked Meds: {len(sim_data.get('medications', []))}")
    assert sim_lead.get("confidence", 0) > 0

    print("\n==========================================")
    print("ALL 11 BACKEND & AI RECOMMENDATION TESTS PASSED 100%")
    print("==========================================")

if __name__ == "__main__":
    run_tests()

