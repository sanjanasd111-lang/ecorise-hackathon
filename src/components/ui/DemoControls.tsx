import React, { useState } from 'react';
import { useEco } from '../../context/EcoContext';
import {
  PlayCircle,
  X,
  Sparkles,
  Flame,
  Shield,
  Train,
  CheckCircle2,
  ChevronUp,
  RotateCcw,
  Zap
} from 'lucide-react';
import { playFanfareSound, playCheckSound, playShieldSound } from '../../lib/sound';

interface DemoControlsProps {
  onSimulateStreak?: () => void;
  onSimulateShift?: () => void;
  onSimulateCycleDone?: () => void;
  onReset?: () => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  onSimulateStreak,
  onSimulateShift,
  onSimulateCycleDone,
  onReset
}) => {
  const { applyDemoPreset } = useEco();
  const [isOpen, setIsOpen] = useState(false);

  const handleSimulateStreak = () => {
    playShieldSound();
    if (onSimulateStreak) onSimulateStreak();
    applyDemoPreset('champion');
  };

  const handleSimulateShift = () => {
    playCheckSound();
    if (onSimulateShift) onSimulateShift();
  };

  const handleSimulateCycle = () => {
    playFanfareSound();
    if (onSimulateCycleDone) onSimulateCycleDone();
    applyDemoPreset('master');
  };

  return (
    <aside aria-label="Demo Presentation Controls" className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <div className="bg-white/95 dark:bg-forest-900/95 backdrop-blur-md border border-purple-500/40 rounded-3xl shadow-2xl p-5 max-w-sm w-full animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-forest-800 mb-3">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-black text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Judge & Presentation Demo Suite</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-forest-800 transition-colors"
              aria-label="Close demo controls"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
            Simulate live interactions instantly during evaluation presentations:
          </p>

          <div className="space-y-2">
            <button
              onClick={handleSimulateStreak}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 hover:scale-[1.02] transition-all text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Simulate 7-Day Streak & Eco Shield</span>
              </div>
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            <button
              onClick={handleSimulateShift}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-teal-200 dark:border-teal-800/40 bg-teal-50/70 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 hover:scale-[1.02] transition-all text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-teal-600" />
                <span>Simulate Shift: Car → Metro (-42% CO₂)</span>
              </div>
              <Zap className="w-3.5 h-3.5 text-teal-600" />
            </button>

            <button
              onClick={handleSimulateCycle}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:scale-[1.02] transition-all text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Complete 3-Day Cycle (+50 Pts Bonus)</span>
              </div>
              <span>🎉</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => applyDemoPreset('champion')}
                className="p-2 rounded-xl border border-gray-200 dark:border-forest-800 text-[11px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-800 text-center"
              >
                Evolve EcoByte
              </button>

              <button
                onClick={() => {
                  applyDemoPreset('clean');
                  if (onReset) onReset();
                }}
                className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-center flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl shadow-purple-600/30 hover:scale-105 transition-all text-xs font-bold backdrop-blur-sm border border-purple-400/40"
          title="Open Judge Presentation Controls"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Demo Controls</span>
          <ChevronUp className="w-3.5 h-3.5 text-purple-200" />
        </button>
      )}
    </aside>
  );
};
