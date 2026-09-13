import React, { useState } from 'react';
import { ApprovalCertificate, ServiceRequest } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';

interface ApprovalCertificateModalProps {
  request: ServiceRequest;
  onClose: () => void;
  onConfirmApproval: (cert: ApprovalCertificate) => void;
}

export const ApprovalCertificateModal: React.FC<ApprovalCertificateModalProps> = ({
  request,
  onClose,
  onConfirmApproval,
}) => {
  const [scholarName, setScholarName] = useState<string>(request.clientName);
  const [signatureText, setSignatureText] = useState<string>(request.clientName);
  const [approvalNotes, setApprovalNotes] = useState<string>(
    'All requested formatting adjustments, academic citations, and defense slide components have been verified and approved for university publication.'
  );
  const [isSigned, setIsSigned] = useState<boolean>(!!request.approvalCertificate);
  const [certificateData, setCertificateData] = useState<ApprovalCertificate | null>(
    request.approvalCertificate || null
  );

  const handleSignAndIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureText.trim()) return;

    const cert: ApprovalCertificate = {
      certificateNumber: `WKI-APPR-${Date.now().toString().slice(-6)}`,
      clientName: scholarName.trim(),
      affiliation: request.affiliation,
      projectTitle: request.projectTitle,
      serviceCategory: request.serviceCategory,
      approvedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      pagesApproved: request.estimatedPages,
      digitalChecksum: 'SHA256:' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      directorSignature: 'Feysal Hussein (Director & Senior Typographer)',
      clientSignature: signatureText.trim(),
      status: 'Official Approved',
    };

    setCertificateData(cert);
    setIsSigned(true);
    onConfirmApproval(cert);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 max-w-3xl w-full flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-surface-container border-b border-outline-variant/20 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span>Academic Acceptance & Release Sign-Off</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-mono font-bold">
                  {request.id}
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant">
                Formally approve deliverable proofs and generate official university completion certificate
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[82vh] space-y-6">
          {!isSigned ? (
            /* Signature Form */
            <form onSubmit={handleSignAndIssue} className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-container text-xs text-on-surface space-y-2 border border-outline-variant/20">
                <span className="font-bold text-secondary uppercase tracking-wider block">
                  Project Verification Summary:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><strong>Manuscript Title:</strong> {request.projectTitle}</div>
                  <div><strong>Author / Scholar:</strong> {request.clientName}</div>
                  <div><strong>Volume:</strong> {request.estimatedPages} Pages / Slides</div>
                  <div><strong>Language:</strong> {request.targetLanguage.toUpperCase()}</div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Confirm Scholar Full Name & Title *</label>
                <input
                  type="text"
                  required
                  value={scholarName}
                  onChange={(e) => setScholarName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Client Electronic Signature *</label>
                <input
                  type="text"
                  required
                  placeholder="Type your full legal / academic name to execute signature"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-container text-sm text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none font-serif italic"
                />
                <span className="text-[10px] text-on-surface-variant block">
                  By signing, you confirm that all typesetting, data graphics, and textual layouts meet your academic standards.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Sign-Off Endorsement Notes</label>
                <textarea
                  rows={2}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">approval</span>
                  <span>Execute Sign-off & Issue Certificate</span>
                </button>
              </div>
            </form>
          ) : (
            /* Official Certificate Rendered */
            <div className="space-y-4">
              <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-4 border-double border-amber-600/40 text-on-surface shadow-lg relative overflow-hidden print:border-2 print:p-6">
                
                {/* Watermark Seal */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-[320px] text-amber-700">
                    school
                  </span>
                </div>

                {/* Institutional Header */}
                <div className="text-center space-y-1.5 border-b-2 border-amber-600/30 pb-4 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Haramaya University Academic Press • WKI</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-serif text-on-surface tracking-tight">
                    Certificate of Manuscript Acceptance & Final Release
                  </h3>
                  <p className="text-xs text-on-surface-variant font-mono">
                    Certificate Serial: {certificateData?.certificateNumber} • Issued {certificateData?.approvedDate}
                  </p>
                </div>

                {/* Certificate Body */}
                <div className="py-6 space-y-4 text-center relative z-10">
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
                    This certifies that the scholarly manuscript titled:
                  </p>
                  
                  <h4 className="text-base sm:text-lg font-bold text-secondary font-serif max-w-xl mx-auto leading-relaxed">
                    "{certificateData?.projectTitle}"
                  </h4>

                  <p className="text-xs text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                    Authored by <strong>{certificateData?.clientName}</strong> ({certificateData?.affiliation}), comprising <strong>{certificateData?.pagesApproved}</strong> typeset pages/slides, has successfully passed comprehensive editorial copyediting, citation validation, and author final proof verification.
                  </p>

                  <div className="p-3 rounded-xl bg-surface-container/60 max-w-md mx-auto border border-outline-variant/20 text-[11px] text-on-surface-variant">
                    {approvalNotes}
                  </div>
                </div>

                {/* Signatures & Security Seals */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t-2 border-amber-600/30 relative z-10">
                  {/* Author Signature */}
                  <div className="text-center space-y-1">
                    <div className="font-serif italic text-lg font-bold text-on-surface border-b border-outline-variant/40 pb-1 max-w-[200px] mx-auto">
                      {certificateData?.clientSignature}
                    </div>
                    <span className="text-[11px] font-bold text-on-surface block">
                      {certificateData?.clientName}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      Principal Investigator / Author
                    </span>
                  </div>

                  {/* Director Countersignature */}
                  <div className="text-center space-y-1">
                    <div className="font-serif italic text-lg font-bold text-secondary border-b border-outline-variant/40 pb-1 max-w-[200px] mx-auto">
                      Feysal Hussein
                    </div>
                    <span className="text-[11px] font-bold text-on-surface block">
                      Mr. Feysal Hussein
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      Director, Wirtuu Kompiitaraa Ilillii
                    </span>
                  </div>
                </div>

                {/* Cryptographic Checksum Bar */}
                <div className="pt-4 mt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between text-[10px] text-on-surface-variant font-mono">
                  <span>AUTHENTICITY HASH: {certificateData?.digitalChecksum}</span>
                  <span>VERIFIED AT HARAMAYA UNIVERSITY</span>
                </div>

              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 no-print">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Return to Portal
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    <span>Print / Export PDF</span>
                  </button>

                  <a
                    href={OFFICIAL_BRAND.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold flex items-center gap-1.5 shadow-xs hover:brightness-105 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Share on Telegram</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
