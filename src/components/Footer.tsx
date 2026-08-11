import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-on-primary w-full py-xl px-margin-mobile md:px-margin-desktop mt-20">
      <div className="max-w-max-width mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-headline-md text-headline-md font-bold text-on-primary">
                PGFinder
              </span>
            </Link>
            <p className="font-body-md text-body-md text-on-primary/80 mt-2 max-w-[250px]">
              Making student housing discovery transparent, easy, and stress-free.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-headline-md text-lg font-semibold mb-2">Explore</h4>
            <Link href="/search" className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline transition-opacity">
              Find a PG
            </Link>
            <Link href="/about" className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline transition-opacity">
              About Us
            </Link>
            <Link href="/about" className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline transition-opacity">
              Careers
            </Link>
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-headline-md text-lg font-semibold mb-2">Support</h4>
            <Link href="/about" className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline transition-opacity">
              FAQ
            </Link>
            <Link href="/about" className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline transition-opacity">
              Contact Support
            </Link>
            <Link href="/about" className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline transition-opacity">
              Privacy Policy
            </Link>
            <Link href="/about" className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline transition-opacity">
              Terms of Service
            </Link>
          </div>

          {/* For Owners */}
          <div className="flex flex-col gap-3">
            <h4 className="font-headline-md text-lg font-semibold mb-2">For Owners</h4>
            <Link href="/auth" className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline transition-opacity">
              List Your PG
            </Link>
            <Link href="/dashboard/owner" className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline transition-opacity">
              Owner Dashboard
            </Link>
            <Link href="/about" className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline transition-opacity">
              Trust &amp; Safety
            </Link>
          </div>
        </div>

        {/* Bottom Divider & Copyright */}
        <div className="border-t border-on-primary/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label-sm text-label-sm text-on-primary/80">
            © 2026 PGFinder. All rights reserved.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-on-primary/10 flex items-center justify-center hover:bg-on-primary/20 transition-colors">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-on-primary/10 flex items-center justify-center hover:bg-on-primary/20 transition-colors">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>share</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-on-primary/10 flex items-center justify-center hover:bg-on-primary/20 transition-colors">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
