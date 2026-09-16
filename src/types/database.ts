export type CategoryType = 'nature' | 'water' | 'transport' | 'energy' | 'waste';
export type DifficultyType = 'easy' | 'medium' | 'hard';
export type ImpactType = 'trees' | 'water' | 'plastic' | 'transport' | 'energy';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  city: string;
  sustainability_focus: string;
  weekly_goal: number;
  level: number;
  streak_shields: number;
  anonymous_in_feed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  difficulty: DifficultyType;
  points: number;
  impact_type: ImpactType;
  impact_value: number;
  icon: string;
  active: boolean;
  rotation_week: number;
  created_at?: string;
}

export interface ActivityCompletion {
  id: string;
  user_id: string;
  challenge_id: string;
  completed_at: string;
  points_earned: number;
  impact_type: ImpactType;
  impact_value: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  streak_shields: number;
}

export interface WeeklyStats {
  id: string;
  user_id: string;
  week_start: string;
  points: number;
  activities_completed: number;
  co2_saved: number;
  water_saved: number;
  plastic_reduced: number;
  energy_saved: number;
  trees_supported: number;
}

export interface LeaderboardEntry {
  id: string;
  full_name: string;
  city: string;
  avatar_url?: string;
  level: number;
  total_points: number;
  current_streak: number;
  rank?: number;
  isCurrentUser?: boolean;
}

export interface EcoHabitDNA {
  personality: string;
  tagline: string;
  description: string;
  dominantCategory: CategoryType;
  breakdown: {
    category: CategoryType;
    label: string;
    percentage: number;
    count: number;
    color: string;
  }[];
}

export interface EcoBossProgress {
  title: string;
  description: string;
  completedCategories: CategoryType[];
  totalCategories: number;
  bonusPoints: number;
  isCompleted: boolean;
}

export interface ParticipantBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: number;
  maxProgress: number;
  category: 'starter' | 'water' | 'mobility' | 'waste' | 'nature' | 'energy' | 'streak' | 'points';
}

export interface GreenMobilityTrip {
  id: string;
  mode: 'bus' | 'metro' | 'bicycle' | 'walking' | 'carpool';
  tripsCount: number;
  distanceKm: number;
  date: string;
  pointsEarned: number;
  notes?: string;
}

export interface SurveyOption {
  id: string;
  label: string;
  votes: number;
  percentage?: number;
}

export interface EcoPulseSurvey {
  id: string;
  question: string;
  category: string;
  options: SurveyOption[];
  totalVotes: number;
  userVotedOptionId?: string | null;
  featuredVoice?: string;
}

export interface CivicRecognitionInfo {
  tier: 'bronze' | 'silver' | 'gold' | 'leader';
  title: string;
  minPoints: number;
  badge: string;
  isEligible: boolean;
  certificateId: string;
}
