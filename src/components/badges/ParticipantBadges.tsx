import React, { useState } from 'react';
import { useEco } from '../../context/EcoContext';
import { ParticipantBadge } from '../../types/database';
import { Award, CheckCircle2, Lock, Sparkles, Calendar, ArrowRight } from 'lucide-react';

export const ParticipantBadges: React.FC = () => {
  const { badges, levelInfo } = useEco();
  const [selectedBadge, setSelectedBadge] = useState<ParticipantBadge | null>(null);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <section className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-sm transition-all">
      
      {/* Header with Eco Identity badge count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Award className="w-4 h-4" />
            <span>Participant Eco Identity</span>
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900 dark:text-emerald-50">
            Civic Participant Badges
          </h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Earned automatically as you complete local climate actions and build your sustainable identity.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 self-start sm:self-center">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-extrabold">
            {unlockedCount} of {badges.length} Badges Unlocked
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {badges.map(badge => {
          const percent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-white to-emerald-50/50 dark:from-forest-800/90 dark:to-forest-900/90 border-emerald-500/40 shadow-sm hover:shadow-md hover:scale-[1.02] ring-1 ring-emerald-500/20'
                  : 'bg-gray-50/70 dark:bg-forest-900/40 border-gray-200/80 dark:border-forest-800/60 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Badge Icon & Unlocked Status */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr from-emerald-500/20 to-teal-500/30 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-gray-200/60 dark:bg-forest-800/60 text-gray-400 grayscale'
                  }`}>
                    {badge.icon}
                  </div>

                  {badge.unlocked ? (
                    <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" title="Unlocked">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-full bg-gray-100 dark:bg-forest-800 text-gray-400" title="Locked">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <h3 className={`font-display font-black text-sm mb-1 leading-tight ${
                  badge.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {badge.name}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress & Timestamp */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-forest-800/60">
                {badge.unlocked ? (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <Calendar className="w-3 h-3" />
                    <span>Earned {badge.unlockedAt || 'Recently'}</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{badge.progress}/{badge.maxProgress}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-forest-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal when badge is tapped */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-sm w-full bg-white dark:bg-forest-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl text-center relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-4xl mb-4 shadow-md">
              {selectedBadge.icon}
            </div>

            <h3 className="font-display font-black text-xl text-gray-900 dark:text-white mb-1">
              {selectedBadge.name}
            </h3>
            
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 px-2">
              {selectedBadge.description}
            </p>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-forest-800/60 border border-emerald-500/20 mb-5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {selectedBadge.unlocked ? (
                <span>🎉 Unlocked on {selectedBadge.unlockedAt || 'this week'}</span>
              ) : (
                <span>🔒 In Progress: {selectedBadge.progress} / {selectedBadge.maxProgress} completed</span>
              )}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
