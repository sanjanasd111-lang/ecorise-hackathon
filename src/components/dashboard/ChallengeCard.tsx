import React, { useState } from 'react';
import { Challenge } from '../../types/database';
import { useEco } from '../../context/EcoContext';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChallengeCardProps {
  challenge: Challenge;
  isCompleted: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, isCompleted }) => {
  const { completeChallenge, uncompleteChallenge } = useEco();
  const [showPopup, setShowPopup] = useState(false);

  const handleToggle = async () => {
    if (!isCompleted) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1200);
      await completeChallenge(challenge.id);
    } else {
      await uncompleteChallenge(challenge.id);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'nature': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40';
      case 'water': return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800/40';
      case 'transport': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40';
      case 'energy': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40';
      case 'waste': return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      onClick={handleToggle}
      className={`relative cursor-pointer select-none rounded-2xl p-5 border transition-all ${
        isCompleted
          ? 'bg-gradient-to-r from-emerald-50/80 to-teal-50/70 dark:from-emerald-950/30 dark:to-surface-dark border-emerald-500 shadow-sm'
          : 'bg-white dark:bg-forest-900/80 border-gray-200/80 dark:border-forest-800 hover:border-emerald-500/40 hover:shadow-md'
      }`}
      role="checkbox"
      aria-checked={isCompleted}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      {/* Floating Points Popup Animation */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.7 }}
            animate={{ opacity: 1, y: -28, scale: 1.15 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute top-2 right-4 z-20 px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-lg flex items-center gap-1"
          >
            <span>+{challenge.points} pts</span>
            <span>🌱</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-4">
        {/* Custom Animated Checkbox */}
        <div className="pt-0.5 flex-shrink-0">
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30 scale-105'
              : 'border-gray-300 dark:border-forest-700 bg-white dark:bg-forest-800'
          }`}>
            {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(challenge.category)}`}>
              {challenge.category}
            </span>
            <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
              +{challenge.points} Eco Points
            </span>
          </div>

          <h4 className={`text-base font-bold flex items-center gap-1.5 transition-colors ${
            isCompleted ? 'text-emerald-800 dark:text-emerald-300 line-through opacity-85' : 'text-gray-900 dark:text-gray-100'
          }`}>
            <span>{challenge.icon}</span>
            <span>{challenge.title}</span>
          </h4>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            {challenge.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
