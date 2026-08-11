'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePersona, UserRole } from '@/context/PersonaContext';

export default function AuthPage() {
  const { setRole } = usePersona();
  const router = useRouter();
  
  // Tab states
  const [activePortal, setActivePortal] = useState<'STUDENT' | 'OWNER'>('STUDENT');
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [extraField, setExtraField] = useState(''); // College for student, phone for owner
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setRole(activePortal);
      
      if (activePortal === 'STUDENT') {
        router.push('/dashboard/student');
      } else {
        router.push('/dashboard/owner');
      }
    }, 1200); // Mock network request
  };

  return (
    <div className="w-full max-w-[500px] mx-auto px-margin-mobile py-16 flex flex-col gap-6">
      
      {/* Selector Tabs for Portals */}
      <div className="flex border-b border-outline-variant">
        <button
          onClick={() => {
            setActivePortal('STUDENT');
            setIsLogin(true);
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
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-deep-green hover:underline cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
