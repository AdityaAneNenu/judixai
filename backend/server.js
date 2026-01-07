const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars FIRST before importing anything that uses them
dotenv.config();

const { db, admin } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Firebase is initialized when config/db.js is imported
console.log('Firebase Firestore initialized');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-frontend-domain.com' 
      : 'http://localhost:3000',
    credentials: true,
  })
);

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
