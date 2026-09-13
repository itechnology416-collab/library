import React, { useState } from 'react';
import { INITIAL_CERTIFICATES, OFFICIAL_BRAND } from '../data/initialData';
import { Certificate } from '../types';

interface CertificateVerificationModalProps {
  onClose: () => void;
  initialCertId?: string;
}

export const CertificateVerificationModal: React.FC<CertificateVerificationModalProps> = ({
  onClose,
  initialCertId = '',
}) => {
  const [searchId, setSearchId] = useState<string>(initialCertId || 'WKI-CERT-2024-8842');
  const [searchedCert, setSearchedCert] = useState<Certificate | null>(
    INITIAL_CERTIFICATES.find((c) => c.certificateId === (initialCertId || 'WKI-CERT-2024-8842')) || null
  );
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = searchId.trim().toUpperCase();
    const found = INITIAL_CERTIFICATES.find(
      (c) => c.certificateId.toUpperCase() === cleanId
    );
    setSearchedCert(found || null);
    setHasSearched(true);
  };

  const sampleIds = ['WKI-CERT-2024-8842', 'WKI-CERT-2024-5109', 'WKI-CERT-2024-3321'];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              verified_user
            </span>
            <div>
              <h3 className="font-title-md text-title-md font-bold text-on-surface">
                Haramaya Press Certificate Registry
              </h3>
              <p className="text-xs text-on-surface-variant">
                Official Credential Verification • Wirtuu Kompiitaraa Ilillii
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="text-xs font-bold text-on-surface block">
            Enter Certificate Serial ID (e.g. WKI-CERT-2024-XXXX)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="e.g. WKI-CERT-2024-8842"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 p-2.5 rounded-xl bg-surface-container text-xs sm:text-sm font-mono text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none uppercase"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span>Verify</span>
            </button>
          </div>

          {/* Quick sample chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-on-surface-variant">
            <span>Try sample serials:</span>
            {sampleIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSearchId(id);
                  const found = INITIAL_CERTIFICATES.find((c) => c.certificateId === id);
                  setSearchedCert(found || null);
                  setHasSearched(true);
                }}
                className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-secondary font-mono font-bold cursor-pointer transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        </form>

        {/* Verification Result */}
        {hasSearched && (
          <div>
            {searchedCert ? (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-surface-container-lowest to-secondary/10 border-2 border-emerald-500/40 space-y-4 relative overflow-hidden">
                {/* Official Seal Watermark */}
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <span className="material-symbols-outlined text-[24px]">verified</span>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Officially Verified & Authenticated
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-secondary">
                    {searchedCert.certificateId}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold block">
                      Certified Recipient
                    </span>
                    <h4 className="text-xl font-bold text-on-surface font-serif">
                      {searchedCert.studentName}
                    </h4>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold block">
                      Program Completed
                    </span>
                    <p className="text-sm font-bold text-secondary">
                      {searchedCert.courseTitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div>
                      <span className="text-on-surface-variant block">Date Issued</span>
                      <span className="font-semibold text-on-surface">
                        {searchedCert.issuedDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Academic Grade</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                        {searchedCert.grade || 'Pass with Distinction'}
                      </span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Lead Faculty</span>
                      <span className="font-semibold text-on-surface">
                        {searchedCert.instructor}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/15 text-[11px] text-on-surface-variant flex items-center justify-between">
                    <span>Issuing Body: {searchedCert.organization}</span>
                    <span className="text-secondary font-bold">Haramaya Verified</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    <span>Print Record</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-rose-500">
                  gpp_bad
                </span>
                <h4 className="font-title-sm text-sm font-bold text-rose-700 dark:text-rose-300">
                  Certificate Serial Not Found
                </h4>
                <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                  No registered academic credential matches serial "{searchId}". Please verify the serial number or contact the editorial registry desk at {OFFICIAL_BRAND.phone1}.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
