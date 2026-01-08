import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('DEBUG: No token provided');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      console.log('DEBUG: User not found for ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.log('DEBUG: Token verification failed:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const trainer = (req, res, next) => {
  if (req.user && (req.user.role === 'trainer' || req.user.role === 'admin')) {
    next();
  } else {
    console.log('DEBUG: User role not authorized:', req.user?.role);
    res.status(401).json({ message: 'Not authorized as a trainer' });
  }
};
