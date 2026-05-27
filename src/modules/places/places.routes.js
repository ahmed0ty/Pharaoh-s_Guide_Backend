import { Router } from 'express';
import {
  getAllPlaces,
  getPlaceById,
  getFeaturedPlaces,
  createPlace,
  seedPlaces,
} from './places.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/seed', seedPlaces);
router.get('/featured', getFeaturedPlaces);
router.get('/', protect, getAllPlaces);
router.get('/:id', protect, getPlaceById);
router.post('/', protect, createPlace);

export default router;