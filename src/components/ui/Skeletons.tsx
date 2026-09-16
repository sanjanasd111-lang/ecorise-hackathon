import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white/60 dark:bg-forest-900/60 border border-gray-100 dark:border-forest-800 rounded-3xl p-6 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-forest-800 rounded-full w-1/3 mb-4"></div>
      <div className="h-8 bg-gray-200 dark:bg-forest-800 rounded-xl w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 dark:bg-forest-800 rounded-full w-full mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-forest-800 rounded-full w-2/3"></div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white/60 dark:bg-forest-900/60 border border-gray-100 dark:border-forest-800 rounded-3xl p-6 animate-pulse h-64 flex flex-col justify-between">
      <div className="h-4 bg-gray-200 dark:bg-forest-800 rounded-full w-1/4"></div>
      <div className="flex items-end justify-between gap-3 h-40">
        {[40, 75, 55, 90, 60, 80, 45].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-200 dark:bg-forest-800 rounded-t-xl"
            style={{ height: `${h}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};
