import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types/database';
import { api, setAuthToken, clearAuthToken, getAuthToken } from '../lib/api';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  isLoading: boolean;
  isConfigured: boolean;
  needsOnboarding: boolean;
  setNeedsOnboarding: (val: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error?: string; needsOnboarding?: boolean }>;
  signUp: (email: string, password: string, fullName: string, city?: string) => Promise<{ error?: string; needsOnboarding?: boolean }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_STORAGE = 'ecorise_local_user_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const isConfigured = isSupabaseConfigured();

  // Load Session on start
  useEffect(() => {
    async function initAuth() {
      // 1. First check Express backend JWT session
      const token = getAuthToken();
      if (token) {
        try {
          const res = await api.auth.me();
          if (res.user) {
            const u = res.user;
            setUser(u);
            setNeedsOnboarding(!u.onboardingCompleted);
            setProfile({
              id: u._id || u.id,
              full_name: u.name,
              email: u.email,
              city: u.city || 'Greenwood District',
              sustainability_focus: 'Overall Sustainability',
              weekly_goal: 100,
              level: 1,
              streak_shields: u.shields !== undefined ? u.shields : 1,
              anonymous_in_feed: false,
              created_at: u.createdAt || new Date().toISOString(),
              updated_at: u.updatedAt || new Date().toISOString()
            });
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('[Auth] Express session token expired or invalid:', err);
          clearAuthToken();
        }
      }

      // 2. Fallback to Supabase if configured
      if (isConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          }
        } catch (e) {
          console.warn('Supabase session load error:', e);
        }
      } else {
        // 3. Fallback to Local Storage
        const stored = localStorage.getItem(LOCAL_USER_STORAGE);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUser(parsed.user);
            setProfile(parsed.profile);
            setNeedsOnboarding(!parsed.user?.onboardingCompleted);
          } catch (e) {}
        }
      }
      setIsLoading(false);
    }

    initAuth();

    if (isConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isConfigured]);

  async function fetchProfile(userId: string) {
    if (!isConfigured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data as Profile);
      } else if (error) {
        const newProf: Profile = {
          id: userId,
          full_name: user?.user_metadata?.full_name || 'Eco Pioneer',
          email: user?.email || '',
          city: 'Local Community',
          sustainability_focus: 'Overall Sustainability',
          weekly_goal: 100,
          level: 1,
          streak_shields: 1,
          anonymous_in_feed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await supabase.from('profiles').insert([newProf]);
        setProfile(newProf);
      }
    } catch (e) {
      console.warn('Failed to fetch profile:', e);
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Primary: Try Express REST API
      const res = await api.auth.login({ email, password });
      if (res.token && res.user) {
        setAuthToken(res.token);
        const u = res.user;
        setUser(u);
        const reqOnboard = Boolean(res.needsOnboarding || !u.onboardingCompleted);
        setNeedsOnboarding(reqOnboard);
        const newProf: Profile = {
          id: u._id || u.id,
          full_name: u.name,
          email: u.email,
          city: u.city || 'Greenwood District',
          sustainability_focus: 'Overall Sustainability',
          weekly_goal: 100,
          level: 1,
          streak_shields: u.shields !== undefined ? u.shields : 1,
          anonymous_in_feed: false,
          created_at: u.createdAt || new Date().toISOString(),
          updated_at: u.updatedAt || new Date().toISOString()
        };
        setProfile(newProf);
        localStorage.setItem(LOCAL_USER_STORAGE, JSON.stringify({ user: u, profile: newProf }));
        setIsLoading(false);
        return { needsOnboarding: reqOnboard };
      }
    } catch (apiErr: any) {
      console.warn('[Auth] Express login error:', apiErr.message);
      // If error is invalid credentials, return it directly
      if (apiErr.message.includes('Invalid email or password')) {
        setIsLoading(false);
        return { error: 'Invalid email or password.' };
      }
    }

    if (isConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setIsLoading(false);
      if (error) return { error: error.message };
      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
      }
      return {};
    } else {
      // Local fallback sign in
      const mockId = `user_${btoa(email).slice(0, 8)}`;
      const mockUser = { id: mockId, email, user_metadata: { full_name: email.split('@')[0] } };
      const mockProfile: Profile = {
        id: mockId,
        full_name: email.split('@')[0],
        email,
        city: 'Local Community',
        sustainability_focus: 'Overall Sustainability',
        weekly_goal: 100,
        level: 1,
        streak_shields: 1,
        anonymous_in_feed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUser(mockUser);
      setProfile(mockProfile);
      localStorage.setItem(LOCAL_USER_STORAGE, JSON.stringify({ user: mockUser, profile: mockProfile }));
      setIsLoading(false);
      return {};
    }
  };

  const signUp = async (email: string, password: string, fullName: string, city: string = 'Greenwood District') => {
    setIsLoading(true);
    try {
      // Primary: Try Express REST API
      const res = await api.auth.register({ name: fullName, email, password, city });
      if (res.token && res.user) {
        setAuthToken(res.token);
        const u = res.user;
        setUser(u);
        setNeedsOnboarding(true);
        const newProf: Profile = {
          id: u._id || u.id,
          full_name: u.name,
          email: u.email,
          city: u.city || city,
          sustainability_focus: 'Overall Sustainability',
          weekly_goal: 100,
          level: 1,
          streak_shields: 1,
          anonymous_in_feed: false,
          created_at: u.createdAt || new Date().toISOString(),
          updated_at: u.updatedAt || new Date().toISOString()
        };
        setProfile(newProf);
        localStorage.setItem(LOCAL_USER_STORAGE, JSON.stringify({ user: u, profile: newProf }));
        setIsLoading(false);
        return { needsOnboarding: true };
      }
    } catch (apiErr: any) {
      console.warn('[Auth] Express registration failed, checking fallback:', apiErr.message);
      if (apiErr.message.includes('already exists')) {
        setIsLoading(false);
        return { error: 'An account with this email already exists.' };
      }
    }

    if (isConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, city }
        }
      });
      setIsLoading(false);
      if (error) return { error: error.message };
      if (data.user) {
        setUser(data.user);
        const newProf: Profile = {
          id: data.user.id,
          full_name: fullName,
          email,
          city,
          sustainability_focus: 'Overall Sustainability',
          weekly_goal: 100,
          level: 1,
          streak_shields: 1,
          anonymous_in_feed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await supabase.from('profiles').insert([newProf]);
        setProfile(newProf);
      }
      return { needsOnboarding: true };
    } else {
      // Local fallback registration
      const mockId = `user_${Date.now().toString(36)}`;
      const mockUser = { id: mockId, email, user_metadata: { full_name: fullName }, onboardingCompleted: false };
      const mockProfile: Profile = {
        id: mockId,
        full_name: fullName,
        email,
        city,
        sustainability_focus: 'Overall Sustainability',
        weekly_goal: 100,
        level: 1,
        streak_shields: 1,
        anonymous_in_feed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUser(mockUser);
      setProfile(mockProfile);
      setNeedsOnboarding(true);
      localStorage.setItem(LOCAL_USER_STORAGE, JSON.stringify({ user: mockUser, profile: mockProfile }));
      setIsLoading(false);
      return { needsOnboarding: true };
    }
  };

  const signInWithGoogle = async () => {
    if (!isConfigured) {
      return { error: 'Google Auth requires active provider setup. Please use email sign in for demo.' };
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    try {
      await api.auth.logout();
    } catch (_) {}
    clearAuthToken();
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_USER_STORAGE);
    setUser(null);
    setProfile(null);
    setNeedsOnboarding(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (profile) {
      const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
      setProfile(updated);
      localStorage.setItem(LOCAL_USER_STORAGE, JSON.stringify({ user, profile: updated }));

      if (isConfigured) {
        const { error } = await supabase.from('profiles').update(updates).eq('id', profile.id);
        if (error) return { error: error.message };
      }
    }
    return {};
  };

  const deleteAccount = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isConfigured,
        needsOnboarding,
        setNeedsOnboarding,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updateProfile,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
