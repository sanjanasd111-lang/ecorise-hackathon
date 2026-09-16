import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Train,
  Bus,
  Bike,
  Footprints,
  Users,
  ArrowRight,
  TrendingDown,
  Award
} from 'lucide-react';
import { api } from '../../lib/api';

export const WhatIfSimulatorCard: React.FC = () => {
  const [targetMode, setTargetMode] = useState('metro');
  const [shiftedTrips, setShiftedTrips] = useState(2);
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const greenOptions = [
    { id: 'metro', label: 'Metro / Rail', icon: Train, badge: 'High Impact' },
    { id: 'bus', label: 'City Bus', icon: Bus, badge: 'Accessible' },
    { id: 'bicycle', label: 'Bicycle / E-Bike', icon: Bike, badge: 'Zero Emission' },
    { id: 'walking', label: 'Walking', icon: Footprints, badge: 'Active' },
    { id: 'carpool', label: 'Carpooling', icon: Users, badge: 'Shared' }
  ];

  const runSimulation = async (mode: string, trips: number) => {
    setLoading(true);
    try {
      const res = await api.co2.whatIfSimulate({
        targetMode: mode,
        shiftedTripsPerWeek: trips
      });
      setSimulation(res);
    } catch (err) {
      console.warn('Simulation error:', err);
      // Fallback preview
      setSimulation({
        weeklySavingsKg: Math.round(trips * 2.6 * 10) / 10,
        monthlySavingsKg: Math.round(trips * 2.6 * 4.33 * 10) / 10,
        yearlySavingsKg: Math.round(trips * 2.6 * 52 * 10) / 10,
        percentageDrop: Math.min(65, trips * 14),
        potentialPointsPerWeek: trips * 25
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(targetMode, shiftedTrips);
  }, [targetMode, shiftedTrips]);

  return (
    <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Modal Shift Simulator</span>
          </div>
          <h3 className="font-display font-black text-xl text-gray-900 dark:text-white mt-1">
            Try a Greener Choice ⚡
          </h3>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
        Simulate the immediate carbon savings of replacing solo vehicle trips with clean communal or active transit.
      </p>

      {/* Target Mode Buttons */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
          1. Choose your green alternative:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {greenOptions.map(opt => {
            const Icon = opt.icon;
            const isSelected = targetMode === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTargetMode(opt.id)}
                className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-sm ring-1 ring-emerald-500/30'
                    : 'border-gray-200 dark:border-forest-800 bg-white dark:bg-forest-800/60 hover:border-emerald-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-forest-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-gray-900 dark:text-white truncate">
                    {opt.label}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">{opt.badge}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frequency Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
          <span>2. Trips shifted per week:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black">
            {shiftedTrips} {shiftedTrips === 1 ? 'trip/wk' : 'trips/wk'}
          </span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              onClick={() => setShiftedTrips(num)}
              className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
                shiftedTrips === num
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-forest-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-100'
              }`}
            >
              {num} {num === 1 ? 'day' : 'days'}
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Output Grid */}
      {simulation && (
        <motion.div
          key={`${targetMode}-${shiftedTrips}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-600/10 border border-emerald-500/30"
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-500/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <span>Projected Climate Impact</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
              -{simulation.percentageDrop}% CO₂e
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center mb-3">
            <div className="p-2 rounded-xl bg-white/80 dark:bg-forest-800/80">
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-display">
                {simulation.weeklySavingsKg} kg
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase">Saved / Wk</div>
            </div>

            <div className="p-2 rounded-xl bg-white/80 dark:bg-forest-800/80">
              <div className="text-base font-black text-teal-600 dark:text-teal-400 font-display">
                {simulation.monthlySavingsKg} kg
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase">Saved / Mo</div>
            </div>

            <div className="p-2 rounded-xl bg-white/80 dark:bg-forest-800/80">
              <div className="text-base font-black text-amber-600 dark:text-amber-400 font-display">
                +{simulation.potentialPointsPerWeek}
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase">Pts / Wk</div>
            </div>
          </div>

          <p className="text-[11px] text-gray-600 dark:text-gray-300 text-center leading-relaxed">
            By shifting <strong>{shiftedTrips} trips</strong> each week to <strong>{targetMode}</strong>, you could eliminate ~<strong>{simulation.yearlySavingsKg} kg</strong> of atmospheric CO₂e every year!
          </p>
        </motion.div>
      )}
    </div>
  );
};
