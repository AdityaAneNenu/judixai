const { protect } = require('../../../lib/api/middleware/auth');
const Task = require('../../../lib/api/models/Task');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Check authentication
    const auth = await protect(req, res);
    if (!auth.authorized) return res.status(401).json(auth.error);

    const { params } = req.query;
    const route = params ? params.join('/') : '';

    // GET /api/tasks/stats
    if (route === 'stats' && req.method === 'GET') {
      const stats = await Task.getStats(auth.user.id);
      return res.status(200).json({ success: true, stats });
    }

    // GET /api/tasks/:id
    if (route && route !== 'stats' && req.method === 'GET') {
      const taskId = route;
      const task = await Task.findOne(taskId, auth.user.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      return res.status(200).json({ success: true, task });
    }

    // PUT /api/tasks/:id
    if (route && route !== 'stats' && req.method === 'PUT') {
      const taskId = route;
      const { title, description, status, priority, dueDate } = req.body;

      let task = await Task.findOne(taskId, auth.user.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (dueDate !== undefined) updateData.dueDate = dueDate;

      task = await Task.findByIdAndUpdate(taskId, updateData);
      return res.status(200).json({ success: true, task });
    }

    // DELETE /api/tasks/:id
    if (route && route !== 'stats' && req.method === 'DELETE') {
      const taskId = route;
      const task = await Task.findOne(taskId, auth.user.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      await Task.findByIdAndDelete(taskId);
      return res.status(200).json({ success: true, message: 'Task deleted successfully' });
    }

    // GET /api/tasks
    if (!route && req.method === 'GET') {
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

    // POST /api/tasks
    if (!route && req.method === 'POST') {
      const { title, description, status, priority, dueDate } = req.body;

      if (!title || title.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Title is required' });
      }

      const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        userId: auth.user.id,
      });

      return res.status(201).json({ success: true, task });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('Tasks error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};
