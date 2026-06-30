import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

export const createAccessToken = (payload: { userId: string; role: string; tokenVersion: number }): string => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '30m' });
};

export const createRefreshToken = (payload: { userId: string; tokenVersion: number }): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};
