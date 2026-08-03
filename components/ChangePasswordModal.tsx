'use client';

import { useState, useEffect } from 'react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUsername?: string;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  defaultUsername = '',
}: ChangePasswordModalProps) {
  const [currentUsername, setCurrentUsername] = useState(defaultUsername);
  const [newUsername, setNewUsername] = useState(defaultUsername);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentUsername(defaultUsername);
    setNewUsername(defaultUsername);
  }, [defaultUsername]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUsername,
          newUsername: newUsername.trim(),
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Username & Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          onClose();
          setStatusMsg(null);
        }, 1500);
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Failed to update credentials.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Server connection failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-lg font-bold text-[#70231D]">⚙️ Update Account Credentials</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-xl"
          >
            ✕
          </button>
        </div>

        {statusMsg && (
          <div
            className={`mt-4 p-3 rounded-lg text-xs font-bold text-center ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Current Username</label>
            <input
              type="text"
              required
              value={currentUsername}
              onChange={(e) => setCurrentUsername(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9E7D47]"
              placeholder="Your current username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">New Username (Optional)</label>
            <input
              type="text"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9E7D47] bg-amber-50/30"
              placeholder="Enter new username if you want to change"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9E7D47]"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9E7D47]"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9E7D47]"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#70231D] text-white text-xs font-bold rounded-lg hover:bg-[#581b17] transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}