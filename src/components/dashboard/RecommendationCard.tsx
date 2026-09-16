import React from 'react';
import { useEco } from '../../context/EcoContext';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

interface RecommendationCardProps {
  onSelectChallenge?: (challengeId: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ onSelectChallenge }) => {
  const { challenges, completions, completeChallenge } = useEco();

  // Find category with lowest completion count
  const todayStr = new Date().toISOString().split('T')[0];
  const completedTodayIds = new Set(
    completions.filter(c => c.completed_at.startsWith(todayStr)).map(c => c.challenge_id)
  );

  // Pick uncompleted challenge
  const recommendedChallenge = challenges.find(c => !completedTodayIds.has(c.id)) || challenges[0];
  const isCompleted = completedTodayIds.has(recommendedChallenge.id);

  const handleTakeChallenge = () => {
    if (onSelectChallenge) {
      onSelectChallenge(recommendedChallenge.id);
    } else {
      completeChallenge(recommendedChallenge.id);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-teal-500/25 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-2xl flex-shrink-0">
          {recommendedChallenge.icon}
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Recommendation Engine</span>
          </div>
          <h4 className="font-display font-black text-lg text-gray-900 dark:text-teal-50 leading-tight">
            Next Best Action: {recommendedChallenge.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-md leading-relaxed">
            {recommendedChallenge.description} Earn <strong className="text-emerald-600 dark:text-emerald-400">+{recommendedChallenge.points} points</strong> and expand your weekly habit diversity.
          </p>
        </div>
      </div>

      <button
        onClick={handleTakeChallenge}
        disabled={isCompleted}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex-shrink-0 ${
          isCompleted
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/20'
        }`}
      >
        {isCompleted ? (
          <>
            <Check className="w-4 h-4" />
            <span>Completed Today</span>
          </>
        ) : (
          <>
            <span>Take This Challenge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </div>
  );
};
