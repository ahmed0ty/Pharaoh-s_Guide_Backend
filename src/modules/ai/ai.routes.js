import { Router } from 'express';
import {
  generateTripPlan,
  getPlaceStory,
  chatWithGuide,
} from './ai.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/trip-plan', protect, generateTripPlan);
router.get('/story/:id', protect, getPlaceStory);
router.post('/chat', protect, chatWithGuide);

export default router;