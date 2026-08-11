'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePersona } from '@/context/PersonaContext';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { role } = usePersona();
  const pathname = usePathname();

  const menuItems = [
    { name: 'My Dashboard', path: '/dashboard/student', icon: 'dashboard' },
    { name: 'Shortlisted PGs', path: '/dashboard/student/shortlist', icon: 'favorite' },
    { name: 'Reviews Hub', path: '/dashboard/student/reviews', icon: 'rate_review' },
    { name: 'Account Settings', path: '/dashboard/student/settings', icon: 'settings' },
  ];

  const isActive = (path: string) => pathname === path;

  // Role guard: check if user is in student mode or admin mode (which can access everything)
  if (role !== 'STUDENT' && role !== 'ADMIN') {
    return (
      <div className="w-full max-w-max-width mx-auto px-margin-mobile py-20 text-center">
        <div className="bg-white rounded-card p-8 border border-outline-variant shadow-level-1 max-w-[500px] mx-auto flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-6xl text-amber-500">lock</span>
          <h2 className="text-2xl font-bold text-primary">Student Dashboard</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            You are currently browsing as a <strong className="text-primary">{role}</strong>. 
            To view this dashboard, please log in or select the <strong>Student</strong> role from the switcher in the top right.
          </p>
          <Link 
            href="/auth"
            className="bg-deep-green text-on-primary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary transition-colors cursor-pointer"
          >
            Log In as Student
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-deep-green bg-surface-container-low">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Student Avatar"
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="font-bold text-primary text-sm">Aarav Malhotra</h3>
                <span className="text-[11px] text-on-surface-variant font-medium">IIT Delhi Student</span>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors font-medium cursor-pointer ${
                    isActive(item.path)
                      ? 'bg-light-sage/30 text-primary font-bold'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Dashboard Content */}
        <div className="lg:col-span-9">
          {children}
        </div>
      </div>
    </div>
  );
}
