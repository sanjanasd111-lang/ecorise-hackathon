import React, { useState } from 'react';
import { useEco } from '../../context/EcoContext';
import { Bus, Bike, Footprints, Car, Plus, CheckCircle2, Trophy, Compass, Sparkles } from 'lucide-react';
import { GreenMobilityTrip } from '../../types/database';

export const GreenMobilityCard: React.FC = () => {
  const { 
    greenMobilityTrips, 
    logMobilityTrip, 
    greenCommuteChallengeCompleted, 
    greenCommuteActionsCount 
  } = useEco();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GreenMobilityTrip['mode']>('bus');
  const [tripsCount, setTripsCount] = useState<number>(1);
  const [distanceKm, setDistanceKm] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');

  // Mode statistics calculation
  const busCount = greenMobilityTrips.filter(t => t.mode === 'bus').reduce((sum, t) => sum + t.tripsCount, 0);
  const metroCount = greenMobilityTrips.filter(t => t.mode === 'metro').reduce((sum, t) => sum + t.tripsCount, 0);
  const bikeCount = greenMobilityTrips.filter(t => t.mode === 'bicycle').reduce((sum, t) => sum + t.tripsCount, 0);
  const walkCount = greenMobilityTrips.filter(t => t.mode === 'walking').reduce((sum, t) => sum + t.tripsCount, 0);
  const carpoolCount = greenMobilityTrips.filter(t => t.mode === 'carpool').reduce((sum, t) => sum + t.tripsCount, 0);

  const publicTransitTotal = busCount + metroCount;
  const targetGoal = 10;
  const progressPercent = Math.min(100, Math.round((greenCommuteActionsCount / targetGoal) * 100));

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await logMobilityTrip(selectedMode, tripsCount, distanceKm, notes);
    setIsLogModalOpen(false);
    setTripsCount(1);
    setDistanceKm(5);
    setNotes('');
  };

  const modesConfig = [
    { id: 'bus', label: 'Bus', icon: '🚌', count: busCount },
    { id: 'metro', label: 'Metro', icon: '🚇', count: metroCount },
    { id: 'bicycle', label: 'Bicycle', icon: '🚲', count: bikeCount },
    { id: 'walking', label: 'Walking', icon: '🚶', count: walkCount },
    { id: 'carpool', label: 'Carpool', icon: '🚐', count: carpoolCount }
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-500/5 dark:from-emerald-950/40 dark:via-forest-900/40 dark:to-teal-950/30 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-sm transition-all">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
            <Bus className="w-4 h-4 text-emerald-600" />
            <span>Green Mobility Hub</span>
          </div>
          <h3 className="font-display font-black text-2xl md:text-3xl text-gray-900 dark:text-emerald-50">
            Green Commute Challenge
          </h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
            Log your public transit, cycling, and walking trips to cut personal emissions.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Log Transit Trip</span>
        </button>
      </div>

      {/* Special Weekly Challenge Callout Box */}
      <div className="p-4 rounded-2xl bg-white/70 dark:bg-forest-900/70 border border-emerald-500/25 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">Weekly Mission</span>
              {greenCommuteChallengeCompleted && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Completed!</span>
                </span>
              )}
            </div>
            <h4 className="font-display font-black text-sm text-gray-900 dark:text-white">
              Use public transport 3 times this week
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Current progress: <strong>{publicTransitTotal} / 3 public transit trips logged</strong>
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right flex-shrink-0">
          <span className="text-[10px] font-bold uppercase text-gray-400 block">Reward</span>
          <span className="font-display font-black text-lg text-emerald-700 dark:text-emerald-300">+30 Eco Points</span>
        </div>
      </div>

      {/* Mode Action Counters Grid */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
          Green Mobility Actions Breakdown
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {modesConfig.map(mode => (
            <div
              key={mode.id}
              className="bg-white/60 dark:bg-forest-900/60 rounded-2xl p-3 border border-emerald-500/15 text-center flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-1">{mode.icon}</span>
              <span className="font-display font-black text-lg text-gray-900 dark:text-white leading-none">
                {mode.count}
              </span>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase">
                {mode.label} Trips
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress towards 10 Green Commute Actions */}
      <div className="bg-white/60 dark:bg-forest-900/60 rounded-2xl p-4 border border-emerald-500/15">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-gray-700 dark:text-gray-200">
            Total Community Green Commute Actions
          </span>
          <span className="font-mono text-emerald-700 dark:text-emerald-300">
            {greenCommuteActionsCount} / {targetGoal} Actions ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-forest-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-white dark:bg-forest-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-display font-black text-xl text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span>🚌</span>
              <span>Record Green Mobility Trip</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Enter your sustainable transit details to earn Eco Points.
            </p>

            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Transit Mode
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {modesConfig.map(m => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setSelectedMode(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        selectedMode === m.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold'
                          : 'bg-gray-50 dark:bg-forest-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-forest-700'
                      }`}
                    >
                      <span className="text-xl">{m.icon}</span>
                      <span className="text-[10px]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Number of Trips
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={tripsCount}
                    onChange={e => setTripsCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Approx. Distance (km)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={distanceKm}
                    onChange={e => setDistanceKm(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Route / Commute Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metro to College campus"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 text-gray-600 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 dark:hover:bg-forest-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Save Commute (+{selectedMode === 'bicycle' || selectedMode === 'walking' ? tripsCount * 10 : tripsCount * 8} pts)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
