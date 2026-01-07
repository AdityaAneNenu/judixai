const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { admin } = require('../../../lib/api/config/db');
const { protect } = require('../../../lib/api/middleware/auth');
const User = require('../../../lib/api/models/User');

// Validation helper
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

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('email').trim().notEmpty().isEmail().withMessage('Valid email required'),
  body('password').notEmpty().isLength({ min: 6 }).withMessage('Password min 6 chars'),
];

const loginValidation = [
  body('email').trim().notEmpty().isEmail(),
  body('password').notEmpty(),
];

const updateProfileValidation = [
  body('name').optional().trim().isLength({ max: 50 }),
  body('bio').optional().trim().isLength({ max: 200 }),
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty(),
  body('newPassword').notEmpty().isLength({ min: 6 }),
];

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { path } = req.query;
    const route = path ? path.join('/') : '';

    // Register
    if (route === 'register' && req.method === 'POST') {
      const validation = await runValidation(req, registerValidation);
      if (!validation.valid) {
        return res.status(400).json({ success: false, errors: validation.errors });
      }

      const { name, email, password } = req.body;
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const user = await User.create({ name, email, password });
      const token = User.getSignedJwtToken(user.id);

      return res.status(201).json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio },
      });
    }

    // Login
    if (route === 'login' && req.method === 'POST') {
      const validation = await runValidation(req, loginValidation);
      if (!validation.valid) {
        return res.status(400).json({ success: false, errors: validation.errors });
      }

      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      if (!user || !(await User.matchPassword(password, user.password))) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = User.getSignedJwtToken(user.id);
      return res.status(200).json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio },
      });
    }

    // Get Me
    if (route === 'me' && req.method === 'GET') {
      const auth = await protect(req, res);
      if (!auth.authorized) return res.status(401).json(auth.error);

      const user = await User.findById(auth.user.id);
      return res.status(200).json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, createdAt: user.createdAt },
      });
    }

    // Update Profile
    if (route === 'profile' && req.method === 'PUT') {
      const auth = await protect(req, res);
      if (!auth.authorized) return res.status(401).json(auth.error);

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
      return res.status(200).json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio },
      });
    }

    // Update Password
    if (route === 'password' && req.method === 'PUT') {
      const auth = await protect(req, res);
      if (!auth.authorized) return res.status(401).json(auth.error);

      const validation = await runValidation(req, updatePasswordValidation);
      if (!validation.valid) {
        return res.status(400).json({ success: false, errors: validation.errors });
      }

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(auth.user.id);

      if (!(await User.matchPassword(currentPassword, user.password))) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await User.findByIdAndUpdate(auth.user.id, { password: hashedPassword });

      const token = User.getSignedJwtToken(user.id);
      return res.status(200).json({ success: true, token, message: 'Password updated successfully' });
    }

    // Google Auth
    if (route === 'google' && req.method === 'POST') {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ success: false, message: 'ID token is required' });
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid, email, name, picture } = decodedToken;

      let user = await User.findByEmail(email);
      if (!user) {
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          password: uid,
          avatar: picture || '',
          googleId: uid,
        });
      }

      const token = User.getSignedJwtToken(user.id);
      return res.status(200).json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio },
      });
    }

    return res.status(404).json({ success: false, message: 'Route not found' });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};
