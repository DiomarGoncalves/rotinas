import express from 'express';
import { getSuggestions } from '../controllers/suggestionController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/suggestions
// @desc    Get suggestions based on profile
// @access  Private
router.get('/', auth, getSuggestions);

export default router;