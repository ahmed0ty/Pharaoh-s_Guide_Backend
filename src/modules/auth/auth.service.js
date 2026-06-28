
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../DB/models/user.model.js';
import { generateToken } from '../../utils/jwt.util.js';
import { generateOTP, hashToken } from '../../utils/crypto.util.js';

// ✅ بقى بيستقبل profileImage
export const registerService = async ({ name, email, password, profileImage }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp            = generateOTP();
  const hashedOTP      = hashToken(otp);

  const user = await User.create({
    name,
    email,
    password            : hashedPassword,
    profileImage        : profileImage || '',  
    confirmEmailOTP     : hashedOTP,
    confirmEmailExpires : Date.now() + 10 * 60 * 1000,
    isConfirmed         : false,
  });


  return {
    userId: user._id,
    email : user.email,
    name  : user.name,
    otp,
  };
};

export const confirmEmailService = async ({ email, otp }) => {
  const user = await User.findOne({ email });
  if (!user)             throw new Error('User not found');
  if (user.isConfirmed)  throw new Error('Already confirmed');
  if (user.confirmEmailExpires < Date.now()) throw new Error('OTP expired');

  if (user.confirmEmailOTP !== hashToken(otp))
    throw new Error('Invalid OTP');

  user.isConfirmed         = true;
  user.confirmEmailOTP     = null;
  user.confirmEmailExpires = null;
  await user.save();

  return { email: user.email, isConfirmed: true };
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user)             throw new Error('Invalid email or password');
  if (!user.isConfirmed) throw new Error('Please confirm your email first');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)          throw new Error('Invalid email or password');

  const accessToken  = generateToken({ id: user._id }, 'access');
  const refreshToken = generateToken({ id: user._id }, 'refresh');

  if (!user.refreshTokens) user.refreshTokens = [];
  if (user.refreshTokens.length >= 5) user.refreshTokens.shift();
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id          : user._id,
      name        : user.name,
      email       : user.email,
      profileImage: user.profileImage,
      role        : user.role,        // ← أضف السطر ده
    },
  };
};

export const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const otp       = generateOTP();
  const hashedOTP = hashToken(otp);

  user.resetPasswordOTP     = hashedOTP;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save();


  return { email: user.email };
};

export const resetPasswordService = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  if (user.resetPasswordExpires < Date.now()) throw new Error('OTP expired');

  if (user.resetPasswordOTP !== hashToken(otp))
    throw new Error('Invalid OTP');

  user.password             = await bcrypt.hash(newPassword, 10);
  user.resetPasswordOTP     = null;
  user.resetPasswordExpires = null;
  await user.save();

  return { email: user.email, passwordReset: true };
};

export const refreshTokenService = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_SECRET);
  } catch {
    throw new Error('Refresh token expired or invalid');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new Error('User not found');

  const tokenExists = user.refreshTokens.some(rt => rt.token === token);
  if (!tokenExists) throw new Error('Invalid refresh token');

  const accessToken = generateToken({ id: user._id }, 'access');
  return { accessToken };
};

export const logoutService = async (token) => {
  if (token) {
    await User.updateOne(
      { 'refreshTokens.token': token },
      { $pull: { refreshTokens: { token } } }
    );
  }
};