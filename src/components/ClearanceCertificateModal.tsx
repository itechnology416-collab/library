import React from 'react';
import { RegistrarClearance } from '../types';

interface ClearanceCertificateModalProps {
  clearance: RegistrarClearance;
  onClose: () => void;
}

export const ClearanceCertificateModal: React.FC<ClearanceCertificateModalProps> = ({
  clearance,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl p-6 sm:p-10 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          title="Close Certificate"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Printable Certificate Frame */}
        <div className="border-4 border-double border-amber-600/60 p-6 sm:p-8 rounded-2xl bg-linear-to-b from-amber-500/5 via-transparent to-amber-500/5 space-y-6 text-center">
          {/* Header & Crest */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center shadow-md font-serif text-2xl font-bold border-2 border-amber-400">
                HU
              </div>
            </div>
            <p className="text-xs uppercase tracking-widest text-secondary font-bold">
              Haramaya University • Office of the Registrar
            </p>
            <p className="text-[11px] text-on-surface-variant font-medium tracking-wide">
              Directorate of Postgraduate Studies & Central Library Archival Division
            </p>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-on-surface pt-1 border-b border-amber-500/30 pb-3">
              Official Postgraduate Clearance & Archival Certificate
            </h2>
          </div>

          {/* Certificate Number & Date */}
          <div className="flex flex-wrap items-center justify-between text-xs text-on-surface-variant px-4 py-2 bg-surface-container/60 rounded-xl font-mono">
            <span>
              Cert No:{' '}
              <strong className="text-on-surface">
                {clearance.clearanceCertNumber || `HU-REG-CLR-${clearance.id}`}
              </strong>
            </span>
            <span>
              Issued:{' '}
              <strong className="text-on-surface">
                {clearance.issuedAt || new Date().toISOString().split('T')[0]}
              </strong>
            </span>
          </div>

          {/* Cert Body */}
          <div className="space-y-4 text-xs sm:text-sm text-on-surface text-left leading-relaxed">
            <p>
              This is to officially certify that candidate{' '}
              <strong className="text-base text-primary font-serif underline decoration-amber-500/50 underline-offset-4">
                {clearance.studentName}
              </strong>{' '}
              (Student ID: <span className="font-mono font-bold">{clearance.studentId}</span>), enrolled in the{' '}
              <strong className="font-semibold">{clearance.academicProgram} Degree Program</strong> within the{' '}
              <strong className="font-semibold">{clearance.department}</strong>,{' '}
              <span>{clearance.college}</span>, has satisfactorily satisfied all graduation requirements, institutional research compliance clearances, and archival depository protocols.
            </p>

            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 space-y-2">
              <p className="font-serif font-bold text-xs uppercase text-secondary">
                Approved Dissertation / Thesis Title:
              </p>
              <p className="font-serif italic text-sm text-on-surface">
                "{clearance.thesisTitle}"
              </p>
              <p className="text-xs text-on-surface-variant">
                Major Advisor: <strong className="text-on-surface">{clearance.advisorName}</strong> • Defense Date:{' '}
                <strong className="text-on-surface">{clearance.defenseDate}</strong>
              </p>
            </div>

            {/* Compliance Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 text-[20px] mt-0.5">verified</span>
                <div>
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">
                    Originality & Anti-Plagiarism Audit
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Similarity Score: <strong className="text-emerald-700 dark:text-emerald-400">{clearance.plagiarismSimilarityPct}%</strong> (Max Ceiling: 19%)
                  </p>
                  <p className="text-[10px] font-mono text-on-surface-variant truncate">
                    Hash: {clearance.plagiarismCertHash}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-teal-600 text-[20px] mt-0.5">library_books</span>
                <div>
                  <p className="font-bold text-teal-800 dark:text-teal-300">
                    Institutional Repository Depository
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Hardbound Copies: <strong className="text-teal-700 dark:text-teal-400">{clearance.hardcopyCopiesCount || 4} Copies Deposited</strong>
                  </p>
                  <p className="text-[10px] font-mono text-on-surface-variant">
                    Handle: {clearance.libraryRepoDepositHandle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-amber-500/30 text-center text-xs">
            <div className="space-y-1">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-sm text-secondary font-bold">
                  {clearance.advisorName.split(' ')[0]} {clearance.advisorName.split(' ')[1] || ''}
                </span>
              </div>
              <p className="border-t border-outline-variant/40 pt-1 font-bold text-on-surface text-[11px]">
                Major Thesis Advisor
              </p>
              <p className="text-[10px] text-on-surface-variant">Department Committee</p>
            </div>

            <div className="space-y-1">
              <div className="h-10 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-amber-600/80 flex items-center justify-center text-[9px] font-serif font-black uppercase text-amber-700 dark:text-amber-400 rotate-[-12deg]">
                  HU REG
                </div>
              </div>
              <p className="border-t border-outline-variant/40 pt-1 font-bold text-on-surface text-[11px]">
                Official Institutional Seal
              </p>
              <p className="text-[10px] text-on-surface-variant">Haramaya Registrar</p>
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-1">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-sm text-primary font-bold">
                  Dr. Solomon Tadesse
                </span>
              </div>
              <p className="border-t border-outline-variant/40 pt-1 font-bold text-on-surface text-[11px]">
                {clearance.verifiedBy || 'University Registrar'}
              </p>
              <p className="text-[10px] text-on-surface-variant">Vice President for Academic Affairs</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-outline-variant/20">
          <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">lock</span>
            <span>Cryptographically sealed record verified on Haramaya University Academic Ledger</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 hover:brightness-105 transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Print Official Clearance</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
