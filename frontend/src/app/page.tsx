'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { CheckSquare, Shield, Zap, Users } from 'lucide-react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Judix</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
              >
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-16 pb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Manage Your Tasks
              <span className="block text-primary-600 dark:text-primary-500">Effortlessly</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A powerful task management application built with modern
              technologies. Stay organized, boost productivity, and achieve your
              goals.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="btn-primary px-8 py-3 text-base"
              >
                Start Free Today
              </Link>
              <Link
                href="/login"
                className="btn-secondary px-8 py-3 text-base"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-6 h-6 text-primary-600 dark:text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Task Management
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Create, organize, and track your tasks with ease. Set
                priorities and deadlines.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Secure Authentication
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                JWT-based authentication with password hashing to keep your data
                safe.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Fast & Responsive
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Built with Next.js and TailwindCSS for a blazing fast
                experience on any device.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                User Profiles
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Customize your profile and manage your account settings with
                ease.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2026 Judix. Built for the Full-Stack Developer Intern Assignment.
          </p>
        </div>
      </footer>
    </div>
  );
}
