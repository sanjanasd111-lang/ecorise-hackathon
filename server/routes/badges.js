import express from 'express';
import { Badge, UserBadge } from '../models/Badge.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/badges
router.get('/', async (req, res) => {
  try {
    const allBadges = await Badge.find();
    return res.json({ badges: allBadges });
  } catch (err) {
    console.error('[Badges Fetch Error]:', err);
    return res.status(500).json({ message: 'Error retrieving badges', error: err.message });
  }
});

// GET /api/badges/user
router.get('/user', authenticate, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    const userBadges = await UserBadge.find({ userId });
    return res.json({ userBadges });
  } catch (err) {
    console.error('[User Badges Fetch Error]:', err);
    return res.status(500).json({ message: 'Error retrieving user badges', error: err.message });
  }
});

export default router;
