'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Form states for Submitting Grievance
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [generatedTicketId, setGeneratedTicketId] = useState<string | null>(null);

  // States for Tracking Grievance
  const [trackTicketId, setTrackTicketId] = useState('');
  const [trackedGrievance, setTrackedGrievance] = useState<any>(null);
  const [trackError, setTrackError] = useState('');
  const [isTrackLoading, setIsTrackLoading] = useState(false);

  // Fetch departments on load
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch('/api/departments');
        const data = await res.json();
        if (data.success) {
          setDepartments(data.data);
        }
      } catch (err) {
        console.error('Failed to load departments', err);
      }
    }
    fetchDepartments();
  }, []);

  // Handle Form Submission
  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    setGeneratedTicketId(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/grievances/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departmentId: selectedDept,
          category,
          description,
          studentIdDetails: studentId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitMessage({ type: 'success', text: 'Your grievance has been submitted successfully!' });
        setGeneratedTicketId(data.data.ticketId);
        // Reset inputs
        setSelectedDept('');
        setCategory('');
        setDescription('');
        setStudentId('');
      } else {
        setSubmitMessage({ type: 'error', text: data.message || 'Failed to submit grievance.' });
      }
    } catch (err) {
      setSubmitMessage({ type: 'error', text: 'A network or server error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Tracking
  const handleTrackGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setTrackedGrievance(null);
    setIsTrackLoading(true);

    try {
      const res = await fetch(`/api/grievances/track?ticketId=${trackTicketId.trim()}`);
      const data = await res.json();

      if (data.success) {
        setTrackedGrievance(data.data);
      } else {
        setTrackError(data.message || 'Grievance ticket not found.');
      }
    } catch (err) {
      setTrackError('A network or server error occurred.');
    } finally {
      setIsTrackLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#331411]">
      {/* Header Bar */}
      <header className="bg-[#70231D] text-white p-6 shadow-md border-b-4 border-[#9E7D47]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            TAFARI MAKONNEN POLYTECHNIC COLLEGE
          </h1>
          <p className="text-xs md:text-sm text-[#9E7D47] font-semibold mt-1">
            Student Grievance Management System (SGMS) - Portal
          </p>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto p-4 md:p-8">
        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1.5 mb-8">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'submit'
                ? 'bg-[#70231D] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#70231D]'
            }`}
          >
            📝 Submit Grievance
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'track'
                ? 'bg-[#70231D] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#70231D]'
            }`}
          >
            🔍 Track Status
          </button>
        </div>

        {/* TAB 1: SUBMIT GRIEVANCE */}
        {activeTab === 'submit' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#70231D] mb-6 border-b pb-3">
              Grievance Submission Form
            </h2>

            {submitMessage && (
              <div
                className={`p-4 rounded-xl mb-6 text-sm font-semibold border ${
                  submitMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            {generatedTicketId && (
              <div className="p-5 bg-[#9E7D47]/10 border-2 border-[#9E7D47] rounded-xl mb-6 text-center">
                <p className="text-xs text-[#70231D] font-bold uppercase tracking-wider">
                  Your Ticket ID
                </p>
                <p className="text-2xl font-mono font-extrabold text-[#70231D] my-2">
                  {generatedTicketId}
                </p>
                <p className="text-xs text-gray-600">
                  ⚠️ Please save this Ticket ID! You can use it in the "Track Status" tab to check response updates.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmitGrievance} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Select Department <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9E7D47]"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Grievance Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9E7D47]"
                >
                  <option value="">-- Select Category --</option>
                  <option value="Academic">Academic</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Facilities">Facilities & Lab Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Student ID / Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., TMPC/1234/15 (Optional)"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9E7D47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please enter the details of your grievance here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9E7D47]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#70231D] hover:bg-[#581b17] text-white font-bold py-3.5 rounded-lg text-sm transition shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: TRACK STATUS */}
        {activeTab === 'track' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#70231D] mb-6 border-b pb-3">
              Track Grievance Status
            </h2>

            <form onSubmit={handleTrackGrievance} className="flex gap-3 mb-6">
              <input
                type="text"
                required
                placeholder="Enter Ticket ID (e.g. TMPC-10293)"
                value={trackTicketId}
                onChange={(e) => setTrackTicketId(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9E7D47]"
              />
              <button
                type="submit"
                disabled={isTrackLoading}
                className="bg-[#9E7D47] hover:bg-[#866839] text-white font-bold px-6 py-3 rounded-lg text-sm transition shadow-md disabled:opacity-50"
              >
                {isTrackLoading ? 'Searching...' : 'Search'}
              </button>
            </form>

            {trackError && (
              <div className="p-4 bg-red-50 text-red-800 rounded-xl text-sm font-semibold border border-red-200 text-center">
                {trackError}
              </div>
            )}

            {trackedGrievance && (
              <div className="border border-gray-200 rounded-xl p-5 bg-[#FDFBF7] space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Ticket ID</p>
                    <p className="font-mono font-bold text-[#70231D]">#{trackedGrievance.ticketId}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      trackedGrievance.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : trackedGrievance.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {trackedGrievance.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="font-semibold text-[#9E7D47]">
                    {trackedGrievance.departmentId?.name || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm bg-white p-3 rounded-lg border border-gray-200 text-gray-700">
                    {trackedGrievance.description}
                  </p>
                </div>

                {/* Responses section */}
                <div>
                  <p className="text-xs font-bold text-[#70231D] mb-2">Official Response(s):</p>
                  {trackedGrievance.responses && trackedGrievance.responses.length > 0 ? (
                    trackedGrievance.responses.map((resp: any, idx: number) => (
                      <div
                        key={idx}
                        className="text-xs bg-[#9E7D47]/10 p-3 rounded-lg mb-2 text-[#331411] border-l-4 border-[#9E7D47]"
                      >
                        {resp.message}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic bg-white p-3 rounded-lg border border-gray-100">
                      No response yet. Your grievance is currently under review.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}