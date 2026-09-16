import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { Activity, CompletedActivity } from '../models/Activity.js';
import { CO2Profile } from '../models/CO2Profile.js';
import { UserBadge } from '../models/Badge.js';

const router = express.Router();

// GET /api/activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find();
    return res.json({ activities });
  } catch (err) {
    console.error('[Activities Fetch Error]:', err);
    return res.status(500).json({ message: 'Error retrieving activities', error: err.message });
  }
});

// POST /api/activities/complete
router.post('/complete', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const userId = String(user._id || user.id);
    const { activityId, note } = req.body;

    const activity = await Activity.findOne({ id: activityId }) || (await Activity.find()).find(a => a.id === activityId || a._id === activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Award points
    user.ecoPoints = (user.ecoPoints || 0) + activity.points;
    user.streak = (user.streak || 0) + 1;
    if (user.streak > (user.longestStreak || 0)) {
      user.longestStreak = user.streak;
    }
    user.lastActiveDate = new Date().toISOString().split('T')[0];
    await user.save();

    // Record completed log
    const completed = await CompletedActivity.create({
      userId,
      activityId: activity.id || activity._id,
      activityTitle: activity.title,
      category: activity.category,
      pointsEarned: activity.points,
      co2SavedKg: activity.co2SavedKg,
      note: note || 'Verified eco action completed'
    });

    // Award first action badge if not already unlocked
    const userCompletedCount = await CompletedActivity.countDocuments({ userId });
    let newBadgeAwarded = null;
    if (userCompletedCount >= 1) {
      const b1 = await UserBadge.findOne({ userId, badgeId: 'badge-starter' });
      if (!b1) {
        newBadgeAwarded = await UserBadge.create({
          userId,
          badgeId: 'badge-starter',
          badgeName: 'Green Starter',
          badgeIcon: '🌱',
          earnedAt: new Date()
        });
      }
    }

    return res.json({
      message: `Completed "${activity.title}"! +${activity.points} Eco Points earned.`,
      user: {
        ecoPoints: user.ecoPoints,
        streak: user.streak,
        shields: user.shields
      },
      completed,
      newBadgeAwarded
    });
  } catch (err) {
    console.error('[Activity Complete Error]:', err);
    return res.status(500).json({ message: 'Error completing activity', error: err.message });
  }
});

export default router;
