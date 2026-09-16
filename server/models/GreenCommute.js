import mongoose from 'mongoose';
import { createCollection } from './dbAdapter.js';

const greenCommuteSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  mode: { type: String, required: true }, // walk, bicycle, bus, metro, carpool
  distanceKm: { type: Number, required: true },
  baselineMode: { type: String, default: 'car' },
  co2SavedKg: { type: Number, required: true },
  pointsEarned: { type: Number, default: 20 },
  date: { type: String, required: true }, // YYYY-MM-DD
  notes: { type: String, default: '' }
}, { timestamps: true });

let MongooseCommute = null;
try {
  MongooseCommute = mongoose.models.GreenCommute || mongoose.model('GreenCommute', greenCommuteSchema);
} catch (e) {}

export const GreenCommute = createCollection('greenCommutes', MongooseCommute);
