import React, { useState } from 'react';
import { MarketplacePlatform, MarketplaceProject, MarketplaceRequest } from '../../types/marketplace';

interface ProjectRequestModalProps {
  project: MarketplaceProject | null;
  initialAction?: string;
  onClose: () => void;
  onSubmitRequest: (request: MarketplaceRequest) => void;
}

export const ProjectRequestModal: React.FC<ProjectRequestModalProps> = ({
  project,
  initialAction = 'Buy/License',
  onClose,
  onSubmitRequest,
}) => {
  const [step, setStep] = useState<number>(1);
  const [actionType, setActionType] = useState<
    'Buy/License' | 'Request Customization' | 'Request Demo' | 'Contact Creator'
  >(
    (initialAction as any) || 'Buy/License'
  );

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerOrganization, setCustomerOrganization] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [requirements, setRequirements] = useState('');
  const [requiredFeaturesText, setRequiredFeaturesText] = useState('');
  const [preferredPlatform, setPreferredPlatform] = useState<MarketplacePlatform>(
    project?.platform || 'Web'
  );
  const [customizationRequirements, setCustomizationRequirements] = useState('');
  const [budgetRange, setBudgetRange] = useState('25,000 - 50,000 ETB');
  const [deadline, setDeadline] = useState('');
  const [paymentGateway, setPaymentGateway] = useState<'chapa' | 'telebirr' | 'safaricom' | 'cbe'>('chapa');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<MarketplaceRequest | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<{
    txRef?: string;
    licenseKey?: string;
    checkoutUrl?: string;
    payableAmount?: number;
  } | null>(null);

  if (!project) return null;

  const handleNext = () => {
    if (step === 2) {
      if (!customerName || !customerPhone) {
        alert('Please fill in your name and phone number.');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const newRequest: MarketplaceRequest = {
      id: `req-${Date.now()}`,
      projectId: project.id,
      projectTitle: project.title,
      actionType,
      customerName,
      customerOrganization,
      customerPhone,
      customerEmail,
      requirements,
      requiredFeatures: requiredFeaturesText.split(',').map((f) => f.trim()).filter(Boolean),
      preferredPlatform,
      customizationRequirements,
      budgetRange,
      deadline: deadline || 'Negotiable',
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: customerName,
          senderRole: 'customer',
          message: `Inquiry submitted for project "${project.title}". Action: ${actionType}. Requirements: ${requirements}`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      await fetch('/api/marketplace/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest),
      });

      if (actionType === 'Buy/License') {
        const checkoutRes = await fetch('/api/marketplace/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: project.id,
            customerName,
            customerEmail,
            customerPhone,
            paymentMethod: paymentGateway,
          }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.success) {
          setCheckoutResult({
            txRef: checkoutData.txRef,
            licenseKey: checkoutData.licenseKey,
            checkoutUrl: checkoutData.checkoutUrl,
            payableAmount: checkoutData.payableAmount,
          });
        }
      }
    } catch (err) {
      console.warn('Backend request record warning:', err);
    }

    setIsSubmitting(false);
    setSubmittedRequest(newRequest);
    onSubmitRequest(newRequest);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container/30">
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
              Commercial Marketplace Request
            </span>
            <h3 className="text-lg font-bold text-on-surface line-clamp-1">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-container h-1.5">
          <div
            className="bg-secondary h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Content Steps */}
        <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Select Action */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-on-surface mb-1">
                  Step 1 — Select Business Marketplace Action
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Choose how you wish to engage with the project creator or publishing hub.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    id: 'Buy/License',
                    label: 'Buy / License Project',
                    desc: 'Acquire source code or deployment license for immediate implementation.',
                    icon: 'shopping_cart',
                  },
                  {
                    id: 'Request Customization',
                    label: 'Request Customization',
                    desc: 'Request tailored feature additions, branding, or database changes.',
                    icon: 'tune',
                  },
                  {
                    id: 'Request Demo',
                    label: 'Request Live Demo',
                    desc: 'Schedule a guided virtual demonstration with technical team.',
                    icon: 'slideshow',
                  },
                  {
                    id: 'Contact Creator',
                    label: 'Contact Creator Directly',
                    desc: 'Submit a message to discuss commercial options or partnerships.',
                    icon: 'mail',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActionType(item.id as any)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      actionType === item.id
                        ? 'border-secondary bg-secondary/10 shadow-sm'
                        : 'border-outline-variant/30 bg-surface-container/30 hover:border-outline-variant'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="material-symbols-outlined text-[22px] text-secondary">
                          {item.icon}
                        </span>
                        {actionType === item.id && (
                          <span className="material-symbols-outlined text-[18px] text-secondary">
                            check_circle
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-sm text-on-surface">{item.label}</div>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Business Requirements */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-on-surface mb-1">
                  Step 2 — Business Requirements & Contact Info
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Provide your organization details and project specifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g., Abebe Bikila"
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1">Organization / Business</label>
                  <input
                    type="text"
                    value={customerOrganization}
                    onChange={(e) => setCustomerOrganization(e.target.value)}
                    placeholder="e.g., Oromia Credit Association"
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+251 9..."
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                  />
                </div>
              </div>

              <div className="text-xs space-y-3 pt-2 border-t border-outline-variant/15">
                <div>
                  <label className="block font-bold text-on-surface mb-1">
                    Project Requirements / Summary
                  </label>
                  <textarea
                    rows={3}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Describe your goals, deployment environment, or specific request..."
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-on-surface mb-1">Budget Range</label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                    >
                      <option value="Under 25,000 ETB">Under 25,000 ETB</option>
                      <option value="25,000 - 50,000 ETB">25,000 - 50,000 ETB</option>
                      <option value="50,000 - 100,000 ETB">50,000 - 100,000 ETB</option>
                      <option value="Above 100,000 ETB">Above 100,000 ETB</option>
                      <option value="Custom Quote / Negotiable">Custom Quote / Negotiable</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-on-surface mb-1">Target Deadline</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-base font-bold text-on-surface mb-1">
                  Step 3 — Review Your Request
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Please verify your submitted request details before sending to the marketplace.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/20 space-y-2">
                <div className="flex justify-between border-b border-outline-variant/15 pb-2">
                  <span className="font-bold text-on-surface">Target Project:</span>
                  <span className="text-secondary font-bold">{project.title}</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/15 pb-2">
                  <span className="font-bold text-on-surface">Action Selected:</span>
                  <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary font-bold">
                    {actionType}
                  </span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/15 pb-2">
                  <span className="font-bold text-on-surface">Contact Person:</span>
                  <span>
                    {customerName} {customerOrganization ? `(${customerOrganization})` : ''}
                  </span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/15 pb-2">
                  <span className="font-bold text-on-surface">Phone & Email:</span>
                  <span className="font-mono">
                    {customerPhone} {customerEmail ? `| ${customerEmail}` : ''}
                  </span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/15 pb-2">
                  <span className="font-bold text-on-surface">Budget Range:</span>
                  <span className="font-mono text-secondary font-bold">{budgetRange}</span>
                </div>

                {actionType === 'Buy/License' && (
                  <div className="pt-2 border-t border-outline-variant/15">
                    <label className="block font-bold text-on-surface mb-2">
                      Select Payment Gateway for License:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'chapa', label: 'Chapa (Cards/Banks)', icon: 'credit_card' },
                        { id: 'telebirr', label: 'Telebirr Wallet', icon: 'smartphone' },
                        { id: 'safaricom', label: 'M-Pesa STK', icon: 'send_to_mobile' },
                        { id: 'cbe', label: 'CBE Birr', icon: 'account_balance' },
                      ].map((gw) => (
                        <div
                          key={gw.id}
                          onClick={() => setPaymentGateway(gw.id as any)}
                          className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                            paymentGateway === gw.id
                              ? 'border-secondary bg-secondary/15 font-bold text-secondary'
                              : 'border-outline-variant/20 bg-surface-container text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px] block mx-auto mb-1">
                            {gw.icon}
                          </span>
                          <span className="text-[10px] leading-tight block">{gw.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-1">
                  <span className="font-bold text-on-surface block mb-1">Requirements Summary:</span>
                  <p className="text-on-surface-variant italic bg-surface-container p-2.5 rounded-xl">
                    "{requirements || 'Standard licensing request.'}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation & License Certificate */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[36px]">check_circle</span>
              </div>
              <h4 className="text-xl font-bold text-on-surface">
                Your project request has been submitted successfully.
              </h4>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Request reference <span className="font-mono font-bold text-secondary">{submittedRequest?.id}</span> has been logged. The creator and Wirtuu publishing desk will reach out via phone/email shortly.
              </p>

              {/* License Certificate Box if Buy/License */}
              {checkoutResult && (
                <div className="p-4 rounded-2xl bg-surface-container/60 border border-secondary/40 text-left space-y-2 text-xs">
                  <div className="font-bold text-secondary uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                    <span>Official Provisional License Certificate</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/15 pb-1">
                    <span className="text-on-surface font-semibold">License Key:</span>
                    <span className="font-mono font-bold text-secondary">{checkoutResult.licenseKey}</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/15 pb-1">
                    <span className="text-on-surface font-semibold">Transaction Ref:</span>
                    <span className="font-mono">{checkoutResult.txRef}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-on-surface font-semibold">Payable Amount:</span>
                    <span className="font-mono font-bold text-on-surface">
                      {checkoutResult.payableAmount ? `${checkoutResult.payableAmount.toLocaleString()} ETB` : 'Contact for Final Invoice'}
                    </span>
                  </div>

                  {checkoutResult.checkoutUrl && (
                    <div className="pt-2">
                      <a
                        href={checkoutResult.checkoutUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-md transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">payment</span>
                        <span>Complete Payment via {paymentGateway.toUpperCase()}</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs shadow-md cursor-pointer"
                >
                  Return to Marketplace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Nav Buttons */}
        {step < 4 && (
          <div className="p-4 border-t border-outline-variant/20 bg-surface-container/30 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-bold text-xs cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
