import React, { useState } from 'react';
import { useEco } from '../context/EcoContext';
import { Calendar as CalendarIcon, CheckCircle2, Flame, Sparkles } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { completions, challenges } = useEco();
  const challengeMap = new Map(challenges.map(c => [c.id, c]));

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Generate current month days (e.g. current 30/31 days)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun

  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Map dates to completions
  const completionsByDate: Record<string, typeof completions> = {};
  completions.forEach(c => {
    const dStr = c.completed_at.split('T')[0];
    if (!completionsByDate[dStr]) completionsByDate[dStr] = [];
    completionsByDate[dStr].push(c);
  });

  const selectedCompletions = completionsByDate[selectedDate] || [];
  const selectedPoints = selectedCompletions.reduce((sum, c) => sum + c.points_earned, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-2">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Activity Log & History</span>
        </div>
        <h1 className="font-display font-black text-3xl text-gray-900 dark:text-white">
          Eco Habit Calendar
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review your daily green habit consistency across the entire month.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-forest-800">
            <h3 className="font-display font-black text-xl text-gray-900 dark:text-white">
              {monthName}
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              🟢 Green days have completed actions
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <span key={d} className="text-xs font-bold text-gray-400 uppercase tracking-wider">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Blank offset days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="h-14 rounded-2xl bg-gray-50/40 dark:bg-forest-800/20 opacity-30" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayCompletions = completionsByDate[dateStr] || [];
              const hasActivity = dayCompletions.length > 0;
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-14 rounded-2xl flex flex-col items-center justify-center p-1.5 border transition-all text-xs font-bold relative ${
                    isSelected
                      ? 'ring-2 ring-emerald-500 scale-105 z-10 shadow-md'
                      : ''
                  } ${
                    hasActivity
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'bg-white dark:bg-forest-900 border-gray-100 dark:border-forest-800 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasActivity && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Card */}
        <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-forest-800">
              <h4 className="font-display font-black text-lg text-gray-900 dark:text-white">
                {selectedDate} Details
              </h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                +{selectedPoints} pts
              </span>
            </div>

            {selectedCompletions.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 dark:text-gray-500">
                No recorded climate actions on this day.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedCompletions.map(c => {
                  const ch = challengeMap.get(c.challenge_id);
                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-forest-800/60 border border-gray-100 dark:border-forest-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span>{ch?.icon || '🌱'}</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200">{ch?.title || 'Eco Action'}</span>
                      </div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">+{c.points_earned} pts</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-forest-800 text-[11px] text-gray-400 text-center">
            Consistent daily check-ins keep your Eco Streak active!
          </div>
        </div>

      </div>
    </div>
  );
};
