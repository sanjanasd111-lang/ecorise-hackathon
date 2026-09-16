import mongoose from 'mongoose';
import { createCollection } from './dbAdapter.js';

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['transport', 'energy', 'waste', 'civic'], required: true },
  co2SavedKg: { type: Number, required: true },
  points: { type: Number, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  icon: { type: String, default: '🌱' }
}, { timestamps: true });

let MongooseActivity = null;
try {
  MongooseActivity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
} catch (e) {}

export const Activity = createCollection('activities', MongooseActivity);

const completedActivitySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  activityId: { type: String, required: true },
  activityTitle: { type: String, default: '' },
  category: { type: String, default: 'civic' },
  pointsEarned: { type: Number, required: true },
  co2SavedKg: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now },
  note: { type: String, default: '' }
}, { timestamps: true });

let MongooseCompletedActivity = null;
try {
  MongooseCompletedActivity = mongoose.models.CompletedActivity || mongoose.model('CompletedActivity', completedActivitySchema);
} catch (e) {}

export const CompletedActivity = createCollection('completedActivities', MongooseCompletedActivity);
