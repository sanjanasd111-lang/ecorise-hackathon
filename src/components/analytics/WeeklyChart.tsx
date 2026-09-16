import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const WeeklyChart: React.FC = () => {
  const { weeklyDailyData } = useAnalytics();

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeklyDailyData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
          <XAxis 
            dataKey="day" 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(18, 33, 25, 0.95)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#ffffff',
              fontSize: '12px'
            }}
            formatter={(value: any) => [`${value} Eco Points`, 'Points Earned']}
            labelFormatter={(label) => `Day: ${label}`}
          />
          <Bar 
            dataKey="points" 
            fill="#10b981" 
            radius={[8, 8, 0, 0]} 
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
