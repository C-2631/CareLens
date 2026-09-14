"""
Deterministic Clinical Safety Engine
Strict non-bypass rule evaluation for Allergies, Drug-Drug Interactions (DDI),
and Absolute Condition Contraindications.
"""

from typing import List, Dict, Tuple
from app.data.ddi_rules import DDI_DATABASE, ALLERGY_DATABASE, CONDITION_CONTRAINDICATIONS

class DeterministicSafetyEngine:
    def __init__(self):
        self.ddi_database = DDI_DATABASE
        self.allergy_database = ALLERGY_DATABASE
        self.condition_contraindications = CONDITION_CONTRAINDICATIONS

    def evaluate_safety(
        self,
        candidate_name: str,
        patient_allergies: List[str],
        active_prescriptions: List[str],
        diagnosed_conditions: List[str]
    ) -> Dict:
        """
        Enforces absolute clinical non-bypass.
        Returns: { 'safe': bool, 'reason': str, 'severity': str, 'conflict_type': str }
        """
        candidate_clean = candidate_name.lower()

        # 1. Allergy check
        for allergy in patient_allergies:
            allergy_clean = allergy.lower().strip()
            # Direct match
            if allergy_clean in candidate_clean or candidate_clean in allergy_clean:
                return {
                    "safe": False,
                    "reason": f"Direct known allergy conflict with patient allergy profile: '{allergy}'.",
                    "severity": "CRITICAL",
                    "conflict_type": "ALLERGY"
                }
            # Group / cross-reactivity match
            blocked_drugs = self.allergy_database.get(allergy_clean, [])
            for blocked in blocked_drugs:
                if blocked in candidate_clean or candidate_clean in blocked:
                    return {
                        "safe": False,
                        "reason": f"Severe cross-reactive allergy conflict: '{candidate_name}' belongs to the '{allergy}' sensitivity class.",
                        "severity": "CRITICAL",
                        "conflict_type": "ALLERGY"
                    }

        # 2. Drug-Drug Interaction (DDI) check
        for active_drug in active_prescriptions:
            active_clean = active_drug.lower().strip()
            # Test key combinations
            for (drug1, drug2), details in self.ddi_database.items():
                match1 = (drug1 in candidate_clean and drug2 in active_clean)
                match2 = (drug2 in candidate_clean and drug1 in active_clean)
                if match1 or match2:
                    return {
                        "safe": False,
                        "reason": f"Hazardous Drug Interaction: {candidate_name} + {active_drug}. {details['description']}",
                        "severity": details["severity"],
                        "conflict_type": "DDI"
                    }

        # 3. Condition Contraindication check
        for condition in diagnosed_conditions:
            cond_clean = condition.strip()
            for blocked_cond, blocked_drugs in self.condition_contraindications.items():
                if blocked_cond.lower() in cond_clean.lower():
                    for bd in blocked_drugs:
                        if bd in candidate_clean:
                            return {
                                "safe": False,
                                "reason": f"Clinical Contraindication: {candidate_name} is contraindicated in patients with {blocked_cond}.",
                                "severity": "HIGH",
                                "conflict_type": "CONDITION_CONTRAINDICATION"
                            }

        return {
            "safe": True,
            "reason": "Passed deterministic allergy, DDI, and contraindication filters. Eligible for clinical review.",
            "severity": "NONE",
            "conflict_type": "NONE"
        }

safety_engine = DeterministicSafetyEngine()
