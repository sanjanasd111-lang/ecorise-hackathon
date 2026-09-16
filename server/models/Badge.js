import mongoose from 'mongoose';
import { createCollection } from './dbAdapter.js';

const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, default: 'milestone' },
  requirementType: { type: String, required: true },
  requirementValue: { type: Number, required: true }
}, { timestamps: true });

let MongooseBadge = null;
try {
  MongooseBadge = mongoose.models.Badge || mongoose.model('Badge', badgeSchema);
} catch (e) {}

export const Badge = createCollection('badges', MongooseBadge);

const userBadgeSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  badgeId: { type: String, required: true },
  badgeName: { type: String, required: true },
  badgeIcon: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now }
}, { timestamps: true });

let MongooseUserBadge = null;
try {
  MongooseUserBadge = mongoose.models.UserBadge || mongoose.model('UserBadge', userBadgeSchema);
} catch (e) {}

export const UserBadge = createCollection('userBadges', MongooseUserBadge);
