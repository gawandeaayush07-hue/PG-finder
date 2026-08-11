'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'GUEST' | 'STUDENT' | 'OWNER' | 'ADMIN';

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  distanceText: string;
  type: 'Boys' | 'Girls' | 'Co-ed';
  premium: boolean;
  amenities: string[];
  rooms: { name: string; price: number; available: boolean }[];
  owner: { name: string; phone: string; email: string; avatar: string };
  description: string;
  reviews: Review[];
  verified: boolean;
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Declined' | 'Rescheduled';
  ownerName: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
}

export interface VerificationItem {
  id: string;
  ownerName: string;
  listingTitle: string;
  documentType: string;
  documentName: string;
  submissionDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface ReportItem {
  id: string;
  reporterName: string;
  targetType: 'Listing' | 'Review';
  targetName: string;
  reason: string;
  date: string;
  status: 'Open' | 'Resolved' | 'Dismissed';
}

interface PersonaContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  shortlist: string[];
  toggleShortlist: (id: string) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  verificationPipeline: VerificationItem[];
  updateVerificationStatus: (id: string, status: VerificationItem['status']) => void;
  reports: ReportItem[];
  updateReportStatus: (id: string, status: ReportItem['status']) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  requestRoleChange: (role: UserRole) => void;
  requireAuth: () => void;
}

const initialListings: Listing[] = [
  {
    id: 'listing-1',
    title: 'Green Leaf Residences',
    location: 'North Campus Area',
    price: 8500,
    rating: 4.5,
    reviewsCount: 24,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8lPh-Mh5caZDv8otgb_zbadZcAdDju396GSImXWmGWluVmY84Ux_xLoF2VC-lYMdHWMG7FUq-Gc0MuQ2j9d3i5fuRXHrsmha7p_8co2PX0ntqHVv6_Br2Nk3Nze04cTAl_RZnhWqnSwPN9FXk0Xo28PH3UowicNa3OeV-QyOCj-HpXLTxT6pajpTJ52a6nxk81CjYC-nxto-OsTinCozpc9oPhYTwyCf0sebvQNOHzVcEb-PhLVG',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8lPh-Mh5caZDv8otgb_zbadZcAdDju396GSImXWmGWluVmY84Ux_xLoF2VC-lYMdHWMG7FUq-Gc0MuQ2j9d3i5fuRXHrsmha7p_8co2PX0ntqHVv6_Br2Nk3Nze04cTAl_RZnhWqnSwPN9FXk0Xo28PH3UowicNa3OeV-QyOCj-HpXLTxT6pajpTJ52a6nxk81CjYC-nxto-OsTinCozpc9oPhYTwyCf0sebvQNOHzVcEb-PhLVG',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBww10ZNK22CqL1MKpLilSEPmeFJIVw9ezy4Hz5PIQ0v7iZKKUwKVd-JwHNJ7L1vERXYod-a6gima6xDCefXNwYoZzKUK3BgdkxR2jP53nBvoPK9gBJvC8BKzDGVo9yPrryFW1gSp8YGrTkkxLVbGdsfvhhcp8SjNvU-ZuvwbX6gZZCdzli0QPqzFzGeppIWthUYjqlrJEEzN_We4gkkt8ttCe1FV8Jvh7UhEWK7UPI2UT0nooWRwDE',
    ],
    distanceText: '5 mins walk to college',
    type: 'Boys',
    premium: false,
    verified: true,
    amenities: ['Wifi', 'AC', 'Power Backup', 'Food Included', 'CCTV', 'Security'],
    rooms: [
      { name: 'Single Room', price: 12000, available: true },
      { name: 'Double Sharing', price: 8500, available: true },
      { name: 'Triple Sharing', price: 6500, available: false },
    ],
    owner: {
      name: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      email: 'ramesh@pgfinder.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    },
    description: 'Green Leaf Residences offers premium student living with a modern minimal style in the quietest pocket of the North Campus area. Ideal for students who prioritize peace of mind, high-speed internet, and home-style nutritious food. Daily laundry services and 24/7 security are included.',
    reviews: [
      { id: 'r1', author: 'Aman Sharma', rating: 5, date: '2026-08-01', comment: 'Very clean rooms and nice food. Ramesh Uncle is very helpful.' },
      { id: 'r2', author: 'Vikram Singh', rating: 4, date: '2026-07-28', comment: 'Excellent high-speed Wi-Fi, perfect for study. Quiet environment.' },
    ],
  },
  {
    id: 'listing-2',
    title: "The Scholar's Abode",
    location: 'South Ext. Zone',
    price: 12000,
    rating: 4.8,
    reviewsCount: 42,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5pCTp3k1FCq-3XHGKV2oHeHVb_nLeF_SRifbW1gBGQf1IZsbzXAtLlT1oezipOlG2E1C-Lbxz0u0OtnOFYnghKi85o7hNPV1TwW2CLmY78QjC2EZR4oYFpDI0v6pmhWGQJzBbZNjyhXVaOKzIfif84mndDETJUI8S_C4-P3_eYwPZHbuVYKvq6m334Dy4d5NSKcWCdz1AQHHE1eLuv34s3JklKR_hYO-rWjmvhaBcpvh9GmyeRmYs',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5pCTp3k1FCq-3XHGKV2oHeHVb_nLeF_SRifbW1gBGQf1IZsbzXAtLlT1oezipOlG2E1C-Lbxz0u0OtnOFYnghKi85o7hNPV1TwW2CLmY78QjC2EZR4oYFpDI0v6pmhWGQJzBbZNjyhXVaOKzIfif84mndDETJUI8S_C4-P3_eYwPZHbuVYKvq6m334Dy4d5NSKcWCdz1AQHHE1eLuv34s3JklKR_hYO-rWjmvhaBcpvh9GmyeRmYs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_4ybjU8pDatqwKDFx7yva0oyA8eEKSKVdYNvbkXDSa1eUFNIGSANy90ZGVdumrxBDn55S4wcAUmYWWG7vUMk-O-h4ZnsSXfrCAPzpYw5GRGQr4YNBz9fX4lqfMuh-d9ijYnf1yqIg8qtZH-SV5b2vSydtxKABuBeXQakcn4p4Z7871PSbdTERPy6KuZ_xOjEoUxQkQrQbmNQPk_i4CJ9QNutMfcNy68Y5l8AA6XVs5J34TyceWBrR',
    ],
    distanceText: '15 mins bus ride to college',
    type: 'Girls',
    premium: true,
    verified: true,
    amenities: ['Wifi', 'AC', 'Gym', 'Laundry', 'Food Included', 'CCTV', 'Biometric Entry', 'Peacful Study Room'],
    rooms: [
      { name: 'Single Suite', price: 18000, available: true },
      { name: 'Twin Room', price: 12000, available: true },
    ],
    owner: {
      name: 'Sunita Sharma',
      phone: '+91 99999 88888',
      email: 'sunita@scholarsabode.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
    },
    description: 'An elite hostel living experience exclusively for female students. Located in the highly secure South Ext. Zone, featuring biometric entry, modern security, an in-house gymnasium, and a dedicated library room. Our goal is to provide a home away from home with premium comforts.',
    reviews: [
      { id: 'r3', author: 'Neha Gupta', rating: 5, date: '2026-08-04', comment: 'Extremely safe and beautiful. Best accommodation I have ever stayed in.' },
      { id: 'r4', author: 'Pooja Roy', rating: 4.5, date: '2026-07-15', comment: 'The gym is very well equipped and food is delicious.' },
    ],
  },
  {
    id: 'listing-3',
    title: 'Harmony House',
    location: 'Tech Park Road',
    price: 6000,
    rating: 4.2,
    reviewsCount: 18,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4hh1JlQ4KvtIzEejGlq2kDX8wyYd07ileen21WMo05pUVbgXr82GC0qxNgJgwEcVNV9zvGpdCFlxdqBWM9sjz3EQsbC4V_JyJPpR7IaNcQRD4aWU4IkAn0TsIKQsd1QG6Asx70RVi5865nAajbIxkjK6rgKNDjekuae8fohn0AMydAJR3wTdQA476d4dzl-pkl1XDCOV3VBevwnTZmlqY38catB9sxOq7MhcwBznkiCK8aFPM0eRA',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4hh1JlQ4KvtIzEejGlq2kDX8wyYd07ileen21WMo05pUVbgXr82GC0qxNgJgwEcVNV9zvGpdCFlxdqBWM9sjz3EQsbC4V_JyJPpR7IaNcQRD4aWU4IkAn0TsIKQsd1QG6Asx70RVi5865nAajbIxkjK6rgKNDjekuae8fohn0AMydAJR3wTdQA476d4dzl-pkl1XDCOV3VBevwnTZmlqY38catB9sxOq7MhcwBznkiCK8aFPM0eRA',
    ],
    distanceText: '10 mins walk to college',
    type: 'Co-ed',
    premium: false,
    verified: true,
    amenities: ['Wifi', 'Power Backup', 'Food Included', 'Laundry', 'CCTV'],
    rooms: [
      { name: 'Double Sharing', price: 7500, available: true },
      { name: 'Triple Sharing', price: 6000, available: true },
    ],
    owner: {
      name: 'Anil Gupta',
      phone: '+91 91234 56789',
      email: 'anil@harmonyhouse.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    },
    description: 'Harmony House offers friendly, budget-friendly and community-centered living. Located close to Tech Park Road, it offers twin and triple sharing rooms. Commencing meals, recreation rooms, and cooperative student environment.',
    reviews: [
      { id: 'r5', author: 'Rahul Sen', rating: 4, date: '2026-08-05', comment: 'Very cheap and good. Location is perfect for tech campus.' },
    ],
  },
];

const initialBookings: Booking[] = [
  {
    id: 'booking-1',
    listingId: 'listing-1',
    listingTitle: 'Green Leaf Residences',
    listingImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8lPh-Mh5caZDv8otgb_zbadZcAdDju396GSImXWmGWluVmY84Ux_xLoF2VC-lYMdHWMG7FUq-Gc0MuQ2j9d3i5fuRXHrsmha7p_8co2PX0ntqHVv6_Br2Nk3Nze04cTAl_RZnhWqnSwPN9FXk0Xo28PH3UowicNa3OeV-QyOCj-HpXLTxT6pajpTJ52a6nxk81CjYC-nxto-OsTinCozpc9oPhYTwyCf0sebvQNOHzVcEb-PhLVG',
    date: '2026-08-12',
    timeSlot: '11:00 AM - 12:00 PM',
    status: 'Confirmed',
    ownerName: 'Ramesh Kumar',
    studentName: 'Aarav Malhotra',
    studentEmail: 'aarav@student.in',
    studentPhone: '+91 98989 89898',
  },
  {
    id: 'booking-2',
    listingId: 'listing-2',
    listingTitle: "The Scholar's Abode",
    listingImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5pCTp3k1FCq-3XHGKV2oHeHVb_nLeF_SRifbW1gBGQf1IZsbzXAtLlT1oezipOlG2E1C-Lbxz0u0OtnOFYnghKi85o7hNPV1TwW2CLmY78QjC2EZR4oYFpDI0v6pmhWGQJzBbZNjyhXVaOKzIfif84mndDETJUI8S_C4-P3_eYwPZHbuVYKvq6m334Dy4d5NSKcWCdz1AQHHE1eLuv34s3JklKR_hYO-rWjmvhaBcpvh9GmyeRmYs',
    date: '2026-08-15',
    timeSlot: '04:00 PM - 05:00 PM',
    status: 'Pending',
    ownerName: 'Sunita Sharma',
    studentName: 'Aarav Malhotra',
    studentEmail: 'aarav@student.in',
    studentPhone: '+91 98989 89898',
  },
];

const initialVerificationPipeline: VerificationItem[] = [
  {
    id: 'verify-1',
    ownerName: 'Anil Gupta',
    listingTitle: 'Harmony House',
    documentType: 'LandRegistry & Fire NOC',
    documentName: 'harmony_deeds_fire_safety.pdf',
    submissionDate: '2026-08-08',
    status: 'Pending',
  },
  {
    id: 'verify-2',
    ownerName: 'Ramesh Kumar',
    listingTitle: 'Green Leaf Residences',
    documentType: 'Aadhaar ID & Utility Bill',
    documentName: 'ramesh_id_utility.pdf',
    submissionDate: '2026-08-03',
    status: 'Approved',
  },
];

const initialReports: ReportItem[] = [
  {
    id: 'report-1',
    reporterName: 'Divya K.',
    targetType: 'Review',
    targetName: 'Review by Rahul Sen on Harmony House',
    reason: 'Offensive language used in thread.',
    date: '2026-08-07',
    status: 'Open',
  },
  {
    id: 'report-2',
    reporterName: 'Admin Bot',
    targetType: 'Listing',
    targetName: "The Scholar's Abode",
    reason: 'Duplicate listing flagged in same area.',
    date: '2026-08-06',
    status: 'Dismissed',
  },
];

import { AuthModal } from '@/components/AuthModal';

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('GUEST');
  const [authPendingRole, setAuthPendingRole] = useState<UserRole | null>(null);
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [shortlist, setShortlist] = useState<string[]>(['listing-2']);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [verificationPipeline, setVerificationPipeline] = useState<VerificationItem[]>(initialVerificationPipeline);
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');

  // Sync role based on some routes if needed, or keep manual
  useEffect(() => {
    // Check if role is stored in localStorage to persist on reload
    const savedRole = localStorage.getItem('pgfinder_persona_role') as UserRole;
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('pgfinder_persona_role', newRole);
    setAuthPendingRole(null);
  };

  const requestRoleChange = (newRole: UserRole) => {
    if (newRole === 'GUEST') {
      handleSetRole(newRole);
    } else {
      setAuthPendingRole(newRole);
    }
  };

  const requireAuth = () => {
    if (role === 'GUEST') {
      setAuthPendingRole('STUDENT');
    }
  };

  const toggleShortlist = (id: string) => {
    setShortlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addBooking = (newBooking: Omit<Booking, 'id' | 'status'>) => {
    const id = `booking-${Date.now()}`;
    const booking: Booking = {
      ...newBooking,
      id,
      status: 'Pending',
    };
    setBookings((prev) => [booking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const updateVerificationStatus = (id: string, status: VerificationItem['status']) => {
    setVerificationPipeline((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    // If approved, verify the corresponding listing
    if (status === 'Approved') {
      setVerificationPipeline((prevPipeline) => {
        const item = prevPipeline.find(p => p.id === id);
        if (item) {
          setListings(prevListings =>
            prevListings.map(l =>
              l.title === item.listingTitle ? { ...l, verified: true } : l
            )
          );
        }
        return prevPipeline;
      });
    }
  };

  const updateReportStatus = (id: string, status: ReportItem['status']) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <PersonaContext.Provider
      value={{
        role,
        setRole: handleSetRole,
        requestRoleChange,
        requireAuth,
        listings,
        setListings,
        shortlist,
        toggleShortlist,
        bookings,
        addBooking,
        updateBookingStatus,
        verificationPipeline,
        updateVerificationStatus,
        reports,
        updateReportStatus,
        searchQuery,
        setSearchQuery,
        priceRange,
        setPriceRange,
      }}
    >
      {authPendingRole && (
        <AuthModal 
          targetRole={authPendingRole} 
          onSuccess={handleSetRole} 
          onCancel={() => setAuthPendingRole(null)} 
        />
      )}
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};
