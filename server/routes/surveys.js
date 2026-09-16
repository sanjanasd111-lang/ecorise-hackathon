import express from 'express';
import { Survey, SurveyResponse } from '../models/Survey.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const DEFAULT_PULSE_SURVEY = {
  id: 'pulse-active-1',
  title: 'City Urban Canopy & Active Transit Prioritization',
  description: 'Vote on which civic infrastructure upgrade your district municipality should prioritize next quarter.',
  options: [
    { id: 'opt-1', label: 'Protected Separated Bike Lanes on Main Arterials', votes: 48 },
    { id: 'opt-2', label: 'Frequent Electric Feeder Buses to Metro Stations', votes: 62 },
    { id: 'opt-3', label: 'Urban Pocket Forests & Shaded Pedestrian Sidewalks', votes: 85 },
    { id: 'opt-4', label: 'Public EV Fast Charging Powered by Solar Canopies', votes: 34 }
  ]
};

let activeSurveyData = { ...DEFAULT_PULSE_SURVEY };

// GET /api/surveys/active
router.get('/active', async (req, res) => {
  const totalVotes = activeSurveyData.options.reduce((sum, o) => sum + o.votes, 0);
  return res.json({
    survey: {
      ...activeSurveyData,
      totalVotes,
      options: activeSurveyData.options.map(o => ({
        ...o,
        pct: totalVotes > 0 ? Math.round((o.votes / totalVotes) * 100) : 0
      }))
    }
  });
});

// POST /api/surveys/vote
router.post('/vote', authenticate, async (req, res) => {
  try {
    const { optionId } = req.body;
    const option = activeSurveyData.options.find(o => o.id === optionId);
    if (!option) {
      return res.status(400).json({ message: 'Invalid option selected' });
    }

    option.votes += 1;
    const totalVotes = activeSurveyData.options.reduce((sum, o) => sum + o.votes, 0);

    return res.json({
      message: 'Vote counted towards the Civic Climate Pulse!',
      survey: {
        ...activeSurveyData,
        totalVotes,
        options: activeSurveyData.options.map(o => ({
          ...o,
          pct: Math.round((o.votes / totalVotes) * 100)
        }))
      }
    });
  } catch (err) {
    console.error('[Survey Vote Error]:', err);
    return res.status(500).json({ message: 'Error submitting vote', error: err.message });
  }
});

export default router;
