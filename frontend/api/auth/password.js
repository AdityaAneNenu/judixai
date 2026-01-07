const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Validation rules
const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

const runValidation = async (req, validations) => {
  for (let validation of validations) {
    await validation.run(req);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return {
      valid: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    };
  }
  return { valid: true };
};

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Check authentication
    const auth = await protect(req, res);
    if (!auth.authorized) {
      return res.status(401).json(auth.error);
    }

    // Validate request
    const validation = await runValidation(req, updatePasswordValidation);
    if (!validation.valid) {
      return res.status(400).json({ success: false, errors: validation.errors });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(auth.user.id);

    // Check current password
    const isMatch = await User.matchPassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(auth.user.id, { password: hashedPassword });

    // Generate new token
    const token = User.getSignedJwtToken(user.id);

    res.status(200).json({
      success: true,
      token,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
