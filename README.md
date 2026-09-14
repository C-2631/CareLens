# 🏥 CareLens — Master Personalized Healthcare & Medicine Recommendation System

CareLens is an enterprise-grade Clinical Decision-Support System (CDSS) and AI-powered Personalized Healthcare & Medicine Recommendation platform. It integrates statistical tabular machine learning (XGBoost / Random Forest across 41 diseases and 132 symptoms), physiological vitals normalization, a Tri-Tier Hybrid Recommendation Engine (Content-Based TF-IDF + Collaborative Filtering + NetworkX Knowledge Graph), a zero-bypass Deterministic Clinical Safety Engine, local TreeSHAP feature attributions, and a modern React.js frontend featuring an interactive 3D WebGL background and 3D Holographic Anatomical Avatar.

---

## ✨ Key Features & Architecture

### 1. 👥 Multi-Role Authentication & Access Control (RBAC)
- **Patient (User)**: Interactive symptom checker, vitals logger, personalized recommendations (medications, diets, exercises, lifestyle), health trends charts, and conversational AI companion.
- **Clinician / Doctor (Staff)**: Clinician Review Queue for low-confidence (< 65%) or high-risk cases, validate or override AI diagnoses, and add clinical notes.
- **Administrator / Analyst (Admin)**: Full medication catalog management, deterministic DDI and contraindication rules editor, automated model retraining triggers, and enterprise audit logs.

### 2. 🧠 Machine Learning & Recommendation Engines
- **Disease Classifier**: Multi-class Random Forest & XGBoost trained on 41 target conditions across 132 binary symptom flags with vitals weighting.
- **Local Explainability (TreeSHAP)**: Identifies the exact physiological vitals and symptoms that drove each individual diagnosis.
- **Tri-Tier Hybrid Recommendation**:
  $$\text{Score} = \alpha \cdot \text{Collab} + (1 - \alpha - \beta) \cdot \text{Content} + \beta \cdot \text{Sentiment}$$
- **Zero-Bypass Deterministic Safety Engine**: Hard clinical screening for known patient allergies, cross-reactive classes, condition contraindications, and Drug-Drug Interactions (DDI).

### 3. 🎨 Modern UI/UX & 3D Interactive Design
- **Soft Launching Splash Screen** with pulsating radar and animated loader.
- **3D WebGL Canvas**: Molecular particle grid, rotating DNA double-helix, and interactive mouse parallax.
- **3D Holographic Human Anatomical Avatar**: Clickable organ hotspots (Heart, Lungs, Liver, Kidneys, Metabolism) with real-time biometric telemetry.
- **Seamless Light & Dark Theme** with high contrast and accessibility.
- **Reference Screens Implemented**:
  1. *Hero Landing Page* (`HealthAI` - Your Health, Our AI Priority)
  2. *Patient Dashboard* (`MedRecom` - Welcome back, John!)
  3. *Recommendations Explorer* (`HealthPlus` - Personalized Recommendations)
  4. *AI Health Analysis* (`CareMind` - Multi-Organ Risk Stratification)
  5. *Futuristic Diagnostic Analyzer* (`MediSuggest` - Smarter Recommendations. Healthier You.)
  6. *Health Companion* (`WellnessAI` - Ask HealthAI Chat)
  7. *Clinician Review Queue* (Doctor Workspace)
  8. *Admin & Safety Console* (System Administration)

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10+ (tested on Python 3.12)
- **Node.js**: 18+ (tested on Node v22)

---

### Step 1: Backend Setup (Python FastAPI)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI backend
python run.py
```
*The API will start at **http://127.0.0.1:8000** with interactive Swagger documentation at **http://127.0.0.1:8000/docs**.*

---

### Step 2: Frontend Setup (React.js + Vite)

```bash
cd frontend

# Install packages
npm install

# Run the frontend dev server
npm run dev
```
*The frontend will start at **http://localhost:5173**.*

---

## 🔐 Default Demo Accounts

| Role | Email | Password | Pre-seeded Persona |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@carelens.ai` | `Patient@123` | John Doe (38y/o, Penicillin Allergy, Atorvastatin) |
| **Clinician** | `doctor@carelens.ai` | `Doctor@123` | Dr. Sarah Johnson, MD (Review Queue access) |
| **Admin** | `admin@carelens.ai` | `Admin@123` | Alex Carter (SysAdmin, Retrain & Safety Editor) |

*(You can also use the **Quick Demo Role Switcher** floating toolbar at the bottom-right of the web app to switch between personas in 1 click!)*

---

## 📂 Project Directory Structure

```text
carelens-healthcare-system/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routers/
│   │   │   │   ├── auth.py              # JWT Login / Registration
│   │   │   │   ├── patient.py           # Patient profile & vitals telemetry
│   │   │   │   ├── prediction.py        # ML Disease Prediction (132 symptoms)
│   │   │   │   ├── recommendation.py    # Tri-Tier Hybrid Recommender
│   │   │   │   ├── staff.py             # Clinician Review Queue
│   │   │   │   ├── admin.py             # Admin catalog & retrain endpoints
│   │   │   │   └── chat.py              # Grounded HealthAI Assistant
│   │   │   └── schemas.py               # Pydantic schemas
│   │   ├── core/
│   │   │   ├── config.py                # Environment configurations
│   │   │   └── security.py              # JWT & RBAC dependencies
│   │   ├── data/
│   │   │   ├── medical_knowledge.py     # 41 Diseases, 132 Symptoms, Diets, Workouts
│   │   │   ├── medicines_db.py          # 50+ Approved Medications & Interventions
│   │   │   └── ddi_rules.py             # Deterministic DDI & Allergy Matrix
│   │   ├── ml/
│   │   │   ├── disease_classifier.py    # Random Forest / XGBoost ML Model + SHAP
│   │   │   ├── hybrid_recommender.py    # Content-Based (TF-IDF), Collab, Knowledge Graph
│   │   │   ├── risk_stratifier.py       # Multi-organ risk score calculator
│   │   │   └── sentiment_analyzer.py    # Drug reviews sentiment scoring
│   │   ├── services/
│   │   │   ├── db_service.py            # SQLite database service & auto-seeder
│   │   │   └── safety_engine.py         # Deterministic Clinical Safety Engine
│   │   └── main.py                      # FastAPI Application Entrypoint
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/
│   │   │   │   ├── ThreeBackground.jsx  # 3D WebGL particle/DNA canvas
│   │   │   │   └── HologramAvatar.jsx   # 3D Holographic Body with interactive hotspots
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx           # Top search & role navigation
│   │   │   │   ├── Sidebar.jsx          # Responsive collapsible sidebar
│   │   │   │   └── LoadingScreen.jsx    # Soft launching splash screen
│   │   │   ├── auth/
│   │   │   │   ├── AuthModal.jsx        # Multi-role login & registration
│   │   │   │   └── QuickRoleSwitcher.jsx# Demo persona toolbar
│   │   │   └── views/
│   │   │       ├── HeroLandingView.jsx       # HealthAI Landing Page (Panel 1)
│   │   │       ├── PatientDashboardView.jsx  # MedRecom Dashboard (Panel 2)
│   │   │       ├── RecommendationsView.jsx   # HealthPlus Recommendations (Panel 3)
│   │   │       ├── HealthAnalysisView.jsx    # CareMind Risk Analysis (Panel 4)
│   │   │       ├── SymptomCheckerModalView.jsx # MediSuggest Diagnostic (Panel 5)
│   │   │       ├── AskHealthAIChatView.jsx   # WellnessAI Chat Assistant (Panel 6)
│   │   │       ├── ClinicianQueueView.jsx    # Doctor Review Queue
│   │   │       └── AdminConsoleView.jsx      # Admin Governance Console
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Auth & persona state
│   │   │   └── ThemeContext.jsx         # Dark / Light theme provider
│   │   ├── services/
│   │   │   └── api.js                   # Axios HTTP client with resilient fallbacks
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```
