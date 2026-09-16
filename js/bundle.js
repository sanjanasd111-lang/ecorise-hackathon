(() => {
  // js/data.js
  var ACTIVITIES = [
    {
      id: "plant_tree",
      name: "Plant a tree",
      category: "nature",
      icon: "\u{1F331}",
      points: 25,
      description: "Plant or help care for a tree, sapling, or community green space this week.",
      impact: { trees: 1, co2: 22 }
    },
    {
      id: "refillable_bottle",
      name: "Use a refillable bottle",
      category: "water",
      icon: "\u{1F4A7}",
      points: 10,
      description: "Replace disposable plastic drink bottles with a reusable container.",
      impact: { plastic: 2, water: 3 }
    },
    {
      id: "cycle_trip",
      name: "Cycle instead of driving",
      category: "transport",
      icon: "\u{1F6B2}",
      points: 20,
      description: "Choose cycling or walking for a short commute or errand instead of a motor vehicle.",
      impact: { transport: 6, energy: 3 }
    },
    {
      id: "save_electricity",
      name: "Save electricity",
      category: "energy",
      icon: "\u{1F4A1}",
      points: 10,
      description: "Unplug standby electronics and switch off appliances when not actively used.",
      impact: { energy: 4 }
    },
    {
      id: "recycle_waste",
      name: "Recycle waste",
      category: "waste",
      icon: "\u267B\uFE0F",
      points: 15,
      description: "Carefully sort and separate recyclable paper, metals, and clean plastics.",
      impact: { plastic: 4 }
    },
    {
      id: "public_transport",
      name: "Use public transport",
      category: "transport",
      icon: "\u{1F68C}",
      points: 15,
      description: "Take the bus, metro, tram, or share a ride for your daily transit.",
      impact: { transport: 5 }
    },
    {
      id: "avoid_plastic",
      name: "Avoid single-use plastic",
      category: "waste",
      icon: "\u{1F6CD}\uFE0F",
      points: 10,
      description: "Carry a reusable canvas tote bag and refuse plastic cutlery or wraps.",
      impact: { plastic: 3 }
    },
    {
      id: "save_water",
      name: "Save water",
      category: "water",
      icon: "\u{1F6BF}",
      points: 10,
      description: "Take a shorter shower under 5 minutes and turn off tap while brushing.",
      impact: { water: 25 }
    },
    {
      id: "switch_lights",
      name: "Switch off unused lights",
      category: "energy",
      icon: "\u{1F526}",
      points: 10,
      description: "Always turn off illumination when leaving empty rooms or during daylight.",
      impact: { energy: 3 }
    },
    {
      id: "community_cleanup",
      name: "Community clean-up",
      category: "nature",
      icon: "\u{1F9F9}",
      points: 25,
      description: "Pick up discarded litter in your local street, neighborhood park, or beach.",
      impact: { plastic: 6, trees: 0.5 }
    }
  ];
  var BADGES = [
    {
      id: "first_step",
      name: "First Step",
      icon: "\u{1F331}",
      description: "Complete your first eco-activity.",
      condition: (state) => state.completedIds.length >= 1
    },
    {
      id: "water_saver",
      name: "Water Saver",
      icon: "\u{1F4A7}",
      description: "Complete at least 2 water-saving actions.",
      condition: (state) => {
        const waterCompleted = state.completedIds.filter((id) => {
          const act = ACTIVITIES.find((a) => a.id === id);
          return act && act.category === "water";
        });
        return waterCompleted.length >= 2;
      }
    },
    {
      id: "tree_champion",
      name: "Tree Champion",
      icon: "\u{1F333}",
      description: "Plant a tree or care for community green space.",
      condition: (state) => state.completedIds.includes("plant_tree")
    },
    {
      id: "green_commuter",
      name: "Green Commuter",
      icon: "\u{1F6B2}",
      description: "Complete 2+ cycling or public transit activities.",
      condition: (state) => {
        const transCompleted = state.completedIds.filter((id) => {
          const act = ACTIVITIES.find((a) => a.id === id);
          return act && act.category === "transport";
        });
        return transCompleted.length >= 2;
      }
    },
    {
      id: "waste_warrior",
      name: "Waste Warrior",
      icon: "\u267B\uFE0F",
      description: "Complete 2+ recycling or plastic reduction activities.",
      condition: (state) => {
        const wasteCompleted = state.completedIds.filter((id) => {
          const act = ACTIVITIES.find((a) => a.id === id);
          return act && act.category === "waste";
        });
        return wasteCompleted.length >= 2;
      }
    },
    {
      id: "energy_guardian",
      name: "Energy Guardian",
      icon: "\u26A1",
      description: "Complete 2+ energy conservation actions.",
      condition: (state) => {
        const energyCompleted = state.completedIds.filter((id) => {
          const act = ACTIVITIES.find((a) => a.id === id);
          return act && act.category === "energy";
        });
        return energyCompleted.length >= 2;
      }
    },
    {
      id: "eco_streaker",
      name: "Eco Streaker",
      icon: "\u{1F525}",
      description: "Maintain a 4+ day streak or daily habit.",
      condition: (state) => state.streak >= 4
    },
    {
      id: "climate_champion",
      name: "Climate Champion",
      icon: "\u{1F30D}",
      description: "Earn 100+ Eco Points this week.",
      condition: (state) => state.totalPoints >= 100
    }
  ];
  var BASE_LEADERBOARD = [
    { name: "Aisha K.", points: 180, avatar: "\u{1F469}\u{1F3FD}\u200D\u{1F33E}" },
    { name: "Rahul S.", points: 165, avatar: "\u{1F468}\u{1F3FB}\u200D\u{1F52C}" },
    { name: "Priya M.", points: 150, avatar: "\u{1F469}\u{1F3FB}\u200D\u{1F4BC}" },
    { name: "Marcus L.", points: 90, avatar: "\u{1F9D1}\u{1F3FC}\u200D\u{1F3EB}" },
    { name: "Elena V.", points: 75, avatar: "\u{1F469}\u{1F3FC}\u200D\u{1F3A8}" }
  ];
  var ECOBYTE_MESSAGES = {
    stage0: [
      "Hey! I\u2019m EcoByte \u{1F331} Let\u2019s start your climate journey!",
      "Ready to make your first eco move? Check an activity above!",
      "Every big journey begins with a tiny habit! \u{1F331}"
    ],
    stage1: [
      "Nice start! Your eco-energy is growing! \u26A1",
      "Look at my leaf! Your actions are powering me up!",
      "Great momentum! Let's conquer the next challenge!"
    ],
    stage2: [
      "Amazing! You\u2019re becoming an Eco Champion! \u{1F33F}",
      "Your eco-energy is getting stronger! You're past halfway!",
      "Only a few steps away from the Climate Champion badge!"
    ],
    stage3: [
      "WOW! You\u2019re powering a greener future! \u{1F30D}\u26A1",
      "You did it! You\u2019re officially a Climate Champion!",
      "Magnificent! Our local community is greener thanks to you!"
    ]
  };
  var ECO_FACTS = [
    "Did you know? Switching to a reusable water bottle keeps an average of 156 plastic bottles out of our oceans every year!",
    "Tree fact: A single mature tree absorbs up to 22 kg of carbon dioxide every single year while producing oxygen.",
    "Public transit reduces personal carbon emissions by up to 45% compared to solo driving!",
    "Taking a 5-minute shower instead of a 10-minute one saves up to 40 liters of clean water every time.",
    "Recycling one aluminum can saves enough electricity to power a TV or laptop for over three hours!"
  ];

  // js/storage.js
  var STORAGE_KEY = "ecorise_state_v1";
  var DEFAULT_STATE = {
    completedIds: [],
    streak: 4,
    streakDays: [true, true, true, true, false, false, false],
    // Mon - Sun
    theme: "light",
    soundEnabled: true,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_STATE };
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
        streakDays: Array.isArray(parsed.streakDays) ? parsed.streakDays : DEFAULT_STATE.streakDays
      };
    } catch (err) {
      console.warn("Error reading from localStorage:", err);
      return { ...DEFAULT_STATE };
    }
  }
  function saveState(state) {
    try {
      const toSave = {
        ...state,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (err) {
      console.warn("Error writing to localStorage:", err);
    }
  }
  function clearState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Error clearing localStorage:", err);
    }
    return { ...DEFAULT_STATE, streakDays: [false, false, false, false, false, false, false], streak: 0 };
  }

  // js/mascot.js
  var EcoByteController = class _EcoByteController {
    constructor(options = {}) {
      this.container = options.container || null;
      this.bubbleElement = options.bubbleElement || null;
      this.badgeElement = options.badgeElement || null;
      this.stage = 0;
      this.expression = "normal";
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
        case 0:
          return "Sprout Robot \u{1F331}";
        case 1:
          return "Energy Seedling \u26A1";
        case 2:
          return "Eco Champion \u{1F33F}";
        case 3:
          return "Climate Master \u{1F30D}\u26A1";
        default:
          return "Sprout Robot \u{1F331}";
      }
    }
    /**
     * Generates the custom vector SVG markup for EcoByte
     */
    getSVGMarkup(stage = this.stage, expression = this.expression) {
      const eyeHappy = expression === "happy" || stage >= 2;
      const eyeStar = stage >= 3;
      return `
      <svg class="ecobyte-svg ecobyte-stage-${stage} ${eyeStar ? "ecobyte-star-eyes" : eyeHappy ? "ecobyte-happy-eyes" : ""}"
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
        const wrapper = this.container.querySelector(".ecobyte-svg-wrapper");
        if (wrapper) {
          wrapper.addEventListener("click", () => this.poke());
        }
      }
      this.updateMessage();
    }
    /**
     * Update EcoByte based on current score
     */
    updateProgress(points) {
      this.currentPoints = points;
      const newStage = _EcoByteController.getStageFromPoints(points);
      const stageChanged = newStage !== this.stage;
      this.stage = newStage;
      if (this.container) {
        const svg = this.container.querySelector(".ecobyte-svg");
        if (svg) {
          svg.className.baseVal = `ecobyte-svg ecobyte-stage-${this.stage} ${this.stage >= 3 ? "ecobyte-star-eyes" : this.stage >= 2 ? "ecobyte-happy-eyes" : ""}`;
        } else {
          this.render();
        }
      }
      if (this.badgeElement) {
        this.badgeElement.textContent = _EcoByteController.getStageTitle(this.stage);
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
        message = list[0];
        if (this.currentPoints >= 100) {
          message = "WOW! You\u2019re powering a greener future! \u{1F30D}\u26A1 You're an Eco Champion!";
        } else if (this.currentPoints >= 50) {
          message = "Amazing! You\u2019re becoming an Eco Champion! \u{1F33F}";
        } else if (this.currentPoints >= 20) {
          message = "Nice start! Your eco-energy is growing! \u26A1";
        } else {
          message = "Hey! I\u2019m EcoByte \u{1F331} Let\u2019s start your climate journey!";
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
      this.container.classList.add("ecobyte-cheering");
      setTimeout(() => {
        this.container.classList.remove("ecobyte-cheering");
      }, 900);
    }
    /**
     * When user clicks on EcoByte, rotate through interesting eco facts & cheer!
     */
    poke() {
      this.cheer();
      const fact = ECO_FACTS[this.factIndex % ECO_FACTS.length];
      this.factIndex++;
      this.updateMessage(`\u{1F331} EcoByte Tip: ${fact}`);
    }
  };

  // js/sound.js
  var audioCtx = null;
  var soundEnabled = true;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {
      });
    }
    return audioCtx;
  }
  function setSoundEnabled(enabled) {
    soundEnabled = enabled;
  }
  function isSoundEnabled() {
    return soundEnabled;
  }
  function playCheckSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(1e-4, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(880, now + 0.08);
      gain2.gain.setValueAtTime(0.09, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(1e-4, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } catch (e) {
    }
  }
  function playUncheckSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.15);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(1e-4, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
    }
  }
  function playMilestoneSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.09;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.09, startTime);
        gain.gain.exponentialRampToValueAtTime(1e-4, startTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch (e) {
    }
  }
  function playChampionFanfare() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const chord1 = [523.25, 659.25, 783.99];
      const chord2 = [587.33, 739.99, 880];
      const chord3 = [659.25, 830.61, 987.77];
      const chord4 = [1046.5, 1318.51, 1567.98];
      const chords = [
        { notes: chord1, start: now, duration: 0.25 },
        { notes: chord2, start: now + 0.2, duration: 0.25 },
        { notes: chord3, start: now + 0.4, duration: 0.3 },
        { notes: chord4, start: now + 0.7, duration: 0.8 }
      ];
      chords.forEach(({ notes, start, duration }) => {
        notes.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.08, start);
          gain.gain.exponentialRampToValueAtTime(1e-4, start + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + duration);
        });
      });
    } catch (e) {
    }
  }

  // js/confetti.js
  var ECO_COLORS = ["#10b981", "#22c55e", "#34d399", "#06b6d4", "#f59e0b", "#84cc16", "#a7f3d0"];
  function initAmbientLeaves(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrame;
    let leaves = [];
    const maxLeaves = 18;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();
    class AmbientLeaf {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 6;
        this.speedY = Math.random() * 0.4 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02;
        this.color = ECO_COLORS[Math.floor(Math.random() * 3)];
        this.opacity = Math.random() * 0.35 + 0.15;
      }
      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.angle) * 0.5 + this.speedX;
        this.angle += this.angleSpeed;
        if (this.y > canvas.height + 20) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.7, 0, 0, this.size);
        ctx.quadraticCurveTo(-this.size * 0.7, 0, 0, -this.size);
        ctx.fill();
        ctx.restore();
      }
    }
    for (let i = 0; i < maxLeaves; i++) {
      leaves.push(new AmbientLeaf());
    }
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let leaf of leaves) {
        leaf.update();
        leaf.draw();
      }
      animationFrame = requestAnimationFrame(loop);
    }
    loop();
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }
  function triggerCelebration(options = {}) {
    const {
      duration = 2800,
      particleCount = 65,
      originX = 0.5,
      originY = 0.4
    } = options;
    let canvas = document.getElementById("celebration-confetti-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "celebration-confetti-canvas";
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "99999";
      document.body.appendChild(canvas);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const startX = canvas.width * originX;
    const startY = canvas.height * originY;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.PI * 2 * i / particleCount + (Math.random() - 0.5) * 0.8;
      const velocity = Math.random() * 9 + 4;
      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - Math.random() * 4,
        size: Math.random() * 10 + 6,
        color: ECO_COLORS[Math.floor(Math.random() * ECO_COLORS.length)],
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        gravity: 0.18,
        isLeaf: Math.random() > 0.4
      });
    }
    const startTime = performance.now();
    function animate(now) {
      const elapsed = now - startTime;
      if (elapsed > duration || particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.vRot;
        p.alpha = Math.max(0, 1 - elapsed / duration);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        if (p.isLeaf) {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(p.size * 0.7, 0, 0, p.size);
          ctx.quadraticCurveTo(-p.size * 0.7, 0, 0, -p.size);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
        }
        ctx.restore();
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  // js/charts.js
  function renderWeeklyChart(container, livePoints = 0) {
    if (!container) return;
    const data = [
      { label: "Week 1", points: 65, isLive: false },
      { label: "Week 2", points: 80, isLive: false },
      { label: "Week 3", points: 45, isLive: false },
      { label: "Week 4 (Live)", points: livePoints, isLive: true }
    ];
    const maxPoints = Math.max(120, ...data.map((d) => d.points));
    const chartHeight = 180;
    const chartWidth = 460;
    const barWidth = 48;
    const startX = 45;
    const gap = 100;
    const baselineY = 160;
    const gridLevels = [0, 50, 100];
    const gridLinesSVG = gridLevels.map((lvl) => {
      const y = baselineY - lvl / maxPoints * 125;
      return `
      <line x1="35" y1="${y}" x2="${chartWidth - 20}" y2="${y}" stroke="currentColor" stroke-dasharray="3,3" opacity="0.15" />
      <text x="28" y="${y + 4}" font-size="10" fill="currentColor" opacity="0.6" text-anchor="end">${lvl}</text>
    `;
    }).join("");
    const barsSVG = data.map((d, i) => {
      const x = startX + i * gap;
      const barHeight = Math.max(6, d.points / maxPoints * 125);
      const y = baselineY - barHeight;
      const fill = d.isLive ? "url(#liveBarGrad)" : "url(#historyBarGrad)";
      return `
      <g class="chart-bar-group" tabindex="0" role="graphics-symbol" aria-label="${d.label}: ${d.points} points">
        <!-- Bar Rect -->
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" fill="${fill}" />
        
        <!-- Score Label on Top -->
        <text x="${x + barWidth / 2}" y="${y - 8}" font-size="12" font-weight="800" fill="currentColor" text-anchor="middle" class="bar-value-text">
          ${d.points}
        </text>

        <!-- Week Label at Bottom -->
        <text x="${x + barWidth / 2}" y="${baselineY + 20}" font-size="11" font-weight="${d.isLive ? "800" : "600"}" fill="currentColor" opacity="${d.isLive ? "1" : "0.75"}" text-anchor="middle">
          ${d.label}
        </text>

        ${d.isLive ? `
          <!-- Live Indicator Badge -->
          <circle cx="${x + barWidth / 2}" cy="${y - 24}" r="3.5" fill="#10b981" />
        ` : ""}
      </g>
    `;
    }).join("");
    container.innerHTML = `
    <svg viewBox="0 0 ${chartWidth} 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" class="chart-svg">
      <defs>
        <linearGradient id="historyBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#34d399" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.4" />
        </linearGradient>
        <linearGradient id="liveBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#06b6d4" />
          <stop offset="100%" stop-color="#10b981" />
        </linearGradient>
      </defs>
      ${gridLinesSVG}
      ${barsSVG}
    </svg>
  `;
  }
  function renderCategoryBreakdown(container, activities, completedIds) {
    if (!container) return;
    const categories = [
      { key: "nature", label: "Nature & Trees", icon: "\u{1F331}", color: "#10b981" },
      { key: "water", label: "Water Saving", icon: "\u{1F4A7}", color: "#06b6d4" },
      { key: "transport", label: "Clean Transit", icon: "\u{1F6B2}", color: "#8b5cf6" },
      { key: "energy", label: "Energy Conservation", icon: "\u{1F4A1}", color: "#f59e0b" },
      { key: "waste", label: "Waste Reduction", icon: "\u267B\uFE0F", color: "#14b8a6" }
    ];
    const html = categories.map((cat) => {
      const totalInCat = activities.filter((a) => a.category === cat.key).length;
      const completedInCat = activities.filter((a) => a.category === cat.key && completedIds.includes(a.id)).length;
      const pct = totalInCat > 0 ? Math.round(completedInCat / totalInCat * 100) : 0;
      return `
      <div class="category-stat-row" style="margin-bottom: 0.85rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; margin-bottom: 0.3rem;">
          <span style="display: flex; align-items: center; gap: 0.4rem;">
            <span>${cat.icon}</span> ${cat.label}
          </span>
          <span style="color: var(--text-muted);">${completedInCat}/${totalInCat} done (${pct}%)</span>
        </div>
        <div style="width: 100%; height: 8px; background: var(--border-subtle); border-radius: 99px; overflow: hidden;">
          <div style="width: ${pct}%; height: 100%; background: ${cat.color}; border-radius: 99px; transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
        </div>
      </div>
    `;
    }).join("");
    container.innerHTML = html;
  }

  // js/app.js
  var EcoRiseApp = class {
    constructor() {
      this.state = loadState();
      this.activeCategory = "all";
      this.searchQuery = "";
      this.previousMilestones = /* @__PURE__ */ new Set();
      this.unlockedBadgeIds = /* @__PURE__ */ new Set();
      this.initDOM();
      this.heroMascot = new EcoByteController({
        container: this.elements.heroMascotContainer,
        bubbleElement: this.elements.heroSpeechBubble,
        badgeElement: this.elements.heroEvolutionBadge
      });
      this.motivationMascot = new EcoByteController({
        container: this.elements.motivationMascotContainer,
        bubbleElement: this.elements.motivationSpeechBubble,
        badgeElement: null
      });
    }
    initDOM() {
      this.elements = {
        // Header
        pointsPill: document.getElementById("nav-points-val"),
        streakPill: document.getElementById("nav-streak-val"),
        miniAvatar: document.getElementById("nav-mini-avatar"),
        themeToggleBtn: document.getElementById("theme-toggle-btn"),
        soundToggleBtn: document.getElementById("sound-toggle-btn"),
        mobileMenuBtn: document.getElementById("mobile-menu-btn"),
        mobileDrawer: document.getElementById("mobile-nav-drawer"),
        // Hero
        heroMascotContainer: document.getElementById("hero-mascot-container"),
        heroSpeechBubble: document.getElementById("hero-speech-bubble"),
        heroEvolutionBadge: document.getElementById("hero-evolution-badge"),
        leavesCanvas: document.getElementById("ambient-leaves-canvas"),
        // Weekly Progress Card
        pointsCurrentBig: document.getElementById("progress-points-current"),
        progressBarFill: document.getElementById("progress-bar-fill"),
        circleFill: document.getElementById("progress-circle-fill"),
        circlePercentage: document.getElementById("progress-circle-percentage"),
        statCompletedCount: document.getElementById("stat-completed-count"),
        statStreakDays: document.getElementById("stat-streak-days"),
        statWeeklyGoal: document.getElementById("stat-weekly-goal"),
        countdownText: document.getElementById("weekly-countdown-text"),
        // Motivation Panel
        motivationMascotContainer: document.getElementById("motivation-mascot-container"),
        motivationSpeechBubble: document.getElementById("motivation-speech-bubble"),
        btnPokeMascot: document.getElementById("btn-poke-mascot"),
        // Challenges Checklist
        categoryFilterContainer: document.getElementById("category-filter-container"),
        searchInput: document.getElementById("activity-search-input"),
        activitiesList: document.getElementById("activities-list-container"),
        // Streak & Community
        streakCountText: document.getElementById("streak-count-text"),
        weeklyCalendar: document.getElementById("weekly-streak-calendar"),
        communityCountText: document.getElementById("community-progress-text"),
        communityBarFill: document.getElementById("community-bar-fill"),
        communityPercentageText: document.getElementById("community-percentage-text"),
        // Badges
        badgesGrid: document.getElementById("badges-grid-container"),
        // Analytics & Leaderboard
        chartTrendContainer: document.getElementById("chart-trend-container"),
        chartCategoryContainer: document.getElementById("chart-category-container"),
        leaderboardList: document.getElementById("leaderboard-list-container"),
        // Impact Metrics
        impactTreesVal: document.getElementById("impact-trees-val"),
        impactWaterVal: document.getElementById("impact-water-val"),
        impactPlasticVal: document.getElementById("impact-plastic-val"),
        impactTransportVal: document.getElementById("impact-transport-val"),
        impactEnergyVal: document.getElementById("impact-energy-val"),
        // Modals
        championModal: document.getElementById("champion-modal"),
        championModalMascot: document.getElementById("champion-mascot-container"),
        howItWorksModal: document.getElementById("how-it-works-modal"),
        resetModal: document.getElementById("reset-modal"),
        demoBar: document.getElementById("demo-quick-bar"),
        toastContainer: document.getElementById("toast-container")
      };
    }
    start() {
      this.applyTheme(this.state.theme || "light");
      setSoundEnabled(this.state.soundEnabled ?? true);
      this.updateSoundToggleUI();
      if (this.elements.leavesCanvas) {
        initAmbientLeaves(this.elements.leavesCanvas);
      }
      this.heroMascot.render();
      this.motivationMascot.render();
      this.renderCategoryFilters();
      this.renderActivities();
      this.renderStreakCalendar();
      this.updateCountdownDays();
      this.sync(false);
      this.attachEventListeners();
    }
    /**
     * Important: Total Eco Points strictly computed dynamically from completed activities
     */
    calculateTotalPoints() {
      return this.state.completedIds.reduce((sum, id) => {
        const act = ACTIVITIES.find((a) => a.id === id);
        return sum + (act ? act.points : 0);
      }, 0);
    }
    /**
     * Synchronize all views based on the current state
     */
    sync(playSound = false) {
      const totalPoints = this.calculateTotalPoints();
      const completedCount = this.state.completedIds.length;
      const weeklyGoal = 100;
      const progressPct = Math.min(100, Math.round(totalPoints / weeklyGoal * 100));
      if (this.elements.pointsPill) {
        this.elements.pointsPill.textContent = `${totalPoints} pts`;
      }
      if (this.elements.streakPill) {
        this.elements.streakPill.textContent = `${this.state.streak}d`;
      }
      if (this.elements.miniAvatar) {
        const currentStage = EcoByteController.getStageFromPoints(totalPoints);
        this.elements.miniAvatar.innerHTML = this.heroMascot.getMiniAvatarMarkup(currentStage);
      }
      if (this.elements.pointsCurrentBig) {
        this.elements.pointsCurrentBig.textContent = totalPoints;
      }
      if (this.elements.progressBarFill) {
        this.elements.progressBarFill.style.width = `${progressPct}%`;
      }
      if (this.elements.circleFill) {
        const offset = 377 - 377 * (progressPct / 100);
        this.elements.circleFill.style.strokeDashoffset = offset;
      }
      if (this.elements.circlePercentage) {
        this.elements.circlePercentage.textContent = `${progressPct}%`;
      }
      if (this.elements.statCompletedCount) {
        this.elements.statCompletedCount.textContent = `${completedCount}/${ACTIVITIES.length}`;
      }
      if (this.elements.statStreakDays) {
        this.elements.statStreakDays.textContent = `${this.state.streak} days`;
      }
      if (this.elements.statWeeklyGoal) {
        this.elements.statWeeklyGoal.textContent = `${weeklyGoal} pts`;
      }
      this.heroMascot.updateProgress(totalPoints);
      this.motivationMascot.updateProgress(totalPoints);
      this.checkMilestones(totalPoints);
      this.updateBadges(totalPoints);
      this.updateImpactMetrics();
      if (this.elements.streakCountText) {
        this.elements.streakCountText.textContent = `${this.state.streak} Day Eco Streak`;
      }
      const communityBase = 328;
      const communityTotal = communityBase + completedCount;
      const communityGoal = 500;
      const communityPct = Math.min(100, communityTotal / communityGoal * 100).toFixed(1);
      if (this.elements.communityCountText) {
        this.elements.communityCountText.textContent = `${communityTotal} / ${communityGoal} actions`;
      }
      if (this.elements.communityBarFill) {
        this.elements.communityBarFill.style.width = `${communityPct}%`;
      }
      if (this.elements.communityPercentageText) {
        this.elements.communityPercentageText.textContent = `${communityPct}%`;
      }
      renderWeeklyChart(this.elements.chartTrendContainer, totalPoints);
      renderCategoryBreakdown(this.elements.chartCategoryContainer, ACTIVITIES, this.state.completedIds);
      this.renderLeaderboard(totalPoints);
      saveState(this.state);
    }
    /**
     * Days remaining until end of current week (Sunday)
     */
    updateCountdownDays() {
      const today = /* @__PURE__ */ new Date();
      const currentDay = today.getDay();
      const daysRemaining = currentDay === 0 ? 0 : 7 - currentDay;
      if (this.elements.countdownText) {
        this.elements.countdownText.textContent = `${daysRemaining} days remaining`;
      }
    }
    /**
     * Render category filter buttons
     */
    renderCategoryFilters() {
      const categories = [
        { key: "all", label: "All" },
        { key: "energy", label: "Energy" },
        { key: "water", label: "Water" },
        { key: "transport", label: "Transport" },
        { key: "waste", label: "Waste" },
        { key: "nature", label: "Nature" }
      ];
      this.elements.categoryFilterContainer.innerHTML = categories.map((cat) => {
        const count = cat.key === "all" ? ACTIVITIES.length : ACTIVITIES.filter((a) => a.category === cat.key).length;
        return `
        <button class="filter-pill ${this.activeCategory === cat.key ? "active" : ""}" data-category="${cat.key}">
          ${cat.label} <span class="filter-count">${count}</span>
        </button>
      `;
      }).join("");
      this.elements.categoryFilterContainer.querySelectorAll(".filter-pill").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const cat = e.currentTarget.dataset.category;
          this.activeCategory = cat;
          this.renderCategoryFilters();
          this.renderActivities();
        });
      });
    }
    /**
     * Render activity challenge cards with micro-interaction triggers
     */
    renderActivities() {
      const query = this.searchQuery.toLowerCase().trim();
      const filtered = ACTIVITIES.filter((act) => {
        const matchesCat = this.activeCategory === "all" || act.category === this.activeCategory;
        const matchesSearch = !query || act.name.toLowerCase().includes(query) || act.description.toLowerCase().includes(query) || act.category.toLowerCase().includes(query);
        return matchesCat && matchesSearch;
      });
      if (filtered.length === 0) {
        this.elements.activitiesList.innerHTML = `
        <div class="activities-empty-state">
          <div class="empty-mascot-slot" id="empty-mascot-slot"></div>
          <p class="empty-state-text">
            \u201CHmm\u2026 EcoByte couldn\u2019t find a challenge here. Try another category! \u{1F331}\u201D
          </p>
          <button class="btn btn-secondary" id="btn-reset-filters">Show All Challenges</button>
        </div>
      `;
        const emptySlot = document.getElementById("empty-mascot-slot");
        if (emptySlot) {
          emptySlot.innerHTML = this.heroMascot.getSVGMarkup(0, "normal");
        }
        const resetBtn = document.getElementById("btn-reset-filters");
        if (resetBtn) {
          resetBtn.addEventListener("click", () => {
            this.activeCategory = "all";
            this.searchQuery = "";
            if (this.elements.searchInput) this.elements.searchInput.value = "";
            this.renderCategoryFilters();
            this.renderActivities();
          });
        }
        return;
      }
      this.elements.activitiesList.innerHTML = filtered.map((act) => {
        const isCompleted = this.state.completedIds.includes(act.id);
        return `
        <div class="activity-card ${isCompleted ? "completed" : ""}" data-id="${act.id}" tabindex="0" role="checkbox" aria-checked="${isCompleted}">
          <div class="custom-checkbox-wrapper">
            <div class="custom-checkbox">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          <div class="activity-info">
            <div class="activity-top-row">
              <span class="activity-category-tag">${act.category}</span>
              <span class="activity-points-tag">+${act.points} Eco Points</span>
            </div>
            <h4 class="activity-title">${act.icon} ${act.name}</h4>
            <p class="activity-desc">${act.description}</p>
          </div>
        </div>
      `;
      }).join("");
      this.elements.activitiesList.querySelectorAll(".activity-card").forEach((card) => {
        const id = card.dataset.id;
        const toggleAction = (e) => {
          this.toggleActivity(id, card, e);
        };
        card.addEventListener("click", toggleAction);
        card.addEventListener("keydown", (e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggleAction(e);
          }
        });
      });
    }
    /**
     * Handle checking / unchecking an activity
     */
    toggleActivity(id, cardElement, event) {
      const act = ACTIVITIES.find((a) => a.id === id);
      if (!act) return;
      const isCurrentlyChecked = this.state.completedIds.includes(id);
      if (!isCurrentlyChecked) {
        this.state.completedIds.push(id);
        playCheckSound();
        this.showPointsPopup(cardElement, `+${act.points}`);
        this.heroMascot.cheer();
        this.motivationMascot.cheer();
        this.heroMascot.updateMessage(`Great choice! You just earned +${act.points} Eco Points for ${act.name}! \u{1F331}`);
        this.showToast(`+${act.points} Eco Points \u{1F331}`, `Awesome! Completed: "${act.name}"`);
      } else {
        this.state.completedIds = this.state.completedIds.filter((item) => item !== id);
        playUncheckSound();
        this.heroMascot.updateMessage(`Activity unchecked. Keep striving for green habits!`);
        this.showToast(`Points updated`, `Removed "${act.name}"`);
      }
      this.renderActivities();
      this.sync(true);
    }
    /**
     * Show floating +X points micro-animation on top of card
     */
    showPointsPopup(cardElement, text) {
      const popup = document.createElement("div");
      popup.className = "points-floating-popup";
      popup.textContent = text;
      cardElement.appendChild(popup);
      setTimeout(() => popup.remove(), 1200);
    }
    /**
     * Check milestone points: 25, 50, 75, 100
     */
    checkMilestones(points) {
      const milestones = [25, 50, 75, 100];
      for (let m of milestones) {
        if (points >= m && !this.previousMilestones.has(m)) {
          this.previousMilestones.add(m);
          if (m === 100) {
            playChampionFanfare();
            triggerCelebration({ duration: 4e3, particleCount: 120 });
            this.openChampionModal();
          } else {
            playMilestoneSound();
            triggerCelebration({ duration: 2500, particleCount: 50 });
            this.showToast(`Milestone Reached! \u{1F389}`, `You reached ${m} Eco Points!`);
          }
        } else if (points < m && this.previousMilestones.has(m)) {
          this.previousMilestones.delete(m);
        }
      }
    }
    /**
     * Update achievements / badges
     */
    updateBadges(points) {
      const currentState = {
        completedIds: this.state.completedIds,
        totalPoints: points,
        streak: this.state.streak
      };
      let newlyUnlocked = [];
      this.elements.badgesGrid.innerHTML = BADGES.map((badge) => {
        const isUnlocked = badge.condition(currentState);
        if (isUnlocked && !this.unlockedBadgeIds.has(badge.id)) {
          newlyUnlocked.push(badge);
          this.unlockedBadgeIds.add(badge.id);
        } else if (!isUnlocked && this.unlockedBadgeIds.has(badge.id)) {
          this.unlockedBadgeIds.delete(badge.id);
        }
        return `
        <div class="badge-card ${isUnlocked ? "unlocked" : "locked"}" tabindex="0" role="article" aria-label="${badge.name}: ${badge.description}">
          <div class="badge-status-tag">${isUnlocked ? "Unlocked \u2728" : "Locked \u{1F512}"}</div>
          <div class="badge-icon-box">${badge.icon}</div>
          <div class="badge-info">
            <h4 class="badge-name">${badge.name}</h4>
            <p class="badge-desc">${badge.description}</p>
          </div>
        </div>
      `;
      }).join("");
      if (newlyUnlocked.length > 0) {
        newlyUnlocked.forEach((b) => {
          this.showToast(`Badge Unlocked! \u{1F3C6}`, `You earned "${b.name}"`);
        });
      }
    }
    /**
     * Update tangible impact metrics
     */
    updateImpactMetrics() {
      let trees = 0;
      let waterLiters = 0;
      let plasticItems = 0;
      let transportKm = 0;
      let energyKwh = 0;
      for (let id of this.state.completedIds) {
        const act = ACTIVITIES.find((a) => a.id === id);
        if (!act || !act.impact) continue;
        if (act.impact.trees) trees += act.impact.trees;
        if (act.impact.water) waterLiters += act.impact.water;
        if (act.impact.plastic) plasticItems += act.impact.plastic;
        if (act.impact.transport) transportKm += act.impact.transport;
        if (act.impact.energy) energyKwh += act.impact.energy;
      }
      if (this.elements.impactTreesVal) this.elements.impactTreesVal.textContent = trees;
      if (this.elements.impactWaterVal) this.elements.impactWaterVal.textContent = `${waterLiters}L`;
      if (this.elements.impactPlasticVal) this.elements.impactPlasticVal.textContent = plasticItems;
      if (this.elements.impactTransportVal) this.elements.impactTransportVal.textContent = `${transportKm}km`;
      if (this.elements.impactEnergyVal) this.elements.impactEnergyVal.textContent = `${energyKwh} actions`;
    }
    /**
     * Render weekly streak mini calendar
     */
    renderStreakCalendar() {
      const daysLabels = ["M", "T", "W", "T", "F", "S", "S"];
      const currentDayIndex = ((/* @__PURE__ */ new Date()).getDay() + 6) % 7;
      this.elements.weeklyCalendar.innerHTML = daysLabels.map((lbl, idx) => {
        const isCompleted = this.state.streakDays[idx];
        const isToday = idx === currentDayIndex;
        return `
        <div class="streak-day-item ${isCompleted ? "completed" : ""} ${isToday ? "today" : ""}">
          <span class="streak-day-label">${lbl}</span>
          <div class="streak-day-dot" title="${isCompleted ? "Day completed" : "Pending"}" tabindex="0">
            ${isCompleted ? "\u{1F525}" : "\u25CB"}
          </div>
        </div>
      `;
      }).join("");
    }
    /**
     * Render community demo leaderboard dynamically with live user positioning
     */
    renderLeaderboard(userPoints) {
      const list = [...BASE_LEADERBOARD, { name: "You (Live)", points: userPoints, isUser: true, avatar: "\u{1F331}" }];
      list.sort((a, b) => b.points - a.points);
      this.elements.leaderboardList.innerHTML = list.map((item, idx) => {
        const isUser = item.isUser;
        return `
        <div class="leaderboard-item ${isUser ? "current-user" : ""}">
          <div class="leaderboard-user-info">
            <span class="leaderboard-rank">${idx + 1}</span>
            <span style="font-size: 1.3rem;">${item.avatar}</span>
            <span class="leaderboard-name">
              ${item.name} ${isUser ? '<span class="user-badge-tag">You</span>' : ""}
            </span>
          </div>
          <span class="leaderboard-points">${item.points} pts</span>
        </div>
      `;
      }).join("");
    }
    /**
     * Open Climate Champion full-modal celebration
     */
    openChampionModal() {
      if (!this.elements.championModal) return;
      if (this.elements.championModalMascot) {
        this.elements.championModalMascot.innerHTML = this.heroMascot.getSVGMarkup(3, "happy");
      }
      this.elements.championModal.classList.add("open");
    }
    closeChampionModal() {
      if (this.elements.championModal) {
        this.elements.championModal.classList.remove("open");
      }
    }
    /**
     * Toast notification system
     */
    showToast(title, message) {
      if (!this.elements.toastContainer) return;
      const toast = document.createElement("div");
      toast.className = "toast-item";
      toast.innerHTML = `
      <div class="toast-icon">\u{1F331}</div>
      <div class="toast-text-group">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;
      this.elements.toastContainer.appendChild(toast);
      setTimeout(() => {
        toast.classList.add("removing");
        setTimeout(() => toast.remove(), 320);
      }, 3600);
    }
    /**
     * Theme toggle Light / Dark
     */
    applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      this.state.theme = theme;
      if (this.elements.themeToggleBtn) {
        this.elements.themeToggleBtn.innerHTML = theme === "dark" ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>` : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        this.elements.themeToggleBtn.title = `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`;
      }
    }
    toggleTheme() {
      const next = this.state.theme === "dark" ? "light" : "dark";
      this.applyTheme(next);
      saveState(this.state);
    }
    toggleSound() {
      const current = isSoundEnabled();
      setSoundEnabled(!current);
      this.state.soundEnabled = !current;
      this.updateSoundToggleUI();
      saveState(this.state);
      if (!current) playCheckSound();
    }
    updateSoundToggleUI() {
      if (!this.elements.soundToggleBtn) return;
      const enabled = isSoundEnabled();
      this.elements.soundToggleBtn.innerHTML = enabled ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>` : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      this.elements.soundToggleBtn.title = enabled ? "Sound On (Click to Mute)" : "Sound Muted (Click to Enable)";
    }
    /**
     * Reset all weekly progress
     */
    resetProgress() {
      this.state = clearState();
      this.previousMilestones.clear();
      this.unlockedBadgeIds.clear();
      this.renderActivities();
      this.renderStreakCalendar();
      this.sync(false);
      this.showToast("Progress Reset", "All weekly activities have been reset.");
    }
    /**
     * Demo Mode Presets for rapid testing & live evaluation
     */
    applyDemoPreset(presetName) {
      if (presetName === "clean") {
        this.state.completedIds = [];
        this.previousMilestones.clear();
      } else if (presetName === "beginner") {
        this.state.completedIds = ["refillable_bottle", "public_transport"];
      } else if (presetName === "champion") {
        this.state.completedIds = ["refillable_bottle", "plant_tree", "cycle_trip", "save_electricity", "save_water"];
      } else if (presetName === "master") {
        this.state.completedIds = [
          "refillable_bottle",
          "plant_tree",
          "cycle_trip",
          "recycle_waste",
          "public_transport",
          "save_water",
          "avoid_plastic"
        ];
      }
      this.renderActivities();
      this.sync(true);
    }
    attachEventListeners() {
      if (this.elements.themeToggleBtn) {
        this.elements.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
      }
      if (this.elements.soundToggleBtn) {
        this.elements.soundToggleBtn.addEventListener("click", () => this.toggleSound());
      }
      if (this.elements.mobileMenuBtn && this.elements.mobileDrawer) {
        this.elements.mobileMenuBtn.addEventListener("click", () => {
          this.elements.mobileDrawer.classList.toggle("open");
        });
        this.elements.mobileDrawer.querySelectorAll("a").forEach((a) => {
          a.addEventListener("click", () => {
            this.elements.mobileDrawer.classList.remove("open");
          });
        });
      }
      if (this.elements.searchInput) {
        this.elements.searchInput.addEventListener("input", (e) => {
          this.searchQuery = e.target.value;
          this.renderActivities();
        });
      }
      if (this.elements.btnPokeMascot) {
        this.elements.btnPokeMascot.addEventListener("click", () => {
          this.motivationMascot.poke();
        });
      }
      document.querySelectorAll("[data-demo-preset]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const preset = e.currentTarget.dataset.demoPreset;
          this.applyDemoPreset(preset);
        });
      });
      const btnHowItWorks = document.getElementById("btn-how-it-works");
      if (btnHowItWorks && this.elements.howItWorksModal) {
        btnHowItWorks.addEventListener("click", () => {
          this.elements.howItWorksModal.classList.add("open");
        });
      }
      const btnOpenSettings = document.getElementById("btn-open-settings");
      if (btnOpenSettings && this.elements.resetModal) {
        btnOpenSettings.addEventListener("click", () => {
          this.elements.resetModal.classList.add("open");
        });
      }
      document.querySelectorAll(".modal-close-btn, [data-modal-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const modal = e.currentTarget.closest(".modal-overlay");
          if (modal) modal.classList.remove("open");
        });
      });
      const btnConfirmReset = document.getElementById("btn-confirm-reset");
      if (btnConfirmReset && this.elements.resetModal) {
        btnConfirmReset.addEventListener("click", () => {
          this.resetProgress();
          this.elements.resetModal.classList.remove("open");
        });
      }
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    window.ecoRise = new EcoRiseApp();
    window.ecoRise.start();
  });
})();
