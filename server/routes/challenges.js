import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { ChallengeCycle } from '../models/ChallengeCycle.js';
import { User } from '../models/User.js';
import { CompletedActivity } from '../models/Activity.js';
import { CO2Profile } from '../models/CO2Profile.js';
import { CO2Snapshot } from '../models/CO2Snapshot.js';
import { UserBadge } from '../models/Badge.js';

const router = express.Router();

/**
 * Helper to dynamically generate 3 tailored tasks for a 3-day cycle.
 */
export function generateCycleTasks(transportMode = 'car', cycleNumber = 1) {
  const mode = (transportMode || '').toLowerCase();
  
  const transportTasks = [
    {
      title: mode === 'car' ? 'Shift 1 Trip to Public Transit or Metro' : 'Take a Zero-Emission Walk / Bike Trip',
      description: mode === 'car' 
        ? 'Leave your motor vehicle parked and take the bus or metro for at least one commute.'
        : 'Walk or cycle for a trip under 3km instead of requesting motorized transport.',
      category: 'transport',
      co2SavingEstimate: 1.4,
      points: 30
    },
    {
      title: 'Shared Mobility / Carpool Challenge',
      description: 'Ride together with a classmate or colleague, or share transit to reduce vehicle count.',
      category: 'transport',
      co2SavingEstimate: 0.9,
      points: 25
    },
    {
      title: 'Active Mobility Lunch / Errand',
      description: 'Choose walking or cycling for your midday errand or food run instead of delivery.',
      category: 'transport',
      co2SavingEstimate: 0.6,
      points: 20
    }
  ];

  const lifestyleTasks = [
    {
      title: 'Zero Vampire Power & Unplug Chargers',
      description: 'Turn off power strips and disconnect laptops and appliances before going to sleep.',
      category: 'energy',
      co2SavingEstimate: 0.5,
      points: 20
    },
    {
      title: 'Plant-Rich Day / Meatless Meal',
      description: 'Enjoy delicious plant-based protein dishes to cut agricultural emissions.',
      category: 'waste',
      co2SavingEstimate: 1.2,
      points: 25
    },
    {
      title: 'Cold Water Wash / Air Dry Laundry',
      description: 'Wash clothing at 30°C or air dry garments instead of running energy-intensive dryers.',
      category: 'energy',
      co2SavingEstimate: 0.7,
      points: 20
    },
    {
      title: 'Carry Reusable Carry-Kit All Day',
      description: 'Eliminate single-use plastics: carry your own insulated tumbler, cloth bag, and utensils.',
      category: 'waste',
      co2SavingEstimate: 0.4,
      points: 20
    },
    {
      title: 'Campus / Neighborhood Green Survey',
      description: 'Identify 1 urban area in your community that needs tree cover or better bike racks.',
      category: 'civic',
      co2SavingEstimate: 0.8,
      points: 30
    }
  ];

  // Rotate tasks based on cycle number
  const day1 = transportTasks[(cycleNumber - 1) % transportTasks.length];
  const day2 = lifestyleTasks[(cycleNumber - 1) % lifestyleTasks.length];
  const day3 = lifestyleTasks[(cycleNumber) % lifestyleTasks.length];

  return [
    { day: 1, ...day1, completed: false, completedAt: null, verificationNote: '' },
    { day: 2, ...day2, completed: false, completedAt: null, verificationNote: '' },
    { day: 3, ...day3, completed: false, completedAt: null, verificationNote: '' }
  ];
}

// GET /api/challenges/current
router.get('/current', authenticate, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    let cycle = await ChallengeCycle.findOne({ userId, status: 'active' });

    const now = new Date();

    // If cycle exists, check if 3-day time window has expired
    if (cycle) {
      const cycleEnd = new Date(cycle.endDate);
      if (now > cycleEnd) {
        cycle.status = cycle.allCompleted ? 'completed' : 'expired';
        await cycle.save();
        cycle = null; // trigger generation of new cycle
      }
    }

    // If no active cycle, generate next 3-day cycle
    if (!cycle) {
      // Find latest cycle number
      const existingCycles = await ChallengeCycle.find({ userId });
      const nextCycleNum = existingCycles.length + 1;

      const profile = await CO2Profile.findOne({ userId });
      const userMode = profile ? profile.transportMode : 'car';

      const startDate = now.toISOString();
      const endDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(); // strictly 3 days

      const days = generateCycleTasks(userMode, nextCycleNum);

      cycle = await ChallengeCycle.create({
        userId,
        cycleNumber: nextCycleNum,
        startDate,
        endDate,
        status: 'active',
        days,
        allCompleted: false,
        bonusPointsAwarded: false
      });

      req.user.currentCycleId = cycle._id || cycle.id;
      await req.user.save();
    }

    // Calculate remaining time
    const endMs = new Date(cycle.endDate).getTime();
    const remainingMs = Math.max(0, endMs - now.getTime());

    return res.json({
      cycle,
      remainingMs,
      timeRemaining: {
        days: Math.floor(remainingMs / (1000 * 60 * 60 * 24)),
        hours: Math.floor((remainingMs / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((remainingMs / (1000 * 60)) % 60)
      }
    });
  } catch (err) {
    console.error('[Challenges Current Error]:', err);
    return res.status(500).json({ message: 'Error retrieving challenge cycle', error: err.message });
  }
});

// POST /api/challenges/complete-day
router.post('/complete-day', authenticate, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    const { dayNumber, verificationNote } = req.body;

    const cycle = await ChallengeCycle.findOne({ userId, status: 'active' });
    if (!cycle) {
      return res.status(404).json({ message: 'No active 3-day challenge cycle found.' });
    }

    const taskIndex = cycle.days.findIndex(d => d.day === Number(dayNumber));
    if (taskIndex === -1) {
      return res.status(400).json({ message: `Day ${dayNumber} not found in current cycle.` });
    }

    const task = cycle.days[taskIndex];
    if (task.completed) {
      return res.status(400).json({ message: `Day ${dayNumber} has already been completed!` });
    }

    // Mark task completed
    task.completed = true;
    task.completedAt = new Date().toISOString();
    task.verificationNote = verificationNote || 'Completed with verified climate impact';

    // Award task points to user
    const user = req.user;
    user.ecoPoints = (user.ecoPoints || 0) + task.points;
    user.streak = (user.streak || 0) + 1;
    if (user.streak > (user.longestStreak || 0)) {
      user.longestStreak = user.streak;
    }
    user.lastActiveDate = new Date().toISOString().split('T')[0];

    // Record completed activity log
    await CompletedActivity.create({
      userId,
      activityId: `cycle-${cycle.cycleNumber}-day-${dayNumber}`,
      activityTitle: task.title,
      category: task.category,
      pointsEarned: task.points,
      co2SavedKg: task.co2SavingEstimate,
      note: task.verificationNote
    });

    // Update CO2 profile current estimate (habit improvement)
    const profile = await CO2Profile.findOne({ userId });
    if (profile) {
      profile.currentWeeklyCO2e = Math.max(0, Math.round((profile.currentWeeklyCO2e - (task.co2SavingEstimate * 0.5)) * 10) / 10);
      profile.currentMonthlyCO2e = Math.round((profile.currentWeeklyCO2e * 4.33) * 10) / 10;
      profile.currentYearlyCO2e = Math.round((profile.currentWeeklyCO2e * 52) * 10) / 10;
      await profile.save();

      // Record snapshot
      const existingSnaps = await CO2Snapshot.find({ userId });
      const snapWeek = existingSnaps.length + 1;
      await CO2Snapshot.create({
        userId,
        weekNumber: snapWeek,
        weekLabel: `Week ${snapWeek}`,
        estimatedWeeklyCO2e: profile.currentWeeklyCO2e,
        recordedAt: new Date()
      });
    }

    // Check if ALL 3 days in the cycle are now complete
    const allDone = cycle.days.every(d => d.completed);
    let cycleBonusEarned = false;
    let earnedBadges = [];

    if (allDone && !cycle.allCompleted) {
      cycle.allCompleted = true;
      cycle.status = 'completed';
      cycle.bonusPointsAwarded = true;
      cycleBonusEarned = true;

      // Award 50 bonus points + 1 Eco Shield
      user.ecoPoints += 50;
      user.shields = (user.shields || 0) + 1;

      // Award "Mission Accomplished" badge
      const existingBadge = await UserBadge.findOne({ userId, badgeId: 'badge-cycle-1' });
      if (!existingBadge) {
        const newBadge = await UserBadge.create({
          userId,
          badgeId: 'badge-cycle-1',
          badgeName: 'Mission Accomplished',
          badgeIcon: '🎯',
          earnedAt: new Date()
        });
        earnedBadges.push(newBadge);
      }
    }

    // Check streak badges
    if (user.streak >= 3) {
      const b3 = await UserBadge.findOne({ userId, badgeId: 'badge-streak-3' });
      if (!b3) {
        const newB = await UserBadge.create({
          userId,
          badgeId: 'badge-streak-3',
          badgeName: 'Streak Pioneer',
          badgeIcon: '🔥',
          earnedAt: new Date()
        });
        earnedBadges.push(newB);
      }
    }

    if (user.streak >= 7) {
      const b7 = await UserBadge.findOne({ userId, badgeId: 'badge-streak-7' });
      if (!b7) {
        const newB = await UserBadge.create({
          userId,
          badgeId: 'badge-streak-7',
          badgeName: 'Eco Sentinel',
          badgeIcon: '🛡️',
          earnedAt: new Date()
        });
        user.shields = (user.shields || 0) + 1;
        earnedBadges.push(newB);
      }
    }

    // Check points champion badge
    if (user.ecoPoints >= 250) {
      const bCamp = await UserBadge.findOne({ userId, badgeId: 'badge-champion' });
      if (!bCamp) {
        const newB = await UserBadge.create({
          userId,
          badgeId: 'badge-champion',
          badgeName: 'SDG 13 Civic Champion',
          badgeIcon: '🏆',
          earnedAt: new Date()
        });
        earnedBadges.push(newB);
      }
    }

    await user.save();
    await cycle.save();

    return res.json({
      message: cycleBonusEarned
        ? '🎉 Fantastic! You completed the full 3-Day Mission! +50 Bonus Points & 1 Eco Shield awarded!'
        : `Day ${dayNumber} completed! +${task.points} Eco Points earned.`,
      cycle,
      user: {
        ecoPoints: user.ecoPoints,
        streak: user.streak,
        shields: user.shields
      },
      cycleBonusEarned,
      earnedBadges
    });
  } catch (err) {
    console.error('[Complete Day Error]:', err);
    return res.status(500).json({ message: 'Error completing challenge day', error: err.message });
  }
});

// POST /api/challenges/start-new
router.post('/start-new', authenticate, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    
    // Mark existing active cycle as archived
    const activeCycle = await ChallengeCycle.findOne({ userId, status: 'active' });
    if (activeCycle) {
      activeCycle.status = activeCycle.allCompleted ? 'completed' : 'expired';
      await activeCycle.save();
    }

    const allCycles = await ChallengeCycle.find({ userId });
    const nextNum = allCycles.length + 1;
    const now = new Date();
    const endDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const profile = await CO2Profile.findOne({ userId });
    const userMode = profile ? profile.transportMode : 'car';
    const days = generateCycleTasks(userMode, nextNum);

    const newCycle = await ChallengeCycle.create({
      userId,
      cycleNumber: nextNum,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      days,
      allCompleted: false,
      bonusPointsAwarded: false
    });

    req.user.currentCycleId = newCycle._id || newCycle.id;
    await req.user.save();

    return res.json({
      message: `Cycle #${nextNum} started!`,
      cycle: newCycle
    });
  } catch (err) {
    console.error('[Start New Cycle Error]:', err);
    return res.status(500).json({ message: 'Error starting new cycle', error: err.message });
  }
});

export default router;
