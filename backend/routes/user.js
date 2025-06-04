import express from 'express';
import { getProfile } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/user/me
// @desc    Get user profile
// @access  Private
router.get('/me', auth, getProfile);

export default router;