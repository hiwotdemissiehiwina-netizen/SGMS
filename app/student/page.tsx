'use client';

import { useState } from 'react';

export default function StudentPortalPage() {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
  
  // Form Data (Name እና ID ግዴታ አይደሉም)
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');
  const [error, setError] = useState('');

  // Track State
  const [searchTicketId, setSearchTicketId] = useState('');
  const [trackedTicket, setTrackedTicket] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // 1. Submit Grievance Function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedTicketId('');

    try {
      const res = await fetch('/api/student/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // ስም ካልተሞላ አውቶማቲክ Anonymous ይሆናል
          studentName: isAnonymous || !studentName.trim() ? 'Anonymous' : studentName,
          studentId: isAnonymous || !studentId.trim() ? 'N/A' : studentId,
          department,
          subject,
          message,
          isAnonymous: isAnonymous || !studentName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to submit grievance');

      setGeneratedTicketId(data.ticketId);
      setStudentName('');
      setStudentId('');
      setDepartment('');
      setSubject('');
      setMessage('');
      setIsAnonymous(false);

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // 2. Track Ticket Status Function
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTicketId.trim()) return;

    setSearchLoading(true);
    setSearchError('');
    setTrackedTicket(null);

    try {
      const res = await fetch(`/api/student/tickets?ticketId=${searchTicketId.trim()}`);
      const data = await res.json();

      if (!res.ok || !data.ticket) {
        throw new Error(data.message || 'Ticket not found. Please check your Ticket ID.');
      }

      setTrackedTicket(data.ticket);
    } catch (err: any) {
      setSearchError(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4efe6] p-4 md:p-8 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-[#faf7f2] border border-[#e6dcce] rounded-2xl shadow-md p-6 md:p-8 mt-4">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#5c1d1d]">
            Taferi Mekonnen Polytechnic College
          </h1>
          <p className="text-xs md:text-sm text-[#7a4f3b] font-medium mt-1">
            Student Grievance Management System (SGMS)
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#e6dcce] mb-6">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-3 text-center font-bold text-sm transition border-b-2 ${
              activeTab === 'submit'
                ? 'border-[#5c1d1d] text-[#5c1d1d]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Submit Grievance
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-3 text-center font-bold text-sm transition border-b-2 ${
              activeTab === 'track'
                ? 'border-[#5c1d1d] text-[#5c1d1d]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Track Grievance Status
          </button>
        </div>

        {/* TAB 1: SUBMIT GRIEVANCE */}
        {activeTab === 'submit' && (
          <div>
            {generatedTicketId && (
              <div className="mb-6 p-4 bg-green-50 border border-green-300 text-green-900 rounded-xl text-center">
                <p className="font-bold text-lg">✅ Grievance Submitted Successfully!</p>
                <p className="text-sm mt-1">Please save your unique Ticket ID to track progress:</p>
                <div className="inline-block bg-white border border-green-400 px-4 py-2 rounded-lg font-mono text-xl font-extrabold text-[#5c1d1d] mt-2 shadow-sm select-all">
                  {generatedTicketId}
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Optional Name & Student ID Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Full Name <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Leave blank for anonymous"
                    className="w-full px-4 py-2.5 border border-[#e6dcce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c1d1d] bg-white text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Student ID <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. TMPC/1234/15"
                    className="w-full px-4 py-2.5 border border-[#e6dcce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c1d1d] bg-white text-gray-800"
                  />
                </div>
              </div>

              {/* Target Department Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Target Department *</label>
                <select
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e6dcce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c1d1d] bg-white text-gray-800"
                >
                  <option value="">-- Select Department --</option>
                  <option value="Aesthetics">Aesthetics</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="ICT">ICT</option>
                  <option value="Textile & Garment">Textile & Garment</option>
                  <option value="Hotel & Tourism">Hotel & Tourism</option>
                  <option value="Automotive Technology">Automotive Technology</option>
                  <option value="Wood Work & Metal Technology">Wood Work & Metal Technology</option>
                  <option value="Business & Finance">Business & Finance</option>
                  <option value="Construction Technology">Construction Technology</option>
                  <option value="Urban Agriculture">Urban Agriculture</option>
                </select>
              </div>

              {/* Subject / Category Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Grievance Subject / Category *</label>
                <select
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e6dcce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c1d1d] bg-white text-gray-800"
                >
                  <option value="">-- Select Issue Category --</option>
                  <option value="Academic & Grading Issue">1. Academic & Grading Issue (የነጥብ/ውጤት ቅሬታ)</option>
                  <option value="ID Card & Registration">2. ID Card & Registration (የአይዲ እና የምዝገባ ሁኔታ)</option>
                  <option value="Department & Class Schedule">3. Department & Class Schedule (የክፍል እና የትምህርት ፕሮግራም)</option>
                  <option value="Facility & Classroom Maintenance">4. Facility & Classroom Maintenance (የክፍል እና የመሳሪያዎች ብልሽት)</option>
                  <option value="Administrative Delay">5. Administrative Delay (የአስተዳደር እና የሰነድ መዘግየት)</option>
                  <option value="Library & Learning Resources">6. Library & Learning Resources (የቤተ-መጽሐፍት አገልግሎት)</option>
                  <option value="Practical Workshop & Lab Equipment">7. Practical Workshop & Lab Equipment (የላቦራቶሪ/ወርክሾፕ ዕቃዎች)</option>
                  <option value="Staff & Instructor Conduct">8. Staff & Instructor Conduct (የመምህራን/ሰራተኞች አስተናጋጅነት)</option>
                  <option value="Student Welfare & Discipline">9. Student Welfare & Discipline (የተማሪዎች ደህንነት እና ስነ-ምግባር)</option>
                  <option value="Other General Inquiry">10. Other General Inquiry (ሌሎች አጠቃላይ ጥያቄዎች)</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Grievance Description *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue clearly..."
                  className="w-full px-4 py-2.5 border border-[#e6dcce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c1d1d] bg-white text-gray-800 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5c1d1d] hover:bg-[#471515] text-white py-3 rounded-xl font-bold transition shadow disabled:opacity-50 mt-2"
              >
                {loading ? 'Submitting...' : 'Submit Grievance'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: TRACK STATUS BY TICKET ID */}
        {activeTab === 'track' && (
          <div>
            <form onSubmit={handleTrack} className="flex gap-2 mb-6">
              <input
                type="text"
                required
                value={searchTicketId}
                onChange={(e) => setSearchTicketId(e.target.value)}
                placeholder="Enter Ticket ID (e.g. TMPC-8F32A)"
                className="flex-1 px-4 py-3 border border-[#e6dcce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c1d1d] bg-white text-gray-800 uppercase font-mono"
              />
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-[#5c1d1d] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#471515] transition disabled:opacity-50"
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </form>

            {searchError && (
              <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-xl text-center text-sm">
                {searchError}
              </div>
            )}

            {trackedTicket && (
              <div className="bg-white border border-[#e6dcce] rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-stone-400 font-mono block">Ticket ID: {trackedTicket.ticketId}</span>
                    <h3 className="font-bold text-gray-800 text-lg">{trackedTicket.subject}</h3>
                    <p className="text-xs text-gray-500 mt-1">Department: <b>{trackedTicket.department}</b></p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    trackedTicket.status === 'Resolved' ? 'bg-green-100 text-green-800 border border-green-300' :
                    trackedTicket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                    'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {trackedTicket.status}
                  </span>
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <p className="text-xs font-semibold text-stone-500 mb-1">Grievance Details:</p>
                  <p className="text-sm text-stone-700 whitespace-pre-line">{trackedTicket.message}</p>
                </div>

                {/* Staff Responses */}
                {trackedTicket.responses && trackedTicket.responses.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <h4 className="font-bold text-sm text-[#5c1d1d] mb-2">Official Responses:</h4>
                    <div className="space-y-2">
                      {trackedTicket.responses.map((res: any, index: number) => (
                        <div key={index} className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm">
                          <div className="flex justify-between text-xs text-stone-500 mb-1">
                            <span><b>{res.responderName || 'Department Staff'}</b></span>
                            <span>{new Date(res.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-stone-800">{res.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}