import React from 'react';
import { Flame, Shield, Sparkles, CheckCircle2, Calendar } from 'lucide-react';

interface StreakTrackerProps {
  streak: number;
  longestStreak?: number;
  shields: number;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({
  streak = 0,
  longestStreak = 0,
  shields = 1
}) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate which day of the week today is (0 = Mon, 6 = Sun)
  const jsDay = new Date().getDay(); // 0 = Sun, 1 = Mon ...
  const currentDayIndex = jsDay === 0 ? 6 : jsDay - 1;

  return (
    <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shadow-xs">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-black text-lg text-gray-900 dark:text-white">
                {streak} Day {streak === 1 ? 'Streak' : 'Streaks'}
              </h3>
              {streak >= 3 && (
                <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white uppercase">
                  On Fire 🔥
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Personal Best: {Math.max(streak, longestStreak)} days
            </p>
          </div>
        </div>

        {/* Eco Shield Indicator */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-forest-800 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-600/20" />
          <span>{shields} {shields === 1 ? 'Eco Shield' : 'Eco Shields'} Ready</span>
        </div>
      </div>

      {/* Mon-Sun Day Pills */}
      <div className="grid grid-cols-7 gap-1.5 mb-3">
        {daysOfWeek.map((day, idx) => {
          // If streak covers this day or it's today with active action
          const isCompleted = idx <= currentDayIndex && (currentDayIndex - idx) < streak;
          const isToday = idx === currentDayIndex;

          return (
            <div
              key={day}
              className={`p-2 rounded-2xl text-center border transition-all ${
                isCompleted
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                  : isToday
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200'
                  : 'bg-gray-50 dark:bg-forest-800/60 border-gray-100 dark:border-forest-700 text-gray-400'
              }`}
            >
              <div className="text-[10px] font-bold uppercase">{day}</div>
              <div className="mt-1 flex justify-center">
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-forest-600 mt-1" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouraging Context Message */}
      <div className="text-[11px] text-gray-500 dark:text-gray-400 text-center leading-snug">
        {streak === 0 ? (
          <span>Take any micro-action today to ignite your streak! Consistency builds planet-saving momentum.</span>
        ) : (
          <span>Your Eco Shield automatically protects 1 missed day without breaking your streak count! 🛡️</span>
        )}
      </div>
    </div>
  );
};
