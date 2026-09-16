import React from 'react';
import { useEco } from '../context/EcoContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { HabitDNAChart } from '../components/analytics/HabitDNAChart';
import { WeeklyChart } from '../components/analytics/WeeklyChart';
import { Brain, Flame, Target, Trophy, Sparkles, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const IntelligencePage: React.FC = () => {
  const { totalPoints, streak, longestStreak, completions } = useEco();
  const { categoryChartData, bestCategory, weekOverWeekChange } = useAnalytics();

  const totalActions = completions.length;
  const weeklyAverage = Math.round(totalPoints / 4); // Based on monthly cadence

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-2">
          <Brain className="w-3.5 h-3.5" />
          <span>Climate Intelligence Hub</span>
        </div>
        <h1 className="font-display font-black text-3xl text-gray-900 dark:text-white">
          Personal Sustainability Analytics
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Deep telemetry and habit patterns derived from your real completed climate actions.
        </p>
      </div>

      {/* Top Telemetry KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Points</span>
          <div className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400 mt-1">{totalPoints}</div>
        </div>

        <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Actions</span>
          <div className="font-display font-black text-2xl text-gray-900 dark:text-white mt-1">{totalActions}</div>
        </div>

        <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Current Streak</span>
          <div className="font-display font-black text-2xl text-amber-500 mt-1">🔥 {streak}d</div>
        </div>

        <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Longest Streak</span>
          <div className="font-display font-black text-2xl text-orange-600 mt-1">⚡ {longestStreak}d</div>
        </div>

        <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Weekly Average</span>
          <div className="font-display font-black text-2xl text-teal-600 mt-1">~{weeklyAverage} pts</div>
        </div>

        <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Top Category</span>
          <div className="font-display font-black text-lg text-emerald-700 dark:text-emerald-300 mt-1 truncate">
            {bestCategory?.name || 'Nature'}
          </div>
        </div>
      </div>

      {/* Habit DNA Radial Section */}
      <HabitDNAChart />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Trend Chart */}
        <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="font-display font-black text-lg text-gray-900 dark:text-white">
              Weekly Points by Day
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              +{weekOverWeekChange}% vs Last Week
            </span>
          </div>
          <WeeklyChart />
        </div>

        {/* Category Performance Breakdown Chart */}
        <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-6 shadow-sm">
          <h3 className="font-display font-black text-lg text-gray-900 dark:text-white mb-4">
            Category Point Distribution
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#122119',
                    borderRadius: '10px',
                    border: '1px solid #10b981',
                    color: '#ffffff',
                    fontSize: '11px'
                  }}
                  formatter={(val: any) => [`${val} Points`, 'Total Score']}
                />
                <Bar dataKey="points" radius={[0, 6, 6, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
