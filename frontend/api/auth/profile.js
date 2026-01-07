const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Validation rules
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Name cannot be more than 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Bio cannot be more than 200 characters'),
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
    const validation = await runValidation(req, updateProfileValidation);
    if (!validation.valid) {
      return res.status(400).json({ success: false, errors: validation.errors });
    }

    const { name, bio, avatar } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(auth.user.id, updateData);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
