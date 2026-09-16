import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { calculateTransportCO2e } from '../config/emissionFactors.js';
import { CO2Profile } from '../models/CO2Profile.js';
import { CO2Snapshot } from '../models/CO2Snapshot.js';
import { ChallengeCycle } from '../models/ChallengeCycle.js';
import { UserBadge } from '../models/Badge.js';
import { generateCycleTasks } from './challenges.js';

const router = express.Router();

// POST /api/onboarding/submit
router.post('/submit', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const {
      transportMode,
      vehicleType = 'Not sure',
      distancePerTrip = 5,
      distanceType = 'one-way',
      tripsPerWeek = 5,
      hasPublicTransitAccess = true
    } = req.body;

    if (!transportMode) {
      return res.status(400).json({ message: 'Primary transport mode is required.' });
    }

    // 1. Calculate CO2e via authoritative DEFRA/IPCC methodology
    const calculation = calculateTransportCO2e({
      transportMode,
      vehicleType,
      distancePerTrip,
      tripsPerWeek,
      distanceType
    });

    const userId = String(user._id || user.id);

    // 2. Persist / Update CO2Profile
    let profile = await CO2Profile.findOne({ userId });
    const profileData = {
      userId,
      transportMode,
      vehicleType,
      distancePerTrip: Number(distancePerTrip),
      distanceType,
      tripsPerWeek: Number(tripsPerWeek),
      hasPublicTransitAccess: Boolean(hasPublicTransitAccess),
      weeklyDistanceKm: calculation.weeklyDistanceKm,
      emissionFactor: calculation.emissionFactor,
      baselineWeeklyCO2e: calculation.estimatedWeeklyCO2e,
      currentWeeklyCO2e: calculation.estimatedWeeklyCO2e,
      baselineMonthlyCO2e: calculation.estimatedMonthlyCO2e,
      currentMonthlyCO2e: calculation.estimatedMonthlyCO2e,
      baselineYearlyCO2e: calculation.estimatedYearlyCO2e,
      currentYearlyCO2e: calculation.estimatedYearlyCO2e,
      lastCalculatedAt: new Date()
    };

    if (profile) {
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      profile = await CO2Profile.create(profileData);
    }

    // 3. Create Week 1 CO2 Snapshot
    await CO2Snapshot.create({
      userId,
      weekNumber: 1,
      weekLabel: 'Baseline',
      estimatedWeeklyCO2e: calculation.estimatedWeeklyCO2e,
      recordedAt: new Date()
    });

    // 4. Mark user onboarding completed and award welcome Eco Points
    user.onboardingCompleted = true;
    user.ecoPoints = (user.ecoPoints || 0) + 20; // Welcome reward
    user.streak = 1; // Kickstart streak
    await user.save();

    // 5. Award "Green Starter" badge
    const existingBadge = await UserBadge.findOne({ userId, badgeId: 'badge-starter' });
    if (!existingBadge) {
      await UserBadge.create({
        userId,
        badgeId: 'badge-starter',
        badgeName: 'Green Starter',
        badgeIcon: '🌱',
        earnedAt: new Date()
      });
    }

    // 6. Generate first 3-Day Challenge Cycle
    const now = new Date();
    const endDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // strictly 3 days

    const initialDays = generateCycleTasks(transportMode, 1);
    const newCycle = await ChallengeCycle.create({
      userId,
      cycleNumber: 1,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      days: initialDays,
      allCompleted: false,
      bonusPointsAwarded: false
    });

    user.currentCycleId = newCycle._id || newCycle.id;
    await user.save();

    return res.status(200).json({
      message: 'Personalized climate baseline established successfully!',
      profile,
      calculation,
      cycle: newCycle,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        ecoPoints: user.ecoPoints,
        streak: user.streak,
        shields: user.shields,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (err) {
    console.error('[Onboarding Submit Error]:', err);
    return res.status(500).json({ message: 'Error processing onboarding questionnaire', error: err.message });
  }
});

export default router;
