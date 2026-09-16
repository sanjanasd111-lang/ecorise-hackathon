import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import challengesRoutes from './routes/challenges.js';
import co2Routes from './routes/co2.js';
import activitiesRoutes from './routes/activities.js';
import greenCommuteRoutes from './routes/greenCommute.js';
import leaderboardRoutes from './routes/leaderboard.js';
import badgesRoutes from './routes/badges.js';
import surveysRoutes from './routes/surveys.js';
import recognitionRoutes from './routes/recognition.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'EcoRise 2.0 SDG-13 Live Climate Action API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/co2', co2Routes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/green-commute', greenCommuteRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/badges', badgesRoutes);
app.use('/api/surveys', surveysRoutes);
app.use('/api/recognition', recognitionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Unhandled Error]:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Initialize database and start listening
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🌿 EcoRise 2.0 Server running on http://localhost:${PORT}`);
    console.log(`📡 API Endpoints live at http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });
}

startServer();
