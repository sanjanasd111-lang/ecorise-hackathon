/**
 * EcoRise - Local Eco-Challenge
 * LocalStorage Persistence Layer
 */

const STORAGE_KEY = 'ecorise_state_v1';

const DEFAULT_STATE = {
  completedIds: [],
  streak: 4,
  streakDays: [true, true, true, true, false, false, false], // Mon - Sun
  theme: 'light',
  soundEnabled: true,
  lastUpdated: new Date().toISOString()
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      streakDays: Array.isArray(parsed.streakDays) ? parsed.streakDays : DEFAULT_STATE.streakDays
    };
  } catch (err) {
    console.warn("Error reading from localStorage:", err);
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state) {
  try {
    const toSave = {
      ...state,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn("Error writing to localStorage:", err);
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Error clearing localStorage:", err);
  }
  return { ...DEFAULT_STATE, streakDays: [false, false, false, false, false, false, false], streak: 0 };
}
