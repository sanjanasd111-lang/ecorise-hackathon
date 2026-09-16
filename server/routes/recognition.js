import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { Recognition } from '../models/Recognition.js';
import { CO2Profile } from '../models/CO2Profile.js';

const router = express.Router();

function getTier(points) {
  if (points >= 500) return 'Civic Champion';
  if (points >= 250) return 'Gold';
  if (points >= 100) return 'Silver';
  return 'Bronze';
}

// GET /api/recognition/certificate
router.get('/certificate', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const userId = String(user._id || user.id);

    let recognition = await Recognition.findOne({ userId });
    const profile = await CO2Profile.findOne({ userId });

    const points = user.ecoPoints || 0;
    const tier = getTier(points);
    const co2SavedKg = profile ? Math.max(0, Math.round((profile.baselineWeeklyCO2e - profile.currentWeeklyCO2e) * 4.33 * 10) / 10) : 0;

    if (!recognition) {
      const certNum = `ECO-SDG13-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      recognition = await Recognition.create({
        userId,
        userName: user.name,
        title: 'SDG 13 Civic Climate Leadership Recognition',
        tier,
        certificateNumber: certNum,
        pointsAtIssue: points,
        co2SavedKg,
        issuedAt: new Date(),
        verifiedBy: 'EcoRise Civic Council & SDG 13 Action Hub'
      });
    } else {
      // Update with current points & tier
      recognition.pointsAtIssue = points;
      recognition.tier = tier;
      recognition.co2SavedKg = co2SavedKg;
      await recognition.save();
    }

    return res.json({
      recognition: {
        certificateNumber: recognition.certificateNumber,
        userName: user.name,
        school: user.school || 'Civic Climate Academy',
        city: user.city || 'Greenwood District',
        tier: recognition.tier,
        pointsAtIssue: recognition.pointsAtIssue,
        co2SavedKg: recognition.co2SavedKg,
        issuedAt: recognition.issuedAt,
        verifiedBy: recognition.verifiedBy
      }
    });
  } catch (err) {
    console.error('[Recognition Certificate Error]:', err);
    return res.status(500).json({ message: 'Error fetching certificate', error: err.message });
  }
});

export default router;
