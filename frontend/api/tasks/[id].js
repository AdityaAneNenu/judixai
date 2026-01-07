const { protect } = require('../middleware/auth');
const Task = require('../models/Task');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
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

    // Extract task ID from URL path
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/');
    const taskId = pathParts[pathParts.length - 1];

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required',
      });
    }

    // Handle GET - Get single task
    if (req.method === 'GET') {
      const task = await Task.findOne(taskId, auth.user.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      return res.status(200).json({
        success: true,
        task,
      });
    }

    // Handle PUT - Update task
    if (req.method === 'PUT') {
      const { title, description, status, priority, dueDate } = req.body;

      // Check if task exists and belongs to user
      let task = await Task.findOne(taskId, auth.user.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      // Build update object
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (dueDate !== undefined) updateData.dueDate = dueDate;

      task = await Task.findByIdAndUpdate(taskId, updateData);

      return res.status(200).json({
        success: true,
        task,
      });
    }

    // Handle DELETE - Delete task
    if (req.method === 'DELETE') {
      const task = await Task.findOne(taskId, auth.user.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      await Task.findByIdAndDelete(taskId);

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('Task operation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
