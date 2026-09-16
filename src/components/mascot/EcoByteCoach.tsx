import React, { useState } from 'react';
import { useEco } from '../../context/EcoContext';
import { EcoByte } from './EcoByte';
import { Sparkles, Lightbulb } from 'lucide-react';

const ECO_FACTS = [
  "Switching to a refillable water bottle prevents ~156 single-use plastic bottles annually!",
  "A single mature tree absorbs up to 22 kg of carbon dioxide every year while releasing fresh oxygen.",
  "Public transit reduces personal commute carbon emissions by up to 45% compared to solo driving.",
  "Taking a 5-minute shower instead of a 10-minute one saves up to 40 liters of clean water every time.",
  "Recycling one aluminum can saves enough electricity to power a laptop for more than three hours!"
];

export const EcoByteCoach: React.FC = () => {
  const { weeklyPoints, weeklyGoal, completions, levelInfo } = useEco();
  const [factIndex, setFactIndex] = useState(0);
  const [customTip, setCustomTip] = useState<string | null>(null);

  const getDynamicMessage = () => {
    if (customTip) return customTip;

    if (weeklyPoints >= weeklyGoal) {
      return "WOW! You did it! You’ve reached your weekly goal and powered a greener future! 🌍⚡";
    }

    const pointsRemaining = weeklyGoal - weeklyPoints;
    if (pointsRemaining <= 20 && pointsRemaining > 0) {
      return `You're so close! Only ${pointsRemaining} points away from your weekly goal! 🚀`;
    }

    if (weeklyPoints >= 50) {
      return "Your eco-energy is getting stronger! You're past halfway! Keep the momentum going! 🌿";
    }

    if (completions.length === 1) {
      return "YES! Your first climate action is officially recorded! Small habits, big impact! 🌱";
    }

    if (weeklyPoints >= 20) {
      return "Nice start! Your eco-energy is growing and EcoByte's plant is thriving! ⚡";
    }

    return "Hey! I’m EcoByte 🌱 Ready to make your first climate habit move?";
  };

  const handlePoke = () => {
    const tip = ECO_FACTS[factIndex % ECO_FACTS.length];
    setFactIndex(prev => prev + 1);
    setCustomTip(`💡 EcoByte Tip: ${tip}`);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-emerald-100/80 dark:from-surface-dark dark:via-emerald-950/30 dark:to-surface-darker border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-center gap-5 transition-all">
      <div className="relative flex-shrink-0">
        <EcoByte
          stage={levelInfo.stage}
          size={100}
          onPoke={handlePoke}
          interactive={true}
        />
        <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full text-xs shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <span>🌱🤖</span> EcoByte Climate Coach • Level {levelInfo.level} ({levelInfo.title})
          </div>
          <button
            onClick={handlePoke}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-white/80 dark:bg-surface-dark border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
          >
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>Tap for Eco Tip</span>
          </button>
        </div>

        <p className="text-base md:text-lg font-bold text-gray-900 dark:text-emerald-50 leading-snug">
          “{getDynamicMessage()}”
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Complete weekly eco actions to evolve EcoByte's canopy and fuel community progress.
        </p>
      </div>
    </div>
  );
};
