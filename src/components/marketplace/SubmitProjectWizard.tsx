import React, { useState } from 'react';
import {
  MarketplaceBusinessType,
  MarketplaceCategory,
  MarketplaceLicenseType,
  MarketplacePlatform,
  MarketplacePricingType,
  MarketplaceProject,
  MarketplaceTechnology,
} from '../../types/marketplace';

interface SubmitProjectWizardProps {
  onClose: () => void;
  onProjectSubmitted: (project: MarketplaceProject) => void;
}

export const SubmitProjectWizard: React.FC<SubmitProjectWizardProps> = ({
  onClose,
  onProjectSubmitted,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [category, setCategory] = useState<MarketplaceCategory>('Web Application');
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [businessType, setBusinessType] = useState<MarketplaceBusinessType>('Small Business');
  const [targetUsersText, setTargetUsersText] = useState('Schools, Businesses, Startups');

  // Tech & Platform
  const [selectedTechnologies, setSelectedTechnologies] = useState<MarketplaceTechnology[]>([
    'React',
    'Node.js',
    'PostgreSQL',
  ]);
  const [platform, setPlatform] = useState<MarketplacePlatform>('Web');
  const [version, setVersion] = useState('1.0.0');
  const [compatibility, setCompatibility] = useState('Cross-browser modern web browsers');

  // Media
  const [thumbnail, setThumbnail] = useState(
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  );
  const [screenshotsText, setScreenshotsText] = useState(
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  );
  const [demoVideoUrl, setDemoVideoUrl] = useState('');

  // Links
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [documentationUrl, setDocumentationUrl] = useState('');

  // Commercial & License
  const [pricingType, setPricingType] = useState<MarketplacePricingType>('Paid');
  const [priceETB, setPriceETB] = useState<number>(25000);
  const [licenseType, setLicenseType] = useState<MarketplaceLicenseType>('Commercial Use');
  const [additionalLicenseInfo, setAdditionalLicenseInfo] = useState('');

  // Rights & Creator
  const [creatorName, setCreatorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorAffiliation, setCreatorAffiliation] = useState('Developer / Individual Creator');
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [featuresText, setFeaturesText] = useState('Authentication, Dashboard, Reports, API Integration');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTech = (tech: MarketplaceTechnology) => {
    if (selectedTechnologies.includes(tech)) {
      setSelectedTechnologies(selectedTechnologies.filter((t) => t !== tech));
    } else {
      setSelectedTechnologies([...selectedTechnologies, tech]);
    }
  };

  const handleNext = () => {
    if (currentStep === 2 && !title) {
      alert('Please enter a Project Name.');
      return;
    }
    if (currentStep === 8 && !rightsConfirmed) {
      alert('You must confirm ownership rights to submit.');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 8));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!rightsConfirmed) {
      alert('Please confirm that you have rights to submit this project.');
      return;
    }

    setIsSubmitting(true);

    const newProject: MarketplaceProject = {
      id: `proj-${Date.now()}`,
      title,
      shortDescription,
      detailedDescription: detailedDescription || shortDescription,
      category,
      businessType,
      technologies: selectedTechnologies,
      platform,
      status: 'Ready to Use',
      creatorName: creatorName || 'Anonymous Creator',
      creatorEmail: creatorEmail || 'creator@wki.edu.et',
      creatorAffiliation,
      pricingType,
      priceETB: pricingType === 'Paid' ? Number(priceETB) : undefined,
      licenseType,
      additionalLicenseInfo,
      thumbnail,
      screenshots: screenshotsText.split('\n').map((s) => s.trim()).filter(Boolean),
      demoVideoUrl,
      liveDemoUrl,
      repositoryUrl,
      documentationUrl,
      features: featuresText.split(',').map((f) => f.trim()).filter(Boolean),
      targetUsers: targetUsersText.split(',').map((u) => u.trim()).filter(Boolean),
      businessUseCases: [
        'Commercial deployment for business automation',
        'SaaS platform foundation',
      ],
      compatibility,
      version,
      lastUpdated: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      reviewStatus: 'Submitted',
      viewsCount: 1,
      favoritesCount: 0,
      demoClicksCount: 0,
      requestsCount: 0,
      isFeatured: false,
      rightsConfirmed: true,
    };

    try {
      await fetch('/api/marketplace/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
    } catch (err) {
      console.warn('Backend project record warning:', err);
    }

    setIsSubmitting(false);
    onProjectSubmitted(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-outline-variant/20 bg-surface-container/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
              Submit Your Digital Work
            </span>
            <h2 className="text-xl font-extrabold text-on-surface">
              Turn Your Digital Work Into a Business Opportunity
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-surface-container/60 p-3 border-b border-outline-variant/20 flex items-center justify-between text-xs overflow-x-auto no-scrollbar">
          {[
            'Type',
            'Info',
            'Tech',
            'Media',
            'Demo',
            'Files',
            'Commercial',
            'Rights',
          ].map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isDone = currentStep > stepNum;
            return (
              <div
                key={idx}
                onClick={() => setCurrentStep(stepNum)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-secondary text-on-secondary font-bold'
                    : isDone
                    ? 'text-emerald-500 font-semibold'
                    : 'text-on-surface-variant opacity-60'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-black/20 text-[10px] flex items-center justify-center">
                  {stepNum}
                </span>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto text-xs space-y-4">
          {/* STEP 1: Project Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-on-surface">Step 1 — Choose Project Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Website',
                  'Web Application',
                  'Mobile Application',
                  'Desktop Application',
                  'Software System',
                  'UI/UX',
                  'SaaS',
                  'E-commerce',
                  'School Management',
                  'Business Management',
                  'Template',
                  'Other',
                ].map((cat) => (
                  <div
                    key={cat}
                    onClick={() => setCategory(cat as any)}
                    className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer font-bold ${
                      category === cat
                        ? 'border-secondary bg-secondary/15 text-secondary shadow-xs'
                        : 'border-outline-variant/30 bg-surface-container/30 hover:border-outline-variant text-on-surface'
                    }`}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Basic Information */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-on-surface">Step 2 — Basic Project Details</h3>
              <div>
                <label className="block font-bold text-on-surface mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Smart Hospital Electronic Records Platform"
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Short Elevator Description *</label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Summarize key commercial capabilities in 2 sentences..."
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Detailed Commercial Overview</label>
                <textarea
                  rows={4}
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                  placeholder="Explain application features, workflow, architecture..."
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Primary Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                  >
                    <option value="Startup">Startup</option>
                    <option value="Small Business">Small Business</option>
                    <option value="School">School</option>
                    <option value="University">University</option>
                    <option value="NGO">NGO</option>
                    <option value="Organization">Organization</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1">Target Users (Comma Separated)</label>
                  <input
                    type="text"
                    value={targetUsersText}
                    onChange={(e) => setTargetUsersText(e.target.value)}
                    placeholder="e.g. Universities, Hospitals, Retail Stores"
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Technology */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-on-surface">Step 3 — Technology Stack & Platform</h3>
              <div>
                <label className="block font-bold text-on-surface mb-2">Select Technologies Used</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'React',
                    'Next.js',
                    'Node.js',
                    'Python',
                    'Django',
                    'Flutter',
                    'Kotlin',
                    'Java',
                    'PHP',
                    'Laravel',
                    'C#',
                    '.NET',
                    'HTML/CSS/JavaScript',
                    'Vue',
                    'FastAPI',
                    'MongoDB',
                    'PostgreSQL',
                    'Tailwind CSS',
                  ].map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech as any)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold cursor-pointer ${
                        selectedTechnologies.includes(tech as any)
                          ? 'bg-secondary text-on-secondary border-secondary'
                          : 'bg-surface-container text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Target Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                  >
                    <option value="Web">Web</option>
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                    <option value="Windows">Windows</option>
                    <option value="Linux">Linux</option>
                    <option value="Cross-platform">Cross-platform</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1">Version</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="1.0.0"
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Project Media */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-on-surface">Step 4 — Project Media & Screenshots</h3>
              <div>
                <label className="block font-bold text-on-surface mb-1">Main Cover Thumbnail URL</label>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Gallery Screenshots URLs (1 per line)</label>
                <textarea
                  rows={3}
                  value={screenshotsText}
                  onChange={(e) => setScreenshotsText(e.target.value)}
                  placeholder="https://image1.jpg&#10;https://image2.jpg"
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Demo Video URL (YouTube / Vimeo)</label>
                <input
                  type="url"
                  value={demoVideoUrl}
                  onChange={(e) => setDemoVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Live Demo */}
          {currentStep === 5 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-on-surface">Step 5 — Live Demo & Link URLs</h3>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <span>Security Notice: Never publicly expose private passwords or credentials.</span>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Live Application URL</label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://demo.myproject.com"
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Public Repository URL (Optional)</label>
                <input
                  type="url"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Documentation URL (Optional)</label>
                <input
                  type="url"
                  value={documentationUrl}
                  onChange={(e) => setDocumentationUrl(e.target.value)}
                  placeholder="https://docs.myproject.com"
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Project Files */}
          {currentStep === 6 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-on-surface">Step 6 — Source Files & Manual Upload</h3>
              <div className="p-6 rounded-2xl border-2 border-dashed border-outline-variant/40 bg-surface-container/30 text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-secondary">cloud_upload</span>
                <div className="font-bold text-on-surface">Drag & Drop ZIP / Source Package Here</div>
                <p className="text-on-surface-variant text-[11px]">
                  Supported file types: ZIP, RAR, 7Z, PDF Manuals (Max size: 250MB)
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 text-[10px] font-bold">
                  Malware & Security Scan Enabled
                </span>
              </div>
            </div>
          )}

          {/* STEP 7: Commercial Information */}
          {currentStep === 7 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-on-surface">Step 7 — Commercial Listing & Pricing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Pricing Model</label>
                  <select
                    value={pricingType}
                    onChange={(e) => setPricingType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                  >
                    <option value="Free">Free Open Access</option>
                    <option value="Paid">Fixed Price (ETB)</option>
                    <option value="Custom Price">Custom Price / Negotiable</option>
                    <option value="Contact Seller">Contact Seller for Quote</option>
                  </select>
                </div>

                {pricingType === 'Paid' && (
                  <div>
                    <label className="block font-bold text-on-surface mb-1">Listing Price (ETB)</label>
                    <input
                      type="number"
                      value={priceETB}
                      onChange={(e) => setPriceETB(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">License Type</label>
                <select
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                >
                  <option value="Personal Use">Personal Use</option>
                  <option value="Commercial Use">Commercial Use</option>
                  <option value="Single Project">Single Project License</option>
                  <option value="Multiple Projects">Multiple Projects License</option>
                  <option value="Custom License">Custom License</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Key Commercial Features (Comma Separated)</label>
                <input
                  type="text"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="e.g. Admin Dashboard, CBE Birr Integration, SMS Alerts"
                  className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                />
              </div>
            </div>
          )}

          {/* STEP 8: Rights & Confirmation */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-on-surface">Step 8 — Creator Information & Intellectual Rights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Creator Name / Organization *</label>
                  <input
                    type="text"
                    required
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="e.g. Feyisa Tolera"
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1">Creator Email *</label>
                  <input
                    type="email"
                    required
                    value={creatorEmail}
                    onChange={(e) => setCreatorEmail(e.target.value)}
                    placeholder="name@wki.edu.et"
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container/60 border border-secondary/30 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rightsConfirmed}
                    onChange={(e) => setRightsConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-secondary rounded cursor-pointer"
                  />
                  <span className="text-xs text-on-surface font-bold leading-relaxed">
                    I confirm that I have the rights to submit this project and that the uploaded content does not knowingly violate another person's intellectual-property rights.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Nav */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container/30 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-bold text-xs cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 8 ? (
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
              disabled={isSubmitting || !rightsConfirmed}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md ${
                rightsConfirmed
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>{isSubmitting ? 'Publishing...' : 'Submit Project for Review'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
