import React from 'react';
import { useEco } from '../../context/EcoContext';
import { Users, Globe2 } from 'lucide-react';

export const CommunityMeter: React.FC = () => {
  const { completions } = useEco();

  const baselineActions = 328;
  const totalActions = baselineActions + completions.length;
  const goalActions = 500;
  const progressPercent = Math.min(100, Math.round((totalActions / goalActions) * 100));

  return (
    <div className="bg-white/90 dark:bg-forest-900/90 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Collective Goal</span>
          </div>
          <h3 className="font-display font-black text-xl text-gray-900 dark:text-emerald-50">
            500 Eco-Actions Together
          </h3>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-gray-400">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>124 Active Members</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400">
          {totalActions} <span className="text-sm font-bold text-gray-400">/ {goalActions} actions</span>
        </span>
        <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
          {progressPercent}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-100 dark:bg-forest-800 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-700 shadow-sm"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Every challenge you complete adds directly to our local collective climate impact counter.
      </p>
    </div>
  );
};
