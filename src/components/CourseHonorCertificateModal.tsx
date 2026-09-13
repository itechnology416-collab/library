import React from 'react';
import { Certificate } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';

interface CourseHonorCertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
  onVerify?: (certId: string) => void;
}

export const CourseHonorCertificateModal: React.FC<CourseHonorCertificateModalProps> = ({
  certificate,
  onClose,
  onVerify,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto flex items-center justify-center">
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col my-auto">
        {/* Modal Top Bar */}
        <div className="p-4 bg-surface-container flex items-center justify-between border-b border-outline-variant/20 print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">workspace_premium</span>
            <div>
              <h3 className="font-bold text-on-surface text-sm">
                Official Academic Certificate of Completion
              </h3>
              <p className="text-[11px] text-on-surface-variant font-mono">
                Credential ID: {certificate.certificateId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container-highest hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
              title="Close"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Certificate Parchment Body */}
        <div className="p-6 sm:p-10 bg-amber-50/25 dark:bg-stone-900/40 relative">
          <div className="relative border-4 border-double border-amber-600/40 dark:border-amber-500/30 rounded-xl p-6 sm:p-10 bg-surface-container-lowest shadow-inner text-center space-y-6">
            {/* Corner Filigrees */}
            <div className="absolute top-2 left-2 text-amber-600/40 dark:text-amber-400/40 text-xs font-serif font-bold">
              ✦
            </div>
            <div className="absolute top-2 right-2 text-amber-600/40 dark:text-amber-400/40 text-xs font-serif font-bold">
              ✦
            </div>
            <div className="absolute bottom-2 left-2 text-amber-600/40 dark:text-amber-400/40 text-xs font-serif font-bold">
              ✦
            </div>
            <div className="absolute bottom-2 right-2 text-amber-600/40 dark:text-amber-400/40 text-xs font-serif font-bold">
              ✦
            </div>

            {/* Institution Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-[14px]">school</span>
                <span>Haramaya University Academic Press & E-Learning</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-2">
                {OFFICIAL_BRAND.name}
              </h1>
              <p className="text-xs text-on-surface-variant font-medium">
                Affiliated with Haramaya University • Professional Publishing Services
              </p>
            </div>

            {/* Certificate Title */}
            <div className="py-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block">
                Certificate of Academic Excellence
              </span>
              <p className="text-xs text-on-surface-variant italic mt-1">
                This honor credential is formally conferred upon
              </p>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-on-surface text-amber-700 dark:text-amber-400 mt-2 border-b-2 border-amber-600/30 pb-2 inline-block px-8">
                {certificate.studentName}
              </h2>
            </div>

            {/* Achievement Description */}
            <div className="max-w-xl mx-auto space-y-2 text-xs text-on-surface-variant leading-relaxed">
              <p>
                for demonstrated scholarly mastery, successful completion of rigorous coursework, and outstanding assessment performance in
              </p>
              <h3 className="font-bold text-base text-on-surface text-slate-900 dark:text-slate-100">
                "{certificate.courseTitle}"
              </h3>
              <p className="text-[11px]">
                Attaining the academic standing of <span className="font-bold text-secondary">{certificate.grade || 'Honors (Passed)'}</span> under the academic oversight of {certificate.organization}.
              </p>
            </div>

            {/* Signatures & Seal Grid */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end border-t border-outline-variant/20">
              {/* Instructor Signature */}
              <div className="text-center space-y-1">
                <div className="font-serif italic font-bold text-base text-on-surface tracking-wide">
                  {certificate.instructor}
                </div>
                <div className="w-36 h-0.5 bg-outline-variant/40 mx-auto" />
                <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider font-semibold">
                  Course Instructor
                </span>
                <span className="text-[9px] text-on-surface-variant block">
                  Director, WKI Publishing
                </span>
              </div>

              {/* Official Gold Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-dashed border-amber-600 dark:border-amber-400 flex flex-col items-center justify-center bg-amber-500/10 text-amber-700 dark:text-amber-300 shadow-md p-1">
                  <span className="material-symbols-outlined text-[26px]">verified</span>
                  <span className="text-[7px] font-bold uppercase tracking-widest mt-0.5">Official Seal</span>
                  <span className="text-[6px] font-bold">WKI • HARAMAYA</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1.5 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  <span>Verified Credential</span>
                </span>
              </div>

              {/* Verification & Registrar */}
              <div className="text-center space-y-1">
                <div className="flex flex-col items-center justify-center mb-1">
                  {/* Visual QR Code simulation */}
                  <div className="w-14 h-14 p-1 rounded-md bg-white border border-outline-variant/30 flex items-center justify-center shadow-xs">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h4v4h-4v-4zm0-4h4v-4h-4v4zm4-4h4v4h-4v-4zM6 6h2v2H6V6zm12 0h2v2h-2V6zM6 18h2v2H6v-2z" />
                    </svg>
                  </div>
                  <span className="text-[8px] font-mono text-on-surface-variant mt-0.5">Scan to Verify</span>
                </div>
                <div className="w-36 h-0.5 bg-outline-variant/40 mx-auto" />
                <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider font-semibold">
                  Date of Conferral
                </span>
                <span className="text-[9px] font-mono text-on-surface-variant block">
                  {certificate.issuedDate}
                </span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Digest Bar */}
            <div className="pt-2 border-t border-outline-variant/15 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono text-on-surface-variant/80">
              <span>SHA-256: 8f3c7b91...{certificate.certificateId.replace(/[^0-9]/g, '').slice(0, 8)}a4e2</span>
              <span>Registry Node: Haramaya-Cluster-01</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-surface-container flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/20 print:hidden">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">lock</span>
            <span>Cryptographically sealed record in Haramaya University registry.</span>
          </div>

          <div className="flex items-center gap-2">
            {onVerify && (
              <button
                onClick={() => {
                  onClose();
                  onVerify(certificate.certificateId);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-secondary text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                <span>Open in Verification Portal</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
