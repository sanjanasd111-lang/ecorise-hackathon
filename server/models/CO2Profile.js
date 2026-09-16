import mongoose from 'mongoose';
import { createCollection } from './dbAdapter.js';

const co2ProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  transportMode: { type: String, required: true }, // walk, bicycle, bus, metro, carpool, bike, car, taxi
  vehicleType: { type: String, default: 'Not sure' }, // petrol, diesel, hybrid, electric
  distancePerTrip: { type: Number, default: 5 },
  distanceType: { type: String, default: 'one-way' }, // one-way, round-trip
  tripsPerWeek: { type: Number, default: 5 },
  hasPublicTransitAccess: { type: Boolean, default: true },
  weeklyDistanceKm: { type: Number, default: 50 },
  emissionFactor: { type: Number, default: 0.150 },
  
  // Baseline (initial recorded onboarding estimate)
  baselineWeeklyCO2e: { type: Number, default: 0 },
  baselineMonthlyCO2e: { type: Number, default: 0 },
  baselineYearlyCO2e: { type: Number, default: 0 },

  // Current (updated as green commute or habit shifts occur)
  currentWeeklyCO2e: { type: Number, default: 0 },
  currentMonthlyCO2e: { type: Number, default: 0 },
  currentYearlyCO2e: { type: Number, default: 0 },

  lastCalculatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

let MongooseProfile = null;
try {
  MongooseProfile = mongoose.models.CO2Profile || mongoose.model('CO2Profile', co2ProfileSchema);
} catch (e) {}

export const CO2Profile = createCollection('co2Profiles', MongooseProfile);
