'use client';

import { useState, useEffect } from 'react';

interface Department {
  _id: string;
  name: string;
  code: string;
}

export default function StudentComplaintPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [reason, setReason] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. Fetch departments for select dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch('/api/departments');
        const data = await res.json();
        if (data.success || Array.isArray(data)) {
          setDepartments(data.departments || data);
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  // 2. Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!studentName || !studentId || !reason || !selectedDepartmentId) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          studentId,
          reason,
          departmentId: selectedDepartmentId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Your request has been submitted successfully.' });
        setStudentName('');
        setStudentId('');
        setReason('');
        setSelectedDepartmentId('');
      } else {
        setMessage({ type: 'error', text: data.message || 'An error occurred. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Unable to connect to the server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4efe6] flex items-center justify-center p-4">
      <div className="bg-[#faf7f2] border border-[#e6dcce] rounded-2xl shadow-lg p-8 max-w-lg w-full">
        
        <h1 className="text-2xl font-bold text-[#5c1d1d] text-center mb-2">
          Student Request / Complaint Form
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Please fill in your details and select the appropriate department.
        </p>

        {message && (
          <div
            className={`p-4 rounded-xl mb-4 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Abebe Kebede"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5c1d1d]"
              required
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. ETS1234/14"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5c1d1d]"
              required
            />
          </div>

          {/* Department Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Department
            </label>
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5c1d1d] bg-white"
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          {/* Reason / Complaint Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Reason / Complaint
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your request details here..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5c1d1d]"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5c1d1d] hover:bg-[#471515] text-white font-bold py-3 rounded-xl transition duration-200 shadow disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>

      </div>
    </div>
  );
}