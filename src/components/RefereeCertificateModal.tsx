import React from 'react';
import {
  Award,
  Printer,
  ShieldCheck,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { RefereeRecognitionCertificate } from '../types';
import { Modal, Button, Badge } from './ui';

interface RefereeCertificateModalProps {
  certificate: RefereeRecognitionCertificate;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const RefereeCertificateModal: React.FC<RefereeCertificateModalProps> = ({
  certificate,
  onClose,
  onShowToast,
}) => {
  const handlePrint = () => {
    window.print();
    if (onShowToast) {
      onShowToast('Printing / Saving Referee Certificate of Recognition PDF...');
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center border border-indigo-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base md:text-lg text-on-surface">
                Official Certificate of Peer Review Recognition
              </span>
              <Badge variant="secondary" className="font-mono text-[10px]">
                {certificate.certificateId}
              </Badge>
            </div>
            <p className="text-xs text-on-surface-variant font-normal">
              Issued by Haramaya University Research Affairs & Academic Journals Directorate
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Certificate Parchment Frame */}
        <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-slate-50 via-white to-indigo-50/20 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border-4 border-double border-indigo-700/40 text-on-surface shadow-lg relative overflow-hidden print:border-2 print:p-6 text-center space-y-6">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-96 h-96 text-indigo-700" />
          </div>

          {/* Filigree Corner Accents */}
          <div className="absolute top-3 left-3 text-indigo-600/40 text-xs font-serif font-bold">✦</div>
          <div className="absolute top-3 right-3 text-indigo-600/40 text-xs font-serif font-bold">✦</div>
          <div className="absolute bottom-3 left-3 text-indigo-600/40 text-xs font-serif font-bold">✦</div>
          <div className="absolute bottom-3 right-3 text-indigo-600/40 text-xs font-serif font-bold">✦</div>

          {/* Institutional Header */}
          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Haramaya University • Research & Extension Directorate</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-2">
              HARAMAYA UNIVERSITY ACADEMIC PRESS
            </h1>
            <p className="text-xs text-on-surface-variant font-medium">
              Office of the Vice President for Research Affairs • Peer Review Recognition Bureau
            </p>
          </div>

          {/* Certificate Conferred Text */}
          <div className="py-2 relative z-10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Certificate of Scholarly Peer Review Service
            </span>
            <p className="text-xs text-on-surface-variant italic">
              This certificate is officially conferred upon distinguished referee
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-indigo-900 dark:text-indigo-300 border-b-2 border-indigo-600/30 pb-2 inline-block px-6">
              {certificate.reviewerName}
            </h2>
            <p className="text-xs text-on-surface-variant max-w-xl mx-auto pt-2 leading-relaxed">
              In formal appreciation for rigorous, double-blind critical evaluation, methodological validation, and constructive scholarly peer review of the following manuscript:
            </p>
          </div>

          {/* Manuscript & Journal Block */}
          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-surface-container/60 border border-indigo-200/50 dark:border-indigo-900/40 text-left relative z-10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                Tracking: {certificate.trackingCode}
              </span>
              <span className="text-on-surface-variant">Concluded: {certificate.completionDate}</span>
            </div>
            <div className="font-serif font-bold text-sm sm:text-base text-on-surface">
              "{certificate.manuscriptTitle}"
            </div>
            <div className="flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{certificate.journalName}</span>
            </div>
          </div>

          {/* Signatures & Security Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-outline-variant/30 text-xs relative z-10 items-end">
            <div className="text-center space-y-1">
              <div className="h-9 flex items-center justify-center font-serif text-base italic text-indigo-800 dark:text-indigo-300">
                Prof. Mengistu Ketema
              </div>
              <div className="w-36 h-0.5 bg-outline-variant/40 mx-auto" />
              <p className="font-bold text-[11px] text-on-surface">Editor-in-Chief / VP Research</p>
              <p className="text-[10px] text-on-surface-variant">Haramaya University Press</p>
            </div>

            <div className="text-center space-y-1.5 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-indigo-600/40 bg-indigo-50/50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED REFEREE
              </span>
            </div>

            <div className="text-center space-y-1">
              <div className="h-9 flex items-center justify-center font-serif text-base italic text-indigo-800 dark:text-indigo-300">
                Dr. Yonas Worku
              </div>
              <div className="w-36 h-0.5 bg-outline-variant/40 mx-auto" />
              <p className="font-bold text-[11px] text-on-surface">Director of Research Publications</p>
              <p className="text-[10px] text-on-surface-variant">Office of Research Directorate</p>
            </div>
          </div>

          {/* Cryptographic Footprint */}
          <div className="pt-2 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-on-surface-variant/80 gap-2 relative z-10">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-indigo-500" />
              Security SHA-256 Hash: {certificate.verificationHash}
            </span>
            <span>Haramaya Research Publications Index</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-on-surface-variant flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Eligible for Academic Promotion & Faculty Tenured Service Portfolios</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1 sm:flex-none cursor-pointer"
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
              className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
              Print / Save PDF
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
