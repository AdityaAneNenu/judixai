const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return {
      authorized: false,
      error: {
        success: false,
        message: 'Not authorized to access this route',
      },
    };
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return {
        authorized: false,
        error: {
          success: false,
          message: 'User not found',
        },
      };
    }

    return {
      authorized: true,
      user: { id: user.id, ...user },
    };
  } catch (error) {
    return {
      authorized: false,
      error: {
        success: false,
        message: 'Not authorized to access this route',
      },
    };
  }
};
