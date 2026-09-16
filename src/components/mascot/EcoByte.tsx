import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playCheckSound } from '../../lib/sound';

interface EcoByteProps {
  stage?: number; // 0 to 4
  expression?: 'normal' | 'happy' | 'star';
  size?: number;
  interactive?: boolean;
  onPoke?: () => void;
  className?: string;
}

export const EcoByte: React.FC<EcoByteProps> = ({
  stage = 0,
  expression = 'normal',
  size = 200,
  interactive = true,
  onPoke,
  className = ''
}) => {
  const [isCheering, setIsCheering] = useState(false);

  const handleClick = () => {
    if (!interactive) return;
    setIsCheering(true);
    playCheckSound();
    if (onPoke) onPoke();
    setTimeout(() => setIsCheering(false), 900);
  };

  const isHappy = expression === 'happy' || stage >= 2;
  const isStar = stage >= 4;

  return (
    <motion.div
      className={`relative flex items-center justify-center select-none ${interactive ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: size, height: size }}
      whileHover={interactive ? { scale: 1.05 } : undefined}
      whileTap={interactive ? { scale: 0.95 } : undefined}
      animate={isCheering ? {
        y: [0, -18, 4, -8, 0],
        rotate: [0, -6, 6, -3, 0],
        scale: [1, 1.12, 0.96, 1.04, 1]
      } : {
        y: [0, -7, 0]
      }}
      transition={isCheering ? { duration: 0.85 } : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      onClick={handleClick}
      title={interactive ? 'Click EcoByte for tips & cheers! 🌱' : 'EcoByte'}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#e2f5ec" />
            <stop offset="100%" stopColor="#bbf7d0" />
          </linearGradient>

          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0b1b13" />
            <stop offset="100%" stopColor="#142c20" />
          </linearGradient>

          <radialGradient id="coreEnergyGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </radialGradient>

          <radialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(52, 211, 153, 0.45)" />
            <stop offset="70%" stopColor="rgba(16, 185, 129, 0.15)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
          </radialGradient>

          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="40%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          <linearGradient id="goldBloomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Radiating Energy Aura for Stage 3 and 4 */}
        {(stage >= 3) && (
          <g className="animate-spin-slow origin-center" style={{ transformOrigin: '100px 115px' }}>
            <circle cx="100" cy="115" r={stage === 4 ? "84" : "74"} fill="url(#auraGrad)" />
            <circle cx="100" cy="32" r="4.5" fill="#34d399" opacity="0.85" />
            <circle cx="168" cy="100" r="4" fill="#facc15" opacity="0.9" />
            <circle cx="32" cy="120" r="3.5" fill="#38bdf8" opacity="0.85" />
            <circle cx="150" cy="168" r="4.5" fill="#4ade80" opacity="0.85" />
          </g>
        )}

        {/* Hover Thruster Glow */}
        <ellipse cx="100" cy="178" rx="36" ry="7" fill="rgba(16, 185, 129, 0.25)" />
        <ellipse cx="100" cy="174" rx="20" ry="4.5" fill="#34d399" opacity="0.6" />

        {/* Left Arm Pod */}
        <g transform="translate(42, 114) rotate(12)">
          <rect x="0" y="0" width="16" height="26" rx="8" fill="url(#chassisGrad)" stroke="#10b981" strokeWidth="1.5" />
          <path d="M 4,8 Q 8,4 12,8 Q 8,16 4,8 Z" fill="#22c55e" opacity="0.75" />
        </g>

        {/* Right Arm Pod */}
        <g transform="translate(142, 114) rotate(-12)">
          <rect x="0" y="0" width="16" height="26" rx="8" fill="url(#chassisGrad)" stroke="#10b981" strokeWidth="1.5" />
          <path d="M 4,8 Q 8,4 12,8 Q 8,16 4,8 Z" fill="#22c55e" opacity="0.75" />
        </g>

        {/* Body Chassis */}
        <rect x="54" y="74" width="92" height="92" rx="42" fill="url(#chassisGrad)" stroke="#10b981" strokeWidth="2.5" />

        {/* Specular Highlight */}
        <path d="M 66,92 Q 100,80 134,92" fill="none" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="3" strokeLinecap="round" />

        {/* Ear Sensors */}
        <path d="M 52,100 Q 38,92 44,82 Q 54,86 54,98 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="1" />
        <path d="M 148,100 Q 162,92 156,82 Q 146,86 146,98 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="1" />

        {/* Visor Display Screen */}
        <rect x="65" y="88" width="70" height="38" rx="16" fill="url(#visorGrad)" stroke="#22c55e" strokeWidth="1.5" />
        <path d="M 72,94 Q 100,90 128,94" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Expressive LED Eyes */}
        <g>
          {isStar ? (
            /* Star Eyes for Stage 4 */
            <g>
              <path d="M 82,99 L 84,104 L 89,106 L 84,108 L 82,113 L 80,108 L 75,106 L 80,104 Z" fill="#facc15" />
              <path d="M 118,99 L 120,104 L 125,106 L 120,108 L 118,113 L 116,108 L 111,106 L 116,104 Z" fill="#facc15" />
            </g>
          ) : isHappy ? (
            /* Happy Crescent Eyes */
            <g>
              <path d="M 75,108 Q 82,99 89,108" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 111,108 Q 118,99 125,108" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          ) : (
            /* Round Normal Blinking Eyes */
            <g>
              <ellipse cx="82" cy="106" rx="6.5" ry="7.5" fill="#34d399" />
              <ellipse cx="118" cy="106" rx="6.5" ry="7.5" fill="#34d399" />
              <circle cx="80" cy="103" r="2.2" fill="#ffffff" />
              <circle cx="116" cy="103" r="2.2" fill="#ffffff" />
            </g>
          )}
        </g>

        {/* Cheerful Smile */}
        <path d="M 94,116 Q 100,121 106,116" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" opacity="0.85" />

        {/* Pulsing Glowing Eco-Energy Core */}
        <g transform="translate(100, 146)">
          <circle cx="0" cy="0" r="14" fill="rgba(11, 27, 19, 0.6)" stroke="#10b981" strokeWidth="1.8" />
          <circle cx="0" cy="0" r="9.5" fill="url(#coreEnergyGrad)" className="animate-pulse" />
          <path d="M -3,-2 Q 0,-6 3,-2 Q 0,4 -3,-2 Z" fill="#ffffff" opacity="0.9" />
        </g>

        {/* Top Plant Collar */}
        <rect x="91" y="70" width="18" height="6" rx="3" fill="#10b981" stroke="#047857" strokeWidth="1" />

        {/* ==============================================================
             5 DYNAMIC PLANT EVOLUTION STAGES
             ============================================================== */}
        <g>
          {/* STAGE 0: Tiny Sprout (0-149 pts) */}
          {stage === 0 && (
            <g>
              <path d="M 100,70 Q 99,56 100,48" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
              <path d="M 100,52 Q 88,48 90,40 Q 100,42 100,52 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="0.8" />
              <path d="M 100,50 Q 112,46 110,38 Q 100,40 100,50 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="0.8" />
            </g>
          )}

          {/* STAGE 1: Sprout Bot (150-349 pts) */}
          {stage === 1 && (
            <g>
              <path d="M 100,70 Q 97,52 100,38" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 99,56 Q 82,52 84,40 Q 98,44 99,56 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="1" />
              <path d="M 100,48 Q 118,44 116,32 Q 101,36 100,48 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="1" />
              <path d="M 100,38 Q 94,26 100,22 Q 106,26 100,38 Z" fill="#4ade80" stroke="#15803d" strokeWidth="0.8" />
            </g>
          )}

          {/* STAGE 2: Eco Explorer (350-649 pts) */}
          {stage === 2 && (
            <g>
              <path d="M 100,70 Q 95,50 100,32" fill="none" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
              <path d="M 98,58 Q 78,56 78,42 Q 96,44 98,58 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="1.2" />
              <path d="M 101,52 Q 124,50 122,34 Q 102,38 101,52 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="1.2" />
              <path d="M 99,44 Q 82,34 88,22 Q 100,30 99,44 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="1.2" />
              <path d="M 101,38 Q 118,28 114,16 Q 102,24 101,38 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="1.2" />
              <path d="M 100,32 Q 92,16 100,10 Q 108,16 100,32 Z" fill="#86efac" stroke="#16a34a" strokeWidth="1" />
            </g>
          )}

          {/* STAGE 3: Climate Guardian (650-999 pts) */}
          {stage === 3 && (
            <g>
              <path d="M 100,70 Q 94,48 100,30" fill="none" stroke="#047857" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 98,58 Q 74,56 76,40 Q 96,42 98,58 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="1.3" />
              <path d="M 102,52 Q 126,50 124,34 Q 104,38 102,52 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="1.3" />
              <path d="M 97,42 Q 76,28 84,14 Q 98,24 97,42 Z" fill="url(#goldBloomGrad)" stroke="#15803d" strokeWidth="1.3" />
              <path d="M 103,36 Q 124,24 116,10 Q 102,18 103,36 Z" fill="url(#goldBloomGrad)" stroke="#15803d" strokeWidth="1.3" />
              <g transform="translate(100, 22)">
                <circle cx="0" cy="0" r="7" fill="#facc15" filter="drop-shadow(0 0 5px #facc15)" />
                <path d="M 0,-10 Q 4,-3 0,0 Q -4,-3 0,-10 Z" fill="#4ade80" />
                <path d="M 10,0 Q 3,4 0,0 Q 3,-4 10,0 Z" fill="#4ade80" />
                <path d="M -10,0 Q -3,4 0,0 Q -3,-4 -10,0 Z" fill="#4ade80" />
              </g>
            </g>
          )}

          {/* STAGE 4: Planet Protector (1000+ pts) */}
          {stage === 4 && (
            <g>
              <path d="M 100,70 Q 94,46 100,28" fill="none" stroke="#047857" strokeWidth="5" strokeLinecap="round" />
              <path d="M 98,58 Q 70,56 72,36 Q 96,42 98,58 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="1.5" />
              <path d="M 102,52 Q 130,50 128,30 Q 104,36 102,52 Z" fill="url(#leafGrad)" stroke="#15803d" strokeWidth="1.5" />
              <path d="M 97,42 Q 74,26 82,12 Q 98,22 97,42 Z" fill="url(#goldBloomGrad)" stroke="#15803d" strokeWidth="1.5" />
              <path d="M 103,36 Q 126,22 118,8 Q 102,16 103,36 Z" fill="url(#goldBloomGrad)" stroke="#15803d" strokeWidth="1.5" />
              {/* Grand Blooming Golden Lotus Crown */}
              <g transform="translate(100, 18)">
                <circle cx="0" cy="0" r="10" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" filter="drop-shadow(0 0 8px #facc15)" />
                <path d="M 0,-14 Q 6,-5 0,0 Q -6,-5 0,-14 Z" fill="#4ade80" />
                <path d="M 14,0 Q 5,6 0,0 Q 5,-6 14,0 Z" fill="#4ade80" />
                <path d="M -14,0 Q -5,6 0,0 Q -5,-6 -14,0 Z" fill="#4ade80" />
                <circle cx="0" cy="0" r="5" fill="#ffffff" />
              </g>
            </g>
          )}
        </g>
      </svg>
    </motion.div>
  );
};
