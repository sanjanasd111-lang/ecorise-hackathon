import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

export const LiveFeed: React.FC = () => {
  const feedItems = [
    { id: 1, user: 'A member in Bengaluru', action: 'completed Cycling instead of driving', icon: '🚲', time: '2m ago' },
    { id: 2, user: 'Priya M.', action: 'completed Plant a tree', icon: '🌱', time: '14m ago' },
    { id: 3, user: 'A member in Singapore', action: 'completed Avoid single-use plastic', icon: '🛍️', time: '28m ago' },
    { id: 4, user: 'Marcus L.', action: 'completed Save electricity', icon: '💡', time: '42m ago' },
    { id: 5, user: 'A member in Berlin', action: 'reached Level 2: Sprout Bot', icon: '⚡', time: '1h ago' }
  ];

  return (
    <div className="bg-white/90 dark:bg-forest-900/90 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Activity className="w-3.5 h-3.5" />
            <span>Community Pulse</span>
          </div>
          <h3 className="font-display font-black text-xl text-gray-900 dark:text-emerald-50">
            Live Climate Feed
          </h3>
        </div>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
      </div>

      <div className="space-y-3">
        {feedItems.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 dark:bg-forest-800/40 border border-gray-100 dark:border-forest-800 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{item.icon}</span>
              <div>
                <span className="font-bold text-gray-900 dark:text-gray-100">{item.user} </span>
                <span className="text-gray-500 dark:text-gray-400">{item.action}</span>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
