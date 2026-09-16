import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Achievement, 
  ActivityCompletion, 
  CategoryType, 
  Challenge, 
  EcoBossProgress, 
  EcoHabitDNA, 
  LeaderboardEntry,
  ParticipantBadge,
  GreenMobilityTrip,
  EcoPulseSurvey,
  CivicRecognitionInfo
} from '../types/database';
import { 
  calculateEcoHabitDNA, 
  calculateImpactEquivalents, 
  calculateLevel, 
  calculateStreak, 
  calculateParticipantBadges,
  calculateCivicRecognition,
  generateClimateStory,
  LevelInfo 
} from '../lib/calculations';
import { playChampionFanfare, playCheckSound, playMilestoneSound, playUncheckSound } from '../lib/sound';
import { triggerCelebration } from '../lib/confetti';

// Curated challenges catalog
export const DEFAULT_CHALLENGES: Challenge[] = [
  { id: 'plant_tree', title: 'Plant a tree', description: 'Plant or help nurture a tree, sapling, or community green space.', category: 'nature', difficulty: 'medium', points: 25, impact_type: 'trees', impact_value: 1, icon: '🌱', active: true, rotation_week: 1 },
  { id: 'refillable_bottle', title: 'Use a refillable bottle', description: 'Replace disposable plastic drink bottles with a reusable container.', category: 'water', difficulty: 'easy', points: 10, impact_type: 'plastic', impact_value: 2, icon: '💧', active: true, rotation_week: 1 },
  { id: 'cycle_trip', title: 'Cycle instead of driving', description: 'Choose cycling or walking for a short trip instead of a motor vehicle.', category: 'transport', difficulty: 'medium', points: 20, impact_type: 'transport', impact_value: 6, icon: '🚲', active: true, rotation_week: 1 },
  { id: 'save_electricity', title: 'Save electricity', description: 'Unplug standby electronics and switch off appliances when not in use.', category: 'energy', difficulty: 'easy', points: 10, impact_type: 'energy', impact_value: 4, icon: '💡', active: true, rotation_week: 1 },
  { id: 'recycle_waste', title: 'Recycle waste', description: 'Carefully sort recyclable paper, metals, and clean plastics.', category: 'waste', difficulty: 'easy', points: 15, impact_type: 'plastic', impact_value: 4, icon: '♻️', active: true, rotation_week: 1 },
  { id: 'public_transport', title: 'Use public transport', description: 'Take the bus, metro, tram, or shared transit for your commute.', category: 'transport', difficulty: 'easy', points: 15, impact_type: 'transport', impact_value: 5, icon: '🚌', active: true, rotation_week: 2 },
  { id: 'avoid_plastic', title: 'Avoid single-use plastic', description: 'Carry a reusable canvas bag and refuse disposable containers.', category: 'waste', difficulty: 'easy', points: 10, impact_type: 'plastic', impact_value: 3, icon: '🛍️', active: true, rotation_week: 2 },
  { id: 'save_water', title: 'Save water', description: 'Take a shower under 5 minutes and turn off running taps while brushing.', category: 'water', difficulty: 'easy', points: 10, impact_type: 'water', impact_value: 25, icon: '🚿', active: true, rotation_week: 2 },
  { id: 'switch_lights', title: 'Switch off unused lights', description: 'Always turn off illumination when leaving empty rooms or in daylight.', category: 'energy', difficulty: 'easy', points: 10, impact_type: 'energy', impact_value: 3, icon: '🔦', active: true, rotation_week: 3 },
  { id: 'community_cleanup', title: 'Community clean-up', description: 'Collect discarded trash in your local neighborhood park or beach.', category: 'nature', difficulty: 'hard', points: 25, impact_type: 'plastic', impact_value: 6, icon: '🧹', active: true, rotation_week: 3 }
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', name: 'First Step', description: 'Complete your first climate action.', icon: '🌱', requirement_type: 'total_activities', requirement_value: 1 },
  { id: 'eco_explorer', name: 'Eco Explorer', description: 'Complete activities across 3 different categories.', icon: '🧭', requirement_type: 'categories_completed', requirement_value: 3 },
  { id: 'water_saver', name: 'Water Saver', description: 'Complete 3 water-saving actions.', icon: '💧', requirement_type: 'water_activities', requirement_value: 3 },
  { id: 'tree_champion', name: 'Tree Champion', description: 'Plant a tree or care for community green space.', icon: '🌳', requirement_type: 'nature_activities', requirement_value: 1 },
  { id: 'green_commuter', name: 'Green Commuter', description: 'Complete 3 cycling or public transit activities.', icon: '🚲', requirement_type: 'transport_activities', requirement_value: 3 },
  { id: 'waste_warrior', name: 'Waste Warrior', description: 'Complete 4 recycling or plastic reduction actions.', icon: '♻️', requirement_type: 'waste_activities', requirement_value: 4 },
  { id: 'energy_saver', name: 'Energy Saver', description: 'Complete 4 energy conservation actions.', icon: '⚡', requirement_type: 'energy_activities', requirement_value: 4 },
  { id: 'week_warrior', name: 'Week Warrior', description: 'Maintain a 4+ day eco streak.', icon: '🔥', requirement_type: 'streak_days', requirement_value: 4 },
  { id: 'climate_champion', name: 'Climate Champion', description: 'Earn 100+ Eco Points this week.', icon: '🌍', requirement_type: 'weekly_points', requirement_value: 100 },
  { id: 'eco_legend', name: 'Eco Legend', description: 'Accumulate 1,000 Total Lifetime Eco Points.', icon: '👑', requirement_type: 'total_points', requirement_value: 1000 }
];

export const DEFAULT_SURVEYS: EcoPulseSurvey[] = [
  {
    id: 'survey_community_focus',
    question: 'What should our community focus on next?',
    category: 'Community Action Priority',
    featuredVoice: '42% of participants want better public transport options.',
    totalVotes: 124,
    options: [
      { id: 'opt_transit', label: 'More public transport', votes: 52, percentage: 42 },
      { id: 'opt_trees', label: 'More trees & urban green canopy', votes: 32, percentage: 26 },
      { id: 'opt_waste', label: 'Better waste management', votes: 22, percentage: 18 },
      { id: 'opt_clean', label: 'Cleaner public spaces', votes: 11, percentage: 9 },
      { id: 'opt_energy', label: 'Energy conservation in public buildings', votes: 7, percentage: 5 }
    ]
  },
  {
    id: 'survey_commute_mode',
    question: 'How do you usually travel to college or work?',
    category: 'Green Mobility Modes',
    featuredVoice: 'Bus & metro make up 60% of all student commutes in our local cohort.',
    totalVotes: 98,
    options: [
      { id: 'opt_bus', label: 'Bus', votes: 38, percentage: 39 },
      { id: 'opt_metro', label: 'Metro', votes: 26, percentage: 27 },
      { id: 'opt_bicycle', label: 'Bicycle', votes: 15, percentage: 15 },
      { id: 'opt_walk', label: 'Walking', votes: 10, percentage: 10 },
      { id: 'opt_car', label: 'Car', votes: 5, percentage: 5 },
      { id: 'opt_bike', label: 'Two-wheeler', votes: 4, percentage: 4 }
    ]
  },
  {
    id: 'survey_easy_action',
    question: 'Which climate action is easiest for you to practice daily?',
    category: 'Daily Habit Accessibility',
    featuredVoice: 'Household electricity saving is rated the easiest starting habit for beginners.',
    totalVotes: 85,
    options: [
      { id: 'opt_elec', label: 'Saving electricity', votes: 32, percentage: 38 },
      { id: 'opt_recycle', label: 'Recycling waste', votes: 24, percentage: 28 },
      { id: 'opt_plastic', label: 'Avoiding single-use plastic', votes: 18, percentage: 21 },
      { id: 'opt_pub_transit', label: 'Public transport', votes: 8, percentage: 9 },
      { id: 'opt_plant', label: 'Tree planting & plant care', votes: 3, percentage: 4 }
    ]
  }
];

export const DEFAULT_MOBILITY_TRIPS: GreenMobilityTrip[] = [
  {
    id: 'trip_1',
    mode: 'bus',
    tripsCount: 3,
    distanceKm: 9,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    pointsEarned: 15,
    notes: 'Campus public transit commute'
  },
  {
    id: 'trip_2',
    mode: 'bicycle',
    tripsCount: 2,
    distanceKm: 5,
    date: new Date().toISOString().split('T')[0],
    pointsEarned: 20,
    notes: 'Short neighborhood errands'
  }
];

interface EcoContextType {
  challenges: Challenge[];
  completions: ActivityCompletion[];
  achievements: Achievement[];
  unlockedAchievementIds: Set<string>;
  badges: ParticipantBadge[];
  greenMobilityTrips: GreenMobilityTrip[];
  logMobilityTrip: (mode: GreenMobilityTrip['mode'], tripsCount: number, distanceKm: number, notes?: string) => Promise<void>;
  greenCommuteChallengeCompleted: boolean;
  greenCommuteActionsCount: number;
  ecoPulseSurveys: EcoPulseSurvey[];
  voteSurvey: (surveyId: string, optionId: string) => void;
  civicRecognition: CivicRecognitionInfo;
  climateStory: ReturnType<typeof generateClimateStory>;
  ecoByteReaction: { message: string; mood: 'happy' | 'excited' | 'celebrating' | 'coaching'; accessory?: string };
  triggerEcoByteReaction: (message: string, mood?: 'happy' | 'excited' | 'celebrating' | 'coaching', accessory?: string) => void;
  leaderboardTimeframe: 'weekly' | 'monthly' | 'all-time';
  setLeaderboardTimeframe: (tf: 'weekly' | 'monthly' | 'all-time') => void;
  totalPoints: number;
  weeklyPoints: number;
  weeklyGoal: number;
  levelInfo: LevelInfo;
  streak: number;
  longestStreak: number;
  streakShields: number;
  hasActivityToday: boolean;
  impactEquivalents: ReturnType<typeof calculateImpactEquivalents>;
  habitDNA: EcoHabitDNA;
  ecoBoss: EcoBossProgress;
  leaderboard: LeaderboardEntry[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  completeChallenge: (challengeId: string) => Promise<boolean>;
  uncompleteChallenge: (challengeId: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  applyDemoPreset: (preset: 'clean' | 'beginner' | 'champion' | 'master') => void;
  toast: { title: string; message: string } | null;
  clearToast: () => void;
  isChampionModalOpen: boolean;
  closeChampionModal: () => void;
  isShareModalOpen: boolean;
  openShareModal: () => void;
  closeShareModal: () => void;
  isCertificateModalOpen: boolean;
  openCertificateModal: () => void;
  closeCertificateModal: () => void;
}

const EcoContext = createContext<EcoContextType | undefined>(undefined);

export const EcoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const isConfigured = isSupabaseConfigured();

  const [challenges] = useState<Challenge[]>(DEFAULT_CHALLENGES);
  const [achievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [completions, setCompletions] = useState<ActivityCompletion[]>([]);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<Set<string>>(new Set());
  const [streakShields, setStreakShields] = useState<number>(profile?.streak_shields ?? 1);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);
  const [isChampionModalOpen, setIsChampionModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [milestonesTriggered, setMilestonesTriggered] = useState<Set<number>>(new Set());
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');

  // Green Mobility Trips & Surveys loaded from local storage
  const [greenMobilityTrips, setGreenMobilityTrips] = useState<GreenMobilityTrip[]>(() => {
    const saved = localStorage.getItem('ecorise_mobility_trips');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_MOBILITY_TRIPS;
  });

  const [ecoPulseSurveys, setEcoPulseSurveys] = useState<EcoPulseSurvey[]>(() => {
    const saved = localStorage.getItem('ecorise_surveys');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_SURVEYS;
  });

  const [badgeUnlockDates, setBadgeUnlockDates] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('ecorise_badge_dates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  // EcoByte reactive commentary state
  const [ecoByteReaction, setEcoByteReaction] = useState<{
    message: string;
    mood: 'happy' | 'excited' | 'celebrating' | 'coaching';
    accessory?: string;
  }>({
    message: "Welcome to EcoRise! Every habit you log moves our community forward. 🌱",
    mood: 'happy'
  });

  const triggerEcoByteReaction = (message: string, mood: 'happy' | 'excited' | 'celebrating' | 'coaching' = 'happy', accessory?: string) => {
    setEcoByteReaction({ message, mood, accessory });
  };

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('ecorise_theme') as 'light' | 'dark') || 'light';
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);

  // Sync Theme with DOM
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ecorise_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleSound = () => setSoundEnabledState(prev => !prev);
  const clearToast = () => setToast(null);

  // Load Completions from Supabase or Local Storage
  useEffect(() => {
    if (!user) {
      setCompletions([]);
      setUnlockedAchievementIds(new Set());
      return;
    }

    async function loadCompletions() {
      if (isConfigured) {
        try {
          const { data, error } = await supabase
            .from('activity_completions')
            .select('*')
            .eq('user_id', user.id);

          if (data && !error) {
            setCompletions(data as ActivityCompletion[]);
          }
        } catch (e) {
          console.warn('Failed to load completions from Supabase:', e);
        }
      } else {
        const stored = localStorage.getItem(`ecorise_completions_${user.id}`);
        if (stored) {
          try {
            setCompletions(JSON.parse(stored));
          } catch (e) {}
        } else {
          setCompletions([]);
        }
      }
    }

    loadCompletions();
  }, [user, isConfigured]);

  // Derived Points & Stats
  const totalPoints = completions.reduce((sum, c) => sum + c.points_earned, 0);

  // Weekly Points (Current Week starting Monday)
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diffToMonday));
  monday.setHours(0, 0, 0, 0);

  const weeklyCompletions = completions.filter(c => new Date(c.completed_at) >= monday);
  const weeklyPoints = weeklyCompletions.reduce((sum, c) => sum + c.points_earned, 0);
  const weeklyGoal = profile?.weekly_goal || 100;

  const levelInfo = calculateLevel(totalPoints);
  const streakData = calculateStreak(completions, streakShields);
  const impactEquivalents = calculateImpactEquivalents(completions, challenges);
  const habitDNA = calculateEcoHabitDNA(completions, challenges);

  // Eco Boss Progress (Must complete all 5 categories this week)
  const challengeMap = new Map(challenges.map(c => [c.id, c]));
  const weekCategories = new Set<CategoryType>();
  weeklyCompletions.forEach(c => {
    const ch = challengeMap.get(c.challenge_id);
    if (ch) weekCategories.add(ch.category);
  });
  const ecoBoss: EcoBossProgress = {
    title: '🌍 Weekly Eco Boss',
    description: 'Complete at least 1 action across all 5 categories this week.',
    completedCategories: Array.from(weekCategories),
    totalCategories: 5,
    bonusPoints: 100,
    isCompleted: weekCategories.size >= 5
  };

  // Evaluate Unlocked Achievements
  useEffect(() => {
    const unlocked = new Set<string>();

    achievements.forEach(ach => {
      let isEligible = false;
      if (ach.id === 'first_step' && completions.length >= 1) isEligible = true;
      if (ach.id === 'eco_explorer' && weekCategories.size >= 3) isEligible = true;
      if (ach.id === 'water_saver' && completions.filter(c => challengeMap.get(c.challenge_id)?.category === 'water').length >= 3) isEligible = true;
      if (ach.id === 'tree_champion' && completions.some(c => c.challenge_id === 'plant_tree')) isEligible = true;
      if (ach.id === 'green_commuter' && completions.filter(c => challengeMap.get(c.challenge_id)?.category === 'transport').length >= 3) isEligible = true;
      if (ach.id === 'waste_warrior' && completions.filter(c => challengeMap.get(c.challenge_id)?.category === 'waste').length >= 4) isEligible = true;
      if (ach.id === 'energy_saver' && completions.filter(c => challengeMap.get(c.challenge_id)?.category === 'energy').length >= 4) isEligible = true;
      if (ach.id === 'week_warrior' && streakData.currentStreak >= 4) isEligible = true;
      if (ach.id === 'climate_champion' && weeklyPoints >= 100) isEligible = true;
      if (ach.id === 'eco_legend' && totalPoints >= 1000) isEligible = true;

      if (isEligible) unlocked.add(ach.id);
    });

    setUnlockedAchievementIds(unlocked);
  }, [completions, weeklyPoints, totalPoints, streakData.currentStreak]);

  // Check Milestones
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    milestones.forEach(m => {
      if (weeklyPoints >= m && !milestonesTriggered.has(m)) {
        setMilestonesTriggered(prev => new Set(prev).add(m));
        if (m === 100) {
          playChampionFanfare();
          triggerCelebration({ duration: 4000, particleCount: 120 });
          setIsChampionModalOpen(true);
        } else {
          playMilestoneSound();
          triggerCelebration({ duration: 2500, particleCount: 60 });
          setToast({ title: 'Milestone Reached! 🎉', message: `You hit ${m} Eco Points this week!` });
        }
      }
    });
  }, [weeklyPoints, milestonesTriggered]);

  // Complete Challenge Action (Prevents duplicate completions on same day)
  const completeChallenge = async (challengeId: string): Promise<boolean> => {
    if (!user) {
      setToast({ title: 'Sign In Required', message: 'Please sign in to log your eco actions.' });
      return false;
    }

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return false;

    // Check if already completed today
    const todayStr = new Date().toISOString().split('T')[0];
    const alreadyToday = completions.some(c => 
      c.challenge_id === challengeId && 
      c.completed_at.startsWith(todayStr)
    );

    if (alreadyToday) {
      setToast({ title: 'Already Completed Today', message: `You already logged "${challenge.title}" today!` });
      return false;
    }

    const newCompletion: ActivityCompletion = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: user.id,
      challenge_id: challenge.id,
      completed_at: new Date().toISOString(),
      points_earned: challenge.points,
      impact_type: challenge.impact_type,
      impact_value: challenge.impact_value,
      created_at: new Date().toISOString()
    };

    const nextCompletions = [newCompletion, ...completions];
    setCompletions(nextCompletions);

    playCheckSound();
    setToast({
      title: `+${challenge.points} Eco Points 🌱`,
      message: `Completed "${challenge.title}"!`
    });

    if (isConfigured) {
      try {
        await supabase.from('activity_completions').insert([newCompletion]);
      } catch (e) {
        console.warn('Error inserting completion into Supabase:', e);
      }
    } else {
      localStorage.setItem(`ecorise_completions_${user.id}`, JSON.stringify(nextCompletions));
    }

    return true;
  };

  const uncompleteChallenge = async (challengeId: string) => {
    if (!user) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const target = completions.find(c => c.challenge_id === challengeId && c.completed_at.startsWith(todayStr));
    if (!target) return;

    const filtered = completions.filter(c => c.id !== target.id);
    setCompletions(filtered);
    playUncheckSound();
    setToast({ title: 'Activity Removed', message: 'Eco points adjusted.' });

    if (isConfigured) {
      try {
        await supabase.from('activity_completions').delete().eq('id', target.id);
      } catch (e) {}
    } else {
      localStorage.setItem(`ecorise_completions_${user.id}`, JSON.stringify(filtered));
    }
  };

  const resetProgress = async () => {
    if (!user) return;
    setCompletions([]);
    setMilestonesTriggered(new Set());
    setToast({ title: 'Progress Reset', message: 'Your challenge records have been cleared.' });

    if (isConfigured) {
      try {
        await supabase.from('activity_completions').delete().eq('user_id', user.id);
      } catch (e) {}
    } else {
      localStorage.removeItem(`ecorise_completions_${user.id}`);
    }
  };

  const applyDemoPreset = (preset: 'clean' | 'beginner' | 'champion' | 'master') => {
    if (!user) return;
    let mockCompletions: ActivityCompletion[] = [];
    const baseDate = new Date().toISOString();

    if (preset === 'beginner') {
      // 25 pts
      mockCompletions = [
        { id: 'm1', user_id: user.id, challenge_id: 'refillable_bottle', points_earned: 10, impact_type: 'plastic', impact_value: 2, completed_at: baseDate, created_at: baseDate },
        { id: 'm2', user_id: user.id, challenge_id: 'public_transport', points_earned: 15, impact_type: 'transport', impact_value: 5, completed_at: baseDate, created_at: baseDate }
      ];
    } else if (preset === 'champion') {
      // 75 pts
      mockCompletions = [
        { id: 'm1', user_id: user.id, challenge_id: 'refillable_bottle', points_earned: 10, impact_type: 'plastic', impact_value: 2, completed_at: baseDate, created_at: baseDate },
        { id: 'm2', user_id: user.id, challenge_id: 'plant_tree', points_earned: 25, impact_type: 'trees', impact_value: 1, completed_at: baseDate, created_at: baseDate },
        { id: 'm3', user_id: user.id, challenge_id: 'cycle_trip', points_earned: 20, impact_type: 'transport', impact_value: 6, completed_at: baseDate, created_at: baseDate },
        { id: 'm4', user_id: user.id, challenge_id: 'save_electricity', points_earned: 10, impact_type: 'energy', impact_value: 4, completed_at: baseDate, created_at: baseDate },
        { id: 'm5', user_id: user.id, challenge_id: 'save_water', points_earned: 10, impact_type: 'water', impact_value: 25, completed_at: baseDate, created_at: baseDate }
      ];
    } else if (preset === 'master') {
      // 105 pts
      mockCompletions = [
        { id: 'm1', user_id: user.id, challenge_id: 'refillable_bottle', points_earned: 10, impact_type: 'plastic', impact_value: 2, completed_at: baseDate, created_at: baseDate },
        { id: 'm2', user_id: user.id, challenge_id: 'plant_tree', points_earned: 25, impact_type: 'trees', impact_value: 1, completed_at: baseDate, created_at: baseDate },
        { id: 'm3', user_id: user.id, challenge_id: 'cycle_trip', points_earned: 20, impact_type: 'transport', impact_value: 6, completed_at: baseDate, created_at: baseDate },
        { id: 'm4', user_id: user.id, challenge_id: 'recycle_waste', points_earned: 15, impact_type: 'plastic', impact_value: 4, completed_at: baseDate, created_at: baseDate },
        { id: 'm5', user_id: user.id, challenge_id: 'public_transport', points_earned: 15, impact_type: 'transport', impact_value: 5, completed_at: baseDate, created_at: baseDate },
        { id: 'm6', user_id: user.id, challenge_id: 'save_water', points_earned: 10, impact_type: 'water', impact_value: 25, completed_at: baseDate, created_at: baseDate },
        { id: 'm7', user_id: user.id, challenge_id: 'avoid_plastic', points_earned: 10, impact_type: 'plastic', impact_value: 3, completed_at: baseDate, created_at: baseDate }
      ];
    }

    setCompletions(mockCompletions);
    playCheckSound();
    setToast({ title: 'Demo Preset Applied', message: `Loaded ${preset} state.` });
    if (!isConfigured) {
      localStorage.setItem(`ecorise_completions_${user.id}`, JSON.stringify(mockCompletions));
    }
  };

  // Dynamic Participant Badges
  const badges = calculateParticipantBadges(
    completions, 
    streakData.currentStreak, 
    totalPoints, 
    challenges, 
    greenMobilityTrips, 
    badgeUnlockDates
  );

  // Check for newly unlocked badges and trigger celebration
  useEffect(() => {
    badges.forEach(b => {
      if (b.unlocked && !badgeUnlockDates[b.id]) {
        const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        setBadgeUnlockDates(prev => {
          const next = { ...prev, [b.id]: now };
          localStorage.setItem('ecorise_badge_dates', JSON.stringify(next));
          return next;
        });
        playMilestoneSound();
        triggerCelebration({ duration: 3000, particleCount: 90 });
        setToast({ title: `🏅 Badge Unlocked: ${b.name}!`, message: b.description });
        triggerEcoByteReaction(`Awesome! You unlocked the ${b.name} badge! 🏅`, 'celebrating');
      }
    });
  }, [completions, totalPoints, streakData.currentStreak]);

  // Green Mobility Trip Logger
  const logMobilityTrip = async (
    mode: GreenMobilityTrip['mode'], 
    tripsCount: number, 
    distanceKm: number, 
    notes?: string
  ) => {
    const points = mode === 'bicycle' || mode === 'walking' ? tripsCount * 10 : tripsCount * 8;
    const newTrip: GreenMobilityTrip = {
      id: `trip_${Date.now()}`,
      mode,
      tripsCount,
      distanceKm,
      date: new Date().toISOString().split('T')[0],
      pointsEarned: points,
      notes: notes || `${tripsCount} trips via ${mode}`
    };

    const nextTrips = [newTrip, ...greenMobilityTrips];
    setGreenMobilityTrips(nextTrips);
    localStorage.setItem('ecorise_mobility_trips', JSON.stringify(nextTrips));

    // Record as activity completion
    const newCompletion: ActivityCompletion = {
      id: `comp_transit_${Date.now()}`,
      user_id: user?.id || 'demo_user',
      challenge_id: mode === 'bicycle' ? 'cycle_trip' : 'public_transport',
      completed_at: new Date().toISOString(),
      points_earned: points,
      impact_type: 'transport',
      impact_value: distanceKm,
      created_at: new Date().toISOString()
    };

    const nextCompletions = [newCompletion, ...completions];
    setCompletions(nextCompletions);
    localStorage.setItem(`ecorise_completions_${user?.id || 'demo'}`, JSON.stringify(nextCompletions));

    playCheckSound();
    setToast({ 
      title: `+${points} Green Commute Points! 🚌`, 
      message: `Logged ${tripsCount} ${mode} trips (~${distanceKm} km).` 
    });
    triggerEcoByteReaction(`Green commute recorded! EcoByte loves cleaner air! 🚌💨`, 'happy', 'transit');
  };

  // Green Commute Challenge progress
  const greenCommuteActionsCount = greenMobilityTrips.reduce((sum, t) => sum + t.tripsCount, 0);
  const greenCommuteChallengeCompleted = greenCommuteActionsCount >= 3;

  // EcoPulse Survey Voting
  const voteSurvey = (surveyId: string, optionId: string) => {
    setEcoPulseSurveys(prev => {
      const next = prev.map(s => {
        if (s.id !== surveyId) return s;
        const total = s.totalVotes + 1;
        const updatedOptions = s.options.map(opt => {
          const votes = opt.id === optionId ? opt.votes + 1 : opt.votes;
          return {
            ...opt,
            votes,
            percentage: Math.round((votes / total) * 100)
          };
        });
        return {
          ...s,
          totalVotes: total,
          options: updatedOptions,
          userVotedOptionId: optionId
        };
      });
      localStorage.setItem('ecorise_surveys', JSON.stringify(next));
      return next;
    });

    playCheckSound();
    setToast({ 
      title: 'Community Vote Recorded! 🗳️', 
      message: 'Your voice helps shape local climate action priorities.' 
    });
    triggerEcoByteReaction('Your voice helps shape greener communities! 🗳️🌱', 'happy');
  };

  // Civic Recognition
  const civicRecognition = calculateCivicRecognition(totalPoints, profile?.full_name || 'Eco Member');

  // My Climate Action Story
  const climateStory = generateClimateStory(
    completions, 
    greenMobilityTrips, 
    badges.filter(b => b.unlocked).length
  );

  // Demo community leaderboard merged with current user live rank
  const communityBaseLeaderboard: LeaderboardEntry[] = [
    { id: 'podium1', full_name: 'Aanya', city: profile?.city || 'Bengaluru', level: 5, total_points: 420, current_streak: 12, avatar_url: '🌿' },
    { id: 'podium2', full_name: 'Rahul', city: profile?.city || 'Bengaluru', level: 4, total_points: 385, current_streak: 9, avatar_url: '🌱' },
    { id: 'podium3', full_name: 'Priya', city: profile?.city || 'Bengaluru', level: 4, total_points: 350, current_streak: 8, avatar_url: '🌳' },
    { id: 'demo4', full_name: 'Marcus Lin', city: 'Singapore', level: 3, total_points: 190, current_streak: 6, avatar_url: '🚲' },
    { id: 'demo5', full_name: 'Elena Vance', city: 'Berlin', level: 2, total_points: 145, current_streak: 4, avatar_url: '⚡' },
    { id: 'demo6', full_name: 'Aisha Khan', city: profile?.city || 'Bengaluru', level: 2, total_points: 110, current_streak: 3, avatar_url: '💧' }
  ];

  const currentUserEntry: LeaderboardEntry = {
    id: user?.id || 'current_user',
    full_name: profile?.full_name ? `${profile.full_name} (You)` : 'You',
    city: profile?.city || 'Local Community',
    level: levelInfo.level,
    total_points: totalPoints,
    current_streak: streakData.currentStreak,
    avatar_url: '🤖',
    isCurrentUser: true
  };

  // Timeframe multiplier for demo toggles
  const timeframeMultiplier = leaderboardTimeframe === 'weekly' ? 1 : leaderboardTimeframe === 'monthly' ? 2.8 : 5.5;

  const leaderboard = [...communityBaseLeaderboard, currentUserEntry]
    .map(entry => ({
      ...entry,
      total_points: Math.round(entry.total_points * (entry.isCurrentUser ? 1 : timeframeMultiplier))
    }))
    .sort((a, b) => b.total_points - a.total_points)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return (
    <EcoContext.Provider value={{
      challenges,
      completions,
      achievements,
      unlockedAchievementIds,
      badges,
      greenMobilityTrips,
      logMobilityTrip,
      greenCommuteChallengeCompleted,
      greenCommuteActionsCount,
      ecoPulseSurveys,
      voteSurvey,
      civicRecognition,
      climateStory,
      ecoByteReaction,
      triggerEcoByteReaction,
      leaderboardTimeframe,
      setLeaderboardTimeframe,
      totalPoints,
      weeklyPoints,
      weeklyGoal,
      levelInfo,
      streak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      streakShields,
      hasActivityToday: streakData.hasActivityToday,
      impactEquivalents,
      habitDNA,
      ecoBoss,
      leaderboard,
      activeCategory,
      setActiveCategory,
      searchQuery,
      setSearchQuery,
      theme,
      toggleTheme,
      soundEnabled,
      toggleSound,
      completeChallenge,
      uncompleteChallenge,
      resetProgress,
      applyDemoPreset,
      toast,
      clearToast,
      isChampionModalOpen,
      closeChampionModal: () => setIsChampionModalOpen(false),
      isShareModalOpen,
      openShareModal: () => setIsShareModalOpen(true),
      closeShareModal: () => setIsShareModalOpen(false),
      isCertificateModalOpen,
      openCertificateModal: () => setIsCertificateModalOpen(true),
      closeCertificateModal: () => setIsCertificateModalOpen(false)
    }}>
      {children}
    </EcoContext.Provider>
  );
};

export const useEco = () => {
  const context = useContext(EcoContext);
  if (!context) throw new Error('useEco must be used within an EcoProvider');
  return context;
};
