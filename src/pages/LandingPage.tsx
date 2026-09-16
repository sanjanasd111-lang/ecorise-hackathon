import React from 'react';
import { EcoByte } from '../components/mascot/EcoByte';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Globe2, Leaf, Target, Zap, Terminal, PlayCircle, Rocket } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onExploreSDG13: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn, onExploreSDG13 }) => {
  return (
    <div className="space-y-16 py-8 md:py-12">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
          
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-sm">
              <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>UN Sustainable Development Goal 13: Climate Action</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-gray-900 dark:text-white leading-[1.1] tracking-tight">
              Small Habits. <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Big Climate Impact.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              Join thousands of eco-citizens logging weekly sustainable habits, earning Eco Points, evolving your companion <strong>EcoByte 🌱🤖</strong>, and turning personal action into measurable community impact.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 hover:scale-[1.02] transition-all"
              >
                <span>Start Your Climate Journey</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onSignIn}
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-800 text-gray-800 dark:text-gray-200 font-bold text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-forest-800 transition-colors shadow-sm"
              >
                Sign In
              </button>
            </div>

            {/* Micro Stats */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-forest-800 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5 font-semibold">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>100% Privacy Focused</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Zero Dark Patterns</span>
              </div>
            </div>
          </div>

          {/* Hero Mascot Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-b from-emerald-50/80 to-white/90 dark:from-surface-dark dark:to-surface-darker border border-emerald-500/20 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
              <div className="absolute top-4 right-4 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-emerald-500/30">
                Companion Robot
              </div>

              <div className="my-4">
                <EcoByte stage={2} size={180} interactive={true} />
              </div>

              <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-2xl p-4 shadow-sm max-w-xs">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100">
                  “Hey! I’m EcoByte 🌱 Every action you complete helps me evolve and powers a greener tomorrow!”
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Why EcoRise 2.0?
          </span>
          <h2 className="font-display font-black text-3xl text-gray-900 dark:text-white mt-1">
            Transforming Small Habits into Climate Action
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            whileHover={{ y: -6 }}
            className="bg-white dark:bg-forest-900 border border-gray-100 dark:border-forest-800 rounded-3xl p-6 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-lg text-gray-900 dark:text-white mb-2">
              Weekly Micro-Challenges
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Curated habits across clean transit, waste diversion, energy conservation, water protection, and urban greening that fit effortlessly into your daily schedule.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-white dark:bg-forest-900 border border-gray-100 dark:border-forest-800 rounded-3xl p-6 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-lg text-gray-900 dark:text-white mb-2">
              Eco Habit DNA Engine
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Our rule-based intelligence analyzes your activity balance to uncover your unique sustainability profile, from Green Commuter to Waste Warrior.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="bg-white dark:bg-forest-900 border border-gray-100 dark:border-forest-800 rounded-3xl p-6 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-lg text-gray-900 dark:text-white mb-2">
              Tangible Impact Translation
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Never wonder what 10 points means. See exact equivalencies in car kilometers avoided, single-use bottles prevented, and liters of clean water conserved.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Animated setup guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-50/70 dark:bg-forest-900/80 p-8 md:p-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Ready in minutes
            </span>
            <h2 className="font-display font-black text-3xl text-gray-900 dark:text-white mt-1">
              Explore, run, and make an impact
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: PlayCircle, title: 'Explore features', text: 'Track habits, evolve EcoByte, unlock badges, and see your climate impact.' },
              { icon: Terminal, title: 'Run locally', text: 'Install dependencies with npm install, then start the Vite app with npm run dev.' },
              { icon: Rocket, title: 'Take action', text: 'Complete a challenge, watch the progress animate, and share your achievement.' },
            ].map(({ icon: Icon, title, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.12 }}
                className="rounded-2xl bg-white dark:bg-forest-950 border border-emerald-500/15 p-5"
              >
                <Icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mb-4" />
                <h3 className="font-display font-black text-base text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG 13 Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-forest-900 to-teal-950 text-white rounded-3xl p-8 md:p-12 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              UNITED NATIONS SDG 13
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-white mt-1 mb-3">
              Take Urgent Action to Combat Climate Change
            </h2>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Climate action is not only for international summits. EcoRise translates global goals into individual, neighborhood, and city-wide action.
            </p>
          </div>

          <button
            onClick={onExploreSDG13}
            className="px-6 py-3 rounded-xl bg-white text-emerald-950 font-bold text-sm shadow-md hover:bg-emerald-50 transition-colors flex-shrink-0"
          >
            Explore SDG 13 Hub
          </button>
        </div>
      </section>
    </div>
  );
};
