'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { tasksAPI } from '@/lib/api';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface Stats {
  total: number;
  byStatus: {
    pending: number;
    'in-progress': number;
    completed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await tasksAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompletionRate = () => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.byStatus.completed / stats.total) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card p-6 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="mt-1 text-primary-100 dark:text-primary-200">
              Here&apos;s an overview of your task progress
            </p>
          </div>
          <Link
            href="/dashboard/tasks"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-gray-100 transition-colors"
          >
            View All Tasks
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Tasks */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.total || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <ListTodo className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats?.byStatus.pending || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stats?.byStatus['in-progress'] || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats?.byStatus.completed || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress and Priority Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Completion Rate
            </h2>
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                {getCompletionRate()}%
              </span>
            </div>
            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-100 dark:bg-[#242424]">
              <div
                style={{ width: `${getCompletionRate()}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
              ></div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {stats?.byStatus.completed || 0} of {stats?.total || 0} tasks
            completed
          </p>
        </div>

        {/* Priority Breakdown */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Tasks by Priority
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">High Priority</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {stats?.byPriority.high || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 dark:bg-orange-400 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Medium Priority</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {stats?.byPriority.medium || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Low Priority</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {stats?.byPriority.low || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/tasks?openModal=true"
            className="flex items-center justify-center p-4 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            <ListTodo className="w-5 h-5 mr-2" />
            Create New Task
          </Link>
          <Link
            href="/dashboard/tasks?status=pending"
            className="flex items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
          >
            <Clock className="w-5 h-5 mr-2" />
            View Pending Tasks
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center justify-center p-4 bg-gray-100 dark:bg-[#242424] text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-[#2a2a2a] transition-colors"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
