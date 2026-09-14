import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('carelens_user');
    return saved ? JSON.parse(saved) : {
      user_id: 'usr-pat-001',
      email: 'priya@carelens.ai',
      role: 'patient', // 'patient', 'doctor', 'nurse', 'admin'
      full_name: 'Priya Sharma',
      patient_id: 'pat-001',
      specialty: null
    };
  });
  const [token, setToken] = useState(() => localStorage.getItem('carelens_token') || 'mock-token');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      const userData = {
        user_id: data.user_id,
        email: data.email,
        role: data.role,
        full_name: data.full_name,
        patient_id: data.role === 'patient' ? 'pat-001' : null
      };
      setToken(data.access_token);
      setUser(userData);
      localStorage.setItem('carelens_token', data.access_token);
      localStorage.setItem('carelens_user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('carelens_token');
    localStorage.removeItem('carelens_user');
  };

  // Instant Persona Switcher
  const switchRole = (personaKey) => {
    let targetUser;
    if (personaKey === 'doctor' || personaKey === 'aditi') {
      targetUser = {
        user_id: 'usr-doc-001',
        email: 'aditi.sharma@carelens.ai',
        role: 'doctor',
        full_name: 'Dr. Aditi Sharma',
        specialty: 'General Medicine & Cardiology',
        department: 'General Medicine',
        patient_id: null
      };
    } else if (personaKey === 'doctor_rajesh' || personaKey === 'rajesh') {
      targetUser = {
        user_id: 'usr-doc-002',
        email: 'rajesh.kumar@carelens.ai',
        role: 'doctor',
        full_name: 'Dr. Rajesh Kumar',
        specialty: 'Endocrinology & Diabetology',
        department: 'Endocrinology',
        patient_id: null
      };
    } else if (personaKey === 'nurse' || personaKey === 'staff') {
      targetUser = {
        user_id: 'usr-nurse-001',
        email: 'nurse.sarah@carelens.ai',
        role: 'nurse',
        full_name: 'Nurse Sarah Jenkins',
        specialty: 'Clinical Care & Triage',
        department: 'Inpatient Ward',
        patient_id: null
      };
    } else if (personaKey === 'admin') {
      targetUser = {
        user_id: 'usr-adm-001',
        email: 'admin@carelens.ai',
        role: 'admin',
        full_name: 'Admin',
        specialty: 'System Administrator',
        department: 'IT & Informatics',
        patient_id: null
      };
    } else {
      targetUser = {
        user_id: 'usr-pat-001',
        email: 'priya@carelens.ai',
        role: 'patient',
        full_name: 'Priya Sharma',
        patient_id: 'pat-001',
        specialty: null
      };
    }
    setUser(targetUser);
    localStorage.setItem('carelens_user', JSON.stringify(targetUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      switchRole,
      isAuthenticated: !!user,
      isPatient: user?.role === 'patient' || user?.role === 'user',
      isDoctor: user?.role === 'doctor' || user?.role === 'staff',
      isNurse: user?.role === 'nurse',
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
