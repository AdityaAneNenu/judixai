const { db } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersCollection = db.collection('users');

const User = {
  // Create a new user
  async create(userData) {
    const { name, email, password } = userData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: '',
      bio: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await usersCollection.add(newUser);
    return { id: docRef.id, ...newUser };
  },

  // Find user by email
  async findByEmail(email) {
    const snapshot = await usersCollection
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  // Find user by ID
  async findById(id) {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  // Update user
  async findByIdAndUpdate(id, updateData) {
    updateData.updatedAt = new Date().toISOString();
    await usersCollection.doc(id).update(updateData);
    const updated = await this.findById(id);
    return updated;
  },

  // Compare password
  async matchPassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },

  // Generate JWT token
  getSignedJwtToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  },
};

module.exports = User;
