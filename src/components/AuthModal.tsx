'use client';

import React, { useState } from 'react';
import { UserRole } from '@/context/PersonaContext';

interface AuthModalProps {
  targetRole: UserRole;
  onSuccess: (role: UserRole) => void;
  onCancel: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ targetRole, onSuccess, onCancel }) => {
  const roleName = targetRole.charAt(0).toUpperCase() + targetRole.slice(1).toLowerCase();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.length >= 4 && password.length >= 4) {
      onSuccess(targetRole);
    } else {
      setError('Invalid credentials. Please enter a valid ID and password (min 4 chars).');
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-br from-[#e6f4e6] to-[#c6eac6] opacity-90"
        onClick={onCancel}
      />
      
      <div className="relative z-10 bg-white border border-outline-variant p-8 md:p-12 w-[90vw] max-w-[500px] shadow-level-2 text-center flex flex-col items-center gap-4 rounded-3xl">
        
        {step === 1 ? (
          <>
            <span className="material-symbols-outlined text-4xl text-amber-500 font-light">
              lock
            </span>
            
            <h2 className="text-2xl md:text-3xl font-bold text-deep-green tracking-tight">
              {roleName} Dashboard
            </h2>
            
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mt-2 mb-4 px-2">
              Please authenticate with your credentials to access the <strong>{roleName}</strong> portal.
            </p>
            
            <button 
              onClick={() => setStep(2)}
              className="bg-[#2E4A38] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#1f3326] transition-colors shadow-sm cursor-pointer"
            >
              Log In as {roleName}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-deep-green tracking-tight mb-2">
              Secure Login
            </h2>
            <p className="text-sm text-on-surface-variant mb-4">
              Enter your credentials for the <strong>{roleName}</strong> portal.
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full text-left">
              <div>
                <label className="block text-sm font-semibold mb-1 text-deep-green" htmlFor="userId">User ID</label>
                <input 
                  id="userId"
                  type="text" 
                  className="w-full border border-outline-variant rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="e.g., john_doe"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-deep-green" htmlFor="password">Password</label>
                <input 
                  id="password"
                  type="password" 
                  className="w-full border border-outline-variant rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {error && <p className="text-rose-600 text-xs font-semibold text-center">{error}</p>}
              
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-full font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 rounded-full font-bold bg-[#2E4A38] text-white hover:bg-[#1f3326] transition-colors shadow-sm cursor-pointer"
                >
                  Confirm Login
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
