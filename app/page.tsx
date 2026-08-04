import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12 bg-gradient-to-b from-amber-50 to-white">
      
      {/* Header (College Emblem & Name) */}
      <header className="w-full max-w-6xl flex items-center justify-between py-4 border-b border-amber-200">
        <div className="flex items-center gap-4">
          {/* College Emblem / Logo */}
          <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-md border-2 border-amber-900 bg-white flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="Tafari Makonnen Polytechnic College Emblem" 
              width={64} 
              height={64} 
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-amber-900">
              Tafari Makonnen Polytechnic College
            </h1>
            <p className="text-xs md:text-sm text-stone-600 font-medium">
              Student Grievance Management System (SGMS)
            </p>
          </div>
        </div>

        {/* Top Navigation Links */}
        <div className="flex gap-3">
          <Link 
            href="/admin/login" 
            className="text-xs md:text-sm font-semibold text-amber-800 hover:underline px-3 py-2"
          >
            Admin Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center my-auto max-w-3xl px-4 py-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 mb-6 leading-tight">
          Welcome to Tafari Makonnen Polytechnic College Grievance Portal
        </h2>
        <p className="text-stone-600 text-base md:text-lg mb-10 leading-relaxed">
          A secure and efficient digital system for students to submit and track grievances, and for administrators to provide timely resolutions.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/student" 
            className="px-8 py-3.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl shadow-lg font-medium transition duration-200 text-center"
          >
            Student Portal
          </Link>
          <Link 
            href="/admin/login" 
            className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-lg font-medium transition duration-200 text-center"
          >
            Admin Portal
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs md:text-sm text-stone-500 border-t border-amber-200">
        &copy; {new Date().getFullYear()} Tafari Makonnen Polytechnic College (SGMS). All rights reserved.
      </footer>
    </main>
  );
}