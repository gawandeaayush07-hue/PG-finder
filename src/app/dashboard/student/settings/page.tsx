'use client';

import React, { useState } from 'react';

export default function StudentSettings() {
  const [name, setName] = useState('Aarav Malhotra');
  const [email, setEmail] = useState('aarav@student.in');
  const [college, setCollege] = useState('IIT Delhi');
  const [phone, setPhone] = useState('+91 98989 89898');
  
  const [idFile, setIdFile] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const name = e.target.files[0].name;
      setTimeout(() => {
        setIsUploading(false);
        setIdFile(name);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Form */}
      <section className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-primary">Account Settings</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage your personal information, profile avatar, and communication preferences.
          </p>
        </div>

        {isSaved && (
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-xs font-bold text-deep-green">
            Settings updated successfully!
          </div>
        )}

        <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#7A8F7A]">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-[#B8D9B0] rounded-lg text-sm focus:border-primary outline-none bg-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#7A8F7A]">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#B8D9B0] rounded-lg text-sm focus:border-primary outline-none bg-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#7A8F7A]">Phone Number</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-[#B8D9B0] rounded-lg text-sm focus:border-primary outline-none bg-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#7A8F7A]">College / University Name</label>
            <input
              type="text"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3 py-2 border border-[#B8D9B0] rounded-lg text-sm focus:border-primary outline-none bg-white"
            />
          </div>

          <div className="md:col-span-2 pt-2 border-t border-outline-variant mt-2 flex justify-end">
            <button
              type="submit"
              className="bg-deep-green hover:bg-primary text-on-primary font-bold text-xs px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </section>

      {/* ID Verification Section */}
      <section className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-[#333333]">ID Verification</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Upload your college ID card or Aadhaar to get the "Verified Student" badge on visits.
          </p>
        </div>

        <div className="border-2 border-dashed border-[#B8D9B0] rounded-xl p-6 text-center flex flex-col items-center gap-3 bg-surface-container-low/20">
          <span className="material-symbols-outlined text-4xl text-outline">upload_file</span>
          <div>
            <span className="text-xs font-bold text-primary block">
              {isUploading ? 'Uploading file...' : idFile ? `Document: ${idFile}` : 'Upload ID Proof Document'}
            </span>
            <span className="text-[10px] text-on-surface-variant">Accepts PDF, PNG, JPG files up to 5MB</span>
          </div>

          {!idFile && !isUploading && (
            <label className="bg-light-sage hover:bg-light-sage/80 text-deep-green text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-sm mt-2">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
              />
            </label>
          )}

          {idFile && (
            <div className="flex gap-2 items-center mt-2">
              <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Document Submitted
              </span>
              <button 
                onClick={() => setIdFile(null)} 
                className="text-xs text-rose-600 hover:underline cursor-pointer font-semibold ml-2"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
