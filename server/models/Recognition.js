import mongoose from 'mongoose';
import { createCollection } from './dbAdapter.js';

const recognitionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  userName: { type: String, required: true },
  title: { type: String, required: true },
  tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Civic Champion'], default: 'Bronze' },
  certificateNumber: { type: String, required: true, unique: true },
  pointsAtIssue: { type: Number, default: 0 },
  co2SavedKg: { type: Number, default: 0 },
  issuedAt: { type: Date, default: Date.now },
  verifiedBy: { type: String, default: 'EcoRise Civic Council & SDG 13 Action Hub' }
}, { timestamps: true });

let MongooseRecognition = null;
try {
  MongooseRecognition = mongoose.models.Recognition || mongoose.model('Recognition', recognitionSchema);
} catch (e) {}

export const Recognition = createCollection('recognitions', MongooseRecognition);
