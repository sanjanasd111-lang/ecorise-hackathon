import React, { useState } from 'react';
import { useEco } from '../../context/EcoContext';
import { Building2, Award, CheckCircle2, FileText, ArrowRight, Sparkles, Send, ShieldCheck } from 'lucide-react';

export const CivicPartnershipCard: React.FC = () => {
  const { totalPoints, civicRecognition, openCertificateModal } = useEco();
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [partnerOrg, setPartnerOrg] = useState('');
  const [partnerType, setPartnerType] = useState('Municipality');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const recognitionTiers = [
    { title: 'Bronze Eco Contributor', minPoints: 100, badge: '🥉', desc: 'Active citizen logging consistent daily climate habits.' },
    { title: 'Silver Climate Contributor', minPoints: 200, badge: '🥈', desc: 'Exemplary participant driving multi-category sustainability.' },
    { title: 'Gold Climate Champion', minPoints: 300, badge: '🥇', desc: 'Community leader with high impact across green mobility & conservation.' },
    { title: 'Civic Climate Leader', minPoints: 500, badge: '🏆', desc: 'Highest tier of youth climate leadership and institutional recognition.' }
  ];

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsPartnerModalOpen(false);
      setPartnerOrg('');
      setPartnerEmail('');
    }, 2500);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Civic Climate Recognition Program & Certificate Access */}
      <section className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Civic Climate Recognition</span>
            </div>
            <h3 className="font-display font-black text-2xl md:text-3xl text-gray-900 dark:text-emerald-50">
              Recognition Program
            </h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Top climate contributors are recognized for grassroots impact supporting local sustainability programs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {civicRecognition.isEligible ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Eligible for Community Recognition</span>
              </div>
            ) : (
              <div className="text-xs text-gray-400 font-bold">
                Reach 100 points for Bronze Recognition
              </div>
            )}

            <button
              onClick={openCertificateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View Recognition Certificate</span>
            </button>
          </div>
        </div>

        {/* 4 Recognition Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {recognitionTiers.map(t => {
            const isAchieved = totalPoints >= t.minPoints;

            return (
              <div
                key={t.title}
                className={`p-4 rounded-2xl border transition-all ${
                  isAchieved
                    ? 'bg-gradient-to-b from-white to-emerald-50/50 dark:from-forest-800/80 dark:to-forest-900/90 border-emerald-500/40 shadow-sm'
                    : 'bg-gray-50/50 dark:bg-forest-900/30 border-gray-200/60 dark:border-forest-800/40 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-2xl">{t.badge}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    isAchieved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 dark:bg-forest-800 text-gray-500'
                  }`}>
                    {t.minPoints}+ PTS
                  </span>
                </div>

                <h4 className="font-display font-black text-sm text-gray-900 dark:text-white mb-1">
                  {t.title}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-[11px] text-gray-400 dark:text-gray-500 italic text-center">
          * Prototype Concept: Certificates represent educational and civic simulation milestones.
        </div>
      </section>

      {/* 2. How EcoRise Can Help Communities (6-Step Framework) */}
      <section className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Civic Impact Hub</span>
          </div>
          <h3 className="font-display font-black text-2xl md:text-3xl text-gray-900 dark:text-emerald-50">
            How EcoRise Can Help Communities
          </h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            A structured model for municipalities, colleges, and schools to incentivize citizen climate action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { step: '01', title: 'Measurable Action', desc: 'Students and citizens complete verified daily and weekly climate actions.' },
            { step: '02', title: 'Transparent Eco Points', desc: 'EcoRise converts positive environmental choices into transparent, standardized points.' },
            { step: '03', title: 'Community Insights', desc: 'Municipalities and campuses view aggregate trends across mobility, waste, and energy.' },
            { step: '04', title: 'Civic Recognition', desc: 'Top contributors receive formal certificates and public recognition from local hubs.' },
            { step: '05', title: 'Behavioral Incentives', desc: 'Institutions foster long-term sustainable habits through positive gamification.' },
            { step: '06', title: 'Civic Challenges', desc: 'City-wide or campus-wide eco challenges unite cohorts for collective goals.' }
          ].map(item => (
            <div
              key={item.step}
              className="bg-gray-50/60 dark:bg-forest-800/40 rounded-2xl p-4 border border-gray-100 dark:border-forest-800 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 mb-1 block">
                  Step {item.step}
                </span>
                <h4 className="font-display font-black text-sm text-gray-900 dark:text-white mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Mock Civic & Community Partners Card */}
        <div className="bg-gradient-to-r from-emerald-900 via-forest-900 to-teal-900 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>For Civic & Community Partners</span>
            </div>
            <h4 className="font-display font-black text-xl md:text-2xl text-white mb-2">
              Partner with EcoRise in Your Municipality
            </h4>
            <p className="text-xs md:text-sm text-emerald-100/80 max-w-xl leading-relaxed">
              “Identify climate champions, encourage participation, and recognize local environmental action across schools, colleges, and neighborhood wards.”
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsPartnerModalOpen(true)}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all text-center"
            >
              Explore Partnership
            </button>
            <button
              onClick={openCertificateModal}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold text-xs transition-all text-center"
            >
              View Community Impact
            </button>
          </div>
        </div>
      </section>

      {/* Partnership Inquiry Modal */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-white dark:bg-forest-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>Civic Partnership Inquiry</span>
              </h4>
              <button
                onClick={() => setIsPartnerModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h5 className="font-bold text-sm text-gray-900 dark:text-white">Inquiry Received!</h5>
                <p className="text-xs text-gray-500 mt-1">
                  Thank you for exploring an EcoRise pilot for your community. Our team will get in touch.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Organization / Institution Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City Climate Action Ward, Green University"
                    value={partnerOrg}
                    onChange={e => setPartnerOrg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Partner Category
                  </label>
                  <select
                    value={partnerType}
                    onChange={e => setPartnerType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800 text-xs text-gray-900 dark:text-white"
                  >
                    <option>Municipality / City Council</option>
                    <option>College / University</option>
                    <option>High School Network</option>
                    <option>Environmental NGO</option>
                    <option>Corporate CSR Program</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Official Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="partner@municipality.gov.demo"
                    value={partnerEmail}
                    onChange={e => setPartnerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPartnerModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 text-xs font-bold text-gray-600 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                  >
                    Submit Pilot Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
