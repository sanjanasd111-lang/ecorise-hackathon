import React from 'react';
import { useEco } from '../../context/EcoContext';
import { Shield, Sparkles } from 'lucide-react';

export const StreakShieldCard: React.FC = () => {
  const { streakShields, streak } = useEco();

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-600/15 border border-amber-500/25 rounded-3xl p-5 md:p-6 shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Streak Protection</span>
          </div>
          <h4 className="font-display font-black text-lg text-gray-900 dark:text-amber-100 leading-tight">
            Eco Streak Shield ({streakShields} Available)
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-sm leading-relaxed">
            Missed a busy day? Your Streak Shield automatically protects your {streak}-day eco streak from resetting once.
          </p>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-center justify-center p-3 bg-white/80 dark:bg-forest-900/80 rounded-2xl border border-amber-500/20 text-center flex-shrink-0">
        <span className="text-xl">🛡️</span>
        <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider mt-0.5">Active</span>
      </div>
    </div>
  );
};
