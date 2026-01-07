'use client';

import { Trash2, Edit, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const statusColors = {
    pending: 'badge-pending',
    'in-progress': 'badge-in-progress',
    completed: 'badge-completed',
  };

  const priorityColors = {
    low: 'badge-low',
    medium: 'badge-medium',
    high: 'badge-high',
  };

  const statusLabels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };

  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  return (
    <div className="card p-4 hover:shadow-md dark:hover:shadow-gray-800/50 transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-1 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={statusColors[task.status]}>
          {statusLabels[task.status]}
        </span>
        <span className={priorityColors[task.priority]}>
          {priorityLabels[task.priority]}
        </span>
        {task.dueDate && (
          <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </span>
          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(task._id, e.target.value as Task['status'])
            }
            className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
}
