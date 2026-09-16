import React from 'react';
import { useEco } from '../../context/EcoContext';
import { Clock, Flame, Target, CheckCircle, Share2 } from 'lucide-react';

export const WeeklyProgressCard: React.FC = () => {
  const { weeklyPoints, weeklyGoal, completions, streak, openShareModal } = useEco();

  const progressPercent = Math.min(100, Math.round((weeklyPoints / weeklyGoal) * 100));

  // Countdown days remaining to Sunday
  const today = new Date();
  const day = today.getDay();
  const daysRemaining = day === 0 ? 0 : 7 - day;

  // SVG Circular progress math
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.3
  const strokeDashoffset = circumference - (circumference * (progressPercent / 100));

  return (
    <div className="relative overflow-hidden bg-white/90 dark:bg-forest-900/90 backdrop-blur-md border border-emerald-500/20 dark:border-emerald-500/25 rounded-3xl p-6 md:p-8 shadow-eco-card transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-1">
            <span>Weekly Progress Indicator</span>
          </div>
          <h3 className="font-display font-black text-2xl md:text-3xl text-gray-900 dark:text-emerald-50">
            This Week’s Eco Progress
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={openShareModal}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm transition-all"
            title="Share your weekly progress card"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Card</span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-6 md:gap-8">
        
        {/* Left 2 Cols: Numbers, Bar, Stats */}
        <div className="lg:col-span-2 flex flex-col justify-center">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-display font-black text-5xl text-emerald-600 dark:text-emerald-400 leading-none">
              {weeklyPoints}
            </span>
            <span className="text-xl font-bold text-gray-400 dark:text-gray-500">
              / {weeklyGoal} Eco Points
            </span>
          </div>

          {/* Smooth Linear Progress Bar */}
          <div className="w-full h-3.5 bg-gray-100 dark:bg-forest-800 rounded-full overflow-hidden relative mb-6">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 dark:bg-forest-800/60 border border-gray-100 dark:border-forest-800 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span>Done</span>
              </div>
              <div className="font-display font-black text-lg text-gray-900 dark:text-gray-100">
                {completions.length} actions
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-forest-800/60 border border-gray-100 dark:border-forest-800 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                <Flame className="w-3 h-3 text-amber-500" />
                <span>Streak</span>
              </div>
              <div className="font-display font-black text-lg text-amber-600 dark:text-amber-400">
                {streak} days
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-forest-800/60 border border-gray-100 dark:border-forest-800 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                <Target className="w-3 h-3 text-teal-500" />
                <span>Goal</span>
              </div>
              <div className="font-display font-black text-lg text-gray-900 dark:text-gray-100">
                {weeklyGoal} pts
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Circular Progress Dial */}
        <div className="flex justify-center items-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-gray-100 dark:stroke-forest-800 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-emerald-500 fill-none transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-display font-black text-2xl text-emerald-700 dark:text-emerald-300 leading-none">
                {progressPercent}%
              </span>
              <span className="text-[10px] font-extrabold uppercase text-gray-400 dark:text-gray-500 tracking-wider mt-0.5">
                Completed
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
