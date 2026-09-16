import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { authenticate, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// Helper to sanitize user object
function sanitizeUser(user) {
  const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, city, school } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      city: city || 'Greenwood District',
      school: school || 'Civic Climate Academy',
      ecoPoints: 0,
      streak: 0,
      longestStreak: 0,
      shields: 1, // Start with 1 complimentary Eco Shield
      lastActiveDate: new Date().toISOString().split('T')[0],
      onboardingCompleted: false
    });

    const token = jwt.sign(
      { id: newUser._id || newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Registration successful! Please complete your climate onboarding.',
      token,
      user: sanitizeUser(newUser),
      needsOnboarding: true
    });
  } catch (err) {
    console.error('[Auth Register Error]:', err);
    return res.status(500).json({ message: 'Server error registering user', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Update streak check on login
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (user.lastActiveDate !== yesterday && user.streak > 0) {
        // Check if user has an Eco Shield to consume
        if (user.shields > 0) {
          user.shields -= 1;
          console.log(`[Streak] User ${user.email} used 1 Eco Shield to preserve streak!`);
        } else {
          // Streak broken
          user.streak = 0;
        }
      }
      user.lastActiveDate = today;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id || user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: `Welcome back, ${user.name}!`,
      token,
      user: sanitizeUser(user),
      needsOnboarding: !user.onboardingCompleted
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  return res.json({
    user: sanitizeUser(req.user)
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

export default router;
