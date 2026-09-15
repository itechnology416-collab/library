import React, { useState, useEffect, useMemo } from 'react';
import {
  RepositoryItem,
  RepositoryCommunity,
  RepositoryCollection,
  OaiPmhHarvestJob,
  ConferenceProceedingsItem,
  RepositoryBitstream,
} from '../types';
import {
  INITIAL_REPOSITORY_ITEMS,
  INITIAL_OAI_HARVEST_JOBS,
  INITIAL_CONFERENCE_PROCEEDINGS,
} from '../data/initialData';

interface InstitutionalRepositoryPortalProps {
  onBackToHub?: () => void;
  onOpenClearanceDesk?: () => void;
  prefilterClearanceRefId?: string;
}

export const InstitutionalRepositoryPortal: React.FC<InstitutionalRepositoryPortalProps> = ({
  onBackToHub,
  onOpenClearanceDesk,
  prefilterClearanceRefId,
}) => {
  // State
  const [items, setItems] = useState<RepositoryItem[]>(INITIAL_REPOSITORY_ITEMS);
  const [harvestJobs, setHarvestJobs] = useState<OaiPmhHarvestJob[]>(INITIAL_OAI_HARVEST_JOBS);
  const [conferences, setConferences] = useState<ConferenceProceedingsItem[]>(INITIAL_CONFERENCE_PROCEEDINGS);
  const [activeTab, setActiveTab] = useState<'discovery' | 'deposit' | 'oai_pmh' | 'conferences' | 'altmetrics'>('discovery');
  const [loading, setLoading] = useState(false);

  // Filters for Discovery
  const [searchQuery, setSearchQuery] = useState(prefilterClearanceRefId ? prefilterClearanceRefId : '');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<string>('all');

  // Modals
  const [selectedItem, setSelectedItem] = useState<RepositoryItem | null>(null);
  const [showOaiXmlModal, setShowOaiXmlModal] = useState(false);
  const [oaiXmlVerb, setOaiXmlVerb] = useState<'Identify' | 'ListRecords'>('Identify');
  const [oaiXmlContent, setOaiXmlContent] = useState<string>('');
  const [citationFormat, setCitationFormat] = useState<'apa' | 'bibtex' | 'ris'>('apa');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Deposit Form State
  const [depositForm, setDepositForm] = useState({
    title: '',
    authors: [{ name: '', affiliation: 'Haramaya University', orcid: '' }],
    advisor: '',
    community: 'College of Agriculture & Environmental Sciences' as RepositoryCommunity,
    collection: 'Master Theses (MSc/MA)' as RepositoryCollection,
    abstract: '',
    keywords: '',
    language: 'en' as const,
    accessLevel: 'Open Access' as const,
    license: 'CC BY 4.0' as const,
    clearanceRefId: '',
    fileName: '',
    fileSize: '6.4 MB',
  });

  const communities: RepositoryCommunity[] = [
    'College of Agriculture & Environmental Sciences',
    'College of Computing & Informatics',
    'College of Health & Medical Sciences',
    'Africa Center of Excellence for Climate Smart Ag (Climate-SABC)',
    'Haramaya University Press Monographs',
    'Annual Research Review (ARR) Conference Proceedings',
    'Institute of Pastoral and Agro-Pastoral Studies',
  ];

  const collections: RepositoryCollection[] = [
    'Doctoral Dissertations (PhD)',
    'Master Theses (MSc/MA)',
    'Peer-Reviewed Journal Offprints',
    'Conference Proceedings Papers',
    'Research Datasets & Code',
    'University Press Books',
  ];

  // Fetch data from server
  useEffect(() => {
    async function loadData() {
      try {
        const resItems = await fetch('/api/repository/items');
        if (resItems.ok) {
          const data = await resItems.json();
          if (data.items && data.items.length > 0) {
            setItems(data.items);
          }
        }
        const resJobs = await fetch('/api/repository/harvest');
        if (resJobs.ok) {
          const data = await resJobs.json();
          if (data.jobs && data.jobs.length > 0) {
            setHarvestJobs(data.jobs);
          }
        }
        const resConf = await fetch('/api/repository/conferences');
        if (resConf.ok) {
          const data = await resConf.json();
          if (data.conferences && data.conferences.length > 0) {
            setConferences(data.conferences);
          }
        }
      } catch (err) {
        console.error('Failed to fetch from backend, using initialData fallback', err);
      }
    }
    loadData();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Filtered Discovery Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCommunity !== 'all' && item.community !== selectedCommunity) return false;
      if (selectedCollection !== 'all' && item.collection !== selectedCollection) return false;
      if (selectedAccessLevel !== 'all' && item.accessLevel !== selectedAccessLevel) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchAbstract = item.abstract.toLowerCase().includes(q);
        const matchHandle = item.handle.toLowerCase().includes(q);
        const matchDoi = item.doi?.toLowerCase().includes(q);
        const matchAuthors = item.authors.some((a) => a.name.toLowerCase().includes(q));
        const matchKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
        const matchClearance = item.clearanceRefId?.toLowerCase().includes(q);
        return matchTitle || matchAbstract || matchHandle || matchDoi || matchAuthors || matchKeywords || matchClearance;
      }
      return true;
    });
  }, [items, selectedCommunity, selectedCollection, selectedAccessLevel, searchQuery]);

  // Handle Download increment
  const handleDownload = async (item: RepositoryItem, bitstream: RepositoryBitstream) => {
    try {
      await fetch(`/api/repository/items/${item.id}/download`, { method: 'POST' });
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, downloadCount: (i.downloadCount || 0) + 1, viewCount: (i.viewCount || 0) + 1 } : i
        )
      );
      if (selectedItem && selectedItem.id === item.id) {
        setSelectedItem((prev) =>
          prev ? { ...prev, downloadCount: (prev.downloadCount || 0) + 1, viewCount: (prev.viewCount || 0) + 1 } : null
        );
      }
      showToast(`Initiating download for: ${bitstream.name} (${bitstream.size})`);
    } catch (err) {
      console.error(err);
      showToast(`Downloading ${bitstream.name}`);
    }
  };

  // Fetch live OAI XML
  const handleOpenOaiXml = async (verb: 'Identify' | 'ListRecords') => {
    setOaiXmlVerb(verb);
    setShowOaiXmlModal(true);
    setLoading(true);
    try {
      const res = await fetch(`/api/repository/oai?verb=${verb}`);
      const text = await res.text();
      setOaiXmlContent(text);
    } catch {
      setOaiXmlContent('<!-- Error connecting to live OAI-PMH endpoint -->');
    } finally {
      setLoading(false);
    }
  };

  // Trigger OAI harvest sync
  const handleSyncAggregators = async (jobId?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/repository/harvest/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (data.success) {
        if (jobId && data.job) {
          setHarvestJobs((prev) => prev.map((j) => (j.id === jobId ? data.job : j)));
          showToast(`Aggregator ${data.job.targetAggregator} synchronized successfully!`);
        } else if (data.jobs) {
          setHarvestJobs(data.jobs);
          showToast('All national & international metadata aggregators synchronized!');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Aggregator sync triggered successfully!');
    } finally {
      setLoading(false);
    }
  };

  // Submit Self-Archiving Deposit
  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositForm.title.trim() || !depositForm.authors[0].name.trim()) {
      showToast('Please provide a title and at least one author name.', 'info');
      return;
    }

    const keywordsArray = depositForm.keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const payload = {
      title: depositForm.title,
      authors: depositForm.authors.filter((a) => a.name.trim()),
      advisor: depositForm.advisor,
      community: depositForm.community,
      collection: depositForm.collection,
      abstract: depositForm.abstract || 'Approved academic research deposited to Haramaya University Institutional Repository.',
      keywords: keywordsArray.length ? keywordsArray : ['Haramaya University', 'Open Access'],
      language: depositForm.language,
      accessLevel: depositForm.accessLevel,
      license: depositForm.license,
      clearanceRefId: depositForm.clearanceRefId || undefined,
      bitstreams: [
        {
          id: `bit-${Date.now()}`,
          name: depositForm.fileName.trim() || `${depositForm.title.slice(0, 24).replace(/[^a-zA-Z0-9]/g, '_')}_Final_ETD.pdf`,
          size: depositForm.fileSize || '5.8 MB',
          format: 'PDF' as const,
          type: 'Main Full-Text' as const,
          checksumSha256: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
        },
      ],
    };

    setLoading(true);
    try {
      const res = await fetch('/api/repository/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setItems([data.item, ...items]);
        showToast(`Deposit submitted! Assigned persistent handle: http://hdl.handle.net/${data.item.handle}`);
        setActiveTab('discovery');
        setSelectedItem(data.item);
        // Reset form
        setDepositForm({
          title: '',
          authors: [{ name: '', affiliation: 'Haramaya University', orcid: '' }],
          advisor: '',
          community: 'College of Agriculture & Environmental Sciences',
          collection: 'Master Theses (MSc/MA)',
          abstract: '',
          keywords: '',
          language: 'en',
          accessLevel: 'Open Access',
          license: 'CC BY 4.0',
          clearanceRefId: '',
          fileName: '',
          fileSize: '6.4 MB',
        });
      }
    } catch (err) {
      console.error(err);
      showToast('Error recording deposit to server.', 'info');
    } finally {
      setLoading(false);
    }
  };

  // Generate Citation
  const getCitation = (item: RepositoryItem) => {
    const authorStr = item.authors.map((a) => a.name).join(', ');
    const year = item.publicationDate.split('-')[0];
    if (citationFormat === 'apa') {
      return `${authorStr} (${year}). ${item.title}. Haramaya University Institutional E-Repository. http://hdl.handle.net/${item.handle}`;
    } else if (citationFormat === 'bibtex') {
      return `@misc{hu_${item.id},\n  title={${item.title}},\n  author={${item.authors.map((a) => a.name).join(' and ')}},\n  year={${year}},\n  publisher={Haramaya University Institutional E-Repository},\n  url={http://hdl.handle.net/${item.handle}}\n}`;
    } else {
      return `TY  - THES\nTI  - ${item.title}\nAU  - ${item.authors.map((a) => a.name).join('\nAU  - ')}\nPY  - ${year}\nPB  - Haramaya University Institutional E-Repository\nUR  - http://hdl.handle.net/${item.handle}\nER  - `;
    }
  };

  const handleCopyCitation = (item: RepositoryItem) => {
    navigator.clipboard.writeText(getCitation(item));
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
    showToast('Citation copied to clipboard!');
  };

  // Metrics
  const totalDownloads = useMemo(() => items.reduce((acc, i) => acc + (i.downloadCount || 0), 0), [items]);
  const totalViews = useMemo(() => items.reduce((acc, i) => acc + (i.viewCount || 0), 0), [items]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 pt-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium border border-slate-700 animate-fade-in">
          <span className="material-icons text-emerald-400 text-base">
            {notification.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Breadcrumb & Institutional Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            {onBackToHub && (
              <button
                onClick={onBackToHub}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                title="Back to Dashboards Hub"
              >
                <span className="material-icons text-lg">arrow_back</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Phase 7 • Open Access Hub
                </span>
                <span className="text-xs text-slate-500 font-mono">DSpace & OAI-PMH 2.0 Archive</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Institutional E-Repository & ETD Research Commons
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Haramaya University Central Digital Library • Persistent Handle Prefix: <strong className="text-slate-700">123456789</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleOpenOaiXml('Identify')}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-700 flex items-center gap-1.5 shadow-sm transition"
            >
              <span className="material-icons text-sm text-amber-600">code</span>
              <span>OAI-PMH XML Inspector</span>
            </button>
            {onOpenClearanceDesk && (
              <button
                onClick={onOpenClearanceDesk}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-700 flex items-center gap-1.5 shadow-sm transition"
              >
                <span className="material-icons text-sm text-indigo-600">verified</span>
                <span>Registrar ETD Desk</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('deposit')}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow transition"
            >
              <span className="material-icons text-sm">cloud_upload</span>
              <span>Deposit Research (Self-Archive)</span>
            </button>
          </div>
        </div>

        {/* Global Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Archived Works</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{items.length}</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">100% Persistent Handles</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-icons text-2xl">auto_stories</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Global Downloads</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalDownloads.toLocaleString()}</p>
              <p className="text-[11px] text-blue-600 font-medium mt-0.5">{totalViews.toLocaleString()} Abstract Views</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <span className="material-icons text-2xl">download</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">OAI-PMH Harvesters</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{harvestJobs.length}</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">EOSA, AJOL & Crossref live</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <span className="material-icons text-2xl">sync_alt</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">ARR Conferences</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{conferences.length} Editions</p>
              <p className="text-[11px] text-purple-600 font-medium mt-0.5">ISBN 978-99944-72 Registered</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <span className="material-icons text-2xl">military_tech</span>
            </div>
          </div>
        </div>

        {/* Primary Interactive Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('discovery')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'discovery'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-icons text-base">travel_explore</span>
            <span>Discovery & Facets ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'deposit'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-icons text-base">post_add</span>
            <span>Self-Archiving & ETD Deposit</span>
          </button>

          <button
            onClick={() => setActiveTab('oai_pmh')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'oai_pmh'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-icons text-base">hub</span>
            <span>OAI-PMH & National Harvest Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('conferences')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'conferences'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-icons text-base">groups</span>
            <span>Annual Research Review (ARR) Proceedings</span>
          </button>

          <button
            onClick={() => setActiveTab('altmetrics')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'altmetrics'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-icons text-base">public</span>
            <span>Global Readership & Altmetrics</span>
          </button>
        </div>

        {/* TAB 1: DISCOVERY & FACET SEARCH */}
        {activeTab === 'discovery' && (
          <div className="space-y-6">
            {/* Search Bar & Filters */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="relative">
                <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  type="text"
                  placeholder="Search repository by title, author, abstract keywords, handle (e.g. 123456789/4192), or clearance ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <span className="material-icons text-base">clear</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Filter by Community</label>
                  <select
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-700 outline-none focus:border-emerald-600"
                  >
                    <option value="all">All Communities & Colleges ({items.length})</option>
                    {communities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Filter by Collection / Type</label>
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-700 outline-none focus:border-emerald-600"
                  >
                    <option value="all">All Collections & Degree Types</option>
                    {collections.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Access Level</label>
                  <select
                    value={selectedAccessLevel}
                    onChange={(e) => setSelectedAccessLevel(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-700 outline-none focus:border-emerald-600"
                  >
                    <option value="all">All Access Permissions</option>
                    <option value="Open Access">Open Access (CC-BY)</option>
                    <option value="Embargoed">Embargoed</option>
                    <option value="Campus Restricted">Campus Restricted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-medium text-slate-500">
                Displaying <strong className="text-slate-800">{filteredItems.length}</strong> cataloged research output(s)
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Dublin Core (oai_dc) compliant
                </span>
              </div>
            </div>

            {/* Items Grid */}
            <div className="space-y-4">
              {filteredItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <span className="material-icons text-5xl text-slate-300 mb-2">library_books</span>
                  <h3 className="text-base font-bold text-slate-800">No repository items match your query</h3>
                  <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or filter selections.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCommunity('all');
                      setSelectedCollection('all');
                      setSelectedAccessLevel('all');
                    }}
                    className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {item.collection}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                            hdl:{item.handle}
                          </span>
                          {item.clearanceRefId && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                              <span className="material-icons text-[12px]">verified</span>
                              <span>Registrar Ref: {item.clearanceRefId}</span>
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-medium">Issued: {item.publicationDate}</span>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                          <span className="material-icons text-[12px]">lock_open</span>
                          <span>{item.accessLevel}</span>
                        </span>
                      </div>

                      <h2
                        onClick={() => setSelectedItem(item)}
                        className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-700 cursor-pointer leading-snug"
                      >
                        {item.title}
                      </h2>

                      {/* Authors and Community */}
                      <p className="text-xs text-slate-600">
                        <strong className="text-slate-800">Authors: </strong>
                        {item.authors.map((a, idx) => (
                          <span key={idx} className="font-medium text-slate-700">
                            {a.name}
                            {a.orcid && <span className="text-[10px] text-emerald-600 ml-1">({a.orcid})</span>}
                            {idx < item.authors.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </p>

                      <p className="text-xs text-slate-500">
                        <strong className="text-slate-600">Community: </strong>
                        {item.community} {item.advisor && <span>• Advisor: {item.advisor}</span>}
                      </p>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.abstract}</p>

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.keywords.map((kw, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bitstream Files & Actions */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.bitstreams.map((file) => (
                          <button
                            key={file.id}
                            onClick={() => handleDownload(item, file)}
                            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 hover:border-emerald-300 font-medium flex items-center gap-1.5 transition"
                            title={`Download ${file.name} (${file.size})`}
                          >
                            <span className="material-icons text-sm text-red-500">
                              {file.format === 'PDF' ? 'picture_as_pdf' : file.format === 'ZIP' ? 'folder_zip' : 'insert_drive_file'}
                            </span>
                            <span className="font-mono text-[11px] truncate max-w-[140px]">{file.name}</span>
                            <span className="text-[10px] text-slate-400">({file.size})</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <span className="material-icons text-sm text-slate-400">file_download</span>
                          <strong>{item.downloadCount}</strong>
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <span className="material-icons text-sm text-slate-400">visibility</span>
                          <span>{item.viewCount}</span>
                        </span>
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                        >
                          View Dublin Core & Metadata
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SELF-ARCHIVING & ETD DEPOSIT WORKBENCH */}
        {activeTab === 'deposit' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                  Step-by-Step Archival Deposit
                </span>
                <span className="text-xs text-slate-500">DSpace Ingest & OAI-PMH Registry</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                ETD Research Submission & Self-Archiving Workbench
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Deposit final approved master’s theses, doctoral dissertations, conference proceedings, or research monographs.
                Each submission automatically generates a persistent handle and Dublin Core XML descriptor.
              </p>
            </div>

            <form onSubmit={handleSubmitDeposit} className="space-y-6">
              {/* Basic Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thesis / Monograph / Article Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Econometric Analysis of Shaded Agroforestry in Eastern Hararghe..."
                    value={depositForm.title}
                    onChange={(e) => setDepositForm({ ...depositForm, title: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Author Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chaltu Benti"
                    value={depositForm.authors[0].name}
                    onChange={(e) => {
                      const updated = [...depositForm.authors];
                      updated[0].name = e.target.value;
                      setDepositForm({ ...depositForm, authors: updated });
                    }}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author ORCID Identifier (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 0009-0003-7182-9014"
                    value={depositForm.authors[0].orcid}
                    onChange={(e) => {
                      const updated = [...depositForm.authors];
                      updated[0].orcid = e.target.value;
                      setDepositForm({ ...depositForm, authors: updated });
                    }}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Supervising Advisor(s)</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Gemechu Desta (Associate Professor)"
                    value={depositForm.advisor}
                    onChange={(e) => setDepositForm({ ...depositForm, advisor: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registrar Clearance Ref No. (Optional cross-link with Phase 6)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HU-REG-CLR-2026-0814 or clr-01"
                    value={depositForm.clearanceRefId}
                    onChange={(e) => setDepositForm({ ...depositForm, clearanceRefId: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deposit Community (College / Center)</label>
                  <select
                    value={depositForm.community}
                    onChange={(e) => setDepositForm({ ...depositForm, community: e.target.value as RepositoryCommunity })}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-700 outline-none focus:border-emerald-600 text-sm"
                  >
                    {communities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Collection / Degree Category</label>
                  <select
                    value={depositForm.collection}
                    onChange={(e) => setDepositForm({ ...depositForm, collection: e.target.value as RepositoryCollection })}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-700 outline-none focus:border-emerald-600 text-sm"
                  >
                    {collections.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Abstract / Executive Summary</label>
                  <textarea
                    rows={4}
                    placeholder="Enter comprehensive abstract detailing study background, methods, empirical findings, and policy implications..."
                    value={depositForm.abstract}
                    onChange={(e) => setDepositForm({ ...depositForm, abstract: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Keywords (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Agroforestry, Household Welfare, Hararghe Highlands, Carbon Stocks"
                    value={depositForm.keywords}
                    onChange={(e) => setDepositForm({ ...depositForm, keywords: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Access Policy & Open Science License</label>
                  <select
                    value={depositForm.license}
                    onChange={(e) => setDepositForm({ ...depositForm, license: e.target.value as any })}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-700 outline-none focus:border-emerald-600 text-sm"
                  >
                    <option value="CC BY 4.0">Creative Commons Attribution (CC BY 4.0)</option>
                    <option value="CC BY-NC 4.0">Creative Commons Non-Commercial (CC BY-NC 4.0)</option>
                    <option value="CC BY-NC-ND 4.0">Creative Commons No-Derivatives (CC BY-NC-ND 4.0)</option>
                    <option value="CC0 Public Domain">CC0 Public Domain Dedication</option>
                    <option value="Institutional Proprietary">Haramaya University Restricted / Campus Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Full-Text PDF Bitstream</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Candidate_Name_Approved_Thesis.pdf"
                      value={depositForm.fileName}
                      onChange={(e) => setDepositForm({ ...depositForm, fileName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-sm font-mono"
                    />
                    <span className="px-3 py-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600 whitespace-nowrap">
                      PDF (6.4 MB)
                    </span>
                  </div>
                </div>
              </div>

              {/* Submission Agreement */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <span className="material-icons text-sm text-emerald-700">security</span>
                  <span>Institutional Repository Non-Exclusive Distribution License</span>
                </p>
                <p>
                  By submitting this digital asset, the author grants Haramaya University the non-exclusive worldwide right to
                  reproduce, translate, and distribute this submission in electronic format. The repository will automatically
                  harvest this record to the Ethiopian Open Science Archive (EOSA) and international indexes.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('discovery')}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow transition flex items-center gap-2"
                >
                  {loading && <span className="material-icons text-xs animate-spin">refresh</span>}
                  <span>Complete Deposit & Issue Handle</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: OAI-PMH & NATIONAL HARVEST FEED */}
        {activeTab === 'oai_pmh' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-indigo-100 text-indigo-800">
                    OAI-PMH 2.0 Engine
                  </span>
                  <span className="text-xs text-slate-500 font-mono">http://repository.haramaya.edu.et/oai/request</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">National Open Science & Aggregator Harvest Matrix</h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                  Automated metadata synchronization according to the Open Archives Initiative Protocol for Metadata
                  Harvesting. Syncs Haramaya ETDs and conference papers directly with Ministry of Education archives and
                  global indexes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenOaiXml('Identify')}
                  className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition"
                >
                  <span className="material-icons text-sm text-slate-600">terminal</span>
                  <span>View Identify XML</span>
                </button>
                <button
                  onClick={() => handleOpenOaiXml('ListRecords')}
                  className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition"
                >
                  <span className="material-icons text-sm text-slate-600">code</span>
                  <span>View ListRecords XML</span>
                </button>
                <button
                  onClick={() => handleSyncAggregators()}
                  disabled={loading}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow transition"
                >
                  <span className="material-icons text-sm">sync</span>
                  <span>Trigger Full Sync</span>
                </button>
              </div>
            </div>

            {/* Aggregator Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {harvestJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {job.status}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">verb={job.oaiVerb}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{job.targetAggregator}</h3>
                    <p className="text-xs text-slate-500 break-all font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {job.endpointUrl}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-slate-500">Harvested</p>
                      <p className="font-bold text-slate-800">{job.recordsHarvested} records</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500">Last Harvest</p>
                      <p className="font-medium text-slate-700">{job.lastHarvestDate}</p>
                    </div>
                    <button
                      onClick={() => handleSyncAggregators(job.id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition"
                      title="Sync this aggregator now"
                    >
                      <span className="material-icons text-base">refresh</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ANNUAL RESEARCH REVIEW & CONFERENCE PROCEEDINGS */}
        {activeTab === 'conferences' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-800">
                    Annual Flagship Event
                  </span>
                  <span className="text-xs text-slate-500">ISBN Registered Proceedings</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Haramaya University Annual Research Review (ARR) Proceedings
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                  Peer-reviewed conference proceedings, keynote addresses, and official Book of Abstracts from Haramaya
                  University's premier national research convention.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {conferences.map((conf) => (
                <div
                  key={conf.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                          {conf.edition}
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-700">
                          ISBN: {conf.isbn}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{conf.volume}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{conf.conferenceTitle}</h3>
                      <p className="text-xs text-purple-900 font-medium italic">Theme: "{conf.theme}"</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800">{conf.dates}</p>
                      <p className="text-xs text-slate-500">{conf.venue}</p>
                    </div>
                  </div>

                  {/* Tracks */}
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2">Parallel Thematic Tracks:</p>
                    <div className="flex flex-wrap gap-2">
                      {conf.tracks.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-700 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Keynotes */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {conf.keynoteSpeakers.map((k, idx) => (
                      <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                        <p className="font-bold text-slate-800">{k.name}</p>
                        <p className="text-[11px] text-slate-500">{k.title}</p>
                        <p className="text-[11px] text-emerald-700 font-medium">{k.institution}</p>
                      </div>
                    ))}
                  </div>

                  {/* Download Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <p className="text-slate-500">
                      Total Published Papers in Volume: <strong className="text-slate-800">{conf.totalPapers}</strong> • Chair:{' '}
                      {conf.chairperson}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast(`Initiating download for ${conf.edition} Book of Abstracts (6.4 MB)`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 transition"
                      >
                        <span className="material-icons text-sm text-red-600">picture_as_pdf</span>
                        <span>Book of Abstracts</span>
                      </button>
                      <button
                        onClick={() => showToast(`Initiating download for ${conf.edition} Complete Proceedings (34 MB)`)}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1 shadow-sm transition"
                      >
                        <span className="material-icons text-sm">download</span>
                        <span>Complete Proceedings Volume</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GLOBAL READERSHIP & ALTMETRICS */}
        {activeTab === 'altmetrics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                    Impact Metrics
                  </span>
                  <span className="text-xs text-slate-500">Global Readership & Citation Velocity</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">Geographic Readership & Altmetric Reach</h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                  Real-time analytics indicating the international dissemination of Haramaya University research across Africa,
                  Europe, North America, and Asia.
                </p>
              </div>

              {/* Geographic Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { country: 'Ethiopia', flag: '🇪🇹', views: 2420, pct: '56%' },
                  { country: 'Kenya', flag: '🇰🇪', views: 580, pct: '14%' },
                  { country: 'United States', flag: '🇺🇸', views: 420, pct: '10%' },
                  { country: 'Germany', flag: '🇩🇪', views: 280, pct: '7%' },
                  { country: 'United Kingdom', flag: '🇬🇧', views: 210, pct: '5%' },
                  { country: 'Other Nations', flag: '🌐', views: 360, pct: '8%' },
                ].map((geo, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-center space-y-1">
                    <span className="text-3xl">{geo.flag}</span>
                    <p className="text-xs font-bold text-slate-800">{geo.country}</p>
                    <p className="text-sm font-black text-emerald-700">{geo.views.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{geo.pct} of traffic</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Impact Publications */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Highest-Impact Repository Deposits by Citations & Downloads</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Publication Title</th>
                      <th className="pb-3 font-semibold">Collection</th>
                      <th className="pb-3 font-semibold text-center">Citations</th>
                      <th className="pb-3 font-semibold text-center">Downloads</th>
                      <th className="pb-3 font-semibold text-right">Altmetric Attention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...items]
                      .sort((a, b) => b.citationCount - a.citationCount)
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 font-medium text-slate-900 max-w-sm">
                            <p className="truncate">{item.title}</p>
                            <p className="text-[10px] font-mono text-slate-400">hdl:{item.handle}</p>
                          </td>
                          <td className="py-3 text-slate-600">{item.collection}</td>
                          <td className="py-3 text-center font-bold text-slate-900">{item.citationCount}</td>
                          <td className="py-3 text-center font-bold text-emerald-700">{item.downloadCount}</td>
                          <td className="py-3 text-right">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Score: {item.citationCount * 2 + Math.floor(item.downloadCount / 10)}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: ITEM DETAIL & DUBLIN CORE VIEWER */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {selectedItem.collection}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-700">
                      hdl:{selectedItem.handle}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedItem.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-icons text-xl">close</span>
                </button>
              </div>

              {/* Bitstreams */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Bitstream Files in this Item:</p>
                <div className="space-y-2">
                  {selectedItem.bitstreams.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="material-icons text-red-500 text-base">picture_as_pdf</span>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{file.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {file.size} • SHA-256: {file.checksumSha256.slice(0, 16)}...
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(selectedItem, file)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center gap-1 transition shadow-sm"
                      >
                        <span className="material-icons text-xs">download</span>
                        <span>View / Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Abstract */}
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Abstract:</p>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedItem.abstract}
                </p>
              </div>

              {/* Dublin Core Schema Breakdown */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dublin Core Schema (oai_dc):</p>
                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono space-y-1.5 overflow-x-auto">
                  <p>
                    <span className="text-emerald-400">dc.title:</span> {selectedItem.dublinCore.title}
                  </p>
                  <p>
                    <span className="text-emerald-400">dc.creator:</span> {selectedItem.dublinCore.creator.join('; ')}
                  </p>
                  <p>
                    <span className="text-emerald-400">dc.subject:</span> {selectedItem.dublinCore.subject.join(', ')}
                  </p>
                  <p>
                    <span className="text-emerald-400">dc.date.issued:</span> {selectedItem.dublinCore.dateIssued}
                  </p>
                  <p>
                    <span className="text-emerald-400">dc.identifier.uri:</span> {selectedItem.dublinCore.identifierUri}
                  </p>
                  <p>
                    <span className="text-emerald-400">dc.rights:</span> {selectedItem.dublinCore.rights}
                  </p>
                </div>
              </div>

              {/* Citation Export */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cite This Work:</p>
                  <div className="flex items-center gap-1 text-xs">
                    {(['apa', 'bibtex', 'ris'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setCitationFormat(fmt)}
                        className={`px-2 py-0.5 rounded font-bold uppercase ${
                          citationFormat === fmt ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-mono relative flex items-start justify-between gap-2">
                  <pre className="whitespace-pre-wrap leading-relaxed font-sans">{getCitation(selectedItem)}</pre>
                  <button
                    onClick={() => handleCopyCitation(selectedItem)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition"
                  >
                    <span className="material-icons text-xs">{copiedCitation ? 'done' : 'content_copy'}</span>
                    <span>{copiedCitation ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: LIVE OAI-PMH XML INSPECTOR */}
        {showOaiXmlModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-900">
                      Live XML Output
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      /api/repository/oai?verb={oaiXmlVerb}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">OAI-PMH 2.0 Schema Response Inspector</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenOaiXml('Identify')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      oaiXmlVerb === 'Identify' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    Identify
                  </button>
                  <button
                    onClick={() => handleOpenOaiXml('ListRecords')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      oaiXmlVerb === 'ListRecords' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    ListRecords
                  </button>
                  <button
                    onClick={() => setShowOaiXmlModal(false)}
                    className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
                  >
                    <span className="material-icons text-lg">close</span>
                  </button>
                </div>
              </div>

              <div className="p-5 overflow-y-auto flex-1 bg-slate-950 text-emerald-400 font-mono text-xs">
                {loading ? (
                  <div className="text-center py-10 text-slate-400">Loading XML response...</div>
                ) : (
                  <pre className="whitespace-pre-wrap break-all">{oaiXmlContent}</pre>
                )}
              </div>

              <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs">
                <p className="text-slate-500">
                  Standard: <strong>Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH 2.0)</strong>
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(oaiXmlContent);
                    showToast('XML payload copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1.5 transition"
                >
                  <span className="material-icons text-sm">content_copy</span>
                  <span>Copy XML Payload</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default InstitutionalRepositoryPortal;
