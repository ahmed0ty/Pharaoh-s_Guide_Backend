import { Router } from 'express';
import { 
  addToFavorites, 
  getMyFavorites, 
  getMyProfile, 
  removeFromFavorites, 
  updateMyProfile,
  updateProfileImage  // ✅ جديد
} from './user.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { upload } from '../../config/cloudinary.js'; // ✅ جديد

const router = Router();

router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);
router.put('/profile/image', protect, upload.single('profileImage'), updateProfileImage); // ✅ جديد
router.post('/favorites/:placeId', protect, addToFavorites);
router.delete('/favorites/:placeId', protect, removeFromFavorites);
router.get('/favorites', protect, getMyFavorites);

export default router;