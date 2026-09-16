import React, { useState } from 'react';
import { useEco } from '../context/EcoContext';
import { MessageSquare, Vote, TrendingUp, Sparkles, CheckCircle2, ShieldCheck, Send } from 'lucide-react';

export const EcoPulsePage: React.FC = () => {
  const { ecoPulseSurveys, voteSurvey } = useEco();
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({});
  const [userSuggestion, setUserSuggestion] = useState('');
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);

  const handleVote = (surveyId: string, optionId: string) => {
    setSelectedVotes(prev => ({ ...prev, [surveyId]: optionId }));
    voteSurvey(surveyId, optionId);
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userSuggestion.trim()) {
      setSuggestionSubmitted(true);
      setTimeout(() => {
        setUserSuggestion('');
        setSuggestionSubmitted(false);
      }, 4000);
    }
  };

  const totalVotesAcrossAllSurveys = ecoPulseSurveys.reduce((acc, s) => acc + s.totalVotes, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-900 via-emerald-900 to-forest-900 text-white rounded-3xl p-6 md:p-10 shadow-lg border border-teal-500/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-black uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Civic Climate Opinion</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            EcoPulse — Community Voice
          </h1>
          <p className="text-sm md:text-base text-emerald-100/90 mt-2 leading-relaxed">
            Your voice shapes our collective climate priorities. Vote on civic sustainability policies, inspect consensus trends, and elevate student priorities to municipal leaders.
          </p>

          <div className="flex items-center gap-4 mt-6">
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Total Verified Ballots</div>
              <div className="text-xl font-black text-white">{totalVotesAcrossAllSurveys} Votes</div>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-[10px] font-bold uppercase tracking-wider text-teal-200">Active Polls</div>
              <div className="text-xl font-black text-white">{ecoPulseSurveys.length} Open</div>
            </div>
          </div>
        </div>
      </div>

      {/* Surveys List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {ecoPulseSurveys.map((survey, sIndex) => {
          const hasVoted = Boolean(survey.userVotedOptionId || selectedVotes[survey.id]);
          const currentVotedId = survey.userVotedOptionId || selectedVotes[survey.id];

          return (
            <div 
              key={survey.id}
              className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Poll #{sIndex + 1}: {survey.category}
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    {survey.totalVotes} votes
                  </span>
                </div>

                <h3 className="font-display font-black text-lg text-gray-900 dark:text-emerald-50 mb-3 leading-snug">
                  {survey.question}
                </h3>

                {/* Voting Options & Result Bars */}
                <div className="space-y-2.5 my-4">
                  {survey.options.map(option => {
                    const isSelected = currentVotedId === option.id;

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleVote(survey.id, option.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/30'
                            : 'border-gray-200 dark:border-forest-800 bg-gray-50/50 dark:bg-forest-800/40 hover:border-emerald-400'
                        }`}
                      >
                        {/* Percentage bar underlay */}
                        {hasVoted && (
                          <div 
                            className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${
                              isSelected
                                ? 'bg-emerald-500/20 dark:bg-emerald-500/30'
                                : 'bg-gray-200/50 dark:bg-forest-700/40'
                            }`}
                            style={{ width: `${option.percentage}%` }}
                          />
                        )}

                        <div className="relative z-10 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-gray-300 dark:border-forest-600'
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              {option.label}
                            </span>
                          </div>

                          {hasVoted && (
                            <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                              {option.percentage}%
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Featured Community Voice Insight */}
              <div className="mt-3 p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-500/20 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
                    Community Insight
                  </div>
                  <p className="text-xs font-medium text-teal-900 dark:text-teal-200 mt-0.5">
                    "{survey.featuredVoice}"
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggest a Civic Poll Section */}
      <section className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Vote className="w-4 h-4" />
            <span>Civic Agenda</span>
          </div>
          <h2 className="font-display font-black text-2xl text-gray-900 dark:text-emerald-50">
            Suggest a Community Question
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
            Is there an environmental issue or sustainability policy you want to poll your student cohort or neighborhood on? Submit it to the EcoRise agenda.
          </p>

          <form onSubmit={handleSuggestionSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={userSuggestion}
              onChange={e => setUserSuggestion(e.target.value)}
              placeholder="e.g. Should our campus install solar-powered EV charging stations?"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 bg-white dark:bg-forest-800 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Question</span>
            </button>
          </form>

          {suggestionSubmitted && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your question has been queued for the next weekly cohort ballot.</span>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
