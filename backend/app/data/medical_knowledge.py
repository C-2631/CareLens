"""
Medical Knowledge Base
Comprehensive dataset of 132 Symptoms, 41 Diseases with authentic medical mapping,
precautions, diets, workouts, and specialist recommendations.
"""

SYMPTOMS_LIST = [
    "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", "shivering", "chills",
    "joint_pain", "stomach_pain", "acidity", "ulcers_on_tongue", "muscle_wasting", "vomiting",
    "burning_micturition", "spotting_urination", "fatigue", "weight_gain", "anxiety",
    "cold_hands_and_feets", "mood_swings", "weight_loss", "restlessness", "lethargy",
    "patches_in_throat", "irregular_sugar_level", "cough", "high_fever", "sunken_eyes",
    "breathlessness", "sweating", "dehydration", "indigestion", "headache", "yellowish_skin",
    "dark_urine", "nausea", "loss_of_appetite", "pain_behind_the_eyes", "back_pain", "constipation",
    "abdominal_pain", "diarrhoea", "mild_fever", "yellow_urine", "yellowing_of_eyes",
    "acute_liver_failure", "fluid_overload", "swelling_of_stomach", "swelled_lymph_nodes",
    "malaise", "blurred_and_distorted_vision", "phlegm", "throat_irritation", "redness_of_eyes",
    "sinus_pressure", "runny_nose", "congestion", "chest_pain", "weakness_in_limbs",
    "fast_heart_rate", "pain_during_bowel_movements", "pain_in_anal_region", "bloody_stool",
    "irritation_in_anus", "neck_pain", "dizziness", "cramps", "bruising", "obesity",
    "swollen_legs", "swollen_blood_vessels", "puffy_face_and_eyes", "enlarged_thyroid",
    "brittle_nails", "swollen_extremeties", "excessive_hunger", "extra_marital_contacts",
    "drying_and_tingling_lips", "slurred_speech", "knee_pain", "hip_joint_pain",
    "muscle_weakness", "stiff_neck", "swelling_joints", "movement_stiffness",
    "spinning_movements", "loss_of_balance", "unsteadiness", "weakness_of_one_body_side",
    "loss_of_smell", "bladder_discomfort", "foul_smell_of_urine", "continuous_feel_of_urine",
    "passage_of_gases", "internal_itching", "toxic_look_(typhos)", "depression", "irritability",
    "muscle_pain", "altered_sensorium", "red_spots_over_body", "belly_pain",
    "abnormal_menstruation", "dischromic_patches", "watering_from_eyes", "increased_appetite",
    "polyuria", "family_history", "mucoid_sputum", "rusty_sputum", "lack_of_concentration",
    "visual_disturbances", "receiving_blood_transfusion", "receiving_unsterile_injections",
    "coma", "stomach_bleeding", "distention_of_abdomen", "history_of_alcohol_consumption",
    "blood_in_sputum", "prominent_veins_on_calf", "palpitations", "painful_walking",
    "pus_filled_pimples", "blackheads", "scurring", "skin_peeling", "silver_like_dusting",
    "small_dents_in_nails", "inflammatory_nails", "blister", "red_sore_around_nose", "yellow_crust_ooze"
]

DISEASE_DETAILS = {
    "Fungal infection": {
        "symptoms": ["itching", "skin_rash", "nodal_skin_eruptions", "dischromic_patches"],
        "description": "A cutaneous fungal colonization causing circular itchy patches and dermal irritation.",
        "severity": "LOW",
        "specialist": "Dermatologist",
        "precautions": ["Keep skin clean and dry", "Use antifungal powder", "Avoid sharing towels", "Wear breathable cotton clothing"],
        "diets": ["Low-sugar diet", "Probiotic rich yogurt", "Garlic and ginger infusions", "Leafy green vegetables"],
        "workouts": ["Light walking", "Yoga (avoid heavy sweating)", "Stretching", "Pilates"]
    },
    "Allergy": {
        "symptoms": ["continuous_sneezing", "shivering", "chills", "watering_from_eyes"],
        "description": "Hypersensitivity immune reaction triggered by environmental allergens or dust mites.",
        "severity": "LOW",
        "specialist": "Allergist / Immunologist",
        "precautions": ["Avoid known triggers", "Use HEPA air filters", "Wash face after outdoor exposure", "Keep antihistamines accessible"],
        "diets": ["Citrus fruits rich in Vitamin C", "Quercetin-rich apples and onions", "Omega-3 fish oils", "Hydrating herbal teas"],
        "workouts": ["Indoor swimming", "Indoor cycling", "Gentle stretching", "Breathing exercises (Pranayama)"]
    },
    "GERD": {
        "symptoms": ["stomach_pain", "acidity", "ulcers_on_tongue", "vomiting", "cough", "chest_pain"],
        "description": "Gastroesophageal Reflux Disease with chronic stomach acid backflow into the esophagus.",
        "severity": "MEDIUM",
        "specialist": "Gastroenterologist",
        "precautions": ["Avoid lying down after meals", "Elevate head while sleeping", "Avoid spicy and greasy meals", "Eat smaller frequent meals"],
        "diets": ["Oatmeal and non-citrus fruits", "Ginger tea", "Steamed vegetables", "Lean chicken or tofu"],
        "workouts": ["Low-impact walking", "Gentle cycling", "Standing yoga poses", "Avoid heavy ab crunches"]
    },
    "Chronic cholestasis": {
        "symptoms": ["itching", "vomiting", "yellowish_skin", "nausea", "loss_of_appetite", "abdominal_pain", "yellowing_of_eyes"],
        "description": "Reduction or stoppage of bile flow from hepatic ducts into the gallbladder.",
        "severity": "HIGH",
        "specialist": "Hepatologist",
        "precautions": ["Limit dietary fats", "Avoid alcohol completely", "Monitor liver enzymes regularly", "Take fat-soluble vitamins (A, D, E, K)"],
        "diets": ["Low-fat Mediterranean diet", "High fiber whole grains", "Beetroot and artichoke", "Adequate water intake"],
        "workouts": ["Moderate walking", "Low-impact aqua aerobics", "Mobility exercises", "Light resistance bands"]
    },
    "Peptic ulcer disease": {
        "symptoms": ["vomiting", "indigestion", "loss_of_appetite", "abdominal_pain", "passage_of_gases", "internal_itching"],
        "description": "Sores on the mucosal lining of the stomach, small intestine, or lower esophagus.",
        "severity": "MEDIUM",
        "specialist": "Gastroenterologist",
        "precautions": ["Avoid NSAID pain relievers", "Limit caffeine and alcohol", "Do not smoke", "Manage psychological stress"],
        "diets": ["Probiotics and fermented milk (kefir)", "Cabbage juice", "Bananas and applesauce", "Cooked carrots and squashes"],
        "workouts": ["Gentle walking", "Deep breathing exercises", "Tai Chi", "Light stationary bike"]
    },
    "Diabetes": {
        "symptoms": ["fatigue", "weight_loss", "restlessness", "lethargy", "irregular_sugar_level", "blurred_and_distorted_vision", "obesity", "excessive_hunger", "polyuria"],
        "description": "Metabolic disorder characterized by elevated blood glucose from insulin resistance or deficiency.",
        "severity": "HIGH",
        "specialist": "Endocrinologist",
        "precautions": ["Monitor blood glucose daily", "Inspect feet for lesions", "Adhere to strict meal timings", "Stay hydrated"],
        "diets": ["Low glycemic index foods", "Bitter gourd & fenugreek", "High fiber legumes", "Lean proteins & nuts"],
        "workouts": ["30-minute brisk walk daily", "Resistance strength training 3x/week", "Aerobic cycling", "Post-meal 10-minute strolls"]
    },
    "Gastroenteritis": {
        "symptoms": ["vomiting", "sunken_eyes", "dehydration", "diarrhoea"],
        "description": "Inflammation of the gastrointestinal tract commonly caused by viral or bacterial infection.",
        "severity": "MEDIUM",
        "specialist": "General Physician",
        "precautions": ["Drink Oral Rehydration Salts (ORS)", "Wash hands thoroughly", "Boil drinking water", "Rest completely"],
        "diets": ["BRAT diet (Bananas, Rice, Applesauce, Toast)", "Electrolyte coconut water", "Clear vegetable broth", "Diluted herbal teas"],
        "workouts": ["Complete bed rest until hydration stabilizes", "Gentle posture stretching after recovery"]
    },
    "Bronchial Asthma": {
        "symptoms": ["fatigue", "cough", "high_fever", "breathlessness", "mucoid_sputum"],
        "description": "Chronic inflammatory condition of the airways causing periodic wheezing, shortness of breath, and tightness.",
        "severity": "HIGH",
        "specialist": "Pulmonologist",
        "precautions": ["Keep fast-acting rescue inhaler near", "Avoid cold air and smoke", "Track peak expiratory flow", "Avoid known pollen/dander"],
        "diets": ["Antioxidant-rich berries", "Magnesium-rich spinach and seeds", "Vitamin D fortified milk", "Omega-3 rich chia seeds"],
        "workouts": ["Swimming in warm water", "Indoor walking", "Cardiopulmonary breathing drills", "Pilates"]
    },
    "Hypertension": {
        "symptoms": ["headache", "chest_pain", "dizziness", "loss_of_balance", "lack_of_concentration"],
        "description": "Persistently elevated systolic and diastolic arterial blood pressure exceeding 130/80 mmHg.",
        "severity": "HIGH",
        "specialist": "Cardiologist",
        "precautions": ["DASH diet with salt < 2g/day", "Limit alcohol & tobacco", "Monitor home BP morning/evening", "Practice stress reduction"],
        "diets": ["Potassium-rich bananas & sweet potatoes", "Dark leafy greens", "Beetroot juice", "Unsalted almonds & walnuts"],
        "workouts": ["45-minute brisk walking", "Moderate swimming", "Stationary cycling", "Bodyweight squats"]
    },
    "Migraine": {
        "symptoms": ["acidity", "indigestion", "headache", "blurred_and_distorted_vision", "excessive_hunger", "stiff_neck", "depression", "irritability", "visual_disturbances"],
        "description": "Neurovascular disorder marked by recurrent severe unilateral pulsating headaches with sensory sensitivity.",
        "severity": "MEDIUM",
        "specialist": "Neurologist",
        "precautions": ["Maintain consistent sleep schedule", "Avoid sensory triggers (bright strobes, loud noise)", "Stay well hydrated", "Limit aged cheeses & cured meats"],
        "diets": ["Magnesium-rich foods (pumpkin seeds)", "Ginger tea for nausea", "Hydrating cucumber and watermelon", "Riboflavin (B2) eggs & mushrooms"],
        "workouts": ["Low-impact morning walks", "Gentle yoga neck stretches", "Deep meditation", "Progressive muscle relaxation"]
    },
    "Cervical spondylosis": {
        "symptoms": ["back_pain", "neck_pain", "dizziness", "loss_of_balance"],
        "description": "Age-related wear and tear affecting the spinal disks and vertebrae in the cervical neck region.",
        "severity": "MEDIUM",
        "specialist": "Orthopedic / Physiotherapist",
        "precautions": ["Use ergonomic neck support pillow", "Avoid prolonged phone slouching", "Perform regular neck retractions", "Apply hot/cold compress"],
        "diets": ["Calcium & Vitamin D rich foods", "Anti-inflammatory turmeric milk", "Bone broth and leafy greens", "Omega-3 fatty acids"],
        "workouts": ["Chin tucks and isometric neck holds", "Shoulder shrugs and rolls", "Upper back thoracic extensions", "Swimming"]
    },
    "Paralysis (brain hemorrhage)": {
        "symptoms": ["vomiting", "headache", "weakness_of_one_body_side", "altered_sensorium"],
        "description": "Acute loss of motor function resulting from cerebrovascular rupture and intracranial hemorrhage.",
        "severity": "CRITICAL",
        "specialist": "Neurologist / Neurosurgeon",
        "precautions": ["Immediate emergency hospitalization", "Strict blood pressure control", "Continuous neuro-monitoring", "Early physical therapy"],
        "diets": ["Pureed or soft Mediterranean diet", "Antioxidant rich purees", "Low sodium foods", "Hydration via assisted fluid plans"],
        "workouts": ["Supervised physical rehabilitation", "Passive range-of-motion exercises", "Bedside motor coordination training"]
    },
    "Jaundice": {
        "symptoms": ["itching", "vomiting", "fatigue", "weight_loss", "high_fever", "yellowish_skin", "dark_urine", "abdominal_pain"],
        "description": "Hyperbilirubinemia leading to yellow pigmentation of skin, sclerae, and mucous membranes.",
        "severity": "HIGH",
        "specialist": "Hepatologist / Gastroenterologist",
        "precautions": ["Complete bed rest", "Drink boiled and filtered water", "Zero alcohol consumption", "Avoid greasy fried items"],
        "diets": ["Sugarcane and radish juice", "Papaya and boiled vegetables", "Barley water", "Easily digestible light porridge"],
        "workouts": ["Bed rest during acute phase", "Gentle indoor strolls upon bilirubin normalization"]
    },
    "Malaria": {
        "symptoms": ["chills", "vomiting", "high_fever", "sweating", "headache", "nausea", "muscle_pain"],
        "description": "Parasitic protozoan infection transmitted through bites of infected female Anopheles mosquitoes.",
        "severity": "HIGH",
        "specialist": "Infectious Disease Specialist",
        "precautions": ["Use mosquito nets and repellents", "Complete full antimalarial course", "Keep surroundings clean of stagnant water", "Hydrate frequently"],
        "diets": ["High-calorie nutrient-dense soups", "Fresh fruit juices (orange, pomegranate)", "Coconut water", "Boiled eggs and lentils"],
        "workouts": ["Total physical rest during active fever cycles", "Gradual reconditioning walking post-treatment"]
    },
    "Chicken pox": {
        "symptoms": ["itching", "skin_rash", "fatigue", "lethargy", "high_fever", "headache", "loss_of_appetite", "mild_fever", "swelled_lymph_nodes", "malaise", "red_spots_over_body"],
        "description": "Highly contagious viral infection caused by the varicella-zoster virus causing vesicular pruritic lesions.",
        "severity": "MEDIUM",
        "specialist": "Dermatologist / General Physician",
        "precautions": ["Isolate until all blisters crust over", "Do not scratch lesions to avoid scarring", "Apply calamine lotion", "Keep nails clipped short"],
        "diets": ["Soft, cool, non-acidic foods", "Yogurt and fruit purees", "Hydrating broths", "Avoid spicy or salty snacks"],
        "workouts": ["Bed rest and gentle mobility in quarantine room"]
    },
    "Dengue": {
        "symptoms": ["skin_rash", "chills", "joint_pain", "vomiting", "fatigue", "high_fever", "headache", "nausea", "loss_of_appetite", "pain_behind_the_eyes", "back_pain", "muscle_pain", "red_spots_over_body"],
        "description": "Mosquito-borne arboviral infection causing sudden high fever, retro-orbital pain, severe myalgia, and thrombocytopenia.",
        "severity": "CRITICAL",
        "specialist": "Infectious Disease Specialist / Physician",
        "precautions": ["Monitor platelet counts daily", "Avoid aspirin or ibuprofen (risk of bleeding)", "Strict bed rest", "Emergency care if bleeding gums/petechiae occur"],
        "diets": ["Papaya leaf extract", "Pomegranate and kiwi juice", "Coconut water & ORS", "Nutritious light broths"],
        "workouts": ["Complete bed rest until platelet counts stabilize > 150,000/uL"]
    },
    "Typhoid": {
        "symptoms": ["chills", "vomiting", "fatigue", "high_fever", "headache", "nausea", "loss_of_appetite", "constipation", "abdominal_pain", "diarrhoea", "toxic_look_(typhos)", "belly_pain"],
        "description": "Systemic bacterial infection caused by Salmonella Typhi transmitted via contaminated food or water.",
        "severity": "HIGH",
        "specialist": "Infectious Disease Specialist",
        "precautions": ["Finish entire prescribed antibiotic course", "Strict hand hygiene", "Drink only bottled/boiled water", "Avoid raw salads and street food"],
        "diets": ["High carbohydrate bland diet (khichdi, porridge)", "Boiled potatoes", "Steamed apple compote", "Oral rehydration liquids"],
        "workouts": ["Rest during acute phase; light stretching after 2 weeks of normal temperature"]
    },
    "Hepatitis A": {
        "symptoms": ["joint_pain", "vomiting", "yellowish_skin", "dark_urine", "nausea", "loss_of_appetite", "abdominal_pain", "diarrhoea", "mild_fever", "yellowing_of_eyes", "muscle_pain"],
        "description": "Acute viral liver disease spread through the fecal-oral route or contaminated ingestion.",
        "severity": "HIGH",
        "specialist": "Hepatologist",
        "precautions": ["Strict sanitation and separate dining utensils", "Avoid paracetamol without hepatologist consent", "Zero alcohol", "Ample rest"],
        "diets": ["High calorie, low fat diet", "Fruit smoothies with honey", "Boiled vegetables", "Adequate hydration with glucose water"],
        "workouts": ["Rest period for 3-4 weeks; gradual return to walking"]
    },
    "Hepatitis B": {
        "symptoms": ["itching", "fatigue", "lethargy", "yellowish_skin", "dark_urine", "loss_of_appetite", "abdominal_pain", "yellow_urine", "yellowing_of_eyes", "malaise", "receiving_blood_transfusion", "receiving_unsterile_injections"],
        "description": "Potentially chronic viral infection attacking the liver transmitted through bodily fluids or blood products.",
        "severity": "CRITICAL",
        "specialist": "Hepatologist",
        "precautions": ["Consult for antiviral therapies", "Screen family members for vaccination", "Avoid sharing razors/needles", "Periodic liver ultrasound"],
        "diets": ["Lean protein (egg whites, tofu)", "Cruciferous broccoli and cabbage", "Green tea", "Strict avoidance of alcohol and processed trans-fats"],
        "workouts": ["Moderate daily walks", "Gentle flexibility yoga", "Light aerobic exercises (avoid exhaustion)"]
    },
    "Hepatitis C": {
        "symptoms": ["fatigue", "yellowish_skin", "nausea", "loss_of_appetite", "yellowing_of_eyes", "family_history"],
        "description": "Blood-borne viral infection causing chronic hepatitis, liver cirrhosis, or hepatocellular carcinoma.",
        "severity": "CRITICAL",
        "specialist": "Hepatologist",
        "precautions": ["Direct-Acting Antiviral (DAA) treatment", "Avoid hepatotoxic substances", "Regular viral load testing", "Healthy body weight maintenance"],
        "diets": ["Antioxidant-dense berries", "Fiber-rich oats and quinoa", "Steamed fish", "Turmeric and green vegetables"],
        "workouts": ["Low-intensity resistance bands", "Brisk walking", "Stationary bike", "Mindfulness stress relief"]
    },
    "Hepatitis D": {
        "symptoms": ["joint_pain", "vomiting", "fatigue", "yellowish_skin", "dark_urine", "nausea", "loss_of_appetite", "abdominal_pain", "yellowing_of_eyes"],
        "description": "Delta virus infection occurring exclusively as a co-infection or super-infection with Hepatitis B.",
        "severity": "CRITICAL",
        "specialist": "Hepatologist",
        "precautions": ["Specialist hepatology monitoring", "Hepatitis B viral control", "Immune support therapy", "Emergency liver function tests"],
        "diets": ["Low-sodium hepatic meal plans", "High-antioxidant vegetable purees", "Ample water", "Plant-based proteins"],
        "workouts": ["Supervised light physical mobility only"]
    },
    "Hepatitis E": {
        "symptoms": ["joint_pain", "vomiting", "fatigue", "high_fever", "yellowish_skin", "dark_urine", "nausea", "loss_of_appetite", "abdominal_pain", "yellowing_of_eyes", "acute_liver_failure"],
        "description": "Enterically transmitted waterborne viral liver infection, particularly severe in pregnant patients.",
        "severity": "HIGH",
        "specialist": "Hepatologist",
        "precautions": ["Water sanitation verification", "Specialist obstetric monitoring if pregnant", "Avoid unpasteurized foods", "Hospital admission if severe"],
        "diets": ["High carbohydrate clear liquid diet", "Fresh tender coconut water", "Boiled white rice and lentil soup", "Fresh peeled fruits"],
        "workouts": ["Complete rest until transaminases normalize"]
    },
    "Alcoholic hepatitis": {
        "symptoms": ["vomiting", "yellowish_skin", "abdominal_pain", "swelling_of_stomach", "distention_of_abdomen", "history_of_alcohol_consumption", "fluid_overload"],
        "description": "Hepatic inflammation caused by prolonged heavy alcohol consumption, leading to ascites and jaundice.",
        "severity": "CRITICAL",
        "specialist": "Gastroenterologist / Addiction Specialist",
        "precautions": ["Immediate cessation of all alcohol", "Nutritional rehabilitation", "Corticosteroid therapy under doctor guidance", "Liver ultrasound scan"],
        "diets": ["High-protein high-calorie medical diet", "B-complex vitamin supplementation (Thiamine)", "Low sodium to prevent ascites", "Small frequent balanced meals"],
        "workouts": ["Gentle physical therapy", "Bedside core mobilization", "Post-stabilization walking"]
    },
    "Tuberculosis": {
        "symptoms": ["chills", "vomiting", "fatigue", "weight_loss", "cough", "high_fever", "breathlessness", "sweating", "loss_of_appetite", "mild_fever", "phlegm", "chest_pain", "blood_in_sputum"],
        "description": "Contagious bacterial infection caused by Mycobacterium tuberculosis primarily attacking the lungs.",
        "severity": "CRITICAL",
        "specialist": "Pulmonologist / Infectious Disease",
        "precautions": ["Strict 6-month DOTS antibiotic protocol", "Wear N95 masks during active phase", "Ventilate living quarters", "Regular chest X-rays"],
        "diets": ["High protein diet (eggs, milk, pulses)", "Calorie dense nuts and avocados", "Zinc and Vitamin A rich vegetables", "Citrus fruits"],
        "workouts": ["Rest during initial intensive phase; mild breathing yoga and slow walking as lung capacity recovers"]
    },
    "Common Cold": {
        "symptoms": ["continuous_sneezing", "chills", "fatigue", "cough", "headache", "swelled_lymph_nodes", "malaise", "phlegm", "throat_irritation", "redness_of_eyes", "sinus_pressure", "runny_nose", "congestion", "loss_of_smell", "muscle_pain"],
        "description": "Mild upper respiratory tract viral infection usually caused by rhinoviruses.",
        "severity": "LOW",
        "specialist": "General Physician",
        "precautions": ["Steam inhalation with eucalyptus", "Warm saline gargles", "Stay warm and well-hydrated", "Hand hygiene"],
        "diets": ["Hot chicken or vegetable soup", "Warm ginger honey lemon tea", "Vitamin C rich citrus fruits", "Turmeric milk"],
        "workouts": ["Gentle indoor walk if symptoms above the neck; rest if feverish"]
    },
    "Pneumonia": {
        "symptoms": ["chills", "fatigue", "cough", "high_fever", "breathlessness", "sweating", "malaise", "phlegm", "chest_pain", "fast_heart_rate", "rusty_sputum"],
        "description": "Infection that inflames air sacs in one or both lungs, which may fill with fluid or purulent material.",
        "severity": "CRITICAL",
        "specialist": "Pulmonologist",
        "precautions": ["Immediate antibiotic or antiviral therapy", "Pulse oximetry monitoring (SpO2)", "Use incentive spirometer", "Adequate bed rest"],
        "diets": ["Warm protein-rich broths", "Electrolyte fluids and herbal teas", "Soft boiled eggs and oatmeal", "Antioxidant green smoothies"],
        "workouts": ["Rest until cleared by doctor; deep diaphragmatic breathing drills"]
    },
    "Dimorphic hemmorhoids(piles)": {
        "symptoms": ["constipation", "pain_during_bowel_movements", "pain_in_anal_region", "bloody_stool", "irritation_in_anus"],
        "description": "Swollen veins in the lower rectum and anus resulting from chronic straining, constipation, or pressure.",
        "severity": "MEDIUM",
        "specialist": "Proctologist / General Surgeon",
        "precautions": ["Warm sitz baths 2-3 times daily", "Do not strain during defecation", "Use soft cleansing wipes", "Avoid heavy weightlifting"],
        "diets": ["High fiber diet (psyllium husk, chia seeds, oats)", "3+ liters of water daily", "Papaya, prunes, and figs", "Avoid spicy peppers and fried snacks"],
        "workouts": ["Kegel exercises", "Pelvic floor bridges", "Light walking", "Avoid seated cycling or heavy deadlifts"]
    },
    "Heart attack": {
        "symptoms": ["vomiting", "breathlessness", "sweating", "chest_pain"],
        "description": "Myocardial infarction caused by acute occlusion of coronary arterial blood flow to heart muscle.",
        "severity": "CRITICAL",
        "specialist": "Cardiologist (Emergency ER)",
        "precautions": ["Call emergency services (911/112) immediately", "Chew aspirin if instructed by medical staff", "Cardiac rehabilitation program post-discharge", "Zero smoking"],
        "diets": ["Strict Mediterranean cardiac diet", "Zero trans fats & sodium < 1.5g", "Omega-3 rich salmon/flaxseeds", "High antioxidant berries and garlic"],
        "workouts": ["Phase II/III supervised cardiac rehabilitation exercise programs only"]
    },
    "Varicose veins": {
        "symptoms": ["fatigue", "cramps", "bruising", "obesity", "swollen_legs", "swollen_blood_vessels", "prominent_veins_on_calf"],
        "description": "Enlarged, twisted, superficial veins in lower limbs resulting from incompetent venous valves.",
        "severity": "MEDIUM",
        "specialist": "Vascular Surgeon",
        "precautions": ["Wear graduated compression stockings", "Elevate legs above heart level for 15 mins daily", "Avoid prolonged stationary standing/sitting", "Maintain healthy BMI"],
        "diets": ["Flavonoid-rich berries and citrus", "High-fiber whole grains to prevent strain", "Potassium-rich greens", "Low sodium foods"],
        "workouts": ["Calf muscle raises and ankle pumps", "Low-impact swimming", "Brisk walking", "Recumbent stationary bike"]
    },
    "Hypothyroidism": {
        "symptoms": ["fatigue", "weight_gain", "cold_hands_and_feets", "mood_swings", "lethargy", "dizziness", "puffy_face_and_eyes", "enlarged_thyroid", "brittle_nails", "swollen_extremeties", "depression", "irritability", "abnormal_menstruation"],
        "description": "Underactive thyroid gland producing insufficient thyroid hormones (T3/T4) slowing metabolic rate.",
        "severity": "MEDIUM",
        "specialist": "Endocrinologist",
        "precautions": ["Take levothyroxine on empty stomach 60 mins before breakfast", "Regular TSH blood level checks every 3-6 months", "Manage stress levels"],
        "diets": ["Selenium and zinc rich foods (Brazil nuts, pumpkin seeds)", "Iodized salt", "Lean poultry and eggs", "Cook cruciferous vegetables thoroughly"],
        "workouts": ["Moderate resistance training", "Brisk incline walking", "Vinyasa yoga", "Low-impact aerobics"]
    },
    "Hyperthyroidism": {
        "symptoms": ["fatigue", "mood_swings", "weight_loss", "restlessness", "sweating", "diarrhoea", "fast_heart_rate", "excessive_hunger", "muscle_weakness", "irritability", "abnormal_menstruation"],
        "description": "Overactive thyroid producing excessive thyroxine, causing tachycardia, hypermetabolism, and weight loss.",
        "severity": "HIGH",
        "specialist": "Endocrinologist",
        "precautions": ["Take prescribed antithyroid medication (e.g. Methimazole)", "Avoid excess iodine supplements and seaweed", "Monitor resting heart rate", "Protect eyes if exophthalmos occurs"],
        "diets": ["Cruciferous raw vegetables (cabbage, broccoli)", "Calcium and Vitamin D rich foods", "High-calorie nutrient smoothies", "Avoid caffeinated energy drinks"],
        "workouts": ["Low-intensity restorative yoga", "Mindful walking", "Gentle stretching (avoid high-intensity cardio until heart rate normalizes)"]
    },
    "Hypoglycemia": {
        "symptoms": ["vomiting", "fatigue", "anxiety", "sweating", "headache", "nausea", "blurred_and_distorted_vision", "excessive_hunger", "drying_and_tingling_lips", "slurred_speech", "irritability", "palpitations"],
        "description": "Abnormally low blood glucose (< 70 mg/dL) causing sympathetic overdrive and neuroglycopenic symptoms.",
        "severity": "HIGH",
        "specialist": "Endocrinologist",
        "precautions": ["Follow 15-15 rule: consume 15g fast sugar, recheck in 15 mins", "Carry glucose tablets / candy at all times", "Never skip meals after taking insulin/sulfonylureas", "Wear medical ID bracelet"],
        "diets": ["Complex slow-release carbohydrates", "Protein and healthy fat pairings with meals", "Whole grain toast with peanut butter", "Frequent balanced snacks"],
        "workouts": ["Check blood sugar prior to exercise; keep fast carbs nearby during workouts"]
    },
    "Osteoarthristis": {
        "symptoms": ["joint_pain", "neck_pain", "knee_pain", "hip_joint_pain", "swelling_joints", "painful_walking"],
        "description": "Degenerative joint disease involving breakdown of joint cartilage and underlying bone.",
        "severity": "MEDIUM",
        "specialist": "Rheumatologist / Orthopedic",
        "precautions": ["Maintain optimal body weight to reduce joint load", "Apply warm compresses before mobility", "Use ergonomic walking aids if needed", "Avoid repetitive joint impact"],
        "diets": ["Anti-inflammatory Mediterranean diet", "Fatty fish (salmon, sardines)", "Turmeric and ginger", "Glucosamine-rich broths"],
        "workouts": ["Hydrotherapy / Swimming", "Water aerobics", "Stationary cycling with zero joint impact", "Gentle isometric quadriceps strengthening"]
    },
    "Arthritis": {
        "symptoms": ["muscle_weakness", "stiff_neck", "swelling_joints", "movement_stiffness", "painful_walking"],
        "description": "Autoimmune or inflammatory joint disorder marked by synovial swelling, morning stiffness, and pain.",
        "severity": "MEDIUM",
        "specialist": "Rheumatologist",
        "precautions": ["Engage in gentle morning range of motion", "Balance activity with joint rest", "Apply alternating heat/ice packs", "Avoid inflammatory smoking"],
        "diets": ["Extra virgin olive oil", "Walnuts and chia seeds", "Colorful berries and dark cherries", "Green tea"],
        "workouts": ["Tai Chi for joint health", "Pilates on mat", "Low-resistance recumbent bike", "Gentle wrist and ankle circles"]
    },
    "(vertigo) Paroymsal  Positional Vertigo": {
        "symptoms": ["vomiting", "headache", "nausea", "spinning_movements", "loss_of_balance", "unsteadiness"],
        "description": "Inner ear balance disorder caused by displaced otoconia crystals in the semicircular canals.",
        "severity": "LOW",
        "specialist": "ENT Specialist / Neurologist",
        "precautions": ["Perform Epley / Semont canalith repositioning maneuver", "Avoid sudden rapid head movements", "Sit on bed edge before standing", "Use night lights to prevent falls"],
        "diets": ["Adequate hydration", "Limit excess salt and monosodium glutamate (MSG)", "Avoid excessive caffeine and alcohol", "Ginkgo biloba infusions"],
        "workouts": ["Vestibular rehabilitation exercises (Brandt-Daroff)", "Balance board training with wall support", "Gentle walking in open spaces"]
    },
    "Acne": {
        "symptoms": ["skin_rash", "pus_filled_pimples", "blackheads", "scurring"],
        "description": "Inflammatory dermatological condition occurring when hair follicles become plugged with sebum and dead skin cells.",
        "severity": "LOW",
        "specialist": "Dermatologist",
        "precautions": ["Wash face twice daily with non-comedogenic cleanser", "Do not squeeze or pop pimples", "Use oil-free sunscreens", "Change pillowcases regularly"],
        "diets": ["Low glycemic load meals", "Zinc-rich pumpkin seeds and chickpeas", "Antioxidant green tea", "Reduce skim dairy if trigger noted"],
        "workouts": ["Regular cardio (wash face immediately post-workout to clear sweat pores)"]
    },
    "Urinary tract infection": {
        "symptoms": ["burning_micturition", "bladder_discomfort", "foul_smell_of_urine", "continuous_feel_of_urine"],
        "description": "Bacterial infection in any part of the urinary system (kidneys, ureters, bladder, or urethra).",
        "severity": "MEDIUM",
        "specialist": "Urologist / General Physician",
        "precautions": ["Drink at least 3-4 liters of water daily", "Urinate promptly when needed and after intercourse", "Wipe front to back", "Complete prescribed antibiotics"],
        "diets": ["Unsweetened pure cranberry juice", "Probiotics (kefir/yogurt)", "Vitamin C rich citrus", "Avoid bladder irritants (coffee, spicy foods, alcohol)"],
        "workouts": ["Light walking; avoid strenuous abdominal strain or tight synthetic athletic tights during active infection"]
    },
    "Psoriasis": {
        "symptoms": ["skin_rash", "joint_pain", "skin_peeling", "silver_like_dusting", "small_dents_in_nails", "inflammatory_nails"],
        "description": "Autoimmune disease causing rapid epidermal cell turnover resulting in silvery scaly plaques.",
        "severity": "MEDIUM",
        "specialist": "Dermatologist",
        "precautions": ["Moisturize skin with thick ceramide creams", "Moderate natural sunlight exposure", "Avoid skin injuries / scratching", "Manage stress"],
        "diets": ["Anti-inflammatory diet rich in Omega-3", "Turmeric and olive oil", "Gluten-free trial if sensitivity noted", "Avoid red meat and alcohol"],
        "workouts": ["Indoor swimming (moisturize thoroughly after rinsing chlorine)", "Yoga and stress reduction", "Walking"]
    },
    "Impetigo": {
        "symptoms": ["skin_rash", "high_fever", "blister", "red_sore_around_nose", "yellow_crust_ooze"],
        "description": "Highly contagious superficial bacterial skin infection causing honey-colored crusting sores.",
        "severity": "LOW",
        "specialist": "Dermatologist / Pediatrician",
        "precautions": ["Apply topical antibiotic ointment (Mupirocin)", "Gently wash sores with antibacterial soap", "Wash clothing and towels in hot water", "Keep fingernails short"],
        "diets": ["Immune boosting citrus fruits", "Garlic and raw honey", "Zinc-rich whole grains", "Plenty of fluids"],
        "workouts": ["Rest at home until lesions dry and contagious phase subsides"]
    }
}
