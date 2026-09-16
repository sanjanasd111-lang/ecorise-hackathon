import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { CO2Profile } from '../models/CO2Profile.js';
import { ChallengeCycle } from '../models/ChallengeCycle.js';
import { UserBadge } from '../models/Badge.js';
import { CompletedActivity } from '../models/Activity.js';
import { generateCycleTasks } from './challenges.js';

const router = express.Router();

// GET /api/dashboard
router.get('/', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const userId = String(user._id || user.id);

    // 1. Get CO2 Profile
    let profile = await CO2Profile.findOne({ userId });
    let metrics = null;
    if (profile) {
      const baseline = profile.baselineWeeklyCO2e || 0;
      const current = profile.currentWeeklyCO2e || 0;
      metrics = {
        baselineWeeklyCO2e: baseline,
        currentWeeklyCO2e: current,
        reductionKg: Math.max(0, Math.round((baseline - current) * 10) / 10),
        reductionPct: baseline > 0 ? Math.round(((baseline - current) / baseline) * 100) : 0,
        monthlySavedKg: Math.max(0, Math.round((baseline - current) * 4.33 * 10) / 10),
        annualKgSaved: Math.max(0, Math.round((baseline - current) * 52 * 10) / 10)
      };
    }

    // 2. Get or initialize 3-Day Challenge Cycle
    let cycle = await ChallengeCycle.findOne({ userId, status: 'active' });
    const now = new Date();

    if (cycle && now > new Date(cycle.endDate)) {
      cycle.status = cycle.allCompleted ? 'completed' : 'expired';
      await cycle.save();
      cycle = null;
    }

    if (!cycle) {
      const allCycles = await ChallengeCycle.find({ userId });
      const nextNum = allCycles.length + 1;
      const endDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      const userMode = profile ? profile.transportMode : 'car';
      const days = generateCycleTasks(userMode, nextNum);

      cycle = await ChallengeCycle.create({
        userId,
        cycleNumber: nextNum,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        status: 'active',
        days,
        allCompleted: false,
        bonusPointsAwarded: false
      });
    }

    const endMs = new Date(cycle.endDate).getTime();
    const remainingMs = Math.max(0, endMs - now.getTime());

    // 3. User Badges
    const userBadges = await UserBadge.find({ userId });

    // 4. Recent Completed Activities
    const recentActivities = (await CompletedActivity.find({ userId })).slice(-5).reverse();

    return res.json({
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        city: user.city || 'Greenwood District',
        school: user.school || 'Civic Climate Academy',
        ecoPoints: user.ecoPoints || 0,
        streak: user.streak || 0,
        longestStreak: user.longestStreak || 0,
        shields: user.shields !== undefined ? user.shields : 1,
        onboardingCompleted: Boolean(user.onboardingCompleted)
      },
      profile,
      metrics,
      cycle: {
        ...cycle.toObject ? cycle.toObject() : cycle,
        remainingMs,
        timeRemaining: {
          days: Math.floor(remainingMs / (1000 * 60 * 60 * 24)),
          hours: Math.floor((remainingMs / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((remainingMs / (1000 * 60)) % 60)
        }
      },
      badges: userBadges,
      recentActivities
    });
  } catch (err) {
    console.error('[Dashboard Aggregate Error]:', err);
    return res.status(500).json({ message: 'Error compiling dashboard data', error: err.message });
  }
});

export default router;
