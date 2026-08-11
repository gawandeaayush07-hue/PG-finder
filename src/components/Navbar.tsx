'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { usePersona, UserRole } from '@/context/PersonaContext';
import { Magnetic } from '@/components/animations/Magnetic';

export const Navbar: React.FC = () => {
  const { role, requestRoleChange } = usePersona();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    requestRoleChange(newRole);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    
    // Redirect to the dashboard corresponding to the role
    if (newRole === 'GUEST') {
      router.push('/');
    } else if (newRole === 'STUDENT') {
      router.push('/dashboard/student');
    } else if (newRole === 'OWNER') {
      router.push('/dashboard/owner');
    } else if (newRole === 'ADMIN') {
      router.push('/dashboard/admin');
    }
  };

  const getRoleColor = (r: UserRole) => {
    switch (r) {
      case 'STUDENT': return 'bg-emerald-500 text-white';
      case 'OWNER': return 'bg-blue-600 text-white';
      case 'ADMIN': return 'bg-rose-600 text-white';
      default: return 'bg-zinc-500 text-white';
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-surface/70 backdrop-blur-md border-b border-outline-variant shadow-level-1">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto h-20">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-sm group">
          <img
            alt="PGFinder Logo"
            className="h-10 w-10 object-contain rounded-md transition-transform group-hover:scale-105 duration-300"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf9bUL-b_6c920ovxs7Oq9hn9LodkhS4NyiOU7BilW79IG9SoeFaEWX09IP6rYjORMJLpHX6SPrc5xjxXt3WOOwCgMdt6ll_KFvHUSKhLjkr-A94ypDh6nOEo2hKedJJUK_7TwFLHO7O8dPbgKcA66AR3btZ5wmr1imRM4asUrBLcyli4HYUf3Vd_b1syCDodBDJnIjdswe7FLHIoIxcb8FJ7Jl3JkUfLYKaT47RU6AW0lVf_IIm6S"
          />
          <span className="font-headline-md text-headline-md font-bold text-primary">
            PGFinder
          </span>
        </Link>

        {/* Desktop Links depending on Role */}
        <div className="hidden md:flex items-center gap-lg">
          {(role === 'GUEST' || role === 'STUDENT') && (
            <>
              <Link 
                href="/" 
                className={`font-label-md text-label-md px-3 py-2 rounded-md transition-colors ${
                  isActive('/') ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/search" 
                className={`font-label-md text-label-md px-3 py-2 rounded-md transition-colors ${
                  isActive('/search') ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                Find a PG
              </Link>
              <Link 
                href="/about" 
                className={`font-label-md text-label-md px-3 py-2 rounded-md transition-colors ${
                  isActive('/about') ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                Contact
              </Link>
              {role === 'STUDENT' && (
                <>
                  <Link 
                    href="/dashboard/student/shortlist" 
                    className={`font-label-md text-label-md px-3 py-2 rounded-md transition-colors ${
                      isActive('/dashboard/student/shortlist') ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                    }`}
                  >
                    Shortlist
                  </Link>
                  <Link 
                    href="/dashboard/student" 
                    className={`font-label-md text-label-md px-3 py-2 rounded-md transition-colors ${
                      pathname.startsWith('/dashboard/student') && !pathname.endsWith('shortlist') ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                    }`}
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </>
          )}

          {role === 'OWNER' && (
            <>
              <Link 
                href="/dashboard/owner" 
                className={`font-label-md text-label-md px-3 py-2 rounded-md transition-colors ${
                  isActive('/dashboard/owner') ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                Analytics Dashboard
              </Link>
              <Link 
                href="/dashboard/owner/listings" 
                className={`font-label-md text-label-md px-3 py-2 rounded-md transition-colors ${
                  isActive('/dashboard/owner/listings') ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                My Listings
              </Link>
              <Link 
                href="/dashboard/owner/calendar" 
                className={`font-label-md text-label-md px-3 py-2 rounded-md transition-colors ${
                  isActive('/dashboard/owner/calendar') ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                Tour Calendar
              </Link>
              <Link 
                href="/dashboard/owner/meetings" 
                className={`font-label-md text-label-md px-3 py-2 rounded-md transition-colors ${
                  isActive('/dashboard/owner/meetings') ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                Requests
              </Link>
            </>
          )}

          {role === 'ADMIN' && (
            <>
              <Link 
                href="/dashboard/admin" 
                className={`font-label-md text-label-md px-3 py-2 rounded-md transition-colors ${
                  isActive('/dashboard/admin') ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                Overview
              </Link>
              <Link 
                href="/dashboard/admin/verification" 
                className={`font-label-md text-label-md px-3 py-2 rounded-md transition-colors ${
                  isActive('/dashboard/admin/verification') ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                Verification Pipeline
              </Link>
              <Link 
                href="/dashboard/admin/reports" 
                className={`font-label-md text-label-md px-3 py-2 rounded-md transition-colors ${
                  isActive('/dashboard/admin/reports') ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                Reports
              </Link>
            </>
          )}
        </div>

        {/* Right Side: Role Selector (Persona Switcher) & Profile / Actions */}
        <div className="flex items-center gap-md relative">
          
          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B8D9B0] bg-white hover:bg-surface-container-low transition-colors shadow-sm cursor-pointer"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${role === 'GUEST' ? 'bg-zinc-400' : role === 'STUDENT' ? 'bg-emerald-500' : role === 'OWNER' ? 'bg-blue-600' : 'bg-rose-500'}`}></span>
              <span className="text-xs font-semibold text-deep-green hidden sm:inline">Role: {role}</span>
              <span className="material-symbols-outlined text-[16px] text-deep-green" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-outline-variant rounded-xl shadow-level-2 overflow-hidden py-1 z-50">
                <div className="px-3 py-1.5 text-xs text-outline-variant font-bold border-b border-outline-variant">
                  SWITCH PERSONA
                </div>
                {(['GUEST', 'STUDENT', 'OWNER', 'ADMIN'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-container-low transition-colors flex items-center gap-2 cursor-pointer ${
                      role === r ? 'font-semibold text-primary bg-light-sage/25' : 'text-on-surface'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${r === 'GUEST' ? 'bg-zinc-400' : r === 'STUDENT' ? 'bg-emerald-500' : r === 'OWNER' ? 'bg-blue-600' : 'bg-rose-500'}`}></span>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons based on status */}
          {role === 'GUEST' ? (
            <div className="hidden md:flex items-center gap-md">
              <Link href="/auth" className="text-primary font-label-md text-label-md hover:text-primary-container transition-colors font-medium">
                Log In
              </Link>
              <Magnetic>
                <Link href="/auth" className="bg-deep-green text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-full hover:bg-primary transition-colors hover:scale-95 duration-150 ease-in-out font-medium inline-block">
                  Sign Up
                </Link>
              </Magnetic>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-deep-green hidden sm:block">
                <img
                  src={
                    role === 'STUDENT'
                      ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80'
                      : role === 'OWNER'
                      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80'
                      : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80'
                  }
                  alt="User Avatar"
                  className="object-cover w-full h-full"
                />
              </div>
              <button 
                onClick={() => handleRoleChange('GUEST')} 
                className="text-xs font-semibold text-rose-600 hover:underline px-2 py-1 cursor-pointer"
              >
                Log out
              </button>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden text-primary p-2 focus:outline-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 0" }}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant px-margin-mobile py-4 flex flex-col gap-4 shadow-level-2 absolute left-0 right-0 z-40">
          {(role === 'GUEST' || role === 'STUDENT') && (
            <>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-on-surface font-medium py-1">Home</Link>
              <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="text-on-surface font-medium py-1">Find a PG</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-on-surface font-medium py-1">Contact</Link>
              {role === 'STUDENT' && (
                <>
                  <Link href="/dashboard/student/shortlist" onClick={() => setMobileMenuOpen(false)} className="text-on-surface font-medium py-1">Shortlist</Link>
                  <Link href="/dashboard/student" onClick={() => setMobileMenuOpen(false)} className="text-on-surface font-medium py-1">Dashboard</Link>
                </>
              )}
            </>
          )}

          {role === 'OWNER' && (
            <>
              <Link href="/dashboard/owner" onClick={() => setMobileMenuOpen(false)} className="text-on-surface font-medium py-1">Owner Dashboard</Link>
              <Link href="/dashboard/owner/listings" onClick={() => setMobileMenuOpen(false)} className="text-on-surface font-medium py-1">My Listings</Link>
              <Link href="/dashboard/owner/calendar" onClick={() => setMobileMenuOpen(false)} className="text-on-surface font-medium py-1">Tour Calendar</Link>
              <Link href="/dashboard/owner/meetings" onClick={() => setMobileMenuOpen(false)} className="text-on-surface font-medium py-1">Meeting Requests</Link>
            </>
          )}

          {role === 'ADMIN' && (
            <>
              <Link href="/dashboard/admin" onClick={() => setMobileMenuOpen(false)} className="text-on-surface font-medium py-1">Overview</Link>
              <Link href="/dashboard/admin/verification" onClick={() => setMobileMenuOpen(false)} className="text-on-surface font-medium py-1">Verification Pipeline</Link>
              <Link href="/dashboard/admin/reports" onClick={() => setMobileMenuOpen(false)} className="text-on-surface font-medium py-1">Reports</Link>
            </>
          )}

          {role === 'GUEST' && (
            <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant">
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="text-center text-primary font-medium py-2 hover:bg-surface-container-low rounded-md">
                Log In
              </Link>
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="text-center bg-deep-green text-on-primary font-medium py-2.5 rounded-full">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
