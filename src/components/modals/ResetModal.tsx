import React from 'react';
import { useEco } from '../../context/EcoContext';
import { AlertTriangle, X } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onClose }) => {
  const { resetProgress } = useEco();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    await resetProgress();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative max-w-sm w-full bg-white dark:bg-forest-900 border border-red-500/30 rounded-3xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="font-display font-black text-xl text-gray-900 dark:text-gray-50 mb-2">
          Reset Weekly Progress?
        </h3>

        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          This will clear all your completed activities for this week and return your weekly points to 0. This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Yes, Reset Progress
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 hover:bg-gray-50 dark:hover:bg-forest-800 text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
