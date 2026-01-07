'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TaskFormData {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt?: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  task?: Task | null;
  mode: 'create' | 'edit';
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  task,
  mode,
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when task changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'pending',
        priority: task?.priority || 'medium',
        dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
      });
      setErrors({});
    }
  }, [isOpen, task]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot be more than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot be more than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        dueDate: formData.dueDate || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 dark:bg-black bg-opacity-75 dark:bg-opacity-80 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block w-full max-w-lg p-6 my-8 text-left align-middle bg-white dark:bg-[#1a1a1a] shadow-xl rounded-2xl transform transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {mode === 'create' ? 'Create New Task' : 'Edit Task'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-[#242424]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="label">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`input ${errors.title ? 'input-error' : ''}`}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`input resize-none ${
                  errors.description ? 'input-error' : ''
                }`}
                placeholder="Enter task description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="label">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Task['status'],
                    })
                  }
                  className="input"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="label">
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as Task['priority'],
                    })
                  }
                  className="input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="label">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="input"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Saving...'
                  : mode === 'create'
                  ? 'Create Task'
                  : 'Update Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
