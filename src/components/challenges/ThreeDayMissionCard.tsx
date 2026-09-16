import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Clock,
  CheckCircle2,
  Circle,
  Shield,
  Sparkles,
  ArrowRight,
  Send,
  AlertCircle,
  RefreshCw,
  Trophy
} from 'lucide-react';
import { playCheckSound, playFanfareSound, playShieldSound } from '../../lib/sound';
import { api } from '../../lib/api';

interface ThreeDayMissionCardProps {
  initialCycle?: any;
  onActionCompleted?: (res: any) => void;
}

export const ThreeDayMissionCard: React.FC<ThreeDayMissionCardProps> = ({
  initialCycle,
  onActionCompleted
}) => {
  const [cycle, setCycle] = useState<any>(initialCycle || null);
  const [loading, setLoading] = useState(false);
  const [completingDay, setCompletingDay] = useState<number | null>(null);
  const [verificationNote, setVerificationNote] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Fetch or refresh active cycle
  const fetchActiveCycle = async () => {
    try {
      setLoading(true);
      const res = await api.challenges.getCurrent();
      setCycle(res.cycle);
    } catch (err) {
      console.warn('Could not fetch active cycle:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialCycle) {
      fetchActiveCycle();
    } else {
      setCycle(initialCycle);
    }
  }, [initialCycle]);

  // Live countdown timer calculation down to the second
  useEffect(() => {
    if (!cycle?.endDate) return;

    const interval = setInterval(() => {
      const endMs = new Date(cycle.endDate).getTime();
      const nowMs = Date.now();
      const diffMs = Math.max(0, endMs - nowMs);

      if (diffMs <= 0 && cycle.status === 'active') {
        // Auto-refresh when expired
        fetchActiveCycle();
        return;
      }

      setRemainingTime({
        days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diffMs / (1000 * 60)) % 60),
        seconds: Math.floor((diffMs / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cycle]);

  const handleCompleteDay = async (dayNumber: number) => {
    try {
      setLoading(true);
      const res = await api.challenges.completeDay({
        dayNumber,
        verificationNote: verificationNote || 'Completed verified micro-action'
      });

      playCheckSound();
      if (res.cycleBonusEarned) {
        playFanfareSound();
        playShieldSound();
      }

      setCycle(res.cycle);
      setCompletingDay(null);
      setVerificationNote('');

      if (onActionCompleted) {
        onActionCompleted(res);
      }
    } catch (err: any) {
      console.error('Error completing day:', err);
      alert(err.message || 'Failed to complete day task.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartNextCycle = async () => {
    try {
      setLoading(true);
      const res = await api.challenges.startNew();
      playCheckSound();
      setCycle(res.cycle);
    } catch (err: any) {
      console.error('Error starting new cycle:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!cycle) {
    return (
      <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-gray-900 dark:text-white">3-Day Climate Mission</h3>
          </div>
          <button
            onClick={fetchActiveCycle}
            disabled={loading}
            className="p-2 rounded-xl bg-gray-100 dark:bg-forest-800 text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading your personalized 3-day mission cycle...</p>
      </div>
    );
  }

  const daysCompletedCount = (cycle.days || []).filter((d: any) => d.completed).length;
  const isExpired = new Date() > new Date(cycle.endDate);
  const isFinished = cycle.allCompleted || daysCompletedCount === 3;

  return (
    <div className="relative bg-gradient-to-br from-white via-emerald-50/30 to-white dark:from-forest-900 dark:via-forest-900 dark:to-forest-950 border border-emerald-500/25 rounded-3xl p-6 shadow-xl overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Mission Cycle #{cycle.cycleNumber || 1}</span>
            </span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
              {daysCompletedCount}/3 Completed
            </span>
          </div>
          <h3 className="font-display font-black text-xl md:text-2xl text-gray-900 dark:text-white mt-1">
            3-Day Climate Sprint
          </h3>
        </div>

        {/* Live Countdown Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-forest-800 border border-emerald-500/20 shadow-sm">
          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <div className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
            {isExpired ? (
              <span className="text-amber-600">Cycle Expired</span>
            ) : (
              <span>
                {remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m {remainingTime.seconds}s
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-gray-100 dark:bg-forest-800 rounded-full overflow-hidden mb-6 relative z-10">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(daysCompletedCount / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* 3 Days Cards */}
      <div className="space-y-3 relative z-10 mb-6">
        {(cycle.days || []).map((task: any) => {
          const isSelected = completingDay === task.day;
          return (
            <div
              key={task.day}
              className={`rounded-2xl border p-4 transition-all ${
                task.completed
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/40 shadow-sm'
                  : 'bg-white dark:bg-forest-800/60 border-gray-200 dark:border-forest-700/80 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 dark:text-forest-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        DAY {task.day}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-forest-700 text-gray-600 dark:text-gray-300 capitalize">
                        {task.category}
                      </span>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        +{task.points} pts
                      </span>
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        ~{task.co2SavingEstimate} kg CO₂e saved
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
                      {task.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                    {task.completed && task.verificationNote && (
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-300 italic mt-1.5 flex items-center gap-1">
                        <span>✓ Verified:</span> “{task.verificationNote}”
                      </p>
                    )}
                  </div>
                </div>

                {/* Complete Button / Status */}
                {!task.completed && !isExpired && (
                  <button
                    onClick={() => setCompletingDay(isSelected ? null : task.day)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    {isSelected ? 'Cancel' : 'Complete'}
                  </button>
                )}
              </div>

              {/* Inline Verification Input when Complete is clicked */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-emerald-500/20"
                  >
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Verification Note / Reflection (Optional):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={verificationNote}
                        onChange={e => setVerificationNote(e.target.value)}
                        placeholder="e.g. Took the metro line 2, walked 3km, unplugged all idle cords"
                        className="flex-1 px-3 py-2 rounded-xl text-xs border border-gray-300 dark:border-forest-700 bg-white dark:bg-forest-900 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                      />
                      <button
                        onClick={() => handleCompleteDay(task.day)}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Completion Banner with Bonus Rewards */}
      {isFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-amber-500/30 text-center relative z-10 mb-4"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
            <Trophy className="w-5 h-5" />
          </div>
          <h4 className="font-display font-black text-base text-gray-900 dark:text-white">
            Mission Cycle #{cycle.cycleNumber} Accomplished! 🎯
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto mt-1 mb-3">
            You completed all 3 days! You unlocked <strong>+50 Bonus Points</strong> and earned a protective <strong>Eco Shield 🛡️</strong>.
          </p>
          <button
            onClick={handleStartNextCycle}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <span>Start Next 3-Day Sprint</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Expired Prompt if not all completed */}
      {!isFinished && isExpired && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>This 3-day sprint has concluded.</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Every step counts toward climate action! Start a fresh 3-day mission cycle with new dynamic challenges.
          </p>
          <button
            onClick={handleStartNextCycle}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Next Cycle</span>
          </button>
        </div>
      )}
    </div>
  );
};
