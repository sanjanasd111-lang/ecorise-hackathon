import React, { useEffect, useRef, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EcoProvider, useEco } from './context/EcoContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';
import { DemoControls } from './components/ui/DemoControls';
import { ChampionModal } from './components/modals/ChampionModal';
import { ShareCardModal } from './components/modals/ShareCardModal';
import { CertificateModal } from './components/modals/CertificateModal';
import { initAmbientLeaves } from './lib/confetti';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { ImpactPage } from './pages/ImpactPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { EcoPulsePage } from './pages/EcoPulsePage';
import { CivicImpactPage } from './pages/CivicImpactPage';
import { CalendarPage } from './pages/CalendarPage';
import { WeeklyReportPage } from './pages/WeeklyReportPage';
import { ProfilePage } from './pages/ProfilePage';
import { SDG13Page } from './pages/SDG13Page';

const AppContent: React.FC = () => {
  const { user, profile, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize ambient floating leaves
  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = initAmbientLeaves(canvasRef.current);
      return cleanup;
    }
  }, []);

  // Handle default tab for authenticated & unauthenticated users
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (!profile?.city || profile.city === 'Local Community') {
          // If onboarding wasn't completed
          setCurrentTab('dashboard');
        } else if (currentTab === 'landing' || currentTab === 'login' || currentTab === 'signup') {
          setCurrentTab('dashboard');
        }
      } else {
        // When logged out, automatically redirect protected tabs to landing page
        const protectedTabs = [
          'dashboard', 
          'challenges', 
          'intelligence', 
          'impact', 
          'achievements', 
          'leaderboard',
          'ecopulse', 
          'civic', 
          'calendar', 
          'weekly-report', 
          'profile'
        ];
        if (protectedTabs.includes(currentTab)) {
          setCurrentTab('landing');
        }
      }
    }
  }, [user, isLoading, currentTab, profile?.city]);

  // Protected route guard
  const handleTabChange = (tab: string) => {
    const protectedTabs = [
      'dashboard', 
      'challenges', 
      'intelligence', 
      'impact', 
      'achievements', 
      'leaderboard',
      'ecopulse', 
      'civic', 
      'calendar', 
      'weekly-report', 
      'profile'
    ];
    if (!user && protectedTabs.includes(tab)) {
      setCurrentTab('login');
    } else {
      setCurrentTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-eco-50/40 dark:bg-forest-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors relative selection:bg-emerald-500 selection:text-white">
      
      {/* Ambient background particles & leaves */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-3xl" />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      </div>

      {/* Top Navbar */}
      <Navbar currentTab={currentTab} onSelectTab={handleTabChange} />

      {/* Main Page Routing Container */}
      <main className="flex-1 relative z-10">
        {currentTab === 'landing' && (
          <LandingPage
            onGetStarted={() => user ? setCurrentTab('dashboard') : setCurrentTab('signup')}
            onSignIn={() => setCurrentTab('login')}
            onExploreSDG13={() => setCurrentTab('sdg13')}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onSuccess={() => setCurrentTab('dashboard')}
            onGoToSignup={() => setCurrentTab('signup')}
            onForgotPassword={() => setCurrentTab('forgot-password')}
          />
        )}

        {currentTab === 'signup' && (
          <SignupPage
            onSuccess={() => setCurrentTab('onboarding')}
            onGoToLogin={() => setCurrentTab('login')}
          />
        )}

        {currentTab === 'forgot-password' && (
          <ForgotPasswordPage
            onBackToLogin={() => setCurrentTab('login')}
          />
        )}

        {currentTab === 'onboarding' && (
          <OnboardingPage
            onComplete={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage onNavigateToTab={handleTabChange} />
        )}

        {currentTab === 'challenges' && (
          <ChallengesPage />
        )}

        {currentTab === 'intelligence' && (
          <IntelligencePage />
        )}

        {currentTab === 'impact' && (
          <ImpactPage />
        )}

        {currentTab === 'achievements' && (
          <AchievementsPage />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardPage />
        )}

        {currentTab === 'community' && (
          <LeaderboardPage />
        )}

        {currentTab === 'ecopulse' && (
          <EcoPulsePage />
        )}

        {currentTab === 'civic' && (
          <CivicImpactPage />
        )}

        {currentTab === 'calendar' && (
          <CalendarPage />
        )}

        {currentTab === 'weekly-report' && (
          <WeeklyReportPage />
        )}

        {currentTab === 'profile' && (
          <ProfilePage onSignOutSuccess={() => setCurrentTab('landing')} />
        )}

        {currentTab === 'sdg13' && (
          <SDG13Page />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleTabChange} />

      {/* Floating Demo Controls (in bottom right / side dock - NOT top purple bar) */}
      <DemoControls />

      {/* Toast Notification Container */}
      <Toast />

      {/* Climate Champion Grand Modal */}
      <ChampionModal onNavigateToImpact={() => handleTabChange('impact')} />

      {/* Global Shareable Eco Card Modal */}
      <ShareCardModal />

      {/* Global Civic Recognition Digital Certificate Modal */}
      <CertificateModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <EcoProvider>
        <AppContent />
      </EcoProvider>
    </AuthProvider>
  );
};

export default App;
