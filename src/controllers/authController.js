import User from '../models/User.js';
import mongoose from 'mongoose';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

export const register = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message: 'Database is not connected. Please start MongoDB or set MONGO_URI in Gym-BE/.env.',
      });
    }

    const { name, email, password, role } = req.body;
    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({
        code: 'USER_EXISTS',
        message: 'This email is already registered. Please sign in instead.',
      });
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: role || 'member',
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        code: 'USER_EXISTS',
        message: 'This email is already registered. Please sign in instead.',
      });
    }

    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message: 'Database is not connected. Please start MongoDB or set MONGO_URI in Gym-BE/.env.',
      });
    }

    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
