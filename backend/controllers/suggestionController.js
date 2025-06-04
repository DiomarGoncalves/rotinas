import db from '../db/index.js';

// Get suggestions based on profile
export const getSuggestions = async (req, res) => {
  try {
    const { profile } = req.query;
    
    let suggestions;
    
    if (profile) {
      // Get suggestions for specific profile
      suggestions = await db.query(
        'SELECT * FROM suggestions WHERE profile = $1',
        [profile]
      );
    } else {
      // Get all suggestions
      suggestions = await db.query('SELECT * FROM suggestions');
    }
    
    res.json(suggestions.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};