import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEco } from '../../context/EcoContext';
import html2canvas from 'html2canvas';
import { X, Download, Share2, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { EcoByte } from '../mascot/EcoByte';

interface ShareCardModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const { profile } = useAuth();
  const { 
    totalPoints, 
    streak, 
    completions, 
    impactEquivalents, 
    levelInfo,
    isShareModalOpen,
    closeShareModal
  } = useEco();

  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Support both local and global modal control
  const activeIsOpen = propIsOpen !== undefined ? propIsOpen : isShareModalOpen;
  const handleClose = propOnClose || closeShareModal;

  if (!activeIsOpen) return null;

  const userName = profile?.full_name || 'Eco Pioneer';
  const userCity = profile?.city || 'Bengaluru';

  /**
   * Deterministic High-Resolution HTML5 Canvas 2D Generator
   * Guarantees an ultra-crisp, beautiful 1200x675 PNG export in 100% of browsers.
   */
  const generateCanvas2DPNG = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not supported');

    // 1. Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 675);
    bgGradient.addColorStop(0, '#031a10');
    bgGradient.addColorStop(0.5, '#063520');
    bgGradient.addColorStop(1, '#02150d');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 675);

    // Decorative ambient circles
    ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.beginPath();
    ctx.arc(1100, 100, 260, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(20, 184, 166, 0.07)';
    ctx.beginPath();
    ctx.arc(100, 580, 220, 0, Math.PI * 2);
    ctx.fill();

    // 2. Card Border with subtle glow
    ctx.save();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 18;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(40, 40, 1120, 595, 36);
      ctx.stroke();
    } else {
      ctx.strokeRect(40, 40, 1120, 595);
    }
    ctx.restore();

    // 3. Header: Brand & SDG 13 Pill
    // Brand Logo
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(95, 95, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '26px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌱', 95, 96);

    ctx.textAlign = 'left';
    ctx.font = '900 34px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('EcoRise 2.0', 135, 96);

    // SDG 13 Pill
    const pillText = 'UN SDG 13: CLIMATE ACTION';
    ctx.font = '700 16px sans-serif';
    const pillWidth = ctx.measureText(pillText).width + 36;
    
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.lineWidth = 1.5;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(1120 - pillWidth, 75, pillWidth, 38, 19);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = '#6ee7b7';
    ctx.textAlign = 'center';
    ctx.fillText(pillText, 1120 - (pillWidth / 2), 96);

    // Top Divider
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 145);
    ctx.lineTo(1120, 145);
    ctx.stroke();

    // 4. User Profile Section
    // Avatar Circle
    ctx.save();
    ctx.fillStyle = '#064e3b';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(130, 230, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🤖', 130, 230);
    ctx.restore();

    // User Info Text
    ctx.textAlign = 'left';
    ctx.font = '900 42px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(userName, 205, 215);

    ctx.font = '700 22px sans-serif';
    ctx.fillStyle = '#34d399';
    ctx.fillText(`${levelInfo.title} • Level ${levelInfo.level}`, 205, 252);

    ctx.font = '600 19px sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(`📍 ${userCity} Climate Cohort`, 205, 282);

    // 5. Four Stat Cards Grid
    const statCards = [
      { label: 'TOTAL ECO POINTS', val: `${totalPoints} PTS`, color: '#6ee7b7' },
      { label: 'ACTIVE ECO STREAK', val: `🔥 ${streak} DAYS`, color: '#fbbf24' },
      { label: 'HABITS COMPLETED', val: `${completions.length} ACTIONS`, color: '#5eead4' },
      { label: 'ESTIMATED CO₂ SAVED', val: `~${impactEquivalents.estimatedCo2Kg} KG CO₂`, color: '#93c5fd' }
    ];

    const cardW = 238;
    const cardH = 120;
    const startX = 80;
    const startY = 330;
    const gap = 24;

    statCards.forEach((stat, i) => {
      const x = startX + i * (cardW + gap);
      const y = startY;

      // Card Background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.28)';
      ctx.lineWidth = 1.5;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, 20);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(x, y, cardW, cardH);
      }

      // Card Label
      ctx.font = '800 13px sans-serif';
      ctx.fillStyle = '#9ca3af';
      ctx.textAlign = 'left';
      ctx.fillText(stat.label, x + 18, y + 36);

      // Card Value
      ctx.font = '900 27px sans-serif';
      ctx.fillStyle = stat.color;
      ctx.fillText(stat.val, x + 18, y + 80);
    });

    // 6. Footer Banner
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.beginPath();
    ctx.moveTo(80, 500);
    ctx.lineTo(1120, 500);
    ctx.stroke();

    ctx.font = '800 20px sans-serif';
    ctx.fillStyle = '#a7f3d0';
    ctx.textAlign = 'center';
    ctx.fillText('SMALL ACTIONS. BIG CLIMATE IMPACT. 🌍', 600, 545);

    ctx.font = '600 15px sans-serif';
    ctx.fillStyle = 'rgba(110, 231, 183, 0.7)';
    ctx.fillText('VERIFIED CLIMATE ACTION • ECORISE 2.0 • SDG 13 PLATFORM', 600, 580);

    return canvas.toDataURL('image/png');
  };

  const triggerDownload = (dataUrl: string) => {
    const link = document.createElement('a');
    const safeName = (profile?.full_name || 'Member').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `EcoRise_Progress_${safeName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 250);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      // First attempt DOM html2canvas rendering if ref exists
      let downloaded = false;
      if (cardRef.current) {
        try {
          const canvas = await html2canvas(cardRef.current, {
            scale: 2,
            backgroundColor: '#062417',
            useCORS: true,
            logging: false,
            allowTaint: true
          });
          const dataUrl = canvas.toDataURL('image/png');
          if (dataUrl && dataUrl.length > 5000) {
            triggerDownload(dataUrl);
            downloaded = true;
          }
        } catch (domErr) {
          console.warn('html2canvas DOM capture failed, utilizing canvas 2D renderer:', domErr);
        }
      }

      // If html2canvas failed or was bypassed, use direct Canvas 2D renderer
      if (!downloaded) {
        const dataUrl = generateCanvas2DPNG();
        triggerDownload(dataUrl);
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Final image export error:', e);
      // Absolute fallback
      try {
        const fallbackUrl = generateCanvas2DPNG();
        triggerDownload(fallbackUrl);
        setDownloadSuccess(true);
      } catch (err2) {
        alert('Could not generate image. Please try again.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyText = () => {
    const text = `🌱 I've earned ${totalPoints} Eco Points with a ${streak}-day streak on EcoRise! Taking weekly climate actions for UN SDG 13 in ${userCity}. Join me!`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-md w-full bg-white dark:bg-forest-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-forest-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
            <Share2 className="w-4 h-4" />
            <span>Shareable Eco Progress Card</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-forest-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shareable Card Preview Node */}
        <div
          ref={cardRef}
          className="bg-gradient-to-br from-emerald-950 via-forest-900 to-teal-950 text-white p-6 rounded-3xl border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌱</span>
              <span className="font-display font-black text-lg tracking-tight">EcoRise 2.0</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/35">
              SDG 13 Climate Action
            </span>
          </div>

          <div className="flex items-center gap-4 my-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-900/70 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 shadow-inner">
              <EcoByte stage={levelInfo.stage} size={54} interactive={false} />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white leading-tight">
                {userName}
              </h3>
              <div className="text-xs font-bold text-emerald-400">
                {levelInfo.title} (Level {levelInfo.level})
              </div>
              <div className="text-[11px] text-gray-300 mt-0.5 font-medium">
                📍 {userCity} Climate Cohort
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Total Eco Points</div>
              <div className="font-display font-black text-2xl text-emerald-400">{totalPoints} pts</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Eco Streak</div>
              <div className="font-display font-black text-2xl text-amber-400">🔥 {streak} Days</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Actions Logged</div>
              <div className="font-bold text-sm text-gray-200">{completions.length} habits</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Avoided CO₂</div>
              <div className="font-bold text-sm text-teal-300">~{impactEquivalents.estimatedCo2Kg} kg</div>
            </div>
          </div>

          <div className="text-center pt-2.5 border-t border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-300">
            SMALL ACTIONS. BIG CLIMATE IMPACT. 🌍
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-5">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition-all"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Downloaded PNG! 🎉</span>
              </>
            ) : isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Card...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Eco Card (PNG)</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyText}
            className="px-4 py-3 rounded-xl border border-gray-200 dark:border-forest-800 hover:bg-gray-50 dark:hover:bg-forest-800 text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Sparkles className="w-4 h-4" />}
            <span>{isCopied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
