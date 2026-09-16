import React from 'react';
import { useEco } from '../../context/EcoContext';
import { Sparkles, Compass, Share2 } from 'lucide-react';

export const MyImpactStoryCard: React.FC = () => {
  const { climateStory, openShareModal, levelInfo } = useEco();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-forest-900 to-teal-950 text-white rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-xl transition-all">
      {/* Decorative ambient gradients */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Signature Climate Story</span>
          </div>

          <button
            onClick={openShareModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Story</span>
          </button>
        </div>

        <h3 className="font-display font-black text-2xl md:text-3xl text-white mb-2">
          {climateStory.title}
        </h3>

        <p className="text-sm md:text-base text-emerald-100/90 font-serif leading-relaxed max-w-2xl mb-6">
          “{climateStory.narrative}”
        </p>

        {/* Dynamic Story Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
            <span className="text-xl mb-0.5 block">🌱</span>
            <div className="font-display font-black text-lg text-white">
              {climateStory.stats.actionsCount}
            </div>
            <div className="text-[10px] uppercase font-bold text-emerald-300">
              Eco Actions
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
            <span className="text-xl mb-0.5 block">🚌</span>
            <div className="font-display font-black text-lg text-white">
              {climateStory.stats.greenCommutesCount}
            </div>
            <div className="text-[10px] uppercase font-bold text-emerald-300">
              Green Commutes
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
            <span className="text-xl mb-0.5 block">♻️</span>
            <div className="font-display font-black text-lg text-white">
              {climateStory.stats.wasteActionsCount}
            </div>
            <div className="text-[10px] uppercase font-bold text-emerald-300">
              Waste Actions
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
            <span className="text-xl mb-0.5 block">💡</span>
            <div className="font-display font-black text-lg text-white">
              {climateStory.stats.energyActionsCount}
            </div>
            <div className="text-[10px] uppercase font-bold text-emerald-300">
              Energy Actions
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center col-span-2 sm:col-span-1">
            <span className="text-xl mb-0.5 block">🏆</span>
            <div className="font-display font-black text-lg text-white">
              {climateStory.stats.badgesEarnedCount}
            </div>
            <div className="text-[10px] uppercase font-bold text-amber-300">
              Badges Earned
            </div>
          </div>
        </div>

        {/* Signature Motto Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/15 text-xs text-emerald-200/80">
          <div className="font-serif italic tracking-wide">
            “{climateStory.motto}”
          </div>
          <div className="font-bold text-[11px] text-emerald-300">
            {levelInfo.title} • Level {levelInfo.level}
          </div>
        </div>
      </div>
    </div>
  );
};
