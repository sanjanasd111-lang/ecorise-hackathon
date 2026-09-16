import React from 'react';
import { useEco } from '../context/EcoContext';
import { useAuth } from '../context/AuthContext';
import { CivicPartnershipCard } from '../components/civic/CivicPartnershipCard';
import { Award, ShieldCheck, FileText, CheckCircle2, Download, ExternalLink, Sparkles, Building2 } from 'lucide-react';

export const CivicImpactPage: React.FC = () => {
  const { profile } = useAuth();
  const { totalPoints, civicRecognition, openCertificateModal, levelInfo } = useEco();

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-forest-900 text-white rounded-3xl p-6 md:p-10 shadow-lg border border-emerald-500/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Civic Recognition Framework</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Civic Climate Recognition & Impact
          </h1>
          <p className="text-sm md:text-base text-emerald-100/90 mt-2 leading-relaxed">
            Connecting individual student climate habits directly with local municipal recognition. Earn verified certificate tiers, engage local municipal partners, and demonstrate authentic collective impact.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={openCertificateModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-gray-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>View & Download Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Current Recognition Tier Card */}
      <div className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              <span>Your Municipal Standing</span>
            </div>
            <h2 className="font-display font-black text-2xl text-gray-900 dark:text-emerald-50">
              Current Recognition: {civicRecognition.tier}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Certified for {profile?.full_name || 'Eco Pioneer'} in {profile?.city || 'Bengaluru'} with {totalPoints} Eco Points.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-extrabold text-sm flex items-center gap-2 self-start sm:self-center">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>ID: {civicRecognition.certificateId}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tier: 'Bronze', points: '100+ pts', icon: '🥉', desc: 'Civic Environmental Contributor' },
            { tier: 'Silver', points: '200+ pts', icon: '🥈', desc: 'Urban Sustainability Advocate' },
            { tier: 'Gold', points: '300+ pts', icon: '🥇', desc: 'Municipal Climate Champion' },
            { tier: 'Climate Leader', points: '500+ pts', icon: '👑', desc: 'EcoRise Master Ambassador' }
          ].map(t => {
            const isAchieved = (
              (t.tier === 'Bronze' && totalPoints >= 100) ||
              (t.tier === 'Silver' && totalPoints >= 200) ||
              (t.tier === 'Gold' && totalPoints >= 300) ||
              (t.tier === 'Climate Leader' && totalPoints >= 500)
            );

            return (
              <div
                key={t.tier}
                className={`p-4 rounded-2xl border transition-all ${
                  isAchieved
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-500/40 shadow-sm'
                    : 'bg-gray-50/50 dark:bg-forest-800/30 border-gray-200 dark:border-forest-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-2xl">{t.icon}</span>
                  {isAchieved ? (
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400">
                      Requires {t.points}
                    </span>
                  )}
                </div>
                <div className="font-display font-black text-sm text-gray-900 dark:text-gray-100">
                  {t.tier} Tier
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6-Step Civic Framework & Mock Municipal Partner */}
      <CivicPartnershipCard />

    </div>
  );
};
