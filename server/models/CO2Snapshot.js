import mongoose from 'mongoose';
import { createCollection } from './dbAdapter.js';

const co2SnapshotSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  weekNumber: { type: Number, required: true },
  weekLabel: { type: String, required: true }, // e.g. "Week 1", "Week 2"
  estimatedWeeklyCO2e: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now }
}, { timestamps: true });

let MongooseSnapshot = null;
try {
  MongooseSnapshot = mongoose.models.CO2Snapshot || mongoose.model('CO2Snapshot', co2SnapshotSchema);
} catch (e) {}

export const CO2Snapshot = createCollection('co2Snapshots', MongooseSnapshot);
