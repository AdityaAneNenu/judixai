const { admin } = require('../config/db');
const User = require('../models/User');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required',
      });
    }

    // Verify the Google ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists
    let user = await User.findByEmail(email);

    if (!user) {
      // Create new user with Google data
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: uid, // Use Firebase UID as password (won't be used for login)
        avatar: picture || '',
        googleId: uid,
      });
    }

    // Generate JWT token
    const token = User.getSignedJwtToken(user.id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid Google token',
    });
  }
};
