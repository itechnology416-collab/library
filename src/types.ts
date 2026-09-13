export type Language = 'en' | 'or' | 'am' | 'ar';

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





