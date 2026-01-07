const { protect } = require('../middleware/auth');
const Task = require('../models/Task');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Check authentication
    const auth = await protect(req, res);
    if (!auth.authorized) {
      return res.status(401).json(auth.error);
    }

    // Handle different methods
    if (req.method === 'GET') {
      const { status, priority, search, sortBy, order, page = 1, limit = 10 } = req.query;

      const result = await Task.findByUser(auth.user.id, {
        status,
        priority,
        search,
        sortBy,
        order,
        page: parseInt(page),
        limit: parseInt(limit),
      });

      return res.status(200).json({
        success: true,
        count: result.tasks.length,
        total: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        tasks: result.tasks,
      });
    }

    if (req.method === 'POST') {
      const { title, description, status, priority, dueDate } = req.body;

      // Basic validation
      if (!title || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Title is required',
        });
      }

      const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        userId: auth.user.id,
      });

      return res.status(201).json({
        success: true,
        task,
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('Tasks error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
