import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEco } from '../../context/EcoContext';
import { X, Download, Printer, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CertificateModal: React.FC = () => {
  const { profile } = useAuth();
  const { 
    totalPoints, 
    completions, 
    levelInfo, 
    civicRecognition,
    isCertificateModalOpen, 
    closeCertificateModal 
  } = useEco();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isCertificateModalOpen) return null;

  const participantName = profile?.full_name || 'Eco Pioneer';
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  /**
   * Deterministic high-resolution certificate canvas generator (1600 x 1130 px)
   */
  const generateCertificatePNG = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1130;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D unsupported');

    // 1. Certificate Background & Outer Border
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1600, 1130);

    // Ornate Gold/Emerald double border
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1540, 1070);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, 1504, 1034);

    // Corner decorative accents
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = '#065f46';
      ctx.fillRect(x - 12, y - 12, 24, 24);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(48, 48);
    drawCorner(1552, 48);
    drawCorner(48, 1082);
    drawCorner(1552, 1082);

    // 2. Watermark / Prototype Disclaimer Banner
    ctx.font = '700 16px sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.fillText('DEMO RECOGNITION CERTIFICATE – CIVIC PROTOTYPE CONCEPT', 800, 85);

    // 3. Institution Header
    ctx.font = '900 36px serif';
    ctx.fillStyle = '#064e3b';
    ctx.fillText('E C O R I S E', 800, 140);

    ctx.font = '700 20px sans-serif';
    ctx.fillStyle = '#059669';
    ctx.fillText('CLIMATE ACTION PROGRAM • CIVIC RECOGNITION', 800, 175);

    ctx.font = '900 52px serif';
    ctx.fillStyle = '#111827';
    ctx.fillText('CERTIFICATE OF CLIMATE RECOGNITION', 800, 250);

    // Divider Line
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(600, 275);
    ctx.lineTo(1000, 275);
    ctx.stroke();

    // 4. Presentation Wording
    ctx.font = '400 24px serif';
    ctx.fillStyle = '#4b5563';
    ctx.fillText('This civic certificate is proudly presented to', 800, 340);

    // Recipient Name
    ctx.font = 'bold 54px serif';
    ctx.fillStyle = '#064e3b';
    ctx.fillText(participantName, 800, 420);

    // Underline for name
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(350, 445);
    ctx.lineTo(1250, 445);
    ctx.stroke();

    // Body Text
    ctx.font = '400 23px serif';
    ctx.fillStyle = '#374151';
    ctx.fillText('for outstanding local participation in the EcoRise Climate Challenge', 800, 495);
    ctx.fillText('and meaningful grassroots contributions toward local community sustainability.', 800, 530);

    // 5. Four High-Impact Metric Badges
    const stats = [
      { label: 'ECO POINTS', val: `${totalPoints} PTS` },
      { label: 'ACTIONS LOGGED', val: `${completions.length} HABITS` },
      { label: 'RECOGNITION TIER', val: civicRecognition.title.toUpperCase() },
      { label: 'SDG GOAL', val: 'SDG 13: CLIMATE' }
    ];

    const startX = 240;
    const boxW = 260;
    const boxH = 90;
    const gap = 24;

    stats.forEach((s, idx) => {
      const bx = startX + idx * (boxW + gap);
      const by = 590;

      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 1.5;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(bx, by, boxW, boxH, 12);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(bx, by, boxW, boxH);
      }

      ctx.font = '800 13px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(s.label, bx + (boxW / 2), by + 32);

      ctx.font = '900 20px sans-serif';
      ctx.fillStyle = '#064e3b';
      ctx.fillText(s.val, bx + (boxW / 2), by + 66);
    });

    // 6. Signatures & Seals
    // Date on left
    ctx.font = '600 20px serif';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    ctx.fillText(currentDate, 380, 830);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(250, 845);
    ctx.lineTo(510, 845);
    ctx.stroke();
    ctx.font = '700 15px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('DATE ISSUED', 380, 875);

    // Official Seal in Center
    ctx.save();
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(800, 830, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = '32px sans-serif';
    ctx.fillText('🌍', 800, 825);
    ctx.font = '800 11px sans-serif';
    ctx.fillStyle = '#92400e';
    ctx.fillText('SDG 13 SEAL', 800, 855);
    ctx.restore();

    // EcoByte Mascot Signature Mark on Right
    ctx.font = 'italic 28px serif';
    ctx.fillStyle = '#047857';
    ctx.textAlign = 'center';
    ctx.fillText('EcoByte 🌱🤖 (Verified)', 1220, 830);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(1090, 845);
    ctx.lineTo(1350, 845);
    ctx.stroke();
    ctx.font = '700 15px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('PROGRAM SIGNATURE & SEAL', 1220, 875);

    // 7. Footer ID
    ctx.font = '600 15px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`Certificate ID: ${civicRecognition.certificateId} • Local Eco-Challenge Progress Initiative`, 800, 970);

    return canvas.toDataURL('image/png');
  };

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const dataUrl = generateCertificatePNG();
      const link = document.createElement('a');
      link.download = `EcoRise_Certificate_${participantName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) document.body.removeChild(link);
      }, 200);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert('Could not generate certificate image. Please try printing.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative max-w-3xl w-full bg-white dark:bg-forest-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl my-8">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-forest-800">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Civic Climate Recognition Certificate</span>
          </div>

          <button
            onClick={closeCertificateModal}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-forest-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Visual Presentation Card */}
        <div className="bg-gradient-to-b from-amber-50/40 via-white to-emerald-50/30 dark:from-forest-950 dark:via-forest-900 dark:to-forest-950 border-4 border-double border-emerald-700/50 rounded-2xl p-6 md:p-10 text-center shadow-lg relative overflow-hidden">
          
          {/* Prototype Concept Watermark Banner */}
          <div className="inline-block px-3 py-1 rounded-full bg-amber-100/90 dark:bg-amber-950/70 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-300 mb-4">
            Demo Recognition Certificate — Prototype
          </div>

          <div className="font-display font-black text-xs tracking-widest uppercase text-emerald-800 dark:text-emerald-400 mb-1">
            EcoRise Climate Action Program
          </div>

          <h2 className="font-serif font-black text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">
            Certificate of Climate Recognition
          </h2>

          <p className="text-xs text-gray-600 dark:text-gray-300 font-serif italic mb-2">
            This certificate is presented to
          </p>

          <h3 className="font-serif font-bold text-3xl md:text-4xl text-emerald-800 dark:text-emerald-300 underline decoration-amber-500/50 underline-offset-8 mb-4">
            {participantName}
          </h3>

          <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 max-w-xl mx-auto font-serif leading-relaxed mb-6">
            for outstanding participation in the Local Eco-Challenge and meaningful community contribution toward <strong>UN SDG 13: Climate Action</strong>.
          </p>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-6">
            <div className="bg-white/80 dark:bg-forest-800/80 p-2.5 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Eco Points</span>
              <span className="font-display font-black text-base text-emerald-700 dark:text-emerald-300">{totalPoints} pts</span>
            </div>
            <div className="bg-white/80 dark:bg-forest-800/80 p-2.5 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Actions</span>
              <span className="font-display font-black text-base text-gray-800 dark:text-gray-100">{completions.length} habits</span>
            </div>
            <div className="bg-white/80 dark:bg-forest-800/80 p-2.5 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Level</span>
              <span className="font-display font-black text-base text-emerald-700 dark:text-emerald-300">{civicRecognition.title.split(' ')[0]}</span>
            </div>
            <div className="bg-white/80 dark:bg-forest-800/80 p-2.5 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Focus</span>
              <span className="font-display font-black text-base text-gray-800 dark:text-gray-100">SDG 13</span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-emerald-500/20 text-left">
            <div>
              <div className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200">{currentDate}</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Date Issued</div>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-500 flex items-center justify-center text-xl shadow-inner mb-0.5">
                🌍
              </div>
              <span className="text-[9px] uppercase font-black text-amber-700 dark:text-amber-400">SDG 13 Verified</span>
            </div>

            <div className="text-right">
              <div className="font-serif italic font-bold text-emerald-700 dark:text-emerald-400 text-sm">EcoByte 🌱🤖</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Program Signature</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-forest-800 text-[10px] font-mono text-gray-400">
            Certificate ID: {civicRecognition.certificateId} • EcoRise Community Climate Initiative
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-end gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 hover:bg-gray-50 dark:hover:bg-forest-800 text-gray-700 dark:text-gray-300 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Downloaded PNG! 🎉</span>
              </>
            ) : isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating High-Res Image...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Certificate (PNG)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
