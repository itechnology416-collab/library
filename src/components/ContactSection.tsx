import React, { useState } from 'react';
import { Language } from '../types';
import { OFFICIAL_BRAND } from '../data/initialData';

interface ContactSectionProps {
  currentLanguage: Language;
}

export const ContactSection: React.FC<ContactSectionProps & { onRequestService?: () => void }> = ({
  currentLanguage,
  onRequestService,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    telegram: '',
    email: '',
    service: 'ppt',
    message: '',
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error('Contact submission error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <section className="px-gutter-mobile py-10 bg-surface" id="contact">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
            Communication & Inquiries
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-3xl md:text-4xl text-on-surface font-bold">
            Contact Wirtuu Kompiitaraa Ilillii
          </h1>
          <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
            Connect directly with <strong>Mr. Feysal Hussein</strong> and our academic publishing desk at Haramaya University.
          </p>

          {/* Quick Action Button Ribbon (Section 25 of PDF) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`tel:${OFFICIAL_BRAND.phone1.replace(/\s+/g, '')}`}
              className="h-10 px-4 rounded-xl bg-secondary text-on-secondary text-xs font-bold flex items-center gap-2 hover:brightness-105 active:scale-95 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>Call Now</span>
            </a>
            <a
              href={OFFICIAL_BRAND.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-xl bg-[#0088cc] text-white text-xs font-bold flex items-center gap-2 hover:brightness-105 active:scale-95 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Message on Telegram</span>
            </a>
            {onRequestService && (
              <button
                onClick={onRequestService}
                className="h-10 px-4 rounded-xl bg-surface-container-highest hover:bg-surface-container text-on-surface text-xs font-bold flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">edit_document</span>
                <span>Request a Service</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Direct Contact Cards */}
          <div className="space-y-4">
            {/* Phone Card */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">call</span>
              </div>
              <div>
                <h3 className="font-title-sm text-sm font-bold text-on-surface">
                  Phone Numbers
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Direct lines for instant consultation:
                </p>
              </div>
              <div className="space-y-2 pt-1 text-xs font-bold">
                <a
                  href={`tel:${OFFICIAL_BRAND.phone1.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container hover:bg-secondary/10 text-on-surface hover:text-secondary transition-colors"
                >
                  <span>{OFFICIAL_BRAND.phone1}</span>
                  <span className="material-symbols-outlined text-[16px]">call</span>
                </a>
                <a
                  href={`tel:${OFFICIAL_BRAND.phone2.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container hover:bg-secondary/10 text-on-surface hover:text-secondary transition-colors"
                >
                  <span>{OFFICIAL_BRAND.phone2}</span>
                  <span className="material-symbols-outlined text-[16px]">call</span>
                </a>
              </div>
            </div>

            {/* Telegram Card */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">send</span>
              </div>
              <div>
                <h3 className="font-title-sm text-sm font-bold text-on-surface">
                  Telegram
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Direct manuscript transfer & voice consultation:
                </p>
              </div>
              <a
                href={OFFICIAL_BRAND.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] font-bold text-xs transition-colors"
              >
                <span>{OFFICIAL_BRAND.telegramHandle}</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>

            {/* Academic Affiliation Card */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">school</span>
              </div>
              <div>
                <h3 className="font-title-sm text-sm font-bold text-on-surface">
                  Academic Affiliation
                </h3>
                <p className="text-xs text-on-surface font-semibold mt-1">
                  {OFFICIAL_BRAND.founder}
                </p>
                <p className="text-xs text-secondary mt-0.5">
                  {OFFICIAL_BRAND.affiliation}, Ethiopia
                </p>
              </div>
              <p className="text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/20">
                Operating hours: Monday – Saturday (8:00 AM – 6:30 PM EAT)
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-6">
            <div>
              <h3 className="font-title-lg text-lg font-bold text-on-surface">
                Send a Message or Project Inquiry
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Submit your query below and Mr. Feysal Hussein will review your requirements.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2 text-center">
                <span className="material-symbols-outlined text-[40px] text-emerald-600 block">
                  check_circle
                </span>
                <h4 className="font-bold text-base">Thank you. Your message has been received.</h4>
                <p className="text-xs text-emerald-800">
                  We will review your requirements and contact you promptly via phone or Telegram.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-on-surface">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Abebe Kebede"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-on-surface">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+251 9... or 09..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-on-surface">Telegram Username</label>
                    <input
                      type="text"
                      placeholder="@username (optional)"
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-on-surface">Email (optional)</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-on-surface">Select Service</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full p-3 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  >
                    <option value="ppt">PPT Design / Presentation</option>
                    <option value="english_book">English Book Writing & Development</option>
                    <option value="arabic_book">Arabic Writing & Books</option>
                    <option value="oromoo_book">Afaan Oromoo Writing & Books</option>
                    <option value="amharic_book">Amharic Writing</option>
                    <option value="translation">Translation (6 Language Pairs)</option>
                    <option value="editing">Editing & Proofreading</option>
                    <option value="formatting">Book Formatting & Typesetting</option>
                    <option value="elearning">E-learning Content</option>
                    <option value="other">Other Academic Publishing Request</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-on-surface">Project Description / Requirements *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your project, target pages or slide count, preferred deadlines, and specific requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-on-surface-variant">
                    * Confidential and secure communication.
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <span>Send Message</span>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
