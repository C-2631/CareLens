"""
Database Persistence & Seeding Service (SQLite)
Maintains users, 1,000 patients, 180 doctors, 220 nurses, 100 hospital staff & sweepers,
5 administrators, pharmacy inventory, surgeries, prescriptions, vitals, and enterprise audit logs.
"""

import sqlite3
import json
import os
import random
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from app.core.security import get_password_hash
from app.data.medicines_db import MEDICINES_DATABASE
from app.data.ddi_rules import DDI_DATABASE, ALLERGY_DATABASE

DB_FILE = "carelens.db"

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL, -- 'patient', 'doctor', 'nurse', 'staff', 'admin'
        full_name TEXT NOT NULL,
        avatar_url TEXT,
        specialty TEXT,
        department TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL
    )
    """)

    # 2. Patient Profiles Table (1,000 Synthetic Patients)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patient_profiles (
        patient_id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        blood_group TEXT,
        reason_for_visit TEXT,
        risk_level TEXT NOT NULL DEFAULT 'Low', -- 'Low', 'Moderate', 'High', 'Critical'
        status TEXT NOT NULL DEFAULT 'In Progress', -- 'In Progress', 'Review', 'Completed', 'Admitted'
        admission_status TEXT DEFAULT 'Outpatient', -- 'Outpatient', 'Inpatient (Ward A)', 'Inpatient (ICU)', 'Inpatient (Post-Op)'
        bed_number TEXT,
        assigned_doctor_id TEXT,
        assigned_doctor_name TEXT,
        assigned_doctor_specialty TEXT,
        assigned_nurse_name TEXT,
        allergies TEXT,
        chronic_conditions TEXT,
        current_medications TEXT,
        emergency_contact TEXT,
        health_score INTEGER DEFAULT 78,
        heart_health TEXT DEFAULT 'Good',
        blood_pressure_status TEXT DEFAULT 'Normal (120/80)',
        blood_sugar_status TEXT DEFAULT 'Normal (95 mg/dL)',
        bmi_value REAL DEFAULT 22.4,
        bmi_status TEXT DEFAULT 'Normal',
        sleep_quality TEXT DEFAULT '7.5 hrs Good',
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
    """)

    # 3. Doctors Table (180 Specialists)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS doctors (
        doctor_id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        department TEXT NOT NULL,
        qualification TEXT DEFAULT 'MBBS, MD',
        opd_timing TEXT DEFAULT '09:00 AM - 02:00 PM',
        room_no TEXT DEFAULT 'OPD-102',
        total_patients INTEGER DEFAULT 24,
        todays_appointments INTEGER DEFAULT 8,
        rating REAL DEFAULT 4.9,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
    """)

    # 4. Nurses Table (220 Nurses)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS nurses (
        nurse_id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        department TEXT NOT NULL,
        ward TEXT NOT NULL, -- 'ICU', 'General Ward A', 'Emergency Care', 'Pediatrics', 'Post-Op'
        shift TEXT NOT NULL, -- 'Morning (07:00 - 15:00)', 'Evening (15:00 - 23:00)', 'Night (23:00 - 07:00)'
        experience_years INTEGER DEFAULT 5,
        contact TEXT NOT NULL,
        status TEXT DEFAULT 'On Duty',
        created_at TEXT NOT NULL
    )
    """)

    # 5. Hospital Staff & Sweepers Table (100 Staff Members)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hospital_staff (
        staff_id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        role_title TEXT NOT NULL, -- 'Senior Sweeper / Sanitation', 'Ward Assistant', 'Pharmacy Dispenser', 'Lab Technician', 'Radiology Technician', 'Security Guard'
        department TEXT NOT NULL,
        assigned_zone TEXT NOT NULL, -- 'Block A - Ground Floor', 'Block B - 2nd Floor ICU', 'Emergency Ward', 'Pharmacy Wing'
        shift TEXT NOT NULL,
        is_sweeper INTEGER DEFAULT 0,
        contact TEXT NOT NULL,
        status TEXT DEFAULT 'Active',
        created_at TEXT NOT NULL
    )
    """)

    # 6. Appointments Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS appointments (
        appointment_id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        doctor_specialty TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        appointment_time TEXT NOT NULL,
        reason TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Upcoming', -- 'Upcoming', 'Completed', 'Pending'
        created_at TEXT NOT NULL
    )
    """)

    # 7. Surgeries & Operation Theater (OT) Schedule
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS surgeries (
        surgery_id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        procedure_name TEXT NOT NULL,
        ot_room TEXT NOT NULL, -- 'OT-1 (Cardiac)', 'OT-2 (Orthopedic)', 'OT-3 (General)', 'OT-4 (Neuro)'
        scheduled_date TEXT NOT NULL,
        scheduled_time TEXT NOT NULL,
        anesthetist_name TEXT NOT NULL,
        status TEXT DEFAULT 'Scheduled', -- 'Scheduled', 'In Progress', 'Completed', 'Post-Op'
        created_at TEXT NOT NULL
    )
    """)

    # 8. Patient Medication Administration Timetable
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patient_med_schedules (
        schedule_id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        medicine_name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        timing_slot TEXT NOT NULL, -- '08:00 AM (Morning)', '01:00 PM (Afternoon)', '08:00 PM (Night)'
        food_relation TEXT NOT NULL, -- 'Before Food', 'After Food', 'With Meals'
        assigned_nurse TEXT NOT NULL,
        is_taken INTEGER DEFAULT 0,
        notes TEXT,
        created_at TEXT NOT NULL
    )
    """)

    # 9. Pharmacy & Medicine Inventory Table (100+ Medicines)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pharmacy_inventory (
        item_id TEXT PRIMARY KEY,
        medicine_name TEXT NOT NULL,
        generic_name TEXT NOT NULL,
        drug_class TEXT NOT NULL,
        category TEXT NOT NULL, -- 'Medications', 'Supplements', 'Antibiotics', 'Injectables', 'Cardiovascular'
        stock_quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        batch_no TEXT NOT NULL,
        expiry_date TEXT NOT NULL,
        reorder_level INTEGER DEFAULT 50,
        status TEXT DEFAULT 'In Stock', -- 'In Stock', 'Low Stock', 'Critical'
        indications TEXT NOT NULL,
        contraindications TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # 10. Prescriptions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS prescriptions (
        prescription_id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        medicines TEXT NOT NULL,
        diagnosis TEXT NOT NULL,
        instructions TEXT,
        issued_date TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # 11. High Risk Alerts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS high_risk_alerts (
        alert_id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        assigned_doctor_id TEXT NOT NULL,
        condition_alert TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'High',
        is_resolved INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
    """)

    # 12. Vitals Time-Series Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS vitals (
        vital_id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        recorded_at TEXT NOT NULL,
        systolic_bp REAL NOT NULL,
        diastolic_bp REAL NOT NULL,
        glucose_level REAL NOT NULL,
        heart_rate INTEGER NOT NULL,
        temperature REAL NOT NULL,
        bmi REAL NOT NULL,
        cholesterol REAL NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patient_profiles(patient_id)
    )
    """)

    # 13. Diagnoses / Review Queue Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS diagnoses (
        diagnosis_id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        predicted_disease TEXT NOT NULL,
        confidence REAL NOT NULL,
        risk_level TEXT NOT NULL,
        symptoms TEXT NOT NULL,
        vitals TEXT NOT NULL,
        clinician_status TEXT DEFAULT 'PENDING_REVIEW',
        clinician_notes TEXT,
        confirmed_disease TEXT,
        assigned_doctor_id TEXT,
        created_at TEXT NOT NULL
    )
    """)

    # 14. Enterprise Audit Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        log_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        details TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    conn.commit()
    seed_database_complete(conn)
    conn.close()

def seed_database_complete(conn):
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()

    # Check if database already seeded with full scale
    cursor.execute("SELECT COUNT(*) as cnt FROM patient_profiles")
    existing_patients_cnt = cursor.fetchone()["cnt"]

    if existing_patients_cnt >= 1000:
        return # Already fully seeded

    print("--- Seeding Enterprise Synthetic Hospital Database (1,000 Patients, 180 Doctors, 220 Nurses, 100 Staff, 5 Admins) ---")

    # A. Seed 5 Hospital Administrators
    admins_data = [
        ("usr-adm-001", "director@carelens.ai", "Admin@123", "admin", "Dr. Alok Verma", "Medical Director & Chief of Surgery", "Executive Administration"),
        ("usr-adm-002", "chiefofstaff@carelens.ai", "Admin@123", "admin", "Dr. Sunita Deshmukh", "Chief of Staff & Quality Control", "Medical Governance"),
        ("usr-adm-003", "operations@carelens.ai", "Admin@123", "admin", "Rajiv Malhotra", "Chief Operating Officer", "Hospital Operations & Facilities"),
        ("usr-adm-004", "nursing.head@carelens.ai", "Admin@123", "admin", "Sister Mary Mathew", "Director of Nursing Services", "Nursing Administration"),
        ("usr-adm-005", "pharmacy.head@carelens.ai", "Admin@123", "admin", "Dr. Hemant Saxena", "Head of Clinical Pharmacology", "Pharmacy & Therapeutics")
    ]
    for adm in admins_data:
        cursor.execute("SELECT user_id FROM users WHERE user_id = ?", (adm[0],))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO users (user_id, email, password_hash, role, full_name, specialty, department, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
            """, (adm[0], adm[1], get_password_hash(adm[2]), adm[3], adm[4], adm[5], adm[6], now_iso))

    # B. Seed 180 Specialist Doctors
    specialties_pool = [
        ("Cardiology", "Cardiovascular Medicine", "Dr. Aditi Sharma", "MBBS, MD, DM (Cardiology)"),
        ("Endocrinology", "Metabolic & Diabetes Care", "Dr. Rajesh Kumar", "MBBS, MD (Endocrinology)"),
        ("Pulmonology", "Respiratory & Chest Medicine", "Dr. Priya Nair", "MBBS, MD (Pulmonology)"),
        ("Neurology", "Neuroscience & Brain Health", "Dr. Vikram Sethi", "MBBS, MD, DM (Neurology)"),
        ("Orthopedics", "Bone & Joint Surgery", "Dr. Sandeep Kulkarni", "MBBS, MS (Orthopedics)"),
        ("Oncology", "Medical & Surgical Oncology", "Dr. Farhan Qureshi", "MBBS, MD (Oncology)"),
        ("Pediatrics", "Child Health & Neonatology", "Dr. Anjali Menon", "MBBS, DCH, MD (Pediatrics)"),
        ("General Surgery", "Minimal Access & Laparoscopy", "Dr. Arvind Swaminathan", "MBBS, MS, FRCS"),
        ("Nephrology", "Kidney Care & Dialysis", "Dr. Meenakshi Sundaram", "MBBS, MD (Nephrology)"),
        ("Gastroenterology", "Digestive & Hepatology", "Dr. Rohan Bansal", "MBBS, MD, DM (Gastro)"),
        ("Dermatology", "Skin & Allergy Care", "Dr. Tanvi Shah", "MBBS, MD (Dermatology)"),
        ("Anesthesiology", "Critical Care & Anesthesia", "Dr. Gautam Mukherjee", "MBBS, MD (Anaesthesia)")
    ]

    first_names = ["Arun", "Aditi", "Rajesh", "Priya", "Vikram", "Sandeep", "Farhan", "Anjali", "Arvind", "Meenakshi", "Rohan", "Tanvi", "Gautam", "Sanjay", "Kavita", "Deepak", "Nisha", "Manoj", "Shilpa", "Ramesh", "Pooja", "Vivek", "Rashmi", "Amit", "Sneha", "Kiran", "Naveen", "Archana", "Suresh", "Bhavna"]
    last_names = ["Sharma", "Kumar", "Nair", "Sethi", "Kulkarni", "Qureshi", "Menon", "Swaminathan", "Sundaram", "Bansal", "Shah", "Mukherjee", "Verma", "Patel", "Reddy", "Gupta", "Chatterjee", "Bhattacharya", "Choudhury", "Pillai", "Deshpande", "Mehta", "Malhotra", "Kapoor", "Gokhale", "Iyengar", "Shukla", "Pandey"]

    seeded_doctors = []
    # Guarantee primary demo doctors
    primary_docs = [
        ("usr-doc-001", "doc-001", "Dr. Aditi Sharma", "aditi.sharma@carelens.ai", "Cardiology", "Cardiovascular Medicine", "MBBS, MD, DM (Cardiology)", "09:00 AM - 01:00 PM", "OPD-101", 24, 8, 4.95),
        ("usr-doc-002", "doc-002", "Dr. Rajesh Kumar", "rajesh.kumar@carelens.ai", "Endocrinology", "Metabolic & Diabetes Care", "MBBS, MD (Endocrinology)", "10:00 AM - 02:00 PM", "OPD-102", 20, 6, 4.88),
        ("usr-doc-003", "doc-003", "Dr. Priya Nair", "priya.nair@carelens.ai", "Pulmonology", "Respiratory & Chest Medicine", "MBBS, MD (Pulmonology)", "09:30 AM - 01:30 PM", "OPD-103", 18, 5, 4.92),
        ("usr-doc-004", "doc-004", "Dr. Vikram Sethi", "vikram.sethi@carelens.ai", "Neurology", "Neuroscience & Brain Health", "MBBS, MD, DM (Neurology)", "11:00 AM - 03:00 PM", "OPD-104", 22, 7, 4.91)
    ]
    for u_id, d_id, name, email, spec, dept, qual, timing, room, tot_pat, appts, rat in primary_docs:
        cursor.execute("SELECT user_id FROM users WHERE user_id = ?", (u_id,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO users (user_id, email, password_hash, role, full_name, specialty, department, is_active, created_at)
            VALUES (?, ?, ?, 'doctor', ?, ?, ?, 1, ?)
            """, (u_id, email, get_password_hash("Doctor@123"), name, spec, dept, now_iso))
        cursor.execute("SELECT doctor_id FROM doctors WHERE doctor_id = ?", (d_id,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO doctors (doctor_id, user_id, full_name, specialty, department, qualification, opd_timing, room_no, total_patients, todays_appointments, rating, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (d_id, u_id, name, spec, dept, qual, timing, room, tot_pat, appts, rat, now_iso))
        seeded_doctors.append((d_id, name, spec))

    # Generate remaining up to 180 doctors
    for i in range(5, 181):
        d_id = f"doc-{i:03d}"
        u_id = f"usr-doc-{i:03d}"
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        name = f"Dr. {fname} {lname}"
        email = f"{fname.lower()}.{lname.lower()}{i}@carelens.ai"
        spec_info = random.choice(specialties_pool)
        spec = spec_info[0]
        dept = spec_info[1]
        qual = spec_info[3]
        room = f"OPD-{100 + (i % 30)}"
        timing = f"{random.choice(['08:00 AM', '09:00 AM', '10:00 AM', '02:00 PM'])} - {random.choice(['01:00 PM', '02:00 PM', '05:00 PM', '06:00 PM'])}"

        cursor.execute("SELECT user_id FROM users WHERE user_id = ?", (u_id,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO users (user_id, email, password_hash, role, full_name, specialty, department, is_active, created_at)
            VALUES (?, ?, ?, 'doctor', ?, ?, ?, 1, ?)
            """, (u_id, email, get_password_hash("Doctor@123"), name, spec, dept, now_iso))
        
        cursor.execute("SELECT doctor_id FROM doctors WHERE doctor_id = ?", (d_id,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO doctors (doctor_id, user_id, full_name, specialty, department, qualification, opd_timing, room_no, total_patients, todays_appointments, rating, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (d_id, u_id, name, spec, dept, qual, timing, room, random.randint(12, 35), random.randint(3, 12), round(random.uniform(4.6, 5.0), 2), now_iso))
        
        seeded_doctors.append((d_id, name, spec))

    # C. Seed 220 Nurses across Wards
    nurse_first = ["Sarah", "Deepa", "Anupama", "Blessy", "Sunita", "Mary", "Rekha", "Mini", "Grace", "Lakshmi", "Preeti", "Sujata", "Jisha", "Ancy", "Geeta", "Shobha", "Divya", "Sona", "Lincy", "Reshma"]
    wards_pool = ["ICU Ward", "Emergency Care", "General Ward A", "General Ward B", "Pediatric Care", "Post-Op Recovery", "Cardio Care Unit (CCU)", "Maternity & Neonatal"]
    shifts_pool = ["Morning (07:00 - 15:00)", "Evening (15:00 - 23:00)", "Night (23:00 - 07:00)"]

    seeded_nurses = []
    # Primary Demo Nurse
    cursor.execute("SELECT user_id FROM users WHERE user_id = 'usr-nurse-001'")
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO users (user_id, email, password_hash, role, full_name, specialty, department, is_active, created_at)
        VALUES ('usr-nurse-001', 'nurse.sarah@carelens.ai', ?, 'nurse', 'Nurse Sarah Jenkins', 'ICU & Clinical Triage', 'Nursing Services', 1, ?)
        """, (get_password_hash("Nurse@123"), now_iso))

    for i in range(1, 221):
        n_id = f"nur-{i:03d}"
        n_name = f"Nurse {random.choice(nurse_first)} {random.choice(last_names)}"
        if i == 1:
            n_name = "Nurse Sarah Jenkins"
        ward = random.choice(wards_pool)
        shift = random.choice(shifts_pool)
        contact = f"+91 98{random.randint(10000000, 99999999)}"

        cursor.execute("SELECT nurse_id FROM nurses WHERE nurse_id = ?", (n_id,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO nurses (nurse_id, full_name, department, ward, shift, experience_years, contact, status, created_at)
            VALUES (?, ?, 'Nursing Care', ?, ?, ?, ?, 'On Duty', ?)
            """, (n_id, n_name, ward, shift, random.randint(2, 18), contact, now_iso))
        seeded_nurses.append(n_name)

    # D. Seed 100 Hospital Staff (including Sweepers & Sanitation Staff)
    staff_roles = [
        ("Sweeper & Ward Sanitation Associate", "Sanitation & Hygiene", 1),
        ("Senior Sanitation Supervisor", "Sanitation & Hygiene", 1),
        ("Ward Attendant / Orderly", "Patient Transport & Logistics", 0),
        ("Pharmacy Dispensing Assistant", "Hospital Pharmacy", 0),
        ("Clinical Lab Assistant", "Pathology & Biochemistry", 0),
        ("Radiology & X-Ray Technician", "Diagnostic Imaging", 0),
        ("Medical Receptionist & Registration", "Hospital Front Desk", 0),
        ("Central Sterile Services Attendant (CSSD)", "Sterilization & OT Support", 0),
        ("Biomedical Waste Technician", "Sanitation & Bio-Safety", 1),
        ("Hospital Security Officer", "Safety & Security", 0)
    ]
    zones_pool = ["Block A - Ground Floor", "Block A - 1st Floor OPD", "Block B - 2nd Floor ICU", "Block B - 3rd Floor Wards", "Emergency Trauma Center", "Operation Theater Wing", "Diagnostic Pathology Center", "Pharmacy & Storehouse"]

    for i in range(1, 101):
        s_id = f"stf-{i:03d}"
        role_tuple = random.choice(staff_roles)
        s_name = f"{random.choice(first_names)} {random.choice(last_names)}"
        zone = random.choice(zones_pool)
        shift = random.choice(shifts_pool)
        is_swp = role_tuple[2]
        contact = f"+91 97{random.randint(10000000, 99999999)}"

        cursor.execute("SELECT staff_id FROM hospital_staff WHERE staff_id = ?", (s_id,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO hospital_staff (staff_id, full_name, role_title, department, assigned_zone, shift, is_sweeper, contact, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?)
            """, (s_id, s_name, role_tuple[0], role_tuple[1], zone, shift, is_swp, contact, now_iso))

    # E. Seed 100+ Pharmacy Medicines Inventory
    medicine_catalog = [
        ("med-001", "Metformin HCl 500mg", "Metformin", "Biguanide Antidiabetic", "Medications", 1450, 4.50, "BAT-2025-01", "2027-08-31", 100, "Type-2 Diabetes Mellitus", "Severe Renal Impairment (eGFR < 30)"),
        ("med-002", "Amlodipine Besylate 5mg", "Amlodipine", "Dihydropyridine CCB", "Cardiovascular", 1820, 6.20, "BAT-2025-02", "2027-11-30", 120, "Essential Hypertension, Chronic Angina", "Severe Hypotension"),
        ("med-003", "Atorvastatin Calcium 20mg", "Atorvastatin", "HMG-CoA Reductase Inhibitor", "Cardiovascular", 980, 12.00, "BAT-2025-03", "2027-06-30", 80, "Hyperlipidemia, CVD Prevention", "Active Liver Disease"),
        ("med-004", "Losartan Potassium 50mg", "Losartan", "Angiotensin Receptor Blocker", "Cardiovascular", 1200, 8.50, "BAT-2025-04", "2027-10-31", 100, "Hypertension, Diabetic Nephropathy", "Pregnancy (2nd & 3rd Trimester)"),
        ("med-005", "Levothyroxine Sodium 50mcg", "Levothyroxine", "Synthetic Thyroid Hormone", "Medications", 850, 5.80, "BAT-2025-05", "2027-09-30", 60, "Primary Hypothyroidism", "Untreated Adrenocortical Insufficiency"),
        ("med-006", "Amoxicillin-Clavulanate 625mg", "Amoxicillin + Clavulanate", "Penicillin / Beta-lactamase Inhibitor", "Antibiotics", 640, 22.50, "BAT-2025-06", "2026-12-31", 50, "Respiratory Tract Infections, Bacterial Sinusitis", "Penicillin Allergy"),
        ("med-007", "Azithromycin 500mg", "Azithromycin", "Macrolide Antibiotic", "Antibiotics", 520, 28.00, "BAT-2025-07", "2027-03-31", 40, "Community-Acquired Pneumonia, Strep Throat", "Hepatic Dysfunction"),
        ("med-008", "Pantoprazole Sodium 40mg", "Pantoprazole", "Proton Pump Inhibitor (PPI)", "Medications", 2100, 7.00, "BAT-2025-08", "2027-12-31", 150, "GERD, Peptic Ulcer Disease", "Hypersensitivity to substituted benzimidazoles"),
        ("med-009", "Ceftriaxone Sodium 1g Vial", "Ceftriaxone", "Third-generation Cephalosporin", "Injectables", 420, 65.00, "BAT-2025-09", "2026-10-31", 30, "Severe Sepsis, Meningitis, Post-Op Prophylaxis", "Neonates with Hyperbilirubinemia"),
        ("med-010", "Paracetamol 650mg", "Acetaminophen", "Analgesic & Antipyretic", "Medications", 3500, 2.00, "BAT-2025-10", "2028-05-31", 200, "Mild to Moderate Pain, Pyrexia", "Severe Hepatic Impairment"),
        ("med-011", "Salbutamol 100mcg Inhaler", "Albuterol", "Beta-2 Agonist Bronchodilator", "Medications", 410, 110.00, "BAT-2025-11", "2027-04-30", 50, "Bronchial Asthma, COPD Exacerbation", "Tachyarrhythmias"),
        ("med-012", "Insulin Glargine 100 IU/mL Pen", "Insulin Glargine", "Long-Acting Basal Insulin", "Injectables", 290, 480.00, "BAT-2025-12", "2026-09-30", 25, "Type-1 & Type-2 Diabetes Mellitus", "Hypoglycemia episodes"),
        ("med-013", "Cholecalciferol (Vitamin D3) 60k IU", "Vitamin D3", "Fat-Soluble Vitamin", "Supplements", 1650, 18.00, "BAT-2025-13", "2028-01-31", 100, "Vitamin D Deficiency, Osteoporosis", "Hypercalcemia"),
        ("med-014", "Methylcobalamin & B-Complex", "Vitamin B12 + B6", "Neurotropic Vitamin Complex", "Supplements", 1900, 11.50, "BAT-2025-14", "2028-02-28", 100, "Diabetic Peripheral Neuropathy, Fatigue", "Known cobalt allergy"),
        ("med-015", "Enoxaparin Sodium 40mg Prefilled", "Low Molecular Weight Heparin", "Anticoagulant", "Injectables", 310, 240.00, "BAT-2025-15", "2026-11-30", 20, "DVT Prophylaxis, Acute Coronary Syndrome", "Active major bleeding")
    ]

    # Expand to 100+ medicine entries
    for i in range(16, 105):
        base_med = random.choice(medicine_catalog)
        m_id = f"med-{i:03d}"
        m_name = f"{base_med[1]} (Batch {i})"
        cursor.execute("SELECT item_id FROM pharmacy_inventory WHERE item_id = ?", (m_id,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO pharmacy_inventory (item_id, medicine_name, generic_name, drug_class, category, stock_quantity, unit_price, batch_no, expiry_date, reorder_level, status, indications, contraindications, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'In Stock', ?, ?, ?)
            """, (m_id, m_name, base_med[2], base_med[3], base_med[4], random.randint(150, 2500), base_med[6], f"BAT-2025-{i:02d}", "2027-12-31", 60, base_med[10], base_med[11], now_iso))

    for m in medicine_catalog:
        cursor.execute("SELECT item_id FROM pharmacy_inventory WHERE item_id = ?", (m[0],))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO pharmacy_inventory (item_id, medicine_name, generic_name, drug_class, category, stock_quantity, unit_price, batch_no, expiry_date, reorder_level, status, indications, contraindications, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'In Stock', ?, ?, ?)
            """, (m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], now_iso))

    # F. Seed 10 Detailed Deep Patient Profiles (matching screenshot & core test cases)
    deep_patients = [
        {
            "id": "pat-001", "name": "Priya Sharma", "age": 32, "gender": "Female", "blood": "B+", "visit": "Viral Fever & Upper Respiratory Cough",
            "risk": "Low", "status": "In Progress", "adm": "Outpatient", "bed": "OPD-Bed 04", "doc_id": "doc-001", "doc_name": "Dr. Aditi Sharma", "spec": "General Medicine & Cardiology", "nurse": "Nurse Sarah Jenkins",
            "allergies": ["penicillin"], "conditions": ["Mild Seasonal Rhinitis"], "meds": ["Paracetamol 650mg", "Cetirizine 10mg"],
            "score": 78, "heart": "Good (72 bpm)", "bp": "Normal (120/80 mmHg)", "sugar": "Normal (95 mg/dL)", "bmi": 22.4, "sleep": "7.5 hrs Good", "contact": "+91 98112 34567",
            "med_schedule": [
                ("Paracetamol 650mg", "1 Tablet", "08:00 AM (Morning)", "After Food"),
                ("Vitamin C & Zinc", "1 Tablet", "01:00 PM (Afternoon)", "After Food"),
                ("Cetirizine 10mg", "1 Tablet", "09:00 PM (Night)", "Before Sleep")
            ]
        },
        {
            "id": "pat-002", "name": "Rohit Verma", "age": 45, "gender": "Male", "blood": "O+", "visit": "Essential Hypertension & Morning Cephalea",
            "risk": "High", "status": "Review", "adm": "Inpatient (Ward A)", "bed": "Ward A - Bed 12", "doc_id": "doc-001", "doc_name": "Dr. Aditi Sharma", "spec": "Cardiology", "nurse": "Nurse Sunita Deshmukh",
            "allergies": [], "conditions": ["Stage-2 Hypertension", "Mild Hyperuricemia"], "meds": ["Amlodipine 5mg", "Telmisartan 40mg"],
            "score": 64, "heart": "Tachycardia (88 bpm)", "bp": "Elevated (148/92 mmHg)", "sugar": "Borderline (112 mg/dL)", "bmi": 27.8, "sleep": "5.5 hrs Poor", "contact": "+91 98223 45678",
            "med_schedule": [
                ("Amlodipine 5mg", "1 Tablet", "08:00 AM (Morning)", "Before Breakfast"),
                ("Telmisartan 40mg", "1 Tablet", "08:00 PM (Night)", "After Dinner")
            ]
        },
        {
            "id": "pat-003", "name": "Ananya Singh", "age": 28, "gender": "Female", "blood": "A+", "visit": "Type-2 Diabetes Screening & Fatigue",
            "risk": "Moderate", "status": "Completed", "adm": "Outpatient", "bed": "OPD-Bed 08", "doc_id": "doc-002", "doc_name": "Dr. Rajesh Kumar", "spec": "Endocrinology", "nurse": "Nurse Deepa Nair",
            "allergies": [], "conditions": ["Early-Onset Type-2 Diabetes"], "meds": ["Metformin 500mg"],
            "score": 72, "heart": "Normal (76 bpm)", "bp": "Normal (118/78 mmHg)", "sugar": "High (168 mg/dL)", "bmi": 24.1, "sleep": "6.8 hrs Moderate", "contact": "+91 98334 56789",
            "med_schedule": [
                ("Metformin 500mg", "1 Tablet", "08:00 AM (Morning)", "With Meals"),
                ("Metformin 500mg", "1 Tablet", "08:00 PM (Night)", "With Meals")
            ]
        },
        {
            "id": "pat-004", "name": "Vikram Patel", "age": 54, "gender": "Male", "blood": "AB+", "visit": "Annual Executive Health Checkup & Dyslipidemia",
            "risk": "Low", "status": "Completed", "adm": "Outpatient", "bed": "OPD-Bed 02", "doc_id": "doc-001", "doc_name": "Dr. Aditi Sharma", "spec": "General Medicine", "nurse": "Nurse Sarah Jenkins",
            "allergies": [], "conditions": ["Hyperlipidemia"], "meds": ["Atorvastatin 10mg"],
            "score": 84, "heart": "Excellent (68 bpm)", "bp": "Normal (122/82 mmHg)", "sugar": "Optimal (92 mg/dL)", "bmi": 25.2, "sleep": "8.0 hrs Excellent", "contact": "+91 98445 67890",
            "med_schedule": [
                ("Atorvastatin 10mg", "1 Tablet", "09:00 PM (Night)", "After Dinner")
            ]
        },
        {
            "id": "pat-005", "name": "Neha Kapoor", "age": 37, "gender": "Female", "blood": "O-", "visit": "Thyroid Nodular Checkup & Weight Fluctuation",
            "risk": "Moderate", "status": "In Progress", "adm": "Outpatient", "bed": "OPD-Bed 11", "doc_id": "doc-003", "doc_name": "Dr. Priya Nair", "spec": "Pulmonology & General", "nurse": "Nurse Anupama Rao",
            "allergies": ["sulfa"], "conditions": ["Primary Hypothyroidism"], "meds": ["Levothyroxine 50mcg"],
            "score": 70, "heart": "Normal (70 bpm)", "bp": "Normal (116/76 mmHg)", "sugar": "Normal (94 mg/dL)", "bmi": 23.5, "sleep": "6.8 hrs Moderate", "contact": "+91 98556 78901",
            "med_schedule": [
                ("Levothyroxine 50mcg", "1 Tablet", "06:30 AM (Early Morning)", "Empty Stomach with Water")
            ]
        },
        {
            "id": "pat-006", "name": "Rajesh Gupta", "age": 62, "gender": "Male", "blood": "B+", "visit": "Chronic Bronchial Asthma & Dyspnea on Exertion",
            "risk": "High", "status": "In Progress", "adm": "Inpatient (Ward B)", "bed": "Ward B - Bed 05", "doc_id": "doc-003", "doc_name": "Dr. Priya Nair", "spec": "Pulmonology", "nurse": "Nurse Blessy Mathew",
            "allergies": ["aspirin", "nsaids"], "conditions": ["Chronic Asthma", "GERD"], "meds": ["Salbutamol Inhaler", "Pantoprazole 40mg"],
            "score": 58, "heart": "Elevated (84 bpm)", "bp": "Normal (126/84 mmHg)", "sugar": "Normal (102 mg/dL)", "bmi": 26.4, "sleep": "5.0 hrs Interrupted", "contact": "+91 98667 89012",
            "med_schedule": [
                ("Pantoprazole 40mg", "1 Tablet", "07:30 AM (Morning)", "Before Breakfast"),
                ("Salbutamol Inhaler", "2 Puffs", "08:00 AM (Morning)", "As Prescribed"),
                ("Salbutamol Inhaler", "2 Puffs", "08:00 PM (Night)", "As Prescribed")
            ]
        },
        {
            "id": "pat-007", "name": "Meera Nair", "age": 41, "gender": "Female", "blood": "A-", "visit": "Migraine Headache with Visual Aura",
            "risk": "Low", "status": "Completed", "adm": "Outpatient", "bed": "OPD-Bed 06", "doc_id": "doc-004", "doc_name": "Dr. Vikram Sethi", "spec": "Neurology", "nurse": "Nurse Sarah Jenkins",
            "allergies": [], "conditions": ["Episodic Migraine"], "meds": ["Sumatriptan 50mg", "Propranolol 20mg"],
            "score": 81, "heart": "Normal (74 bpm)", "bp": "Normal (114/74 mmHg)", "sugar": "Optimal (88 mg/dL)", "bmi": 21.8, "sleep": "7.2 hrs Good", "contact": "+91 98778 90123",
            "med_schedule": [
                ("Propranolol 20mg", "1 Tablet", "08:00 AM (Morning)", "After Food"),
                ("Sumatriptan 50mg", "1 Tablet (SOS)", "On Onset of Headache", "With Water")
            ]
        },
        {
            "id": "pat-008", "name": "Arun Joshi", "age": 49, "gender": "Male", "blood": "AB-", "visit": "Post-Laparoscopic Cholecystectomy Follow-up",
            "risk": "Moderate", "status": "In Progress", "adm": "Inpatient (Post-Op)", "bed": "Post-Op Bed 03", "doc_id": "doc-001", "doc_name": "Dr. Aditi Sharma", "spec": "General Surgery", "nurse": "Nurse Preeti Paul",
            "allergies": ["erythromycin"], "conditions": ["Gallstone Disease (Post-Op)"], "meds": ["Amoxicillin-Clav 625mg", "Paracetamol 650mg"],
            "score": 68, "heart": "Normal (78 bpm)", "bp": "Normal (124/80 mmHg)", "sugar": "Normal (98 mg/dL)", "bmi": 24.8, "sleep": "6.0 hrs Post-Surgical", "contact": "+91 98889 01234",
            "med_schedule": [
                ("Amoxicillin-Clav 625mg", "1 Tablet", "08:00 AM (Morning)", "After Breakfast"),
                ("Paracetamol 650mg", "1 Tablet", "02:00 PM (Afternoon)", "After Lunch"),
                ("Amoxicillin-Clav 625mg", "1 Tablet", "08:00 PM (Night)", "After Dinner")
            ]
        },
        {
            "id": "pat-009", "name": "Sunita Rao", "age": 67, "gender": "Female", "blood": "O+", "visit": "Osteoarthritis Knee Joint & Lumbar Spondylosis",
            "risk": "Low", "status": "In Progress", "adm": "Outpatient", "bed": "OPD-Bed 09", "doc_id": "doc-001", "doc_name": "Dr. Aditi Sharma", "spec": "Orthopedics & Rheumatology", "nurse": "Nurse Mary Mathew",
            "allergies": [], "conditions": ["Bilateral Knee Osteoarthritis", "Mild Osteopenia"], "meds": ["Calcium + Vitamin D3", "Glucosamine 500mg"],
            "score": 75, "heart": "Normal (70 bpm)", "bp": "Normal (128/82 mmHg)", "sugar": "Normal (100 mg/dL)", "bmi": 26.1, "sleep": "7.0 hrs Good", "contact": "+91 98990 12345",
            "med_schedule": [
                ("Calcium + Vitamin D3", "1 Tablet", "08:30 AM (Morning)", "After Breakfast"),
                ("Glucosamine 500mg", "1 Capsule", "08:30 PM (Night)", "After Dinner")
            ]
        },
        {
            "id": "pat-010", "name": "Devendra Kumar", "age": 51, "gender": "Male", "blood": "B-", "visit": "Uncontrolled Glycemia & Metabolic Check",
            "risk": "Critical", "status": "Review", "adm": "Inpatient (ICU)", "bed": "ICU Bed 06", "doc_id": "doc-002", "doc_name": "Dr. Rajesh Kumar", "spec": "Endocrinology & Critical Care", "nurse": "Nurse Sarah Jenkins",
            "allergies": ["ciprofloxacin"], "conditions": ["Uncontrolled Diabetes", "Microalbuminuria"], "meds": ["Insulin Glargine 14 Units", "Metformin 1000mg"],
            "score": 49, "heart": "Tachycardia (92 bpm)", "bp": "Elevated (142/90 mmHg)", "sugar": "Critical (245 mg/dL)", "bmi": 29.3, "sleep": "4.5 hrs Disturbed", "contact": "+91 98123 45678",
            "med_schedule": [
                ("Metformin 1000mg", "1 Tablet", "08:00 AM (Morning)", "With Breakfast"),
                ("Metformin 1000mg", "1 Tablet", "08:00 PM (Night)", "With Dinner"),
                ("Insulin Glargine Sub-Q", "14 Units", "09:30 PM (Night)", "Bedtime Subcutaneous Injection")
            ]
        }
    ]

    for p in deep_patients:
        u_id = f"usr-{p['id']}"
        cursor.execute("SELECT user_id FROM users WHERE user_id = ?", (u_id,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO users (user_id, email, password_hash, role, full_name, specialty, department, is_active, created_at)
            VALUES (?, ?, ?, 'patient', ?, NULL, NULL, 1, ?)
            """, (u_id, f"{p['name'].lower().replace(' ', '.')}@carelens.ai", get_password_hash("Patient@123"), p["name"], now_iso))

        cursor.execute("SELECT patient_id FROM patient_profiles WHERE patient_id = ?", (p["id"],))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO patient_profiles (
                patient_id, user_id, full_name, age, gender, blood_group, reason_for_visit, risk_level, status,
                admission_status, bed_number, assigned_doctor_id, assigned_doctor_name, assigned_doctor_specialty,
                assigned_nurse_name, allergies, chronic_conditions, current_medications, emergency_contact,
                health_score, heart_health, blood_pressure_status, blood_sugar_status, bmi_value, bmi_status, sleep_quality, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p["id"], u_id, p["name"], p["age"], p["gender"], p["blood"], p["visit"], p["risk"], p["status"],
                p["adm"], p["bed"], p["doc_id"], p["doc_name"], p["spec"], p["nurse"],
                json.dumps(p["allergies"]), json.dumps(p["conditions"]), json.dumps(p["meds"]), p["contact"],
                p["score"], p["heart"], p["bp"], p["sugar"], p["bmi"], "Normal" if p["bmi"] < 25 else "Overweight", p["sleep"], now_iso
            ))

        # Seed Medication schedules for patient
        for med_item in p["med_schedule"]:
            sch_id = f"sch-{p['id']}-{random.randint(100, 999)}"
            cursor.execute("SELECT schedule_id FROM patient_med_schedules WHERE schedule_id = ?", (sch_id,))
            if not cursor.fetchone():
                cursor.execute("""
                INSERT INTO patient_med_schedules (schedule_id, patient_id, patient_name, medicine_name, dosage, timing_slot, food_relation, assigned_nurse, is_taken, notes, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'Administer as scheduled', ?)
                """, (sch_id, p["id"], p["name"], med_item[0], med_item[1], med_item[2], med_item[3], p["nurse"], now_iso))

    # G. Generate Remaining Synthetic Patients up to 1,000 Records
    patient_first_m = ["Aarav", "Kabir", "Vihaan", "Aditya", "Rohan", "Siddharth", "Manish", "Gaurav", "Nitin", "Kunal", "Rahul", "Pranav", "Ashish", "Sachin", "Sunil", "Anand", "Vinay", "Sameer", "Harsh", "Dinesh", "Karthik", "Rakesh", "Suresh", "Manoj", "Chetan"]
    patient_first_f = ["Ananya", "Ishita", "Diya", "Saanvi", "Tanvi", "Rhea", "Shreya", "Kavya", "Sneha", "Pooja", "Meera", "Swati", "Nandini", "Aparna", "Komal", "Simran", "Deepika", "Rashmi", "Varsha", "Bhavna", "Gayatri", "Sonal", "Jyoti", "Pallavi", "Divya"]
    blood_groups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
    common_reasons = [
        ("Routine Blood Pressure & Cardio Review", "Low", "Cardiology"),
        ("Type-2 Diabetes Fasting Glucose Check", "Moderate", "Endocrinology"),
        ("Seasonal Bronchitis & Wheezing", "Low", "Pulmonology"),
        ("Migraine Headache & Photophobia", "Low", "Neurology"),
        ("Knee Joint Arthralgia & Stiffness", "Low", "Orthopedics"),
        ("Acute Gastroenteritis & Dehydration", "Moderate", "Gastroenterology"),
        ("Elevated Postprandial Glycemia (210 mg/dL)", "High", "Endocrinology"),
        ("Hypertensive Urgency (158/96 mmHg)", "High", "Cardiology"),
        ("Acute Asthma Exacerbation", "High", "Pulmonology"),
        ("Chest Discomfort & Palpitations", "Critical", "Cardiology"),
        ("Post-Operative Dressing & Wound Care", "Moderate", "General Surgery"),
        ("Thyroid Nodule Ultrasound Follow-up", "Low", "Endocrinology")
    ]

    for i in range(11, 1001):
        p_id = f"pat-{i:04d}"
        u_id = f"usr-pat-{i:04d}"
        gender = random.choice(["Male", "Female"])
        fname = random.choice(patient_first_m if gender == "Male" else patient_first_f)
        lname = random.choice(last_names)
        p_name = f"{fname} {lname}"
        age = random.randint(18, 82)
        blood = random.choice(blood_groups)
        reason_tuple = random.choice(common_reasons)
        reason = reason_tuple[0]
        risk = reason_tuple[1]
        adm_status = random.choice(["Outpatient", "Outpatient", "Outpatient", "Inpatient (Ward A)", "Inpatient (Ward B)", "Inpatient (ICU)", "Inpatient (Post-Op)"])
        bed = f"Bed {random.randint(1, 40)}" if "Inpatient" in adm_status else f"OPD-Chair {random.randint(1, 20)}"
        status = random.choice(["In Progress", "In Progress", "Completed", "Review"])
        doc_choice = random.choice(seeded_doctors)
        doc_id = doc_choice[0]
        doc_name = doc_choice[1]
        doc_spec = doc_choice[2]
        nurse_name = random.choice(seeded_nurses)
        score = random.randint(52, 94) if risk == "Low" else (random.randint(60, 78) if risk == "Moderate" else random.randint(40, 62))
        contact = f"+91 98{random.randint(10000000, 99999999)}"

        cursor.execute("SELECT user_id FROM users WHERE user_id = ?", (u_id,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO users (user_id, email, password_hash, role, full_name, specialty, department, is_active, created_at)
            VALUES (?, ?, ?, 'patient', ?, NULL, NULL, 1, ?)
            """, (u_id, f"{fname.lower()}.{lname.lower()}{i}@carelens.ai", get_password_hash("Patient@123"), p_name, now_iso))

        cursor.execute("SELECT patient_id FROM patient_profiles WHERE patient_id = ?", (p_id,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO patient_profiles (
                patient_id, user_id, full_name, age, gender, blood_group, reason_for_visit, risk_level, status,
                admission_status, bed_number, assigned_doctor_id, assigned_doctor_name, assigned_doctor_specialty,
                assigned_nurse_name, allergies, chronic_conditions, current_medications, emergency_contact,
                health_score, heart_health, blood_pressure_status, blood_sugar_status, bmi_value, bmi_status, sleep_quality, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p_id, u_id, p_name, age, gender, blood, reason, risk, status,
                adm_status, bed, doc_id, doc_name, doc_spec, nurse_name,
                json.dumps([]), json.dumps([reason]), json.dumps(["Standard Multi-Care Protocol"]), contact,
                score, "Normal" if score > 70 else "Needs Care", "120/80 mmHg", "95 mg/dL", round(random.uniform(20.5, 29.5), 1), "Normal", "7.0 hrs", now_iso
            ))

    # H. Seed 20 Scheduled Surgeries & Operations
    surgery_procedures = [
        ("Coronary Artery Bypass Graft (CABG)", "OT-1 (Cardiac Suite)", "Dr. Aditi Sharma", "Dr. Gautam Mukherjee"),
        ("Total Knee Arthroplasty (TKR)", "OT-2 (Orthopedic Suite)", "Dr. Sandeep Kulkarni", "Dr. Gautam Mukherjee"),
        ("Laparoscopic Cholecystectomy", "OT-3 (General Surgery)", "Dr. Arvind Swaminathan", "Dr. Gautam Mukherjee"),
        ("Microvascular Craniotomy", "OT-4 (Neurosurgery)", "Dr. Vikram Sethi", "Dr. Gautam Mukherjee"),
        ("Lumbar Discectomy L4-L5", "OT-2 (Orthopedic Suite)", "Dr. Sandeep Kulkarni", "Dr. Gautam Mukherjee"),
        ("Percutaneous Transluminal Coronary Angioplasty (PTCA)", "OT-1 (Cath Lab)", "Dr. Aditi Sharma", "Dr. Gautam Mukherjee")
    ]
    for i in range(1, 21):
        surg_id = f"surg-{i:03d}"
        s_proc = random.choice(surgery_procedures)
        pat_name = deep_patients[i % 10]["name"]
        pat_id = deep_patients[i % 10]["id"]
        s_date = (datetime.now() + timedelta(days=random.randint(0, 4))).strftime("%Y-%m-%d")
        s_time = random.choice(["08:30 AM", "10:00 AM", "12:30 PM", "03:00 PM"])
        s_status = random.choice(["Scheduled", "Scheduled", "In Progress", "Completed"])

        cursor.execute("SELECT surgery_id FROM surgeries WHERE surgery_id = ?", (surg_id,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO surgeries (surgery_id, patient_id, patient_name, doctor_id, doctor_name, specialty, procedure_name, ot_room, scheduled_date, scheduled_time, anesthetist_name, status, created_at)
            VALUES (?, ?, ?, 'doc-001', ?, 'Surgical Specialty', ?, ?, ?, ?, ?, ?, ?)
            """, (surg_id, pat_id, pat_name, s_proc[2], s_proc[0], s_proc[1], s_date, s_time, s_proc[3], s_status, now_iso))

    # I. Seed High Risk Alerts
    alerts_to_seed = [
        ("alt-001", "pat-002", "Rohit Verma", "doc-001", "High blood pressure risk (148/92 mmHg)", "High", 0, now_iso),
        ("alt-002", "pat-003", "Ananya Singh", "doc-002", "Elevated blood sugar levels (168 mg/dL)", "Moderate", 0, now_iso),
        ("alt-003", "pat-004", "Vikram Patel", "doc-001", "Abnormal cholesterol levels (225 mg/dL)", "Moderate", 0, now_iso),
        ("alt-004", "pat-010", "Devendra Kumar", "doc-002", "Critical blood glucose alert (245 mg/dL)", "Critical", 0, now_iso)
    ]
    for alt in alerts_to_seed:
        cursor.execute("SELECT alert_id FROM high_risk_alerts WHERE alert_id = ?", (alt[0],))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO high_risk_alerts (alert_id, patient_id, patient_name, assigned_doctor_id, condition_alert, severity, is_resolved, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, alt)

    # J. Seed Appointments
    appts_to_seed = [
        ("apt-001", "pat-001", "Priya Sharma", "doc-001", "Dr. Aditi Sharma", "General Physician", "2025-04-18", "10:30 AM", "Follow-up Cough & Immunity Check", "Upcoming", now_iso),
        ("apt-002", "pat-002", "Rohit Verma", "doc-001", "Dr. Aditi Sharma", "Cardiology", "2025-04-18", "11:15 AM", "Hypertension Medication Review", "Upcoming", now_iso),
        ("apt-003", "pat-003", "Ananya Singh", "doc-002", "Dr. Rajesh Kumar", "Endocrinology", "2025-04-19", "02:00 PM", "HbA1c Lab Report Discussion", "Upcoming", now_iso),
        ("apt-004", "pat-004", "Vikram Patel", "doc-001", "Dr. Aditi Sharma", "General Physician", "2025-04-19", "03:30 PM", "Lipid Panel Review", "Upcoming", now_iso)
    ]
    for apt in appts_to_seed:
        cursor.execute("SELECT appointment_id FROM appointments WHERE appointment_id = ?", (apt[0],))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO appointments (appointment_id, patient_id, patient_name, doctor_id, doctor_name, doctor_specialty, appointment_date, appointment_time, reason, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, apt)

    conn.commit()
    print("[OK] Successfully Seeded 1,000 Synthetic Patients, 180 Doctors, 220 Nurses, 100 Hospital Staff/Sweepers, 5 Administrators, 100+ Pharmacy Medicines, and 20 Surgeries.")

# Initialize database on import
init_db()
