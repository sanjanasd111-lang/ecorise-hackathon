import React from 'react';
import { useEco } from '../../context/EcoContext';
import { Car, Droplets, Trash2, Zap, Trees } from 'lucide-react';

export const ImpactTranslator: React.FC = () => {
  const { impactEquivalents } = useEco();

  return (
    <div className="bg-white/90 dark:bg-forest-900/90 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Real-World Translation
          </div>
          <h3 className="font-display font-black text-xl text-gray-900 dark:text-emerald-50">
            Your Impact, Explained 🌍
          </h3>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
        We convert your completed activities into tangible real-world environmental milestones:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Car Travel Avoided */}
        <div className="bg-purple-50/70 dark:bg-purple-950/20 border border-purple-500/20 rounded-2xl p-4">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5">
            <Car className="w-5 h-5" />
          </div>
          <div className="font-display font-black text-2xl text-purple-900 dark:text-purple-200 leading-none mb-1">
            ~{impactEquivalents.carKmEquivalent} km
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Car travel distance emissions avoided by choosing clean transit and cycling.
          </p>
        </div>

        {/* Plastic Items Avoided */}
        <div className="bg-teal-50/70 dark:bg-teal-950/20 border border-teal-500/20 rounded-2xl p-4">
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2.5">
            <Trash2 className="w-5 h-5" />
          </div>
          <div className="font-display font-black text-2xl text-teal-900 dark:text-teal-200 leading-none mb-1">
            {impactEquivalents.plasticAvoidedItems} items
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Single-use plastic bottles, bags, and packaging kept out of landfills and oceans.
          </p>
        </div>

        {/* Clean Water Conserved */}
        <div className="bg-cyan-50/70 dark:bg-cyan-950/20 border border-cyan-500/20 rounded-2xl p-4">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2.5">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="font-display font-black text-2xl text-cyan-900 dark:text-cyan-200 leading-none mb-1">
            {impactEquivalents.waterSavedLiters} L
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Liters of freshwater conserved through conscious hygiene habits and refilling.
          </p>
        </div>

        {/* Trees Supported */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
            <Trees className="w-5 h-5" />
          </div>
          <div className="font-display font-black text-2xl text-emerald-900 dark:text-emerald-200 leading-none mb-1">
            {impactEquivalents.treesSupported} saplings
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Urban trees planted and green spaces cared for to restore ecosystem biodiversity.
          </p>
        </div>

      </div>

      <div className="p-3 bg-gray-50 dark:bg-forest-800/50 rounded-xl border border-gray-100 dark:border-forest-800 text-[11px] text-gray-400 dark:text-gray-500 text-center italic">
        * Estimated demo impact indicators based on standardized sustainability benchmarks and predefined demonstration assumptions.
      </div>
    </div>
  );
};
