-- ============================================================================
-- EcoRise 2.0 – Supabase Database Schema (PostgreSQL)
-- UN SDG 13: Climate Action Digital Platform
-- ============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  city TEXT DEFAULT 'Local Community',
  sustainability_focus TEXT DEFAULT 'Overall Sustainability',
  weekly_goal INTEGER DEFAULT 100,
  level INTEGER DEFAULT 1,
  streak_shields INTEGER DEFAULT 1,
  anonymous_in_feed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Challenges Catalog Table
CREATE TABLE IF NOT EXISTS public.challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('nature', 'water', 'transport', 'energy', 'waste')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points INTEGER NOT NULL DEFAULT 10,
  impact_type TEXT NOT NULL,
  impact_value NUMERIC NOT NULL DEFAULT 1,
  icon TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  rotation_week INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Activity Completions Log Table
CREATE TABLE IF NOT EXISTS public.activity_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  points_earned INTEGER NOT NULL,
  impact_type TEXT NOT NULL,
  impact_value NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Achievements Catalog Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Achievements Table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

-- 6. User Streaks Table
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_shields INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Weekly Stats Table
CREATE TABLE IF NOT EXISTS public.weekly_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  points INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  co2_saved NUMERIC DEFAULT 0,
  water_saved NUMERIC DEFAULT 0,
  plastic_reduced NUMERIC DEFAULT 0,
  energy_saved NUMERIC DEFAULT 0,
  trees_supported NUMERIC DEFAULT 0,
  UNIQUE (user_id, week_start)
);

-- ============================================================================
-- Indexes for High Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_activity_completions_user ON public.activity_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_completions_challenge ON public.activity_completions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_activity_completions_completed_at ON public.activity_completions(completed_at);
CREATE INDEX IF NOT EXISTS idx_weekly_stats_user_week ON public.weekly_stats(user_id, week_start);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_stats ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile upon signup"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Challenges Policies
CREATE POLICY "Anyone authenticated can view active challenges"
  ON public.challenges FOR SELECT
  USING (active = TRUE);

-- Activity Completions Policies
CREATE POLICY "Users can view own activity completions"
  ON public.activity_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity completions"
  ON public.activity_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Achievements Policies
CREATE POLICY "Anyone authenticated can view achievements catalog"
  ON public.achievements FOR SELECT
  USING (TRUE);

-- User Achievements Policies
CREATE POLICY "Users can view own unlocked achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own unlocked achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Streaks Policies
CREATE POLICY "Users can view own streak"
  ON public.user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
  ON public.user_streaks FOR ALL
  USING (auth.uid() = user_id);

-- Weekly Stats Policies
CREATE POLICY "Users can view own weekly stats"
  ON public.weekly_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly stats"
  ON public.weekly_stats FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- Safe Public Views (Sanitized Leaderboard & Community Aggregates)
-- ============================================================================
CREATE OR REPLACE VIEW public.leaderboard_view AS
  SELECT
    p.id,
    p.full_name,
    p.city,
    p.avatar_url,
    p.level,
    COALESCE(SUM(ac.points_earned), 0) AS total_points,
    COALESCE(s.current_streak, 0) AS current_streak
  FROM public.profiles p
  LEFT JOIN public.activity_completions ac ON p.id = ac.user_id
  LEFT JOIN public.user_streaks s ON p.id = s.user_id
  GROUP BY p.id, p.full_name, p.city, p.avatar_url, p.level, s.current_streak;

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, city, weekly_goal)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Eco Pioneer'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'city', 'Local Community'),
    100
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_streaks (user_id, current_streak, longest_streak)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
