import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingDown,
  Sparkles,
  TreePine,
  Smartphone,
  Info,
  Car,
  ChevronRight,
  HelpCircle,
  X
} from 'lucide-react';

interface CO2ComparisonCardProps {
  metrics: {
    baselineWeeklyCO2e: number;
    currentWeeklyCO2e: number;
    reductionKg: number;
    reductionPct: number;
    annualKgSaved?: number;
    treeSeedlingsEquiv?: number;
    smartphoneChargesEquiv?: number;
  } | null;
  profile?: any;
}

export const CO2ComparisonCard: React.FC<CO2ComparisonCardProps> = ({
  metrics,
  profile
}) => {
  const [showMethodology, setShowMethodology] = useState(false);

  const baseline = metrics?.baselineWeeklyCO2e || 18.5;
  const current = metrics?.currentWeeklyCO2e || baseline;
  const reductionKg = metrics?.reductionKg || Math.max(0, Math.round((baseline - current) * 10) / 10);
  const reductionPct = metrics?.reductionPct || (baseline > 0 ? Math.round(((baseline - current) / baseline) * 100) : 0);

  const treeEquiv = metrics?.treeSeedlingsEquiv || Math.round(((reductionKg * 52) / 21) * 10) / 10;
  const phoneEquiv = metrics?.smartphoneChargesEquiv || Math.round(reductionKg * 122);

  return (
    <div className="relative bg-gradient-to-br from-white via-teal-50/20 to-emerald-50/30 dark:from-forest-900 dark:via-forest-900 dark:to-forest-950 border border-emerald-500/25 rounded-3xl p-6 shadow-xl overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <TrendingDown className="w-4 h-4" />
            <span>Before & After Carbon Assessment</span>
          </div>
          <h3 className="font-display font-black text-xl md:text-2xl text-gray-900 dark:text-white mt-1">
            Transport CO₂e Footprint
          </h3>
        </div>

        <button
          onClick={() => setShowMethodology(true)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-forest-800 border border-emerald-500/20 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-emerald-600 transition-colors shadow-sm"
        >
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>Methodology</span>
        </button>
      </div>

      {/* Side-by-Side Cards: Baseline vs Current */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Baseline Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-forest-800/60 border border-gray-200 dark:border-forest-700/80">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
            <span>STARTING BASELINE</span>
            <span>Week 1</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-gray-800 dark:text-gray-100 font-display">
              {baseline}
            </span>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">kg CO₂e / wk</span>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            Calculated from your initial {profile?.transportMode || 'primary'} commute profile.
          </p>
        </div>

        {/* Current Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:bg-emerald-950/40 border border-emerald-500/40 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
            <span>CURRENT ESTIMATE</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs">
              {reductionPct > 0 ? `-${reductionPct}% CUT` : 'ESTABLISHED'}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-display">
              {current}
            </span>
            <span className="text-xs font-bold text-emerald-700/80 dark:text-emerald-400/80">kg CO₂e / wk</span>
          </div>
          <p className="text-[11px] text-emerald-800/70 dark:text-emerald-300/70 mt-1">
            {reductionKg > 0
              ? `You have avoided ${reductionKg} kg CO₂e weekly through green commute shifts!`
              : 'Log green commutes and 3-day tasks to reduce this number!'}
          </p>
        </div>
      </div>

      {/* Equivalency Badges */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/60 dark:bg-forest-800/50 border border-emerald-500/20">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
            <TreePine className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-black text-gray-900 dark:text-white leading-tight">
              {treeEquiv}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
              Urban Trees Absorbing Equivalent
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-teal-50/60 dark:bg-forest-800/50 border border-teal-500/20">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-black text-gray-900 dark:text-white leading-tight">
              {phoneEquiv}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
              Smartphone Charges Conserved
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Modal */}
      <AnimatePresence>
        {showMethodology && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-forest-900 border border-emerald-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowMethodology(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-emerald-600" />
                <h4 className="font-display font-black text-xl text-gray-900 dark:text-white">
                  CO₂e Educational Methodology
                </h4>
              </div>

              <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-h-96 overflow-y-auto pr-1">
                <p>
                  EcoRise calculates transport greenhouse gas footprints using guidelines published by the <strong>UK Department for Environment, Food & Rural Affairs (DEFRA)</strong> and the <strong>Intergovernmental Panel on Climate Change (IPCC)</strong>.
                </p>

                <div className="p-3 rounded-xl bg-gray-50 dark:bg-forest-800 border border-gray-200 dark:border-forest-700 font-mono text-[11px]">
                  <strong>Formula:</strong><br />
                  Weekly Distance (km) × Mode Emission Factor (kg CO₂e / km) = Weekly kg CO₂e
                </div>

                <div className="font-bold text-gray-900 dark:text-white">Authoritative Emission Factors Used:</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Petrol Car:</strong> 0.170 kg CO₂e / passenger-km</li>
                  <li><strong>Diesel Car:</strong> 0.171 kg CO₂e / passenger-km</li>
                  <li><strong>Hybrid Car:</strong> 0.105 kg CO₂e / passenger-km</li>
                  <li><strong>Electric EV:</strong> 0.045 kg CO₂e / passenger-km (Lifecycle electricity grid mix)</li>
                  <li><strong>Municipal Bus:</strong> 0.082 kg CO₂e / passenger-km</li>
                  <li><strong>Electric Metro / Light Rail:</strong> 0.035 kg CO₂e / passenger-km</li>
                  <li><strong>Bicycle / Walking:</strong> 0.000 kg CO₂e / km</li>
                </ul>

                <p className="text-[11px] text-gray-400 italic pt-2 border-t border-gray-100 dark:border-forest-800">
                  Note: All emission values are educational approximations designed to encourage habit awareness and civic action toward UN SDG 13.
                </p>
              </div>

              <button
                onClick={() => setShowMethodology(false)}
                className="w-full mt-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
