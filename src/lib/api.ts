/**
 * EcoRise 2.0 Centralized API Client
 * Seamlessly interfaces with the Express.js backend via Vite proxy (/api)
 */

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('ecorise_jwt_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('ecorise_jwt_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('ecorise_jwt_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status} Error`;
    try {
      const data = await response.json();
      if (data.message) errorMsg = data.message;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    register: (data: { name: string; email: string; password: string; city?: string; school?: string }) =>
      request<{ message: string; token: string; user: any; needsOnboarding: boolean }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    login: (data: { email: string; password: string }) =>
      request<{ message: string; token: string; user: any; needsOnboarding: boolean }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    me: () => request<{ user: any }>('/auth/me'),
    logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' })
  },

  // Onboarding
  onboarding: {
    submit: (data: {
      transportMode: string;
      vehicleType?: string;
      distancePerTrip?: number;
      distanceType?: 'one-way' | 'round-trip';
      tripsPerWeek?: number;
      hasPublicTransitAccess?: boolean;
    }) =>
      request<{
        message: string;
        profile: any;
        calculation: any;
        cycle: any;
        user: any;
      }>('/onboarding/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // 3-Day Challenges
  challenges: {
    getCurrent: () =>
      request<{
        cycle: any;
        remainingMs: number;
        timeRemaining: { days: number; hours: number; minutes: number };
      }>('/challenges/current'),
    completeDay: (data: { dayNumber: number; verificationNote?: string }) =>
      request<{
        message: string;
        cycle: any;
        user: any;
        cycleBonusEarned: boolean;
        earnedBadges: any[];
      }>('/challenges/complete-day', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    startNew: () => request<{ message: string; cycle: any }>('/challenges/start-new', { method: 'POST' })
  },

  // CO2 Footprint & Comparison
  co2: {
    getProfile: () =>
      request<{
        profile: any;
        metrics: {
          baselineWeeklyCO2e: number;
          currentWeeklyCO2e: number;
          reductionKg: number;
          reductionPct: number;
          annualKgSaved: number;
          treeSeedlingsEquiv: number;
          smartphoneChargesEquiv: number;
        };
        tips: any[];
        methodology: any;
      }>('/co2/profile'),
    getSnapshots: () => request<{ snapshots: any[] }>('/co2/snapshots'),
    whatIfSimulate: (data: { targetMode: string; shiftedTripsPerWeek: number }) =>
      request<{
        currentMode: string;
        targetMode: string;
        shiftedTripsPerWeek: number;
        baselineWeeklyCO2e: number;
        simulatedWeeklyCO2e: number;
        weeklySavingsKg: number;
        monthlySavingsKg: number;
        yearlySavingsKg: number;
        percentageDrop: number;
        potentialPointsPerWeek: number;
      }>('/co2/what-if-simulate', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // Master Activities & Completion
  activities: {
    getAll: () => request<{ activities: any[] }>('/activities'),
    complete: (activityId: string, note?: string) =>
      request<{ message: string; user: any; completed: any; newBadgeAwarded: any }>('/activities/complete', {
        method: 'POST',
        body: JSON.stringify({ activityId, note })
      })
  },

  // Green Commute
  greenCommute: {
    getHistory: () => request<{ commutes: any[] }>('/green-commute/history'),
    log: (data: { mode: string; distanceKm: number; notes?: string }) =>
      request<{ message: string; commute: any; user: any; newBadge: any }>('/green-commute/log', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // Leaderboard
  leaderboard: {
    get: () => request<{ leaderboard: any[]; podium: any[]; totalParticipants: number }>('/leaderboard')
  },

  // Badges
  badges: {
    getAll: () => request<{ badges: any[] }>('/badges'),
    getUser: () => request<{ userBadges: any[] }>('/badges/user')
  },

  // Civic Pulse Surveys
  surveys: {
    getActive: () => request<{ survey: any }>('/surveys/active'),
    vote: (optionId: string) =>
      request<{ message: string; survey: any }>('/surveys/vote', {
        method: 'POST',
        body: JSON.stringify({ optionId })
      })
  },

  // Recognition & Civic Certificate
  recognition: {
    getCertificate: () => request<{ recognition: any }>('/recognition/certificate')
  },

  // Composite Dashboard Data
  dashboard: {
    get: () =>
      request<{
        user: any;
        profile: any;
        metrics: any;
        cycle: any;
        badges: any[];
        recentActivities: any[];
      }>('/dashboard')
  }
};
