
import * as authService from './auth.service.js';
export const register = async (req, res, next) => {
  try {
    const profileImage = req.file ? req.file.path : '';

    const user = await authService.registerService({
      ...req.body,
      profileImage,
    });

    res.status(201).json({
      success: true,
      message: 'Registered successfully Check Your Email.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmEmail = async (req, res, next) => {
  try {
    const result = await authService.confirmEmailService(req.body);
    res.status(200).json({
      success: true,
      message: 'Email confirmed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await authService.loginService(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPasswordService(req.body);
    res.status(200).json({
      success: true,
      message: 'OTP sent. Check console.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPasswordService(req.body);
    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token missing' });

    const result = await authService.refreshTokenService(token);
    res.status(200).json({ success: true, accessToken: result.accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    await authService.logoutService(token);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};