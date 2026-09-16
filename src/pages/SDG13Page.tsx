import React from 'react';
import { Globe2, ShieldCheck, BookOpen, Users, BarChart3, TreePine, Zap, Recycle, Bike, Droplet } from 'lucide-react';

export const SDG13Page: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-forest-900 to-teal-950 text-white rounded-3xl p-8 md:p-12 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 border border-white/20 text-xs font-bold mb-4">
            <Globe2 className="w-4 h-4" />
            <span>UN Sustainable Development Goal 13</span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-5xl text-white mb-4 leading-tight">
            Climate Action: From Global Mandate to Daily Habit
          </h1>
          <p className="text-sm md:text-base text-emerald-100/90 leading-relaxed">
            Sustainable Development Goal 13 calls for urgent, collective action to combat climate change and its impacts. EcoRise bridges global climate targets with tangible everyday choices.
          </p>
        </div>
      </div>

      {/* Official Targets Mapping */}
      <section className="space-y-4">
        <h2 className="font-display font-black text-2xl text-gray-900 dark:text-white">
          Official UN SDG 13 Targets & EcoRise Alignment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-forest-900 border border-gray-100 dark:border-forest-800 rounded-3xl p-6 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-2">Target 13.1</div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">
              Strengthen Resilience & Adaptive Capacity
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Strengthening local ecological and community resilience through tree planting, neighborhood clean-ups, and reduced landfill burden.
            </p>
          </div>

          <div className="bg-white dark:bg-forest-900 border border-gray-100 dark:border-forest-800 rounded-3xl p-6 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wider text-teal-600 mb-2">Target 13.2</div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">
              Integrate Climate Measures into Policies & Habits
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Integrating carbon-conscious choices into daily life: prioritizing public transit and cycling, conserving household power, and eliminating single-use plastics.
            </p>
          </div>

          <div className="bg-white dark:bg-forest-900 border border-gray-100 dark:border-forest-800 rounded-3xl p-6 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wider text-cyan-600 mb-2">Target 13.3</div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">
              Improve Climate Education & Awareness
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Promoting climate literacy via the interactive EcoByte companion, verified sustainability tips, and live environmental impact telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* The 6 Pillars of EcoRise Contribution */}
      <section className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-8 shadow-sm">
        <h2 className="font-display font-black text-2xl text-gray-900 dark:text-white mb-6">
          How EcoRise Makes Climate Action Measurable
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Ecosystem Restoration</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Directly encouraging sapling cultivation and urban greening to maximize natural carbon sequestration.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Low-Carbon Commuting</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Rewarding active cycling and mass transit trips to slash fossil-fuel vehicle tailpipe emissions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Grid Energy Conservation</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Promoting mindfulness around phantom electricity draw, lighting, and cooling energy demands.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center flex-shrink-0">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Circular Waste Diversion</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Eliminating single-use throwaways and ensuring clean sorting for municipal recycling streams.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center flex-shrink-0">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Freshwater Protection</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Instilling water-saving habits to reduce energy-intensive municipal water treatment and pumping.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Transparent Data Telemetry</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Providing verified, real-time feedback so every participant sees their role in the bigger climate picture.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
