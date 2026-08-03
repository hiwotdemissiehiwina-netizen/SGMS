'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RequestItem {
  _id: string;
  studentId: string;
  reason?: string;
  description?: string;
  details?: string;
  status: string;
  createdAt?: string;
}

export default function DepartmentAdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem('adminUsername');
    const role = localStorage.getItem('adminRole');
    const deptData = localStorage.getItem('adminDepartment');

    if (!username) {
      router.push('/admin/login');
      return;
    }

    let parsedDept = null;
    if (deptData) {
      try {
        parsedDept = JSON.parse(deptData);
      } catch (e) {
        console.error('Error parsing department data:', e);
      }
    }

    setAdmin({ username, role, department: parsedDept });

    if (parsedDept && parsedDept._id) {
      fetchDepartmentRequests(parsedDept._id);
    } else {
      setLoading(false);
    }
  }, [router]);

  const fetchDepartmentRequests = async (deptId: string) => {
    try {
      const res = await fetch(`/api/admin/requests?departmentId=${deptId}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  // Status የመቀየሪያ function
  const handleStatusChange = async (requestId: string, newStatus: string) => {
    setUpdatingId(requestId);
    try {
      const res = await fetch('/api/admin/requests/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // በ UI ላይ ወዲያው እንዲቀየር ማድረግ
        setRequests((prev) =>
          prev.map((req) => (req._id === requestId ? { ...req, status: newStatus } : req))
        );
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Something went wrong while updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4efe6]">
        <p className="text-lg font-semibold text-[#5c1d1d]">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4efe6] p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="bg-[#faf7f2] border border-[#e6dcce] rounded-2xl p-6 shadow-md flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#5c1d1d]">
              {admin?.department?.name ? `${admin.department.name} Department` : 'Department Admin'}
            </h1>
            <p className="text-sm text-[#7a4f3b] font-medium mt-1">
              Welcome back, <span className="font-bold">{admin?.username}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-[#5c1d1d] hover:bg-[#471515] text-white px-5 py-2.5 rounded-xl font-medium transition text-sm shadow"
          >
            Logout
          </button>
        </header>

        {/* Requests Table */}
        <div className="bg-[#faf7f2] border border-[#e6dcce] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[#5c1d1d] mb-4">
            Submitted Student Requests ({requests.length})
          </h2>

          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No requests submitted for this department yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e6dcce] text-[#7a4f3b] text-sm uppercase">
                    <th className="p-3 w-1/4">Student ID</th>
                    <th className="p-3 w-1/2">Reason / Complaint</th>
                    <th className="p-3 w-1/4">Status / Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((item) => (
                    <tr key={item._id} className="border-b border-gray-200 hover:bg-[#f0e8dc] transition">
                      <td className="p-3 font-semibold text-gray-800 font-mono">
                        {item.studentId || 'N/A'}
                      </td>
                      <td className="p-3 text-gray-700">
                        {item.reason || item.description || item.details || 'N/A'}
                      </td>
                      <td className="p-3">
                        <select
                          value={item.status}
                          disabled={updatingId === item._id}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border focus:outline-none transition cursor-pointer ${
                            item.status === 'Approved' || item.status === 'approved'
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : item.status === 'Rejected' || item.status === 'rejected'
                              ? 'bg-red-100 text-red-800 border-red-300'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="Approved">Approve</option>
                          <option value="Rejected">Reject</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}