import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';

interface CO2ReductionTipsProps {
  tips?: any[];
  transportMode?: string;
}

export const CO2ReductionTips: React.FC<CO2ReductionTipsProps> = ({
  tips: initialTips,
  transportMode
}) => {
  const [tips, setTips] = useState<any[]>(initialTips || []);

  useEffect(() => {
    if (!initialTips || initialTips.length === 0) {
      api.co2.getProfile().then(res => {
        if (res.tips) setTips(res.tips);
      }).catch(() => {});
    } else {
      setTips(initialTips);
    }
  }, [initialTips]);

  if (!tips || tips.length === 0) return null;

  return (
    <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-display font-black text-lg text-gray-900 dark:text-white">
            Personalized Reduction Tips
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tailored to your {transportMode || 'primary'} commute profile
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {tips.map((tip, idx) => (
          <div
            key={tip.id || idx}
            className="p-3.5 rounded-2xl bg-gray-50 dark:bg-forest-800/60 border border-gray-100 dark:border-forest-700/60 hover:border-emerald-400 transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                {tip.title}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                ~{tip.potentialSavingKg} kg saved
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
