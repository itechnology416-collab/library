import React, { useState } from 'react';
import { AcademicQuotation, Language, QuotationLineItem, ServiceCategory, ServiceRequest } from '../types';
import { OFFICIAL_PAYMENT_INFO, OPTIONAL_ADDONS, PRICING_BASE_RATES } from '../data/academicToolsData';

interface QuotationGeneratorModalProps {
  initialCategory?: ServiceCategory;
  initialPages?: number;
  onClose: () => void;
  onSubmitAsProject?: (req: ServiceRequest) => void;
}

export const QuotationGeneratorModal: React.FC<QuotationGeneratorModalProps> = ({
  initialCategory = 'ppt',
  initialPages = 25,
  onClose,
  onSubmitAsProject,
}) => {
  const [clientName, setClientName] = useState<string>('Dr. Amina Tadesse');
  const [affiliation, setAffiliation] = useState<string>('Haramaya University, College of Agriculture');
  const [projectTitle, setProjectTitle] = useState<string>('Doctoral Defense Slide Deck & Monograph Formatting');
  const [category, setCategory] = useState<ServiceCategory>(initialCategory);
  const [pages, setPages] = useState<number>(initialPages);
  const [urgency, setUrgency] = useState<'standard' | 'express' | 'emergency'>('standard');
  const [currency, setCurrency] = useState<'ETB' | 'USD'>('ETB');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['defense_notes']);
  const [phone, setPhone] = useState<string>('+251 91 123 4567');
  const [telegram, setTelegram] = useState<string>('@amina_research');
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  // Quote Generation Date & Serial
  const quoteNumber = `WKI-EST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  
  // Delivery calculation
  const getDeliveryDate = () => {
    const d = new Date();
    if (urgency === 'emergency') d.setDate(d.getDate() + 1);
    else if (urgency === 'express') d.setDate(d.getDate() + 3);
    else d.setDate(d.getDate() + 7);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Pricing calculations
  const baseRate = PRICING_BASE_RATES[category] || PRICING_BASE_RATES.ppt;
  const unitPrice = currency === 'ETB' ? baseRate.etbPerPage : baseRate.usdPerPage;
  const baseSubtotal = unitPrice * pages;

  // Addons total
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = OPTIONAL_ADDONS.find((a) => a.id === addonId);
    if (!addon) return sum;
    return sum + (currency === 'ETB' ? addon.etbFixed : addon.usdFixed);
  }, 0);

  const rawTotal = baseSubtotal + addonsTotal;

  // Urgency multiplier
  const urgencyMultiplier = urgency === 'emergency' ? 0.5 : urgency === 'express' ? 0.2 : 0;
  const urgencySurcharge = rawTotal * urgencyMultiplier;

  // Institutional discount (10% standard academic waiver)
  const institutionalDiscount = (rawTotal + urgencySurcharge) * 0.1;
  const grandTotal = rawTotal + urgencySurcharge - institutionalDiscount;

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summary = `WIRTUUN KOMPIITARAA ILILLII - OFFICIAL QUOTATION
Quotation #: ${quoteNumber}
Client: ${clientName} (${affiliation})
Project: ${projectTitle}
Category: ${baseRate.label} (${pages} pages/slides)
Urgency: ${urgency.toUpperCase()} (Est. Delivery: ${getDeliveryDate()})
Grand Total: ${currency === 'ETB' ? `${grandTotal.toLocaleString()} ETB` : `$${grandTotal.toFixed(2)} USD`}
Authorized: Mr. Feysal Hussein (Managing Director)
CBE Account: ${OFFICIAL_PAYMENT_INFO.cbeAccount}
Telebirr: ${OFFICIAL_PAYMENT_INFO.telebirrNumber}`;

    navigator.clipboard.writeText(summary);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 3000);
  };

  const handleCreateProject = () => {
    if (!onSubmitAsProject) return;
    const newReq: ServiceRequest = {
      id: `WKI-${Date.now().toString().slice(-4)}`,
      clientName,
      affiliation,
      phone,
      telegram,
      email: `${clientName.toLowerCase().replace(/\s+/g, '.')}@haramaya.edu.et`,
      serviceCategory: category,
      targetLanguage: 'en',
      projectTitle,
      description: `Formalized Project from Pro-Forma Quote ${quoteNumber}. Urgency: ${urgency}. Add-ons: ${selectedAddons.join(', ')}. Quoted Total: ${currency === 'ETB' ? `${grandTotal.toLocaleString()} ETB` : `$${grandTotal.toFixed(2)} USD`}`,
      estimatedPages: pages,
      expectedDeadline: getDeliveryDate(),
      status: 'Submitted',
      createdAt: todayStr,
      adminNotes: `Authorized from Pro-Forma Quote ${quoteNumber}. Payment method verified for CBE / Telebirr.`,
      deliverables: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'Mr. Feysal Hussein',
          senderRole: 'admin',
          message: `Official pro-forma quotation ${quoteNumber} received and registered into the academic editorial queue. We will review your brief immediately.`,
          timestamp: 'Just now',
        },
      ],
      revisions: [],
    };
    onSubmitAsProject(newReq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-surface-container border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/30">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span>Official Pro-Forma Academic Quotation</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-mono font-bold">
                  {quoteNumber}
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant">
                Wirtuu Kompiitaraa Ilillii • Haramaya University Academic Publishing Directorate
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Configuration Controls (Interactive) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
            {/* Service & Scope */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                1. Service Discipline
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/30 text-xs font-semibold text-on-surface focus:outline-hidden focus:border-secondary"
              >
                <option value="ppt">Doctoral / MSc Defense Slides</option>
                <option value="english_book">English Academic Textbook</option>
                <option value="oromoo_book">Afaan Oromoo Monograph</option>
                <option value="arabic_book">Arabic & Tajweed Typography</option>
                <option value="amharic_book">Amharic Monograph & Layout</option>
                <option value="translation">4-Way Academic Translation</option>
                <option value="editing">Linguistic Copyediting (APA 7th)</option>
                <option value="formatting">Thesis Formatting & PDF/X-1a</option>
              </select>

              <div>
                <div className="flex justify-between text-xs font-bold text-on-surface mb-1">
                  <span>Volume:</span>
                  <span className="text-secondary font-mono">{pages} Pages/Slides</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={250}
                  value={pages}
                  onChange={(e) => setPages(parseInt(e.target.value))}
                  className="w-full accent-secondary h-2 bg-surface-container-highest rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Urgency & Currency */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                2. Urgency & Currency
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'standard', label: 'Std 7d', sub: '+0%' },
                  { id: 'express', label: 'Exp 3d', sub: '+20%' },
                  { id: 'emergency', label: 'Rush 24h', sub: '+50%' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setUrgency(tier.id as any)}
                    className={`py-1.5 px-1 rounded-lg text-center text-xs font-bold transition-all cursor-pointer ${
                      urgency === tier.id
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'bg-surface border border-outline-variant/30 text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <div>{tier.label}</div>
                    <div className="text-[10px] opacity-80">{tier.sub}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-on-surface">Billing Currency:</span>
                <div className="inline-flex p-0.5 rounded-lg bg-surface-container border border-outline-variant/30">
                  <button
                    onClick={() => setCurrency('ETB')}
                    className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                      currency === 'ETB' ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant'
                    }`}
                  >
                    ETB (Birr)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                      currency === 'USD' ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant'
                    }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>
            </div>

            {/* Author / Client Info */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                3. Author & Department
              </label>
              <input
                type="text"
                placeholder="Author Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-outline-variant/30 text-xs text-on-surface"
              />
              <input
                type="text"
                placeholder="Institution / College"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-outline-variant/30 text-xs text-on-surface"
              />
              <input
                type="text"
                placeholder="Project Title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-outline-variant/30 text-xs text-on-surface"
              />
            </div>
          </div>

          {/* Optional Addons Toggles */}
          <div>
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-2">
              Optional Academic Add-ons & Certifications
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OPTIONAL_ADDONS.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                const priceStr = currency === 'ETB' ? `+${addon.etbFixed} ETB` : `+$${addon.usdFixed} USD`;
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-secondary bg-secondary/5'
                        : 'border-outline-variant/20 bg-surface hover:border-outline-variant/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-0.5 accent-secondary"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex justify-between font-bold text-on-surface">
                        <span>{addon.name}</span>
                        <span className="text-secondary font-mono">{priceStr}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{addon.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Printable Official Invoice Card */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant/30 shadow-md relative overflow-hidden" id="printable-invoice">
            
            {/* Top Watermark / Seal */}
            <div className="absolute right-4 top-4 opacity-10 pointer-events-none select-none">
              <span className="material-symbols-outlined text-[140px] text-primary">verified</span>
            </div>

            {/* Letterhead */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant/20 pb-4 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-secondary block">
                  Institutional Pro-Forma Invoice
                </span>
                <h3 className="text-xl font-extrabold text-on-surface">
                  Wirtuu Kompiitaraa Ilillii
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Directorate of Academic Publishing & Digital Composition
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Haramaya University Main Campus • Oromia, Ethiopia
                </p>
              </div>

              <div className="text-right text-xs space-y-0.5">
                <div className="font-bold text-on-surface font-mono">Serial: {quoteNumber}</div>
                <div className="text-on-surface-variant">Date: {todayStr}</div>
                <div className="text-on-surface-variant">Valid Until: 30 Days</div>
                <div className="text-secondary font-semibold">Target Delivery: {getDeliveryDate()}</div>
              </div>
            </div>

            {/* Client Particulars */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-outline-variant/20">
              <div>
                <span className="font-bold text-on-surface block uppercase tracking-wider text-[10px]">Client / Principal Author:</span>
                <div className="font-semibold text-on-surface text-sm mt-0.5">{clientName || 'Valued Academic Client'}</div>
                <div className="text-on-surface-variant">{affiliation || 'Haramaya University'}</div>
              </div>
              <div>
                <span className="font-bold text-on-surface block uppercase tracking-wider text-[10px]">Project Scope:</span>
                <div className="font-semibold text-on-surface mt-0.5">{projectTitle}</div>
                <div className="text-secondary font-medium">{baseRate.label} • {urgency.toUpperCase()} Tier</div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/20 text-on-surface-variant font-bold text-[11px]">
                    <th className="text-left py-2">Item Description</th>
                    <th className="text-center py-2">Quantity</th>
                    <th className="text-right py-2">Unit Price</th>
                    <th className="text-right py-2">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                  <tr>
                    <td className="py-2.5">
                      <div className="font-bold">{baseRate.label}</div>
                      <div className="text-[11px] text-on-surface-variant">
                        High-definition academic typography, chapter pagination, grid alignment & master export
                      </div>
                    </td>
                    <td className="text-center py-2.5 font-mono">{pages} pages/slides</td>
                    <td className="text-right py-2.5 font-mono">
                      {currency === 'ETB' ? `${unitPrice} ETB` : `$${unitPrice.toFixed(2)}`}
                    </td>
                    <td className="text-right py-2.5 font-bold font-mono">
                      {currency === 'ETB' ? `${baseSubtotal.toLocaleString()} ETB` : `$${baseSubtotal.toFixed(2)}`}
                    </td>
                  </tr>

                  {selectedAddons.map((addonId) => {
                    const addon = OPTIONAL_ADDONS.find((a) => a.id === addonId);
                    if (!addon) return null;
                    const price = currency === 'ETB' ? addon.etbFixed : addon.usdFixed;
                    return (
                      <tr key={addon.id}>
                        <td className="py-2">
                          <div className="font-semibold">{addon.name}</div>
                          <div className="text-[11px] text-on-surface-variant">{addon.description}</div>
                        </td>
                        <td className="text-center py-2 font-mono">1 Package</td>
                        <td className="text-right py-2 font-mono">
                          {currency === 'ETB' ? `${price} ETB` : `$${price.toFixed(2)}`}
                        </td>
                        <td className="text-right py-2 font-bold font-mono">
                          {currency === 'ETB' ? `${price.toLocaleString()} ETB` : `$${price.toFixed(2)}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Totals Calculation */}
            <div className="border-t border-outline-variant/20 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              {/* Payment Bank Details */}
              <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 text-xs space-y-1 max-w-sm">
                <div className="font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">account_balance</span>
                  <span>Official Institutional Payment Accounts</span>
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  <strong>Commercial Bank of Ethiopia (CBE):</strong> {OFFICIAL_PAYMENT_INFO.cbeAccount}
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  <strong>Telebirr:</strong> {OFFICIAL_PAYMENT_INFO.telebirrNumber} ({OFFICIAL_PAYMENT_INFO.directorName})
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  <strong>Telegram Direct:</strong> {OFFICIAL_PAYMENT_INFO.telegramHandle}
                </div>
              </div>

              {/* Subtotal & Grand Total */}
              <div className="w-full sm:w-64 text-xs space-y-1.5 text-right">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Gross Subtotal:</span>
                  <span className="font-mono">
                    {currency === 'ETB' ? `${rawTotal.toLocaleString()} ETB` : `$${rawTotal.toFixed(2)}`}
                  </span>
                </div>
                {urgencySurcharge > 0 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
                    <span>{urgency.toUpperCase()} Urgency Surcharge:</span>
                    <span className="font-mono">
                      {currency === 'ETB' ? `+${urgencySurcharge.toLocaleString()} ETB` : `+$${urgencySurcharge.toFixed(2)}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Academic Institutional Grant (-10%):</span>
                  <span className="font-mono">
                    {currency === 'ETB' ? `-${institutionalDiscount.toLocaleString()} ETB` : `-$${institutionalDiscount.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-outline-variant/30 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-on-surface">Net Quoted Total:</span>
                  <span className="text-lg font-black text-secondary font-mono">
                    {currency === 'ETB' ? `${grandTotal.toLocaleString()} ETB` : `$${grandTotal.toFixed(2)} USD`}
                  </span>
                </div>
              </div>
            </div>

            {/* Signatory Endorsement */}
            <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                <span>Officially endorsed by Director Mr. Feysal Hussein, Haramaya University</span>
              </div>
              <div className="font-serif italic text-[11px]">
                "Precision In Scholarly Dissemination"
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="px-6 py-4 bg-surface-container border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-surface border border-outline-variant/30 hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-2 rounded-xl bg-surface border border-outline-variant/30 hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedQuote ? 'check' : 'content_copy'}
              </span>
              <span>{copiedQuote ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>
            <a
              href={`https://t.me/feysal_ilillii?text=${encodeURIComponent(
                `Hello Mr. Feysal, I have generated official quotation ${quoteNumber} for ${projectTitle} (${pages} pages). Quoted Total: ${
                  currency === 'ETB' ? `${grandTotal.toLocaleString()} ETB` : `$${grandTotal.toFixed(2)} USD`
                }. Please confirm production.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-[#229ED9]/15 text-[#229ED9] hover:bg-[#229ED9]/25 font-semibold text-xs flex items-center gap-1.5 cursor-pointer border border-[#229ED9]/30"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Telegram Order</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface font-bold text-xs cursor-pointer"
            >
              Close
            </button>
            {onSubmitAsProject && (
              <button
                type="button"
                onClick={handleCreateProject}
                className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                <span>Confirm & Submit Project</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
