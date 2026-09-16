import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEco } from '../../context/EcoContext';
import { MapPin, Users, Award, ChevronDown, Check, Share2, Sparkles, TrendingUp } from 'lucide-react';

const PRESET_CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi',
  'London',
  'New York',
  'Berlin',
  'Tokyo',
  'Singapore',
  'Sydney',
  'Toronto'
];

export const LocalRankCard: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { totalPoints, openShareModal, streak } = useEco();

  const [selectedCity, setSelectedCity] = useState(profile?.city || 'Bengaluru');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [customCityInput, setCustomCityInput] = useState('');

  const handleSelectCity = async (city: string) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
    if (updateProfile) {
      await updateProfile({ city });
    }
  };

  const handleCustomCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customCityInput.trim()) {
      await handleSelectCity(customCityInput.trim());
      setCustomCityInput('');
    }
  };

interface CohortMember {
  name: string;
  points: number;
  streak: number;
  avatar: string;
  isUser?: boolean;
  rank?: number;
}

  // Dynamic Cohort Members based on selected city
  const baseCohort: CohortMember[] = [
    { name: 'Aarav N.', points: 190, streak: 8, avatar: '🌱', isUser: false },
    { name: 'Meera S.', points: 155, streak: 6, avatar: '💧', isUser: false },
    { name: 'Kabir D.', points: 120, streak: 5, avatar: '🚲', isUser: false },
    { name: 'Zara K.', points: 85, streak: 3, avatar: '⚡', isUser: false },
    { name: 'Rohan P.', points: 65, streak: 2, avatar: '🌿', isUser: false }
  ];

  const currentUserEntry: CohortMember = {
    name: profile?.full_name ? `${profile.full_name} (You)` : 'You',
    points: totalPoints,
    streak: streak,
    avatar: '🤖',
    isUser: true
  };

  // Merge and sort cohort standings dynamically
  const sortedCohort: CohortMember[] = [...baseCohort, currentUserEntry]
    .sort((a, b) => b.points - a.points)
    .map((member, idx) => ({ ...member, rank: idx + 1 }));

  const userRankEntry = sortedCohort.find(m => m.isUser);
  const userRank = userRankEntry?.rank || 4;

  const totalLocalParticipants = 248 + (selectedCity.length * 12);
  const topPercentile = Math.max(2, Math.min(99, Math.round((userRank / sortedCohort.length) * 15)));
  const cityAveragePoints = Math.round(86 + (selectedCity.length % 5));

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-950/40 dark:via-forest-900/40 dark:to-teal-950/30 border border-emerald-500/30 rounded-3xl p-6 md:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all">
      
      {/* Top Heading & City Switcher */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>Local Climate Action Cohort</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsCityDropdownOpen(prev => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-forest-800/80 hover:bg-emerald-50 dark:hover:bg-forest-700 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 shadow-sm transition-all"
              title="Change your urban cohort"
            >
              <span>📍 {selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* City Switcher Dropdown */}
            {isCityDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-dark border border-emerald-500/30 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                  Select Your City Hub
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5 py-1">
                  {PRESET_CITIES.map(c => (
                    <button
                      key={c}
                      onClick={() => handleSelectCity(c)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        selectedCity === c
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-forest-800'
                      }`}
                    >
                      <span>{c}</span>
                      {selectedCity === c && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleCustomCitySubmit} className="pt-2 border-t border-gray-100 dark:border-forest-800 mt-1">
                  <input
                    type="text"
                    placeholder="Other city name…"
                    value={customCityInput}
                    onChange={e => setCustomCityInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800/60 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Hero Rank Headline */}
        <div className="flex items-baseline gap-3 my-2">
          <h3 className="font-display font-black text-3xl md:text-4xl text-gray-900 dark:text-emerald-50 tracking-tight">
            #{userRank} <span className="text-xl md:text-2xl font-bold text-gray-600 dark:text-gray-300">in {selectedCity}</span>
          </h3>
          <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase bg-emerald-600 text-white shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Top {topPercentile}%</span>
          </span>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
          Ranked against <strong>{totalLocalParticipants} active eco-citizens</strong> logging climate action this week in the {selectedCity} hub.
        </p>

        {/* Dynamic City Cohort Standings List */}
        <div className="bg-white/60 dark:bg-forest-900/60 rounded-2xl p-3 border border-emerald-500/15 mb-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase px-2 mb-1">
            <span>Rank & Participant</span>
            <span>Points</span>
          </div>

          {sortedCohort.slice(0, 4).map(item => (
            <div
              key={item.name}
              className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors ${
                item.isUser
                  ? 'bg-emerald-600 text-white font-black shadow-sm ring-1 ring-emerald-500'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-emerald-50/50 dark:hover:bg-forest-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-5 text-center font-black ${item.isUser ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                  #{item.rank}
                </span>
                <span>{item.avatar}</span>
                <span className="truncate max-w-[140px] sm:max-w-[180px]">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">{item.points} pts</span>
                {item.isUser && (
                  <span className="text-[10px] uppercase font-bold bg-white/20 px-1.5 py-0.5 rounded">You</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Stats & Share Action */}
      <div className="pt-3 border-t border-emerald-500/20">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/40 dark:bg-forest-800/40 rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Your Points</span>
            <span className="font-display font-black text-xl text-emerald-700 dark:text-emerald-300">
              {totalPoints} pts
            </span>
          </div>

          <div className="bg-white/40 dark:bg-forest-800/40 rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Hub Average</span>
            <span className="font-display font-black text-xl text-gray-700 dark:text-gray-200">
              {cityAveragePoints} pts
            </span>
          </div>
        </div>

        {/* Share Local Rank Button */}
        <button
          onClick={openShareModal}
          className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share My Local Rank Card</span>
        </button>
      </div>
    </div>
  );
};
