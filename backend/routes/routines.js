import express from 'express';
import {
  createRoutine,
  getRoutines,
  getRoutine,
  updateRoutine,
  deleteRoutine
} from '../controllers/routineController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/routines
// @desc    Create a routine
// @access  Private
router.post('/', auth, createRoutine);

// @route   GET /api/routines
// @desc    Get all routines for a user
// @access  Private
router.get('/', auth, getRoutines);

// @route   GET /api/routines/:id
// @desc    Get a single routine
// @access  Private
router.get('/:id', auth, getRoutine);

// @route   PUT /api/routines/:id
// @desc    Update a routine
// @access  Private
router.put('/:id', auth, updateRoutine);

// @route   DELETE /api/routines/:id
// @desc    Delete a routine
// @access  Private
router.delete('/:id', auth, deleteRoutine);

export default router;