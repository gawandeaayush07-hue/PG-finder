'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePersona } from '@/context/PersonaContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role, profile, isLoadingAuth, requestRoleChange } = usePersona();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Admin Overview', path: '/dashboard/admin', icon: 'admin_panel_settings' },
    { name: 'Verification Pipeline', path: '/dashboard/admin/verification', icon: 'verified_user' },
    { name: 'Reports & Flags', path: '/dashboard/admin/reports', icon: 'gavel' },
  ];

  const isActive = (path: string) => pathname === path;

  // Prevent flicker during initial session load
  if (isLoadingAuth) {
    return (
      <div className="w-full max-w-max-width mx-auto px-margin-mobile py-28 text-center flex flex-col items-center justify-center gap-3">
        <span className="w-8 h-8 border-3 border-deep-green border-t-transparent rounded-full animate-spin"></span>
        <span className="text-xs text-on-surface-variant font-medium">Verifying authorization...</span>
      </div>
    );
  }

  // Role guard: check if user is in admin mode
  if (role !== 'ADMIN') {
    return (
      <div className="w-full max-w-max-width mx-auto px-margin-mobile py-20 text-center">
        <div className="bg-white rounded-card p-8 border border-outline-variant shadow-level-1 max-w-[500px] mx-auto flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-6xl text-rose-600">lock</span>
          <h2 className="text-2xl font-bold text-primary">Admin Portal</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            You are currently browsing as a <strong className="text-primary">{role}</strong>. 
            To view this portal, please log in as an authorized administrator.
          </p>
          <button
            onClick={() => requestRoleChange('ADMIN')}
            className="bg-[#2E4A38] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#1f3326] transition-colors shadow-sm cursor-pointer"
          >
            Admin Login
          </button>
        </div>
      </div>
    );
  }

  const adminName = profile?.full_name || 'System Admin';
  const avatarUrl = profile?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80';

  return (
    <div className="w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-deep-green bg-surface-container-low">
                <img
                  src={avatarUrl}
                  alt="Admin Avatar"
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="font-bold text-primary text-sm">{adminName}</h3>
                <span className="text-[11px] text-on-surface-variant font-medium">Full Access Mode</span>
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
