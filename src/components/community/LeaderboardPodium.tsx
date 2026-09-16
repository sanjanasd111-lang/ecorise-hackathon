import React, { useRef } from 'react';
import { useEco } from '../../context/EcoContext';
import { Trophy, Flame, Award, ChevronDown, User, Sparkles } from 'lucide-react';
import { EcoByte } from '../mascot/EcoByte';

export const LeaderboardPodium: React.FC = () => {
  const { 
    leaderboard, 
    leaderboardTimeframe, 
    setLeaderboardTimeframe, 
    levelInfo 
  } = useEco();

  const myRankRef = useRef<HTMLDivElement>(null);

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const currentUserEntry = leaderboard.find(l => l.isCurrentUser);

  const scrollToMyRank = () => {
    myRankRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-sm transition-all space-y-6">
      
      {/* Top Header Row & Timeframe Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span>Civic Standings</span>
          </div>
          <h3 className="font-display font-black text-2xl md:text-3xl text-gray-900 dark:text-emerald-50">
            EcoRise Community Leaderboard
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Demo Community Leaderboard — Top climate action leaders inspiring our local cohort.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Timeframe Toggles */}
          <div className="inline-flex rounded-xl bg-gray-100 dark:bg-forest-800 p-1 border border-gray-200 dark:border-forest-700">
            {(['weekly', 'monthly', 'all-time'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setLeaderboardTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all capitalize ${
                  leaderboardTimeframe === tf
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600'
                }`}
              >
                {tf === 'all-time' ? 'All Time' : tf}
              </button>
            ))}
          </div>

          {/* Jump to My Rank Button */}
          {currentUserEntry && (
            <button
              onClick={scrollToMyRank}
              className="px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-colors"
            >
              My Rank (#{currentUserEntry.rank})
            </button>
          )}
        </div>
      </div>

      {/* Visual Olympic Podium Section */}
      <div className="pt-4 pb-2 border-b border-gray-100 dark:border-forest-800">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Mascot Commentary Beside Podium */}
          <div className="flex items-center gap-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/25 rounded-2xl p-4 max-w-sm w-full">
            <div className="w-14 h-14 flex-shrink-0">
              <EcoByte stage={levelInfo.stage} size={54} interactive={false} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                EcoByte Commentary
              </span>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug">
                “Who will become this week’s Climate Champion? Every local action shifts the podium!”
              </p>
            </div>
          </div>

          {/* 3D Visual Podium (Left #2, Center #1, Right #3) */}
          <div className="flex items-end justify-center gap-2 sm:gap-4 flex-1 w-full max-w-lg pt-8">
            
            {/* 🥈 #2 Silver Podium (Left) */}
            {top2 && (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 flex items-center justify-center text-xl mb-2 shadow-md relative">
                  <span>{top2.avatar_url || '🌱'}</span>
                  <span className="absolute -bottom-1 -right-1 text-xs">🥈</span>
                </div>
                <div className="font-display font-black text-xs sm:text-sm text-gray-900 dark:text-white truncate max-w-[90px] text-center">
                  {top2.full_name}
                </div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {top2.total_points} pts
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 text-amber-500" />
                  <span>{top2.current_streak}d</span>
                </div>
                
                {/* Podium Block #2 */}
                <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-2xl border-t-4 border-slate-400 flex flex-col items-center justify-center shadow-inner mt-2">
                  <span className="font-display font-black text-2xl text-slate-600 dark:text-slate-300">#2</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Silver</span>
                </div>
              </div>
            )}

            {/* 🥇 #1 Gold Champion Podium (Center - Tallest) */}
            {top1 && (
              <div className="flex-1 flex flex-col items-center -mt-6">
                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950 border-2 border-amber-400 flex items-center justify-center text-2xl mb-2 shadow-lg ring-4 ring-amber-400/20 relative">
                  <span>{top1.avatar_url || '🌿'}</span>
                  <span className="absolute -bottom-1 -right-1 text-sm">🥇</span>
                </div>
                <div className="font-display font-black text-sm sm:text-base text-gray-900 dark:text-white truncate max-w-[110px] text-center">
                  {top1.full_name}
                </div>
                <div className="text-xs font-black text-amber-600 dark:text-amber-400">
                  {top1.total_points} pts
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>{top1.current_streak}d streak</span>
                </div>
                
                {/* Podium Block #1 */}
                <div className="w-full h-32 sm:h-36 bg-gradient-to-t from-amber-200 to-amber-100 dark:from-amber-950 dark:to-amber-900/80 rounded-t-2xl border-t-4 border-amber-400 flex flex-col items-center justify-center shadow-md mt-2">
                  <span className="font-display font-black text-3xl text-amber-700 dark:text-amber-300">#1</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-400">Champion</span>
                </div>
              </div>
            )}

            {/* 🥉 #3 Bronze Podium (Right) */}
            {top3 && (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-700 flex items-center justify-center text-xl mb-2 shadow-md relative">
                  <span>{top3.avatar_url || '🌳'}</span>
                  <span className="absolute -bottom-1 -right-1 text-xs">🥉</span>
                </div>
                <div className="font-display font-black text-xs sm:text-sm text-gray-900 dark:text-white truncate max-w-[90px] text-center">
                  {top3.full_name}
                </div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {top3.total_points} pts
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 text-amber-500" />
                  <span>{top3.current_streak}d</span>
                </div>
                
                {/* Podium Block #3 */}
                <div className="w-full h-20 sm:h-24 bg-gradient-to-t from-amber-100 to-amber-50 dark:from-amber-950/80 dark:to-amber-900/60 rounded-t-2xl border-t-4 border-amber-600 flex flex-col items-center justify-center shadow-inner mt-2">
                  <span className="font-display font-black text-xl text-amber-800 dark:text-amber-400">#3</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Bronze</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Community Participants List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400 px-4 py-1">
          <span>Rank & Citizen</span>
          <div className="flex items-center gap-6">
            <span>Streak</span>
            <span>Eco Points</span>
          </div>
        </div>

        {leaderboard.map(entry => {
          const isCurrentUser = entry.isCurrentUser;

          return (
            <div
              key={entry.id}
              ref={isCurrentUser ? myRankRef : undefined}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                isCurrentUser
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/40 font-bold'
                  : 'bg-white/60 dark:bg-forest-900/60 border-gray-100 dark:border-forest-800 hover:bg-white dark:hover:bg-forest-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 text-center font-black ${
                  isCurrentUser ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  #{entry.rank}
                </span>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  isCurrentUser ? 'bg-white/20' : 'bg-emerald-100 dark:bg-forest-800'
                }`}>
                  {entry.avatar_url || '🌱'}
                </div>

                <div>
                  <div className="text-xs font-black flex items-center gap-1.5">
                    <span>{entry.full_name}</span>
                    {isCurrentUser && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-white/25">
                        You
                      </span>
                    )}
                  </div>
                  <div className={`text-[10px] ${isCurrentUser ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {entry.city} • Level {entry.level}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-xs font-bold">
                  <Flame className={`w-3.5 h-3.5 ${isCurrentUser ? 'text-amber-300' : 'text-amber-500'}`} />
                  <span>{entry.current_streak}d</span>
                </div>

                <div className={`font-mono font-black text-sm min-w-[70px] text-right ${
                  isCurrentUser ? 'text-white' : 'text-emerald-700 dark:text-emerald-300'
                }`}>
                  {entry.total_points} pts
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
