import React, { useState, useEffect } from 'react';
import { Language, ServiceCategory, ServiceRequest } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';
import { translations } from '../utils/translations';

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
  const [fileName, setFileName] = useState<string>('');
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);

  const t = translations[currentLanguage];

  useEffect(() => {
    if (initialCategory) setServiceCategory(initialCategory);
    if (initialPages) setPages(initialPages);
  }, [initialCategory, initialPages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReq: ServiceRequest = {
      id: `REQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: clientName || 'Anonymous Scholar',
      affiliation: affiliation || 'Haramaya University Associate',
      phone: phone || '+251 927 650 724',
      telegram: telegram || '@FEYSAL_8',
      email: email || undefined,
      serviceCategory,
      targetLanguage,
      projectTitle: projectTitle || `${serviceCategory.toUpperCase()} Publishing Brief`,
      description: description || 'Academic materials development project.',
      estimatedPages: pages,
      expectedDeadline: deadline || 'Within 7 Business Days',
      status: 'Submitted',
      createdAt: new Date().toISOString().split('T')[0],
      fileName: fileName || undefined,
    };

    setSubmittedRequest(newReq);
    onSubmitSuccess(newReq);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto animate-in fade-in duration-150"
      id="serviceOrderModal"
    >
      <div className="bg-surface w-full max-w-lg rounded-2xl p-space-md md:p-6 shadow-2xl border border-outline-variant/30 flex flex-col gap-space-sm my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              history_edu
            </span>
            <h3 className="font-title-md text-title-md text-on-surface font-bold">
              {t.submitRequestModalTitle}
            </h3>
          </div>
          <button
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Confirmation Screen if submitted */}
        {submittedRequest ? (
          <div className="p-4 rounded-xl bg-surface-container text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">task_alt</span>
            </div>
            <div>
              <h4 className="font-title-md text-title-md font-bold text-on-surface">
                Request Dispatched Successfully!
              </h4>
              <p className="text-xs text-secondary font-mono font-bold mt-1">
                Tracking ID: {submittedRequest.id}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Thank you, <strong>{submittedRequest.clientName}</strong>. Your project brief has
                been securely registered in the academic desk queue.
              </p>
            </div>

            <div className="w-full p-3 rounded-lg bg-surface-container-lowest text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Service:</span>
                <span className="font-bold text-on-surface uppercase">
                  {submittedRequest.serviceCategory}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Volume:</span>
                <span className="font-bold text-on-surface">
                  {submittedRequest.estimatedPages} Pages / Slides
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status:</span>
                <span className="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-bold">
                  {submittedRequest.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
              <a
                href={OFFICIAL_BRAND.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-lg bg-surface-variant text-on-surface font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-surface-container-highest transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Open in Telegram (@FEYSAL_8)</span>
              </a>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-lg bg-secondary text-on-secondary font-semibold text-xs flex items-center justify-center cursor-pointer hover:opacity-95 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t.submitRequestDesc}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3" id="orderForm">
              {/* Category & Language Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 block">
                    Service Category
                  </label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value as ServiceCategory)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface text-body-sm font-body-sm border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  >
                    <option value="ppt">PowerPoint / Thesis Presentation</option>
                    <option value="english_book">English Book / Workbook</option>
                    <option value="oromoo_book">Afaan Oromoo Book / Seenaa</option>
                    <option value="arabic_book">Arabic Typing & Tajweed</option>
                    <option value="amharic_book">Amharic Book / Text Writing</option>
                    <option value="translation">Multilingual Translation (4-Way)</option>
                    <option value="editing">Proofreading & Thesis Editing</option>
                    <option value="formatting">Book & Monograph Formatting</option>
                    <option value="elearning">E-Learning Curricula Development</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 block">
                    Primary Language
                  </label>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value as Language)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface text-body-sm font-body-sm border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  >
                    <option value="en">English (Academic / Research)</option>
                    <option value="or">Afaan Oromoo</option>
                    <option value="am">አማርኛ (Amharic)</option>
                    <option value="ar">العربية (Arabic RTL)</option>
                  </select>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 block">
                    Your Name
                  </label>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface text-body-sm font-body-sm border border-outline-variant/30 placeholder:text-outline focus:border-secondary focus:outline-none"
                    placeholder="e.g. Dr. Abebe / Chaltu T."
                    required
                    type="text"
                  />
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 block">
                    University / Department
                  </label>
                  <input
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface text-body-sm font-body-sm border border-outline-variant/30 placeholder:text-outline focus:border-secondary focus:outline-none"
                    placeholder="e.g. Haramaya Agri Dept."
                    type="text"
                  />
                </div>
              </div>

              {/* Contact numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 block">
                    Phone Contact
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface text-body-sm font-body-sm border border-outline-variant/30 placeholder:text-outline focus:border-secondary focus:outline-none"
                    placeholder="+251 9..."
                    required
                    type="tel"
                  />
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 block">
                    Telegram Handle (Direct Desk)
                  </label>
                  <input
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface text-body-sm font-body-sm border border-outline-variant/30 placeholder:text-outline focus:border-secondary focus:outline-none"
                    placeholder="@username"
                    type="text"
                  />
                </div>
              </div>

              {/* Project Title & Scope */}
              <div>
                <label className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 block">
                  Project Title or Subject
                </label>
                <input
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface text-body-sm font-body-sm border border-outline-variant/30 placeholder:text-outline focus:border-secondary focus:outline-none"
                  placeholder="e.g. Master's Thesis Presentation on Soil Nitrogen"
                  required
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 block">
                    Estimated Pages / Slides
                  </label>
                  <input
                    value={pages}
                    onChange={(e) => setPages(parseInt(e.target.value) || 5)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface text-body-sm font-body-sm border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    type="number"
                    min="1"
                    max="500"
                    required
                  />
                </div>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 block">
                    Expected Deadline
                  </label>
                  <input
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface text-body-sm font-body-sm border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    type="date"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 block">
                  Requirements & Instructions
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-surface-container text-on-surface text-body-sm font-body-sm border border-outline-variant/30 placeholder:text-outline focus:border-secondary focus:outline-none"
                  placeholder="Describe your target audience, required slide template, chapter guidelines, or specific formatting rules..."
                />
              </div>

              {/* File Attachment */}
              <div className="p-2.5 rounded-lg border border-dashed border-outline-variant/60 bg-surface-container-lowest flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    attach_file
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-on-surface truncate">
                      {fileName || 'Attach Outline / Draft File'}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      PPTX, DOCX, PDF up to 25MB
                    </span>
                  </div>
                </div>
                <label className="px-2.5 py-1 rounded bg-surface-container text-xs font-semibold text-secondary hover:bg-surface-container-high cursor-pointer">
                  Browse
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.pptx,.txt"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <button
                className="mt-1 w-full h-11 rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                type="submit"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>{t.dispatchBriefBtn}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
