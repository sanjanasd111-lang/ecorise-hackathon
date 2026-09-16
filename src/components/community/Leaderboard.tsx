import React, { useState } from 'react';
import { useEco } from '../../context/EcoContext';
import { Trophy, Medal } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { leaderboard } = useEco();
  const [filterPeriod, setFilterPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 font-black flex items-center justify-center text-xs">🥇</span>;
      case 2: return <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-black flex items-center justify-center text-xs">🥈</span>;
      case 3: return <span className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 font-black flex items-center justify-center text-xs">🥉</span>;
      default: return <span className="w-7 h-7 rounded-full bg-gray-50 dark:bg-forest-800 text-gray-500 font-black flex items-center justify-center text-xs">{rank}</span>;
    }
  };

  return (
    <div className="bg-white/90 dark:bg-forest-900/90 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>Community Standings</span>
          </div>
          <h3 className="font-display font-black text-xl text-gray-900 dark:text-emerald-50">
            Local & Community Leaderboard
          </h3>
        </div>

        {/* Period Tabs */}
        <div className="inline-flex p-1 bg-gray-100 dark:bg-forest-800 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setFilterPeriod('weekly')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'weekly'
                ? 'bg-white dark:bg-forest-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setFilterPeriod('monthly')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'monthly'
                ? 'bg-white dark:bg-forest-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setFilterPeriod('allTime')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'allTime'
                ? 'bg-white dark:bg-forest-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-2.5">
        {leaderboard.map(entry => (
          <div
            key={entry.id}
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
              entry.isCurrentUser
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border-emerald-500 shadow-sm scale-[1.01]'
                : 'bg-white dark:bg-forest-800/40 border-gray-100 dark:border-forest-800 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3.5">
              {getRankBadge(entry.rank || 1)}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                    {entry.full_name}
                  </span>
                  {entry.isCurrentUser && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <span>📍 {entry.city}</span>
                  <span>•</span>
                  <span>Lvl {entry.level}</span>
                  <span>•</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">🔥 {entry.current_streak}d</span>
                </div>
              </div>
            </div>

            <div className="font-display font-black text-base text-emerald-600 dark:text-emerald-400">
              {entry.total_points} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
