import React from 'react';
import { useEco } from '../../context/EcoContext';
import { Trophy, CheckCircle2 } from 'lucide-react';

export const EcoBossCard: React.FC = () => {
  const { ecoBoss } = useEco();

  const allCategories = [
    { key: 'transport', label: 'Transport', icon: '🚲' },
    { key: 'energy', label: 'Energy', icon: '💡' },
    { key: 'water', label: 'Water', icon: '💧' },
    { key: 'waste', label: 'Waste', icon: '♻️' },
    { key: 'nature', label: 'Nature', icon: '🌱' }
  ];

  const completedCount = ecoBoss.completedCategories.length;
  const progressPercent = Math.round((completedCount / ecoBoss.totalCategories) * 100);

  return (
    <div className="bg-gradient-to-br from-purple-900/10 via-indigo-900/5 to-purple-950/20 border border-purple-500/25 rounded-3xl p-6 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>Weekly Special Challenge</span>
          </div>
          <h3 className="font-display font-black text-xl text-gray-900 dark:text-purple-100">
            {ecoBoss.title}
          </h3>
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-purple-100 dark:bg-purple-950/60 border border-purple-400/40 text-purple-700 dark:text-purple-300 self-start sm:self-center">
          <span>Reward: +{ecoBoss.bonusPoints} pts</span>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
        Diversify your climate habits! Complete at least one activity in each of the 5 sustainability categories this week.
      </p>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-gray-100 dark:bg-forest-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Category Icons Row */}
      <div className="grid grid-cols-5 gap-2">
        {allCategories.map(cat => {
          const isDone = ecoBoss.completedCategories.includes(cat.key as any);
          return (
            <div
              key={cat.key}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                isDone
                  ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-400/50 text-purple-800 dark:text-purple-300 font-bold shadow-sm'
                  : 'bg-white/60 dark:bg-forest-900/40 border-gray-200 dark:border-forest-800 text-gray-400 opacity-60'
              }`}
            >
              <span className="text-xl mb-1">{cat.icon}</span>
              <span className="text-[10px] uppercase font-bold tracking-tight truncate w-full">{cat.label}</span>
              {isDone && <CheckCircle2 className="w-3 h-3 text-purple-600 dark:text-purple-400 mt-1" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
