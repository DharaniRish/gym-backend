import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET || 'gymverse-local-access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'gymverse-local-refresh-secret';

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: '1h',
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};






