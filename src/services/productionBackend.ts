/**
 * Haramaya University WKI Academic Press & Press Hub
 * Production Enterprise Integration Suite
 * 
 * Implements:
 * 1. Firebase Firestore & Cloud SQL Configuration & Client SDK helpers
 * 2. Chapa & Telebirr Direct Payment Gateway API Handlers
 * 3. Google Cloud Storage (GCS) / Firebase Storage Signed URL & Document Upload API
 * 4. SendGrid / Nodemailer Email & Twilio SMS Notification Dispatchers
 * 5. Google Workspace OAuth SSO Authentication Service for @wki.edu.et accounts
 */

export interface ProductionConfigStatus {
  firestoreEnabled: boolean;
  cloudSqlEnabled: boolean;
  chapaGatewayActive: boolean;
  telebirrApiActive: boolean;
  gcsStorageActive: boolean;
  sendgridEmailActive: boolean;
  twilioSmsActive: boolean;
  googleWorkspaceSsoActive: boolean;
  institutionalDomain: string;
}

export const PRODUCTION_CONFIG_DEFAULT: ProductionConfigStatus = {
  firestoreEnabled: true,
  cloudSqlEnabled: false,
  chapaGatewayActive: true,
  telebirrApiActive: true,
  gcsStorageActive: true,
  sendgridEmailActive: true,
  twilioSmsActive: true,
  googleWorkspaceSsoActive: true,
  institutionalDomain: 'press.wki.edu.et',
};

export interface PaymentInitiationRequest {
  amount: number;
  currency: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  txRef: string;
  callbackUrl: string;
  returnUrl: string;
  customization?: {
    title: string;
    description: string;
  };
}

export interface PaymentInitiationResponse {
  status: 'success' | 'failed';
  message: string;
  checkoutUrl?: string;
  transactionId?: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  fileUrl: string;
  signedUrl: string;
  fileName: string;
  fileSize: number;
  bucket: string;
  uploadedAt: string;
}

export interface NotificationPayload {
  recipientEmail?: string;
  recipientPhone?: string;
  subject: string;
  message: string;
  templateId?: string;
  metadata?: Record<string, any>;
}

export interface GoogleWorkspaceUser {
  email: string;
  name: string;
  picture: string;
  hd: string; // Hosted domain (wki.edu.et)
  verifiedEmail: boolean;
}
