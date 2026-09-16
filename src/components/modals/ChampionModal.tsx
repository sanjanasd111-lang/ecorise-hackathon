import React from 'react';
import { useEco } from '../../context/EcoContext';
import { EcoByte } from '../mascot/EcoByte';
import { X, Award, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChampionModalProps {
  onNavigateToImpact?: () => void;
}

export const ChampionModal: React.FC<ChampionModalProps> = ({ onNavigateToImpact }) => {
  const { isChampionModalOpen, closeChampionModal, weeklyPoints, levelInfo } = useEco();

  if (!isChampionModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-md w-full bg-white dark:bg-forest-900 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={closeChampionModal}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-forest-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Celebratory Mascot */}
          <div className="flex justify-center mb-4">
            <EcoByte stage={4} size={150} interactive={true} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 border border-amber-500/40 text-amber-700 dark:text-amber-400 mb-3">
            <Award className="w-4 h-4" />
            <span>Milestone Achieved</span>
          </div>

          <h2 className="font-display font-black text-3xl text-gray-900 dark:text-emerald-50 mb-2">
            YOU DID IT! 🌍⚡
          </h2>

          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            You’ve completed this week’s Eco Challenge!
          </p>

          <div className="inline-flex gap-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-sm my-3">
            <span>⭐ {weeklyPoints} Eco Points</span>
            <span>🏆 {levelInfo.title}</span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
            EcoByte has blossomed into its ultimate solar bloom crown! Your everyday habits have powered a greener community and directly advanced UN SDG 13.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                closeChampionModal();
                if (onNavigateToImpact) onNavigateToImpact();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 transition-all"
            >
              <span>View My Impact</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={closeChampionModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-forest-800 transition-colors"
            >
              Continue Challenge
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
