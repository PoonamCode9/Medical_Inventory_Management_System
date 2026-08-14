import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 font-sans">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-200 space-y-5">
        <div className="mx-auto w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center border border-rose-100">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            You do not have permission to view this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;