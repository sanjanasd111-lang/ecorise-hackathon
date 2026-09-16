import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { GreenCommute } from '../models/GreenCommute.js';
import { CO2Profile } from '../models/CO2Profile.js';
import { CO2Snapshot } from '../models/CO2Snapshot.js';
import { UserBadge } from '../models/Badge.js';
import { getEmissionFactor } from '../config/emissionFactors.js';

const router = express.Router();

// GET /api/green-commute/history
router.get('/history', authenticate, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    const commutes = await GreenCommute.find({ userId });
    return res.json({ commutes });
  } catch (err) {
    console.error('[Commute History Error]:', err);
    return res.status(500).json({ message: 'Error fetching commute history', error: err.message });
  }
});

// POST /api/green-commute/log
router.post('/log', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const userId = String(user._id || user.id);
    const { mode = 'bicycle', distanceKm = 5, notes = '' } = req.body;

    const profile = await CO2Profile.findOne({ userId });
    const baselineMode = profile ? profile.transportMode : 'car';
    const baselineVType = profile ? profile.vehicleType : 'petrol';

    // Calculate CO2 difference between baseline mode and chosen green mode
    const baseFactor = getEmissionFactor(baselineMode, baselineVType);
    const greenFactor = getEmissionFactor(mode, 'electric');
    const km = Math.max(0.5, Number(distanceKm));

    const avoidedKg = Math.max(0.1, Math.round((km * (baseFactor - greenFactor)) * 10) / 10);
    const points = Math.min(60, Math.max(15, Math.round(km * 5)));

    // Create commute entry
    const commute = await GreenCommute.create({
      userId,
      mode,
      distanceKm: km,
      baselineMode,
      co2SavedKg: avoidedKg,
      pointsEarned: points,
      date: new Date().toISOString().split('T')[0],
      notes
    });

    // Update user stats
    user.ecoPoints = (user.ecoPoints || 0) + points;
    user.streak = (user.streak || 0) + 1;
    if (user.streak > (user.longestStreak || 0)) {
      user.longestStreak = user.streak;
    }
    user.lastActiveDate = new Date().toISOString().split('T')[0];
    await user.save();

    // Check Metro Nomad badge
    const commuteCount = await GreenCommute.countDocuments({ userId });
    let newBadge = null;
    if (commuteCount >= 3) {
      const bTransit = await UserBadge.findOne({ userId, badgeId: 'badge-transit' });
      if (!bTransit) {
        newBadge = await UserBadge.create({
          userId,
          badgeId: 'badge-transit',
          badgeName: 'Metro Nomad',
          badgeIcon: '🚇',
          earnedAt: new Date()
        });
      }
    }

    return res.json({
      message: `Logged ${km} km ${mode} trip! Avoided ${avoidedKg} kg CO₂e and gained ${points} Eco Points!`,
      commute,
      user: {
        ecoPoints: user.ecoPoints,
        streak: user.streak,
        shields: user.shields
      },
      newBadge
    });
  } catch (err) {
    console.error('[Log Commute Error]:', err);
    return res.status(500).json({ message: 'Error logging green commute', error: err.message });
  }
});

export default router;
