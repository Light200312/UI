import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';
import { generateToken, hashPassword, verifyPassword } from '../utils/auth.js';

const router = express.Router();

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password)
    });

    return res.status(201).json({
      token: generateToken(user),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      token: generateToken(user),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  return res.json({ user: req.user });
});

export default router;
