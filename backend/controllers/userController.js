import db from '../db/index.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user data
    const user = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};