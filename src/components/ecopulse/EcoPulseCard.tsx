import React, { useState } from 'react';
import { useEco } from '../../context/EcoContext';
import { Vote, BarChart3, CheckCircle2, MessageSquare, Sparkles, ChevronRight } from 'lucide-react';

interface EcoPulseCardProps {
  onExploreMore?: () => void;
}

export const EcoPulseCard: React.FC<EcoPulseCardProps> = ({ onExploreMore }) => {
  const { ecoPulseSurveys, voteSurvey } = useEco();
  const [activeSurveyIndex, setActiveSurveyIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const currentSurvey = ecoPulseSurveys[activeSurveyIndex] || ecoPulseSurveys[0];
  const hasVoted = Boolean(currentSurvey?.userVotedOptionId);

  const handleVoteSubmit = () => {
    if (!selectedOptionId || hasVoted) return;
    voteSurvey(currentSurvey.id, selectedOptionId);
  };

  return (
    <div className="bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/5 dark:from-teal-950/40 dark:via-forest-900/40 dark:to-emerald-950/30 border border-teal-500/30 rounded-3xl p-6 md:p-8 shadow-sm transition-all">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-1">
            <Vote className="w-4 h-4 text-teal-600" />
            <span>EcoPulse • Community Voice Platform</span>
          </div>
          <h3 className="font-display font-black text-2xl md:text-3xl text-gray-900 dark:text-emerald-50">
            Local Environmental Voice
          </h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
            Share feedback on local environmental challenges. Your voice directly guides community climate targets.
          </p>
        </div>

        {/* Survey Switcher Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-center overflow-x-auto pb-1 max-w-full">
          {ecoPulseSurveys.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSurveyIndex(idx);
                setSelectedOptionId(null);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeSurveyIndex === idx
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white/60 dark:bg-forest-800/60 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-forest-700'
              }`}
            >
              Poll #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Community Voice Banner */}
      {currentSurvey.featuredVoice && (
        <div className="p-3.5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/50 border border-teal-500/25 mb-5 flex items-center gap-2.5">
          <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
          <p className="text-xs font-bold text-teal-950 dark:text-teal-200">
            <strong>Community Voice:</strong> “{currentSurvey.featuredVoice}”
          </p>
        </div>
      )}

      {/* Question Header */}
      <div className="mb-4">
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
          {currentSurvey.category}
        </span>
        <h4 className="font-display font-black text-lg md:text-xl text-gray-900 dark:text-white mt-1.5">
          {currentSurvey.question}
        </h4>
      </div>

      {/* Survey Options List */}
      <div className="space-y-2.5 mb-6">
        {currentSurvey.options.map(option => {
          const isSelected = selectedOptionId === option.id;
          const isUserVoted = currentSurvey.userVotedOptionId === option.id;
          const percentage = option.percentage || Math.round((option.votes / Math.max(1, currentSurvey.totalVotes)) * 100);

          return (
            <div
              key={option.id}
              onClick={() => {
                if (!hasVoted) setSelectedOptionId(option.id);
              }}
              className={`relative overflow-hidden rounded-2xl p-3.5 border transition-all ${
                hasVoted
                  ? 'bg-white/70 dark:bg-forest-900/70 border-gray-200/80 dark:border-forest-800'
                  : isSelected
                  ? 'bg-teal-50/80 dark:bg-teal-950/60 border-teal-500 shadow-sm cursor-pointer'
                  : 'bg-white/60 dark:bg-forest-900/50 border-gray-200/70 dark:border-forest-800/60 hover:bg-white dark:hover:bg-forest-800/70 cursor-pointer'
              }`}
            >
              {/* Animated Progress Fill when voted */}
              {hasVoted && (
                <div
                  className={`absolute top-0 bottom-0 left-0 transition-all duration-1000 ${
                    isUserVoted ? 'bg-teal-500/20' : 'bg-gray-100/60 dark:bg-forest-800/40'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {!hasVoted && (
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-teal-600 bg-teal-600' : 'border-gray-400'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  )}

                  <span className={`text-xs font-bold ${
                    isUserVoted ? 'text-teal-700 dark:text-teal-300' : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {option.label}
                  </span>

                  {isUserVoted && (
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-600 text-white">
                      Your Vote
                    </span>
                  )}
                </div>

                {hasVoted && (
                  <span className="font-mono text-xs font-black text-teal-800 dark:text-teal-300">
                    {percentage}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-teal-500/20">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {currentSurvey.totalVotes} total verified community responses
        </span>

        <div className="flex items-center gap-2">
          {!hasVoted ? (
            <button
              onClick={handleVoteSubmit}
              disabled={!selectedOptionId}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedOptionId
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md cursor-pointer'
                  : 'bg-gray-200 dark:bg-forest-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Response
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Response Recorded</span>
            </div>
          )}

          {onExploreMore && (
            <button
              onClick={onExploreMore}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>All Polls</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
