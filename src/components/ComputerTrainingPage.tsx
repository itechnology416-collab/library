import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Language } from '../types';

interface ComputerTrainingPageProps {
  currentLanguage: Language;
  onOpenVerify?: (certNo: string) => void;
  onShowToast: (msg: string) => void;
  onNavigateHome: () => void;
}

interface TrainingModule {
  id: string;
  title: string;
  category: 'Foundation' | 'Office & Productivity' | 'Internet & Cloud' | 'Advanced Skills';
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  icon: string;
  topics: string[];
  completed?: boolean;
}

export const ComputerTrainingPage: React.FC<ComputerTrainingPageProps> = ({
  currentLanguage,
  onOpenVerify,
  onShowToast,
  onNavigateHome,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({
    'mod-1': true,
  });
  const [activeTab, setActiveTab] = useState<'modules' | 'typing_practice' | 'quiz' | 'certification'>('modules');

  // Typing practice state
  const [typingText, setTypingText] = useState<string>('Haramaya University computer literacy and digital training centre empowers researchers, students, and staff with world-class computing skills.');
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);

  const modules: TrainingModule[] = [
    {
      id: 'mod-1',
      title: 'Computer Hardware, OS & File Management',
      category: 'Foundation',
      duration: '4 Hours',
      level: 'Beginner',
      description: 'Master the fundamentals of computer architecture, operating systems (Windows & Linux), file directory structures, and peripheral maintenance.',
      icon: 'computer',
      topics: ['CPU, RAM & Storage Architecture', 'File Organization & Directory Trees', 'Peripheral Devices & Drivers', 'Control Panel & System Settings'],
    },
    {
      id: 'mod-2',
      title: 'Touch Typing & Keyboard Mastery',
      category: 'Foundation',
      duration: '3 Hours',
      level: 'Beginner',
      description: 'Learn correct finger placement, home row discipline, and touch typing techniques to boost typing speed and eliminate keyboard fatigue.',
      icon: 'keyboard',
      topics: ['Home Row Posture & Technique', 'Speed Drills & Rhythm', 'Numeric Keypad & Shortcuts', 'Ergonomic Workstation Setup'],
    },
    {
      id: 'mod-3',
      title: 'Microsoft Word & Academic Document Formatting',
      category: 'Office & Productivity',
      duration: '6 Hours',
      level: 'Intermediate',
      description: 'Professional document formatting for thesis, research papers, and reports adhering to institutional style guides and APA/MLA standards.',
      icon: 'description',
      topics: ['Styles, Headings & Table of Contents', 'Headers, Footers & Page Numbering', 'Tables, Figures & Captions', 'Track Changes & Collaborative Editing'],
    },
    {
      id: 'mod-4',
      title: 'Excel Spreadsheets & Data Analysis',
      category: 'Office & Productivity',
      duration: '8 Hours',
      level: 'Intermediate',
      description: 'Data tabulation, sorting, filtering, formulas, statistical functions, and chart visualization for research data and administrative budgeting.',
      icon: 'table_chart',
      topics: ['Workbook Layout & Cell Formatting', 'Arithmetic Formulas & VLOOKUP/XLOOKUP', 'IF Statements & Conditional Formatting', 'Pivot Tables & Chart Visualizations'],
    },
    {
      id: 'mod-5',
      title: 'PowerPoint & Research Presentation Studio',
      category: 'Office & Productivity',
      duration: '5 Hours',
      level: 'Beginner',
      description: 'Design engaging, highly professional academic slide decks with impactful typography, media integration, and dynamic slide transitions.',
      icon: 'slideshow',
      topics: ['Slide Master & Theme Customization', 'Visual Hierarchy & Negative Space', 'Data Graphics & Infographics', 'Presentation Delivery & Timing'],
    },
    {
      id: 'mod-6',
      title: 'Internet Research, Email & Cloud Collaboration',
      category: 'Internet & Cloud',
      duration: '4 Hours',
      level: 'Beginner',
      description: 'Advanced web search strategies, Google Scholar index querying, professional email etiquette, and cloud storage collaboration (Google Drive/OneDrive).',
      icon: 'cloud_sync',
      topics: ['Boolean Operators & Google Scholar Queries', 'Institutional Email Protocols & Signatures', 'Cloud Storage Sharing & Permissions', 'Web Security & Browser Hygiene'],
    },
    {
      id: 'mod-7',
      title: 'Cybersecurity, Password Hygiene & Anti-Phishing',
      category: 'Advanced Skills',
      duration: '3 Hours',
      level: 'Intermediate',
      description: 'Protect institutional credentials, identify phishing attempts, manage password vaults securely, and safeguard sensitive research data.',
      icon: 'security',
      topics: ['Phishing & Social Engineering Defense', 'Multi-Factor Authentication (MFA)', 'Secure Password Vaults', 'Data Backup & Ransomware Prevention'],
    },
    {
      id: 'mod-8',
      title: 'AI Productivity Tools for Researchers',
      category: 'Advanced Skills',
      duration: '5 Hours',
      level: 'Advanced',
      description: 'Ethical and effective utilization of generative AI assistants, literature summarization tools, grammar checkers, and reference managers.',
      icon: 'psychology',
      topics: ['Prompt Engineering for Academic Research', 'Literature Review Synthesis', 'Grammar & Tone Optimization', 'Ethical Citations & AI Disclosure'],
    },
  ];

  const filteredModules = modules.filter((m) => {
    const matchesCat = activeCategory === 'all' || m.category === activeCategory;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setUserInput(val);
    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    if (startTime) {
      const timeElapsedMinutes = (Date.now() - startTime) / 60000;
      if (timeElapsedMinutes > 0) {
        const wordsTyped = val.trim().split(/\s+/).length;
        const calculatedWpm = Math.round(wordsTyped / timeElapsedMinutes);
        setWpm(calculatedWpm);
      }
    }

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === typingText[i]) {
        correctChars++;
      }
    }
    const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
    setAccuracy(acc);

    if (val === typingText) {
      setIsTypingComplete(true);
      onShowToast('Typing exercise completed successfully! Speed & accuracy verified.');
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface pt-28 pb-16 px-gutter-mobile transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-secondary/15 via-primary/10 to-surface-container p-8 md:p-12 border border-outline-variant/30 shadow-sm"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">school</span>
              Haramaya University • IT & Digital Literacy Center
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold font-serif tracking-tight text-on-surface leading-tight">
              Basic Computer Training & Digital Skills Academy
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
              Empowering students, faculty, researchers, and administrative professionals with essential computing literacy, touch typing speed, advanced Microsoft Office & Google Workspace proficiency, and cybersecurity hygiene.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('modules')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'modules'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Training Curriculum ({modules.length} Modules)</span>
              </button>
              <button
                onClick={() => setActiveTab('typing_practice')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'typing_practice'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">keyboard</span>
                <span>Interactive Typing Speed Lab</span>
              </button>
              <button
                onClick={() => setActiveTab('certification')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'certification'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Official Certificate Verification</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs / Search Bar */}
        {activeTab === 'modules' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Filter Categories & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {['all', 'Foundation', 'Office & Productivity', 'Internet & Cloud', 'Advanced Skills'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer capitalize ${
                      activeCategory === cat
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {cat === 'all' ? 'All Modules' : cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-72">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                </span>
                <input
                  type="text"
                  placeholder="Search computer skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-outline-variant/30"
                />
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((mod, index) => (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[24px]">{mod.icon}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                          {mod.duration}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                          {mod.level}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                        {mod.category}
                      </span>
                      <h3 className="text-lg font-bold font-serif text-on-surface mt-1 group-hover:text-secondary transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-outline-variant/15">
                      <div className="text-[11px] font-bold text-on-surface">Key Learning Topics:</div>
                      <ul className="space-y-1">
                        {mod.topics.map((top, idx) => (
                          <li key={idx} className="text-xs text-on-surface-variant flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            <span className="truncate">{top}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-outline-variant/15">
                    <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                      {completedModules[mod.id] ? 'Completed' : 'Available'}
                    </span>
                    <button
                      onClick={() => setSelectedModule(mod)}
                      className="px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all cursor-pointer shadow-xs"
                    >
                      Start Lesson
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Interactive Typing Speed Lab */}
        {activeTab === 'typing_practice' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm space-y-6 max-w-4xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-serif text-on-surface">
                  Interactive Touch Typing & Speed Lab
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Practice typing the text below to test your speed in Words Per Minute (WPM) and accuracy.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-secondary/10 text-secondary text-center">
                  <div className="text-[10px] font-bold uppercase">Speed</div>
                  <div className="text-lg font-extrabold font-mono">{wpm} WPM</div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 text-center">
                  <div className="text-[10px] font-bold uppercase">Accuracy</div>
                  <div className="text-lg font-extrabold font-mono">{accuracy}%</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm font-mono text-on-surface leading-relaxed">
              {typingText}
            </div>

            <textarea
              rows={4}
              value={userInput}
              onChange={handleTypingChange}
              placeholder="Click here and start typing the exact text above..."
              className="w-full p-4 rounded-2xl bg-surface text-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 font-mono shadow-inner"
            ></textarea>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setUserInput('');
                  setStartTime(null);
                  setWpm(0);
                  setAccuracy(100);
                  setIsTypingComplete(false);
                }}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors cursor-pointer"
              >
                Reset Test
              </button>
              {isTypingComplete && (
                <div className="px-4 py-2 rounded-xl bg-emerald-500 text-on-emerald text-xs font-bold flex items-center gap-2 animate-bounce">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Test Passed Successfully! Certification eligible.</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Certificate Verification Tab */}
        {activeTab === 'certification' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm space-y-6 max-w-3xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-secondary/15 text-secondary mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">workspace_premium</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-serif text-on-surface">
                Haramaya Computer Literacy Certificate
              </h2>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Upon completing all 8 modules and passing the practical touch typing & office suite exam, students are awarded an official digitally-signed certificate of competency.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/30 max-w-lg mx-auto space-y-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-mono">Certificate ID:</span>
                <span className="text-xs font-bold font-mono text-secondary">HU-IT-2026-9481</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-mono">Issuer:</span>
                <span className="text-xs font-bold text-on-surface">Haramaya Computer Training Center</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-mono">Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 text-[11px] font-bold">
                  Official Approved
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onOpenVerify) {
                  onOpenVerify('HU-IT-2026-9481');
                } else {
                  onShowToast('Certificate HU-IT-2026-9481 verified successfully.');
                }
              }}
              className="px-6 py-3 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all shadow-sm cursor-pointer"
            >
              Verify Digital Credentials in Registry
            </button>
          </motion.div>
        )}

        {/* Selected Module Detail Modal */}
        {selectedModule && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl max-w-xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">{selectedModule.icon}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      {selectedModule.category}
                    </span>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">
                      {selectedModule.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
                    Duration: {selectedModule.duration}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    Level: {selectedModule.level}
                  </span>
                </div>

                <p className="text-sm text-on-surface leading-relaxed">
                  {selectedModule.description}
                </p>

                <div className="p-4 rounded-2xl bg-surface-container space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Comprehensive Curriculum Syllabus
                  </h4>
                  <ul className="space-y-2">
                    {selectedModule.topics.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-on-surface">
                        <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/15 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setCompletedModules((prev) => ({ ...prev, [selectedModule.id]: true }));
                    onShowToast(`Progress saved for ${selectedModule.title}!`);
                    setSelectedModule(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-105 transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">done_all</span>
                  <span>Mark Module Complete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};
