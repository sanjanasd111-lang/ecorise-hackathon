import React, { useEffect } from 'react';
import { useEco } from '../../context/EcoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useEco();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3600);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  return (
    <div className="fixed bottom-5 left-5 z-50 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.9 }}
            className="pointer-events-auto flex items-center gap-3 bg-white dark:bg-forest-900 border border-emerald-500/30 rounded-2xl p-4 shadow-xl max-w-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-black text-gray-900 dark:text-emerald-100 truncate">
                {toast.title}
              </h5>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {toast.message}
              </p>
            </div>
            <button
              onClick={clearToast}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
