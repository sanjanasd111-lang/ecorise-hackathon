import React, { useState } from 'react';
import { useEco } from '../context/EcoContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { ShareCardModal } from '../components/modals/ShareCardModal';
import { FileText, Share2, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export const WeeklyReportPage: React.FC = () => {
  const { weeklyPoints, weeklyGoal, streak, impactEquivalents, completions } = useEco();
  const { bestCategory, weekOverWeekChange, prevWeekPoints } = useAnalytics();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Weekly Climate Intelligence Summary</span>
          </div>
          <h1 className="font-display font-black text-3xl text-gray-900 dark:text-white">
            Your Weekly Climate Report
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Synthesizing your completed sustainable habits and environmental impact.
          </p>
        </div>

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all self-start sm:self-center"
        >
          <Share2 className="w-4 h-4" />
          <span>Share My Progress</span>
        </button>
      </div>

      {/* Report Card */}
      <div className="bg-white dark:bg-forest-900 border border-emerald-500/25 rounded-3xl p-8 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-forest-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Weekly Score</span>
            <div className="font-display font-black text-4xl text-emerald-700 dark:text-emerald-400 mt-0.5">
              {weeklyPoints} Eco Points
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{weekOverWeekChange}% vs Prior Week</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">Prior Week: {prevWeekPoints} pts</div>
          </div>
        </div>

        {/* Breakdown Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-forest-800/60 border border-gray-100 dark:border-forest-800">
            <span className="text-xs font-bold text-gray-400 uppercase">Habits Completed</span>
            <div className="font-display font-black text-2xl text-gray-900 dark:text-white mt-1">
              {completions.length} actions
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-forest-800/60 border border-gray-100 dark:border-forest-800">
            <span className="text-xs font-bold text-gray-400 uppercase">Top Habit Area</span>
            <div className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400 mt-1">
              {bestCategory?.name || 'Nature'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-forest-800/60 border border-gray-100 dark:border-forest-800">
            <span className="text-xs font-bold text-gray-400 uppercase">Active Streak</span>
            <div className="font-display font-black text-2xl text-amber-500 mt-1">
              🔥 {streak} Days
            </div>
          </div>
        </div>

        {/* Environmental Statement */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-500/25">
          <h4 className="font-display font-black text-base text-emerald-900 dark:text-emerald-200 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Environmental Impact Summary</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            By choosing sustainable alternatives this week, you supported approximately <strong>{impactEquivalents.treesSupported} saplings</strong>, conserved <strong>{impactEquivalents.waterSavedLiters} Liters of water</strong>, eliminated <strong>{impactEquivalents.plasticAvoidedItems} single-use plastics</strong>, and avoided <strong>~{impactEquivalents.estimatedCo2Kg} kg of CO₂</strong> emissions.
          </p>
        </div>
      </div>

      {/* Share Modal */}
      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
