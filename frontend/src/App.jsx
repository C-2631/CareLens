import React, { useState } from 'react';
import ThreeBackground from './components/3d/ThreeBackground';
import LoadingScreen from './components/common/LoadingScreen';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import AuthModal from './components/auth/AuthModal';
import FloatingHealthAIAssistant from './components/common/FloatingHealthAIAssistant';

// View components
import HeroLandingView from './components/views/HeroLandingView';
import PatientDashboardView from './components/views/PatientDashboardView';
import SymptomCheckerModalView from './components/views/SymptomCheckerModalView';
import RecommendationsView from './components/views/RecommendationsView';
import HealthAnalysisView from './components/views/HealthAnalysisView';
import VitalsTrackerView from './components/views/VitalsTrackerView';
import AskHealthAIChatView from './components/views/AskHealthAIChatView';
import ClinicianQueueView from './components/views/ClinicianQueueView';
import AdminConsoleView from './components/views/AdminConsoleView';

import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero'); // 'hero', 'dashboard', 'symptoms', 'recommendations', 'analysis', 'vitals', 'chat', 'doctor-platform', 'admin-platform'
  const [selectedPatientId, setSelectedPatientId] = useState('pat-001');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const { isDark } = useTheme();

  const handleSelectPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setActiveTab('dashboard');
  };

  return (
    <>
      {/* 1. Soft Launching & Loading Splash Screen */}
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}

      {/* 2. Interactive 3D WebGL Background Canvas */}
      <ThreeBackground />

      {/* 3. Main Fullscreen Application Shell (1920x1080 Widescreen) */}
      <div className="relative min-h-screen z-10 flex flex-col transition-colors duration-300 bg-transparent">
        {/* Top Navbar with Live Global Search */}
        <Navbar
          onOpenAuth={() => setAuthModalOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSelectPatient={handleSelectPatient}
        />

        {/* Full-Width Body Layout without restricting max-w-7xl */}
        <div className="flex-1 flex w-full">
          {/* Collapsible Sidebar (active on all views except hero landing) */}
          {activeTab !== 'hero' && (
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          )}

          {/* Main Dynamic View Content */}
          <main className="flex-1 w-full min-w-0 overflow-y-auto">
            {activeTab === 'hero' && (
              <HeroLandingView
                setActiveTab={setActiveTab}
                onOpenAuth={() => setAuthModalOpen(true)}
                onSelectPatient={handleSelectPatient}
              />
            )}

            {activeTab === 'dashboard' && (
              <PatientDashboardView
                setActiveTab={setActiveTab}
                selectedPatientId={selectedPatientId}
                setSelectedPatientId={setSelectedPatientId}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {activeTab === 'symptoms' && (
              <SymptomCheckerModalView
                onNavigateToRecos={(disease) => setActiveTab('recommendations')}
              />
            )}

            {activeTab === 'recommendations' && (
              <RecommendationsView />
            )}

            {activeTab === 'analysis' && (
              <HealthAnalysisView />
            )}

            {activeTab === 'vitals' && (
              <VitalsTrackerView />
            )}

            {activeTab === 'chat' && (
              <AskHealthAIChatView onNavigateTab={(tab) => setActiveTab(tab)} />
            )}

            {(activeTab === 'doctor-platform' || activeTab === 'review-queue') && (
              <ClinicianQueueView
                setActiveTab={setActiveTab}
                onSelectPatient={handleSelectPatient}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {(activeTab === 'admin-platform' || activeTab === 'admin-console') && (
              <AdminConsoleView
                setActiveTab={setActiveTab}
                onSelectPatient={handleSelectPatient}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}
          </main>
        </div>

        {/* 3-Role Login/Register Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />

        {/* Omnipresent Floating HealthAI Clinical Assistant */}
        <FloatingHealthAIAssistant onNavigateTab={setActiveTab} />
      </div>
    </>
  );
}
