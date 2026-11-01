'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { normalizePhone } from '@/lib/phone';
import { RECOVERY_QUESTIONS, MIN_PASSWORD_LENGTH } from '@/lib/recovery-questions';

type Method = 'RECOVERY_CODE' | 'SECURITY_ANSWER' | 'ADMIN_CODE';

const METHODS: { key: Method; label: string }[] = [
  { key: 'RECOVERY_CODE', label: 'Recovery code' },
  { key: 'SECURITY_ANSWER', label: 'Security question' },
  { key: 'ADMIN_CODE', label: 'Code from admin' },
];

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<Method>('RECOVERY_CODE');
  const [code, setCode] = useState('');
  const [question, setQuestion] = useState<string>(RECOVERY_QUESTIONS[0].key);
  const [answer, setAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const clearAlerts = () => {
    setErrorMessage(null);
    setInfoMessage(null);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    const canonicalPhone = normalizePhone(phone);
    if (!canonicalPhone) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`New password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('The two passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/recovery/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: canonicalPhone,
          method,
          code: method === 'SECURITY_ANSWER' ? undefined : code,
          question: method === 'SECURITY_ANSWER' ? question : undefined,
          answer: method === 'SECURITY_ANSWER' ? answer : undefined,
          newPassword,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || 'Could not reset the password. Please try again.');
        return;
      }

      setDone(true);
    } catch (err: unknown) {
      console.error('Reset error:', err);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="w-full max-w-[500px] mx-auto px-margin-mobile py-16">
        <div className="bg-white rounded-card p-6 md:p-8 shadow-level-1 border border-outline-variant flex flex-col gap-4 text-center">
          <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
          <h2 className="font-headline-md text-2xl font-bold text-primary">Password changed</h2>
          <p className="text-xs text-on-surface-variant">
            You can now log in with your mobile number and your new password.
          </p>
          <Link
            href="/auth"
            className="w-full bg-deep-green hover:bg-primary text-on-primary font-bold text-sm py-3 rounded-lg shadow-sm transition-colors"
          >
            Go to Log In
          </Link>
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white';

  return (
    <div className="w-full max-w-[500px] mx-auto px-margin-mobile py-16">
      <div className="bg-white rounded-card p-6 md:p-8 shadow-level-1 border border-outline-variant flex flex-col gap-5">
        <div className="text-center">
          <h2 className="font-headline-md text-2xl font-bold text-primary mb-1">Forgot password</h2>
          <p className="text-xs text-on-surface-variant">
            Enter your mobile number, pick a way to prove it is you, then choose a new password.
          </p>
        </div>

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

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#7A8F7A]">Mobile Number</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-sm text-zinc-500 font-medium">+91</span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`${inputClass} pl-12`}
                placeholder="10-digit mobile number"
                maxLength={14}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Method tabs */}
          <div className="grid grid-cols-3 gap-1 bg-[#F3FAF1] p-1 rounded-lg">
            {METHODS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => {
                  setMethod(m.key);
                  clearAlerts();
                }}
                className={`text-[11px] md:text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer ${
                  method === m.key ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Method-specific fields */}
          {method === 'RECOVERY_CODE' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#7A8F7A]">Recovery code from signup</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`${inputClass} font-mono tracking-wider uppercase`}
                placeholder="XXXX-XXXX-XXXX"
                autoComplete="off"
              />
            </div>
          )}

          {method === 'SECURITY_ANSWER' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#7A8F7A]">
                Pick the question you chose at signup
              </label>
              <select
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {RECOVERY_QUESTIONS.map((q) => (
                  <option key={q.key} value={q.key}>
                    {q.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={inputClass}
                placeholder="Your answer"
                autoComplete="off"
              />
            </div>
          )}

          {method === 'ADMIN_CODE' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#7A8F7A]">One-time code from the admin</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`${inputClass} font-mono tracking-wider uppercase`}
                placeholder="XXXX-XXXX"
                autoComplete="off"
              />
              <p className="text-[11px] text-zinc-500">
                No code yet? Use the &quot;Contact the admin for help&quot; button below and tell the admin your mobile number. The code works
                for 24 hours, one time.
              </p>
            </div>
          )}

          {/* New password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#7A8F7A]">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
              autoComplete="new-password"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#7A8F7A]">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-deep-green hover:bg-primary text-on-primary font-bold text-sm py-3 rounded-lg shadow-sm transition-colors mt-1 flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-400"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Changing password...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </form>

        {/* Ask the admin */}
        <div className="border-t border-outline-variant pt-4 flex flex-col gap-2 text-center">
          <p className="text-xs text-on-surface-variant">
            Lost your recovery code and forgot your answer too?
          </p>
          <Link
            href="/contact?topic=password"
            className="block w-full border border-deep-green text-deep-green font-bold text-sm py-2.5 rounded-lg hover:bg-[#F3FAF1] transition-colors"
          >
            Contact the admin for help
          </Link>
        </div>

        <div className="text-center text-xs text-on-surface-variant">
          <Link href="/auth" className="font-bold text-deep-green hover:underline">
            Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
