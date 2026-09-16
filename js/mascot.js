/**
 * EcoRise - Local Eco-Challenge
 * EcoByte 🌱🤖 Original Mascot SVG Generator & State Controller
 *
 * Designed exclusively for EcoRise based on SDG 13 Climate Action.
 */

import { ECOBYTE_MESSAGES, ECO_FACTS } from './data.js';

export class EcoByteController {
  constructor(options = {}) {
    this.container = options.container || null;
    this.bubbleElement = options.bubbleElement || null;
    this.badgeElement = options.badgeElement || null;
    this.stage = 0;
    this.expression = 'normal'; // 'normal' | 'happy' | 'star'
    this.currentPoints = 0;
    this.factIndex = 0;
  }

  /**
   * Determine evolution stage from points:
   * 0–19 pts: Stage 0
   * 20–49 pts: Stage 1
   * 50–99 pts: Stage 2
   * 100+ pts: Stage 3
   */
  static getStageFromPoints(points) {
    if (points >= 100) return 3;
    if (points >= 50) return 2;
    if (points >= 20) return 1;
    return 0;
  }

  static getStageTitle(stage) {
    switch (stage) {
      case 0: return "Sprout Robot 🌱";
      case 1: return "Energy Seedling ⚡";
      case 2: return "Eco Champion 🌿";
      case 3: return "Climate Master 🌍⚡";
      default: return "Sprout Robot 🌱";
    }
  }

  /**
   * Generates the custom vector SVG markup for EcoByte
   */
  getSVGMarkup(stage = this.stage, expression = this.expression) {
    const eyeHappy = expression === 'happy' || stage >= 2;
    const eyeStar = stage >= 3;

    return `
      <svg class="ecobyte-svg ecobyte-stage-${stage} ${eyeStar ? 'ecobyte-star-eyes' : eyeHappy ? 'ecobyte-happy-eyes' : ''}"
           viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EcoByte the sustainability robot mascot">
        <defs>
          <!-- Chassis Metallic Gradient -->
          <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="70%" stop-color="#e2f5ec" />
            <stop offset="100%" stop-color="#c1ecd6" />
          </linearGradient>

          <!-- Visor Display Gradient -->
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0b1b13" />
            <stop offset="100%" stop-color="#142c20" />
          </linearGradient>

          <!-- Energy Core Gradient -->
          <radialGradient id="coreEnergyGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#6ee7b7" />
            <stop offset="50%" stop-color="#10b981" />
            <stop offset="100%" stop-color="#047857" />
          </radialGradient>

          <!-- Champion Aura Radial -->
          <radialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(52, 211, 153, 0.4)" />
            <stop offset="70%" stop-color="rgba(16, 185, 129, 0.15)" />
            <stop offset="100%" stop-color="rgba(16, 185, 129, 0)" />
          </radialGradient>

          <!-- Leaf Green Gradient -->
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#86efac" />
            <stop offset="40%" stop-color="#22c55e" />
            <stop offset="100%" stop-color="#15803d" />
          </linearGradient>

          <!-- Golden Bloom for Stage 3 -->
          <linearGradient id="goldBloomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fde047" />
            <stop offset="50%" stop-color="#10b981" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>
        </defs>

        <!-- Floating Group containing full mascot -->
        <g class="ecobyte-group-floating">
          
          <!-- Stage 3 Champion Radiating Aura -->
          <g class="ecobyte-energy-aura" style="display: none;">
            <circle cx="100" cy="115" r="76" fill="url(#auraGrad)" />
            <!-- Orbiting Particle Dots -->
            <circle cx="100" cy="35" r="4" fill="#34d399" opacity="0.8" />
            <circle cx="165" cy="100" r="3.5" fill="#facc15" opacity="0.85" />
            <circle cx="35" cy="120" r="3" fill="#38bdf8" opacity="0.8" />
            <circle cx="145" cy="165" r="4" fill="#4ade80" opacity="0.8" />
          </g>

          <!-- Hover Thruster / Shadow Glow underneath -->
          <ellipse cx="100" cy="178" rx="36" ry="7" fill="rgba(16, 185, 129, 0.25)" />
          <ellipse cx="100" cy="174" rx="20" ry="4.5" fill="#34d399" opacity="0.6" filter="blur(2px)" />

          <!-- Left Robot Arm / Leaf Pod -->
          <g transform="translate(42, 114) rotate(12)">
            <rect x="0" y="0" width="16" height="26" rx="8" fill="url(#chassisGrad)" stroke="#10b981" stroke-width="1.5" />
            <!-- Small leaf accent on arm -->
            <path d="M 4,8 Q 8,4 12,8 Q 8,16 4,8 Z" fill="#22c55e" opacity="0.75" />
          </g>

          <!-- Right Robot Arm / Leaf Pod -->
          <g transform="translate(142, 114) rotate(-12)">
            <rect x="0" y="0" width="16" height="26" rx="8" fill="url(#chassisGrad)" stroke="#10b981" stroke-width="1.5" />
            <!-- Small leaf accent on arm -->
            <path d="M 4,8 Q 8,4 12,8 Q 8,16 4,8 Z" fill="#22c55e" opacity="0.75" />
          </g>

          <!-- Robot Body Chassis (Friendly rounded capsule) -->
          <rect x="54" y="74" width="92" height="92" rx="42" fill="url(#chassisGrad)" stroke="#10b981" stroke-width="2.5" />

          <!-- High-tech Body Specular Curve -->
          <path d="M 66,92 Q 100,80 134,92" fill="none" stroke="rgba(255, 255, 255, 0.85)" stroke-width="3" stroke-linecap="round" />

          <!-- Ear Leaf Antenna Sensors -->
          <!-- Left Ear -->
          <path d="M 52,100 Q 38,92 44,82 Q 54,86 54,98 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="1" />
          <!-- Right Ear -->
          <path d="M 148,100 Q 162,92 156,82 Q 146,86 146,98 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="1" />

          <!-- Dark Curved Visor Screen -->
          <rect x="65" y="88" width="70" height="38" rx="16" fill="url(#visorGrad)" stroke="#22c55e" stroke-width="1.5" />

          <!-- Visor Glare Reflection -->
          <path d="M 72,94 Q 100,90 128,94" fill="none" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.5" stroke-linecap="round" />

          <!-- Eyes Group -->
          <g class="ecobyte-eye">
            <!-- Normal Round LED Eyes -->
            <g class="ecobyte-eye-round">
              <ellipse cx="82" cy="106" rx="6.5" ry="7.5" fill="#34d399" />
              <ellipse cx="118" cy="106" rx="6.5" ry="7.5" fill="#34d399" />
              <!-- Eye Highlights -->
              <circle cx="80" cy="103" r="2.2" fill="#ffffff" />
              <circle cx="116" cy="103" r="2.2" fill="#ffffff" />
            </g>

            <!-- Happy Crescent Eyes (When cheerful / stage 1 & 2) -->
            <g class="ecobyte-eye-happy" style="display: none;">
              <path d="M 75,108 Q 82,99 89,108" fill="none" stroke="#34d399" stroke-width="3.5" stroke-linecap="round" />
              <path d="M 111,108 Q 118,99 125,108" fill="none" stroke="#34d399" stroke-width="3.5" stroke-linecap="round" />
            </g>

            <!-- Star Eyes (For Stage 3 Champion) -->
            <g class="ecobyte-eye-star" style="display: none;">
              <!-- Left Star -->
              <path d="M 82,99 L 84,104 L 89,106 L 84,108 L 82,113 L 80,108 L 75,106 L 80,104 Z" fill="#facc15" />
              <!-- Right Star -->
              <path d="M 118,99 L 120,104 L 125,106 L 120,108 L 118,113 L 116,108 L 111,106 L 116,104 Z" fill="#facc15" />
            </g>
          </g>

          <!-- Subtle Friendly Smile on Visor -->
          <path d="M 94,116 Q 100,121 106,116" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" opacity="0.85" />

          <!-- Eco-Energy Glowing Chest Core -->
          <g transform="translate(100, 146)">
            <!-- Outer Core Glass Ring -->
            <circle cx="0" cy="0" r="14" fill="rgba(11, 27, 19, 0.6)" stroke="#10b981" stroke-width="1.8" />
            <!-- Pulsing Energy Center -->
            <circle class="ecobyte-core" cx="0" cy="0" r="9.5" fill="url(#coreEnergyGrad)" />
            <!-- Inner Leaf Symbol inside Core -->
            <path d="M -3,-2 Q 0,-6 3,-2 Q 0,4 -3,-2 Z" fill="#ffffff" opacity="0.9" />
          </g>

          <!-- Top Plant Socket Collar -->
          <rect x="91" y="70" width="18" height="6" rx="3" fill="#10b981" stroke="#047857" stroke-width="1" />

          <!-- ==============================================
               PLANT EVOLUTION STAGES GROWING FROM HEAD
               ============================================== -->
          <g class="ecobyte-plant-sway">

            <!-- STAGE 0 (0-19 pts): Tiny Tender Sprout -->
            <g class="ecobyte-plant-stage-0">
              <!-- Central Stem -->
              <path d="M 100,70 Q 99,56 100,48" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" />
              <!-- Left Little Leaf -->
              <path d="M 100,52 Q 88,48 90,40 Q 100,42 100,52 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="0.8" />
              <!-- Right Little Leaf -->
              <path d="M 100,50 Q 112,46 110,38 Q 100,40 100,50 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="0.8" />
            </g>

            <!-- STAGE 1 (20-49 pts): Growing Energetic Stem with 3 leaves -->
            <g class="ecobyte-plant-stage-1">
              <!-- Thicker Stem -->
              <path d="M 100,70 Q 97,52 100,38" fill="none" stroke="#16a34a" stroke-width="3.5" stroke-linecap="round" />
              <!-- Left Leaf 1 -->
              <path d="M 99,56 Q 82,52 84,40 Q 98,44 99,56 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="1" />
              <!-- Right Leaf 2 -->
              <path d="M 100,48 Q 118,44 116,32 Q 101,36 100,48 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="1" />
              <!-- Center Top Bud Leaf -->
              <path d="M 100,38 Q 94,26 100,22 Q 106,26 100,38 Z" fill="#4ade80" stroke="#15803d" stroke-width="0.8" />
            </g>

            <!-- STAGE 2 (50-99 pts): Lush Multi-Leaf Plant with Energy Buds -->
            <g class="ecobyte-plant-stage-2">
              <!-- Strong Plant Stem -->
              <path d="M 100,70 Q 95,50 100,32" fill="none" stroke="#15803d" stroke-width="4" stroke-linecap="round" />
              <!-- Branching Leaves -->
              <path d="M 98,58 Q 78,56 78,42 Q 96,44 98,58 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="1.2" />
              <path d="M 101,52 Q 124,50 122,34 Q 102,38 101,52 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="1.2" />
              <path d="M 99,44 Q 82,34 88,22 Q 100,30 99,44 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="1.2" />
              <path d="M 101,38 Q 118,28 114,16 Q 102,24 101,38 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="1.2" />
              <!-- Top Radiant Leaf -->
              <path d="M 100,32 Q 92,16 100,10 Q 108,16 100,32 Z" fill="#86efac" stroke="#16a34a" stroke-width="1" />
            </g>

            <!-- STAGE 3 (100+ pts): Blooming Golden-Green Climate Crown -->
            <g class="ecobyte-plant-stage-3">
              <!-- Sacred Canopy Stem -->
              <path d="M 100,70 Q 94,46 100,28" fill="none" stroke="#047857" stroke-width="4.5" stroke-linecap="round" />
              <!-- Full Majestic Foliage -->
              <path d="M 98,58 Q 72,56 74,38 Q 96,42 98,58 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="1.5" />
              <path d="M 102,52 Q 128,50 126,32 Q 104,36 102,52 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="1.5" />
              <path d="M 97,42 Q 76,28 84,14 Q 98,24 97,42 Z" fill="url(#goldBloomGrad)" stroke="#15803d" stroke-width="1.5" />
              <path d="M 103,36 Q 124,24 116,10 Q 102,18 103,36 Z" fill="url(#goldBloomGrad)" stroke="#15803d" stroke-width="1.5" />
              <!-- Golden Blooming Lotus / Star Blossom on Crown -->
              <g transform="translate(100, 20)">
                <circle cx="0" cy="0" r="9" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" filter="drop-shadow(0 0 6px #facc15)" />
                <path d="M 0,-12 Q 5,-4 0,0 Q -5,-4 0,-12 Z" fill="#4ade80" />
                <path d="M 12,0 Q 4,5 0,0 Q 4,-5 12,0 Z" fill="#4ade80" />
                <path d="M -12,0 Q -4,5 0,0 Q -4,-5 -12,0 Z" fill="#4ade80" />
                <circle cx="0" cy="0" r="4.5" fill="#ffffff" />
              </g>
            </g>

          </g> <!-- end plant sway -->

        </g> <!-- end floating group -->
      </svg>
    `;
  }

  /**
   * Generates a mini avatar version for the navbar badge
   */
  getMiniAvatarMarkup(stage = this.stage) {
    return `
      <svg class="mini-avatar-svg ecobyte-stage-${stage}" viewBox="45 40 110 130" xmlns="http://www.w3.org/2000/svg">
        <!-- Rounded Head & Body -->
        <rect x="58" y="74" width="84" height="80" rx="38" fill="#e2f5ec" stroke="#10b981" stroke-width="3" />
        <rect x="68" y="88" width="64" height="34" rx="14" fill="#142c20" />
        <!-- Glowing Mini Eyes -->
        <ellipse cx="84" cy="105" rx="5" ry="6" fill="#34d399" />
        <ellipse cx="116" cy="105" rx="5" ry="6" fill="#34d399" />
        <!-- Mini Sprout -->
        <path d="M 100,74 Q 99,56 100,48" fill="none" stroke="#22c55e" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 100,52 Q 88,48 90,40 Q 100,42 100,52 Z" fill="#22c55e" />
        <path d="M 100,50 Q 112,46 110,38 Q 100,40 100,50 Z" fill="#4ade80" />
      </svg>
    `;
  }

  /**
   * Mount and render EcoByte in the container
   */
  render() {
    if (this.container) {
      this.container.innerHTML = `
        <div class="ecobyte-svg-wrapper" title="Click EcoByte for eco-tips and encouragement!">
          ${this.getSVGMarkup()}
        </div>
      `;

      const wrapper = this.container.querySelector('.ecobyte-svg-wrapper');
      if (wrapper) {
        wrapper.addEventListener('click', () => this.poke());
      }
    }

    this.updateMessage();
  }

  /**
   * Update EcoByte based on current score
   */
  updateProgress(points) {
    this.currentPoints = points;
    const newStage = EcoByteController.getStageFromPoints(points);
    const stageChanged = newStage !== this.stage;
    this.stage = newStage;

    if (this.container) {
      const svg = this.container.querySelector('.ecobyte-svg');
      if (svg) {
        // Update stage class
        svg.className.baseVal = `ecobyte-svg ecobyte-stage-${this.stage} ${this.stage >= 3 ? 'ecobyte-star-eyes' : this.stage >= 2 ? 'ecobyte-happy-eyes' : ''}`;
      } else {
        this.render();
      }
    }

    if (this.badgeElement) {
      this.badgeElement.textContent = EcoByteController.getStageTitle(this.stage);
    }

    this.updateMessage();

    if (stageChanged) {
      this.cheer();
    }
  }

  /**
   * Dynamically pick and display motivational text matching the user's progress
   */
  updateMessage(customText = null) {
    let message = "";
    if (customText) {
      message = customText;
    } else {
      const stageKey = `stage${this.stage}`;
      const list = ECOBYTE_MESSAGES[stageKey] || ECOBYTE_MESSAGES.stage0;
      message = list[0]; // primary stage message

      if (this.currentPoints >= 100) {
        message = "WOW! You’re powering a greener future! 🌍⚡ You're an Eco Champion!";
      } else if (this.currentPoints >= 50) {
        message = "Amazing! You’re becoming an Eco Champion! 🌿";
      } else if (this.currentPoints >= 20) {
        message = "Nice start! Your eco-energy is growing! ⚡";
      } else {
        message = "Hey! I’m EcoByte 🌱 Let’s start your climate journey!";
      }
    }

    if (this.bubbleElement) {
      this.bubbleElement.textContent = message;
    }
  }

  /**
   * Trigger celebration bounce and joyful expressions
   */
  cheer() {
    if (!this.container) return;
    this.container.classList.add('ecobyte-cheering');
    setTimeout(() => {
      this.container.classList.remove('ecobyte-cheering');
    }, 900);
  }

  /**
   * When user clicks on EcoByte, rotate through interesting eco facts & cheer!
   */
  poke() {
    this.cheer();
    const fact = ECO_FACTS[this.factIndex % ECO_FACTS.length];
    this.factIndex++;
    this.updateMessage(`🌱 EcoByte Tip: ${fact}`);
  }
}
