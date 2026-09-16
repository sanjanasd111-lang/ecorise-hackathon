import mongoose from 'mongoose';
import { createCollection } from './dbAdapter.js';

const challengeCycleSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  cycleNumber: { type: Number, default: 1 },
  startDate: { type: String, required: true }, // ISO string
  endDate: { type: String, required: true },   // ISO string strictly 3 days later
  status: { type: String, enum: ['active', 'completed', 'expired'], default: 'active' },
  days: [
    {
      day: { type: Number, required: true }, // 1, 2, 3
      title: { type: String, required: true },
      description: { type: String, required: true },
      category: { type: String, default: 'transport' },
      co2SavingEstimate: { type: Number, default: 0.8 },
      points: { type: Number, default: 25 },
      completed: { type: Boolean, default: false },
      completedAt: { type: String, default: null },
      verificationNote: { type: String, default: '' }
    }
  ],
  allCompleted: { type: Boolean, default: false },
  bonusPointsAwarded: { type: Boolean, default: false }
}, { timestamps: true });

let MongooseCycle = null;
try {
  MongooseCycle = mongoose.models.ChallengeCycle || mongoose.model('ChallengeCycle', challengeCycleSchema);
} catch (e) {}

export const ChallengeCycle = createCollection('challengeCycles', MongooseCycle);
