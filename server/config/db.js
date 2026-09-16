import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const STORE_PATH = path.resolve(DATA_DIR, 'db.json');

let isMongooseConnected = false;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache synced with disk
let memoryStore = {
  users: [],
  co2Profiles: [],
  co2Snapshots: [],
  challengeCycles: [],
  activities: [],
  completedActivities: [],
  greenCommutes: [],
  surveys: [],
  surveyResponses: [],
  badges: [],
  userBadges: [],
  recognitions: []
};

// Load store from disk if exists
if (fs.existsSync(STORE_PATH)) {
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    memoryStore = { ...memoryStore, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('[DB] Could not parse existing db.json, using fresh store.', err.message);
  }
}

export function saveStore() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to persist db.json:', err.message);
  }
}

export function getStore() {
  return memoryStore;
}

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecorise';
  
  try {
    console.log('[DB] Attempting MongoDB connection...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    isMongooseConnected = true;
    console.log(`[DB] Successfully connected to MongoDB at ${mongoUri}`);
  } catch (err) {
    isMongooseConnected = false;
    console.log(`[DB] MongoDB not detected (${err.message}).`);
    console.log('[DB] Running in embedded persistent JSON store mode (Zero-setup evaluation ready).');
  }

  // Pre-seed activities and badges if empty
  seedDefaultData();
}

export function isUsingMongoose() {
  return isMongooseConnected && mongoose.connection.readyState === 1;
}

function seedDefaultData() {
  if (!memoryStore.activities || memoryStore.activities.length === 0) {
    memoryStore.activities = [
      {
        id: 'act-1',
        title: 'Walk or Cycle for Short Trips (< 3 km)',
        description: 'Choose active mobility instead of fuel-powered vehicles for errands or commuting.',
        category: 'transport',
        co2SavedKg: 0.85,
        points: 25,
        difficulty: 'Easy',
        icon: '🚲'
      },
      {
        id: 'act-2',
        title: 'Take Public Transit (Bus or Metro)',
        description: 'Utilize communal rapid transit for your daily university or school commute.',
        category: 'transport',
        co2SavedKg: 1.20,
        points: 30,
        difficulty: 'Medium',
        icon: '🚌'
      },
      {
        id: 'act-3',
        title: 'Organize or Join a Carpool',
        description: 'Share your vehicle ride with 2 or more peers heading to the same destination.',
        category: 'transport',
        co2SavedKg: 0.95,
        points: 20,
        difficulty: 'Medium',
        icon: '🚗'
      },
      {
        id: 'act-4',
        title: 'Zero Single-Use Plastic Day',
        description: 'Carry a reusable water bottle, cloth bag, and metal/bamboo straw all day.',
        category: 'waste',
        co2SavedKg: 0.40,
        points: 20,
        difficulty: 'Easy',
        icon: '🍶'
      },
      {
        id: 'act-5',
        title: 'Cold Water Laundry Wash',
        description: 'Run washing machines on 20-30°C cold cycles to eliminate water heating energy.',
        category: 'energy',
        co2SavedKg: 0.60,
        points: 15,
        difficulty: 'Easy',
        icon: '👕'
      },
      {
        id: 'act-6',
        title: 'Campus / Local Park Eco Cleanup',
        description: 'Collect and segregate recyclables in a community green space.',
        category: 'civic',
        co2SavedKg: 1.50,
        points: 50,
        difficulty: 'Hard',
        icon: '🧹'
      },
      {
        id: 'act-7',
        title: 'Plant a Native Tree or Herb Sapling',
        description: 'Plant and water a native perennial tree sapling or balcony herb pot.',
        category: 'civic',
        co2SavedKg: 2.10,
        points: 60,
        difficulty: 'Hard',
        icon: '🌱'
      },
      {
        id: 'act-8',
        title: 'Vampire Power Shutdown',
        description: 'Unplug idle electronics, laptop chargers, and set power strips to switch-off before sleep.',
        category: 'energy',
        co2SavedKg: 0.50,
        points: 15,
        difficulty: 'Easy',
        icon: '🔌'
      }
    ];
  }

  if (!memoryStore.badges || memoryStore.badges.length === 0) {
    memoryStore.badges = [
      {
        id: 'badge-starter',
        name: 'Green Starter',
        description: 'Completed your first verified climate action on EcoRise.',
        icon: '🌱',
        category: 'milestone',
        requirementType: 'activity_count',
        requirementValue: 1
      },
      {
        id: 'badge-transit',
        name: 'Metro Nomad',
        description: 'Logged 3 sustainable green transit commutes.',
        icon: '🚇',
        category: 'transport',
        requirementType: 'commute_count',
        requirementValue: 3
      },
      {
        id: 'badge-streak-3',
        name: 'Streak Pioneer',
        description: 'Maintained an unbroken 3-day climate action streak.',
        icon: '🔥',
        category: 'streak',
        requirementType: 'streak',
        requirementValue: 3
      },
      {
        id: 'badge-streak-7',
        name: 'Eco Sentinel',
        description: 'Maintained an unbroken 7-day streak and earned an Eco Shield.',
        icon: '🛡️',
        category: 'streak',
        requirementType: 'streak',
        requirementValue: 7
      },
      {
        id: 'badge-cycle-1',
        name: 'Mission Accomplished',
        description: 'Successfully completed all 3 days of a 3-Day Climate Challenge.',
        icon: '🎯',
        category: 'challenge',
        requirementType: 'cycles_completed',
        requirementValue: 1
      },
      {
        id: 'badge-co2-cutter',
        name: 'Decarbonizer',
        description: 'Reduced estimated weekly transport emissions by 15% or more.',
        icon: '📉',
        category: 'co2',
        requirementType: 'co2_reduction_pct',
        requirementValue: 15
      },
      {
        id: 'badge-champion',
        name: 'SDG 13 Civic Champion',
        description: 'Accumulated over 250 Eco Points in verified civic climate action.',
        icon: '🏆',
        category: 'milestone',
        requirementType: 'points',
        requirementValue: 250
      }
    ];
  }

  saveStore();
}
