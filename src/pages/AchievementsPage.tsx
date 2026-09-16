import React from 'react';
import { useEco } from '../context/EcoContext';
import { ParticipantBadges } from '../components/badges/ParticipantBadges';
import { Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const { achievements, unlockedAchievementIds } = useEco();

  const unlockedCount = unlockedAchievementIds.size;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-500/20 mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Milestone Badges</span>
          </div>
          <h1 className="font-display font-black text-3xl text-gray-900 dark:text-white">
            Eco Identity & Achievements
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your 10 civic participant badges and unlock progression milestones dynamically.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-2xl p-3.5 flex items-center gap-4 self-start sm:self-center shadow-sm">
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase">Unlocked</div>
            <div className="font-display font-black text-xl text-emerald-600 dark:text-emerald-400">
              {unlockedCount} / {totalCount} Milestones
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center font-black text-xs text-emerald-700 dark:text-emerald-300">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* 10 Participant Badges Showcase */}
      <ParticipantBadges />

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(badge => {
          const isUnlocked = unlockedAchievementIds.has(badge.id);

          return (
            <div
              key={badge.id}
              className={`relative rounded-3xl p-5 border transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br from-emerald-50/90 to-teal-50/80 dark:from-surface-dark dark:to-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-500/10 scale-[1.01]'
                  : 'bg-white/60 dark:bg-forest-900/50 border-gray-200/80 dark:border-forest-800 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm transition-transform ${
                  isUnlocked
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-gray-100 dark:bg-forest-800 text-gray-400'
                }`}>
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="font-display font-black text-base text-gray-900 dark:text-white truncate">
                      {badge.name}
                    </h4>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-forest-800 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
