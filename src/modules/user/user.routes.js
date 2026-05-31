import { Router } from 'express';
import {
  addToFavorites, getMyFavorites, getMyProfile,
  removeFromFavorites, updateMyProfile, updateProfileImage,
} from './user.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { upload }  from '../../config/cloudinary.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and favorites
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get my profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', protect, getMyProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update my profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmed Tony
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', protect, updateMyProfile);

/**
 * @swagger
 * /api/user/profile/image:
 *   put:
 *     summary: Update profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image updated successfully
 */
router.put('/profile/image', protect, upload.single('profileImage'), updateProfileImage);

/**
 * @swagger
 * /api/user/favorites/{placeId}:
 *   post:
 *     summary: Add place to favorites
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Added to favorites
 */
router.post('/favorites/:placeId', protect, addToFavorites);

/**
 * @swagger
 * /api/user/favorites/{placeId}:
 *   delete:
 *     summary: Remove place from favorites
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed from favorites
 */
router.delete('/favorites/:placeId', protect, removeFromFavorites);

/**
 * @swagger
 * /api/user/favorites:
 *   get:
 *     summary: Get my favorites
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite places
 */
router.get('/favorites', protect, getMyFavorites);

export default router;