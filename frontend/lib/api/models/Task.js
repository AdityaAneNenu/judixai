const { db } = require('../config/db');

const tasksCollection = db.collection('tasks');

const Task = {
  // Create a new task
  async create(taskData) {
    const newTask = {
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      userId: taskData.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await tasksCollection.add(newTask);
    return { _id: docRef.id, ...newTask };
  },

  // Find tasks by user ID with filters
  async findByUser(userId, options = {}) {
    const { status, priority, search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = options;

    let query = tasksCollection.where('userId', '==', userId);

    // Get all tasks for the user first (Firestore limitation on complex queries)
    const snapshot = await query.get();
    
    let tasks = snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data(),
    }));

    // Apply filters in memory
    if (status && status !== 'all') {
      tasks = tasks.filter(task => task.status === status);
    }

    if (priority && priority !== 'all') {
      tasks = tasks.filter(task => task.priority === priority);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    tasks.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aVal = priorityOrder[aVal] || 0;
        bVal = priorityOrder[bVal] || 0;
      }
      
      if (order === 'desc') {
        return aVal > bVal ? -1 : 1;
      }
      return aVal < bVal ? -1 : 1;
    });

    // Pagination
    const total = tasks.length;
    const startIndex = (page - 1) * limit;
    const paginatedTasks = tasks.slice(startIndex, startIndex + limit);

    return {
      tasks: paginatedTasks,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  },

  // Find task by ID and user
  async findOne(taskId, userId) {
    const doc = await tasksCollection.doc(taskId).get();
    if (!doc.exists) return null;
    
    const task = { _id: doc.id, ...doc.data() };
    if (task.userId !== userId) return null;
    
    return task;
  },

  // Find task by ID
  async findById(taskId) {
    const doc = await tasksCollection.doc(taskId).get();
    if (!doc.exists) return null;
    return { _id: doc.id, ...doc.data() };
  },

  // Update task
  async findByIdAndUpdate(taskId, updateData) {
    updateData.updatedAt = new Date().toISOString();
    await tasksCollection.doc(taskId).update(updateData);
    return await this.findById(taskId);
  },

  // Delete task
  async findByIdAndDelete(taskId) {
    await tasksCollection.doc(taskId).delete();
    return true;
  },

  // Count tasks by user
  async countByUser(userId) {
    const snapshot = await tasksCollection.where('userId', '==', userId).get();
    return snapshot.size;
  },

  // Get task statistics
  async getStats(userId) {
    const snapshot = await tasksCollection.where('userId', '==', userId).get();
    
    const stats = {
      total: 0,
      byStatus: { pending: 0, 'in-progress': 0, completed: 0 },
      byPriority: { low: 0, medium: 0, high: 0 },
    };

    snapshot.docs.forEach(doc => {
      const task = doc.data();
      stats.total++;
      
      if (stats.byStatus[task.status] !== undefined) {
        stats.byStatus[task.status]++;
      }
      
      if (stats.byPriority[task.priority] !== undefined) {
        stats.byPriority[task.priority]++;
      }
    });

    return stats;
  },
};

module.exports = Task;
