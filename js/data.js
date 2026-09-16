/**
 * EcoRise - Local Eco-Challenge
 * Static Data Structures & Definitions
 */

export const ACTIVITIES = [
  {
    id: "plant_tree",
    name: "Plant a tree",
    category: "nature",
    icon: "🌱",
    points: 25,
    description: "Plant or help care for a tree, sapling, or community green space this week.",
    impact: { trees: 1, co2: 22 }
  },
  {
    id: "refillable_bottle",
    name: "Use a refillable bottle",
    category: "water",
    icon: "💧",
    points: 10,
    description: "Replace disposable plastic drink bottles with a reusable container.",
    impact: { plastic: 2, water: 3 }
  },
  {
    id: "cycle_trip",
    name: "Cycle instead of driving",
    category: "transport",
    icon: "🚲",
    points: 20,
    description: "Choose cycling or walking for a short commute or errand instead of a motor vehicle.",
    impact: { transport: 6, energy: 3 }
  },
  {
    id: "save_electricity",
    name: "Save electricity",
    category: "energy",
    icon: "💡",
    points: 10,
    description: "Unplug standby electronics and switch off appliances when not actively used.",
    impact: { energy: 4 }
  },
  {
    id: "recycle_waste",
    name: "Recycle waste",
    category: "waste",
    icon: "♻️",
    points: 15,
    description: "Carefully sort and separate recyclable paper, metals, and clean plastics.",
    impact: { plastic: 4 }
  },
  {
    id: "public_transport",
    name: "Use public transport",
    category: "transport",
    icon: "🚌",
    points: 15,
    description: "Take the bus, metro, tram, or share a ride for your daily transit.",
    impact: { transport: 5 }
  },
  {
    id: "avoid_plastic",
    name: "Avoid single-use plastic",
    category: "waste",
    icon: "🛍️",
    points: 10,
    description: "Carry a reusable canvas tote bag and refuse plastic cutlery or wraps.",
    impact: { plastic: 3 }
  },
  {
    id: "save_water",
    name: "Save water",
    category: "water",
    icon: "🚿",
    points: 10,
    description: "Take a shorter shower under 5 minutes and turn off tap while brushing.",
    impact: { water: 25 }
  },
  {
    id: "switch_lights",
    name: "Switch off unused lights",
    category: "energy",
    icon: "🔦",
    points: 10,
    description: "Always turn off illumination when leaving empty rooms or during daylight.",
    impact: { energy: 3 }
  },
  {
    id: "community_cleanup",
    name: "Community clean-up",
    category: "nature",
    icon: "🧹",
    points: 25,
    description: "Pick up discarded litter in your local street, neighborhood park, or beach.",
    impact: { plastic: 6, trees: 0.5 }
  }
];

export const BADGES = [
  {
    id: "first_step",
    name: "First Step",
    icon: "🌱",
    description: "Complete your first eco-activity.",
    condition: (state) => state.completedIds.length >= 1
  },
  {
    id: "water_saver",
    name: "Water Saver",
    icon: "💧",
    description: "Complete at least 2 water-saving actions.",
    condition: (state) => {
      const waterCompleted = state.completedIds.filter(id => {
        const act = ACTIVITIES.find(a => a.id === id);
        return act && act.category === "water";
      });
      return waterCompleted.length >= 2;
    }
  },
  {
    id: "tree_champion",
    name: "Tree Champion",
    icon: "🌳",
    description: "Plant a tree or care for community green space.",
    condition: (state) => state.completedIds.includes("plant_tree")
  },
  {
    id: "green_commuter",
    name: "Green Commuter",
    icon: "🚲",
    description: "Complete 2+ cycling or public transit activities.",
    condition: (state) => {
      const transCompleted = state.completedIds.filter(id => {
        const act = ACTIVITIES.find(a => a.id === id);
        return act && act.category === "transport";
      });
      return transCompleted.length >= 2;
    }
  },
  {
    id: "waste_warrior",
    name: "Waste Warrior",
    icon: "♻️",
    description: "Complete 2+ recycling or plastic reduction activities.",
    condition: (state) => {
      const wasteCompleted = state.completedIds.filter(id => {
        const act = ACTIVITIES.find(a => a.id === id);
        return act && act.category === "waste";
      });
      return wasteCompleted.length >= 2;
    }
  },
  {
    id: "energy_guardian",
    name: "Energy Guardian",
    icon: "⚡",
    description: "Complete 2+ energy conservation actions.",
    condition: (state) => {
      const energyCompleted = state.completedIds.filter(id => {
        const act = ACTIVITIES.find(a => a.id === id);
        return act && act.category === "energy";
      });
      return energyCompleted.length >= 2;
    }
  },
  {
    id: "eco_streaker",
    name: "Eco Streaker",
    icon: "🔥",
    description: "Maintain a 4+ day streak or daily habit.",
    condition: (state) => state.streak >= 4
  },
  {
    id: "climate_champion",
    name: "Climate Champion",
    icon: "🌍",
    description: "Earn 100+ Eco Points this week.",
    condition: (state) => state.totalPoints >= 100
  }
];

export const BASE_LEADERBOARD = [
  { name: "Aisha K.", points: 180, avatar: "👩🏽‍🌾" },
  { name: "Rahul S.", points: 165, avatar: "👨🏻‍🔬" },
  { name: "Priya M.", points: 150, avatar: "👩🏻‍💼" },
  { name: "Marcus L.", points: 90, avatar: "🧑🏼‍🏫" },
  { name: "Elena V.", points: 75, avatar: "👩🏼‍🎨" }
];

export const HISTORICAL_WEEKS = [
  { week: "Week 1", points: 65 },
  { week: "Week 2", points: 80 },
  { week: "Week 3", points: 45 },
  { week: "Week 4 (Live)", points: 0 } // dynamic
];

export const ECOBYTE_MESSAGES = {
  stage0: [
    "Hey! I’m EcoByte 🌱 Let’s start your climate journey!",
    "Ready to make your first eco move? Check an activity above!",
    "Every big journey begins with a tiny habit! 🌱"
  ],
  stage1: [
    "Nice start! Your eco-energy is growing! ⚡",
    "Look at my leaf! Your actions are powering me up!",
    "Great momentum! Let's conquer the next challenge!"
  ],
  stage2: [
    "Amazing! You’re becoming an Eco Champion! 🌿",
    "Your eco-energy is getting stronger! You're past halfway!",
    "Only a few steps away from the Climate Champion badge!"
  ],
  stage3: [
    "WOW! You’re powering a greener future! 🌍⚡",
    "You did it! You’re officially a Climate Champion!",
    "Magnificent! Our local community is greener thanks to you!"
  ]
};

export const ECO_FACTS = [
  "Did you know? Switching to a reusable water bottle keeps an average of 156 plastic bottles out of our oceans every year!",
  "Tree fact: A single mature tree absorbs up to 22 kg of carbon dioxide every single year while producing oxygen.",
  "Public transit reduces personal carbon emissions by up to 45% compared to solo driving!",
  "Taking a 5-minute shower instead of a 10-minute one saves up to 40 liters of clean water every time.",
  "Recycling one aluminum can saves enough electricity to power a TV or laptop for over three hours!"
];
