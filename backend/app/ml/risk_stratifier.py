"""
Multi-Label Risk Stratification & Clinical Health Score Engine
Calculates risk percentages for cardiovascular, metabolic, renal, hepatic, and respiratory axes.
"""

from typing import Dict, Any, List

class ClinicalRiskStratifier:
    def evaluate_risk_profile(self, vitals: Dict[str, Any], symptoms: List[str] = None, conditions: List[str] = None) -> Dict[str, Any]:
        symptoms = symptoms or []
        conditions = conditions or []

        sys_bp = float(vitals.get("systolic_bp", 120))
        dia_bp = float(vitals.get("diastolic_bp", 80))
        glucose = float(vitals.get("glucose_level", 95))
        bmi = float(vitals.get("bmi", 23.5))
        heart_rate = float(vitals.get("heart_rate", 72))
        cholesterol = float(vitals.get("cholesterol", 185))

        # 1. Heart Disease Risk (0-100%)
        heart_risk = 8
        if sys_bp > 140 or dia_bp > 90: heart_risk += 15
        if cholesterol > 220: heart_risk += 12
        if bmi > 28: heart_risk += 6
        if any(s in symptoms for s in ["chest_pain", "breathlessness", "fast_heart_rate"]): heart_risk += 20
        heart_risk = min(95, max(5, heart_risk))

        # 2. Diabetes Risk
        diabetes_risk = 6
        if glucose > 125: diabetes_risk += 35
        elif glucose > 100: diabetes_risk += 15
        if bmi > 30: diabetes_risk += 15
        if any(s in symptoms for s in ["polyuria", "excessive_hunger", "irregular_sugar_level"]): diabetes_risk += 25
        diabetes_risk = min(95, max(5, diabetes_risk))

        # 3. Hypertension Risk
        htn_risk = 10
        if sys_bp >= 140 or dia_bp >= 90: htn_risk += 40
        elif sys_bp >= 130 or dia_bp >= 85: htn_risk += 20
        if any(s in symptoms for s in ["headache", "dizziness"]): htn_risk += 12
        htn_risk = min(95, max(8, htn_risk))

        # 4. Liver Disease Risk
        liver_risk = 5
        if any(s in symptoms for s in ["yellowish_skin", "dark_urine", "yellowing_of_eyes", "acute_liver_failure", "history_of_alcohol_consumption"]):
            liver_risk += 45
        if "Liver" in str(conditions): liver_risk += 30
        liver_risk = min(95, max(4, liver_risk))

        # 5. Kidney Disease Risk
        kidney_risk = 5
        if sys_bp > 150 or glucose > 160: kidney_risk += 15
        if any(s in symptoms for s in ["burning_micturition", "swollen_legs", "bladder_discomfort", "continuous_feel_of_urine"]):
            kidney_risk += 25
        kidney_risk = min(95, max(3, kidney_risk))

        # 6. Respiratory Disease Risk
        resp_risk = 7
        if any(s in symptoms for s in ["cough", "breathlessness", "mucoid_sputum", "phlegm", "sinus_pressure"]):
            resp_risk += 30
        resp_risk = min(95, max(5, resp_risk))

        # Overall Health Score (0-100)
        risk_average = (heart_risk + diabetes_risk + htn_risk + liver_risk + kidney_risk + resp_risk) / 6.0
        health_score = int(max(40, min(96, 100 - (risk_average * 0.75))))

        # Determine qualitative tier
        if health_score >= 85:
            health_tier = "Excellent"
            overall_risk = "Low"
        elif health_score >= 70:
            health_tier = "Good"
            overall_risk = "Low"
        elif health_score >= 55:
            health_tier = "Moderate"
            overall_risk = "Moderate"
        else:
            health_tier = "Needs Attention"
            overall_risk = "High"

        # Organ statuses
        organ_statuses = {
            "heart": "Normal" if heart_risk < 25 else ("Needs Attention" if heart_risk < 50 else "High Risk"),
            "lungs": "Normal" if resp_risk < 25 else ("Needs Attention" if resp_risk < 50 else "High Risk"),
            "liver": "Normal" if liver_risk < 25 else ("Needs Attention" if liver_risk < 50 else "High Risk"),
            "kidneys": "Normal" if kidney_risk < 25 else ("Needs Attention" if kidney_risk < 50 else "High Risk"),
            "metabolism": "Normal" if (diabetes_risk < 25 and htn_risk < 30) else "Needs Attention"
        }

        # Quick Insights
        quick_insights = []
        if glucose > 110:
            quick_insights.append("Fasting blood glucose is slightly elevated. Consider low glycemic nutrition.")
        else:
            quick_insights.append("Your blood sugar level is within normal range.")

        if cholesterol > 200:
            quick_insights.append("Total cholesterol is mildly elevated. Increasing soluble fiber & Omega-3 is recommended.")
        else:
            quick_insights.append("Your cholesterol profile is well balanced.")

        if sys_bp > 130:
            quick_insights.append(f"Blood pressure ({int(sys_bp)}/{int(dia_bp)} mmHg) is above baseline. Daily 30-min walking advised.")
        else:
            quick_insights.append("Cardiovascular blood pressure readings remain within optimal limits.")

        quick_insights.append("Maintaining a balanced diet and regular exercise is recommended.")

        return {
            "health_score": health_score,
            "health_tier": health_tier,
            "overall_risk_level": overall_risk,
            "organ_statuses": organ_statuses,
            "risk_analysis": [
                {"category": "Heart Disease", "percentage": heart_risk, "level": "High" if heart_risk >= 50 else ("Moderate" if heart_risk >= 25 else "Low"), "icon": "Heart"},
                {"category": "Diabetes", "percentage": diabetes_risk, "level": "High" if diabetes_risk >= 50 else ("Moderate" if diabetes_risk >= 25 else "Low"), "icon": "Activity"},
                {"category": "Hypertension", "percentage": htn_risk, "level": "High" if htn_risk >= 50 else ("Moderate" if htn_risk >= 25 else "Low"), "icon": "Zap"},
                {"category": "Liver Disease", "percentage": liver_risk, "level": "High" if liver_risk >= 50 else ("Moderate" if liver_risk >= 25 else "Low"), "icon": "Shield"},
                {"category": "Kidney Disease", "percentage": kidney_risk, "level": "High" if kidney_risk >= 50 else ("Moderate" if kidney_risk >= 25 else "Low"), "icon": "Droplet"},
                {"category": "Respiratory Disease", "percentage": resp_risk, "level": "High" if resp_risk >= 50 else ("Moderate" if resp_risk >= 25 else "Low"), "icon": "Wind"}
            ],
            "quick_insights": quick_insights
        }

risk_stratifier = ClinicalRiskStratifier()
