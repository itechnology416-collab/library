export type Language = 'en' | 'or' | 'am' | 'ar';
export type ThemeMode = 'light' | 'dark' | 'netflix';

export type ServiceCategory =
  | 'ppt'
  | 'english_book'
  | 'arabic_book'
  | 'oromoo_book'
  | 'amharic_book'
  | 'translation'
  | 'editing'
  | 'formatting'
  | 'elearning'
  | 'other';

export type RequestStatus =
  | 'Submitted'
  | 'Reviewing'
  | 'In Progress'
  | 'Client Review'
  | 'Revision Requested'
  | 'Completed';

export interface ProjectDeliverable {
  id: string;
  title: string;
  fileType: 'PPTX' | 'PDF' | 'DOCX' | 'ZIP';
  fileSize: string;
  uploadedAt: string;
  version: string;
  downloadUrl?: string;
}

export interface ProjectMessage {
  id: string;
  sender: string;
  senderRole: 'client' | 'admin' | 'editor';
  message: string;
  timestamp: string;
}

export interface RevisionEntry {
  id: string;
  requestedAt: string;
  notes: string;
  status: 'Pending' | 'In Progress' | 'Addressed';
}

export interface ProofAnnotation {
  id: string;
  slideOrPageNumber: number;
  snippetTitle: string;
  comment: string;
  author: string;
  authorRole: 'client' | 'editor';
  createdAt: string;
  resolved: boolean;
}

export interface InteractiveProof {
  id: string;
  pageNumber: number;
  title: string;
  previewType: 'slide' | 'manuscript_page';
  headline: string;
  bulletPoints: string[];
  notes?: string;
  status: 'Approved' | 'Needs Revision' | 'Pending Review';
  annotations: ProofAnnotation[];
}

export interface PaymentProof {
  transactionRef: string;
  bankName: 'Commercial Bank of Ethiopia (CBE)' | 'Telebirr' | 'Awash Bank' | 'Dashen Bank' | 'Cash / Campus Office';
  amountETB: number;
  status: 'Unpaid' | 'Pending Verification' | 'Verified';
  receiptFileName?: string;
  submittedAt: string;
  verifiedAt?: string;
  payerName: string;
  verifiedBy?: string;
}

export interface ApprovalCertificate {
  certificateNumber: string;
  clientName: string;
  affiliation: string;
  projectTitle: string;
  serviceCategory: ServiceCategory;
  approvedDate: string;
  pagesApproved: number;
  digitalChecksum: string;
  directorSignature: string;
  clientSignature: string;
  status: 'Official Approved';
}

export interface SupplementaryFile {
  id: string;
  name: string;
  fileSize: string;
  uploadedAt: string;
  version: string;
  category: 'Raw Dataset' | 'High-Res Figure' | 'Faculty Guidelines' | 'Revised Text';
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dayTarget: number;
  status: 'completed' | 'in_progress' | 'pending';
  description: string;
  completedDate?: string;
}

export interface ServiceRequest {
  id: string;
  clientName: string;
  affiliation: string;
  phone: string;
  telegram?: string;
  email?: string;
  serviceCategory: ServiceCategory;
  targetLanguage: Language;
  projectTitle: string;
  description: string;
  estimatedPages: number;
  expectedDeadline: string;
  status: RequestStatus;
  createdAt: string;
  fileName?: string;
  adminNotes?: string;
  estimatedCostETB?: number;
  deliverables?: ProjectDeliverable[];
  messages?: ProjectMessage[];
  revisions?: RevisionEntry[];
  paymentProof?: PaymentProof;
  approvalCertificate?: ApprovalCertificate;
  proofs?: InteractiveProof[];
  supplementaryFiles?: SupplementaryFile[];
  milestones?: ProjectMilestone[];
}

export interface BookChapter {
  id: number;
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  titleLocalized: Record<Language, string>;
  category: string;
  categoryLabel: Record<Language, string>;
  author: string;
  affiliation: string;
  coverUrl: string;
  language: Language;
  langTag: string;
  description: string;
  descriptionLocalized: Record<Language, string>;
  pages: number;
  publishedYear: string;
  chapters: BookChapter[];
  downloadAllowed: boolean;
  bookmarked?: boolean;
  isDemo?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'presentation';
  content: string;
  completed: boolean;
  summaryNotes?: string;
  videoUrl?: string;
  pdfAttachment?: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  language: Language;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass';
  duration: string;
  enrolled: boolean;
  progress: number;
  image: string;
  description: string;
  certificateEligible: boolean;
  lessons: Lesson[];
  quiz?: QuizQuestion[];
  quizPassed?: boolean;
  quizScore?: number;
}

export interface Certificate {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  issuedDate: string;
  instructor: string;
  organization: string;
  grade?: string;
  verified?: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  language: Language;
  fileType: 'PDF' | 'PPTX' | 'DOCX';
  pages: number;
  description: string;
  downloadUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
  tags?: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  language: Language;
  image: string;
  description: string;
  year: string;
  deliverablesSummary: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  affiliation: string;
  role: 'student' | 'client' | 'admin';
}

export interface QuotationLineItem {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface AcademicQuotation {
  quotationNumber: string;
  clientName: string;
  affiliation: string;
  projectTitle: string;
  category: ServiceCategory;
  pages: number;
  urgency: 'standard' | 'express' | 'emergency';
  currency: 'ETB' | 'USD';
  items: QuotationLineItem[];
  subtotal: number;
  urgencySurcharge: number;
  institutionalDiscount: number;
  grandTotal: number;
  estimatedDeliveryDate: string;
  issuedDate: string;
  validUntil: string;
}

export interface ManuscriptDiagnosticResult {
  wordCount: number;
  estimatedPages: number;
  estimatedSlides: number;
  readingTimeMinutes: number;
  dominantLanguage: string;
  charCount: number;
  scriptBreakdown: {
    englishPct: number;
    oromoPct: number;
    amharicPct: number;
    arabicPct: number;
  };
  citationStyleDetected: 'APA' | 'IEEE' | 'Harvard' | 'None Detected';
  citationCount: number;
  hasRTLOrDiacritics: boolean;
  readabilityScore: number;
  readabilityGrade: string;
  recommendations: string[];
}

export interface AcademicGlossaryTerm {
  id: string;
  category: 'research' | 'publishing' | 'computing' | 'islamic_arabic';
  en: string;
  or: string;
  am: string;
  ar: string;
  definition: string;
  example?: string;
}

// Phase 3: Academic LMS, Advisory Desk & Student Portal Types
export interface AdvisoryMessage {
  id: string;
  senderName: string;
  senderRole: 'scholar' | 'director' | 'faculty';
  avatar?: string;
  text: string;
  timestamp: string;
  topic?: string;
  attachmentName?: string;
}

export interface StudentScholarProfile {
  name: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  academicDegree: 'BSc Candidate' | 'MSc Scholar' | 'PhD Candidate' | 'Postdoctoral Researcher' | 'Faculty Member';
  thesisTitle: string;
  advisorName: string;
  defenseDateTarget: string;
  preferredLanguage: Language;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  fileType: 'PPTX' | 'PDF' | 'DOCX' | 'ZIP' | 'MP3';
  fileSize: string;
  downloadCount: number;
  category: 'Lecture Slides' | 'Syllabus' | 'Handout' | 'Citation Template' | 'Phonetic Audio';
  description: string;
  downloadUrl?: string;
}

export interface QuizAttempt {
  id: string;
  courseId: string;
  courseTitle: string;
  scorePct: number;
  totalQuestions: number;
  correctAnswers: number;
  takenAt: string;
  passed: boolean;
}

// Phase 10: Academic Plagiarism Scanner & Originality Matrix
export interface PlagiarismSource {
  id: string;
  title: string;
  repository: 'Haramaya E-Repository' | 'AAU ETD' | 'Jimma IR' | 'Hawassa E-Commons' | 'Ethiopian Open Science Archive' | 'PubMed Central' | 'African Journals Online (AJOL)';
  author: string;
  year: number;
  url: string;
  doi?: string;
  matchPercentage: number;
}

export interface PlagiarismMatchedSegment {
  id: string;
  sourceId: string;
  matchedText: string;
  sourceText: string;
  sourceTitle: string;
  startCharIndex: number;
  endCharIndex: number;
  similarityScore: number;
  type: 'verbatim' | 'paraphrased' | 'citation_missing';
  suggestedAction: string;
}

export interface OriginalityScanResult {
  scanId: string;
  timestamp: string;
  documentTitle: string;
  authorName: string;
  wordCount: number;
  characterCount: number;
  overallSimilarityPct: number;
  directVerbatimPct: number;
  paraphrasedPct: number;
  properlyCitedPct: number;
  status: 'passed' | 'review_required' | 'critical_exceeded';
  matchedSources: PlagiarismSource[];
  matchedSegments: PlagiarismMatchedSegment[];
  certificateHash: string;
}

// Phase 10: Research Grant Proposal & Budget Studio
export interface GrantBudgetItem {
  id: string;
  category: 'personnel' | 'travel_dsa' | 'equipment_consumables' | 'publication_oa' | 'fieldwork' | 'institutional_overhead';
  description: string;
  unit: string;
  quantity: number;
  unitCostETB: number;
  exchangeRateUSD: number; // e.g., 125 ETB / USD
  justification: string;
}

export interface GrantProposalState {
  id: string;
  projectTitle: string;
  principalInvestigator: string;
  coInvestigators: string;
  departmentCollege: string;
  targetAgency: 'Haramaya University RGD' | 'MoSHE Ethiopia' | 'IDRC Canada' | 'Horizon Europe' | 'USAID / Feed the Future' | 'Wellcome Trust';
  grantDurationMonths: number;
  summaryAbstract: string;
  problemStatement: string;
  researchObjectives: string[];
  budgetItems: GrantBudgetItem[];
  institutionalClearance: {
    departmentHeadSigned: boolean;
    researchDeanApproved: boolean;
    irbEthicalClearance: boolean;
  };
}

// Phase 11: Academic Metadata & DOI/CrossRef Schema Studio
export interface DOIMetadataState {
  prefix: string; // e.g., '10.20372' (HU registered prefix)
  suffix: string; // e.g., 'eajs.v18i2.04'
  title: string;
  subtitle?: string;
  publicationType: 'journal_article' | 'book_monograph' | 'conference_proceeding' | 'dissertation' | 'dataset';
  journalOrBookTitle: string;
  volume?: string;
  issue?: string;
  firstPage?: string;
  lastPage?: string;
  publicationDate: string;
  authors: {
    givenName: string;
    familyName: string;
    orcid?: string;
    affiliation: string;
  }[];
  funderName?: string;
  grantNumber?: string;
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/' | 'https://creativecommons.org/licenses/by-nc/4.0/' | 'https://creativecommons.org/licenses/by-sa/4.0/' | 'https://creativecommons.org/publicdomain/zero/1.0/';
  abstract: string;
  targetUrl: string;
}

// Phase 12: Authentication and Authorization System
export type UserRole = 'author' | 'scholar' | 'reviewer' | 'faculty' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  affiliation?: string;
  phone?: string;
  orcid?: string;
  staffOrStudentId?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface JournalReviewerAssignment {
  id: string;
  name: string;
  institution: string;
  status: string;
  recommendation?: string;
  score?: number;
}

export interface JournalSubmission {
  id: string;
  journalName: string;
  manuscriptTitle: string;
  trackingNumber: string;
  authors: string;
  leadAffiliation: string;
  submittedAt: string;
  category: string;
  stage: 'Desk Screening' | 'Under Review' | 'Revision Requested' | 'In Copyediting' | 'Typesetting & Galley' | 'Galley Proof' | 'Published';
  reviewersAssigned: JournalReviewerAssignment[];
  editorInCharge: string;
  targetVolume?: string;
  targetIssue?: string;
  doi?: string;
}

// Phase 4: Peer Reviewer & Journal Editorial Portal Types
export interface PeerReviewAssignment {
  id: string;
  manuscriptTitle: string;
  journal: 'EAJS' | 'HJAS' | 'HLR';
  journalFullName: string;
  trackingCode: string;
  authorsAnonymized: string;
  submissionDate: string;
  deadlineDate: string;
  status: 'Pending Invitation' | 'In Progress' | 'Submitted' | 'Overdue' | 'Declined';
  pages: number;
  wordCount: number;
  abstract: string;
  keywords: string[];
  sampleSections?: {
    introduction: string;
    methodology: string;
    results: string;
    discussion: string;
  };
  currentScores?: {
    novelty: number; // 0-25
    methodology: number; // 0-25
    citations: number; // 0-25
    presentation: number; // 0-25
  };
  recommendation?: 'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject';
  authorFeedback?: string;
  confidentialEditorialNotes?: string;
  doi?: string;
  similarityScorePct?: number;
  completedDate?: string;
}

export interface ReviewerScholarProfile {
  name: string;
  title: string;
  affiliation: string;
  orcid: string;
  email: string;
  phone: string;
  assignedJournals: string[];
  specialties: string[];
  totalCompletedReviews: number;
  averageReviewDays: number;
  recognitionBadge: string;
  availableForReview: boolean;
}

export interface OfficialJournalMeta {
  code: 'EAJS' | 'HJAS' | 'HLR';
  name: string;
  issn: string;
  eissn: string;
  frequency: string;
  focusScope: string;
  editorInChief: string;
  acceptanceRate: string;
  avgReviewCycle: string;
  guidelines: string[];
}

export interface RefereeRecognitionCertificate {
  certificateId: string;
  reviewerName: string;
  manuscriptTitle: string;
  journalName: string;
  trackingCode: string;
  completionDate: string;
  issuingAuthority: string;
  verificationHash: string;
}

// Phase 5: Faculty Researcher & Grants Dashboard Types
export interface FacultyResearcherProfile {
  name: string;
  title: string;
  department: string;
  college: string;
  staffId: string;
  email: string;
  phone: string;
  orcid: string;
  hIndex: number;
  i10Index: number;
  totalCitations: number;
  activePostgraduates: number;
  totalGrantFundingETB: number;
  totalGrantFundingUSD: number;
  researchInterests: string[];
}

export interface GrantMilestone {
  id: string;
  title: string;
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  deliverable: string;
}

export interface GrantBudgetCategory {
  category: string;
  allocatedETB: number;
  spentETB: number;
}

export interface GrantProject {
  id: string;
  title: string;
  funder: string;
  grantNumber: string;
  status: 'Awarded & Active' | 'Proposal Under Review' | 'Milestone Completed' | 'Final Reporting' | 'Closed';
  category: 'Institutional (RGD)' | 'National (MoIT/MoE)' | 'International Bilateral';
  totalBudgetETB: number;
  spentBudgetETB: number;
  totalBudgetUSD: number;
  spentBudgetUSD: number;
  startDate: string;
  endDate: string;
  coPIs: string[];
  publicationsCount: number;
  abstract: string;
  milestones: GrantMilestone[];
  budgetBreakdown: GrantBudgetCategory[];
}

export interface SupervisedThesis {
  id: string;
  studentName: string;
  studentId: string;
  degree: 'MSc' | 'PhD' | 'PostDoc';
  topic: string;
  department: string;
  progress: number; // 0 - 100
  stage: 'Proposal Defense' | 'Field Sampling' | 'Laboratory / Econometric Analysis' | 'Draft Dissertation Review' | 'Defense Slide Preparation (WKI Beamer)' | 'Graduated';
  targetDefenseMonth: string;
  startDate: string;
  lastFeedbackDate: string;
  notes: string;
}

export interface FacultyResearchOutput {
  id: string;
  title: string;
  type: 'Journal Article' | 'University Monograph' | 'Policy Brief' | 'Conference Proceeding';
  publicationVenue: string;
  publicationYear: number;
  doi?: string;
  citations: number;
  linkedGrantId?: string;
  openAccessUrl?: string;
  authors: string;
}

// Phase 6: University Press & Registrar Operations Desk Types
export type ClearanceStatus =
  | 'Pending Review'
  | 'Department Verified'
  | 'Plagiarism Audit Passed'
  | 'Library Hardcopy Received'
  | 'Approved & Cleared'
  | 'Revisions Required';

export interface RegistrarClearance {
  id: string;
  studentName: string;
  studentId: string;
  academicProgram: 'MSc' | 'PhD' | 'PostDoc';
  department: string;
  college: string;
  thesisTitle: string;
  advisorName: string;
  defenseDate: string;
  plagiarismSimilarityPct: number;
  plagiarismCertHash: string;
  hardcopyBindingDelivered: boolean;
  hardcopyCopiesCount: number;
  libraryRepoDepositHandle: string;
  status: ClearanceStatus;
  clearanceCertNumber?: string;
  issuedAt?: string;
  verifiedBy?: string;
  remarks?: string;
}

export type PrintJobStatus =
  | 'Pre-flight Check'
  | 'Plate CTP & RIP'
  | 'Press Run Printing'
  | 'Folding & Gathering'
  | 'Hardcover Foil Bindery'
  | 'QC Inspection'
  | 'Ready for Pickup / Dispatched';

export interface PrintProductionJob {
  id: string;
  jobCode: string;
  title: string;
  clientName: string;
  category: 'PhD Dissertation Hardcover' | 'MSc Thesis Perfect Bound' | 'Peer-Reviewed Journal Vol' | 'University Monograph' | 'Conference Proceedings' | 'Beamer Defense Deck';
  copies: number;
  pageCount: number;
  bindingType: 'Hardcover Leatherette Gold Foil' | 'Perfect Bound Matte Softcover' | 'Wire-O Spiral' | 'Saddle Stitch Booklet';
  paperStock: '100gsm Cream Wood-Free Book Paper' | '80gsm Bright White Laser' | '130gsm Coated Silk Art' | '300gsm C1S Ivory Board (Covers)';
  coverFinish: 'Gloss Thermal Lamination' | 'Velvet Soft-Touch Matte' | 'Gold Foil Stamping + Emboss' | 'Standard Matte';
  status: PrintJobStatus;
  priority: 'Normal' | 'High' | 'Urgent / Convocation Rush';
  requestedDate: string;
  targetDeliveryDate: string;
  costEstimateETB: number;
  assignedOperator: string;
  notes?: string;
}

export interface ISBNRecord {
  id: string;
  isbn: string;
  title: string;
  authorOrEditor: string;
  publicationType: 'Monograph' | 'Textbook' | 'Dissertation Series' | 'Proceedings' | 'Journal (ISSN)';
  issn?: string;
  doiPrefix: string;
  doiSuffix: string;
  allocatedDate: string;
  status: 'Active & In Print' | 'Allocated - Pending Release' | 'Archived';
  depositWithNationalLibrary: boolean;
  barcodeUrl?: string;
  language: string;
}

export interface PressFinancialAuditRecord {
  id: string;
  voucherNumber: string;
  date: string;
  type: 'Author Typesetting Fee' | 'Monograph Royalty Payout' | 'Print Shop Consumable Requisition' | 'Telebirr Book Purchase' | 'Editorial Desk Honorarium' | 'Grant Publication Subsidy';
  amountETB: number;
  amountUSD?: number;
  payerOrPayee: string;
  paymentMethod: 'CBE Account 1000289417625' | 'Telebirr 0927650724' | 'University Internal Budget Transfer' | 'Commercial Bank Cheque';
  referenceNumber: string;
  status: 'Verified & Reconciled' | 'Pending Auditor Signoff' | 'Disputed / Flagged';
  auditorName: string;
  notes?: string;
}

export interface PressInventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Paper Reams' | 'Cover Boards' | 'Bindery & Foil' | 'Inks & Toners' | 'Packaging';
  quantity: number;
  unit: 'Reams' | 'Packs' | 'Rolls' | 'Cartridges' | 'Boxes';
  minReorderLevel: number;
  unitCostETB: number;
  status: 'In Stock' | 'Low Stock' | 'Critically Depleted';
  lastRestockedDate: string;
}

// Phase 7: Institutional Open Access Repository & ETD Archive Types
export type RepositoryCommunity =
  | 'College of Agriculture & Environmental Sciences'
  | 'College of Computing & Informatics'
  | 'College of Health & Medical Sciences'
  | 'Africa Center of Excellence for Climate Smart Ag (Climate-SABC)'
  | 'Haramaya University Press Monographs'
  | 'Annual Research Review (ARR) Conference Proceedings'
  | 'Institute of Pastoral and Agro-Pastoral Studies';

export type RepositoryCollection =
  | 'Doctoral Dissertations (PhD)'
  | 'Master Theses (MSc/MA)'
  | 'Peer-Reviewed Journal Offprints'
  | 'Conference Proceedings Papers'
  | 'Research Datasets & Code'
  | 'University Press Books';

export interface RepositoryBitstream {
  id: string;
  name: string;
  size: string;
  format: 'PDF' | 'ZIP' | 'CSV' | 'MP4' | 'DOCX';
  type: 'Main Full-Text' | 'Supplementary Dataset' | 'Defense Slide Deck' | 'Oral Audio Recording' | 'Clearance Certificate';
  downloadUrl?: string;
  checksumSha256: string;
}

export interface DublinCoreRecord {
  title: string;
  creator: string[];
  subject: string[];
  descriptionAbstract: string;
  publisher: string;
  contributorAdvisor?: string[];
  dateIssued: string;
  type: string;
  format: string;
  identifierUri: string;
  language: string;
  rights: string;
}

export interface RepositoryItem {
  id: string;
  handle: string;
  title: string;
  authors: { name: string; affiliation: string; orcid?: string }[];
  community: RepositoryCommunity;
  collection: RepositoryCollection;
  publicationDate: string;
  dateDeposited: string;
  abstract: string;
  keywords: string[];
  language: 'en' | 'or' | 'am' | 'ar';
  accessLevel: 'Open Access' | 'Embargoed' | 'Campus Restricted';
  embargoUntil?: string;
  license: 'CC BY 4.0' | 'CC BY-NC 4.0' | 'CC BY-NC-ND 4.0' | 'CC0 Public Domain' | 'Institutional Proprietary';
  doi?: string;
  citationCount: number;
  downloadCount: number;
  viewCount: number;
  oaiPmhIdentifier: string;
  advisor?: string;
  bitstreams: RepositoryBitstream[];
  dublinCore: DublinCoreRecord;
  readershipRegions: { country: string; flag: string; count: number }[];
  clearanceRefId?: string;
}

export interface OaiPmhHarvestJob {
  id: string;
  targetAggregator:
    | 'Ethiopian Open Science Archive (EOSA)'
    | 'African Journals Online (AJOL)'
    | 'Crossref Metadata API'
    | 'Google Scholar Indexer'
    | 'OpenDOAR / CORE UK'
    | 'PubMed Central';
  status: 'Synchronized' | 'Sync In Progress' | 'Error' | 'Scheduled';
  lastHarvestDate: string;
  recordsHarvested: number;
  endpointUrl: string;
  oaiVerb: 'ListRecords' | 'Identify' | 'GetRecord' | 'ListIdentifiers';
  resumptionToken?: string;
}

export interface ConferenceProceedingsItem {
  id: string;
  conferenceTitle: string;
  edition: string;
  year: number;
  isbn: string;
  volume: string;
  theme: string;
  venue: string;
  dates: string;
  tracks: string[];
  totalPapers: number;
  chairperson: string;
  bookOfAbstractsUrl?: string;
  proceedingsPdfUrl?: string;
  keynoteSpeakers: { name: string; title: string; institution: string }[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    affiliation?: string;
    phone?: string;
    staffOrStudentId?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  intendedRoute: string | null;
  setIntendedRoute: (route: string | null) => void;
}

// ============================================================================
// PHASE 8: INSTITUTIONAL REVIEW BOARD (IRB) ETHICS & RESEARCH INTELLIGENCE
// ============================================================================

export type IrbCommitteeType =
  | 'CHMS Health & Biomedical Sciences IRB'
  | 'Agriculture & Environmental Sciences Ethics Committee'
  | 'Veterinary & Animal Care and Use Committee (IACUC)'
  | 'Social Sciences, Business & Humanities Ethics Board'
  | 'Institutional Biosafety & Biosecurity Committee (IBC)';

export type IrbProtocolCategory =
  | 'Human Clinical & Epidemiological Trials'
  | 'Socio-Economic Household Survey'
  | 'Crop & Agricultural Field Trial'
  | 'Veterinary & Animal Welfare Protocol'
  | 'Genomic & Biosafety Research'
  | 'Artificial Intelligence & Data Ethics';

export type IrbRiskLevel = 'Minimal Risk' | 'Low Risk' | 'Moderate Risk' | 'High Risk';

export type IrbReviewType = 'Exempt Review' | 'Expedited Review' | 'Full Board Review';

export type IrbProtocolStatus =
  | 'Approved'
  | 'Conditional Approval'
  | 'Under Scientific & Ethical Review'
  | 'Revisions Requested'
  | 'Expired';

export interface IrbProtocol {
  id: string;
  protocolNumber: string; // e.g. HU-IRB-2026-0314
  title: string;
  principalInvestigator: {
    name: string;
    email: string;
    phone?: string;
    college: string;
    department: string;
    staffOrStudentId?: string;
    role: 'Faculty PI' | 'Postgraduate Candidate (PhD)' | 'Postgraduate Candidate (MSc)' | 'Visiting Scholar';
  };
  coInvestigators: { name: string; affiliation: string }[];
  committee: IrbCommitteeType;
  category: IrbProtocolCategory;
  riskLevel: IrbRiskLevel;
  reviewType: IrbReviewType;
  status: IrbProtocolStatus;
  submissionDate: string;
  approvalDate?: string;
  expirationDate?: string;
  meetingDate?: string;
  summaryAbstract: string;
  targetPopulation: string;
  sampleSize: number;
  studySites: string[];
  fundingGrantRef?: string; // cross-links with Phase 5 GrantProject
  clearanceCertificateNumber?: string;
  certificateVerificationHash?: string;
  ethicalConsiderations: {
    informedConsentMethod:
      | 'Written Consent (Afan Oromo / Amharic / Somali)'
      | 'Verbal Witnessed Consent'
      | 'Community Elder Assent + Individual Consent'
      | 'Exempt / Secondary Data';
    vulnerableGroupsIncluded: boolean;
    vulnerableGroupsDetails?: string;
    dataConfidentialityProtocol: string;
    biologicalSpecimenDisposal?: string;
    animalWelfareHumaneEndpoints?: string;
  };
  reviewers: {
    name: string;
    decision: 'Approve' | 'Minor Comments' | 'Major Concerns' | 'Pending';
    reviewDate?: string;
    comments?: string;
  }[];
  attachments: {
    name: string;
    size: string;
    type: 'Protocol Document' | 'Consent Form' | 'Data Collection Instrument' | 'Support Letter';
  }[];
}

export interface IrbReviewCommittee {
  id: string;
  name: IrbCommitteeType;
  shortCode: string;
  chairperson: string;
  secretary: string;
  membersCount: number;
  meetingFrequency: string;
  nextReviewSession: string;
  protocolsUnderReview: number;
  accreditation: string;
  location: string;
}

export interface ResearchImpactSdgMetric {
  sdgId: number;
  sdgNumber: string; // e.g. 'SDG 2'
  title: string;
  color: string;
  icon: string;
  publicationsCount: number;
  activeGrantsETB: number;
  citationsCount: number;
  targetFocus: string;
  flagshipProjects: string[];
}

export interface ResearchRankingBenchmark {
  indicator: string;
  haramayaValue: string;
  nationalRank: number;
  eastAfricaRank: number;
  trend: 'up' | 'stable' | 'down';
  benchmarkDetail: string;
}

export interface ConferenceCfpItem {
  id: string;
  symposiumTitle: string;
  edition: string;
  dates: string;
  submissionDeadline: string;
  notificationDeadline: string;
  cameraReadyDeadline: string;
  venue: string;
  theme: string;
  thematicTracks: {
    trackCode: string;
    name: string;
    chairs: string;
    acceptedSubmissions: number;
  }[];
  status: 'Call for Papers Open' | 'Review Underway' | 'Program Finalized' | 'Registration Open';
  submissionsCount: number;
  contactEmail: string;
  proceedingsIsbn?: string;
}

export interface ConferenceSubmission {
  id: string;
  cfpId: string;
  title: string;
  correspondingAuthor: { name: string; email: string; institution: string };
  coAuthors: string[];
  trackCode: string;
  abstract: string;
  keywords: string[];
  submissionDate: string;
  status: 'Received' | 'In Review' | 'Accepted for Oral Presentation' | 'Accepted for Poster' | 'Declined';
}

// =============================================================
// PHASE 9: UNIVERSITY TECHNOLOGY TRANSFER, IP & COMMUNITY EXTENSION TYPES
// =============================================================

export type IpRecordType =
  | 'Patent'
  | 'Plant Variety Protection (PVP)'
  | 'Utility Model'
  | 'Trademark'
  | 'Copyright & Software';

export type IpRecordStatus =
  | 'Invention Disclosure'
  | 'EIPA Examination'
  | 'Granted & Certified'
  | 'Licensed for Commercialization'
  | 'Public Domain';

export interface IntellectualPropertyRecord {
  id: string;
  ipNumber: string; // e.g. HU-IP-2026-0048, EIPA-P-2025-108
  title: string;
  ipType: IpRecordType;
  status: IpRecordStatus;
  filingDate: string;
  grantDate?: string;
  expirationDate?: string;
  primaryInventor: {
    name: string;
    college: string;
    department: string;
    email: string;
    sharePercentage: number;
  };
  coInventors: {
    name: string;
    affiliation: string;
    sharePercentage: number;
  }[];
  abstractDescription: string;
  technologyReadinessLevel: number; // 1 to 9 (TRL)
  targetIndustry: string;
  commercialLicensee?: {
    companyName: string;
    agreementDate: string;
    royaltyRate: string;
    annualRevenueETB: number;
  };
  patentOfficeRef: string; // Ethiopian Intellectual Property Authority (EIPA) or WIPO
  certificateVerificationCode?: string;
  tags: string[];
}

export type IncubationSector =
  | 'Agri-Tech & Smart Farming'
  | 'Bio-Products & Food Processing'
  | 'Renewable Energy & Water'
  | 'Digital Health & AI'
  | 'FinTech & Cooperative Tools';

export type IncubationStage =
  | 'Ideation & Prototyping'
  | 'Incubated (MVP Validated)'
  | 'Pilot Field Trial'
  | 'Spin-off / Market Ready'
  | 'Graduated';

export interface IncubationStartupProject {
  id: string;
  ventureName: string;
  tagline: string;
  cohortBatch: string;
  founders: {
    name: string;
    role: string;
    studyProgramOrDept: string;
    email: string;
  }[];
  focusSector: IncubationSector;
  stage: IncubationStage;
  seedFundingAllocatedETB: number;
  seedFundingDisbursedETB: number;
  mentor: {
    name: string;
    designation: string;
    institution: string;
  };
  workspaceAssigned: string;
  intellectualPropertyLinked?: string;
  keyMilestones: {
    title: string;
    targetDate: string;
    completed: boolean;
  }[];
  pitchDeckFile?: string;
  revenueGeneratedETB?: number;
}

export type AgroZone =
  | 'Highland (Dega)'
  | 'Mid-Altitude (Weyna-Dega)'
  | 'Lowland (Kolla)'
  | 'Pastoral & Agro-Pastoral';

export type CropSeason =
  | 'Meher (Main Rainy)'
  | 'Belg (Short Rainy)'
  | 'Bega (Dry / Irrigated)'
  | 'Year-round';

export interface CommunityAgroAdvisory {
  id: string;
  advisoryCode: string;
  title: {
    en: string;
    or: string;
    am: string;
  };
  targetCropOrLivestock: string;
  agroEcologicalZone: AgroZone;
  season: CropSeason;
  urgencyLevel: 'Normal Advisory' | 'Seasonal Recommendation' | 'Urgent Alert (Pest/Disease Outbreak)';
  bodyGuidance: {
    en: string;
    or: string;
    am: string;
  };
  keyRecommendations: string[];
  preparedByExpert: {
    name: string;
    title: string;
    department: string;
  };
  publicationDate: string;
  downloadPdfCount: number;
  audioBroadcastUrl?: string;
  relatedVarietyOrTech: string;
}

export interface DemonstrationSiteAndOutreach {
  id: string;
  siteName: string;
  weredaOrZone: string;
  distanceFromMainCampusKm: number;
  establishedYear: number;
  leadOfficer: {
    name: string;
    phone: string;
    email: string;
  };
  activeDemonstrationTrials: {
    title: string;
    cropOrLivestock: string;
    targetFarmersCount: number;
    season: string;
  }[];
  modelFarmersTrained: number;
  totalHectaresUnderDemo: number;
  upcomingFieldDays: {
    title: string;
    date: string;
    expectedParticipants: number;
  }[];
  focusCommodities: string[];
}

export interface IndustryLinkageMou {
  id: string;
  partnerOrganization: string;
  sector:
    | 'Federal / Regional Government'
    | 'State Enterprise'
    | 'Private Agribusiness'
    | 'International Development Agency'
    | 'Financial & Cooperative';
  agreementTitle: string;
  signingDate: string;
  validUntil: string;
  status: 'Active & In Execution' | 'Under Renewal' | 'Executed Successfully';
  focalPersonHU: {
    name: string;
    department: string;
    email: string;
  };
  focalPersonPartner: {
    name: string;
    title: string;
    email: string;
  };
  keyObjectives: string[];
  jointProjectsCount: number;
  valueOrCommitmentETB?: number;
  scopeSummary: string;
}







