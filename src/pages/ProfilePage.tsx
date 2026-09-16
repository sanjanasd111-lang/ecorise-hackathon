import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEco } from '../context/EcoContext';
import { User, MapPin, Target, Eye, Moon, Sun, LogOut, Trash2, Check, AlertCircle } from 'lucide-react';

interface ProfilePageProps {
  onSignOutSuccess: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onSignOutSuccess }) => {
  const { user, profile, updateProfile, signOut, deleteAccount } = useAuth();
  const { theme, toggleTheme } = useEco();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [city, setCity] = useState(profile?.city || 'Bengaluru');
  const [focus, setFocus] = useState(profile?.sustainability_focus || 'Overall Sustainability');
  const [weeklyGoal, setWeeklyGoal] = useState<number>(profile?.weekly_goal || 100);
  const [anonymousInFeed, setAnonymousInFeed] = useState(profile?.anonymous_in_feed || false);

  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const result = await updateProfile({
      full_name: fullName,
      city,
      sustainability_focus: focus,
      weekly_goal: weeklyGoal,
      anonymous_in_feed: anonymousInFeed
    });

    setIsSaving(false);
    if (!result.error) {
      setMessage('Profile settings successfully saved!');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleLogout = async () => {
    await signOut();
    onSignOutSuccess();
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your EcoRise account and all challenge history?')) {
      await deleteAccount();
      onSignOutSuccess();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="font-display font-black text-3xl text-gray-900 dark:text-white">
          Profile & Settings
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal preferences, climate goals, and account security.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Full Name / Display Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800/60 text-gray-900 dark:text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            City / Local Community
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800/60 text-gray-900 dark:text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Sustainability Focus */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Sustainability Focus
          </label>
          <select
            value={focus}
            onChange={e => setFocus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800/60 text-gray-900 dark:text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
          >
            <option value="Clean Transport">Clean Transport 🚲</option>
            <option value="Plastic Reduction">Plastic Reduction 🛍️</option>
            <option value="Energy Saving">Energy Saving 💡</option>
            <option value="Water Conservation">Water Conservation 💧</option>
            <option value="Nature & Trees">Nature & Trees 🌱</option>
            <option value="Waste Reduction">Waste Reduction ♻️</option>
            <option value="Overall Sustainability">Overall Sustainability 🌍</option>
          </select>
        </div>

        {/* Weekly Goal */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Personal Weekly Goal (Eco Points)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 150, 250].map(val => (
              <button
                type="button"
                key={val}
                onClick={() => setWeeklyGoal(val)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  weeklyGoal === val
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-gray-50 dark:bg-forest-800 border-gray-200 dark:border-forest-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {val} pts
              </button>
            ))}
          </div>
        </div>

        {/* Anonymous in Feed */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-forest-800/50 border border-gray-100 dark:border-forest-800">
          <input
            type="checkbox"
            id="anon"
            checked={anonymousInFeed}
            onChange={e => setAnonymousInFeed(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 border-gray-300"
          />
          <label htmlFor="anon" className="text-xs text-gray-700 dark:text-gray-300 font-medium">
            Appear anonymously on public community feed (shows as <em>"A member in {city}"</em>).
          </label>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all"
        >
          {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </form>

      {/* Account Security & Actions */}
      <div className="bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <h3 className="font-display font-black text-lg text-gray-900 dark:text-white">
          Account Management
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 hover:bg-gray-50 dark:hover:bg-forest-800 text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={handleDeleteAccount}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

    </div>
  );
};
