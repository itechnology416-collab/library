import React, { useState } from 'react';
import { Book } from '../types';

interface AcademicPosterStudioModalProps {
  initialBook?: Book | null;
  onClose: () => void;
  onRequestPrinting?: (specs: string) => void;
}

interface PosterSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'metrics' | 'bullet' | 'citation';
}

export const AcademicPosterStudioModal: React.FC<AcademicPosterStudioModalProps> = ({
  initialBook,
  onClose,
  onRequestPrinting,
}) => {
  const [title, setTitle] = useState<string>(
    initialBook ? initialBook.title : 'Spatial Analysis of Agronomic Yields & Climate Adaptation in Eastern Hararghe'
  );
  const [authors, setAuthors] = useState<string>(
    initialBook ? `${initialBook.author}, PhD & Research Fellows` : 'Dr. Tadesse Bekele, Prof. Fatuma Ahmed, Eng. Gemechu Desta'
  );
  const [affiliation, setAffiliation] = useState<string>(
    initialBook?.affiliation || 'College of Agriculture & Environmental Sciences, Haramaya University'
  );
  const [conferenceName, setConferenceName] = useState<string>(
    '42nd Annual Research Review & Symposia — Haramaya University (2026)'
  );
  const [paperId, setPaperId] = useState<string>('HU-AGR-2026-884');
  const [layoutSize, setLayoutSize] = useState<'A0' | 'A1' | '70x100'>('A0');
  const [colorTheme, setColorTheme] = useState<'haramaya-green' | 'imperial-indigo' | 'academic-burgundy' | 'slate-navy'>('haramaya-green');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');

  // Dynamic sections
  const [abstract, setAbstract] = useState<string>(
    'This monograph evaluates smallholder agro-forestry resilience across drought-prone highland zones in Eastern Ethiopia. Utilizing satellite imagery alongside participatory rural appraisal (N=420), we establish empirical correlation between indigenous legume intercropping and seasonal soil moisture retention.'
  );
  const [methodology, setMethodology] = useState<string>(
    '1. Multi-temporal Sentinel-2 vegetation indices (NDVI/NDWI) computed over a 5-year longitudinal sequence.\n2. Soil organic carbon (SOC) physical core sampling in 14 kebeles across Maya and Kombolcha woredas.\n3. Multivariate ANOVA and regression modeling using R and Python GeoPandas.'
  );
  const [results, setResults] = useState<string>(
    '• Intercropping increased soil organic carbon by 28.4% (p < 0.001) relative to monoculture control parcels.\n• Seasonal yield stability index improved from 0.42 to 0.79 under variable rainfall scenarios.\n• Total post-harvest biomass loss reduced by 34%.'
  );
  const [conclusion, setConclusion] = useState<string>(
    'Indigenous agro-ecological techniques coupled with drought-tolerant varieties provide viable long-term buffering against climate shocks. Policy integration into Ethiopian National Agricultural Extension manuals is strongly recommended.'
  );
  const [references, setReferences] = useState<string>(
    '1. Bekele, T. (2024). Eastern Ethiopian Agronomy. Haramaya Press.\n2. Ministry of Agriculture (2025). Climate Adaptation Roadmap.'
  );

  // Key stats highlights
  const [stat1Val, setStat1Val] = useState<string>('+28.4%');
  const [stat1Label, setStat1Label] = useState<string>('Soil Organic Carbon');
  const [stat2Val, setStat2Val] = useState<string>('0.79');
  const [stat2Label, setStat2Label] = useState<string>('Yield Stability Index');
  const [stat3Val, setStat3Val] = useState<string>('N=420');
  const [stat3Label, setStat3Label] = useState<string>('Smallholder Sample Size');

  const themeColors = {
    'haramaya-green': {
      headerBg: '#0f392b',
      headerText: '#ffffff',
      accent: '#2e7d32',
      accentLight: '#e8f5e9',
      border: '#1b5e20',
      badge: '#fbc02d',
    },
    'imperial-indigo': {
      headerBg: '#1a237e',
      headerText: '#ffffff',
      accent: '#303f9f',
      accentLight: '#e8eaf6',
      border: '#283593',
      badge: '#00e676',
    },
    'academic-burgundy': {
      headerBg: '#4a121a',
      headerText: '#ffffff',
      accent: '#880e4f',
      accentLight: '#fce4ec',
      border: '#ad1457',
      badge: '#ffd54f',
    },
    'slate-navy': {
      headerBg: '#1e293b',
      headerText: '#ffffff',
      accent: '#0f766e',
      accentLight: '#f0fdfa',
      border: '#334155',
      badge: '#38bdf8',
    },
  }[colorTheme];

  const handleExportSVG = () => {
    const posterEl = document.getElementById('academic-poster-rendered');
    if (!posterEl) return;
    const svgData = new XMLSerializer().serializeToString(posterEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_Academic_Poster_${layoutSize}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-6xl rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden max-h-[94vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
              <span className="material-symbols-outlined text-[24px]">view_quilt</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-on-surface">
                  Academic Conference & Symposia Poster Studio
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-bold text-[10px] uppercase">
                  A0/A1 Pre-Press
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Standardized 3-column academic presentation posters for research defense symposia.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode */}
            <div className="flex rounded-xl bg-surface-container-high p-0.5 border border-outline-variant/20">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'editor'
                    ? 'bg-surface text-secondary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Content Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-surface text-secondary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Visual Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-2 bg-surface-container-low border-b border-outline-variant/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            {/* Dimension Selection */}
            <span className="font-bold text-on-surface">Dimensions:</span>
            <div className="flex gap-1">
              {(['A0', 'A1', '70x100'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setLayoutSize(sz)}
                  className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold cursor-pointer ${
                    layoutSize === sz
                      ? 'border-secondary bg-secondary/15 text-secondary'
                      : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {sz} {sz === 'A0' ? '(841 × 1189 mm)' : sz === 'A1' ? '(594 × 841 mm)' : '(700 × 1000 mm)'}
                </button>
              ))}
            </div>

            {/* Color Theme */}
            <span className="font-bold text-on-surface ml-2">Theme:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'haramaya-green', bg: '#0f392b', label: 'Haramaya' },
                { id: 'imperial-indigo', bg: '#1a237e', label: 'Indigo' },
                { id: 'academic-burgundy', bg: '#4a121a', label: 'Burgundy' },
                { id: 'slate-navy', bg: '#1e293b', label: 'Slate' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setColorTheme(t.id as any)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    colorTheme === t.id ? 'scale-125 border-secondary ring-2 ring-secondary/30' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: t.bg }}
                  title={t.label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSVG}
              className="px-3 py-1 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[14px] text-secondary">file_download</span>
              <span>Export Poster SVG</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">print</span>
              <span>Print Layout</span>
            </button>
          </div>
        </div>

        {/* Content Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-surface-container-lowest">
          {activeTab === 'editor' ? (
            /* Tab 1: Comprehensive Content Editor */
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="p-5 rounded-2xl bg-surface border border-outline-variant/30 space-y-4">
                <h3 className="font-bold text-sm text-on-surface border-b border-outline-variant/15 pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">badge</span>
                  <span>Header Metadata & Institutional Affiliation</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="font-bold text-on-surface block mb-1">Presentation Title:</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-serif"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Author List & Academic Rank:</label>
                    <input
                      type="text"
                      value={authors}
                      onChange={(e) => setAuthors(e.target.value)}
                      className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Department / College Affiliation:</label>
                    <input
                      type="text"
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Conference / Symposium Name:</label>
                    <input
                      type="text"
                      value={conferenceName}
                      onChange={(e) => setConferenceName(e.target.value)}
                      className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Manuscript / Paper Code:</label>
                    <input
                      type="text"
                      value={paperId}
                      onChange={(e) => setPaperId(e.target.value)}
                      className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Key Metrics Editor */}
              <div className="p-5 rounded-2xl bg-surface border border-outline-variant/30 space-y-4">
                <h3 className="font-bold text-sm text-on-surface border-b border-outline-variant/15 pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">query_stats</span>
                  <span>Headline Scientific Empirical Highlights</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
                    <label className="font-bold text-on-surface block">Stat #1 Value & Label</label>
                    <input
                      type="text"
                      value={stat1Val}
                      onChange={(e) => setStat1Val(e.target.value)}
                      className="w-full p-2 rounded-lg bg-surface border border-outline-variant/30 text-on-surface font-mono font-bold"
                    />
                    <input
                      type="text"
                      value={stat1Label}
                      onChange={(e) => setStat1Label(e.target.value)}
                      className="w-full p-2 rounded-lg bg-surface border border-outline-variant/30 text-on-surface"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
                    <label className="font-bold text-on-surface block">Stat #2 Value & Label</label>
                    <input
                      type="text"
                      value={stat2Val}
                      onChange={(e) => setStat2Val(e.target.value)}
                      className="w-full p-2 rounded-lg bg-surface border border-outline-variant/30 text-on-surface font-mono font-bold"
                    />
                    <input
                      type="text"
                      value={stat2Label}
                      onChange={(e) => setStat2Label(e.target.value)}
                      className="w-full p-2 rounded-lg bg-surface border border-outline-variant/30 text-on-surface"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
                    <label className="font-bold text-on-surface block">Stat #3 Value & Label</label>
                    <input
                      type="text"
                      value={stat3Val}
                      onChange={(e) => setStat3Val(e.target.value)}
                      className="w-full p-2 rounded-lg bg-surface border border-outline-variant/30 text-on-surface font-mono font-bold"
                    />
                    <input
                      type="text"
                      value={stat3Label}
                      onChange={(e) => setStat3Label(e.target.value)}
                      className="w-full p-2 rounded-lg bg-surface border border-outline-variant/30 text-on-surface"
                    />
                  </div>
                </div>
              </div>

              {/* Poster Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 space-y-2">
                  <label className="font-bold text-on-surface block">Abstract & Problem Statement:</label>
                  <textarea
                    rows={4}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface resize-none font-serif text-xs leading-relaxed"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 space-y-2">
                  <label className="font-bold text-on-surface block">Experimental Methodology & Field Trials:</label>
                  <textarea
                    rows={4}
                    value={methodology}
                    onChange={(e) => setMethodology(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface resize-none font-serif text-xs leading-relaxed"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 space-y-2">
                  <label className="font-bold text-on-surface block">Key Empirical Findings & Statistical Yields:</label>
                  <textarea
                    rows={4}
                    value={results}
                    onChange={(e) => setResults(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface resize-none font-serif text-xs leading-relaxed"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 space-y-2">
                  <label className="font-bold text-on-surface block">Conclusion & Policy Recommendations:</label>
                  <textarea
                    rows={4}
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface resize-none font-serif text-xs leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab('preview')}
                  className="px-6 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm hover:brightness-105"
                >
                  <span>Generate Poster Visual</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ) : (
            /* Tab 2: Visual Poster Canvas */
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-300 p-6 sm:p-8 font-sans">
                
                {/* SVG Rendered Component for direct export */}
                <div id="academic-poster-rendered" className="space-y-6">
                  
                  {/* Poster Header Banner */}
                  <header
                    style={{ backgroundColor: themeColors.headerBg, color: themeColors.headerText }}
                    className="p-6 sm:p-8 rounded-xl shadow-md text-center relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-4 mb-4 text-xs font-mono">
                      <span className="tracking-widest uppercase opacity-90">{conferenceName}</span>
                      <span
                        style={{ backgroundColor: themeColors.badge, color: '#000' }}
                        className="px-2.5 py-0.5 rounded-full font-bold text-[10px]"
                      >
                        PAPER #{paperId}
                      </span>
                    </div>

                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif leading-tight mb-3">
                      {title}
                    </h1>

                    <p className="text-sm font-semibold opacity-95 mb-1">
                      {authors}
                    </p>
                    <p className="text-xs opacity-80 italic">
                      {affiliation}
                    </p>
                  </header>

                  {/* Highlights Metric Band */}
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      style={{ backgroundColor: themeColors.accentLight, borderColor: themeColors.accent }}
                      className="p-3 rounded-xl border text-center"
                    >
                      <span style={{ color: themeColors.accent }} className="text-2xl font-bold font-mono block">
                        {stat1Val}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700">{stat1Label}</span>
                    </div>
                    <div
                      style={{ backgroundColor: themeColors.accentLight, borderColor: themeColors.accent }}
                      className="p-3 rounded-xl border text-center"
                    >
                      <span style={{ color: themeColors.accent }} className="text-2xl font-bold font-mono block">
                        {stat2Val}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700">{stat2Label}</span>
                    </div>
                    <div
                      style={{ backgroundColor: themeColors.accentLight, borderColor: themeColors.accent }}
                      className="p-3 rounded-xl border text-center"
                    >
                      <span style={{ color: themeColors.accent }} className="text-2xl font-bold font-mono block">
                        {stat3Val}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700">{stat3Label}</span>
                    </div>
                  </div>

                  {/* 3-Column Academic Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-800 leading-relaxed">
                    
                    {/* Column 1: Background & Methodology */}
                    <div className="space-y-4">
                      <section className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <h2
                          style={{ color: themeColors.accent }}
                          className="font-bold text-xs uppercase tracking-wider border-b pb-1 border-slate-200"
                        >
                          1. Introduction & Background
                        </h2>
                        <p className="text-[11px] text-justify font-serif">
                          {abstract}
                        </p>
                      </section>

                      <section className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <h2
                          style={{ color: themeColors.accent }}
                          className="font-bold text-xs uppercase tracking-wider border-b pb-1 border-slate-200"
                        >
                          2. Methodology & Field Design
                        </h2>
                        <div className="text-[11px] whitespace-pre-line font-serif space-y-1">
                          {methodology}
                        </div>
                      </section>
                    </div>

                    {/* Column 2: Results & Data Visualization */}
                    <div className="space-y-4">
                      <section className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <h2
                          style={{ color: themeColors.accent }}
                          className="font-bold text-xs uppercase tracking-wider border-b pb-1 border-slate-200"
                        >
                          3. Empirical Results & Findings
                        </h2>
                        
                        {/* Graphical Diagram / Chart Mock */}
                        <div className="h-32 rounded-lg bg-slate-200/80 border border-slate-300 p-2 flex flex-col justify-between">
                          <span className="text-[9px] font-mono text-slate-600">
                            Figure 1: Yield variance under agro-forestry treatments (p &lt; 0.001)
                          </span>
                          <div className="flex items-end justify-around h-20 pt-2 px-2 gap-2">
                            <div className="w-10 bg-slate-400 rounded-t h-1/3 flex items-center justify-center text-[8px] text-white font-mono">
                              Ctrl
                            </div>
                            <div className="w-10 bg-emerald-600 rounded-t h-3/4 flex items-center justify-center text-[8px] text-white font-mono">
                              Trt A
                            </div>
                            <div
                              style={{ backgroundColor: themeColors.accent }}
                              className="w-10 rounded-t h-full flex items-center justify-center text-[8px] text-white font-mono font-bold"
                            >
                              Trt B
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] whitespace-pre-line font-serif">
                          {results}
                        </div>
                      </section>
                    </div>

                    {/* Column 3: Conclusions & References */}
                    <div className="space-y-4">
                      <section className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <h2
                          style={{ color: themeColors.accent }}
                          className="font-bold text-xs uppercase tracking-wider border-b pb-1 border-slate-200"
                        >
                          4. Discussion & Policy
                        </h2>
                        <p className="text-[11px] text-justify font-serif">
                          {conclusion}
                        </p>
                      </section>

                      <section className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <h2
                          style={{ color: themeColors.accent }}
                          className="font-bold text-xs uppercase tracking-wider border-b pb-1 border-slate-200"
                        >
                          5. Key References
                        </h2>
                        <div className="text-[10px] text-slate-600 whitespace-pre-line font-mono">
                          {references}
                        </div>
                      </section>

                      {/* Institutional Footer & QR Code */}
                      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 text-[10px]">
                        <div>
                          <strong className="block text-slate-900">Haramaya University Press</strong>
                          <span className="text-slate-500">WKI Academic Pre-Press Services</span>
                        </div>
                        <div className="w-12 h-12 bg-white border border-slate-300 rounded-lg p-1 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[28px] text-slate-700">qr_code_2</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* Bottom Print Order Trigger */}
              <div className="w-full max-w-4xl flex items-center justify-between p-4 rounded-2xl bg-surface border border-outline-variant/30 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">print_connect</span>
                  <div>
                    <span className="font-bold text-on-surface block">Need High-Gloss Matte Vinyl Conference Printing?</span>
                    <span className="text-on-surface-variant text-[11px]">Direct same-day Haramaya campus pickup available for registered symposium participants.</span>
                  </div>
                </div>
                {onRequestPrinting && (
                  <button
                    onClick={() => {
                      onClose();
                      onRequestPrinting(`Academic Poster Print Order (${layoutSize}, 220gsm Matte Vinyl, ${title})`);
                    }}
                    className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs hover:brightness-105"
                  >
                    <span>Order Poster Print</span>
                    <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
