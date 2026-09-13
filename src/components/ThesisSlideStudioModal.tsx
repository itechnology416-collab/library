import React, { useState } from 'react';

interface ThesisSlideStudioModalProps {
  onClose: () => void;
  onRequestDesignService?: () => void;
}

export const ThesisSlideStudioModal: React.FC<ThesisSlideStudioModalProps> = ({
  onClose,
  onRequestDesignService,
}) => {
  const [activeTab, setActiveTab] = useState<'visual_deck' | 'latex_source' | 'preliminaries' | 'marp_md'>('visual_deck');
  
  // Customization Form State
  const [scholarName, setScholarName] = useState<string>('Ahmed Mohammed Ibrahim');
  const [degreeProgram, setDegreeProgram] = useState<string>('Master of Science in Information Technology');
  const [collegeName, setCollegeName] = useState<string>('College of Computing and Informatics');
  const [departmentName, setDepartmentName] = useState<string>('Department of Information Science');
  const [advisorName, setAdvisorName] = useState<string>('Dr. Tadesse Gemechu (Associate Professor)');
  const [coAdvisorName, setCoAdvisorName] = useState<string>('Mr. Feysal Hussein (Lecturer & Director)');
  const [thesisTitle, setThesisTitle] = useState<string>(
    'Multilingual Natural Language Processing & OCR Framework for Low-Resource Horn of Africa Scripts'
  );
  const [defenseDate, setDefenseDate] = useState<string>('October 2024');
  const [colorTheme, setColorTheme] = useState<'emerald_gold' | 'navy_ochre' | 'burgundy'>('emerald_gold');
  
  // Visual slide deck navigation
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Slides definition
  const slides = [
    {
      id: 1,
      type: 'title',
      header: 'Thesis Defense Presentation',
      title: thesisTitle,
      subtitle: `A Thesis Submitted to the Directorate of Postgraduate Program Directorate`,
      details: [
        `Candidate: ${scholarName}`,
        `Degree: ${degreeProgram}`,
        `Affiliation: ${collegeName}, Haramaya University`,
        `Major Advisor: ${advisorName}`,
        `Co-Advisor: ${coAdvisorName}`,
        `Academic Year: ${defenseDate}`,
      ],
    },
    {
      id: 2,
      type: 'content',
      header: '1. Introduction & Background',
      title: 'Context and Research Motivation',
      points: [
        'Growing demand for standardized digital preservation of multilingual Horn of Africa manuscripts (Afaan Oromoo Qubee, Ethiopic Fidel, and Classical Arabic).',
        'Scarcity of open-access annotated corpora and high-accuracy OCR for historical documents.',
        'Institutional alignment with Haramaya University Digital Publishing Press strategic modernization goals.',
      ],
      footnote: 'Ref: Haramaya University Postgraduate Research Strategy (2020-2025)',
    },
    {
      id: 3,
      type: 'content',
      header: '2. Statement of the Problem',
      title: 'Key Technical & Methodological Bottlenecks',
      points: [
        'High character error rates (CER > 18%) when processing mixed diacritics and ligatures.',
        'Lack of harmonized terminology databases across 4 regional academic languages.',
        'Absence of unified typesetting workflows capable of bi-directional (LTR/RTL) rendering in academic defense slides.',
      ],
      footnote: 'Research gap identified from 42 surveyed graduate thesis archives.',
    },
    {
      id: 4,
      type: 'content',
      header: '3. Research Objectives',
      title: 'General & Specific Aim Matrix',
      points: [
        'General: Develop an end-to-end multilingual typesetting and OCR pipeline tailored for Ethiopian scholarly presses.',
        'Specific 1: Build a 4-way parallel lexicon with phonetic acoustic models.',
        'Specific 2: Formulate automated LaTeX Beamer templates certified for Haramaya defense protocols.',
        'Specific 3: Conduct rigorous empirical evaluation with faculty reviewers and graduate examiners.',
      ],
      footnote: 'Target Deliverable: Reproducible Open Pipeline + Beamer Templates.',
    },
    {
      id: 5,
      type: 'content',
      header: '4. Methodology & Architecture',
      title: 'Proposed Pipeline & Experimental Design',
      points: [
        'Phase A: Corpus Aggregation — 2,400 pages of multi-script manuscripts from Haramaya University Press.',
        'Phase B: Pre-processing — Adaptive binarization, skew correction, and morphological dilation.',
        'Phase C: Deep Transformer Model — Fine-tuned vision-language backbone with custom CTC loss.',
        'Phase D: Validation — Double-blind review by senior linguistics & computing faculty.',
      ],
      footnote: 'Hardware setup: 4x NVIDIA A100 GPU cluster at Haramaya Computing Center.',
    },
    {
      id: 6,
      type: 'content',
      header: '5. Results & Empirical Analysis',
      title: 'Performance Benchmark vs. Baseline Models',
      points: [
        'Word Error Rate (WER) reduced from 14.2% down to 2.1% across Afaan Oromoo text datasets.',
        'Bi-directional typesetting rendering speed improved by 410% using vectorized SVG assets.',
        'Examiner satisfaction score achieved 96.4% across 8 evaluated postgraduate defense trials.',
      ],
      footnote: 'Statistical significance: p < 0.001 with 95% confidence interval.',
    },
    {
      id: 7,
      type: 'content',
      header: '6. Conclusion & Major Contributions',
      title: 'Key Takeaways & Scholarly Impact',
      points: [
        'Delivered the first open-source 4-way academic glossary integrated with audio synthesis.',
        'Established institutional typesetting standards for Haramaya University Press monographs.',
        'Paved the way for scalable digitization of East African heritage manuscripts.',
      ],
      footnote: 'All code, datasets, and templates deposited in Haramaya Institutional Repository.',
    },
  ];

  // LaTeX Beamer Generator
  const generateBeamerLatex = (): string => {
    return `% ==============================================================================
% HARAMAYA UNIVERSITY POSTGRADUATE THESIS DEFENSE BEAMER TEMPLATE
% Powered by Wirtuu Kompiitaraa Ilillii (WKI) Publishing Press
% ==============================================================================

\\documentclass[aspectratio=169, 10pt]{beamer}

% Packages
\\usepackage[utf8]{inputenc}
\\usepackage{graphicx}
\\usepackage{booktabs}
\\usepackage{amsmath,amssymb}
\\usepackage{hyperref}
\\usepackage{tikz}

% Haramaya Institutional Color Theme
\\definecolor{huGreen}{RGB}{11, 60, 30}
\\definecolor{huGold}{RGB}{155, 69, 0}
\\definecolor{huSurface}{RGB}{248, 250, 252}
\\definecolor{huDark}{RGB}{15, 23, 42}

\\usetheme{Madrid}
\\usecolortheme[named=huGreen]{structure}
\\setbeamercolor{frametitle}{bg=huGreen, fg=white}
\\setbeamercolor{title}{bg=huGreen, fg=white}
\\setbeamercolor{author}{fg=huDark}
\\setbeamercolor{institute}{fg=huGold}

% Metadata
\\title[${degreeProgram}]{${thesisTitle}}
\\subtitle{MSc Thesis Defense Examination}
\\author[${scholarName}]{${scholarName}\\\\ \\small Candidate}
\\institute[Haramaya University]{
  ${departmentName}\\\\
  ${collegeName}\\\\
  \\textbf{Haramaya University, Ethiopia}\\\\[2mm]
  \\small \\textbf{Major Advisor:} ${advisorName}\\\\
  \\small \\textbf{Co-Advisor:} ${coAdvisorName}
}
\\date{${defenseDate}}

\\begin{document}

% Title Frame
\\begin{frame}
  \\titlepage
\\end{frame}

% Outline Frame
\\begin{frame}{Table of Contents}
  \\tableofcontents
\\end{frame}

% Section 1: Introduction
\\section{Introduction \\& Problem Statement}
\\begin{frame}{1. Research Background \\& Problem Statement}
  \\begin{itemize}
    \\item High demand for automated multilingual processing across Horn of Africa languages.
    \\item Existing workflows suffer from high error rates in complex diacritics and ligatures.
    \\item Lack of standardized institutional LaTeX templates for Haramaya graduate submissions.
  \\end{itemize}
  \\vspace{4mm}
  \\begin{block}{Central Research Question}
    \\textit{How can deep neural architectures be optimized for low-resource bi-directional academic publishing?}
  \\end{block}
\\end{frame}

% Section 2: Objectives
\\section{Research Objectives}
\\begin{frame}{2. Specific Aim Matrix}
  \\begin{columns}[T]
    \\begin{column}{0.48\\textwidth}
      \\textbf{Primary Objective:}
      \\begin{itemize}
        \\item Develop unified digital publishing & OCR pipeline.
      \\end{itemize}
    \\end{column}
    \\begin{column}{0.48\\textwidth}
      \\textbf{Key Milestones:}
      \\begin{itemize}
        \\item 4-way parallel lexicon generation.
        \\item LaTeX Beamer standardization.
        \\item Rigorous empirical evaluation.
      \\end{itemize}
    \\end{column}
  \\end{columns}
\\end{frame}

% Section 3: Methodology
\\section{Methodology}
\\begin{frame}{3. System Architecture}
  \\begin{center}
    \\begin{tikzpicture}[node distance=1.8cm, auto]
      \\node [draw, rounded corners, fill=huSurface, text width=2.5cm, align=center] (input) {Manuscript Ingestion};
      \\node [draw, rounded corners, fill=huSurface, text width=2.5cm, align=center, right of=input, node distance=3.2cm] (proc) {Diacritic OCR Engine};
      \\node [draw, rounded corners, fill=huGreen, text=white, text width=2.5cm, align=center, right of=proc, node distance=3.2cm] (out) {Typeset Deliverable};
      \\draw[->, thick, huGold] (input) -- (proc);
      \\draw[->, thick, huGold] (proc) -- (out);
    \\end{tikzpicture}
  \\end{center}
\\end{frame}

% Section 4: Results
\\section{Results \\& Discussion}
\\begin{frame}{4. Empirical Findings}
  \\begin{table}
    \\centering
    \\begin{tabular}{lrrr}
      \\toprule
      \\textbf{Language Script} & \\textbf{Baseline WER (\\%)} & \\textbf{Proposed Pipeline (\\%)} & \\textbf{Gain} \\\\
      \\midrule
      Afaan Oromoo (Qubee) & 14.2 & \\textbf{2.1} & +85.2\\% \\\\
      Amharic (Fidel)      & 16.8 & \\textbf{3.4} & +79.7\\% \\\\
      Arabic (Classical)   & 19.5 & \\textbf{4.1} & +78.9\\% \\\\
      \\bottomrule
    \\end{tabular}
    \\caption{Comparative Error Metrics on Haramaya Benchmark Corpus}
  \\end{table}
\\end{frame}

% Section 5: Conclusion
\\section{Conclusion}
\\begin{frame}{5. Summary \\& Recommendations}
  \\begin{alertblock}{Core Contributions}
    \\begin{itemize}
      \\item Delivered institutional standard Beamer package for Haramaya University.
      \\item Proven state-of-the-art accuracy on multi-script manuscript digitization.
    \\end{itemize}
  \\end{alertblock}
\\end{frame}

% Acknowledgment Frame
\\begin{frame}[plain]
  \\centering
  \\Huge \\textbf{Galatoomaa / Thank You / አመሰግናለሁ}\\\\[5mm]
  \\large \\textit{Questions \\& Scholarly Discussion}\\\\[4mm]
  \\small Directorate of Postgraduate Programs $\\bullet$ Haramaya University
\\end{frame}

\\end{document}`;
  };

  // Preliminary Front-Matter Generator
  const generatePreliminaries = (): string => {
    return `HARAMAYA UNIVERSITY
POSTGRADUATE PROGRAM DIRECTORATE

TITLE:
${thesisTitle.toUpperCase()}

BY:
${scholarName.toUpperCase()}

COLLEGE: ${collegeName.toUpperCase()}
DEPARTMENT: ${departmentName.toUpperCase()}

IN PARTIAL FULFILLMENT OF THE REQUIREMENTS FOR THE DEGREE OF
${degreeProgram.toUpperCase()}

HARAMAYA UNIVERSITY, ETHIOPIA
${defenseDate.toUpperCase()}

--------------------------------------------------------------------------------
SCHOOL OF GRADUATE STUDIES - BOARD OF EXAMINERS APPROVAL SHEET

As members of the Examining Board of the final ${degreeProgram.split(' ')[0]} thesis open defense, we certify that we have read and evaluated the thesis prepared by ${scholarName}, entitled "${thesisTitle}", and recommend that it be accepted as fulfilling the thesis requirement for the degree.

1. Chairperson: _________________________   Signature: _____________  Date: _________
2. Major Advisor: ${advisorName}   Signature: _____________  Date: _________
3. Co-Advisor: ${coAdvisorName}   Signature: _____________  Date: _________
4. Internal Examiner: ___________________   Signature: _____________  Date: _________
5. External Examiner: ___________________   Signature: _____________  Date: _________

--------------------------------------------------------------------------------
DECLARATION OF THE CANDIDATE

I hereby declare that this thesis is my original work and that it has not been submitted partially, or in full, for a degree or other diploma to any other university. All sources of materials used for the thesis have been duly acknowledged.

Name of Candidate: ${scholarName}
Signature: __________________________
Date of Submission: ${defenseDate}
School/Department: ${departmentName}`;
  };

  const handleCopyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  const handleDownloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150 ${
        isFullscreen ? 'p-0' : ''
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-surface w-full rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden transition-all ${
          isFullscreen ? 'w-screen h-screen rounded-none' : 'max-w-6xl max-h-[94vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-surface-container border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
              <span className="material-symbols-outlined text-[24px]">slideshow</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-on-surface">
                  Thesis Defense Slide & LaTeX Beamer Studio
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-secondary/15 text-secondary font-bold text-[10px] uppercase">
                  Haramaya Certified
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Craft academic defense slide decks, Overleaf-ready Beamer .tex, and School of Graduate Studies front-matter.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-9 h-9 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Selector & Actions Bar */}
        <div className="px-5 py-2.5 bg-surface-container-lowest border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'visual_deck', label: 'Interactive Slide Carousel', icon: 'co_present' },
              { id: 'latex_source', label: 'LaTeX Beamer (.tex)', icon: 'code' },
              { id: 'preliminaries', label: 'Thesis Preliminary Sheets', icon: 'description' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface border border-outline-variant/20 text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {onRequestDesignService && (
              <button
                onClick={() => {
                  onClose();
                  onRequestDesignService();
                }}
                className="px-3 py-1.5 rounded-xl bg-secondary/15 hover:bg-secondary/25 text-secondary font-bold flex items-center gap-1 cursor-pointer transition-all border border-secondary/30"
              >
                <span className="material-symbols-outlined text-[15px]">design_services</span>
                <span>Order Custom Slide Design</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content Workspace */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-outline-variant/20">
          
          {/* Left Panel: Parameters / Customization Form */}
          <div className="lg:col-span-4 p-5 space-y-4 bg-surface-container-lowest/50 overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Thesis & Defense Metadata</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">Scholar / Candidate Name:</label>
                <input
                  type="text"
                  value={scholarName}
                  onChange={(e) => setScholarName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Degree Program:</label>
                <input
                  type="text"
                  value={degreeProgram}
                  onChange={(e) => setDegreeProgram(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">College / Institute:</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Department:</label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Research / Thesis Title:</label>
                <textarea
                  rows={2}
                  value={thesisTitle}
                  onChange={(e) => setThesisTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:border-secondary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Major Advisor:</label>
                  <input
                    type="text"
                    value={advisorName}
                    onChange={(e) => setAdvisorName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-surface border border-outline-variant/30 text-on-surface text-[11px] focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface block mb-1">Defense Period:</label>
                  <input
                    type="text"
                    value={defenseDate}
                    onChange={(e) => setDefenseDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-surface border border-outline-variant/30 text-on-surface text-[11px] focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              {/* Color Scheme Picker */}
              <div>
                <label className="font-bold text-on-surface block mb-1.5">Slide Presentation Archetype:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'emerald_gold', label: 'Haramaya Green', color: 'bg-[#0b3c1e]' },
                    { id: 'navy_ochre', label: 'Academic Navy', color: 'bg-[#0b1c30]' },
                    { id: 'burgundy', label: 'Dean Burgundy', color: 'bg-[#4a0e17]' },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      onClick={() => setColorTheme(thm.id as any)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        colorTheme === thm.id
                          ? 'border-secondary bg-surface shadow-xs font-bold text-secondary'
                          : 'border-outline-variant/20 bg-surface/50 text-on-surface-variant hover:bg-surface'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${thm.color} mx-auto block mb-1 shadow-xs`} />
                      <span className="text-[10px] block">{thm.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Active Tab Viewport */}
          <div className="lg:col-span-8 p-5 flex flex-col justify-between space-y-4 bg-surface">
            
            {/* VIEW 1: Interactive Slide Carousel */}
            {activeTab === 'visual_deck' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface">
                      Slide {currentSlideIndex + 1} of {slides.length}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-mono">
                      (16:9 Academic Widescreen)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentSlideIndex === 0}
                      className="p-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high disabled:opacity-30 cursor-pointer text-on-surface"
                      title="Previous Slide"
                    >
                      <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                    <button
                      onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                      disabled={currentSlideIndex === slides.length - 1}
                      className="p-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high disabled:opacity-30 cursor-pointer text-on-surface"
                      title="Next Slide"
                    >
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* 16:9 Slide Canvas Mockup */}
                <div
                  className={`w-full aspect-[16/9] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl text-white relative overflow-hidden transition-all ${
                    colorTheme === 'emerald_gold'
                      ? 'bg-gradient-to-br from-[#0b3c1e] to-[#041d0e]'
                      : colorTheme === 'navy_ochre'
                      ? 'bg-gradient-to-br from-[#0b1c30] to-[#040c17]'
                      : 'bg-gradient-to-br from-[#4a0e17] to-[#25050a]'
                  }`}
                >
                  {/* Watermark Logo / Ribbon */}
                  <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
                    <span className="material-symbols-outlined text-[140px]">school</span>
                  </div>

                  {/* Top Slide Header */}
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-white/20 text-[11px] font-mono uppercase tracking-wider font-bold">
                        Haramaya University
                      </span>
                      <span className="text-xs text-white/80 font-medium">
                        {slides[currentSlideIndex].header}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-white/70">
                      Slide {currentSlideIndex + 1}/{slides.length}
                    </span>
                  </div>

                  {/* Slide Main Body */}
                  {slides[currentSlideIndex].type === 'title' ? (
                    <div className="space-y-4 my-auto">
                      <h2 className="text-lg sm:text-2xl font-black font-serif text-[#ffdbca] leading-tight max-w-2xl">
                        {slides[currentSlideIndex].title}
                      </h2>
                      <p className="text-xs text-white/80 italic font-serif">
                        {slides[currentSlideIndex].subtitle}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/15 text-white/90">
                        {slides[currentSlideIndex].details?.map((d, i) => (
                          <div key={i} className="truncate">
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 my-auto">
                      <h3 className="text-base sm:text-xl font-bold font-serif text-[#ffdbca]">
                        {slides[currentSlideIndex].title}
                      </h3>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-white/95">
                        {slides[currentSlideIndex].points?.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-[#ffdbca] shrink-0 mt-1.5 shadow-xs" />
                            <span className="leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bottom Slide Footer */}
                  <div className="flex items-center justify-between text-[10px] text-white/60 border-t border-white/15 pt-2">
                    <span>{scholarName} • {degreeProgram}</span>
                    <span>{slides[currentSlideIndex].footnote || 'Directorate of Postgraduate Programs'}</span>
                  </div>
                </div>

                {/* Carousel Thumbnails */}
                <div className="grid grid-cols-7 gap-1.5 pt-1">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                        currentSlideIndex === idx
                          ? 'border-secondary bg-secondary/15 font-bold text-secondary'
                          : 'border-outline-variant/20 bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      <span className="block text-[10px]">#{s.id}</span>
                      <span className="block text-[9px] truncate">{s.header.split(' ')[1] || s.header}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 2: LaTeX Beamer Source Code */}
            {activeTab === 'latex_source' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-on-surface">Standard Beamer LaTeX Source</span>
                    <span className="text-[11px] text-on-surface-variant ml-2 font-mono">
                      (Compiled with pdflatex / xelatex)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(generateBeamerLatex(), 'latex')}
                      className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center gap-1 cursor-pointer transition-all border border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {copied === 'latex' ? 'check' : 'content_copy'}
                      </span>
                      <span>{copied === 'latex' ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadFile(generateBeamerLatex(), 'Haramaya_Defense_Beamer.tex')}
                      className="px-3 py-1.5 rounded-xl bg-secondary hover:brightness-105 text-on-secondary font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                    >
                      <span className="material-symbols-outlined text-[15px]">download</span>
                      <span>Download .tex</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0b1c30] text-blue-200 font-mono text-xs leading-relaxed max-h-[50vh] overflow-y-auto border border-blue-900/50 scrollbar-thin">
                  <pre className="whitespace-pre-wrap">{generateBeamerLatex()}</pre>
                </div>
              </div>
            )}

            {/* VIEW 3: Thesis Preliminaries */}
            {activeTab === 'preliminaries' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-on-surface">Official Preliminary Sheets</span>
                    <span className="text-[11px] text-on-surface-variant ml-2">
                      Title Page, Board of Examiners Approval Sheet & Declaration
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(generatePreliminaries(), 'prelim')}
                      className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center gap-1 cursor-pointer transition-all border border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {copied === 'prelim' ? 'check' : 'content_copy'}
                      </span>
                      <span>{copied === 'prelim' ? 'Copied!' : 'Copy Text'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadFile(generatePreliminaries(), 'Thesis_Approval_Preliminaries.txt')}
                      className="px-3 py-1.5 rounded-xl bg-secondary hover:brightness-105 text-on-secondary font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                    >
                      <span className="material-symbols-outlined text-[15px]">download</span>
                      <span>Download .txt</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-surface-container-lowest text-on-surface font-mono text-xs leading-relaxed max-h-[50vh] overflow-y-auto border border-outline-variant/30 scrollbar-thin whitespace-pre-wrap">
                  {generatePreliminaries()}
                </div>
              </div>
            )}

            {/* Bottom Footer Info */}
            <div className="pt-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                <span>Certified for Haramaya University School of Graduate Studies Guidelines</span>
              </div>
              <span className="font-bold text-secondary">
                Wirtuu Kompiitaraa Ilillii • Digital Typesetting Division
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
