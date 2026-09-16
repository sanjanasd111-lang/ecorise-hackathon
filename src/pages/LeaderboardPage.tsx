import React from 'react';
import { Leaderboard } from '../components/community/Leaderboard';
import { LocalRankCard } from '../components/community/LocalRankCard';
import { LeaderboardPodium } from '../components/community/LeaderboardPodium';
import { CommunityMeter } from '../components/community/CommunityMeter';
import { LiveFeed } from '../components/community/LiveFeed';
import { Trophy, Users } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>Local Community Standings</span>
        </div>
        <h1 className="font-display font-black text-3xl text-gray-900 dark:text-white">
          Community Leaderboard & Pulse
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Compete constructively with friends and neighbors to maximize local climate impact.
        </p>
      </div>

      {/* 3D Olympic Visual Podium */}
      <LeaderboardPodium />

      {/* Top Dual Cards: Local Rank + Community Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LocalRankCard />
        <CommunityMeter />
      </div>

      {/* Main Leaderboard + Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Leaderboard />
        </div>
        <div>
          <LiveFeed />
        </div>
      </div>
    </div>
  );
};
