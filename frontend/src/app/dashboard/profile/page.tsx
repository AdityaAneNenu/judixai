'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { User, Mail, FileText, Lock, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const validateProfile = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.length > 50) {
      errors.name = 'Name cannot be more than 50 characters';
    }
    if (bio.length > 200) {
      errors.bio = 'Bio cannot be more than 200 characters';
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors: Record<string, string> = {};
    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setProfileLoading(true);
    try {
      const response = await authAPI.updateProfile({ name, bio });
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setPasswordLoading(true);
    try {
      await authAPI.updatePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to update password';
      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Info Card */}
      <div className="card">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <User className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
            Profile Information
          </h2>
        </div>
        <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
          {/* Avatar Preview */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <span className="text-primary-700 dark:text-primary-400 font-bold text-2xl">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="label flex items-center">
              <User className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input ${profileErrors.name ? 'input-error' : ''}`}
              placeholder="Your name"
            />
            {profileErrors.name && (
              <p className="mt-1 text-sm text-red-600">{profileErrors.name}</p>
            )}
          </div>

          {/* Email (Read-only) */}
          <div>
            <label htmlFor="email" className="label flex items-center">
              <Mail className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="input bg-gray-50 dark:bg-[#141414] cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Email cannot be changed
            </p>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="label flex items-center">
              <FileText className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`input resize-none ${
                profileErrors.bio ? 'input-error' : ''
              }`}
              placeholder="Tell us about yourself"
            />
            <div className="flex justify-between mt-1">
              {profileErrors.bio ? (
                <p className="text-sm text-red-600 dark:text-red-400">{profileErrors.bio}</p>
              ) : (
                <span></span>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">{bio.length}/200</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profileLoading}
              className="btn-primary"
            >
              {profileLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Password Card */}
      <div className="card">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
            Change Password
          </h2>
        </div>
        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="label">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`input ${
                passwordErrors.currentPassword ? 'input-error' : ''
              }`}
              placeholder="••••••••"
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`input ${
                passwordErrors.newPassword ? 'input-error' : ''
              }`}
              placeholder="••••••••"
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`input ${
                passwordErrors.confirmPassword ? 'input-error' : ''
              }`}
              placeholder="••••••••"
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="btn-primary"
            >
              {passwordLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
