import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiCheckSquare, FiCalendar } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 font-sans text-xs max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Your Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Review your active user account credentials and authorization role details.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl"></div>

        <div className="flex items-center space-x-5">
          <div className="h-16 w-16 rounded-2xl bg-teal-500/15 border border-teal-500/20 text-teal-400 flex items-center justify-center">
            <FiUser size={30} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">{user.firstName} {user.lastName}</h2>
            <p className="text-xs text-teal-400 font-bold tracking-wide uppercase mt-0.5">
              {user.role === 'ROLE_ADMIN' ? 'System Administrator' : user.role === 'ROLE_PHARMACIST' ? 'Pharmacist Staff' : 'Inventory Staff'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-850">
          <div className="space-y-1.5 p-4 bg-slate-950/40 rounded-2xl border border-slate-850/60 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center">
              <FiMail className="mr-1.5 text-teal-400" /> Registered Email
            </span>
            <span className="text-xs text-slate-200 font-semibold mt-1">{user.email}</span>
          </div>

          <div className="space-y-1.5 p-4 bg-slate-950/40 rounded-2xl border border-slate-850/60 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center">
              <FiPhone className="mr-1.5 text-teal-400" /> Phone Contact
            </span>
            <span className="text-xs text-slate-200 font-semibold mt-1">N/A</span>
          </div>

          <div className="space-y-1.5 p-4 bg-slate-950/40 rounded-2xl border border-slate-850/60 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center">
              <FiCheckSquare className="mr-1.5 text-teal-400" /> Account Status
            </span>
            <span className="text-xs text-emerald-400 font-bold mt-1 flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span> Active / Enabled
            </span>
          </div>

          <div className="space-y-1.5 p-4 bg-slate-950/40 rounded-2xl border border-slate-850/60 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center">
              <FiCalendar className="mr-1.5 text-teal-400" /> Portal Version
            </span>
            <span className="text-xs text-slate-200 font-semibold mt-1">MediStock v1.0.0-LTS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
