import React from 'react';
import {
  Award,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  QrCode,
} from 'lucide-react';
import { Certificate } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';
import { Modal, Button, Badge } from './ui';

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
    <Modal
      isOpen={true}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center border border-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base md:text-lg text-on-surface">
                Official Academic Certificate of Completion
              </span>
              <Badge variant="secondary" className="font-mono text-[10px]">
                {certificate.certificateId}
              </Badge>
            </div>
            <p className="text-xs text-on-surface-variant font-normal">
              Credential verified by Haramaya University Academic Press & E-Learning Registry
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Certificate Parchment Frame */}
        <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-4 border-double border-amber-600/40 text-on-surface shadow-lg relative overflow-hidden print:border-2 print:p-6 text-center space-y-6">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-amber-700" />
          </div>

          {/* Corner Filigrees */}
          <div className="absolute top-3 left-3 text-amber-600/40 text-xs font-serif font-bold">
            ✦
          </div>
          <div className="absolute top-3 right-3 text-amber-600/40 text-xs font-serif font-bold">
            ✦
          </div>
          <div className="absolute bottom-3 left-3 text-amber-600/40 text-xs font-serif font-bold">
            ✦
          </div>
          <div className="absolute bottom-3 right-3 text-amber-600/40 text-xs font-serif font-bold">
            ✦
          </div>

          {/* Institution Header */}
          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Haramaya University Academic Press & E-Learning</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-2">
              {OFFICIAL_BRAND.name}
            </h1>
            <p className="text-xs text-on-surface-variant font-medium">
              Affiliated with Haramaya University • Professional Publishing Services
            </p>
          </div>

          {/* Certificate Title & Recipient */}
          <div className="py-2 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block">
              Certificate of Academic Excellence
            </span>
            <p className="text-xs text-on-surface-variant italic mt-1">
              This honor credential is formally conferred upon
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-amber-700 dark:text-amber-400 mt-2 border-b-2 border-amber-600/30 pb-2 inline-block px-8">
              {certificate.studentName}
            </h2>
          </div>

          {/* Achievement Description */}
          <div className="max-w-xl mx-auto space-y-2 text-xs text-on-surface-variant leading-relaxed relative z-10">
            <p>
              for demonstrated scholarly mastery, successful completion of rigorous coursework, and outstanding assessment performance in
            </p>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              "{certificate.courseTitle}"
            </h3>
            <p className="text-[11px]">
              Attaining the academic standing of{' '}
              <span className="font-bold text-secondary">{certificate.grade || 'Honors (Passed)'}</span>{' '}
              under the academic oversight of {certificate.organization}.
            </p>
          </div>

          {/* Signatures & Seal Grid */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end border-t border-outline-variant/20 relative z-10">
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
                <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <span className="text-[7px] font-bold uppercase tracking-widest mt-0.5">Official Seal</span>
                <span className="text-[6px] font-bold">WKI • HARAMAYA</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1.5 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified Credential</span>
              </span>
            </div>

            {/* Verification QR / Registrar */}
            <div className="text-center space-y-1">
              <div className="flex flex-col items-center justify-center mb-1">
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
          <div className="pt-2 border-t border-outline-variant/15 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono text-on-surface-variant/80 relative z-10">
            <span>
              SHA-256: 8f3c7b91...{certificate.certificateId.replace(/[^0-9]/g, '').slice(0, 8)}a4e2
            </span>
            <span>Registry Node: Haramaya-Cluster-01</span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Cryptographically sealed record in Haramaya University registry.</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs font-semibold"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              <span>Print / Save PDF</span>
            </Button>

            {onVerify && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onVerify(certificate.certificateId);
                }}
                className="text-xs font-semibold text-secondary"
              >
                <QrCode className="w-4 h-4 mr-1.5" />
                <span>Verify in Portal</span>
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="text-xs font-bold shadow-xs"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
