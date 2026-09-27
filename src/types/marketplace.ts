export type MarketplaceCategory =
  | 'Website'
  | 'Web Application'
  | 'Mobile Application'
  | 'Desktop Application'
  | 'UI/UX'
  | 'SaaS'
  | 'E-commerce'
  | 'School Management'
  | 'Business Management'
  | 'Finance'
  | 'Healthcare'
  | 'Education'
  | 'Productivity'
  | 'Software System'
  | 'Template'
  | 'Other';

export type MarketplaceTechnology =
  | 'React'
  | 'Next.js'
  | 'Node.js'
  | 'Python'
  | 'Django'
  | 'Flutter'
  | 'Kotlin'
  | 'Java'
  | 'PHP'
  | 'Laravel'
  | 'C#'
  | '.NET'
  | 'HTML/CSS/JavaScript'
  | 'Vue'
  | 'FastAPI'
  | 'MongoDB'
  | 'PostgreSQL'
  | 'Tailwind CSS'
  | 'Other';

export type MarketplacePlatform =
  | 'Web'
  | 'Android'
  | 'iOS'
  | 'Windows'
  | 'Linux'
  | 'Cross-platform';

export type MarketplaceStatus =
  | 'Ready to Use'
  | 'Customizable'
  | 'Under Development'
  | 'Demo'
  | 'Open Source';

export type MarketplaceBusinessType =
  | 'Startup'
  | 'Small Business'
  | 'School'
  | 'University'
  | 'NGO'
  | 'Organization'
  | 'Enterprise'
  | 'Healthcare'
  | 'Personal';

export type MarketplacePricingType =
  | 'Free'
  | 'Paid'
  | 'Custom Price'
  | 'Contact Seller';

export type MarketplaceLicenseType =
  | 'Personal Use'
  | 'Commercial Use'
  | 'Single Project'
  | 'Multiple Projects'
  | 'Custom License';

export type MarketplaceReviewStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Changes Requested'
  | 'Rejected';

export interface MarketplaceProject {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  category: MarketplaceCategory;
  businessType: MarketplaceBusinessType;
  technologies: MarketplaceTechnology[];
  platform: MarketplacePlatform;
  status: MarketplaceStatus;
  creatorName: string;
  creatorEmail: string;
  creatorAffiliation: string;
  pricingType: MarketplacePricingType;
  priceETB?: number;
  priceUSD?: number;
  licenseType: MarketplaceLicenseType;
  additionalLicenseInfo?: string;
  thumbnail: string;
  screenshots: string[];
  demoVideoUrl?: string;
  liveDemoUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  features: string[];
  targetUsers: string[];
  businessUseCases: string[];
  compatibility: string;
  version: string;
  lastUpdated: string;
  createdAt: string;
  reviewStatus: MarketplaceReviewStatus;
  reviewNotes?: string;
  viewsCount: number;
  favoritesCount: number;
  demoClicksCount: number;
  requestsCount: number;
  isFeatured: boolean;
  rightsConfirmed: boolean;
}

export interface MarketplaceMessage {
  id: string;
  sender: string;
  senderRole: 'customer' | 'creator' | 'admin';
  message: string;
  timestamp: string;
  attachmentUrl?: string;
}

export interface MarketplaceRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  actionType: 'Buy/License' | 'Request Customization' | 'Request Demo' | 'Contact Creator';
  customerName: string;
  customerOrganization: string;
  customerPhone: string;
  customerEmail: string;
  requirements: string;
  requiredFeatures: string[];
  preferredPlatform: MarketplacePlatform;
  customizationRequirements: string;
  budgetRange: string;
  deadline: string;
  status: 'Pending' | 'In Contact' | 'Proposal Sent' | 'Accepted' | 'Declined';
  submittedAt: string;
  messages: MarketplaceMessage[];
}

export interface MarketplaceReview {
  id: string;
  projectId: string;
  reviewerName: string;
  reviewerOrganization?: string;
  isVerifiedBuyer: boolean;
  overallRating: number;
  codeQualityRating: number;
  documentationRating: number;
  easeOfSetupRating: number;
  supportRating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface MarketplacePayout {
  id: string;
  creatorEmail: string;
  amountETB: number;
  platformFeeETB: number;
  netAmountETB: number;
  paymentChannel: 'telebirr' | 'mpesa' | 'cbe';
  accountOrPhone: string;
  status: 'Pending' | 'Approved' | 'Disbursed' | 'Rejected';
  requestedAt: string;
  disbursedAt?: string;
  transactionReference?: string;
}

export interface MarketplaceApiKey {
  id: string;
  creatorEmail: string;
  apiKey: string;
  label: string;
  createdAt: string;
  status: 'active' | 'revoked';
}

export interface MarketplaceWebhook {
  id: string;
  creatorEmail: string;
  targetUrl: string;
  eventTypes: string[];
  secret: string;
  isActive: boolean;
  createdAt: string;
}

export interface MarketplaceBundle {
  id: string;
  title: string;
  description: string;
  badge: string;
  projectIds: string[];
  originalPriceETB: number;
  discountedPriceETB: number;
  licenseType: string;
  features: string[];
}

