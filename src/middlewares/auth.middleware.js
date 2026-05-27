// import jwt from 'jsonwebtoken';
// import User from '../DB/models/user.model.js';

// export const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const token = authHeader.split(' ')[1];

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch {
//       return res.status(401).json({ message: 'Token expired or invalid' });
//     }

//     const user = await User.findById(decoded.id).select('-password -refreshTokens');
//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     req.user = user;
//     next();

//   } catch (error) {
//     next(error);
//   }
// };
















import jwt from 'jsonwebtoken';
import User from '../DB/models/user.model.js';
import { verifyAccessToken, verifyRefreshToken,
         generateAccessToken, saveRefreshToken,
         isRefreshTokenValid, revokeRefreshToken } from '../utils/jwt.util.js';
import { ApiResponse } from '../utils/apiResponse.util.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      return ApiResponse.unauthorized(res, 'No token provided');

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name !== 'TokenExpiredError')
        return ApiResponse.unauthorized(res, 'Invalid token');

      // ── Access token انتهى → جرب الـ refresh ──
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken)
        return ApiResponse.unauthorized(res, 'Token expired, please login again');

      let refreshDecoded;
      try {
        refreshDecoded = verifyRefreshToken(refreshToken);
      } catch {
        return ApiResponse.unauthorized(res, 'Refresh token invalid');
      }

      const valid = await isRefreshTokenValid(refreshDecoded.id, refreshToken);
      if (!valid)
        return ApiResponse.unauthorized(res, 'Refresh token revoked');

      // أصدر access token جديد
      const newAccessToken = generateAccessToken({ id: refreshDecoded.id, role: refreshDecoded.role });
      res.setHeader('x-new-access-token', newAccessToken);
      decoded = refreshDecoded;
    }

    const user = await User.findById(decoded.id).select('-password -refreshTokens');
    if (!user) return ApiResponse.unauthorized(res, 'User not found');

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return ApiResponse.forbidden(res, 'You do not have permission');
  next();
};