import React from 'react';
import { useEco } from '../context/EcoContext';
import { ImpactTranslator } from '../components/analytics/ImpactTranslator';
import { MyImpactStoryCard } from '../components/impact/MyImpactStoryCard';
import { Globe, Trees, Droplet, Trash2, Zap, Car } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const { impactEquivalents, completions } = useEco();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-2">
          <Globe className="w-3.5 h-3.5" />
          <span>Real-World Environmental Translation</span>
        </div>
        <h1 className="font-display font-black text-3xl text-gray-900 dark:text-white">
          Measurable Climate Impact
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Translating everyday habits into tangible carbon, plastic, and water conservation indicators.
        </p>
      </div>

      {/* Auto-Generated My Climate Action Story */}
      <MyImpactStoryCard />

      {/* Main Impact Translator */}
      <ImpactTranslator />

      {/* Detailed Impact Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-forest-900 border border-gray-100 dark:border-forest-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-display font-black text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span>💨</span> Carbon Dioxide Avoidance
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
            Through cycling, public transit commutes, and standby electricity shut-offs, you have avoided approximately:
          </p>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30">
            <span className="font-display font-black text-3xl text-emerald-600 dark:text-emerald-400">
              ~{impactEquivalents.estimatedCo2Kg} kg CO₂
            </span>
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-1">
              Equivalent to keeping a gasoline car off the road for {impactEquivalents.carKmEquivalent} kilometers.
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-forest-900 border border-gray-100 dark:border-forest-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-display font-black text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span>🌊</span> Resource Conservation
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
            Through conscious consumption, reusable containers, and shortened showers, you have protected:
          </p>
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-500/30">
            <span className="font-display font-black text-3xl text-teal-600 dark:text-teal-400">
              {impactEquivalents.waterSavedLiters} Liters Water
            </span>
            <div className="text-xs font-semibold text-teal-800 dark:text-teal-300 mt-1">
              Plus {impactEquivalents.plasticAvoidedItems} single-use plastic items kept out of waterways and municipal landfills.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
