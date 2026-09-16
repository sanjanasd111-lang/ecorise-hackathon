import React from 'react';
import { useChallenges } from '../hooks/useChallenges';
import { ChallengeCard } from '../components/dashboard/ChallengeCard';
import { Search, CalendarDays } from 'lucide-react';

export const ChallengesPage: React.FC = () => {
  const { 
    challenges, 
    allChallenges, 
    completedTodayIds, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery 
  } = useChallenges();

  const categories = [
    { key: 'all', label: 'All Challenges' },
    { key: 'energy', label: 'Energy' },
    { key: 'water', label: 'Water' },
    { key: 'transport', label: 'Transport' },
    { key: 'waste', label: 'Waste' },
    { key: 'nature', label: 'Nature' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Smart Weekly Challenge Rotation</span>
          </div>
          <h1 className="font-display font-black text-3xl text-gray-900 dark:text-white">
            Eco Challenges Catalog
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete daily sustainable habits across transport, waste, energy, water, and nature.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search eco actions…"
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-white dark:bg-forest-800 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const count = cat.key === 'all' 
            ? allChallenges.length 
            : allChallenges.filter(c => c.category === cat.key).length;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-800'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            isCompleted={completedTodayIds.has(challenge.id)}
          />
        ))}
      </div>
    </div>
  );
};
