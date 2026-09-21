import React, { useState } from 'react';
import ThreeBackground from './components/3d/ThreeBackground';
import LoadingScreen from './components/common/LoadingScreen';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import AuthModal from './components/auth/AuthModal';
import FloatingHealthAIAssistant from './components/common/FloatingHealthAIAssistant';
import ErrorBoundary from './components/common/ErrorBoundary';

// View components
import RecommendationStudioView from './components/views/RecommendationStudioView';
import WhatIfSimulatorView from './components/views/WhatIfSimulatorView';
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
  const [activeTab, setActiveTab] = useState('recommendation-studio'); // Defaults to AI Recommendation Studio
  const [selectedPatientId, setSelectedPatientId] = useState('pat-001');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const { isDark } = useTheme();

  const handleSelectPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setActiveTab('dashboard');
  };

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'recommendation-studio':
        return <RecommendationStudioView onOpenBooking={() => setActiveTab('hero')} />;

      case 'what-if-simulator':
        return <WhatIfSimulatorView onOpenBooking={() => setActiveTab('hero')} />;

      case 'hero':
      case 'home':
      case 'landing':
        return (
          <HeroLandingView
            setActiveTab={setActiveTab}
            onOpenAuth={() => setAuthModalOpen(true)}
            onSelectPatient={handleSelectPatient}
          />
        );

      case 'dashboard':
      case 'patient-dashboard':
        return (
          <PatientDashboardView
            setActiveTab={setActiveTab}
            selectedPatientId={selectedPatientId}
            setSelectedPatientId={setSelectedPatientId}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        );

      case 'symptoms':
      case 'symptom-checker':
        return (
          <SymptomCheckerModalView
            onNavigateToRecos={(disease) => setActiveTab('recommendations')}
          />
        );

      case 'recommendations':
        return <RecommendationsView />;

      case 'analysis':
        return <HealthAnalysisView />;

      case 'vitals':
        return <VitalsTrackerView />;

      case 'chat':
        return <AskHealthAIChatView onNavigateTab={(tab) => setActiveTab(tab)} />;

      case 'doctor-platform':
      case 'review-queue':
      case 'doctor-dashboard':
      case 'clinician-station':
        return (
          <ClinicianQueueView
            setActiveTab={setActiveTab}
            onSelectPatient={handleSelectPatient}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        );

      case 'admin-platform':
      case 'admin-console':
      case 'admin-dashboard':
        return (
          <AdminConsoleView
            setActiveTab={setActiveTab}
            onSelectPatient={handleSelectPatient}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        );

      default:
        // Graceful fallback: Never show blank page
        return <RecommendationStudioView onOpenBooking={() => setActiveTab('hero')} />;
    }
  };

  return (
    <ErrorBoundary onNavigateHome={() => setActiveTab('recommendation-studio')}>
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
          {activeTab !== 'hero' && activeTab !== 'home' && activeTab !== 'landing' && (
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          )}

          {/* Main Dynamic View Content */}
          <main className="flex-1 w-full min-w-0 overflow-y-auto">
            <ErrorBoundary onNavigateHome={() => setActiveTab('recommendation-studio')}>
              {renderCurrentView()}
            </ErrorBoundary>
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
    </ErrorBoundary>
  );
}

