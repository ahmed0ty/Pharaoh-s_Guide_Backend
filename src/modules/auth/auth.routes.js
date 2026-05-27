import { Router } from 'express';
import { upload } from '../../config/cloudinary.js'; // ✅ import الـ upload
import {
  register,
  confirmEmail,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
} from './auth.controller.js';

const router = Router();

router.post('/register', upload.single('profileImage'), register);
router.post('/confirm-email', confirmEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;