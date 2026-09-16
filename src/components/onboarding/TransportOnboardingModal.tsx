import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EcoByte } from '../mascot/EcoByte';
import { playCheckSound, playFanfareSound } from '../../lib/sound';
import { api } from '../../lib/api';
import {
  Car,
  Bike,
  Bus,
  Train,
  Footprints,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Calendar,
  Flame,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';

interface TransportOnboardingModalProps {
  isOpen: boolean;
  onComplete: (result: any) => void;
}

export const TransportOnboardingModal: React.FC<TransportOnboardingModalProps> = ({
  isOpen,
  onComplete
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [transportMode, setTransportMode] = useState<string>('car');
  const [vehicleType, setVehicleType] = useState<string>('petrol');
  const [distancePerTrip, setDistancePerTrip] = useState<number>(6);
  const [distanceType, setDistanceType] = useState<'one-way' | 'round-trip'>('one-way');
  const [tripsPerWeek, setTripsPerWeek] = useState<number>(5);
  const [hasPublicTransitAccess, setHasPublicTransitAccess] = useState<boolean>(true);

  // Result from backend calculation
  const [calculationResult, setCalculationResult] = useState<any>(null);

  if (!isOpen) return null;

  const transportModes = [
    { id: 'car', label: 'Personal Car', icon: Car, desc: 'Solo or family passenger car' },
    { id: 'motorbike', label: 'Motorbike / Scooter', icon: Bike, desc: 'Two-wheeler gasoline/electric' },
    { id: 'bus', label: 'City Bus', icon: Bus, desc: 'Municipal scheduled transit' },
    { id: 'metro', label: 'Metro / Light Rail', icon: Train, desc: 'Urban electric rapid train' },
    { id: 'carpool', label: 'Carpool / Ride-Share', icon: Users, desc: 'Shared passenger commute' },
    { id: 'bicycle', label: 'Bicycle / E-Bike', icon: Bike, desc: 'Pedal-powered active transport' },
    { id: 'walking', label: 'Walking', icon: Footprints, desc: 'Active pedestrian commute' }
  ];

  const vehicleTypes = [
    { id: 'petrol', label: 'Petrol (Gasoline)', badge: 'Conventional' },
    { id: 'diesel', label: 'Diesel', badge: 'High Compression' },
    { id: 'hybrid', label: 'Hybrid / PHEV', badge: 'Low Emission' },
    { id: 'electric', label: '100% Electric (EV)', badge: 'Zero Tailpipe' },
    { id: 'not_sure', label: 'Not Sure / Standard', badge: 'National Average' }
  ];

  const distancePresets = [2, 5, 10, 15, 25, 40];

  const isMotorized = transportMode === 'car' || transportMode === 'motorbike' || transportMode === 'carpool';

  const handleNext = async () => {
    // If on Step 7, submit to backend and transition to Step 8 (Calculation Reveal)
    if (step === 7) {
      setLoading(true);
      try {
        const payload = {
          transportMode,
          vehicleType: isMotorized ? vehicleType : 'electric',
          distancePerTrip,
          distanceType,
          tripsPerWeek,
          hasPublicTransitAccess
        };

        const res = await api.onboarding.submit(payload);
        setCalculationResult(res);
        playFanfareSound();
        setStep(8);
      } catch (err: any) {
        console.error('Onboarding submission error:', err);
        // Fallback calculation in case of network anomaly
        const weeklyKm = distanceType === 'one-way' ? distancePerTrip * 2 * tripsPerWeek : distancePerTrip * tripsPerWeek;
        const factor = transportMode === 'car' ? 0.17 : transportMode === 'bus' ? 0.082 : 0.035;
        const est = Math.round(weeklyKm * factor * 10) / 10;
        setCalculationResult({
          calculation: {
            weeklyDistanceKm: weeklyKm,
            estimatedWeeklyCO2e: est,
            estimatedMonthlyCO2e: Math.round(est * 4.33 * 10) / 10,
            estimatedYearlyCO2e: Math.round(est * 52 * 10) / 10
          }
        });
        setStep(8);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step progression skipping vehicle type if walking or cycling
    if (step === 2 && !isMotorized) {
      setStep(4); // Skip vehicle fuel type for zero-emission/transit modes
    } else {
      setStep(prev => Math.min(8, prev + 1));
    }
  };

  const handleBack = () => {
    if (step === 4 && !isMotorized) {
      setStep(2);
    } else {
      setStep(prev => Math.max(1, prev - 1));
    }
  };

  const handleFinish = () => {
    playCheckSound();
    onComplete(calculationResult);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white dark:bg-forest-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden my-6"
      >
        {/* Background glow ornament */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Progress Bar & Header */}
        <div className="mb-6 relative z-10">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            <span>STEP {step} OF 8</span>
            <span>{Math.round((step / 8) * 100)}% COMPLETE</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-forest-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 8) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Welcome & Mission */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-4 relative z-10"
            >
              <div className="flex justify-center mb-4">
                <EcoByte stage={0} size={140} interactive={true} />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalized Climate Action Onboarding</span>
              </div>
              <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900 dark:text-white mb-3">
                Let's Understand Your Daily Journey 🌱
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed mb-6">
                EcoRise tailors your climate challenges and estimates your mobility footprint using authoritative <strong>DEFRA / IPCC carbon factors</strong>. Answer 6 quick questions to establish your baseline!
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4 max-w-md mx-auto mb-6 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-left">
                <Info className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <span>Zero judgment. EcoRise is designed to celebrate progress, track modal shifts, and award civic achievements.</span>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Primary Transport Mode */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-2 relative z-10"
            >
              <div className="text-center mb-6">
                <h2 className="font-display font-black text-2xl text-gray-900 dark:text-white">
                  How do you usually commute?
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Select the primary way you travel to school, university, or daily activities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {transportModes.map(mode => {
                  const Icon = mode.icon;
                  const isSelected = transportMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setTransportMode(mode.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-md ring-2 ring-emerald-500/20'
                          : 'border-gray-200 dark:border-forest-800 bg-white dark:bg-forest-800/60 hover:border-emerald-400'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-forest-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-gray-900 dark:text-white">{mode.label}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{mode.desc}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Vehicle Type & Fuel */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-2 relative z-10"
            >
              <div className="text-center mb-6">
                <h2 className="font-display font-black text-2xl text-gray-900 dark:text-white">
                  What powertrain or fuel type?
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Helps us compute whether your vehicle burns petrol, diesel, or uses grid electricity.
                </p>
              </div>

              <div className="space-y-3 max-w-lg mx-auto">
                {vehicleTypes.map(vt => {
                  const isSelected = vehicleType === vt.id;
                  return (
                    <button
                      key={vt.id}
                      onClick={() => setVehicleType(vt.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-md ring-2 ring-emerald-500/20'
                          : 'border-gray-200 dark:border-forest-800 bg-white dark:bg-forest-800/60 hover:border-emerald-400'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-gray-900 dark:text-white">{vt.label}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-forest-700 text-gray-600 dark:text-gray-300">
                          {vt.badge}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Distance Per Trip */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-2 relative z-10"
            >
              <div className="text-center mb-6">
                <h2 className="font-display font-black text-2xl text-gray-900 dark:text-white">
                  How far is your typical trip?
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Estimate the distance between your home and school, campus, or workplace.
                </p>
              </div>

              <div className="text-center my-6">
                <div className="inline-flex items-baseline gap-1 text-5xl font-black text-emerald-600 dark:text-emerald-400 font-display">
                  <span>{distancePerTrip}</span>
                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">km</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Approx. {(distancePerTrip * 0.621371).toFixed(1)} miles
                </div>
              </div>

              {/* Slider */}
              <div className="max-w-md mx-auto px-4 mb-6">
                <input
                  type="range"
                  min="1"
                  max="60"
                  step="1"
                  value={distancePerTrip}
                  onChange={e => setDistancePerTrip(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 dark:bg-forest-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Presets */}
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {distancePresets.map(preset => (
                  <button
                    key={preset}
                    onClick={() => setDistancePerTrip(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      distancePerTrip === preset
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-forest-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-100'
                    }`}
                  >
                    {preset} km
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: Commute Nature (One-way vs Round-trip) */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-2 relative z-10"
            >
              <div className="text-center mb-6">
                <h2 className="font-display font-black text-2xl text-gray-900 dark:text-white">
                  Is that distance one-way or round-trip?
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This ensures your total daily travel distance is modeled accurately.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                <button
                  onClick={() => setDistanceType('one-way')}
                  className={`p-6 rounded-2xl border text-center transition-all ${
                    distanceType === 'one-way'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-gray-200 dark:border-forest-800 bg-white dark:bg-forest-800/60'
                  }`}
                >
                  <div className="text-3xl mb-2">➡️</div>
                  <div className="font-bold text-base text-gray-900 dark:text-white mb-1">One-Way Distance</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    EcoRise calculates 2 legs per day ({distancePerTrip * 2} km total per day)
                  </div>
                </button>

                <button
                  onClick={() => setDistanceType('round-trip')}
                  className={`p-6 rounded-2xl border text-center transition-all ${
                    distanceType === 'round-trip'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-gray-200 dark:border-forest-800 bg-white dark:bg-forest-800/60'
                  }`}
                >
                  <div className="text-3xl mb-2">🔄</div>
                  <div className="font-bold text-base text-gray-900 dark:text-white mb-1">Round-Trip Distance</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Distance already includes return journey ({distancePerTrip} km total per day)
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: Weekly Frequency */}
          {step === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-2 relative z-10"
            >
              <div className="text-center mb-6">
                <h2 className="font-display font-black text-2xl text-gray-900 dark:text-white">
                  How many days per week do you make this trip?
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Select your typical weekly commuting pattern.
                </p>
              </div>

              <div className="text-center my-6">
                <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400 font-display">
                  {tripsPerWeek} <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">days/week</span>
                </div>
              </div>

              <div className="flex justify-center gap-2 max-w-lg mx-auto flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <button
                    key={num}
                    onClick={() => setTripsPerWeek(num)}
                    className={`w-12 h-12 rounded-2xl font-bold text-sm flex items-center justify-center transition-all ${
                      tripsPerWeek === num
                        ? 'bg-emerald-600 text-white shadow-md scale-110'
                        : 'bg-gray-100 dark:bg-forest-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-100'
                    }`}
                  >
                    {num}d
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 7: Public Transit Availability */}
          {step === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-2 relative z-10"
            >
              <div className="text-center mb-6">
                <h2 className="font-display font-black text-2xl text-gray-900 dark:text-white">
                  Is public transit accessible along your route?
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  We use this to customize realistic, actionable green transit suggestions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
                <button
                  onClick={() => setHasPublicTransitAccess(true)}
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    hasPublicTransitAccess
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-gray-200 dark:border-forest-800 bg-white dark:bg-forest-800/60'
                  }`}
                >
                  <div className="text-3xl mb-1">🚌</div>
                  <div className="font-bold text-base text-gray-900 dark:text-white">Yes, Accessible</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Bus, metro, or shared transit available nearby</div>
                </button>

                <button
                  onClick={() => setHasPublicTransitAccess(false)}
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    !hasPublicTransitAccess
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-gray-200 dark:border-forest-800 bg-white dark:bg-forest-800/60'
                  }`}
                >
                  <div className="text-3xl mb-1">🚫</div>
                  <div className="font-bold text-base text-gray-900 dark:text-white">Limited / No Access</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">We'll focus on carpooling, eco-driving & active errands</div>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 8: Calculation Reveal & EcoByte Celebration */}
          {step === 8 && calculationResult && (
            <motion.div
              key="step-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-2 text-center relative z-10"
            >
              <div className="flex justify-center mb-2">
                <EcoByte stage={1} size={130} interactive={true} />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Baseline Mobility Carbon Footprint Established</span>
              </div>

              <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">
                Your Starting Transport Footprint
              </h2>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-forest-800/60 border border-emerald-500/30 text-center">
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-display">
                    {calculationResult.calculation?.estimatedWeeklyCO2e || 0}
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">kg CO₂e / Week</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-50/80 dark:bg-forest-800/60 border border-teal-500/30 text-center">
                  <div className="text-2xl font-black text-teal-700 dark:text-teal-300 font-display">
                    {calculationResult.calculation?.estimatedMonthlyCO2e || 0}
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">kg CO₂e / Month</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-cyan-50/80 dark:bg-forest-800/60 border border-cyan-500/30 text-center">
                  <div className="text-2xl font-black text-cyan-700 dark:text-cyan-300 font-display">
                    {calculationResult.calculation?.estimatedYearlyCO2e || 0}
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">kg CO₂e / Year</div>
                </div>
              </div>

              {/* 3-Day Challenge Preview Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-600/10 border border-emerald-500/30 text-left max-w-lg mx-auto mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Your First 3-Day Mission is Unlocked!</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  We've initialized Cycle #1 with 3 tailored micro-actions. Complete each day to earn bonus Eco Points and your first <strong>Eco Shield 🛡️</strong>!
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full max-w-md py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <span>Launch My EcoRise Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation Buttons (Steps 1 to 7) */}
        {step < 8 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100 dark:border-forest-800/80 relative z-10">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Calculating...' : step === 7 ? 'Calculate Baseline Footprint' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
