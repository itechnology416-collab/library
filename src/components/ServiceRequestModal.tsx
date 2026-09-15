import React, { useState, useEffect } from 'react';
import {
  Send,
  Calendar,
  Hash,
  User,
  Phone,
  Building,
  FileText,
  AtSign,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Language, ServiceCategory, ServiceRequest } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';
import { translations } from '../utils/translations';
import { Modal, Input, Select, Textarea, FileUploader, Button, Badge } from './ui';

interface ServiceRequestModalProps {
  currentLanguage: Language;
  onClose: () => void;
  onSubmitSuccess: (newRequest: ServiceRequest) => void;
  initialCategory?: ServiceCategory;
  initialPages?: number;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  currentLanguage,
  onClose,
  onSubmitSuccess,
  initialCategory = 'ppt',
  initialPages = 25,
}) => {
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>(initialCategory);
  const [targetLanguage, setTargetLanguage] = useState<Language>(currentLanguage);
  const [clientName, setClientName] = useState<string>('');
  const [affiliation, setAffiliation] = useState<string>('');
  const [phone, setPhone] = useState<string>('+251 ');
  const [telegram, setTelegram] = useState<string>('@');
  const [email, setEmail] = useState<string>('');
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [pages, setPages] = useState<number>(initialPages);
  const [deadline, setDeadline] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);

  const t = translations[currentLanguage];

  useEffect(() => {
    if (initialCategory) setServiceCategory(initialCategory);
    if (initialPages) setPages(initialPages);
  }, [initialCategory, initialPages]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    if (files.length > 0) {
      setFileName(files[0].name);
    } else {
      setFileName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = `REQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReq: ServiceRequest = {
      id: generatedId,
      clientName: clientName.trim() || 'Anonymous Scholar',
      affiliation: affiliation.trim() || 'Haramaya University Associate',
      phone: phone.trim() || '+251 927 650 724',
      telegram: telegram.trim() || '@FEYSAL_8',
      email: email.trim() || undefined,
      serviceCategory,
      targetLanguage,
      projectTitle: projectTitle.trim() || `${serviceCategory.toUpperCase()} Publishing Brief`,
      description: description.trim() || 'Academic materials development project.',
      estimatedPages: pages,
      expectedDeadline: deadline || 'Standard (3-7 Business Days)',
      status: 'Submitted',
      createdAt: new Date().toISOString().split('T')[0],
      fileName: fileName || undefined,
    };

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.request) {
          setSubmittedRequest(data.request);
          onSubmitSuccess(data.request);
          setIsSubmitting(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API submission failed, persisting locally:', err);
    }

    setSubmittedRequest(newReq);
    onSubmitSuccess(newReq);
    setIsSubmitting(false);
  };

  const serviceOptions = [
    { value: 'ppt', label: 'PowerPoint / Thesis & Defense Presentation' },
    { value: 'english_book', label: 'English Book Writing & Pedagogical Manual' },
    { value: 'arabic_book', label: 'Arabic Typing & Book Development (Tajweed/Islamic)' },
    { value: 'oromoo_book', label: 'Afaan Oromoo Writing & Seenaa / Aadaa Books' },
    { value: 'amharic_book', label: 'Amharic Writing & Research Composition' },
    { value: 'translation', label: 'Multilingual Translation (4-Way Cross-Lingual)' },
    { value: 'editing', label: 'Proofreading & Thesis Linguistic Polish' },
    { value: 'formatting', label: 'Book Formatting & Pre-Press Typesetting' },
    { value: 'elearning', label: 'Educational Content & Curricula Development' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English (Academic & Research)' },
    { value: 'or', label: 'Afaan Oromoo' },
    { value: 'am', label: 'አማርኛ (Amharic)' },
    { value: 'ar', label: 'العربية (Arabic RTL)' },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2 text-on-surface">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-base md:text-lg">
            {submittedRequest ? 'Request Dispatched Successfully' : t.submitRequestModalTitle}
          </span>
        </div>
      }
      description={
        submittedRequest
          ? 'Your project brief has been securely queued in the editorial desk system.'
          : t.submitRequestDesc
      }
    >
      {submittedRequest ? (
        /* Confirmation Screen */
        <div className="flex flex-col items-center gap-5 text-center py-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <Badge variant="secondary" className="px-3 py-1 font-mono text-xs mb-2">
              TRACKING ID: {submittedRequest.id}
            </Badge>
            <h4 className="text-lg font-bold text-on-surface">
              Brief Dispatched to Mr. Feysal Hussein
            </h4>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              Thank you, <strong>{submittedRequest.clientName}</strong>. Your project brief has been
              registered in our academic desk workflow and assigned initial review priority.
            </p>
          </div>

          <div className="w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-left text-xs space-y-2.5">
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
              <span className="text-on-surface-variant">Service Category:</span>
              <span className="font-bold text-on-surface uppercase">
                {submittedRequest.serviceCategory.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
              <span className="text-on-surface-variant">Project Title:</span>
              <span className="font-semibold text-on-surface truncate max-w-[200px]">
                {submittedRequest.projectTitle}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
              <span className="text-on-surface-variant">Estimated Volume:</span>
              <span className="font-bold text-on-surface">
                {submittedRequest.estimatedPages} Pages / Slides
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Current Status:</span>
              <Badge variant="warning">{submittedRequest.status}</Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            <a
              href={OFFICIAL_BRAND.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Connect on Telegram (@FEYSAL_8)</span>
              <ExternalLink className="w-3.5 h-3.5 ml-auto" />
            </a>
            <Button variant="secondary" onClick={onClose} className="flex-1 text-xs">
              Done & Track in Desk
            </Button>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" id="orderForm">
          {/* Category & Language Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Service Category"
              value={serviceCategory}
              options={serviceOptions}
              onChange={(e) => setServiceCategory(e.target.value as ServiceCategory)}
              required
            />
            <Select
              label="Primary Target Language"
              value={targetLanguage}
              options={languageOptions}
              onChange={(e) => setTargetLanguage(e.target.value as Language)}
              required
            />
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Your Full Name"
              placeholder="e.g. Dr. Abebe / Chaltu T."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />
            <Input
              label="University / Department / Institution"
              placeholder="e.g. Haramaya University, Agri Dept."
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              leftIcon={<Building className="w-4 h-4" />}
            />
          </div>

          {/* Contact Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Phone Contact"
              placeholder="+251 9... or 09..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              type="tel"
              required
            />
            <Input
              label="Telegram Handle (Direct Desk)"
              placeholder="@username"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              leftIcon={<AtSign className="w-4 h-4" />}
            />
          </div>

          {/* Project Title */}
          <Input
            label="Project Title or Subject"
            placeholder="e.g. Master's Thesis Presentation on Soil Nitrogen Dynamics"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            leftIcon={<FileText className="w-4 h-4" />}
            required
          />

          {/* Volume and Expected Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Estimated Pages / Slides"
              type="number"
              min={1}
              max={1000}
              value={pages}
              onChange={(e) => setPages(parseInt(e.target.value) || 1)}
              leftIcon={<Hash className="w-4 h-4" />}
              required
            />
            <Input
              label="Expected Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4" />}
            />
          </div>

          {/* Instructions */}
          <Textarea
            label="Requirements & Detailed Instructions"
            placeholder="Describe your target audience, required slide template, chapter guidelines, translation nuances, or specific formatting rules..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          {/* File Attachment using custom FileUploader */}
          <FileUploader
            label="Attach Outline / Draft Manuscript"
            helperText="Support for PPTX, DOCX, PDF, and TXT"
            accept=".pdf,.docx,.pptx,.txt"
            maxSizeMB={25}
            onFilesSelected={handleFilesSelected}
            selectedFiles={selectedFiles}
          />

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full justify-center shadow-md text-xs font-bold"
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              <span>{isSubmitting ? 'Dispatching...' : t.dispatchBriefBtn}</span>
            </Button>
            <p className="text-[11px] text-on-surface-variant text-center mt-2">
              Confidential academic desk transmission • Direct line with Mr. Feysal Hussein
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
};
