'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePersona } from '@/context/PersonaContext';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage() {
  const { setRole } = usePersona();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const supabase = createClient();
  
  // Tab states
  const [activePortal, setActivePortal] = useState<'STUDENT' | 'OWNER'>('STUDENT');
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [extraField, setExtraField] = useState(''); // College for student, phone for owner
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    // Check if Supabase credentials are configured or in placeholder mode
    const isPlaceholderMode =
      process.env.NODE_ENV === 'development' &&
      (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder'));

    if (isPlaceholderMode) {
      // In local preview/development before Supabase project credentials are provided in .env.local
      setTimeout(() => {
        setIsLoading(false);
        setRole(activePortal);
        if (redirectPath) {
          router.push(redirectPath);
        } else if (activePortal === 'STUDENT') {
          router.push('/dashboard/student');
        } else {
          router.push('/dashboard/owner');
        }
      }, 1000);
      return;
    }

    try {
      if (isLogin) {
        // Real Supabase Email/Password Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.toLowerCase().includes('invalid login credentials')) {
            setErrorMessage('Invalid email or password. Please verify your credentials.');
          } else if (error.message.toLowerCase().includes('email not confirmed')) {
            setErrorMessage('Please confirm your email address before signing in.');
          } else {
            setErrorMessage(error.message);
          }
          setIsLoading(false);
          return;
        }

        if (data.user) {
          // Fetch authoritative profile to determine target portal
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          const authoritativeRole = profile?.role || activePortal;
          setRole(authoritativeRole as 'STUDENT' | 'OWNER' | 'ADMIN');

          if (redirectPath) {
            router.push(redirectPath);
          } else if (authoritativeRole === 'ADMIN') {
            router.push('/dashboard/admin');
          } else if (authoritativeRole === 'OWNER') {
            router.push('/dashboard/owner');
          } else {
            router.push('/dashboard/student');
          }
        }
      } else {
        // Real Supabase Signup with Role Protection
        // Role is strictly scoped to STUDENT or OWNER. ADMIN cannot be created via browser.
        const targetRole = activePortal === 'OWNER' ? 'OWNER' : 'STUDENT';

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: name,
              role: targetRole,
              phone: targetRole === 'OWNER' ? extraField : null,
              college_name: targetRole === 'STUDENT' ? extraField : null,
            },
          },
        });

        if (error) {
          if (error.message.toLowerCase().includes('user already registered')) {
            setErrorMessage('An account with this email already exists. Please log in.');
          } else if (error.message.toLowerCase().includes('password')) {
            setErrorMessage('Password is too weak. Please use at least 6 characters.');
          } else {
            setErrorMessage(error.message);
          }
          setIsLoading(false);
          return;
        }

        // If email confirmation is enabled on the Supabase project
        if (data.user && !data.session) {
          setInfoMessage('Account created! Please check your email to confirm your account before logging in.');
          setIsLoading(false);
          return;
        }

        if (data.session) {
          setRole(targetRole);
          if (redirectPath) {
            router.push(redirectPath);
          } else if (targetRole === 'OWNER') {
            router.push('/dashboard/owner');
          } else {
            router.push('/dashboard/student');
          }
        }
      }
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] mx-auto px-margin-mobile py-16 flex flex-col gap-6">
      
      {/* Selector Tabs for Portals */}
      <div className="flex border-b border-outline-variant">
        <button
          onClick={() => {
            setActivePortal('STUDENT');
            setIsLogin(true);
            setErrorMessage(null);
            setInfoMessage(null);
          }}
          className={`flex-1 text-center pb-3 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
            activePortal === 'STUDENT'
              ? 'border-deep-green text-primary'
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Student Portal
        </button>
        <button
          onClick={() => {
            setActivePortal('OWNER');
            setIsLogin(true);
            setErrorMessage(null);
            setInfoMessage(null);
          }}
          className={`flex-1 text-center pb-3 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
            activePortal === 'OWNER'
              ? 'border-deep-green text-primary'
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Property Owner Portal
        </button>
      </div>

      {/* Main Auth Container */}
      <div className="bg-white rounded-card p-6 md:p-8 shadow-level-1 border border-outline-variant flex flex-col gap-6">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="font-headline-md text-2xl font-bold text-primary mb-1">
            {activePortal === 'STUDENT' ? 'Student' : 'Owner'} {isLogin ? 'Log In' : 'Sign Up'}
          </h2>
          <p className="text-xs text-on-surface-variant">
            {isLogin ? 'Welcome back! Please enter your details.' : 'Create an account to get started.'}
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#7A8F7A]">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#7A8F7A]">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#7A8F7A]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#7A8F7A]">
                {activePortal === 'STUDENT' ? 'College / University Name' : 'Phone Number'}
              </label>
              <input
                type="text"
                required
                value={extraField}
                onChange={(e) => setExtraField(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
                placeholder={activePortal === 'STUDENT' ? 'e.g. IIT Delhi' : 'e.g. +91 99999 99999'}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-deep-green hover:bg-primary text-on-primary font-bold text-sm py-3 rounded-lg shadow-sm transition-colors mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-400"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              isLogin ? 'Log In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Toggle Login/Signup link */}
        <div className="text-center text-xs text-on-surface-variant pt-2 border-t border-outline-variant">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            className="font-bold text-deep-green hover:underline cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
