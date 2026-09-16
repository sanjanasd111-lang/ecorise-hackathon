import React from 'react';
import { useEco } from '../../context/EcoContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Dna, Sparkles } from 'lucide-react';

export const HabitDNAChart: React.FC = () => {
  const { habitDNA } = useEco();

  const pieData = habitDNA.breakdown
    .filter(b => b.count > 0)
    .map(b => ({
      name: b.label,
      value: b.count,
      color: b.color
    }));

  const fallbackData = [{ name: 'Start Habits', value: 1, color: '#10b981' }];
  const dataToRender = pieData.length > 0 ? pieData : fallbackData;

  return (
    <div className="bg-white/90 dark:bg-forest-900/90 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Dna className="w-3.5 h-3.5" />
            <span>Unique Eco Profile</span>
          </div>
          <h3 className="font-display font-black text-xl text-gray-900 dark:text-emerald-50">
            Your Eco Habit DNA 🌱
          </h3>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
          Rule-Based AI
        </span>
      </div>

      {/* Archetype Badge */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 border border-emerald-500/25 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-display font-black text-lg text-emerald-900 dark:text-emerald-200">
            {habitDNA.personality}
          </h4>
        </div>
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
          “{habitDNA.tagline}”
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          {habitDNA.description}
        </p>
      </div>

      {/* Visual Chart + Breakdown List */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
        <div className="h-44 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataToRender}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={68}
                paddingAngle={4}
                dataKey="value"
              >
                {dataToRender.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#122119',
                  borderRadius: '10px',
                  border: '1px solid #10b981',
                  color: '#ffffff',
                  fontSize: '11px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="space-y-2.5">
          {habitDNA.breakdown.map(item => (
            <div key={item.category}>
              <div className="flex justify-between text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">
                <span>{item.label}</span>
                <span style={{ color: item.color }}>{item.percentage}% ({item.count})</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-forest-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
