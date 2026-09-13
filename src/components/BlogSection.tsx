import React, { useState } from 'react';
import { Language } from '../types';

interface BlogSectionProps {
  currentLanguage: Language;
}

interface Article {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  date: string;
  category:
    | 'Computer skills'
    | 'Academic tips'
    | 'Research methodology'
    | 'Language learning'
    | 'Software tutorials'
    | 'Career guidance'
    | 'Writing advice'
    | 'Study strategies';
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
  tags: string[];
  keyTakeaways: string[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ currentLanguage }) => {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'Academic tips', label: 'Academic Tips' },
    { id: 'Research methodology', label: 'Research Methodology' },
    { id: 'Computer skills', label: 'Computer Skills' },
    { id: 'Software tutorials', label: 'Software Tutorials' },
    { id: 'Language learning', label: 'Language Learning' },
    { id: 'Writing advice', label: 'Writing Advice' },
    { id: 'Career guidance', label: 'Career Guidance' },
    { id: 'Study strategies', label: 'Study Strategies' },
  ];

  const articles: Article[] = [
    {
      id: 'blog-1',
      title: 'The 3-Second Rule: Designing Doctoral Defense Slides Examiners Truly Absorb',
      author: 'Mr. Feysal Hussein',
      authorRole: 'Director & Lead Publishing Consultant',
      date: 'October 12, 2024',
      category: 'Academic tips',
      readTime: '6 min read',
      image:
        'https://images.unsplash.com/photo-1542744094-3a31727201ec?auto=format&fit=crop&w=800&q=80',
      excerpt:
        'Why cognitive overload causes dissertation committees to lose track of your key empirical findings, and how to structure assertion-evidence slide architecture.',
      content: `When defending a master's thesis or doctoral dissertation at Haramaya University or international symposia, committee members face severe cognitive split-attention. If a slide requires more than 3 seconds to decipher, the examiner stops listening to your spoken defense.

Key Architectural Protocols:
1. Lead with Assertive Action Headlines: Never use generic labels like "Results 4.2". Write: "Hypothesis Confirmed: Controlled Drip Irrigation Elevated Sorghum Biomass by 24.6%".
2. Direct Labeling Over Detached Legends: Place statistical annotations right next to trendlines instead of forcing eyes to bounce to a distant legend key.
3. High-Contrast Monospace Data Tables: Highlight only the statistically significant p-values or regression coefficients with subtle tinted badges.
4. Clean Negative Space: Limit each slide to one core empirical takeaway.`,
      keyTakeaways: [
        'Replace passive topic headers with complete declarative findings.',
        'Keep slide visual hierarchy digestible within 3 seconds of glance time.',
        'Integrate direct curve annotations to eliminate cognitive strain.',
      ],
      tags: ['Defense', 'Doctoral', 'PowerPoint', 'Presentation'],
    },
    {
      id: 'blog-2',
      title: 'Statistical Rigor in Agricultural & Bio-Science Research Methodologies',
      author: 'Senior Research Faculty',
      authorRole: 'Methodology & Peer Review Desk',
      date: 'November 04, 2024',
      category: 'Research methodology',
      readTime: '8 min read',
      image:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      excerpt:
        'A comprehensive review of sample size justification, randomized complete block designs (RCBD), and ANOVA post-hoc validations for peer-reviewed journal submission.',
      content: `Achieving publication acceptance in high-impact indexed journals requires unwavering transparency in your empirical design. At Wirtuu Kompiitaraa Ilillii, we assist researchers in refining experimental frameworks.

Methodological Checkpoints:
1. Sample Size Power Analysis: Ensure statistical power (1 - beta) exceeds 0.80 before data collection commences.
2. Treatment of Outliers: Always document whether outliers were trimmed or winsorized, accompanied by sensitivity analyses.
3. Reporting Effect Sizes: P-values alone do not convey practical significance; always report Cohen's d or partial eta-squared alongside confidence intervals.`,
      keyTakeaways: [
        'Always provide statistical power calculations for experimental trials.',
        'Report effect sizes and 95% confidence intervals alongside p-values.',
        'Ensure full reproducibility of data cleansing pipelines.',
      ],
      tags: ['Research', 'Statistics', 'Methodology', 'ANOVA'],
    },
    {
      id: 'blog-3',
      title: 'Mastering Advanced Layout & Styles in Microsoft Word for 300+ Page Theses',
      author: 'Editorial Formatting Unit',
      authorRole: 'Senior Typesetting Specialists',
      date: 'September 19, 2024',
      category: 'Computer skills',
      readTime: '7 min read',
      image:
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
      excerpt:
        'Stop battling corrupted pagination and broken tables of contents. Learn section breaks, multi-level numbering schemes, and automated caption cross-referencing.',
      content: `Large academic monographs frequently crash or suffer broken layouts due to manual formatting hacks. Professional publishing relies on strict hierarchical paragraph and character styles.

Key Formatting Best Practices:
1. Section Breaks (Next Page vs. Continuous): Isolate preliminary Roman numeral pages (i, ii, iii) from main Arabic numeral body text (1, 2, 3) through decoupled headers and footers.
2. Multi-Level List Linked to Heading Styles: Bind Level 1 to Heading 1, Level 2 to Heading 2 to ensure automatic table of contents and chapter figure numbering (Figure 1.1, Figure 1.2).
3. Keeping Paragraphs with Next: Eliminate orphan headers by enabling "Keep with next" in paragraph flow properties.`,
      keyTakeaways: [
        'Unlink header/footer chains when shifting between preliminary and body pages.',
        'Bind multi-level numbering strictly to built-in heading styles.',
        'Use automated cross-references instead of typed figure and table numbers.',
      ],
      tags: ['Word', 'Formatting', 'Thesis', 'Publishing'],
    },
    {
      id: 'blog-4',
      title: 'LaTeX vs Microsoft Word for Technical Publishing: Which Should You Choose?',
      author: 'Technical Typesetting Team',
      authorRole: 'STEM Publishing Advisory',
      date: 'August 29, 2024',
      category: 'Software tutorials',
      readTime: '6 min read',
      image:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      excerpt:
        'A balanced comparison between LaTeX (Overleaf/TeX Live) and Word for handling complex mathematical notation, BibTeX bibliography databases, and university templates.',
      content: `Choosing the appropriate typesetting ecosystem determines both your authoring velocity and typographic polish.

When to Use LaTeX:
- Manuscripts featuring heavy mathematical proofs, matrix equations, and Greek indices.
- Automated BibTeX citation management across 200+ bibliography references.
- Exact adherence to IEEE or Springer LNCS conference camera-ready templates.

When to Use Microsoft Word:
- Humanities, social sciences, and non-STEM monographs where collaborative track-changes review with multiple supervisors is required.
- Rapid visual insertion of rich photo galleries and localized multilingual scripts (Qubee and Ethiopic).`,
      keyTakeaways: [
        'LaTeX excels at automated formula rendering and strict publisher templates.',
        'Word is superior for multi-author collaborative commenting in non-STEM disciplines.',
        'Both tools require disciplined master style sheets.',
      ],
      tags: ['LaTeX', 'Word', 'Software', 'BibTeX'],
    },
    {
      id: 'blog-5',
      title: 'Preserving Cultural Safuu in Modern Oromo Literature: Orthographic Standards in Qubee',
      author: 'Linguistic Review Committee',
      authorRole: 'Oromo Language Department',
      date: 'September 28, 2024',
      category: 'Language learning',
      readTime: '8 min read',
      image:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      excerpt:
        'An examination of ethical codes, philosophical idioms (Mammaaksa), and orthographic consistency in modern Oromo publications.',
      content: `Aadaa fi Safuun Oromoo represent the ethical foundation of community discourse and literary heritage. When publishing books in Afaan Oromoo, orthographic precision in Qubee ensures historical depth and phonetic fidelity.

At our editorial desk at Haramaya University, every manuscript undergoes thorough review to ensure double vowel length (dhedheera) and consonant gemination (jabaa) are accurately represented without eroding traditional idioms.`,
      keyTakeaways: [
        'Strict adherence to Qubee vowel length and consonant doubling rules.',
        'Preservation of classical proverbs within contemporary prose.',
        'Orthographic consistency across academic textbooks and fiction.',
      ],
      tags: ['Afaan Oromoo', 'Qubee', 'Linguistics', 'Safuu'],
    },
    {
      id: 'blog-6',
      title: 'Overcoming Thesis Writer’s Block: Structured Pomodoro & Modular Drafting',
      author: 'Academic Coaching Desk',
      authorRole: 'Student Mentorship Fellow',
      date: 'July 14, 2024',
      category: 'Study strategies',
      readTime: '5 min read',
      image:
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      excerpt:
        'Practical cognitive frameworks to break 100-page thesis paralysis into structured daily modular writing sprints.',
      content: `Thesis writer's block is rarely a lack of intelligence; it is almost always a lack of structural deconstruction. Trying to write "Chapter 4" as a monolith creates psychological overwhelm.

Effective Daily Strategy:
1. Micro-Section Splitting: Never put "Write Discussion" on your daily agenda. Write: "Draft 2 paragraphs comparing findings with Aster et al. (2022)".
2. Zero Draft Method: Write without editing or checking citations for the first 35 minutes; refine formatting and references in a separate dedicated block.
3. End on an Incomplete Sentence: Stop your day mid-thought with notes on how to finish, making the next morning's start instant.`,
      keyTakeaways: [
        'Break thesis goals into 250-word modular micro-sprints.',
        'Separate initial generative drafting from editorial refinement.',
        'End daily writing sessions with an explicit entry point for tomorrow.',
      ],
      tags: ['Study Habits', 'Productivity', 'Writing', 'Thesis'],
    },
    {
      id: 'blog-7',
      title: 'Publish or Flourish: Navigating Peer Review & Journal Rebuttal Letters',
      author: 'Mr. Feysal Hussein',
      authorRole: 'Director & Lead Publishing Consultant',
      date: 'June 05, 2024',
      category: 'Writing advice',
      readTime: '7 min read',
      image:
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      excerpt:
        'How to write respectful, point-by-point author rebuttal matrices that satisfy Reviewer 2 and expedite editor acceptance.',
      content: `Receiving a "Revise and Resubmit" decision is a victory, not a rejection. The secret to a swift final acceptance lies entirely in the clarity and diplomatic precision of your response letter.

Golden Rules for Rebuttals:
1. Never Argue Emotionally: Thank reviewers genuinely for their constructive critique even when you disagree.
2. Side-by-Side Response Matrix: Quote each reviewer remark verbatim in bold, followed by your detailed rebuttal and exact line numbers in the revised manuscript.
3. Highlight All Manuscript Modifications: Use distinct color changes or track-changes so the editor can verify revisions in under 10 minutes.`,
      keyTakeaways: [
        'Construct a 3-column table: Reviewer Comment, Author Response, Page/Line Number.',
        'Acknowledge valid points generously before defending methodological choices.',
        'Make the revised manuscript effortless for the handling editor to approve.',
      ],
      tags: ['Publishing', 'Peer Review', 'Rebuttal', 'Journals'],
    },
    {
      id: 'blog-8',
      title: 'Building an Academic & Digital Skill Portfolio for International Scholarships',
      author: 'Academic Advisory Unit',
      authorRole: 'Scholarship & Career Guidance Desk',
      date: 'May 18, 2024',
      category: 'Career guidance',
      readTime: '6 min read',
      image:
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      excerpt:
        'Strategic advice for Ethiopian graduates applying for Erasmus Mundus, Fulbright, and DAAD doctoral scholarships.',
      content: `International scholarship selection panels evaluate candidates on evidence of self-directed leadership and specialized technical acumen.

Strategic Advice for Applicants:
1. Align Your Statement of Purpose with National Priorities: Demonstrate how your research will address food security, water resource engineering, or multilingual education in the Horn of Africa.
2. Showcase Tangible Software Acumen: Certified skills in Python, R, GIS, and SPSS immediately set your application apart from generic academic transcripts.
3. Obtain Authoritative Institutional References: Secure letters from mentors who can speak directly to your analytical stamina and integrity.`,
      keyTakeaways: [
        'Directly link your proposed research to regional socio-economic impacts.',
        'Highlight verified technical competencies in statistical and data software.',
        'Prepare clean, standardized Europass / academic CV layouts.',
      ],
      tags: ['Scholarships', 'Erasmus', 'Career', 'Fulbright', 'DAAD'],
    },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyCitation = (art: Article) => {
    const citation = `${art.author} (${art.date.split(' ')[2]}). "${art.title}". Wirtuu Kompiitaraa Ilillii Scholarly Journal, Haramaya University.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 3000);
  };

  return (
    <section className="px-gutter-mobile py-10 bg-surface" id="blog">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
            Academic Insights & Research Journal
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-3xl md:text-4xl text-on-surface font-bold">
            The Scholarly Publishing & Study Journal
          </h1>
          <p className="font-body-sm text-sm text-on-surface-variant">
            In-depth guides on defense presentations, research methodologies, computer skills, software tutorials, and scholarship strategies curated by Haramaya University consultants.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search articles by title, author, keyword, methodology, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
            />
          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-secondary text-on-secondary shadow-xs font-bold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
          <span>
            Showing <strong>{filteredArticles.length}</strong> academic articles
          </span>
          {(selectedCategory !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-secondary font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Blog Grid */}
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-surface-container-lowest border border-outline-variant/20 space-y-3">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">
              article
            </span>
            <p className="text-sm font-semibold text-on-surface">No articles matched your criteria.</p>
            <p className="text-xs text-on-surface-variant">Try browsing other categories or clear your search input.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs hover:border-secondary/40 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-secondary text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      {art.category}
                    </span>
                    <button
                      onClick={(e) => toggleBookmark(art.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center hover:bg-secondary transition-colors"
                      title="Bookmark Article"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {bookmarkedIds.includes(art.id) ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>

                  <h3 className="font-title-md text-sm font-bold text-on-surface line-clamp-2 group-hover:text-secondary transition-colors">
                    {art.title}
                  </h3>

                  <p className="font-body-sm text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {art.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded bg-surface-container text-[10px] text-on-surface font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-outline-variant/10 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs text-on-surface font-bold block">{art.author}</span>
                    <span className="text-[10px] text-on-surface-variant">{art.authorRole}</span>
                  </div>
                  <span className="text-xs font-bold text-secondary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Article Reader Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
            <div className="bg-surface-container-lowest max-w-3xl w-full rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-8">
              <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
                <span className="px-2.5 py-1 rounded bg-secondary/15 text-secondary text-xs font-bold uppercase tracking-wider">
                  {activeArticle.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCitation(activeArticle)}
                    className="px-3 py-1.5 rounded-lg bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedCitation ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedCitation ? 'Citation Copied' : 'Cite Article'}</span>
                  </button>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>

              <div>
                <h2 className="font-headline-sm text-2xl md:text-3xl font-bold text-on-surface">
                  {activeArticle.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mt-2">
                  <span>Author: <strong>{activeArticle.author}</strong> ({activeArticle.authorRole})</span>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                  <span>•</span>
                  <span>{activeArticle.readTime}</span>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden aspect-video max-h-72">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Key Takeaways Box */}
              {activeArticle.keyTakeaways && activeArticle.keyTakeaways.length > 0 && (
                <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                    <span>Key Takeaways for Authors</span>
                  </span>
                  <ul className="space-y-1.5">
                    {activeArticle.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-on-surface">
                        <span className="text-secondary font-bold">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="font-body-md text-sm text-on-surface leading-relaxed whitespace-pre-line space-y-4">
                {activeArticle.content}
              </div>

              <div className="pt-4 border-t border-outline-variant/15 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {activeArticle.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-surface-container text-[10px] text-on-surface font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2 rounded-xl bg-secondary text-white text-xs font-bold cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
