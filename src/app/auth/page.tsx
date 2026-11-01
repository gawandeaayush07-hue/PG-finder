'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePersona } from '@/context/PersonaContext';
import { createClient } from '@/lib/supabase/client';
import { normalizePhone, phoneToAuthEmail } from '@/lib/phone';
import TurnstileWidget from '@/components/TurnstileWidget';

const COLLEGE_OPTIONS = [
  'Pimpri Chinchwad College of Engineering (PCCOE), Akurdi',
  'Dr. D. Y. Patil Institute of Technology, Pimpri',
  'DY Patil International University (DYPIU), Akurdi',
  'All India Shri Shivaji Memorial Society (AISSMS), Pune',
  'Other',
];

export default function AuthPage() {
  const { setRole } = usePersona();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const supabase = createClient();

  // Tab states
  const [activePortal, setActivePortal] = useState<'STUDENT' | 'OWNER'>('STUDENT');
  const [isLogin, setIsLogin] = useState(true);

  // Common login state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(COLLEGE_OPTIONS[0]);
  const [customCollege, setCustomCollege] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const resetFormAlerts = () => {
    setErrorMessage(null);
    setInfoMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetFormAlerts();

    const isPlaceholderMode =
      process.env.NODE_ENV === 'development' &&
      (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder'));

    if (isPlaceholderMode) {
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
      }, 800);
      return;
    }

    try {
      const trimmedInput = loginIdentifier.trim();
      let targetAuthEmail: string;

      if (trimmedInput.includes('@')) {
        // Direct email login (admin or existing test accounts)
        targetAuthEmail = trimmedInput.toLowerCase();
      } else {
        // Phone login -> normalize and map to hidden auth email
        const canonicalPhone = normalizePhone(trimmedInput);
        if (!canonicalPhone) {
          setErrorMessage('Please enter a valid 10-digit Indian mobile number or email address.');
          setIsLoading(false);
          return;
        }
        const derivedEmail = phoneToAuthEmail(canonicalPhone);
        if (!derivedEmail) {
          setErrorMessage('Invalid phone number format.');
          setIsLoading(false);
          return;
        }
        targetAuthEmail = derivedEmail;
      }

      // Client-side sign in with password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetAuthEmail,
        password: loginPassword,
      });

      if (error) {
        setErrorMessage('Invalid mobile number or password.');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Query authoritative profile for role redirection
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
    } catch (err: unknown) {
      console.error('Login error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetFormAlerts();

    // 1. Password confirmation check
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    // 2. Phone validation
    const canonicalPhone = normalizePhone(phone);
    if (!canonicalPhone) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      setIsLoading(false);
      return;
    }

    // 3. College selection
    const finalCollege =
      activePortal === 'STUDENT'
        ? selectedCollege === 'Other'
          ? customCollege.trim()
          : selectedCollege
        : undefined;

    if (activePortal === 'STUDENT' && !finalCollege) {
      setErrorMessage('Please specify your college or university name.');
      setIsLoading(false);
      return;
    }

    const isPlaceholderMode =
      process.env.NODE_ENV === 'development' &&
      (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder'));

    if (isPlaceholderMode) {
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
      // 4. Server-side registration via /api/auth/signup
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: canonicalPhone,
          password,
          role: activePortal,
          college: finalCollege,
          contactEmail: contactEmail.trim() || undefined,
          turnstileToken: turnstileToken || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || 'Failed to create account. Please check your details.');
        setIsLoading(false);
        return;
      }

      // 5. Automatic sign in with the derived auth email
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: result.authEmail,
        password,
      });

      if (loginError) {
        setInfoMessage('Account created! Please log in with your mobile number and password.');
        setIsLogin(true);
        setLoginIdentifier(canonicalPhone);
        setIsLoading(false);
        return;
      }

      if (loginData.session) {
        setRole(activePortal);
        if (redirectPath) {
          router.push(redirectPath);
        } else if (activePortal === 'OWNER') {
          router.push('/dashboard/owner');
        } else {
          router.push('/dashboard/student');
        }
      }
    } catch (err: unknown) {
      console.error('Signup error:', err);
      setErrorMessage('Network or server error during registration. Please try again.');
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
            resetFormAlerts();
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
            resetFormAlerts();
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
            {isLogin
              ? 'Enter your mobile number and password to access your portal.'
              : 'Create an account with your mobile number. No SMS OTP required.'}
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

        {/* LOGIN FORM */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#7A8F7A]">Mobile Number or Email</label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
                placeholder="e.g. 9876543210 or admin@pgfinder.com"
                autoComplete="username"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#7A8F7A]">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-deep-green hover:bg-primary text-on-primary font-bold text-sm py-3 rounded-lg shadow-sm transition-colors mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-400"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
            
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#7A8F7A]">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
                placeholder="Enter your full name"
              />
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#7A8F7A]">Mobile Number</label>
                <span className="text-[11px] text-emerald-700 font-medium">No SMS OTP required</span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sm text-zinc-500 font-medium">+91</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
                  placeholder="10-digit mobile number"
                  maxLength={14}
                />
              </div>
            </div>

            {/* College Dropdown for Students */}
            {activePortal === 'STUDENT' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#7A8F7A]">College / University</label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white cursor-pointer"
                >
                  {COLLEGE_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {selectedCollege === 'Other' && (
                  <input
                    type="text"
                    required
                    value={customCollege}
                    onChange={(e) => setCustomCollege(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
                    placeholder="Enter your college name"
                  />
                )}
              </div>
            )}

            {/* Optional Email */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#7A8F7A]">
                  {activePortal === 'OWNER' ? 'Contact Email (Optional)' : 'Email Address (Optional)'}
                </label>
                <span className="text-[11px] text-zinc-400">Optional</span>
              </div>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
                placeholder={activePortal === 'OWNER' ? 'e.g. owner@gmail.com' : 'e.g. you@example.com'}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#7A8F7A]">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#7A8F7A]">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>

            {/* Turnstile Security Check */}
            <TurnstileWidget
              onVerify={(token) => setTurnstileToken(token)}
              onError={() => setErrorMessage('Security check error. Please reload.')}
              onExpire={() => setTurnstileToken('')}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-deep-green hover:bg-primary text-on-primary font-bold text-sm py-3 rounded-lg shadow-sm transition-colors mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-400"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        {/* Toggle Login/Signup link */}
        <div className="text-center text-xs text-on-surface-variant pt-2 border-t border-outline-variant">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              resetFormAlerts();
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
