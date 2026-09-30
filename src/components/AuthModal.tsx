'use client';

import React, { useState } from 'react';
import { UserRole } from '@/context/PersonaContext';
import { createClient } from '@/lib/supabase/client';

interface AuthModalProps {
  targetRole: UserRole;
  onSuccess: (role: UserRole) => void;
  onCancel: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ targetRole, onSuccess, onCancel }) => {
  const roleName = targetRole.charAt(0).toUpperCase() + targetRole.slice(1).toLowerCase();
  const supabase = createClient();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const isPlaceholderMode =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (isPlaceholderMode) {
      setTimeout(() => {
        setIsLoading(false);
        if (email.length >= 3 && password.length >= 4) {
          onSuccess(targetRole);
        } else {
          setError('Invalid credentials. Please enter a valid email and password (min 4 chars).');
        }
      }, 800);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('invalid login credentials')) {
          setError('Invalid credentials. Please check your email and password.');
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Verify user possesses the authorized role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const profileRole = (profile?.role as UserRole) || 'STUDENT';

        if (targetRole === 'ADMIN' && profileRole !== 'ADMIN') {
          setError('Access Denied: Your account does not have Administrator privileges.');
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        if (targetRole === 'OWNER' && profileRole !== 'OWNER' && profileRole !== 'ADMIN') {
          setError('Access Denied: Your account does not have Property Owner privileges.');
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        onSuccess(profileRole);
      }
    } catch (err: unknown) {
      console.error('Modal login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
                <label className="block text-sm font-semibold mb-1 text-deep-green" htmlFor="email">Email Address</label>
                <input 
                  id="email"
                  type="email" 
                  required
                  className="w-full border border-outline-variant rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-green text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-deep-green" htmlFor="password">Password</label>
                <input 
                  id="password"
                  type="password" 
                  required
                  className="w-full border border-outline-variant rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-green text-sm"
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
                  disabled={isLoading}
                  className="px-6 py-3 rounded-full font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 rounded-full font-bold bg-[#2E4A38] text-white hover:bg-[#1f3326] transition-colors shadow-sm cursor-pointer disabled:bg-zinc-400 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Verifying...
                    </>
                  ) : (
                    'Confirm Login'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
