import React from 'react';
import { Leaf, Globe, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="mt-16 bg-white dark:bg-forest-900 border-t border-emerald-500/10 dark:border-emerald-500/20 pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-sm">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-emerald-950 dark:text-emerald-50">
                EcoRise <span className="text-emerald-600 dark:text-emerald-400">2.0</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              Empowering individuals and local communities to advance UN SDG 13 (Climate Action) through daily habit formation, gamified tracking, and companion mascot evolution.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-2">
              <span className="inline-flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Row Level Security</span>
              <span className="inline-flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> UN SDG 13 Aligned</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
              Platform Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <button onClick={() => onSelectTab('dashboard')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('challenges')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Eco Challenges
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('ecopulse')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  EcoPulse (Community Voice)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('civic')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Civic Impact & Certificate
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('leaderboard')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Local Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('sdg13')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  About SDG 13
                </button>
              </li>
            </ul>
          </div>

          {/* Identity & Companion */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
              Mascot Identity
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
              EcoByte 🌱🤖 is an original vector eco-robot companion engineered exclusively for EcoRise to celebrate daily climate actions.
            </p>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Zero Dark Patterns • 100% Habit Growth
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500">
          <p>© 2026 EcoRise 2.0 – Presentation-Ready Climate Action Platform.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>for a greener planet.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
