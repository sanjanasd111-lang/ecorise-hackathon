import React, { useState } from 'react';
import { useEco } from '../../context/EcoContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Volume2, VolumeX, Menu, X, User, LogOut, Share2, Award, ChevronDown } from 'lucide-react';
import { EcoByte } from '../mascot/EcoByte';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { 
    totalPoints, 
    streak, 
    theme, 
    toggleTheme, 
    soundEnabled, 
    toggleSound, 
    levelInfo, 
    openShareModal, 
    openCertificateModal 
  } = useEco();
  const { user, profile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Authenticated user navigation - Primary (Always visible on desktop lg+)
  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'ecopulse', label: 'EcoPulse' },
    { id: 'impact', label: 'My Impact' },
    { id: 'leaderboard', label: 'Leaderboard' }
  ];

  // Secondary items (Inside "More ▾" dropdown on laptops, or expanded on 2xl)
  const secondaryNavItems = [
    { id: 'achievements', label: 'Achievements', icon: '🏅' },
    { id: 'civic', label: 'Civic Impact', icon: '🏛️' },
    { id: 'sdg13', label: 'About SDG 13', icon: '🌍' },
    { id: 'intelligence', label: 'Intelligence', icon: '📊' }
  ];

  // All 8 auth nav items for mobile and 2xl screens
  const allAuthNavItems = [
    ...primaryNavItems,
    ...secondaryNavItems.slice(0, 3)
  ];

  // Public visitor navigation
  const publicNavItems = [
    { id: 'landing', label: 'Home' },
    { id: 'ecopulse', label: 'EcoPulse' },
    { id: 'civic', label: 'Civic Impact' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'sdg13', label: 'About SDG 13' }
  ];

  // Check if currentTab is one of the secondary items
  const activeSecondaryItem = secondaryNavItems.find(item => item.id === currentTab);

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    await signOut();
    onSelectTab('landing');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-forest-900/95 backdrop-blur-md border-b border-emerald-500/15 dark:border-emerald-500/20 transition-colors">
      {/* Click-outside backdrop for open dropdowns */}
      {(isUserMenuOpen || isMoreMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => { setIsUserMenuOpen(false); setIsMoreMenuOpen(false); }}
        />
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo - Clicking routes to dashboard if logged in, landing if signed out */}
          <button 
            onClick={() => handleNavClick(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 text-left group focus:outline-none flex-shrink-0 cursor-pointer"
            aria-label="EcoRise 2.0 Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-display font-black text-lg tracking-tight text-emerald-950 dark:text-emerald-50 leading-none">
                EcoRise <span className="text-emerald-600 dark:text-emerald-400">2.0</span>
              </span>
              <span className="text-[9px] uppercase font-black tracking-wider text-emerald-600/90 dark:text-emerald-400/90 mt-0.5">
                SDG 13 Platform
              </span>
            </div>
          </button>

          {/* Desktop Navigation for Authenticated Users */}
          {user ? (
            <>
              {/* Standard Laptops (1024px to 1439px): 5 Primary Tabs + 'More ▾' Dropdown */}
              <nav className="hidden lg:flex 2xl:hidden items-center gap-1">
                {primaryNavItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`h-8 flex items-center px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      currentTab === item.id
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 shadow-sm border border-emerald-500/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-forest-800/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                {/* More ▾ Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsMoreMenuOpen(prev => !prev)}
                    className={`h-8 flex items-center gap-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeSecondaryItem
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 shadow-sm border border-emerald-500/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-forest-800/40'
                    }`}
                  >
                    <span>{activeSecondaryItem ? activeSecondaryItem.label : 'More'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isMoreMenuOpen && (
                    <div className="absolute left-0 top-10 w-48 bg-white dark:bg-forest-900 border border-emerald-500/25 rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn">
                      {secondaryNavItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                            currentTab === item.id
                              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-800'
                          }`}
                        >
                          <span className="text-sm">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </nav>

              {/* Extra Wide Screens (>= 1440px): Show All 8 Tabs */}
              <nav className="hidden 2xl:flex items-center gap-1">
                {allAuthNavItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`h-8 flex items-center px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      currentTab === item.id
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 shadow-sm border border-emerald-500/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-forest-800/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </>
          ) : (
            /* Public Desktop Navigation */
            <nav className="hidden lg:flex items-center gap-1">
              {publicNavItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`h-8 flex items-center px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    currentTab === item.id
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60'
                      : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right Header Status Pills & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {user ? (
              <>
                {/* Live Points Pill */}
                <div 
                  className="h-8 inline-flex items-center gap-1 px-2.5 rounded-full text-xs font-black bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 shadow-sm flex-shrink-0"
                  title="Your live total Eco Points"
                >
                  <span className="text-emerald-600 dark:text-emerald-400">🌱</span>
                  <span>{totalPoints} pts</span>
                </div>

                {/* Streak Pill - Hidden on small tablet/narrow screens, visible on md+ */}
                <div 
                  className="h-8 hidden md:inline-flex items-center gap-1 px-2 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950/40 border border-amber-500/25 text-amber-700 dark:text-amber-400 shadow-sm flex-shrink-0"
                  title="Your active eco streak"
                >
                  <span>🔥</span>
                  <span>{streak}d</span>
                </div>

                {/* Mini Mascot Companion Avatar */}
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-8 h-8 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-forest-800 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform flex-shrink-0 cursor-pointer"
                  title={`EcoByte (Stage ${levelInfo.stage}: ${levelInfo.title})`}
                  aria-label="View EcoByte Companion"
                >
                  <EcoByte stage={levelInfo.stage} size={26} interactive={false} />
                </button>
              </>
            ) : null}

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="w-8 h-8 rounded-xl border border-gray-200 dark:border-forest-800 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-forest-800 transition-colors flex-shrink-0 cursor-pointer"
              title={soundEnabled ? "Mute sounds" : "Enable sounds"}
              aria-label="Toggle Sound Effects"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-xl border border-gray-200 dark:border-forest-800 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-forest-800 transition-colors flex-shrink-0 cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* User Profile / Auth Controls */}
            {user ? (
              <div className="relative flex items-center">
                <button
                  onClick={() => setIsUserMenuOpen(prev => !prev)}
                  className="h-8 flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-emerald-500/30 transition-all focus:outline-none cursor-pointer"
                  aria-label="User menu"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-black uppercase shadow-sm">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-11 w-52 bg-white dark:bg-forest-900 border border-emerald-500/25 rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-forest-800">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Signed in as</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{profile?.full_name || 'Eco Pioneer'}</p>
                      <p className="text-[11px] text-gray-400 truncate">{profile?.city || 'Local Community'}</p>
                    </div>
                    
                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-800 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>Profile & Settings</span>
                    </button>

                    <button
                      onClick={() => { openShareModal(); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-emerald-600" />
                      <span>Share Eco Card</span>
                    </button>

                    <button
                      onClick={() => { openCertificateModal(); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Civic Certificate</span>
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 border-t border-gray-100 dark:border-forest-800 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick('login')}
                  className="h-8 px-3 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-forest-800 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="h-8 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm transition-all cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Drawer Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="lg:hidden w-8 h-8 rounded-lg border border-gray-200 dark:border-forest-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-800 transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-emerald-500/15 dark:border-emerald-500/20 flex flex-col gap-1 animate-fadeIn">
            {(user ? allAuthNavItems : publicNavItems).map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  currentTab === item.id
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 font-black'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-800/40'
                }`}
              >
                <span>{item.label}</span>
                {currentTab === item.id && <span className="text-emerald-600">●</span>}
              </button>
            ))}

            {user && (
              <div className="pt-2 mt-2 border-t border-gray-100 dark:border-forest-800 flex flex-col gap-1">
                <button
                  onClick={() => { openShareModal(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Eco Card</span>
                </button>

                <button
                  onClick={() => { openCertificateModal(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Civic Certificate</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

