'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // መረጃዎችን LocalStorage ላይ መያዝ
        localStorage.setItem('adminUsername', data.admin.username);
        localStorage.setItem('adminRole', data.admin.role);
        if (data.admin.department) {
          localStorage.setItem('adminDepartment', JSON.stringify(data.admin.department));
        }

        // Role-አቸውን አይቶ Redirect ማድረግ
        if (data.admin.role === 'super_admin') {
          router.push('/admin/super');
        } else {
          router.push('/admin');
        }
      } else {
        setError(data.message || 'Invalid username or password!');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4efe6] px-4">
      <div className="w-full max-w-md bg-[#faf7f2] rounded-2xl shadow-xl border border-[#e6dcce] p-8">
        
        {/* Header Section */}
        <div className="text-center flex flex-col items-center mb-6">
          <div className="w-24 h-24 mb-3 flex items-center justify-center">
            <img 
              src="/logo.jpg" 
              alt="Tafari Makonnen Polytechnic College" 
              className="max-h-20 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-lg font-bold text-[#5c1d1d] tracking-wide">
            ተፈራ መኮንን ፖሊ ቴክኒክ ኮሌጅ
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7a4f3b] mt-1">
            Tafari Makonnen Polytechnic College
          </p>
          <div className="w-12 h-1 bg-[#7a4f3b] my-3 rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-800">
            System Admin Login
          </h2>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5c1d1d] mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#d4c5b9] rounded-lg focus:ring-2 focus:ring-[#5c1d1d] focus:outline-none text-gray-800 text-sm"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5c1d1d] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#d4c5b9] rounded-lg focus:ring-2 focus:ring-[#5c1d1d] focus:outline-none text-gray-800 text-sm"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5c1d1d] hover:bg-[#471515] text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 shadow-md disabled:opacity-50 text-sm uppercase tracking-wider mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}