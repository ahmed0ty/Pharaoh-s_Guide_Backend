// import jwt from 'jsonwebtoken';
// import redis from '../config/redis.js';

// // ── توليد التوكنز ──────────────────────────────────────────
// export const generateToken = (payload, type) => {
//   const secret    = type === 'access' ? process.env.JWT_SECRET : process.env.REFRESH_SECRET;
//   const expiresIn = type === 'access' ? '15m' : '7d';
//   return jwt.sign(payload, secret, { expiresIn });
// };

// export const generateTokens = (payload) => ({
//   accessToken : generateToken(payload, 'access'),
//   refreshToken: generateToken(payload, 'refresh'),
// });

// // ── التحقق من التوكن ───────────────────────────────────────
// export const verifyToken = (token, type) => {
//   const secret = type === 'access' ? process.env.JWT_SECRET : process.env.REFRESH_SECRET;
//   return jwt.verify(token, secret);
// };

// // ── Refresh Tokens في Redis ────────────────────────────────
// const REFRESH_TTL = 7 * 24 * 60 * 60; // 7 أيام بالثواني

// export const saveRefreshToken = async (userId, token) => {
//   await redis.setex(`refresh:${userId}:${token}`, REFRESH_TTL, '1');
// };

// export const isRefreshTokenValid = async (userId, token) => {
//   const exists = await redis.exists(`refresh:${userId}:${token}`);
//   return exists === 1;
// };

// export const revokeRefreshToken = async (userId, token) => {
//   await redis.del(`refresh:${userId}:${token}`);
// };

// // لما المستخدم يعمل logout من كل الأجهزة
// export const revokeAllUserTokens = async (userId) => {
//   const keys = await redis.keys(`refresh:${userId}:*`);
//   if (keys.length) await redis.del(...keys);
// };


import jwt from 'jsonwebtoken';
import redis from '../config/redis.js';

// ── توليد التوكنز ──────────────────────────────────────────
export const generateToken = (payload, type) => {
  const secret    = type === 'access'
    ? process.env.JWT_SECRET
    : process.env.REFRESH_SECRET;

  const expiresIn = type === 'access' ? '15m' : '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

// Access + Refresh مع بعض
export const generateTokens = (payload) => ({
  accessToken : generateToken(payload, 'access'),
  refreshToken: generateToken(payload, 'refresh'),
});

// ── دوال صريحة عشان الميدل وير ────────────────────────────

// Generate Access Token
export const generateAccessToken = (payload) => {
  return generateToken(payload, 'access');
};

// Generate Refresh Token
export const generateRefreshToken = (payload) => {
  return generateToken(payload, 'refresh');
};

// Verify عام
export const verifyToken = (token, type) => {
  const secret = type === 'access'
    ? process.env.JWT_SECRET
    : process.env.REFRESH_SECRET;

  return jwt.verify(token, secret);
};

// Verify Access
export const verifyAccessToken = (token) => {
  return verifyToken(token, 'access');
};

// Verify Refresh
export const verifyRefreshToken = (token) => {
  return verifyToken(token, 'refresh');
};

// ── Refresh Tokens في Redis ────────────────────────────────
const REFRESH_TTL = 7 * 24 * 60 * 60; // 7 أيام

export const saveRefreshToken = async (userId, token) => {
  await redis.setex(`refresh:${userId}:${token}`, REFRESH_TTL, '1');
};

export const isRefreshTokenValid = async (userId, token) => {
  const exists = await redis.exists(`refresh:${userId}:${token}`);
  return exists === 1;
};

export const revokeRefreshToken = async (userId, token) => {
  await redis.del(`refresh:${userId}:${token}`);
};

// logout من كل الأجهزة
export const revokeAllUserTokens = async (userId) => {
  const keys = await redis.keys(`refresh:${userId}:*`);
  if (keys.length) {
    await redis.del(...keys);
  }
};