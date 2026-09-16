import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EcoByte } from '../mascot/EcoByte';
import {
  CheckCircle2,
  Circle,
  Flag,
  Sparkles,
  MapPin,
  Shield,
  Award,
  ChevronRight
} from 'lucide-react';

interface ClimateJourneyCardProps {
  userPoints?: number;
  streak?: number;
  completedActivitiesCount?: number;
  onboardingCompleted?: boolean;
}

export const ClimateJourneyCard: React.FC<ClimateJourneyCardProps> = ({
  userPoints = 0,
  streak = 0,
  completedActivitiesCount = 0,
  onboardingCompleted = true
}) => {
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);

  const stops = [
    {
      id: 1,
      title: 'Baseline Onboarding',
      subtitle: 'Mobility Footprint Established',
      icon: '🌱',
      desc: 'Completed initial DEFRA-aligned commute questionnaire and personalized starting baseline.',
      isUnlocked: onboardingCompleted,
      progress: onboardingCompleted ? 100 : 0
    },
    {
      id: 2,
      title: 'First Green Commute',
      subtitle: 'Micro-Habit Shift',
      icon: '🚲',
      desc: 'Replaced a fuel-powered trip with walking, cycling, or municipal public transit.',
      isUnlocked: completedActivitiesCount >= 1 || userPoints >= 25,
      progress: (completedActivitiesCount >= 1 || userPoints >= 25) ? 100 : Math.min(100, (userPoints / 25) * 100)
    },
    {
      id: 3,
      title: '3-Day Mission Sprint',
      subtitle: 'Verified Consistency',
      icon: '🎯',
      desc: 'Completed all 3 daily micro-actions of a structured 3-Day Climate Mission cycle.',
      isUnlocked: userPoints >= 100,
      progress: userPoints >= 100 ? 100 : Math.min(100, (userPoints / 100) * 100)
    },
    {
      id: 4,
      title: '7-Day Streak & Eco Shield',
      subtitle: 'Protected Habit Momentum',
      icon: '🛡️',
      desc: 'Maintained an unbroken 7-day streak and unlocked an Eco Shield.',
      isUnlocked: streak >= 7 || userPoints >= 200,
      progress: streak >= 7 ? 100 : Math.min(100, (streak / 7) * 100)
    },
    {
      id: 5,
      title: 'Civic Leadership',
      subtitle: 'SDG 13 Certified Champion',
      icon: '🏅',
      desc: 'Accumulated over 250+ Eco Points and qualified for the Official Civic Recognition Certificate.',
      isUnlocked: userPoints >= 250,
      progress: userPoints >= 250 ? 100 : Math.min(100, (userPoints / 250) * 100)
    }
  ];

  // Current stop index where EcoByte should reside
  let currentStopIndex = 0;
  for (let i = 0; i < stops.length; i++) {
    if (stops[i].isUnlocked) {
      currentStopIndex = i;
    }
  }

  const selectedStop = stops[activeStopIndex] || stops[currentStopIndex];

  return (
    <div className="relative bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 dark:from-forest-900 dark:via-forest-900 dark:to-forest-950 border border-emerald-500/25 rounded-3xl p-6 shadow-xl overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Visual Metro Path</span>
          </div>
          <h3 className="font-display font-black text-xl md:text-2xl text-gray-900 dark:text-white mt-1">
            Your Climate Journey 🚇
          </h3>
        </div>

        <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
          Stop {currentStopIndex + 1} of {stops.length} Reached
        </div>
      </div>

      {/* Subway Line Graphic */}
      <div className="relative py-6 px-4 mb-6 z-10 overflow-x-auto">
        <div className="min-w-[600px] relative">
          {/* Base Track Line */}
          <div className="absolute top-1/2 left-6 right-6 h-2 bg-gray-200 dark:bg-forest-800 -translate-y-1/2 rounded-full" />

          {/* Active Progress Track Fill */}
          <div
            className="absolute top-1/2 left-6 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 -translate-y-1/2 rounded-full transition-all duration-700"
            style={{ width: `${(currentStopIndex / (stops.length - 1)) * 92}%` }}
          />

          {/* Stops along the line */}
          <div className="relative flex justify-between items-center">
            {stops.map((stop, idx) => {
              const isPassed = idx <= currentStopIndex;
              const isCurrent = idx === currentStopIndex;

              return (
                <div
                  key={stop.id}
                  onClick={() => setActiveStopIndex(idx)}
                  className="flex flex-col items-center cursor-pointer group select-none"
                >
                  {/* EcoByte Sprite indicator over the current stop */}
                  <div className="h-14 flex items-end justify-center mb-1">
                    {isCurrent && (
                      <motion.div
                        initial={{ y: -8, scale: 0.8 }}
                        animate={{ y: [0, -6, 0], scale: 1 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="flex flex-col items-center"
                      >
                        <EcoByte stage={Math.min(4, idx)} size={48} interactive={false} />
                        <span className="text-[10px] font-black bg-emerald-600 text-white px-1.5 py-0.2 rounded-full shadow-xs mt-0.5">
                          EcoByte Here
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Node Circle */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base font-bold transition-all shadow-md ${
                      isPassed
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                        : 'bg-white dark:bg-forest-800 text-gray-400 border border-gray-300 dark:border-forest-700'
                    } ${activeStopIndex === idx ? 'scale-115 ring-4 ring-teal-400' : ''}`}
                  >
                    <span>{stop.icon}</span>
                  </div>

                  {/* Stop Label */}
                  <div className="text-center mt-2 w-28">
                    <div
                      className={`text-xs font-black truncate ${
                        isPassed ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                      }`}
                    >
                      {stop.title}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">Stop #{stop.id}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Stop Details Callout */}
      {selectedStop && (
        <div className="p-4 rounded-2xl bg-white dark:bg-forest-800/70 border border-emerald-500/20 shadow-sm flex items-start gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl flex-shrink-0">
            {selectedStop.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                Stop {selectedStop.id}: {selectedStop.title}
              </h4>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  selectedStop.isUnlocked
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                    : 'bg-gray-100 dark:bg-forest-700 text-gray-500'
                }`}
              >
                {selectedStop.isUnlocked ? 'Unlocked ✓' : 'In Progress'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {selectedStop.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
