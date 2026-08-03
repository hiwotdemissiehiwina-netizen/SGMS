'use client';

import ChangePasswordModal from '@/components/ChangePasswordModal';
import { useState, useEffect } from 'react';

export default function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responseTexts, setResponseTexts] = useState<{ [key: string]: string }>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const fetchSuperAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/super');
      const result = await res.json();

      if (result.success) {
        setData(result);
      } else {
        setError(result.message || 'Failed to load Super Admin data');
      }
    } catch (err) {
      setError('Server connection error.');
    } fontally: {
      setLoading(false);
    }
  };

  const handleSuperResponse = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/grievances/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: newStatus,
          responseMessage: `[SUPER ADMIN RESPONSE]: ${responseTexts[id] || ''}`,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert('Grievance resolved by Super Admin successfully!');
        setResponseTexts((prev) => ({ ...prev, [id]: '' }));
        fetchSuperAdminData();
      } else {
        alert(result.message || 'Action failed.');
      }
    } catch (err) {
      alert('Error updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-[#70231D] font-bold">
        Checking Overdue Grievances & Loading Super Admin Panel...
      </div>
    );
  }

  const escalatedList = data?.grievances?.filter((g: any) => g.status === 'Escalated' || g.isEscalated) || [];
  const normalList = data?.grievances?.filter((g: any) => g.status !== 'Escalated' && !g.isEscalated) || [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#331411]">
      {/* Super Admin Top Banner */}
      <header className="bg-red-950 text-white p-5 shadow-xl border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                SUPER ADMIN
              </span>
              <h1 className="text-xl font-bold tracking-wide">
                TAFARI MAKONNEN POLYTECHNIC COLLEGE
              </h1>
            </div>
            <p className="text-xs text-red-200 mt-1">
              Central Oversight & SLA Escalation Dashboard
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchSuperAdminData}
              className="bg-red-800 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-md font-semibold transition"
            >
              🔄 Refresh Analytics
            </button>
            <a
              href="/admin/login"
              className="bg-gray-800 hover:bg-gray-900 text-white text-xs px-3 py-2 rounded-md font-semibold transition"
            >
              Logout
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center font-bold">
            {error}
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-xs text-gray-500 font-bold uppercase">Total Grievances</p>
            <p className="text-2xl font-black text-gray-800 mt-1">{data?.stats?.total || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm text-center">
            <p className="text-xs text-amber-700 font-bold uppercase">Pending</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{data?.stats?.pending || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm text-center">
            <p className="text-xs text-blue-700 font-bold uppercase">In Progress</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{data?.stats?.inProgress || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm text-center">
            <p className="text-xs text-emerald-700 font-bold uppercase">Resolved</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{data?.stats?.resolved || 0}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border-2 border-red-500 shadow-sm text-center col-span-2 md:col-span-1">
            <p className="text-xs text-red-700 font-bold uppercase">🚨 Escalated (3+ Days)</p>
            <p className="text-2xl font-black text-red-600 mt-1">{data?.stats?.escalated || 0}</p>
          </div>
        </div>

        {/* SECTION 1: ESCALATED GRIEVANCES (REQUIRES IMMEDIATE SUPER ADMIN ACTION) */}
        <section className="bg-red-50/50 border-2 border-red-300 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-red-200">
            <div>
              <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
                🚨 Escalated Grievances (Unanswered after 3 Days)
              </h2>
              <p className="text-xs text-red-700 mt-0.5">
                These grievances passed the 72-hour threshold without department resolution. Super Admin intervention required.
              </p>
            </div>
            <span className="bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded-full">
              {escalatedList.length} Critical
            </span>
          </div>

          {escalatedList.length === 0 ? (
            <div className="bg-white p-6 rounded-xl text-center text-emerald-700 border border-emerald-200 font-medium text-sm">
              ✅ Great news! No overdue grievances. All departments are responding within 3 days.
            </div>
          ) : (
            <div className="grid gap-4">
              {escalatedList.map((item: any) => (
                <div key={item._id} className="bg-white p-5 rounded-xl border-2 border-red-400 shadow-md">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded">
                        #{item.ticketId}
                      </span>
                      <span className="font-bold text-[#70231D] text-sm">
                        Dept: {item.departmentId?.name || 'Unassigned'}
                      </span>
                    </div>
                    <span className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full animate-pulse">
                      OVERDUE (3+ DAYS)
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Submitted Date: {new Date(item.createdAt).toLocaleDateString()} ({Math.floor((Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago)
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-800 mb-4">
                    {item.description}
                  </div>

                  {/* Super Admin Direct Intervention Box */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                    <input
                      type="text"
                      placeholder="Super Admin Direct Resolution / Warning note..."
                      value={responseTexts[item._id] || ''}
                      onChange={(e) =>
                        setResponseTexts({ ...responseTexts, [item._id]: e.target.value })
                      }
                      className="flex-1 p-2.5 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={() => handleSuperResponse(item._id, 'Resolved')}
                      disabled={updatingId === item._id}
                      className="bg-red-800 hover:bg-red-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition shadow-md disabled:opacity-50"
                    >
                      Override & Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2: ALL OTHER GRIEVANCES */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-[#70231D] mb-4 pb-2 border-b">
            All Active System Grievances
          </h2>
          <div className="grid gap-4">
            {normalList.map((item: any) => (
              <div key={item._id} className="p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-0.5 rounded">
                      #{item.ticketId}
                    </span>
                    <span className="text-xs font-bold text-[#9E7D47]">
                      {item.departmentId?.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-1">{item.description}</p>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>
        <ChangePasswordModal 
  isOpen={false} 
  onClose={() => {}} 
/>
      </main>
    </div>
  );
}