import express from 'express';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const SEED_LEADERBOARD = [
  { id: 'peer-1', name: 'Aarav Patel', city: 'Greenwood District', school: 'Civic Climate Academy', ecoPoints: 420, streak: 9, badgesCount: 6 },
  { id: 'peer-2', name: 'Sophia Chen', city: 'Oakridge Eco Zone', school: 'Tech High Eco Club', ecoPoints: 385, streak: 8, badgesCount: 5 },
  { id: 'peer-3', name: 'Marcus Miller', city: 'Riverdale Metro', school: 'Greenwood District', ecoPoints: 340, streak: 6, badgesCount: 5 },
  { id: 'peer-4', name: 'Zoya Khan', city: 'Greenwood District', school: 'Northside Prep', ecoPoints: 295, streak: 5, badgesCount: 4 },
  { id: 'peer-5', name: 'Liam O’Connor', city: 'Highland Park', school: 'Oakridge High', ecoPoints: 260, streak: 4, badgesCount: 3 }
];

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const realUsers = await User.find();
    
    const formattedReal = realUsers.map(u => ({
      id: u._id || u.id,
      name: u.name,
      city: u.city || 'Greenwood District',
      school: u.school || 'Civic Climate Academy',
      ecoPoints: u.ecoPoints || 0,
      streak: u.streak || 0,
      isCurrentUser: false
    }));

    // Combine real and benchmark peers
    const combined = [...formattedReal];
    for (const seed of SEED_LEADERBOARD) {
      if (!combined.some(u => u.name === seed.name)) {
        combined.push(seed);
      }
    }

    // Sort descending by ecoPoints
    combined.sort((a, b) => (b.ecoPoints || 0) - (a.ecoPoints || 0));

    // Assign ranks
    const ranked = combined.map((u, idx) => ({
      ...u,
      rank: idx + 1
    }));

    const podium = ranked.slice(0, 3);

    return res.json({
      leaderboard: ranked,
      podium,
      totalParticipants: ranked.length
    });
  } catch (err) {
    console.error('[Leaderboard Error]:', err);
    return res.status(500).json({ message: 'Error retrieving leaderboard', error: err.message });
  }
});

export default router;
