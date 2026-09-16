import mongoose from 'mongoose';
import { createCollection } from './dbAdapter.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'organizer', 'admin'], default: 'student' },
  city: { type: String, default: 'Greenwood District' },
  school: { type: String, default: '' },
  ecoPoints: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  shields: { type: Number, default: 1 },
  lastActiveDate: { type: String, default: null },
  onboardingCompleted: { type: Boolean, default: false },
  currentCycleId: { type: String, default: null }
}, { timestamps: true });

let MongooseUser = null;
try {
  MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);
} catch (e) {
  // Mongoose fallback
}

export const User = createCollection('users', MongooseUser);
