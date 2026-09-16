import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEco } from '../context/EcoContext';
import { useChallenges } from '../hooks/useChallenges';
import { EcoByteCoach } from '../components/mascot/EcoByteCoach';
import { ThreeDayMissionCard } from '../components/challenges/ThreeDayMissionCard';
import { StreakTracker } from '../components/ui/StreakTracker';
import { CO2ComparisonCard } from '../components/co2/CO2ComparisonCard';
import { CO2TrendChart } from '../components/co2/CO2TrendChart';
import { CO2ReductionTips } from '../components/co2/CO2ReductionTips';
import { WhatIfSimulatorCard } from '../components/co2/WhatIfSimulatorCard';
import { ClimateJourneyCard } from '../components/journey/ClimateJourneyCard';
import { WeeklyProgressCard } from '../components/dashboard/WeeklyProgressCard';
import { ChallengeCard } from '../components/dashboard/ChallengeCard';
import { EcoBossCard } from '../components/dashboard/EcoBossCard';
import { StreakShieldCard } from '../components/dashboard/StreakShieldCard';
import { LocalRankCard } from '../components/community/LocalRankCard';
import { LeaderboardPodium } from '../components/community/LeaderboardPodium';
import { ParticipantBadges } from '../components/badges/ParticipantBadges';
import { GreenMobilityCard } from '../components/mobility/GreenMobilityCard';
import { EcoPulseCard } from '../components/ecopulse/EcoPulseCard';
import { WeeklyChart } from '../components/analytics/WeeklyChart';
import { ResetModal } from '../components/modals/ResetModal';
import { api } from '../lib/api';
import { 
  Search, 
  RotateCcw, 
  Share2, 
  Award, 
  ArrowDown, 
  Sparkles, 
  TreePine, 
  Droplet, 
  Wind, 
  ExternalLink,
  Flame,
  Shield,
  TrendingDown
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateToTab?: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateToTab }) => {
  const { user, profile } = useAuth();
  const { 
    totalPoints, 
    weeklyPoints, 
    weeklyGoal,
    streak, 
    streakShields,
    levelInfo, 
    badges, 
    civicRecognition,
    impactEquivalents,
    openShareModal, 
    openCertificateModal 
  } = useEco();

  const { 
    challenges, 
    allChallenges, 
    completedTodayIds, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery 
  } = useChallenges();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Backend Synchronized State
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [co2Data, setCo2Data] = useState<any>(null);

  const fetchBackendData = async () => {
    try {
      const [dashRes, co2Res] = await Promise.allSettled([
        api.dashboard.get(),
        api.co2.getProfile()
      ]);

      if (dashRes.status === 'fulfilled') {
        setDashboardData(dashRes.value);
      }
      if (co2Res.status === 'fulfilled') {
        setCo2Data(co2Res.value);
      }
    } catch (err) {
      console.warn('Dashboard live fetch fallback to local context:', err);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  const categories = [
    { key: 'all', label: 'All Challenges' },
    { key: 'energy', label: 'Energy' },
    { key: 'water', label: 'Water' },
    { key: 'transport', label: 'Transport' },
    { key: 'waste', label: 'Waste' },
    { key: 'nature', label: 'Nature' }
  ];

  const scrollToActions = () => {
    const el = document.getElementById('eco-actions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Coalesce backend metrics with context fallback
  const effectivePoints = dashboardData?.user?.ecoPoints !== undefined ? dashboardData.user.ecoPoints : totalPoints;
  const effectiveStreak = dashboardData?.user?.streak !== undefined ? dashboardData.user.streak : streak;
  const effectiveShields = dashboardData?.user?.shields !== undefined ? dashboardData.user.shields : streakShields;

  const effectiveCO2Metrics = co2Data?.metrics || dashboardData?.metrics || {
    baselineWeeklyCO2e: 18.5,
    currentWeeklyCO2e: 15.2,
    reductionKg: 3.3,
    reductionPct: 18,
    annualKgSaved: 171.6,
    treeSeedlingsEquiv: 8.2,
    smartphoneChargesEquiv: 402
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* 1. DASHBOARD HEADER & QUICK STAT PILLS */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SDG 13: Local Climate Action Platform</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-gray-900 dark:text-emerald-50 tracking-tight">
              Your Climate Action Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1 font-medium">
              Welcome back, <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{user?.name || profile?.full_name || 'Eco Pioneer'}</strong>! Every verified choice drives collective impact.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
            <button
              onClick={openShareModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              title="Download your shareable eco card"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Eco Card</span>
            </button>

            <button
              onClick={openCertificateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 dark:bg-amber-400/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-all cursor-pointer"
              title="View your official civic certificate"
            >
              <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Civic Certificate</span>
            </button>

            <button
              onClick={() => setIsResetModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-forest-800 hover:border-red-400 dark:hover:border-red-800 text-gray-500 dark:text-gray-400 hover:text-red-600 text-xs font-bold transition-colors cursor-pointer"
              title="Reset weekly demo progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Week</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Pills Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Eco Points */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-forest-900/80 border border-emerald-500/20 backdrop-blur-sm shadow-sm hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-xl flex-shrink-0">
              ⚡
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 truncate">Eco Points</div>
              <div className="text-lg font-black text-gray-900 dark:text-emerald-100">{effectivePoints} pts</div>
            </div>
          </div>

          {/* Current Streak & Eco Shield */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-forest-900/80 border border-emerald-500/20 backdrop-blur-sm shadow-sm hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-500/20 flex items-center justify-center text-xl flex-shrink-0">
              🔥
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 truncate">Active Streak</div>
              <div className="text-lg font-black text-amber-600 dark:text-amber-300">
                {effectiveStreak} {effectiveStreak === 1 ? 'Day' : 'Days'} 🛡️{effectiveShields}
              </div>
            </div>
          </div>

          {/* Local Rank */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-forest-900/80 border border-emerald-500/20 backdrop-blur-sm shadow-sm hover:border-sky-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-500/20 flex items-center justify-center text-xl flex-shrink-0">
              🏙️
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 truncate">City Cohort</div>
              <div className="text-lg font-black text-sky-600 dark:text-sky-300 truncate">
                #{effectivePoints >= 350 ? 2 : effectivePoints >= 180 ? 4 : 6} {profile?.city || 'Greenwood'}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-forest-900/80 border border-emerald-500/20 backdrop-blur-sm shadow-sm hover:border-teal-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-500/20 flex items-center justify-center text-xl flex-shrink-0">
              🏅
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 truncate">Badges Earned</div>
              <div className="text-lg font-black text-teal-600 dark:text-teal-300">{unlockedBadgesCount} / {badges.length}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ECOBYTE COMPANION & STREAK SHIELD TRACKER */}
      <section className="space-y-4">
        <EcoByteCoach />
        <StreakTracker
          streak={effectiveStreak}
          longestStreak={dashboardData?.user?.longestStreak || effectiveStreak}
          shields={effectiveShields}
        />
      </section>

      {/* 3. 3-DAY CLIMATE MISSION SPRINT */}
      <section className="space-y-3">
        <ThreeDayMissionCard
          initialCycle={dashboardData?.cycle}
          onActionCompleted={() => fetchBackendData()}
        />
      </section>

      {/* 4. BEFORE & AFTER TRANSPORT CO₂e FOOTPRINT ASSESSMENT */}
      <section className="space-y-6">
        <CO2ComparisonCard
          metrics={effectiveCO2Metrics}
          profile={dashboardData?.profile}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CO2TrendChart
            currentWeeklyCO2e={effectiveCO2Metrics.currentWeeklyCO2e}
          />
          <WhatIfSimulatorCard />
        </div>

        <CO2ReductionTips
          tips={co2Data?.tips}
          transportMode={dashboardData?.profile?.transportMode}
        />
      </section>

      {/* 5. SIGNATURE UNIQUE FEATURE: YOUR CLIMATE JOURNEY (METRO PATH) */}
      <section className="space-y-3">
        <ClimateJourneyCard
          userPoints={effectivePoints}
          streak={effectiveStreak}
          completedActivitiesCount={dashboardData?.recentActivities?.length || 1}
          onboardingCompleted={true}
        />
      </section>

      {/* 6. WEEKLY PROGRESS CARD & HABIT CHECKLIST */}
      <section className="space-y-3">
        <WeeklyProgressCard />

        <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20">
          <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
            🌱 Ready to boost your community's clean score today?
          </p>
          <button
            onClick={scrollToActions}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-100 hover:underline cursor-pointer"
          >
            <span>Explore Eco Actions</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* 7. ECO ACTIONS (THE ENGINE - CHECKLIST) */}
      <section id="eco-actions" className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-sm scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              <span>Verified Climate Habits</span>
            </div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900 dark:text-emerald-50">
              🌱 Your Weekly Eco Challenges
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Check off daily habits to earn real points and fuel EcoByte's evolution.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search eco activities…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-white dark:bg-forest-800/80 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {categories.map(cat => {
            const count = cat.key === 'all' 
              ? allChallenges.length 
              : allChallenges.filter(c => c.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-forest-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-forest-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Challenges Grid */}
        {challenges.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-gray-200 dark:border-forest-800 rounded-2xl">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              “Hmm… EcoByte couldn’t find a challenge here. Try another category! 🌱”
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-4 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isCompleted={completedTodayIds.has(challenge.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 8. YOUR ECO IDENTITY (LEVEL XP + BADGES + CERTIFICATE) */}
      <section className="space-y-6">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-forest-900 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
            <Award className="w-64 h-64 text-white" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Civic Impact Tier {levelInfo.stage} of 6</span>
              </div>
              <h3 className="font-display font-black text-2xl md:text-3xl text-white">
                {levelInfo.title}
              </h3>
              <p className="text-xs md:text-sm text-emerald-100/80">
                {levelInfo.xpToNextLevel > 0
                  ? `Earn ${levelInfo.xpToNextLevel} more points to reach: ${levelInfo.nextLevelTitle}!`
                  : `Spectacular! You have reached the pinnacle rank of EcoRise Legend!`
                }
              </p>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-200/90 mb-1.5">
                  <span>Progress to Next Tier</span>
                  <span>{levelInfo.progressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-700/50">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Certificate Preview Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col items-center text-center sm:min-w-[280px]">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-2xl mb-2">
                📜
              </div>
              <div className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                {civicRecognition.tier} Recognition
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5">
                Official Climate Certificate
              </div>
              <p className="text-[11px] text-emerald-100/70 mt-1 max-w-[220px]">
                High-resolution PNG signed with your SDG 13 impact metrics.
              </p>
              <button
                onClick={openCertificateModal}
                className="mt-3 w-full py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-gray-900 font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>View & Download Certificate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Participant Badges */}
        <ParticipantBadges />
      </section>

      {/* 9. GREEN MOBILITY HUB */}
      <section className="space-y-4">
        <GreenMobilityCard />
      </section>

      {/* 10. COMMUNITY IMPACT & LOCAL COHORT */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-2xl text-emerald-600">
              <TreePine className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Carbon Offset Eq.</div>
              <div className="font-display font-black text-xl text-gray-900 dark:text-emerald-100">
                {impactEquivalents.estimatedCo2Kg} kg CO₂
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                ≈ {impactEquivalents.treesSupported} trees planted
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-2xl text-cyan-600">
              <Droplet className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Freshwater Preserved</div>
              <div className="font-display font-black text-xl text-gray-900 dark:text-emerald-100">
                {impactEquivalents.waterSavedLiters} Liters
              </div>
              <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">
                ≈ {Math.round(impactEquivalents.waterSavedLiters / 10)} showers saved
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-2xl text-amber-600">
              <Wind className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Plastic Waste Diverted</div>
              <div className="font-display font-black text-xl text-gray-900 dark:text-emerald-100">
                {impactEquivalents.plasticAvoidedItems} Items
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                ≈ {Math.round(impactEquivalents.plasticAvoidedItems * 0.025 * 10) / 10} kg plastic
              </div>
            </div>
          </div>
        </div>

        {/* Local Urban Cohort Rank & Streak Protection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LocalRankCard />
          </div>
          <div>
            <StreakShieldCard />
          </div>
        </div>

        <EcoBossCard />
      </section>

      {/* 11. ECOPULSE — COMMUNITY VOICE */}
      <section className="space-y-4">
        <EcoPulseCard />
      </section>

      {/* 12. LEADERBOARD (OLYMPIC 3D PODIUM + FILTER TABS) */}
      <section className="space-y-4">
        <LeaderboardPodium />
      </section>

      {/* 13. LIVE WEEKLY ANALYTICS CHART */}
      <section className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display font-black text-xl text-gray-900 dark:text-emerald-50">
              📊 Live Weekly Points Breakdown
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Calculated dynamically from your actual completion records (Mon–Sun).
            </p>
          </div>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('intelligence')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Intelligence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
        <WeeklyChart />
      </section>

      {/* Reset Confirmation Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
