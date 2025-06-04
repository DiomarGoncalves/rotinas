import db from '../db/index.js';

// Create a routine
export const createRoutine = async (req, res) => {
  const { title, description, days, time, priority } = req.body;
  const userId = req.user.id;
  
  try {
    const newRoutine = await db.query(
      'INSERT INTO routines (user_id, title, description, days, time, priority) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, title, description, days, time, priority]
    );
    
    res.status(201).json(newRoutine.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all routines for a user
export const getRoutines = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const routines = await db.query(
      'SELECT * FROM routines WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json(routines.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single routine
export const getRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const routine = await db.query(
      'SELECT * FROM routines WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (routine.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found or not authorized' });
    }
    
    res.json(routine.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a routine
export const updateRoutine = async (req, res) => {
  const { title, description, days, time, priority, status } = req.body;
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    // Check if routine exists and belongs to user
    const routineExists = await db.query(
      'SELECT * FROM routines WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (routineExists.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found or not authorized' });
    }
    
    // Update routine
    const updatedRoutine = await db.query(
      'UPDATE routines SET title = $1, description = $2, days = $3, time = $4, priority = $5, status = $6 WHERE id = $7 AND user_id = $8 RETURNING *',
      [title, description, days, time, priority, status, id, userId]
    );
    
    res.json(updatedRoutine.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a routine
export const deleteRoutine = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    // Check if routine exists and belongs to user
    const routineExists = await db.query(
      'SELECT * FROM routines WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (routineExists.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found or not authorized' });
    }
    
    // Delete routine
    await db.query('DELETE FROM routines WHERE id = $1 AND user_id = $2', [id, userId]);
    
    res.json({ message: 'Routine deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};