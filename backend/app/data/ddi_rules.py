"""
Deterministic Safety Knowledge Base:
Drug-Drug Interaction (DDI) pairs and Allergy cross-reactivity databases.
"""

DDI_DATABASE = {
    # Key is sorted lowercase tuple of two drug names/classes
    ("aspirin", "warfarin"): {
        "severity": "CRITICAL",
        "description": "Extreme risk of severe internal gastrointestinal or intracranial bleeding due to dual anticoagulant/antiplatelet mechanisms."
    },
    ("clopidogrel", "omeprazole"): {
        "severity": "HIGH",
        "description": "Omeprazole competitively inhibits CYP2C19, significantly reducing the active antiplatelet metabolite of Clopidogrel."
    },
    ("lisinopril", "potassium"): {
        "severity": "HIGH",
        "description": "Concomitant use can cause severe life-threatening hyperkalemia leading to cardiac arrhythmias."
    },
    ("metformin", "contrast_dye"): {
        "severity": "CRITICAL",
        "description": "High risk of contrast-induced acute nephropathy leading to severe lactic acidosis."
    },
    ("simvastatin", "amiodarone"): {
        "severity": "HIGH",
        "description": "Increased risk of severe rhabdomyolysis and acute renal failure."
    },
    ("sumatriptan", "sertraline"): {
        "severity": "HIGH",
        "description": "Risk of Serotonin Syndrome manifested by hyperthermia, clonus, and autonomic instability."
    },
    ("ciprofloxacin", "theophylline"): {
        "severity": "HIGH",
        "description": "Inhibition of hepatic CYP1A2 leading to theophylline toxicity and seizures."
    },
    ("atorvastatin", "clarithromycin"): {
        "severity": "HIGH",
        "description": "Significant CYP3A4 inhibition increasing statin blood concentration and risk of myopathy."
    },
    ("methotrexate", "ibuprofen"): {
        "severity": "CRITICAL",
        "description": "NSAIDs reduce renal methotrexate clearance leading to severe bone marrow suppression."
    }
}

ALLERGY_DATABASE = {
    "penicillin": ["amoxicillin", "ampicillin", "augmentin", "penicillin v", "piperacillin"],
    "sulfa": ["sulfamethoxazole", "bactrim", "sulfasalazine", "sulfadiazine"],
    "cephalosporin": ["cephalexin", "cefuroxime", "ceftriaxone", "cefixime"],
    "nsaid": ["aspirin", "ibuprofen", "naproxen", "diclofenac", "ketorolac", "meloxicam"],
    "shellfish": ["glucosamine sulfate", "glucosamine complex (shellfish-derived)"],
    "statins": ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin"]
}

CONDITION_CONTRAINDICATIONS = {
    "Active Liver Disease": ["atorvastatin", "paracetamol", "methotrexate"],
    "Severe Renal Impairment": ["metformin", "ciprofloxacin", "magnesium glycinate"],
    "Pregnancy": ["losartan", "atorvastatin", "methotrexate", "tetracycline"],
    "Uncontrolled Hypertension": ["sumatriptan", "pseudoephedrine"],
    "Peptic Ulcer Disease": ["aspirin", "ibuprofen", "naproxen", "corticosteroids"]
}
