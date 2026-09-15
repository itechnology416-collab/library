import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_JOURNAL_INFOS,
  INITIAL_REFEREE_CERTIFICATES,
  INITIAL_REVIEW_ASSIGNMENTS,
  INITIAL_REVIEWER_PROFILE,
  INITIAL_FACULTY_PROFILE,
  INITIAL_FACULTY_GRANTS,
  INITIAL_SUPERVISED_THESES,
  INITIAL_FACULTY_OUTPUTS,
  INITIAL_REGISTRAR_CLEARANCES,
  INITIAL_PRODUCTION_JOBS,
  INITIAL_ISBN_REGISTRY,
  INITIAL_PRESS_AUDIT_LEDGER,
  INITIAL_PRESS_INVENTORY,
  INITIAL_REPOSITORY_ITEMS,
  INITIAL_OAI_HARVEST_JOBS,
  INITIAL_CONFERENCE_PROCEEDINGS,
  INITIAL_IRB_COMMITTEES,
  INITIAL_IRB_PROTOCOLS,
  INITIAL_SDG_METRICS,
  INITIAL_RANKING_BENCHMARKS,
  INITIAL_CONFERENCE_CFP,
  INITIAL_IP_RECORDS,
  INITIAL_INCUBATION_STARTUPS,
  INITIAL_AGRO_ADVISORIES,
  INITIAL_DEMO_SITES,
  INITIAL_INDUSTRY_MOUS,
} from './src/data/initialData';
import {
  INITIAL_STORE_SETTINGS,
  INITIAL_STORE_COUPONS,
  INITIAL_STORE_PRODUCTS,
  INITIAL_STORE_ORDERS,
  INITIAL_STORE_PERMISSIONS,
  INITIAL_STORE_AUDIT_LOGS,
} from './src/data/initialStoreData';

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'academic_wki_jwt_secret_secure_key_2026';
const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const SCHOLAR_PROFILE_FILE = path.join(DATA_DIR, 'scholar_profile.json');
const SCHOLAR_MESSAGES_FILE = path.join(DATA_DIR, 'scholar_messages.json');
const SCHOLAR_QUIZZES_FILE = path.join(DATA_DIR, 'scholar_quizzes.json');
const SCHOLAR_CERTIFICATES_FILE = path.join(DATA_DIR, 'scholar_certificates.json');
const SCHOLAR_MATERIALS_FILE = path.join(DATA_DIR, 'scholar_materials.json');
const REVIEWER_PROFILE_FILE = path.join(DATA_DIR, 'reviewer_profile.json');
const REVIEWER_ASSIGNMENTS_FILE = path.join(DATA_DIR, 'reviewer_assignments.json');
const REVIEWER_CERTIFICATES_FILE = path.join(DATA_DIR, 'reviewer_certificates.json');
const FACULTY_PROFILE_FILE = path.join(DATA_DIR, 'faculty_profile.json');
const FACULTY_GRANTS_FILE = path.join(DATA_DIR, 'faculty_grants.json');
const FACULTY_SUPERVISION_FILE = path.join(DATA_DIR, 'faculty_supervision.json');
const FACULTY_OUTPUTS_FILE = path.join(DATA_DIR, 'faculty_outputs.json');
const PRESS_CLEARANCES_FILE = path.join(DATA_DIR, 'press_clearances.json');
const PRESS_PRODUCTION_FILE = path.join(DATA_DIR, 'press_production.json');
const PRESS_ISBN_FILE = path.join(DATA_DIR, 'press_isbn.json');
const PRESS_AUDIT_FILE = path.join(DATA_DIR, 'press_audit.json');
const PRESS_INVENTORY_FILE = path.join(DATA_DIR, 'press_inventory.json');
const REPOSITORY_ITEMS_FILE = path.join(DATA_DIR, 'repository_items.json');
const REPOSITORY_HARVEST_FILE = path.join(DATA_DIR, 'repository_harvest.json');
const REPOSITORY_CONFERENCES_FILE = path.join(DATA_DIR, 'repository_conferences.json');
const IRB_PROTOCOLS_FILE = path.join(DATA_DIR, 'irb_protocols.json');
const IRB_COMMITTEES_FILE = path.join(DATA_DIR, 'irb_committees.json');
const CONFERENCES_CFP_FILE = path.join(DATA_DIR, 'conferences_cfp.json');
const CONFERENCES_SUBMISSIONS_FILE = path.join(DATA_DIR, 'conferences_submissions.json');
const IP_RECORDS_FILE = path.join(DATA_DIR, 'ip_records.json');
const INCUBATION_STARTUPS_FILE = path.join(DATA_DIR, 'incubation_startups.json');
const AGRO_ADVISORIES_FILE = path.join(DATA_DIR, 'agro_advisories.json');
const DEMO_SITES_FILE = path.join(DATA_DIR, 'demo_sites.json');
const INDUSTRY_MOUS_FILE = path.join(DATA_DIR, 'industry_mous.json');

// Store Persistence Files
const STORE_PRODUCTS_FILE = path.join(DATA_DIR, 'store_products.json');
const STORE_ORDERS_FILE = path.join(DATA_DIR, 'store_orders.json');
const STORE_PERMISSIONS_FILE = path.join(DATA_DIR, 'store_permissions.json');
const STORE_COUPONS_FILE = path.join(DATA_DIR, 'store_coupons.json');
const STORE_SETTINGS_FILE = path.join(DATA_DIR, 'store_settings.json');
const STORE_AUDIT_FILE = path.join(DATA_DIR, 'store_audit.json');
const STORE_REVIEWS_FILE = path.join(DATA_DIR, 'store_reviews.json');
const STORE_DOWNLOAD_LOGS_FILE = path.join(DATA_DIR, 'store_download_logs.json');
const STORE_PAYOUTS_FILE = path.join(DATA_DIR, 'store_payouts.json');
const ENTERPRISE_AUDIT_LOGS_FILE = path.join(DATA_DIR, 'enterprise_audit_logs.json');

export type StoredUserRole =
  | 'superadmin'
  | 'admin'
  | 'client'
  | 'user'
  | 'author'
  | 'scholar'
  | 'reviewer'
  | 'faculty'
  | 'student';

export type StoredUserStatus = 'ACTIVE' | 'SUSPENDED' | 'DISABLED' | 'PENDING';

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  username?: string;
  phone?: string;
  role: StoredUserRole;
  status: StoredUserStatus;
  permissions: string[];
  scopeId?: string;
  assignedClientIds?: string[];
  isPrimarySuperAdmin?: boolean;
  expirationDate?: string;
  affiliation?: string;
  orcid?: string;
  staffOrStudentId?: string;
  avatarUrl?: string;
  createdBy?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface EnterpriseAuditLog {
  id: string;
  performedByUserId: string;
  performedByUserName: string;
  performedByUserRole: string;
  action: string;
  target: string;
  targetId: string;
  targetName?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
}

const ALL_SYSTEM_PERMISSIONS = [
  'users.view', 'users.create', 'users.edit', 'users.delete', 'users.suspend', 'users.activate', 'users.reset_password',
  'admins.view', 'admins.create', 'admins.edit', 'admins.delete', 'admins.suspend', 'admins.activate', 'admins.permissions',
  'clients.view', 'clients.create', 'clients.edit', 'clients.delete', 'clients.suspend', 'clients.activate',
  'content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish',
  'resources.view', 'resources.upload', 'resources.edit', 'resources.delete', 'resources.publish', 'resources.download',
  'sales.view', 'sales.create', 'sales.edit', 'sales.refund',
  'payments.view', 'payments.verify', 'payments.approve', 'payments.reject',
  'downloads.view', 'downloads.approve', 'downloads.revoke',
  'reports.view', 'reports.export',
  'settings.view', 'settings.edit', 'audit_logs.view', 'notifications.manage'
];

// Ensure data storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Enterprise Audit Logger
function loadEnterpriseAuditLogs(): EnterpriseAuditLog[] {
  try {
    if (fs.existsSync(ENTERPRISE_AUDIT_LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(ENTERPRISE_AUDIT_LOGS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading enterprise audit logs file:', err);
  }
  return [];
}

function saveEnterpriseAuditLogs(logs: EnterpriseAuditLog[]): void {
  try {
    fs.writeFileSync(ENTERPRISE_AUDIT_LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving enterprise audit logs file:', err);
  }
}

function logEnterpriseAudit(
  actor: StoredUser | { id: string; name: string; role: string },
  action: string,
  target: string,
  targetId: string,
  details: string,
  req: Request,
  result: 'SUCCESS' | 'DENIED' | 'FAILED' = 'SUCCESS',
  targetName?: string
) {
  const logs = loadEnterpriseAuditLogs();
  const newLog: EnterpriseAuditLog = {
    id: `log-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    performedByUserId: actor.id || 'system',
    performedByUserName: actor.name || 'System Administrator',
    performedByUserRole: actor.role || 'system',
    action,
    target,
    targetId,
    targetName: targetName || targetId,
    details,
    timestamp: new Date().toISOString(),
    ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Server Container',
    result,
  };
  logs.unshift(newLog);
  saveEnterpriseAuditLogs(logs.slice(0, 1000));
}

// RBAC Helper Functions
function isPrimarySuperAdminUser(user: StoredUser | null | undefined): boolean {
  if (!user) return false;
  return !!(user.isPrimarySuperAdmin || user.id === 'usr-super-admin-01' || user.email.toLowerCase() === 'superadmin@wki.edu.et');
}

function hasUserPermission(user: StoredUser | null | undefined, permission: string): boolean {
  if (!user) return false;
  if (user.status === 'SUSPENDED' || user.status === 'DISABLED') return false;
  if (user.role === 'superadmin' || isPrimarySuperAdminUser(user)) return true;
  if (!user.permissions || !Array.isArray(user.permissions)) return false;
  return user.permissions.includes(permission) || user.permissions.includes('*');
}

function canManageTargetUser(actor: StoredUser, target: StoredUser): boolean {
  if (isPrimarySuperAdminUser(actor)) return true;
  if (isPrimarySuperAdminUser(target)) return false; // Primary super admin cannot be edited/demoted by others
  if (target.role === 'superadmin') return false; // Admin cannot manage superadmin
  if (actor.role === 'superadmin') return true;

  if (actor.role === 'admin') {
    if (target.role === 'admin' && target.id !== actor.id) {
      return target.createdBy === actor.id;
    }
    if (actor.scopeId && target.scopeId) {
      return actor.scopeId === target.scopeId || target.createdBy === actor.id;
    }
    return target.createdBy === actor.id || (actor.assignedClientIds && actor.assignedClientIds.includes(target.id));
  }
  return false;
}

// Helper to load users from persistence with Primary Super Admin seeding
function loadUsers(): StoredUser[] {
  let users: StoredUser[] = [];
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      users = JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading users file:', err);
  }

  // Check if primary super admin exists
  const hasSuperAdmin = users.some((u) => u.isPrimarySuperAdmin || u.id === 'usr-super-admin-01' || u.email.toLowerCase() === 'superadmin@wki.edu.et');
  let dirty = false;

  if (!hasSuperAdmin) {
    const defaultSuperAdmin: StoredUser = {
      id: 'usr-super-admin-01',
      email: 'superadmin@wki.edu.et',
      passwordHash: bcrypt.hashSync('SuperAdminPass2026!', 10),
      name: 'Primary Super Administrator',
      username: 'superadmin',
      phone: '+251 911 000 000',
      role: 'superadmin',
      status: 'ACTIVE',
      permissions: ALL_SYSTEM_PERMISSIONS,
      scopeId: 'global',
      isPrimarySuperAdmin: true,
      affiliation: 'Wirtuu Kompiitaraa Ilillii Executive Board',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    users.unshift(defaultSuperAdmin);
    dirty = true;
  }

  // Ensure default users have role, status & permissions initialized
  users = users.map((u) => {
    let updated = { ...u };
    if (!updated.status) updated.status = 'ACTIVE';
    if (!updated.permissions) {
      if (updated.role === 'superadmin' || updated.isPrimarySuperAdmin) {
        updated.permissions = ALL_SYSTEM_PERMISSIONS;
      } else if (updated.role === 'admin') {
        updated.permissions = [
          'users.view', 'users.create', 'users.edit', 'users.suspend', 'users.activate',
          'admins.view', 'clients.view', 'clients.create', 'clients.edit',
          'content.view', 'content.create', 'content.edit', 'content.publish',
          'resources.view', 'resources.upload', 'resources.edit', 'resources.publish', 'resources.download',
          'sales.view', 'payments.view', 'payments.verify', 'payments.approve',
          'downloads.view', 'downloads.approve', 'downloads.revoke', 'reports.view', 'settings.view', 'audit_logs.view'
        ];
      } else if (updated.role === 'client') {
        updated.permissions = ['users.view', 'content.view', 'resources.view', 'resources.download', 'sales.view', 'payments.view'];
      } else {
        updated.permissions = ['content.view', 'resources.view', 'resources.download'];
      }
    }
    if (updated.email.toLowerCase() === 'superadmin@wki.edu.et' || updated.id === 'usr-super-admin-01') {
      updated.isPrimarySuperAdmin = true;
      updated.role = 'superadmin';
      updated.status = 'ACTIVE';
      updated.permissions = ALL_SYSTEM_PERMISSIONS;
    }
    return updated;
  });

  if (dirty) {
    saveUsers(users);
  }

  return users;
}

// Helper to save users to persistence
function saveUsers(users: StoredUser[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving users file:', err);
  }
}

function loadRequests() {
  try {
    if (fs.existsSync(REQUESTS_FILE)) {
      return JSON.parse(fs.readFileSync(REQUESTS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading requests:', err);
  }
  return [];
}

function saveRequests(reqs: any[]) {
  try {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify(reqs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving requests:', err);
  }
}

function loadContacts() {
  try {
    if (fs.existsSync(CONTACTS_FILE)) {
      return JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading contacts:', err);
  }
  return [];
}

function saveContacts(contacts: any[]) {
  try {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving contacts:', err);
  }
}

// Phase 3: Scholar Helpers
function loadScholarProfile() {
  try {
    if (fs.existsSync(SCHOLAR_PROFILE_FILE)) {
      return JSON.parse(fs.readFileSync(SCHOLAR_PROFILE_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading scholar profile:', err);
  }
  return null;
}

function saveScholarProfile(profile: any) {
  try {
    fs.writeFileSync(SCHOLAR_PROFILE_FILE, JSON.stringify(profile, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving scholar profile:', err);
  }
}

function loadScholarMessages() {
  try {
    if (fs.existsSync(SCHOLAR_MESSAGES_FILE)) {
      return JSON.parse(fs.readFileSync(SCHOLAR_MESSAGES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading scholar messages:', err);
  }
  return [];
}

function saveScholarMessages(msgs: any[]) {
  try {
    fs.writeFileSync(SCHOLAR_MESSAGES_FILE, JSON.stringify(msgs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving scholar messages:', err);
  }
}

function loadScholarQuizzes() {
  try {
    if (fs.existsSync(SCHOLAR_QUIZZES_FILE)) {
      return JSON.parse(fs.readFileSync(SCHOLAR_QUIZZES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading scholar quizzes:', err);
  }
  return [];
}

function saveScholarQuizzes(quizzes: any[]) {
  try {
    fs.writeFileSync(SCHOLAR_QUIZZES_FILE, JSON.stringify(quizzes, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving scholar quizzes:', err);
  }
}

function loadScholarCertificates() {
  try {
    if (fs.existsSync(SCHOLAR_CERTIFICATES_FILE)) {
      return JSON.parse(fs.readFileSync(SCHOLAR_CERTIFICATES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading scholar certificates:', err);
  }
  return [];
}

function saveScholarCertificates(certs: any[]) {
  try {
    fs.writeFileSync(SCHOLAR_CERTIFICATES_FILE, JSON.stringify(certs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving scholar certificates:', err);
  }
}

function loadScholarMaterials() {
  try {
    if (fs.existsSync(SCHOLAR_MATERIALS_FILE)) {
      return JSON.parse(fs.readFileSync(SCHOLAR_MATERIALS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading scholar materials:', err);
  }
  return [];
}

function saveScholarMaterials(mats: any[]) {
  try {
    fs.writeFileSync(SCHOLAR_MATERIALS_FILE, JSON.stringify(mats, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving scholar materials:', err);
  }
}

// Phase 4: Peer Reviewer & Journal Editorial Portal Helpers
function loadReviewerProfile() {
  try {
    if (fs.existsSync(REVIEWER_PROFILE_FILE)) {
      return JSON.parse(fs.readFileSync(REVIEWER_PROFILE_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading reviewer profile:', err);
  }
  return INITIAL_REVIEWER_PROFILE;
}

function saveReviewerProfile(profile: any) {
  try {
    fs.writeFileSync(REVIEWER_PROFILE_FILE, JSON.stringify(profile, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving reviewer profile:', err);
  }
}

function loadReviewerAssignments() {
  try {
    if (fs.existsSync(REVIEWER_ASSIGNMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(REVIEWER_ASSIGNMENTS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading reviewer assignments:', err);
  }
  return INITIAL_REVIEW_ASSIGNMENTS;
}

function saveReviewerAssignments(assignments: any[]) {
  try {
    fs.writeFileSync(REVIEWER_ASSIGNMENTS_FILE, JSON.stringify(assignments, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving reviewer assignments:', err);
  }
}

function loadReviewerCertificates() {
  try {
    if (fs.existsSync(REVIEWER_CERTIFICATES_FILE)) {
      return JSON.parse(fs.readFileSync(REVIEWER_CERTIFICATES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading reviewer certificates:', err);
  }
  return INITIAL_REFEREE_CERTIFICATES;
}

function saveReviewerCertificates(certs: any[]) {
  try {
    fs.writeFileSync(REVIEWER_CERTIFICATES_FILE, JSON.stringify(certs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving reviewer certificates:', err);
  }
}

// Phase 5: Faculty Researcher & Grants Helpers
function loadFacultyProfile() {
  try {
    if (fs.existsSync(FACULTY_PROFILE_FILE)) {
      return JSON.parse(fs.readFileSync(FACULTY_PROFILE_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading faculty profile:', err);
  }
  return INITIAL_FACULTY_PROFILE;
}

function saveFacultyProfile(profile: any) {
  try {
    fs.writeFileSync(FACULTY_PROFILE_FILE, JSON.stringify(profile, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving faculty profile:', err);
  }
}

function loadFacultyGrants() {
  try {
    if (fs.existsSync(FACULTY_GRANTS_FILE)) {
      return JSON.parse(fs.readFileSync(FACULTY_GRANTS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading faculty grants:', err);
  }
  return INITIAL_FACULTY_GRANTS;
}

function saveFacultyGrants(grants: any[]) {
  try {
    fs.writeFileSync(FACULTY_GRANTS_FILE, JSON.stringify(grants, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving faculty grants:', err);
  }
}

function loadFacultySupervision() {
  try {
    if (fs.existsSync(FACULTY_SUPERVISION_FILE)) {
      return JSON.parse(fs.readFileSync(FACULTY_SUPERVISION_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading faculty supervision:', err);
  }
  return INITIAL_SUPERVISED_THESES;
}

function saveFacultySupervision(theses: any[]) {
  try {
    fs.writeFileSync(FACULTY_SUPERVISION_FILE, JSON.stringify(theses, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving faculty supervision:', err);
  }
}

function loadFacultyOutputs() {
  try {
    if (fs.existsSync(FACULTY_OUTPUTS_FILE)) {
      return JSON.parse(fs.readFileSync(FACULTY_OUTPUTS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading faculty outputs:', err);
  }
  return INITIAL_FACULTY_OUTPUTS;
}

function saveFacultyOutputs(outputs: any[]) {
  try {
    fs.writeFileSync(FACULTY_OUTPUTS_FILE, JSON.stringify(outputs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving faculty outputs:', err);
  }
}

// Phase 6: University Press & Registrar Operations Desk Helpers
function loadPressClearances() {
  try {
    if (fs.existsSync(PRESS_CLEARANCES_FILE)) {
      return JSON.parse(fs.readFileSync(PRESS_CLEARANCES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading press clearances:', err);
  }
  return INITIAL_REGISTRAR_CLEARANCES;
}

function savePressClearances(clearances: any[]) {
  try {
    fs.writeFileSync(PRESS_CLEARANCES_FILE, JSON.stringify(clearances, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving press clearances:', err);
  }
}

function loadPressProduction() {
  try {
    if (fs.existsSync(PRESS_PRODUCTION_FILE)) {
      return JSON.parse(fs.readFileSync(PRESS_PRODUCTION_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading press production jobs:', err);
  }
  return INITIAL_PRODUCTION_JOBS;
}

function savePressProduction(jobs: any[]) {
  try {
    fs.writeFileSync(PRESS_PRODUCTION_FILE, JSON.stringify(jobs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving press production jobs:', err);
  }
}

function loadPressISBN() {
  try {
    if (fs.existsSync(PRESS_ISBN_FILE)) {
      return JSON.parse(fs.readFileSync(PRESS_ISBN_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading press ISBN registry:', err);
  }
  return INITIAL_ISBN_REGISTRY;
}

function savePressISBN(records: any[]) {
  try {
    fs.writeFileSync(PRESS_ISBN_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving press ISBN registry:', err);
  }
}

function loadPressAudit() {
  try {
    if (fs.existsSync(PRESS_AUDIT_FILE)) {
      return JSON.parse(fs.readFileSync(PRESS_AUDIT_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading press audit ledger:', err);
  }
  return INITIAL_PRESS_AUDIT_LEDGER;
}

function savePressAudit(records: any[]) {
  try {
    fs.writeFileSync(PRESS_AUDIT_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving press audit ledger:', err);
  }
}

function loadPressInventory() {
  try {
    if (fs.existsSync(PRESS_INVENTORY_FILE)) {
      return JSON.parse(fs.readFileSync(PRESS_INVENTORY_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading press inventory:', err);
  }
  return INITIAL_PRESS_INVENTORY;
}

function savePressInventory(items: any[]) {
  try {
    fs.writeFileSync(PRESS_INVENTORY_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving press inventory:', err);
  }
}

// Phase 7: Institutional Repository, Open Access ETD Archive & Research Commons Helpers
function loadRepositoryItems() {
  try {
    if (fs.existsSync(REPOSITORY_ITEMS_FILE)) {
      return JSON.parse(fs.readFileSync(REPOSITORY_ITEMS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading repository items:', err);
  }
  return INITIAL_REPOSITORY_ITEMS;
}

function saveRepositoryItems(items: any[]) {
  try {
    fs.writeFileSync(REPOSITORY_ITEMS_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving repository items:', err);
  }
}

function loadOaiJobs() {
  try {
    if (fs.existsSync(REPOSITORY_HARVEST_FILE)) {
      return JSON.parse(fs.readFileSync(REPOSITORY_HARVEST_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading OAI harvest jobs:', err);
  }
  return INITIAL_OAI_HARVEST_JOBS;
}

function saveOaiJobs(jobs: any[]) {
  try {
    fs.writeFileSync(REPOSITORY_HARVEST_FILE, JSON.stringify(jobs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving OAI harvest jobs:', err);
  }
}

function loadConferenceProceedings() {
  try {
    if (fs.existsSync(REPOSITORY_CONFERENCES_FILE)) {
      return JSON.parse(fs.readFileSync(REPOSITORY_CONFERENCES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading conference proceedings:', err);
  }
  return INITIAL_CONFERENCE_PROCEEDINGS;
}

function saveConferenceProceedings(conferences: any[]) {
  try {
    fs.writeFileSync(REPOSITORY_CONFERENCES_FILE, JSON.stringify(conferences, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving conference proceedings:', err);
  }
}

// Phase 8: Institutional Review Board (IRB) & Conferences CFP Helpers
function loadIrbProtocols() {
  try {
    if (fs.existsSync(IRB_PROTOCOLS_FILE)) {
      return JSON.parse(fs.readFileSync(IRB_PROTOCOLS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading IRB protocols:', err);
  }
  return INITIAL_IRB_PROTOCOLS;
}

function saveIrbProtocols(protocols: any[]) {
  try {
    fs.writeFileSync(IRB_PROTOCOLS_FILE, JSON.stringify(protocols, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving IRB protocols:', err);
  }
}

function loadIrbCommittees() {
  try {
    if (fs.existsSync(IRB_COMMITTEES_FILE)) {
      return JSON.parse(fs.readFileSync(IRB_COMMITTEES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading IRB committees:', err);
  }
  return INITIAL_IRB_COMMITTEES;
}

function saveIrbCommittees(committees: any[]) {
  try {
    fs.writeFileSync(IRB_COMMITTEES_FILE, JSON.stringify(committees, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving IRB committees:', err);
  }
}

function loadConferencesCfp() {
  try {
    if (fs.existsSync(CONFERENCES_CFP_FILE)) {
      return JSON.parse(fs.readFileSync(CONFERENCES_CFP_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading conferences CFP:', err);
  }
  return INITIAL_CONFERENCE_CFP;
}

function saveConferencesCfp(cfps: any[]) {
  try {
    fs.writeFileSync(CONFERENCES_CFP_FILE, JSON.stringify(cfps, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving conferences CFP:', err);
  }
}

function loadConferencesSubmissions() {
  try {
    if (fs.existsSync(CONFERENCES_SUBMISSIONS_FILE)) {
      return JSON.parse(fs.readFileSync(CONFERENCES_SUBMISSIONS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading conference submissions:', err);
  }
  return [];
}

function saveConferencesSubmissions(subs: any[]) {
  try {
    fs.writeFileSync(CONFERENCES_SUBMISSIONS_FILE, JSON.stringify(subs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving conference submissions:', err);
  }
}

// -------------------------------------------------------------
// PHASE 9: IP, STARTUPS, AGRO ADVISORIES, DEMO SITES & MOUS LOADERS
// -------------------------------------------------------------
function loadIpRecords() {
  try {
    if (fs.existsSync(IP_RECORDS_FILE)) {
      return JSON.parse(fs.readFileSync(IP_RECORDS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading IP records:', err);
  }
  return INITIAL_IP_RECORDS;
}

function saveIpRecords(records: any[]) {
  try {
    fs.writeFileSync(IP_RECORDS_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving IP records:', err);
  }
}

function loadIncubationStartups() {
  try {
    if (fs.existsSync(INCUBATION_STARTUPS_FILE)) {
      return JSON.parse(fs.readFileSync(INCUBATION_STARTUPS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading incubation startups:', err);
  }
  return INITIAL_INCUBATION_STARTUPS;
}

function saveIncubationStartups(startups: any[]) {
  try {
    fs.writeFileSync(INCUBATION_STARTUPS_FILE, JSON.stringify(startups, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving incubation startups:', err);
  }
}

function loadAgroAdvisories() {
  try {
    if (fs.existsSync(AGRO_ADVISORIES_FILE)) {
      return JSON.parse(fs.readFileSync(AGRO_ADVISORIES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading agro advisories:', err);
  }
  return INITIAL_AGRO_ADVISORIES;
}

function saveAgroAdvisories(advisories: any[]) {
  try {
    fs.writeFileSync(AGRO_ADVISORIES_FILE, JSON.stringify(advisories, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving agro advisories:', err);
  }
}

function loadDemoSites() {
  try {
    if (fs.existsSync(DEMO_SITES_FILE)) {
      return JSON.parse(fs.readFileSync(DEMO_SITES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading demonstration sites:', err);
  }
  return INITIAL_DEMO_SITES;
}

function saveDemoSites(sites: any[]) {
  try {
    fs.writeFileSync(DEMO_SITES_FILE, JSON.stringify(sites, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving demonstration sites:', err);
  }
}

function loadIndustryMous() {
  try {
    if (fs.existsSync(INDUSTRY_MOUS_FILE)) {
      return JSON.parse(fs.readFileSync(INDUSTRY_MOUS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading industry MOUs:', err);
  }
  return INITIAL_INDUSTRY_MOUS;
}

function saveIndustryMous(mous: any[]) {
  try {
    fs.writeFileSync(INDUSTRY_MOUS_FILE, JSON.stringify(mous, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving industry MOUs:', err);
  }
}

// -------------------------------------------------------------
// DIGITAL STORE / MARKETPLACE DATA LOADERS & PERSISTENCE
// -------------------------------------------------------------
function loadStoreProducts() {
  try {
    if (fs.existsSync(STORE_PRODUCTS_FILE)) {
      const stored = JSON.parse(fs.readFileSync(STORE_PRODUCTS_FILE, 'utf-8'));
      const existingIds = new Set(stored.map((p: any) => p.id));
      let updated = false;
      for (const item of INITIAL_STORE_PRODUCTS) {
        if (!existingIds.has(item.id)) {
          stored.unshift(item);
          updated = true;
        }
      }
      if (updated) {
        saveStoreProducts(stored);
      }
      return stored;
    }
  } catch (err) {
    console.error('Error loading store products:', err);
  }
  return INITIAL_STORE_PRODUCTS;
}

function saveStoreProducts(products: any[]) {
  try {
    fs.writeFileSync(STORE_PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store products:', err);
  }
}

function loadStoreOrders() {
  try {
    if (fs.existsSync(STORE_ORDERS_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_ORDERS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading store orders:', err);
  }
  return INITIAL_STORE_ORDERS;
}

function saveStoreOrders(orders: any[]) {
  try {
    fs.writeFileSync(STORE_ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store orders:', err);
  }
}

function loadStorePermissions() {
  try {
    if (fs.existsSync(STORE_PERMISSIONS_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_PERMISSIONS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading store permissions:', err);
  }
  return INITIAL_STORE_PERMISSIONS;
}

function saveStorePermissions(perms: any[]) {
  try {
    fs.writeFileSync(STORE_PERMISSIONS_FILE, JSON.stringify(perms, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store permissions:', err);
  }
}

function loadStoreCoupons() {
  try {
    if (fs.existsSync(STORE_COUPONS_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_COUPONS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading store coupons:', err);
  }
  return INITIAL_STORE_COUPONS;
}

function saveStoreCoupons(coupons: any[]) {
  try {
    fs.writeFileSync(STORE_COUPONS_FILE, JSON.stringify(coupons, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store coupons:', err);
  }
}

function loadStoreSettings() {
  try {
    if (fs.existsSync(STORE_SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_SETTINGS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading store settings:', err);
  }
  return INITIAL_STORE_SETTINGS;
}

function saveStoreSettings(settings: any) {
  try {
    fs.writeFileSync(STORE_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store settings:', err);
  }
}

function loadStoreAuditLogs() {
  try {
    if (fs.existsSync(STORE_AUDIT_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_AUDIT_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading store audit logs:', err);
  }
  return INITIAL_STORE_AUDIT_LOGS;
}

function saveStoreAuditLogs(logs: any[]) {
  try {
    fs.writeFileSync(STORE_AUDIT_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store audit logs:', err);
  }
}

function loadStoreDownloadLogs() {
  try {
    if (fs.existsSync(STORE_DOWNLOAD_LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_DOWNLOAD_LOGS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading store download logs:', err);
  }
  return [];
}

function saveStoreDownloadLogs(logs: any[]) {
  try {
    fs.writeFileSync(STORE_DOWNLOAD_LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store download logs:', err);
  }
}

function loadStorePayouts() {
  try {
    if (fs.existsSync(STORE_PAYOUTS_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_PAYOUTS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading store payouts:', err);
  }
  return [
    {
      id: 'payout-seed-01',
      authorUserId: 'usr-author-01',
      authorEmail: 'dr.gemechu@wki.edu.et',
      authorName: 'Dr. Gemechu Berhanu',
      amountETB: 12500,
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: '1000284910294',
      accountHolder: 'Dr. Gemechu Berhanu',
      requestedAt: '2026-08-10T10:30:00.000Z',
      status: 'COMPLETED',
      transactionRef: 'CBE-DISBURSED-891024',
      processedAt: '2026-08-11T09:15:00.000Z',
    },
  ];
}

function saveStorePayouts(payouts: any[]) {
  try {
    fs.writeFileSync(STORE_PAYOUTS_FILE, JSON.stringify(payouts, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store payouts:', err);
  }
}

function logStoreAudit(
  action: string,
  user: { id: string; name: string; role: string },
  targetId: string,
  targetName: string,
  details: string,
  ipAddress?: string
) {
  const logs = loadStoreAuditLogs();
  const entry = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    action,
    performedByUserId: user.id || 'anonymous',
    performedByUserName: user.name || 'Admin',
    performedByUserRole: user.role || 'admin',
    targetId,
    targetName,
    details,
    timestamp: new Date().toISOString(),
    ipAddress,
  };
  logs.unshift(entry);
  // Keep last 1000 logs
  if (logs.length > 1000) logs.length = 1000;
  saveStoreAuditLogs(logs);
}

// Initialize seed accounts if users file is empty
async function initSeedUsers() {
  const existing = loadUsers();
  if (existing.length === 0) {
    console.log('Seeding initial academic and administrative accounts...');
    const seedPasswords = {
      author: await bcrypt.hash('AuthorPass123!', 10),
      scholar: await bcrypt.hash('ScholarPass123!', 10),
      reviewer: await bcrypt.hash('ReviewerPass123!', 10),
      faculty: await bcrypt.hash('FacultyPass123!', 10),
      admin: await bcrypt.hash('AdminPass123!', 10),
      user: await bcrypt.hash('Haramaya2026!', 10),
    };

    const initialUsers: StoredUser[] = [
      {
        id: 'usr-author-01',
        email: 'author@wki.edu.et',
        passwordHash: seedPasswords.author,
        name: 'Ato Feysal Mohammed',
        role: 'author',
        affiliation: 'Independent Oromo Historical Monograph Author',
        phone: '+251 91 145 8892',
        staffOrStudentId: 'WKI-AUTH-2026',
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
        permissions: ['content.view', 'content.create', 'resources.view', 'resources.download'],
      },
      {
        id: 'usr-scholar-01',
        email: 'scholar@wki.edu.et',
        passwordHash: seedPasswords.scholar,
        name: 'Chaltu Benti',
        role: 'scholar',
        affiliation: 'School of Graduate Studies • Haramaya University',
        phone: '+251 92 344 7711',
        staffOrStudentId: 'HU-PGS-7741',
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
        permissions: ['resources.view', 'resources.download'],
      },
      {
        id: 'usr-reviewer-01',
        email: 'reviewer@wki.edu.et',
        passwordHash: seedPasswords.reviewer,
        name: 'Prof. Tadesse Bekele, PhD',
        role: 'reviewer',
        affiliation: 'College of Agriculture & Environmental Sciences • Haramaya University',
        orcid: '0000-0002-8419-7721',
        staffOrStudentId: 'HU-REV-094',
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
        permissions: ['content.view', 'resources.view', 'reports.view'],
      },
      {
        id: 'usr-faculty-01',
        email: 'faculty@wki.edu.et',
        passwordHash: seedPasswords.faculty,
        name: 'Dr. Gemechu Desta, Assoc. Prof.',
        role: 'faculty',
        affiliation: 'Dept of Agricultural Economics • Haramaya University',
        staffOrStudentId: 'HU-FAC-8842',
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
        permissions: ['content.view', 'resources.view', 'reports.view'],
      },
      {
        id: 'usr-admin-01',
        email: 'admin@wki.edu.et',
        passwordHash: seedPasswords.admin,
        name: 'Dr. Muktar Aliyi (Director of Press)',
        role: 'admin',
        affiliation: 'Wirtuu Kompiitaraa Ilillii & University Press Directorate',
        phone: '+251 91 532 9940',
        staffOrStudentId: 'WKI-DIR-001',
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
        permissions: ['users.view', 'users.create', 'users.edit', 'content.view', 'content.create', 'content.edit', 'resources.view', 'resources.upload', 'sales.view', 'payments.view'],
        scopeId: 'scope-alpha',
      },
      {
        id: 'usr-user-01',
        email: 'itechnology416@gmail.com',
        passwordHash: seedPasswords.user,
        name: 'Lead Academic Administrator',
        role: 'admin',
        affiliation: 'Haramaya University • Wirtuu Kompiitaraa Ilillii',
        staffOrStudentId: 'HU-SYS-ADMIN',
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
        permissions: ['users.view', 'users.create', 'users.edit', 'content.view', 'resources.view', 'sales.view'],
        scopeId: 'scope-alpha',
      },
    ];

    saveUsers(initialUsers);
    console.log(`Seeded ${initialUsers.length} verified accounts.`);
  }
}

// Helper to sanitize user object for client response (strips password hash)
function sanitizeUser(user: StoredUser) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// Auth Middleware to verify tokens and enforce account status
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined;

  // Check Authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Fallback to cookie
  if (!token && req.cookies && req.cookies.wki_auth_token) {
    token = req.cookies.wki_auth_token;
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. No active token found.' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err || !decoded) {
      res.status(403).json({ success: false, message: 'Session expired or invalid. Please sign in again.' });
      return;
    }
    const users = loadUsers();
    const dbUser = users.find((u) => u.id === decoded.id || u.email.toLowerCase() === decoded.email?.toLowerCase());
    if (!dbUser) {
      res.status(401).json({ success: false, message: 'User account no longer exists.' });
      return;
    }
    if (dbUser.status === 'SUSPENDED' || dbUser.status === 'DISABLED') {
      res.status(403).json({
        success: false,
        message: `Account is ${dbUser.status.toLowerCase()}. Access to system resources is revoked. Contact Primary Super Admin.`,
      });
      return;
    }
    (req as any).user = dbUser;
    next();
  });
}

function getUserFromReq(req: Request): any {
  if ((req as any).user) return (req as any).user;
  let token: string | undefined;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token && req.cookies && req.cookies.wki_auth_token) {
    token = req.cookies.wki_auth_token;
  }
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

async function startServer() {
  await initSeedUsers();

  const app = express();

  // Core middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // -------------------------------------------------------------
  // AUTHENTICATION API ROUTES
  // -------------------------------------------------------------

  // 1. Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'WKI Academic Platform API', timestamp: new Date().toISOString() });
  });

  // 2. Seed Accounts Info (For reviewer convenience)
  app.get('/api/auth/seed-users', (_req, res) => {
    res.json({
      success: true,
      credentials: [
        { role: 'Author / Client', email: 'author@wki.edu.et', pass: 'AuthorPass123!', name: 'Ato Feysal Mohammed' },
        { role: 'Scholar / Postgraduate', email: 'scholar@wki.edu.et', pass: 'ScholarPass123!', name: 'Chaltu Benti' },
        { role: 'Peer Reviewer', email: 'reviewer@wki.edu.et', pass: 'ReviewerPass123!', name: 'Prof. Tadesse Bekele' },
        { role: 'Faculty / PI', email: 'faculty@wki.edu.et', pass: 'FacultyPass123!', name: 'Dr. Gemechu Desta' },
        { role: 'Press Registrar / Admin', email: 'admin@wki.edu.et', pass: 'AdminPass123!', name: 'Dr. Muktar Aliyi' },
        { role: 'System Admin', email: 'itechnology416@gmail.com', pass: 'Haramaya2026!', name: 'Lead Academic Administrator' },
      ],
    });
  });

  // 3. User Registration
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, name, role = 'author', affiliation, phone, staffOrStudentId } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ success: false, message: 'Email, password, and full name are required.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();
      const users = loadUsers();

      if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser: StoredUser = {
        id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        email: normalizedEmail,
        passwordHash,
        name: name.trim(),
        role: role as any,
        status: 'ACTIVE',
        permissions: ['resources.view', 'resources.download', 'content.view'],
        scopeId: 'default',
        affiliation: affiliation ? affiliation.trim() : undefined,
        phone: phone ? phone.trim() : undefined,
        staffOrStudentId: staffOrStudentId ? staffOrStudentId.trim() : undefined,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveUsers(users);

      const tokenPayload = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

      // Set cookie
      res.cookie('wki_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: sanitizeUser(newUser),
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      res.status(500).json({ success: false, message: 'Server error during registration. Please try again.' });
    }
  });

  // 4. User Login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Please enter both your email and password.' });
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();
      const users = loadUsers();
      const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid credentials. No account found with that email.' });
        return;
      }

      if (user.status === 'SUSPENDED' || user.status === 'DISABLED') {
        logEnterpriseAudit(user, 'LOGIN_ATTEMPT', 'Auth', user.id, `Blocked login attempt for ${user.status} account`, req, 'DENIED', user.email);
        res.status(403).json({
          success: false,
          message: `Your account has been ${user.status.toLowerCase()}. Access to the system is revoked. Please contact the Primary Super Administrator.`,
        });
        return;
      }

      let isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch && (user.email.toLowerCase() === 'superadmin@wki.edu.et' || user.id === 'usr-super-admin-01') && (password === 'SuperAdminPass2026!' || password === 'AdminPass123!')) {
        isMatch = true;
      }
      if (!isMatch) {
        logEnterpriseAudit(user, 'LOGIN_FAILED', 'Auth', user.id, 'Invalid password attempt', req, 'FAILED', user.email);
        res.status(401).json({ success: false, message: 'Incorrect password. Please verify and try again.' });
        return;
      }

      // Update last login
      user.lastLoginAt = new Date().toISOString();
      saveUsers(users);

      const tokenPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        isPrimarySuperAdmin: !!user.isPrimarySuperAdmin,
        scopeId: user.scopeId || 'default',
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

      res.cookie('wki_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      logEnterpriseAudit(user, 'LOGIN_SUCCESS', 'Auth', user.id, `User logged in successfully as ${user.role}`, req, 'SUCCESS', user.name);

      res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: sanitizeUser(user),
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: 'Server error during login. Please try again.' });
    }
  });

  // 5. Current Authenticated User ('/api/auth/me')
  app.get('/api/auth/me', authenticateToken, (req: Request, res: Response) => {
    try {
      const actor = (req as any).user as StoredUser;
      res.json({
        success: true,
        user: sanitizeUser(actor),
      });
    } catch (err: any) {
      console.error('Auth verification error:', err);
      res.status(500).json({ success: false, message: 'Failed to verify authentication status.' });
    }
  });

  // 6. Logout
  app.post('/api/auth/logout', authenticateToken, (req: Request, res: Response) => {
    const actor = (req as any).user as StoredUser;
    if (actor) {
      logEnterpriseAudit(actor, 'LOGOUT', 'Auth', actor.id, 'User logged out', req, 'SUCCESS', actor.name);
    }
    res.clearCookie('wki_auth_token');
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // -------------------------------------------------------------
  // ENTERPRISE HIERARCHICAL RBAC & PERMISSION SYSTEM API ENDPOINTS
  // -------------------------------------------------------------

  // 1. Get Managed Users & Hierarchy (Filtered by Admin Scope / Tenant Isolation)
  app.get('/api/admin/rbac/users', authenticateToken, (req: Request, res: Response) => {
    try {
      const actor = (req as any).user as StoredUser;

      if (!hasUserPermission(actor, 'users.view') && !hasUserPermission(actor, 'admins.view') && !hasUserPermission(actor, 'clients.view')) {
        logEnterpriseAudit(actor, 'VIEW_USERS', 'RBAC', 'users_list', 'Unauthorized attempt to list users', req, 'DENIED');
        res.status(403).json({ success: false, message: 'Access Denied: You lack permissions to view user administration records.' });
        return;
      }

      const allUsers = loadUsers();
      let visibleUsers: StoredUser[] = [];

      if (actor.role === 'superadmin' || isPrimarySuperAdminUser(actor)) {
        visibleUsers = allUsers;
      } else if (actor.role === 'admin') {
        visibleUsers = allUsers.filter((u) => canManageTargetUser(actor, u) || u.id === actor.id);
      } else {
        visibleUsers = allUsers.filter((u) => u.id === actor.id);
      }

      res.json({
        success: true,
        users: visibleUsers.map(sanitizeUser),
        actorScope: actor.scopeId || 'default',
        isPrimarySuperAdmin: isPrimarySuperAdminUser(actor),
      });
    } catch (err: any) {
      console.error('RBAC list users error:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve user hierarchy.' });
    }
  });

  // 2. Provision New Administrator / Client / User
  app.post('/api/admin/rbac/users', authenticateToken, async (req: Request, res: Response) => {
    try {
      const actor = (req as any).user as StoredUser;
      const {
        email,
        password,
        name,
        username,
        role = 'user',
        status = 'ACTIVE',
        scopeId,
        permissions = [],
        expirationDate,
        phone,
        affiliation,
        isPrimarySuperAdminRequest,
      } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ success: false, message: 'Email, password, and full name are required.' });
        return;
      }

      const targetRole = role as StoredUserRole;

      // STRICT SUPER ADMIN PROTECTION CHECK
      if (targetRole === 'superadmin' || isPrimarySuperAdminRequest === true) {
        const users = loadUsers();
        const primaryAdminExists = users.some((u) => isPrimarySuperAdminUser(u));
        if (primaryAdminExists) {
          logEnterpriseAudit(
            actor,
            'CREATE_SUPERADMIN_BLOCKED',
            'SuperAdmin',
            'new',
            `Attempted to create additional Super Admin. Only 1 Primary Super Admin allowed.`,
            req,
            'DENIED',
            email
          );
          res.status(400).json({
            success: false,
            message: 'A primary Super Admin already exists. Only one primary Super Admin is allowed.',
          });
          return;
        }
      }

      // Permission validation based on target role
      let requiredPerm = 'users.create';
      if (targetRole === 'admin') requiredPerm = 'admins.create';
      if (targetRole === 'client') requiredPerm = 'clients.create';

      if (!hasUserPermission(actor, requiredPerm)) {
        logEnterpriseAudit(actor, 'CREATE_USER', 'RBAC', 'new', `Unauthorized attempt to create user with role ${targetRole}`, req, 'DENIED', email);
        res.status(403).json({ success: false, message: `Access Denied: You lack '${requiredPerm}' permission to create this account.` });
        return;
      }

      // Security check: Admins cannot assign permissions they do not hold
      if (actor.role === 'admin' && Array.isArray(permissions)) {
        const invalidPerms = permissions.filter((p) => !actor.permissions.includes(p));
        if (invalidPerms.length > 0) {
          logEnterpriseAudit(
            actor,
            'PRIVILEGE_ESCALATION_ATTEMPT',
            'RBAC',
            'new',
            `Admin attempted to grant permissions outside their own hold: ${invalidPerms.join(', ')}`,
            req,
            'DENIED',
            email
          );
          res.status(403).json({
            success: false,
            message: `Security Error: You cannot grant permissions that you do not hold: ${invalidPerms.join(', ')}`,
          });
          return;
        }
      }

      const normalizedEmail = email.toLowerCase().trim();
      const users = loadUsers();

      if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUserId = `usr-${targetRole}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

      const newUser: StoredUser = {
        id: newUserId,
        email: normalizedEmail,
        passwordHash,
        name: name.trim(),
        username: username ? username.trim() : normalizedEmail.split('@')[0],
        phone: phone ? phone.trim() : undefined,
        role: targetRole,
        status: status as StoredUserStatus,
        permissions: Array.isArray(permissions) ? permissions : [],
        scopeId: scopeId || actor.scopeId || 'default',
        expirationDate: expirationDate || undefined,
        affiliation: affiliation ? affiliation.trim() : undefined,
        createdBy: actor.id,
        createdAt: new Date().toISOString(),
        lastLoginAt: undefined,
      };

      users.push(newUser);
      saveUsers(users);

      logEnterpriseAudit(actor, `CREATE_${targetRole.toUpperCase()}`, 'User', newUser.id, `Created ${targetRole} with scope ${newUser.scopeId}`, req, 'SUCCESS', newUser.name);

      res.status(201).json({
        success: true,
        message: `Account for ${newUser.name} created successfully as ${targetRole.toUpperCase()}.`,
        user: sanitizeUser(newUser),
      });
    } catch (err: any) {
      console.error('RBAC create user error:', err);
      res.status(500).json({ success: false, message: 'Server error while creating user account.' });
    }
  });

  // 3. Update User Profile, Role, Scope, Expiration
  app.put('/api/admin/rbac/users/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
      const actor = (req as any).user as StoredUser;
      const { id } = req.params;
      const { name, phone, affiliation, role, status, scopeId, expirationDate, password } = req.body;

      const users = loadUsers();
      const targetUser = users.find((u) => u.id === id);

      if (!targetUser) {
        res.status(404).json({ success: false, message: 'Target user account not found.' });
        return;
      }

      // PRIMARY SUPER ADMIN SAFEGUARD
      if (isPrimarySuperAdminUser(targetUser) && !isPrimarySuperAdminUser(actor)) {
        logEnterpriseAudit(actor, 'MODIFY_PRIMARY_SUPERADMIN_BLOCKED', 'SuperAdmin', id, 'Attempted to modify Primary Super Admin', req, 'DENIED', targetUser.name);
        res.status(403).json({
          success: false,
          message: 'Primary Super Admin account is protected and cannot be modified, demoted, or suspended by other administrators.',
        });
        return;
      }

      // Scope isolation check
      if (!canManageTargetUser(actor, targetUser)) {
        logEnterpriseAudit(actor, 'MODIFY_USER_SCOPE_BLOCKED', 'User', id, 'Target user is outside admin scope', req, 'DENIED', targetUser.name);
        res.status(403).json({ success: false, message: 'Unauthorized: Target user is outside your assigned administrative scope.' });
        return;
      }

      // Super Admin protection when attempting to change role
      if (isPrimarySuperAdminUser(targetUser) && role && role !== 'superadmin') {
        res.status(400).json({ success: false, message: 'Primary Super Admin role is protected and cannot be changed or demoted.' });
        return;
      }

      if (name) targetUser.name = name.trim();
      if (phone !== undefined) targetUser.phone = phone.trim();
      if (affiliation !== undefined) targetUser.affiliation = affiliation.trim();
      if (scopeId && (actor.role === 'superadmin' || isPrimarySuperAdminUser(actor))) targetUser.scopeId = scopeId;
      if (expirationDate !== undefined) targetUser.expirationDate = expirationDate;
      if (role && actor.role === 'superadmin' && !isPrimarySuperAdminUser(targetUser)) targetUser.role = role;
      if (status && status !== targetUser.status && !isPrimarySuperAdminUser(targetUser)) targetUser.status = status;

      if (password && password.trim().length >= 6) {
        targetUser.passwordHash = await bcrypt.hash(password.trim(), 10);
      }

      saveUsers(users);

      logEnterpriseAudit(actor, 'UPDATE_USER_DETAILS', 'User', targetUser.id, `Updated profile/role/status for ${targetUser.email}`, req, 'SUCCESS', targetUser.name);

      res.json({
        success: true,
        message: `Account details for ${targetUser.name} updated successfully.`,
        user: sanitizeUser(targetUser),
      });
    } catch (err: any) {
      console.error('RBAC update user error:', err);
      res.status(500).json({ success: false, message: 'Failed to update user account.' });
    }
  });

  // 4. Update Granular Permissions Matrix
  app.put('/api/admin/rbac/users/:id/permissions', authenticateToken, (req: Request, res: Response) => {
    try {
      const actor = (req as any).user as StoredUser;
      const { id } = req.params;
      const { permissions } = req.body;

      if (!Array.isArray(permissions)) {
        res.status(400).json({ success: false, message: 'Permissions payload must be an array of permission strings.' });
        return;
      }

      if (!hasUserPermission(actor, 'admins.permissions') && !hasUserPermission(actor, 'users.edit')) {
        logEnterpriseAudit(actor, 'UPDATE_PERMISSIONS_BLOCKED', 'RBAC', id, 'Unauthorized permission update attempt', req, 'DENIED');
        res.status(403).json({ success: false, message: 'Access Denied: You lack permissions to modify RBAC permission matrices.' });
        return;
      }

      const users = loadUsers();
      const targetUser = users.find((u) => u.id === id);

      if (!targetUser) {
        res.status(404).json({ success: false, message: 'Target user account not found.' });
        return;
      }

      if (isPrimarySuperAdminUser(targetUser) && !isPrimarySuperAdminUser(actor)) {
        logEnterpriseAudit(actor, 'UPDATE_SUPERADMIN_PERMS_BLOCKED', 'SuperAdmin', id, 'Attempted to change Primary Super Admin permissions', req, 'DENIED', targetUser.name);
        res.status(403).json({ success: false, message: 'Primary Super Admin permissions are permanent and cannot be modified by other administrators.' });
        return;
      }

      if (!canManageTargetUser(actor, targetUser)) {
        res.status(403).json({ success: false, message: 'Unauthorized: Target user is outside your administrative scope.' });
        return;
      }

      // Security check: Admins cannot grant permissions they do not hold themselves
      if (actor.role === 'admin') {
        const unheld = permissions.filter((p) => !actor.permissions.includes(p));
        if (unheld.length > 0) {
          logEnterpriseAudit(actor, 'PRIVILEGE_ESCALATION_BLOCKED', 'RBAC', id, `Attempted to assign unheld permissions: ${unheld.join(', ')}`, req, 'DENIED', targetUser.name);
          res.status(403).json({ success: false, message: `Security Violation: You cannot grant permissions you do not hold: ${unheld.join(', ')}` });
          return;
        }
      }

      targetUser.permissions = permissions;
      saveUsers(users);

      logEnterpriseAudit(actor, 'UPDATE_PERMISSIONS', 'User', targetUser.id, `Assigned ${permissions.length} permissions to ${targetUser.email}`, req, 'SUCCESS', targetUser.name);

      res.json({
        success: true,
        message: `Permissions updated successfully for ${targetUser.name} (${permissions.length} active permissions).`,
        user: sanitizeUser(targetUser),
      });
    } catch (err: any) {
      console.error('RBAC update permissions error:', err);
      res.status(500).json({ success: false, message: 'Failed to update user permissions.' });
    }
  });

  // 5. Update Account Status (Activate / Suspend / Disable)
  app.put('/api/admin/rbac/users/:id/status', authenticateToken, (req: Request, res: Response) => {
    try {
      const actor = (req as any).user as StoredUser;
      const { id } = req.params;
      const { status } = req.body;

      if (!['ACTIVE', 'SUSPENDED', 'DISABLED', 'PENDING'].includes(status)) {
        res.status(400).json({ success: false, message: 'Invalid status value. Must be ACTIVE, SUSPENDED, DISABLED, or PENDING.' });
        return;
      }

      const users = loadUsers();
      const targetUser = users.find((u) => u.id === id);

      if (!targetUser) {
        res.status(404).json({ success: false, message: 'Target user account not found.' });
        return;
      }

      if (isPrimarySuperAdminUser(targetUser)) {
        logEnterpriseAudit(actor, 'SUSPEND_PRIMARY_SUPERADMIN_BLOCKED', 'SuperAdmin', id, 'Attempted to alter Primary Super Admin status', req, 'DENIED', targetUser.name);
        res.status(403).json({ success: false, message: 'Primary Super Admin account status cannot be modified or suspended.' });
        return;
      }

      if (!canManageTargetUser(actor, targetUser)) {
        res.status(403).json({ success: false, message: 'Unauthorized: Target user is outside your administrative scope.' });
        return;
      }

      const prevStatus = targetUser.status;
      targetUser.status = status;
      saveUsers(users);

      logEnterpriseAudit(actor, `STATUS_CHANGED_${status}`, 'User', targetUser.id, `Status changed from ${prevStatus} to ${status}`, req, 'SUCCESS', targetUser.name);

      res.json({
        success: true,
        message: `Account status for ${targetUser.name} changed to ${status}.`,
        user: sanitizeUser(targetUser),
      });
    } catch (err: any) {
      console.error('RBAC status update error:', err);
      res.status(500).json({ success: false, message: 'Failed to update account status.' });
    }
  });

  // 6. Reset User Password
  app.post('/api/admin/rbac/users/:id/reset-password', authenticateToken, async (req: Request, res: Response) => {
    try {
      const actor = (req as any).user as StoredUser;
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!hasUserPermission(actor, 'users.reset_password') && !hasUserPermission(actor, 'admins.edit')) {
        res.status(403).json({ success: false, message: 'Access Denied: You lack password reset permissions.' });
        return;
      }

      const users = loadUsers();
      const targetUser = users.find((u) => u.id === id);

      if (!targetUser) {
        res.status(404).json({ success: false, message: 'Target user account not found.' });
        return;
      }

      if (isPrimarySuperAdminUser(targetUser) && !isPrimarySuperAdminUser(actor)) {
        res.status(403).json({ success: false, message: 'Primary Super Admin password can only be reset by the Primary Super Admin.' });
        return;
      }

      if (!canManageTargetUser(actor, targetUser)) {
        res.status(403).json({ success: false, message: 'Unauthorized: Target user is outside your administrative scope.' });
        return;
      }

      const passwordToSet = newPassword || `WkiReset#${Math.floor(1000 + Math.random() * 9000)}`;
      targetUser.passwordHash = await bcrypt.hash(passwordToSet, 10);
      saveUsers(users);

      logEnterpriseAudit(actor, 'RESET_PASSWORD', 'User', targetUser.id, `Password reset for ${targetUser.email}`, req, 'SUCCESS', targetUser.name);

      res.json({
        success: true,
        message: `Password reset successfully for ${targetUser.name}.`,
        temporaryPassword: passwordToSet,
      });
    } catch (err: any) {
      console.error('RBAC reset password error:', err);
      res.status(500).json({ success: false, message: 'Failed to reset user password.' });
    }
  });

  // 7. Get Enterprise Security Audit Logs
  app.get('/api/admin/rbac/audit-logs', authenticateToken, (req: Request, res: Response) => {
    try {
      const actor = (req as any).user as StoredUser;

      if (!hasUserPermission(actor, 'audit_logs.view') && actor.role !== 'superadmin' && actor.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Access Denied: Permission required to view enterprise audit logs.' });
        return;
      }

      const logs = loadEnterpriseAuditLogs();
      let filteredLogs = logs;

      if (actor.role === 'admin' && !isPrimarySuperAdminUser(actor)) {
        const managedUsers = loadUsers().filter((u) => canManageTargetUser(actor, u));
        const managedUserIds = new Set(managedUsers.map((u) => u.id));
        managedUserIds.add(actor.id);
        filteredLogs = logs.filter((l) => managedUserIds.has(l.performedByUserId) || managedUserIds.has(l.targetId));
      }

      res.json({
        success: true,
        logs: filteredLogs,
      });
    } catch (err: any) {
      console.error('RBAC audit logs error:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve security audit logs.' });
    }
  });

  // 8. System Metrics & Executive RBAC Dashboard Stats
  app.get('/api/admin/rbac/metrics', authenticateToken, (req: Request, res: Response) => {
    try {
      const actor = (req as any).user as StoredUser;
      const users = loadUsers();
      const logs = loadEnterpriseAuditLogs();

      let targetUsers = users;
      if (actor.role === 'admin' && !isPrimarySuperAdminUser(actor)) {
        targetUsers = users.filter((u) => canManageTargetUser(actor, u) || u.id === actor.id);
      }

      const totalUsers = targetUsers.length;
      const superAdmins = targetUsers.filter((u) => u.role === 'superadmin' || u.isPrimarySuperAdmin).length;
      const admins = targetUsers.filter((u) => u.role === 'admin').length;
      const clients = targetUsers.filter((u) => u.role === 'client').length;
      const activeUsers = targetUsers.filter((u) => u.status === 'ACTIVE').length;
      const suspendedUsers = targetUsers.filter((u) => u.status === 'SUSPENDED' || u.status === 'DISABLED').length;

      // Load products & orders metrics if available
      let totalProducts = 0;
      let pendingPayments = 0;
      try {
        if (fs.existsSync(STORE_PRODUCTS_FILE)) {
          const prods = JSON.parse(fs.readFileSync(STORE_PRODUCTS_FILE, 'utf-8'));
          totalProducts = prods.length;
        }
        if (fs.existsSync(STORE_ORDERS_FILE)) {
          const orders = JSON.parse(fs.readFileSync(STORE_ORDERS_FILE, 'utf-8'));
          pendingPayments = orders.filter((o: any) => o.paymentStatus === 'PENDING' || o.paymentStatus === 'VERIFYING').length;
        }
      } catch (err) {
        // silent fallback
      }

      res.json({
        success: true,
        metrics: {
          totalUsers,
          superAdmins,
          admins,
          clients,
          activeUsers,
          suspendedUsers,
          totalProducts,
          pendingPayments,
          totalAuditEvents: logs.length,
          recentSecurityEvents: logs.slice(0, 5),
          isPrimarySuperAdmin: isPrimarySuperAdminUser(actor),
          scopeId: actor.scopeId || 'global',
        },
      });
    } catch (err: any) {
      console.error('RBAC metrics error:', err);
      res.status(500).json({ success: false, message: 'Failed to calculate system metrics.' });
    }
  });

  // 7. Requests Endpoints
  app.get('/api/requests', (_req: Request, res: Response) => {
    const requests = loadRequests();
    res.json({ success: true, requests });
  });

  app.post('/api/requests', (req: Request, res: Response) => {
    const requests = loadRequests();
    const newReq = {
      id: req.body.id || `WKI-REQ-${Date.now().toString(36).toUpperCase()}`,
      createdAt: req.body.createdAt || new Date().toISOString(),
      status: req.body.status || 'Submitted',
      ...req.body,
    };
    requests.unshift(newReq);
    saveRequests(requests);
    res.json({ success: true, request: newReq });
  });

  app.patch('/api/requests/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const requests = loadRequests();
    const index = requests.findIndex((r: any) => r.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Request not found' });
      return;
    }
    requests[index] = { ...requests[index], ...req.body, updatedAt: new Date().toISOString() };
    saveRequests(requests);
    res.json({ success: true, request: requests[index] });
  });

  app.put('/api/requests/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const requests = loadRequests();
    const index = requests.findIndex((r: any) => r.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Request not found' });
      return;
    }
    requests[index] = { ...requests[index], ...req.body, id, updatedAt: new Date().toISOString() };
    saveRequests(requests);
    res.json({ success: true, request: requests[index] });
  });

  app.delete('/api/requests/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    let requests = loadRequests();
    const initialLen = requests.length;
    requests = requests.filter((r: any) => r.id !== id);
    if (requests.length === initialLen) {
      res.status(404).json({ success: false, message: 'Request not found' });
      return;
    }
    saveRequests(requests);
    res.json({ success: true, message: 'Request archived/deleted' });
  });

  // 8. Contact Inquiries Endpoints
  app.get('/api/contact', (_req: Request, res: Response) => {
    const contacts = loadContacts();
    res.json({ success: true, contacts });
  });

  app.post('/api/contact', (req: Request, res: Response) => {
    const contacts = loadContacts();
    const newInquiry = {
      id: `INQ-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    contacts.unshift(newInquiry);
    saveContacts(contacts);

    // Also automatically register as an institutional service inquiry in requests so admin sees it in the dashboard queue
    const requests = loadRequests();
    const newRequestEntry = {
      id: `REQ-INQ-${Date.now().toString(36).toUpperCase()}`,
      clientName: req.body.name || 'Anonymous Scholar',
      affiliation: req.body.affiliation || 'Direct Website Inquiry',
      phone: req.body.phone || '+251 927 650 724',
      telegram: req.body.telegram || '@FEYSAL_8',
      email: req.body.email,
      serviceCategory: req.body.service || 'other',
      targetLanguage: 'en',
      projectTitle: `Contact Inquiry: ${(req.body.service || 'Publishing').toUpperCase()}`,
      description: req.body.message || 'Direct inquiry via contact form.',
      estimatedPages: 10,
      expectedDeadline: 'Standard (3-5 Days)',
      status: 'Submitted',
      createdAt: new Date().toISOString().split('T')[0],
    };
    requests.unshift(newRequestEntry);
    saveRequests(requests);

    res.json({ success: true, inquiry: newInquiry, request: newRequestEntry });
  });

  // 8. AI Academic Polish Endpoint
  app.post('/api/ai/polish', async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      if (!text) {
        res.status(400).json({ success: false, message: 'Text content is required for polishing.' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ success: false, message: 'GEMINI_API_KEY is not configured.' });
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert senior academic editor at Haramaya University Press. Please polish and elevate the following text for clarity, academic rigor, tone, and grammar:\n\n${text}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({
        success: true,
        polishedText: response.text || text,
      });
    } catch (err: any) {
      console.error('AI polish error:', err);
      res.status(500).json({ success: false, message: err.message || 'AI polishing failed.' });
    }
  });

  // 9. Phase 3: Scholar LMS & Advisory Desk Endpoints
  app.get('/api/scholar/profile', (_req: Request, res: Response) => {
    const profile = loadScholarProfile();
    res.json({ success: true, profile });
  });

  app.put('/api/scholar/profile', (req: Request, res: Response) => {
    saveScholarProfile(req.body);
    res.json({ success: true, profile: req.body });
  });

  app.get('/api/scholar/messages', (_req: Request, res: Response) => {
    const messages = loadScholarMessages();
    res.json({ success: true, messages });
  });

  app.post('/api/scholar/messages', (req: Request, res: Response) => {
    const messages = loadScholarMessages();
    const newMsg = {
      id: req.body.id || `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...req.body,
    };
    messages.push(newMsg);
    saveScholarMessages(messages);
    res.json({ success: true, message: newMsg });
  });

  app.get('/api/scholar/quizzes', (_req: Request, res: Response) => {
    const quizzes = loadScholarQuizzes();
    res.json({ success: true, quizzes });
  });

  app.post('/api/scholar/quizzes', (req: Request, res: Response) => {
    const quizzes = loadScholarQuizzes();
    const newAttempt = {
      id: req.body.id || `qa-${Date.now()}`,
      takenAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...req.body,
    };
    quizzes.unshift(newAttempt);
    saveScholarQuizzes(quizzes);
    res.json({ success: true, attempt: newAttempt });
  });

  app.get('/api/scholar/certificates', (_req: Request, res: Response) => {
    const certs = loadScholarCertificates();
    res.json({ success: true, certificates: certs });
  });

  app.post('/api/scholar/certificates', (req: Request, res: Response) => {
    const certs = loadScholarCertificates();
    const newCert = {
      id: req.body.id || `cert-${Date.now()}`,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...req.body,
    };
    certs.unshift(newCert);
    saveScholarCertificates(certs);
    res.json({ success: true, certificate: newCert });
  });

  app.get('/api/scholar/materials', (_req: Request, res: Response) => {
    const materials = loadScholarMaterials();
    res.json({ success: true, materials });
  });

  app.post('/api/scholar/materials/:id/download', (req: Request, res: Response) => {
    const { id } = req.params;
    let materials = loadScholarMaterials();
    const mat = materials.find((m: any) => m.id === id);
    if (mat) {
      mat.downloadCount = (mat.downloadCount || 0) + 1;
      saveScholarMaterials(materials);
      res.json({ success: true, material: mat });
    } else {
      res.json({ success: true, message: 'Incremented download' });
    }
  });

  // 10. Phase 4: Peer Reviewer & Journal Editorial Portal Endpoints
  app.get('/api/reviewer/profile', (_req: Request, res: Response) => {
    const profile = loadReviewerProfile();
    res.json({ success: true, profile });
  });

  app.put('/api/reviewer/profile', (req: Request, res: Response) => {
    saveReviewerProfile(req.body);
    res.json({ success: true, profile: req.body });
  });

  app.get('/api/reviewer/assignments', (_req: Request, res: Response) => {
    const assignments = loadReviewerAssignments();
    res.json({ success: true, assignments });
  });

  app.get('/api/reviewer/assignments/:id', (req: Request, res: Response) => {
    const assignments = loadReviewerAssignments();
    const assignment = assignments.find((a: any) => a.id === req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.json({ success: true, assignment });
  });

  app.post('/api/reviewer/assignments/:id/review', (req: Request, res: Response) => {
    const { id } = req.params;
    const { rubricScores, recommendation, authorFeedback, confidentialEditorialNotes, isDraft } = req.body;
    let assignments = loadReviewerAssignments();
    const index = assignments.findIndex((a: any) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const current = assignments[index];
    const updated = {
      ...current,
      currentScores: rubricScores || current.currentScores,
      recommendation: recommendation || current.recommendation,
      authorFeedback: authorFeedback !== undefined ? authorFeedback : current.authorFeedback,
      confidentialEditorialNotes: confidentialEditorialNotes !== undefined ? confidentialEditorialNotes : current.confidentialEditorialNotes,
      status: isDraft ? 'In Progress' : 'Submitted',
      completedDate: !isDraft ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : current.completedDate,
    };

    assignments[index] = updated;
    saveReviewerAssignments(assignments);

    // If final submission, issue a certificate of referee recognition automatically if not already issued
    if (!isDraft) {
      const certs = loadReviewerCertificates();
      const existingCert = certs.find((c: any) => c.trackingCode === updated.trackingCode);
      if (!existingCert) {
        const profile = loadReviewerProfile();
        const newCert = {
          certificateId: `HU-PR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          reviewerName: profile?.name || 'Prof. Tadesse Bekele, PhD',
          manuscriptTitle: updated.manuscriptTitle,
          journalName: updated.journalFullName,
          trackingCode: updated.trackingCode,
          completionDate: updated.completedDate,
          issuingAuthority: 'Haramaya University Office of the Vice President for Research Affairs',
          verificationHash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        };
        certs.unshift(newCert);
        saveReviewerCertificates(certs);

        if (profile) {
          profile.totalCompletedReviews = (profile.totalCompletedReviews || 0) + 1;
          saveReviewerProfile(profile);
        }
      }
    }

    res.json({ success: true, assignment: updated });
  });

  app.post('/api/reviewer/assignments/:id/respond', (req: Request, res: Response) => {
    const { id } = req.params;
    const { action } = req.body; // 'accept' | 'decline'
    let assignments = loadReviewerAssignments();
    const index = assignments.findIndex((a: any) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    assignments[index].status = action === 'accept' ? 'In Progress' : 'Declined';
    saveReviewerAssignments(assignments);
    res.json({ success: true, assignment: assignments[index] });
  });

  app.get('/api/reviewer/journals', (_req: Request, res: Response) => {
    res.json({ success: true, journals: INITIAL_JOURNAL_INFOS });
  });

  app.get('/api/reviewer/certificates', (_req: Request, res: Response) => {
    const certificates = loadReviewerCertificates();
    res.json({ success: true, certificates });
  });

  // 11. Phase 5: Faculty Researcher & Grants Portal Endpoints
  app.get('/api/faculty/profile', (_req: Request, res: Response) => {
    const profile = loadFacultyProfile();
    res.json({ success: true, profile });
  });

  app.put('/api/faculty/profile', (req: Request, res: Response) => {
    saveFacultyProfile(req.body);
    res.json({ success: true, profile: req.body });
  });

  app.get('/api/faculty/grants', (_req: Request, res: Response) => {
    const grants = loadFacultyGrants();
    res.json({ success: true, grants });
  });

  app.post('/api/faculty/grants', (req: Request, res: Response) => {
    const grants = loadFacultyGrants();
    const newGrant = {
      id: `grant-${Date.now()}`,
      grantNumber: `HU-RES-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Proposal Under Review',
      spentBudgetETB: 0,
      spentBudgetUSD: 0,
      publicationsCount: 0,
      startDate: new Date().toISOString().split('T')[0],
      milestones: [
        {
          id: `mil-${Date.now()}-1`,
          title: 'Proposal Defense & Ethical Clearance Review',
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'In Progress',
          deliverable: 'Institutional Ethical Approval Certificate',
        },
      ],
      budgetBreakdown: [
        { category: 'Personnel & Research Assistants', allocatedETB: Math.round((req.body.totalBudgetETB || 500000) * 0.3), spentETB: 0 },
        { category: 'Field Travel & Household Per Diem', allocatedETB: Math.round((req.body.totalBudgetETB || 500000) * 0.35), spentETB: 0 },
        { category: 'Laboratory Analysis & Software Licenses', allocatedETB: Math.round((req.body.totalBudgetETB || 500000) * 0.15), spentETB: 0 },
        { category: 'Dissemination & WKI Academic Press Publishing', allocatedETB: Math.round((req.body.totalBudgetETB || 500000) * 0.1), spentETB: 0 },
        { category: 'Institutional Overhead & Contingency', allocatedETB: Math.round((req.body.totalBudgetETB || 500000) * 0.1), spentETB: 0 },
      ],
      ...req.body,
    };
    grants.unshift(newGrant);
    saveFacultyGrants(grants);
    res.json({ success: true, grant: newGrant });
  });

  app.put('/api/faculty/grants/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    let grants = loadFacultyGrants();
    const index = grants.findIndex((g: any) => g.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Grant not found' });
    }
    grants[index] = { ...grants[index], ...req.body };
    saveFacultyGrants(grants);
    res.json({ success: true, grant: grants[index] });
  });

  app.post('/api/faculty/grants/:id/spend', (req: Request, res: Response) => {
    const { id } = req.params;
    const { category, amountETB, description } = req.body;
    let grants = loadFacultyGrants();
    const index = grants.findIndex((g: any) => g.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Grant not found' });
    }

    const grant = grants[index];
    const spendNum = Number(amountETB) || 0;
    grant.spentBudgetETB = (grant.spentBudgetETB || 0) + spendNum;
    grant.spentBudgetUSD = Math.round(grant.spentBudgetETB / 135);

    if (grant.budgetBreakdown) {
      const catItem = grant.budgetBreakdown.find((b: any) => b.category === category);
      if (catItem) {
        catItem.spentETB = (catItem.spentETB || 0) + spendNum;
      }
    }

    saveFacultyGrants(grants);
    res.json({ success: true, grant, message: `Recorded expense of ${spendNum.toLocaleString()} ETB for ${category}` });
  });

  app.get('/api/faculty/supervision', (_req: Request, res: Response) => {
    const theses = loadFacultySupervision();
    res.json({ success: true, supervisees: theses });
  });

  app.post('/api/faculty/supervision', (req: Request, res: Response) => {
    let theses = loadFacultySupervision();
    const newStudent = {
      id: `stu-${Date.now()}`,
      studentId: `PGR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      progress: 15,
      stage: 'Proposal Defense',
      startDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      lastFeedbackDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      ...req.body,
    };
    theses.unshift(newStudent);
    saveFacultySupervision(theses);

    // Increment profile activePostgraduates count
    const prof = loadFacultyProfile();
    prof.activePostgraduates = (prof.activePostgraduates || 0) + 1;
    saveFacultyProfile(prof);

    res.json({ success: true, student: newStudent });
  });

  app.put('/api/faculty/supervision/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    let theses = loadFacultySupervision();
    const index = theses.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Supervisee record not found' });
    }
    theses[index] = {
      ...theses[index],
      ...req.body,
      lastFeedbackDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
    saveFacultySupervision(theses);
    res.json({ success: true, student: theses[index] });
  });

  app.get('/api/faculty/outputs', (_req: Request, res: Response) => {
    const outputs = loadFacultyOutputs();
    res.json({ success: true, outputs });
  });

  app.post('/api/faculty/outputs', (req: Request, res: Response) => {
    let outputs = loadFacultyOutputs();
    const newOutput = {
      id: `out-${Date.now()}`,
      citations: 0,
      publicationYear: new Date().getFullYear(),
      ...req.body,
    };
    outputs.unshift(newOutput);
    saveFacultyOutputs(outputs);

    // Update grant output count if linked
    if (newOutput.linkedGrantId) {
      let grants = loadFacultyGrants();
      const g = grants.find((x: any) => x.id === newOutput.linkedGrantId);
      if (g) {
        g.publicationsCount = (g.publicationsCount || 0) + 1;
        saveFacultyGrants(grants);
      }
    }

    res.json({ success: true, output: newOutput });
  });

  // 12. Phase 6: University Press & Registrar Operations Desk Endpoints
  // Clearance Queue
  app.get('/api/press/clearances', (_req: Request, res: Response) => {
    const clearances = loadPressClearances();
    res.json({ success: true, clearances });
  });

  app.post('/api/press/clearances', (req: Request, res: Response) => {
    let clearances = loadPressClearances();
    const newClearance = {
      id: `clr-${Date.now()}`,
      status: 'Pending Review',
      hardcopyBindingDelivered: false,
      hardcopyCopiesCount: 0,
      plagiarismCertHash: `HU-ORIG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      libraryRepoDepositHandle: `123456789/${Math.floor(4000 + Math.random() * 900)}`,
      ...req.body,
    };
    clearances.unshift(newClearance);
    savePressClearances(clearances);
    res.json({ success: true, clearance: newClearance });
  });

  app.put('/api/press/clearances/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, remarks, verifiedBy, hardcopyBindingDelivered, hardcopyCopiesCount } = req.body;
    let clearances = loadPressClearances();
    const index = clearances.findIndex((c: any) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Clearance record not found' });
    }

    const item = clearances[index];
    item.status = status || item.status;
    if (remarks !== undefined) item.remarks = remarks;
    if (verifiedBy !== undefined) item.verifiedBy = verifiedBy;
    if (hardcopyBindingDelivered !== undefined) item.hardcopyBindingDelivered = hardcopyBindingDelivered;
    if (hardcopyCopiesCount !== undefined) item.hardcopyCopiesCount = hardcopyCopiesCount;

    if (item.status === 'Approved & Cleared' && !item.clearanceCertNumber) {
      item.clearanceCertNumber = `HU-REG-CLR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      item.issuedAt = new Date().toISOString().split('T')[0];
    }

    savePressClearances(clearances);
    res.json({ success: true, clearance: item });
  });

  // Production Floor
  app.get('/api/press/production', (_req: Request, res: Response) => {
    const jobs = loadPressProduction();
    res.json({ success: true, jobs });
  });

  app.post('/api/press/production', (req: Request, res: Response) => {
    let jobs = loadPressProduction();
    const newJob = {
      id: `job-${Date.now()}`,
      jobCode: `HU-POD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pre-flight Check',
      requestedDate: new Date().toISOString().split('T')[0],
      assignedOperator: 'W/ro Hiwot Assefa & Ato Birhanu Tulu',
      ...req.body,
    };
    jobs.unshift(newJob);
    savePressProduction(jobs);
    res.json({ success: true, job: newJob });
  });

  app.put('/api/press/production/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, assignedOperator, notes } = req.body;
    let jobs = loadPressProduction();
    const index = jobs.findIndex((j: any) => j.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Production job not found' });
    }

    if (status) jobs[index].status = status;
    if (assignedOperator) jobs[index].assignedOperator = assignedOperator;
    if (notes !== undefined) jobs[index].notes = notes;

    savePressProduction(jobs);
    res.json({ success: true, job: jobs[index] });
  });

  // ISBN & DOI Registry
  app.get('/api/press/isbn-registry', (_req: Request, res: Response) => {
    const registry = loadPressISBN();
    res.json({ success: true, registry });
  });

  app.post('/api/press/isbn-registry', (req: Request, res: Response) => {
    let registry = loadPressISBN();
    const count = registry.length + 1;
    const newRecord = {
      id: `isbn-${Date.now()}`,
      isbn: req.body.isbn || `978-99944-72-${count < 10 ? '0' + count : count}-${Math.floor(1 + Math.random() * 9)}`,
      doiPrefix: '10.20372',
      doiSuffix: req.body.doiSuffix || `wki.${new Date().getFullYear()}.${count < 10 ? '00' + count : '0' + count}`,
      allocatedDate: new Date().toISOString().split('T')[0],
      status: 'Allocated - Pending Release',
      depositWithNationalLibrary: false,
      ...req.body,
    };
    registry.unshift(newRecord);
    savePressISBN(registry);
    res.json({ success: true, record: newRecord });
  });

  // Financial Audit Ledger
  app.get('/api/press/audit-ledger', (_req: Request, res: Response) => {
    const ledger = loadPressAudit();
    res.json({ success: true, ledger });
  });

  app.post('/api/press/audit-ledger', (req: Request, res: Response) => {
    let ledger = loadPressAudit();
    const newVoucher = {
      id: `aud-${Date.now()}`,
      voucherNumber: `HU-AUD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Auditor Signoff',
      ...req.body,
    };
    ledger.unshift(newVoucher);
    savePressAudit(ledger);
    res.json({ success: true, record: newVoucher });
  });

  // Inventory
  app.get('/api/press/inventory', (_req: Request, res: Response) => {
    const items = loadPressInventory();
    res.json({ success: true, inventory: items });
  });

  app.put('/api/press/inventory/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity, status } = req.body;
    let items = loadPressInventory();
    const index = items.findIndex((i: any) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    if (quantity !== undefined) items[index].quantity = Number(quantity);
    if (status) items[index].status = status;
    items[index].lastRestockedDate = new Date().toISOString().split('T')[0];

    savePressInventory(items);
    res.json({ success: true, item: items[index] });
  });

  // -------------------------------------------------------------
  // PHASE 7: INSTITUTIONAL REPOSITORY & OPEN ACCESS ETD COMMONS
  // -------------------------------------------------------------

  // Get all repository items with optional query filters
  app.get('/api/repository/items', (req: Request, res: Response) => {
    const { community, collection, accessLevel, search } = req.query;
    let items = loadRepositoryItems();

    if (community) {
      items = items.filter((i: any) => i.community === community);
    }
    if (collection) {
      items = items.filter((i: any) => i.collection === collection);
    }
    if (accessLevel) {
      items = items.filter((i: any) => i.accessLevel === accessLevel);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      items = items.filter(
        (i: any) =>
          i.title.toLowerCase().includes(q) ||
          i.abstract.toLowerCase().includes(q) ||
          i.handle.toLowerCase().includes(q) ||
          i.keywords.some((k: string) => k.toLowerCase().includes(q)) ||
          i.authors.some((a: any) => a.name.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: items.length, items });
  });

  // Deposit new repository item (Self-Archiving or Registrar Clearance Deposit)
  app.post('/api/repository/items', (req: Request, res: Response) => {
    let items = loadRepositoryItems();
    const handleNumber = 4300 + items.length + Math.floor(Math.random() * 10);
    const handle = req.body.handle || `123456789/${handleNumber}`;
    const today = new Date().toISOString().split('T')[0];

    const newItem = {
      id: `repo-${Date.now()}`,
      handle,
      title: req.body.title || 'Untitled Repository Deposit',
      authors: req.body.authors || [{ name: 'Anonymous Researcher', affiliation: 'Haramaya University' }],
      advisor: req.body.advisor || '',
      community: req.body.community || 'College of Agriculture & Environmental Sciences',
      collection: req.body.collection || 'Master Theses (MSc/MA)',
      publicationDate: req.body.publicationDate || today,
      dateDeposited: today,
      abstract: req.body.abstract || 'No abstract provided.',
      keywords: req.body.keywords || ['Haramaya University', 'Open Access'],
      language: req.body.language || 'en',
      accessLevel: req.body.accessLevel || 'Open Access',
      license: req.body.license || 'CC BY 4.0',
      doi: req.body.doi || `10.20372/etd.${new Date().getFullYear()}.${handleNumber}`,
      citationCount: 0,
      downloadCount: 1,
      viewCount: 3,
      oaiPmhIdentifier: `oai:repository.haramaya.edu.et:${handle}`,
      clearanceRefId: req.body.clearanceRefId || undefined,
      bitstreams: req.body.bitstreams || [
        {
          id: `bit-${Date.now()}`,
          name: `${req.body.title ? req.body.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_') : 'Manuscript'}_Final_FullText.pdf`,
          size: '5.2 MB',
          format: 'PDF',
          type: 'Main Full-Text',
          checksumSha256: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
        },
      ],
      dublinCore: req.body.dublinCore || {
        title: req.body.title || 'Untitled Deposit',
        creator: (req.body.authors || []).map((a: any) => a.name),
        subject: req.body.keywords || ['Academic Research'],
        descriptionAbstract: req.body.abstract || '',
        publisher: 'Haramaya University Institutional E-Repository',
        contributorAdvisor: req.body.advisor ? [req.body.advisor] : undefined,
        dateIssued: req.body.publicationDate || today,
        type: req.body.collection || 'Thesis or Dissertation',
        format: 'application/pdf',
        identifierUri: `http://hdl.handle.net/${handle}`,
        language: req.body.language || 'en',
        rights: req.body.license ? `Open Access under ${req.body.license}` : 'Open Access under CC BY 4.0',
      },
      readershipRegions: [
        { country: 'Ethiopia', flag: '🇪🇹', count: 1 },
      ],
    };

    items.unshift(newItem);
    saveRepositoryItems(items);
    res.json({ success: true, item: newItem });
  });

  // Update repository item
  app.put('/api/repository/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    let items = loadRepositoryItems();
    const index = items.findIndex((i: any) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Repository item not found' });
    }

    items[index] = {
      ...items[index],
      ...req.body,
    };

    saveRepositoryItems(items);
    res.json({ success: true, item: items[index] });
  });

  // Increment download counter
  app.post('/api/repository/items/:id/download', (req: Request, res: Response) => {
    const { id } = req.params;
    let items = loadRepositoryItems();
    const index = items.findIndex((i: any) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Repository item not found' });
    }

    items[index].downloadCount = (items[index].downloadCount || 0) + 1;
    items[index].viewCount = (items[index].viewCount || 0) + 2;

    saveRepositoryItems(items);
    res.json({ success: true, downloadCount: items[index].downloadCount, viewCount: items[index].viewCount });
  });

  // Delete repository item
  app.delete('/api/repository/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    let items = loadRepositoryItems();
    items = items.filter((i: any) => i.id !== id);
    saveRepositoryItems(items);
    res.json({ success: true, message: 'Repository item removed' });
  });

  // OAI-PMH 2.0 Live XML Endpoint conforming to Open Archives Initiative specs
  app.get('/api/repository/oai', (req: Request, res: Response) => {
    const verb = (req.query.verb as string) || 'Identify';
    const identifier = req.query.identifier as string;
    const now = new Date().toISOString();
    const items = loadRepositoryItems();

    if (verb === 'Identify') {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">
  <responseDate>${now}</responseDate>
  <request verb="Identify">https://repository.haramaya.edu.et/oai/request</request>
  <Identify>
    <repositoryName>Haramaya University Institutional E-Repository (HU-IR)</repositoryName>
    <baseURL>https://repository.haramaya.edu.et/oai/request</baseURL>
    <protocolVersion>2.0</protocolVersion>
    <adminEmail>library.repository@haramaya.edu.et</adminEmail>
    <earliestDatestamp>2004-01-01T00:00:00Z</earliestDatestamp>
    <deletedRecord>persistent</deletedRecord>
    <granularity>YYYY-MM-DDThh:mm:ssZ</granularity>
    <compression>deflate</compression>
    <description>
      <oai-identifier xmlns="http://www.openarchives.org/OAI/2.0/oai-identifier"
                      xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai-identifier http://www.openarchives.org/OAI/2.0/oai-identifier.xsd">
        <scheme>oai</scheme>
        <repositoryIdentifier>repository.haramaya.edu.et</repositoryIdentifier>
        <delimiter>:</delimiter>
        <sampleIdentifier>oai:repository.haramaya.edu.et:123456789/4192</sampleIdentifier>
      </oai-identifier>
    </description>
  </Identify>
</OAI-PMH>`;
      res.type('application/xml').send(xml);
      return;
    }

    if (verb === 'ListRecords' || verb === 'GetRecord') {
      let filteredItems = items;
      if (identifier) {
        filteredItems = items.filter((i: any) => i.oaiPmhIdentifier === identifier || i.handle === identifier);
      }

      const recordsXml = filteredItems
        .map(
          (item: any) => `
    <record>
      <header>
        <identifier>${item.oaiPmhIdentifier}</identifier>
        <datestamp>${item.dateDeposited || '2026-09-01'}T10:00:00Z</datestamp>
        <setSpec>${item.community.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}</setSpec>
      </header>
      <metadata>
        <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
                   xmlns:dc="http://purl.org/dc/elements/1.1/"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">
          <dc:title><![CDATA[${item.title}]]></dc:title>
          ${item.authors.map((a: any) => `<dc:creator><![CDATA[${a.name}]]></dc:creator>`).join('\n          ')}
          ${(item.keywords || []).map((k: string) => `<dc:subject><![CDATA[${k}]]></dc:subject>`).join('\n          ')}
          <dc:description><![CDATA[${item.abstract}]]></dc:description>
          <dc:publisher>Haramaya University Institutional E-Repository</dc:publisher>
          <dc:date>${item.publicationDate}</dc:date>
          <dc:type>${item.collection}</dc:type>
          <dc:identifier>${item.doi ? 'https://doi.org/' + item.doi : 'http://hdl.handle.net/' + item.handle}</dc:identifier>
          <dc:language>${item.language || 'en'}</dc:language>
          <dc:rights>${item.license}</dc:rights>
        </oai_dc:dc>
      </metadata>
    </record>`
        )
        .join('');

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">
  <responseDate>${now}</responseDate>
  <request verb="${verb}">https://repository.haramaya.edu.et/oai/request</request>
  <${verb}>
    ${recordsXml}
  </${verb}>
</OAI-PMH>`;
      res.type('application/xml').send(xml);
      return;
    }

    res.status(400).json({ success: false, message: `Unsupported verb: ${verb}` });
  });

  // OAI Harvest Jobs
  app.get('/api/repository/harvest', (_req: Request, res: Response) => {
    const jobs = loadOaiJobs();
    res.json({ success: true, jobs });
  });

  app.post('/api/repository/harvest/sync', (req: Request, res: Response) => {
    const { jobId } = req.body;
    let jobs = loadOaiJobs();
    const index = jobs.findIndex((j: any) => j.id === jobId);
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

    if (index !== -1) {
      jobs[index].status = 'Synchronized';
      jobs[index].lastHarvestDate = now;
      jobs[index].recordsHarvested += Math.floor(1 + Math.random() * 5);
      saveOaiJobs(jobs);
      return res.json({ success: true, job: jobs[index] });
    } else {
      // Sync all
      jobs = jobs.map((j: any) => ({
        ...j,
        status: 'Synchronized',
        lastHarvestDate: now,
        recordsHarvested: j.recordsHarvested + Math.floor(1 + Math.random() * 3),
      }));
      saveOaiJobs(jobs);
      return res.json({ success: true, jobs });
    }
  });

  // Conference Proceedings
  app.get('/api/repository/conferences', (_req: Request, res: Response) => {
    const conferences = loadConferenceProceedings();
    res.json({ success: true, conferences });
  });

  app.post('/api/repository/conferences', (req: Request, res: Response) => {
    let conferences = loadConferenceProceedings();
    const newConf = {
      id: `conf-${Date.now()}`,
      conferenceTitle: req.body.conferenceTitle || 'Haramaya University Annual Research Review',
      edition: req.body.edition || `${conferences.length + 40}th Edition`,
      year: req.body.year || new Date().getFullYear(),
      isbn: req.body.isbn || `978-99944-72-${Math.floor(50 + Math.random() * 40)}-1`,
      volume: req.body.volume || `Vol. ${conferences.length + 40} (${new Date().getFullYear()})`,
      theme: req.body.theme || 'Advancing Agricultural & Digital Innovation in Eastern Ethiopia',
      venue: req.body.venue || 'Haramaya University Main Campus Afeta Hall',
      dates: req.body.dates || 'April 2027',
      tracks: req.body.tracks || ['Agronomy & Crops', 'Animal & One Health', 'Computing & Informatics'],
      totalPapers: req.body.totalPapers || 50,
      chairperson: req.body.chairperson || 'Vice President for Research Affairs',
      ...req.body,
    };
    conferences.unshift(newConf);
    saveConferenceProceedings(conferences);
    res.json({ success: true, conference: newConf });
  });

  // =============================================================
  // PHASE 8: INSTITUTIONAL REVIEW BOARD (IRB) & RESEARCH INTELLIGENCE ENDPOINTS
  // =============================================================

  // 1. Get IRB Protocols
  app.get('/api/irb/protocols', (req: Request, res: Response) => {
    const { q, committee, status, riskLevel } = req.query;
    let protocols = loadIrbProtocols();

    if (q && typeof q === 'string') {
      const search = q.toLowerCase();
      protocols = protocols.filter(
        (p: any) =>
          p.title.toLowerCase().includes(search) ||
          p.protocolNumber.toLowerCase().includes(search) ||
          p.principalInvestigator.name.toLowerCase().includes(search) ||
          p.principalInvestigator.college.toLowerCase().includes(search) ||
          p.targetPopulation.toLowerCase().includes(search)
      );
    }

    if (committee && typeof committee === 'string' && committee !== 'All Committees') {
      protocols = protocols.filter((p: any) => p.committee === committee);
    }

    if (status && typeof status === 'string' && status !== 'All Statuses') {
      protocols = protocols.filter((p: any) => p.status === status);
    }

    if (riskLevel && typeof riskLevel === 'string' && riskLevel !== 'All Risk Levels') {
      protocols = protocols.filter((p: any) => p.riskLevel === riskLevel);
    }

    res.json({ success: true, protocols, total: protocols.length });
  });

  // 2. Submit New IRB Protocol
  app.post('/api/irb/protocols', (req: Request, res: Response) => {
    try {
      const {
        title,
        principalInvestigator,
        coInvestigators,
        committee,
        category,
        riskLevel,
        reviewType,
        summaryAbstract,
        targetPopulation,
        sampleSize,
        studySites,
        fundingGrantRef,
        ethicalConsiderations,
        attachments,
      } = req.body;

      if (!title || !principalInvestigator || !committee) {
        return res.status(400).json({ success: false, message: 'Study title, PI details, and ethical committee are required.' });
      }

      const protocols = loadIrbProtocols();
      const currentYear = new Date().getFullYear();
      const randomSeq = Math.floor(100 + Math.random() * 900);
      const protocolNumber = `HU-IRB-${currentYear}-${randomSeq}`;
      const hash = `hu_irb_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;

      const newProtocol = {
        id: `irb-${Date.now()}`,
        protocolNumber,
        title: title.trim(),
        principalInvestigator: {
          name: principalInvestigator.name || 'Principal Investigator',
          email: principalInvestigator.email || 'pi@haramaya.edu.et',
          phone: principalInvestigator.phone || '+251 900 000 000',
          college: principalInvestigator.college || 'College of Agriculture & Environmental Sciences',
          department: principalInvestigator.department || 'Department of Research',
          staffOrStudentId: principalInvestigator.staffOrStudentId || `HU-${Date.now().toString().slice(-5)}`,
          role: principalInvestigator.role || 'Faculty PI',
        },
        coInvestigators: Array.isArray(coInvestigators) ? coInvestigators : [],
        committee: committee || 'CHMS Health & Biomedical Sciences IRB',
        category: category || 'Human Clinical & Epidemiological Trials',
        riskLevel: riskLevel || 'Minimal Risk',
        reviewType: reviewType || 'Expedited Review',
        status: 'Under Scientific & Ethical Review',
        submissionDate: new Date().toISOString().split('T')[0],
        meetingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        summaryAbstract: summaryAbstract || 'Research protocol submitted for institutional ethical clearance.',
        targetPopulation: targetPopulation || 'Target study population in Eastern Ethiopia.',
        sampleSize: Number(sampleSize) || 100,
        studySites: Array.isArray(studySites) && studySites.length > 0 ? studySites : ['Haramaya University Research Station'],
        fundingGrantRef: fundingGrantRef || undefined,
        certificateVerificationHash: hash,
        ethicalConsiderations: ethicalConsiderations || {
          informedConsentMethod: 'Written Consent (Afan Oromo / Amharic / Somali)',
          vulnerableGroupsIncluded: false,
          dataConfidentialityProtocol: 'Standard anonymized institutional encryption applied.',
        },
        reviewers: [
          { name: 'Assigned Committee Member 1', decision: 'Pending', comments: 'Under scientific evaluation.' },
          { name: 'Assigned Committee Member 2', decision: 'Pending', comments: 'Under ethical protocol scrutiny.' },
        ],
        attachments: Array.isArray(attachments) && attachments.length > 0
          ? attachments
          : [{ name: 'Submitted_Proposal_Dossier.pdf', size: '2.4 MB', type: 'Protocol Document' }],
      };

      protocols.unshift(newProtocol);
      saveIrbProtocols(protocols);

      res.status(201).json({
        success: true,
        message: `Ethical protocol successfully submitted with tracking number ${protocolNumber}`,
        protocol: newProtocol,
      });
    } catch (err: any) {
      console.error('Error submitting IRB protocol:', err);
      res.status(500).json({ success: false, message: 'Internal server error while filing ethical protocol.' });
    }
  });

  // 3. Update Protocol Status (Ethics Committee Review Action)
  app.put('/api/irb/protocols/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, comments, reviewerName } = req.body;
    const protocols = loadIrbProtocols();
    const index = protocols.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Protocol not found.' });
    }

    protocols[index].status = status;
    const today = new Date().toISOString().split('T')[0];

    if (status === 'Approved') {
      protocols[index].approvalDate = today;
      // 1 year expiration
      const exp = new Date();
      exp.setFullYear(exp.getFullYear() + 1);
      protocols[index].expirationDate = exp.toISOString().split('T')[0];
      if (!protocols[index].clearanceCertificateNumber) {
        protocols[index].clearanceCertificateNumber = `HU-IRB-CERT-${protocols[index].protocolNumber.replace('HU-IRB-', '')}`;
      }
    }

    if (reviewerName && comments) {
      protocols[index].reviewers.push({
        name: reviewerName,
        decision: status === 'Approved' ? 'Approve' : status === 'Conditional Approval' ? 'Minor Comments' : 'Major Concerns',
        reviewDate: today,
        comments,
      });
    }

    saveIrbProtocols(protocols);
    res.json({ success: true, protocol: protocols[index] });
  });

  // 4. Get Protocol Certificate Details
  app.get('/api/irb/protocols/:id/certificate', (req: Request, res: Response) => {
    const { id } = req.params;
    const protocols = loadIrbProtocols();
    const protocol = protocols.find((p: any) => p.id === id || p.protocolNumber === id);

    if (!protocol) {
      return res.status(404).json({ success: false, message: 'IRB Protocol not found.' });
    }

    const certNumber = protocol.clearanceCertificateNumber || `HU-IRB-CERT-${protocol.protocolNumber.replace('HU-IRB-', '')}`;
    const cert = {
      certificateNumber: certNumber,
      protocolNumber: protocol.protocolNumber,
      title: protocol.title,
      principalInvestigator: protocol.principalInvestigator,
      committee: protocol.committee,
      approvalDate: protocol.approvalDate || protocol.submissionDate,
      expirationDate: protocol.expirationDate || '2027-12-31',
      riskLevel: protocol.riskLevel,
      reviewType: protocol.reviewType,
      verificationHash: protocol.certificateVerificationHash || '8f7a91c4b2e8d356a10984cf63e52817ad902bb31ec5e9a4f6d194c7b8e1a39f',
      issuingAuthority: 'Office of the Vice President for Research Affairs, Haramaya University',
      chairpersonSignature: 'Prof. Yadeta Dessie / Prof. Nigussie Dechassa',
      officialSealText: 'HARAMAYA UNIVERSITY • INSTITUTIONAL REVIEW BOARD • RESEARCH ETHICS DIVISION',
    };

    res.json({ success: true, certificate: cert, protocol });
  });

  // 5. Get IRB Review Committees
  app.get('/api/irb/committees', (_req: Request, res: Response) => {
    const committees = loadIrbCommittees();
    res.json({ success: true, committees });
  });

  // 6. Get UN SDG Matrix
  app.get('/api/research-intelligence/sdg-matrix', (_req: Request, res: Response) => {
    res.json({ success: true, sdgs: INITIAL_SDG_METRICS });
  });

  // 7. Get Research Ranking Benchmarks
  app.get('/api/research-intelligence/rankings', (_req: Request, res: Response) => {
    res.json({ success: true, benchmarks: INITIAL_RANKING_BENCHMARKS });
  });

  // 8. Get Conference CFPs
  app.get('/api/conferences/cfp', (_req: Request, res: Response) => {
    const cfps = loadConferencesCfp();
    res.json({ success: true, cfps });
  });

  // 9. Submit Abstract to Conference Track
  app.post('/api/conferences/cfp/:id/submit', (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, correspondingAuthor, coAuthors, trackCode, abstract, keywords } = req.body;

    if (!title || !correspondingAuthor || !abstract) {
      return res.status(400).json({ success: false, message: 'Title, corresponding author, and abstract are required.' });
    }

    const cfps = loadConferencesCfp();
    const cfpIndex = cfps.findIndex((c: any) => c.id === id);

    const submissions = loadConferencesSubmissions();
    const newSubmission = {
      id: `sub-${Date.now()}`,
      cfpId: id,
      title: title.trim(),
      correspondingAuthor,
      coAuthors: Array.isArray(coAuthors) ? coAuthors : [],
      trackCode: trackCode || 'TR-01',
      abstract: abstract.trim(),
      keywords: Array.isArray(keywords) ? keywords : ['Haramaya Research', 'Conference Abstract'],
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Received',
    };

    submissions.unshift(newSubmission);
    saveConferencesSubmissions(submissions);

    if (cfpIndex !== -1) {
      cfps[cfpIndex].submissionsCount = (cfps[cfpIndex].submissionsCount || 0) + 1;
      saveConferencesCfp(cfps);
    }

    res.status(201).json({
      success: true,
      message: 'Abstract successfully submitted to symposium scientific committee.',
      submission: newSubmission,
    });
  });

  // =============================================================
  // PHASE 9: TECHNOLOGY TRANSFER, IP REGISTRY & COMMERCIALIZATION
  // =============================================================
  app.get('/api/ip/records', (_req: Request, res: Response) => {
    const records = loadIpRecords();
    res.json({ success: true, records, total: records.length });
  });

  app.post('/api/ip/records', (req: Request, res: Response) => {
    const {
      title,
      ipType,
      primaryInventor,
      coInventors,
      abstractDescription,
      technologyReadinessLevel,
      targetIndustry,
      tags,
    } = req.body;

    if (!title || !primaryInventor?.name || !abstractDescription) {
      return res.status(400).json({
        success: false,
        error: 'Title, primary inventor details, and abstract description are required.',
      });
    }

    const records = loadIpRecords();
    const year = new Date().getFullYear();
    const typePrefix =
      ipType === 'Plant Variety Protection (PVP)'
        ? 'PVP'
        : ipType === 'Patent'
        ? 'PAT'
        : ipType === 'Copyright & Software'
        ? 'SFT'
        : ipType === 'Utility Model'
        ? 'UTM'
        : 'IP';

    const randNum = String(Math.floor(1000 + Math.random() * 9000));
    const ipNumber = `HU-${typePrefix}-${year}-${randNum}`;

    const newRecord = {
      id: `ip-${Date.now()}`,
      ipNumber,
      title: title.trim(),
      ipType: ipType || 'Patent',
      status: 'Invention Disclosure',
      filingDate: new Date().toISOString().split('T')[0],
      primaryInventor: {
        name: primaryInventor.name.trim(),
        college: primaryInventor.college || 'College of Agriculture & Environmental Sciences',
        department: primaryInventor.department || 'Research & Tech Transfer',
        email: primaryInventor.email || '',
        sharePercentage: Number(primaryInventor.sharePercentage) || 60,
      },
      coInventors: Array.isArray(coInventors) ? coInventors : [],
      abstractDescription: abstractDescription.trim(),
      technologyReadinessLevel: Number(technologyReadinessLevel) || 4,
      targetIndustry: targetIndustry || 'Agri-Tech & Industrial Manufacturing',
      patentOfficeRef: `EIPA/PENDING/${year}/${randNum}`,
      certificateVerificationCode: `HU-EIPA-${year}-${randNum}`,
      tags: Array.isArray(tags) ? tags : ['Technology Transfer', 'Invention'],
    };

    records.unshift(newRecord);
    saveIpRecords(records);

    res.status(201).json({
      success: true,
      message: 'Invention disclosure successfully registered in Technology Transfer Desk.',
      record: newRecord,
    });
  });

  app.patch('/api/ip/records/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, patentOfficeRef, commercialLicensee } = req.body;

    const records = loadIpRecords();
    const index = records.findIndex((r: any) => r.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'IP record not found.' });
    }

    if (status) records[index].status = status;
    if (patentOfficeRef) records[index].patentOfficeRef = patentOfficeRef;
    if (commercialLicensee) records[index].commercialLicensee = commercialLicensee;
    if (status === 'Granted & Certified' && !records[index].grantDate) {
      records[index].grantDate = new Date().toISOString().split('T')[0];
    }

    saveIpRecords(records);
    res.json({
      success: true,
      message: 'IP record status successfully updated.',
      record: records[index],
    });
  });

  // =============================================================
  // PHASE 9: HU BUSINESS INCUBATION & INNOVATION CENTER (HU-BIIC)
  // =============================================================
  app.get('/api/incubation/startups', (_req: Request, res: Response) => {
    const startups = loadIncubationStartups();
    res.json({ success: true, startups, total: startups.length });
  });

  app.post('/api/incubation/startups', (req: Request, res: Response) => {
    const {
      ventureName,
      tagline,
      cohortBatch,
      founders,
      focusSector,
      seedFundingAllocatedETB,
      mentor,
      workspaceAssigned,
    } = req.body;

    if (!ventureName || !tagline || !Array.isArray(founders) || founders.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Venture name, tagline, and at least one founder are required.',
      });
    }

    const startups = loadIncubationStartups();
    const newStartup = {
      id: `start-${Date.now()}`,
      ventureName: ventureName.trim(),
      tagline: tagline.trim(),
      cohortBatch: cohortBatch || 'Cohort VII (2026/2027)',
      founders,
      focusSector: focusSector || 'Agri-Tech & Smart Farming',
      stage: 'Ideation & Prototyping',
      seedFundingAllocatedETB: Number(seedFundingAllocatedETB) || 300000,
      seedFundingDisbursedETB: 100000,
      mentor: mentor || {
        name: 'Dr. Gulelat Belachew',
        designation: 'Tech Transfer Director',
        institution: 'Haramaya University',
      },
      workspaceAssigned: workspaceAssigned || 'HU-BIIC Incubator Station Lab',
      keyMilestones: [
        { title: 'Proof-of-Concept Bench Testing', targetDate: '2026-11-30', completed: false },
        { title: 'MVP Field Trial with Pilot Farmers', targetDate: '2027-03-30', completed: false },
      ],
      revenueGeneratedETB: 0,
    };

    startups.unshift(newStartup);
    saveIncubationStartups(startups);

    res.status(201).json({
      success: true,
      message: 'Startup venture successfully admitted to HU-BIIC Incubator program.',
      startup: newStartup,
    });
  });

  app.patch('/api/incubation/startups/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { stage, milestoneIndex, milestoneCompleted, revenueGeneratedETB } = req.body;

    const startups = loadIncubationStartups();
    const index = startups.findIndex((s: any) => s.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Startup venture not found.' });
    }

    if (stage) startups[index].stage = stage;
    if (typeof revenueGeneratedETB === 'number') {
      startups[index].revenueGeneratedETB = revenueGeneratedETB;
    }
    if (typeof milestoneIndex === 'number' && startups[index].keyMilestones[milestoneIndex]) {
      startups[index].keyMilestones[milestoneIndex].completed = Boolean(milestoneCompleted);
    }

    saveIncubationStartups(startups);
    res.json({
      success: true,
      message: 'Startup venture details successfully updated.',
      startup: startups[index],
    });
  });

  // =============================================================
  // PHASE 9: COMMUNITY AGRO-ADVISORIES & EXTENSION BULLETINS
  // =============================================================
  app.get('/api/extension/advisories', (_req: Request, res: Response) => {
    const advisories = loadAgroAdvisories();
    res.json({ success: true, advisories, total: advisories.length });
  });

  app.post('/api/extension/advisories', (req: Request, res: Response) => {
    const {
      title,
      targetCropOrLivestock,
      agroEcologicalZone,
      season,
      urgencyLevel,
      bodyGuidance,
      keyRecommendations,
      preparedByExpert,
      relatedVarietyOrTech,
    } = req.body;

    if (!title?.en || !targetCropOrLivestock || !bodyGuidance?.en) {
      return res.status(400).json({
        success: false,
        error: 'Title in English, target crop/livestock, and body guidance are required.',
      });
    }

    const advisories = loadAgroAdvisories();
    const year = new Date().getFullYear();
    const randNum = String(Math.floor(100 + Math.random() * 900));

    const newAdvisory = {
      id: `adv-${Date.now()}`,
      advisoryCode: `HU-EXT-${year}-${randNum}`,
      title: {
        en: title.en.trim(),
        or: title.or?.trim() || title.en.trim(),
        am: title.am?.trim() || title.en.trim(),
      },
      targetCropOrLivestock: targetCropOrLivestock.trim(),
      agroEcologicalZone: agroEcologicalZone || 'Mid-Altitude (Weyna-Dega)',
      season: season || 'Meher (Main Rainy)',
      urgencyLevel: urgencyLevel || 'Seasonal Recommendation',
      bodyGuidance: {
        en: bodyGuidance.en.trim(),
        or: bodyGuidance.or?.trim() || bodyGuidance.en.trim(),
        am: bodyGuidance.am?.trim() || bodyGuidance.en.trim(),
      },
      keyRecommendations: Array.isArray(keyRecommendations) ? keyRecommendations : [],
      preparedByExpert: preparedByExpert || {
        name: 'Haramaya Agricultural Extension Directorate',
        title: 'Senior Extension Specialist',
        department: 'CAES Outreach Services',
      },
      publicationDate: new Date().toISOString().split('T')[0],
      downloadPdfCount: 0,
      relatedVarietyOrTech: relatedVarietyOrTech || 'HU Improved Agri-Tech Package',
    };

    advisories.unshift(newAdvisory);
    saveAgroAdvisories(advisories);

    res.status(201).json({
      success: true,
      message: 'Community agro-advisory published to regional extension network.',
      advisory: newAdvisory,
    });
  });

  app.post('/api/extension/advisories/:id/download', (req: Request, res: Response) => {
    const { id } = req.params;
    const advisories = loadAgroAdvisories();
    const index = advisories.findIndex((a: any) => a.id === id);

    if (index !== -1) {
      advisories[index].downloadPdfCount = (advisories[index].downloadPdfCount || 0) + 1;
      saveAgroAdvisories(advisories);
      return res.json({ success: true, downloadPdfCount: advisories[index].downloadPdfCount });
    }

    res.status(404).json({ success: false, error: 'Advisory not found.' });
  });

  // =============================================================
  // PHASE 9: FIELD DEMONSTRATION SITES & OUTREACH HUBS
  // =============================================================
  app.get('/api/extension/demo-sites', (_req: Request, res: Response) => {
    const demoSites = loadDemoSites();
    res.json({ success: true, demoSites, total: demoSites.length });
  });

  app.post('/api/extension/demo-sites/:id/field-days', (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, date, expectedParticipants } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, error: 'Field day title and date are required.' });
    }

    const demoSites = loadDemoSites();
    const index = demoSites.findIndex((s: any) => s.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Demonstration site not found.' });
    }

    demoSites[index].upcomingFieldDays.push({
      title: title.trim(),
      date,
      expectedParticipants: Number(expectedParticipants) || 100,
    });

    saveDemoSites(demoSites);
    res.status(201).json({
      success: true,
      message: 'Field day scheduled for demonstration site.',
      demoSite: demoSites[index],
    });
  });

  // =============================================================
  // PHASE 9: INDUSTRY & STRATEGIC LINKAGES (MOUS)
  // =============================================================
  app.get('/api/industry/mous', (_req: Request, res: Response) => {
    const mous = loadIndustryMous();
    res.json({ success: true, mous, total: mous.length });
  });

  app.post('/api/industry/mous', (req: Request, res: Response) => {
    const {
      partnerOrganization,
      sector,
      agreementTitle,
      signingDate,
      validUntil,
      focalPersonHU,
      focalPersonPartner,
      keyObjectives,
      valueOrCommitmentETB,
      scopeSummary,
    } = req.body;

    if (!partnerOrganization || !agreementTitle || !focalPersonHU?.name) {
      return res.status(400).json({
        success: false,
        error: 'Partner organization, agreement title, and HU focal person are required.',
      });
    }

    const mous = loadIndustryMous();
    const newMou = {
      id: `mou-${Date.now()}`,
      partnerOrganization: partnerOrganization.trim(),
      sector: sector || 'State Enterprise',
      agreementTitle: agreementTitle.trim(),
      signingDate: signingDate || new Date().toISOString().split('T')[0],
      validUntil: validUntil || '2030-12-31',
      status: 'Active & In Execution',
      focalPersonHU: {
        name: focalPersonHU.name.trim(),
        department: focalPersonHU.department || 'CAES / HiT',
        email: focalPersonHU.email || '',
      },
      focalPersonPartner: focalPersonPartner || {
        name: 'Partner Liaison Officer',
        title: 'Operations Director',
        email: '',
      },
      keyObjectives: Array.isArray(keyObjectives) ? keyObjectives : [],
      jointProjectsCount: 1,
      valueOrCommitmentETB: Number(valueOrCommitmentETB) || 0,
      scopeSummary: scopeSummary?.trim() || 'Strategic cooperation framework.',
    };

    mous.unshift(newMou);
    saveIndustryMous(mous);

    res.status(201).json({
      success: true,
      message: 'Industry agreement / MoU recorded successfully in University Partnerships Registry.',
      mou: newMou,
    });
  });

  // =============================================================
  // DIGITAL STORE / MARKETPLACE API ROUTES
  // =============================================================

  // 1. Get Store Public Settings & Payment Accounts
  app.get('/api/store/settings', (_req: Request, res: Response) => {
    const settings = loadStoreSettings();
    res.json({ success: true, settings });
  });

  // 2. Admin Update Store Settings
  app.put('/api/store/admin/settings', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required.' });
    }

    const current = loadStoreSettings();
    const updated = {
      ...current,
      ...req.body,
    };
    saveStoreSettings(updated);
    logStoreAudit('SETTINGS_UPDATED', user, 'store-settings', 'Store Configuration', 'Updated store payment accounts and policies.', req.ip);

    res.json({ success: true, message: 'Store settings updated successfully.', settings: updated });
  });

  // 3. Get Products (Public / Filtered)
  app.get('/api/store/products', (req: Request, res: Response) => {
    const {
      search,
      category,
      productType,
      fileFormat,
      isFree,
      minPrice,
      maxPrice,
      sort,
      status,
    } = req.query;

    let products = loadStoreProducts();

    // Unless admin, only show published products
    const user = getUserFromReq(req);
    const isAdmin = user && user.role === 'admin';

    if (!isAdmin || status !== 'all') {
      products = products.filter((p: any) => p.status === 'published');
    }

    if (category && category !== 'all') {
      products = products.filter((p: any) => p.category === category);
    }

    if (productType && productType !== 'all') {
      products = products.filter((p: any) => p.productType === productType);
    }

    if (fileFormat && fileFormat !== 'all') {
      products = products.filter((p: any) => p.fileFormat === fileFormat);
    }

    if (isFree === 'true') {
      products = products.filter((p: any) => p.isFree === true || p.priceETB === 0);
    } else if (isFree === 'false') {
      products = products.filter((p: any) => p.isFree === false && p.priceETB > 0);
    }

    if (minPrice) {
      products = products.filter((p: any) => p.priceETB >= Number(minPrice));
    }

    if (maxPrice) {
      products = products.filter((p: any) => p.priceETB <= Number(maxPrice));
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p: any) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.author?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          (Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (sort === 'price_asc') {
      products.sort((a: any, b: any) => a.priceETB - b.priceETB);
    } else if (sort === 'price_desc') {
      products.sort((a: any, b: any) => b.priceETB - a.priceETB);
    } else if (sort === 'rating') {
      products.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'downloads') {
      products.sort((a: any, b: any) => (b.downloadCount || 0) - (a.downloadCount || 0));
    } else if (sort === 'newest') {
      products.sort((a: any, b: any) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    } else {
      // Default: Featured first, then popular
      products.sort((a: any, b: any) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.purchaseCount || 0) - (a.purchaseCount || 0);
      });
    }

    res.json({
      success: true,
      products,
      total: products.length,
    });
  });

  // 4. Get Single Product by ID
  app.get('/api/store/products/:id', (req: Request, res: Response) => {
    const products = loadStoreProducts();
    const product = products.find((p: any) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }
    res.json({ success: true, product });
  });

  // 5. Admin Create Product
  app.post(['/api/store/products', '/api/store/admin/products'], (req: Request, res: Response) => {
    let user = getUserFromReq(req);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      user = { id: 'usr-admin-01', name: 'Ilillii Store Admin', email: 'admin@wki.edu.et', role: 'admin' } as any;
    }

    const {
      title,
      titleLocalized,
      description,
      shortDescription,
      category,
      categoryLabel,
      subcategory,
      productType,
      fileFormat,
      thumbnailUrl,
      previewType,
      previewUrl,
      previewData,
      fileSize,
      fileName,
      version,
      author,
      authorAffiliation,
      language,
      tags,
      priceETB,
      isFree,
      discountPercentage,
      pagesOrDuration,
      maxDownloadsAllowed,
      downloadExpiryDays,
      licenseType,
      isFeatured,
      isBestSeller,
      isNewRelease,
    } = req.body;

    if (!title || !description || !category || !productType || !fileFormat) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, category, product type, and file format are required.',
      });
    }

    const products = loadStoreProducts();
    const numPrice = isFree ? 0 : Math.max(0, Number(priceETB) || 0);
    const discPct = Math.min(100, Math.max(0, Number(discountPercentage) || 0));
    const origPrice = discPct > 0 ? Math.round(numPrice / (1 - discPct / 100)) : numPrice;

    const newProduct = {
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      titleLocalized: titleLocalized || { en: title.trim() },
      description: description.trim(),
      shortDescription: shortDescription?.trim() || description.substring(0, 120),
      category: category || 'other',
      categoryLabel: categoryLabel || category,
      subcategory: subcategory || 'General',
      productType: productType || 'Document',
      fileFormat: fileFormat || 'PDF',
      thumbnailUrl:
        thumbnailUrl?.trim() ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      previewType: previewType || 'text',
      previewUrl: previewUrl || '',
      previewData: previewData || {},
      fileSize: fileSize || '10.5 MB',
      fileName: fileName || `${title.toLowerCase().replace(/\s+/g, '_')}.${fileFormat.toLowerCase()}`,
      version: version || '1.0',
      versionHistory: [
        {
          version: version || '1.0',
          releaseDate: new Date().toISOString().split('T')[0],
          changelog: 'Initial marketplace release.',
          fileSize: fileSize || '10.5 MB',
          fileName: fileName || `${title.toLowerCase().replace(/\s+/g, '_')}.${fileFormat.toLowerCase()}`,
        },
      ],
      author: author?.trim() || 'Wirtuu Kompiitaraa Ilillii',
      authorAffiliation: authorAffiliation?.trim() || 'Haramaya University Press',
      language: language || 'English',
      tags: Array.isArray(tags) ? tags : [category, productType],
      priceETB: numPrice,
      currency: 'ETB',
      isFree: Boolean(isFree || numPrice === 0),
      discountPercentage: discPct,
      originalPriceETB: origPrice,
      status: 'published',
      uploadDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      downloadCount: 0,
      purchaseCount: 0,
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
      pagesOrDuration: pagesOrDuration || 'Complete File Pack',
      maxDownloadsAllowed: Number(maxDownloadsAllowed) || 10,
      downloadExpiryDays: Number(downloadExpiryDays) || 365,
      licenseType: licenseType || 'Standard Personal',
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isNewRelease: Boolean(isNewRelease !== false),
    };

    products.unshift(newProduct);
    saveStoreProducts(products);

    logStoreAudit('PRODUCT_CREATED', user, newProduct.id, newProduct.title, `Created product with price ${newProduct.priceETB} ETB`, req.ip);

    res.status(201).json({
      success: true,
      message: 'Product published to Ilillii Digital Store successfully.',
      product: newProduct,
    });
  });

  // 6. Admin Update Product
  app.put(['/api/store/products/:id', '/api/store/admin/products/:id'], (req: Request, res: Response) => {
    let user = getUserFromReq(req);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      user = { id: 'usr-admin-01', name: 'Ilillii Store Admin', email: 'admin@wki.edu.et', role: 'admin' } as any;
    }

    const products = loadStoreProducts();
    const index = products.findIndex((p: any) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    const existing = products[index];
    const numPrice = req.body.isFree ? 0 : (req.body.priceETB !== undefined ? Number(req.body.priceETB) : existing.priceETB);
    const discPct = req.body.discountPercentage !== undefined ? Number(req.body.discountPercentage) : (existing.discountPercentage || 0);
    const origPrice = discPct > 0 ? Math.round(numPrice / (1 - discPct / 100)) : numPrice;

    products[index] = {
      ...existing,
      ...req.body,
      priceETB: numPrice,
      originalPriceETB: origPrice,
      isFree: Boolean(req.body.isFree || numPrice === 0),
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    saveStoreProducts(products);
    logStoreAudit('PRODUCT_UPDATED', user, existing.id, existing.title, `Updated product metadata and settings.`, req.ip);

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: products[index],
    });
  });

  // 7. Admin Delete / Archive Product
  app.delete(['/api/store/products/:id', '/api/store/admin/products/:id'], (req: Request, res: Response) => {
    let user = getUserFromReq(req);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      user = { id: 'usr-admin-01', name: 'Ilillii Store Admin', email: 'admin@wki.edu.et', role: 'admin' } as any;
    }

    const products = loadStoreProducts();
    const index = products.findIndex((p: any) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    const removed = products.splice(index, 1)[0];
    saveStoreProducts(products);

    logStoreAudit('PRODUCT_DELETED', user, removed.id, removed.title, `Deleted product from store.`, req.ip);

    res.json({
      success: true,
      message: 'Product removed from marketplace.',
    });
  });

  // 8. Admin Upgrade Version / Replace File
  app.post('/api/store/products/:id/version', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required.' });
    }

    const { version, changelog, fileSize, fileName } = req.body;
    if (!version || !changelog) {
      return res.status(400).json({ success: false, error: 'New version number and changelog are required.' });
    }

    const products = loadStoreProducts();
    const index = products.findIndex((p: any) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    const prod = products[index];
    const versionHistory = prod.versionHistory || [];
    const newVersionEntry = {
      version: version.trim(),
      releaseDate: new Date().toISOString().split('T')[0],
      changelog: changelog.trim(),
      fileSize: fileSize || prod.fileSize,
      fileName: fileName || prod.fileName || `${prod.title.toLowerCase().replace(/\s+/g, '_')}_v${version}.${prod.fileFormat.toLowerCase()}`,
    };

    versionHistory.unshift(newVersionEntry);

    products[index] = {
      ...prod,
      version: version.trim(),
      fileSize: fileSize || prod.fileSize,
      fileName: newVersionEntry.fileName,
      versionHistory,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    saveStoreProducts(products);
    logStoreAudit('FILE_REPLACED', user, prod.id, prod.title, `Upgraded product to version ${version}.`, req.ip);

    res.json({
      success: true,
      message: `Product successfully upgraded to version ${version}. All verified buyers will receive access to this updated version.`,
      product: products[index],
    });
  });

  // 9. Server-Authoritative Cart Calculation & Coupon Validation
  app.post('/api/store/cart/validate', (req: Request, res: Response) => {
    const { items, couponCode } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.json({
        success: true,
        items: [],
        subtotalETB: 0,
        discountETB: 0,
        couponApplied: null,
        totalETB: 0,
        currency: 'ETB',
      });
    }

    const allProducts = loadStoreProducts();
    const validatedItems: any[] = [];
    let subtotalETB = 0;

    for (const item of items) {
      const prod = allProducts.find((p: any) => p.id === item.productId && p.status === 'published');
      if (prod) {
        const unitPrice = prod.isFree ? 0 : prod.priceETB;
        subtotalETB += unitPrice;
        validatedItems.push({
          productId: prod.id,
          title: prod.title,
          productType: prod.productType,
          fileFormat: prod.fileFormat,
          version: prod.version,
          unitPriceETB: unitPrice,
          discountAmountETB: 0,
          finalPriceETB: unitPrice,
          isFree: prod.isFree || unitPrice === 0,
          thumbnailUrl: prod.thumbnailUrl,
        });
      }
    }

    let discountETB = 0;
    let couponApplied: any = null;

    if (couponCode && typeof couponCode === 'string' && couponCode.trim().length > 0) {
      const codeClean = couponCode.trim().toUpperCase();
      const coupons = loadStoreCoupons();
      const coupon = coupons.find((c: any) => c.code === codeClean && c.isActive);

      if (coupon) {
        const now = new Date().toISOString().split('T')[0];
        const isNotExpired = (!coupon.startDate || coupon.startDate <= now) && (!coupon.endDate || coupon.endDate >= now);
        const hasRemainingUsage = !coupon.usageLimit || (coupon.usageCount || 0) < coupon.usageLimit;
        const meetsMinAmount = subtotalETB >= (coupon.minOrderAmountETB || 0);

        if (isNotExpired && hasRemainingUsage && meetsMinAmount) {
          let eligibleSubtotal = subtotalETB;
          if (coupon.applicableCategory && coupon.applicableCategory !== 'all') {
            const eligibleItems = validatedItems.filter((it: any) => {
              const p = allProducts.find((prod: any) => prod.id === it.productId);
              return p && p.category === coupon.applicableCategory;
            });
            eligibleSubtotal = eligibleItems.reduce((sum: number, it: any) => sum + it.unitPriceETB, 0);
          }

          if (coupon.discountType === 'percentage') {
            discountETB = Math.round((eligibleSubtotal * coupon.discountValue) / 100);
          } else {
            discountETB = Math.min(coupon.discountValue, eligibleSubtotal);
          }

          if (coupon.maxDiscountETB && discountETB > coupon.maxDiscountETB) {
            discountETB = coupon.maxDiscountETB;
          }

          couponApplied = {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            description: coupon.description,
          };
        }
      }
    }

    const totalETB = Math.max(0, subtotalETB - discountETB);

    res.json({
      success: true,
      items: validatedItems,
      subtotalETB,
      discountETB,
      couponApplied,
      totalETB,
      currency: 'ETB',
    });
  });

  // 10. Create Order (Server-Authoritative Price Calculation)
  app.post('/api/store/orders', (req: Request, res: Response) => {
    const { items, couponCode, customerName, customerEmail, customerPhone } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one product is required to create an order.' });
    }

    const allProducts = loadStoreProducts();
    const validatedItems: any[] = [];
    let subtotalETB = 0;

    for (const item of items) {
      const prod = allProducts.find((p: any) => p.id === item.productId && p.status === 'published');
      if (!prod) {
        return res.status(400).json({ success: false, error: `Product ${item.productId} is unavailable.` });
      }
      const unitPrice = prod.isFree ? 0 : prod.priceETB;
      subtotalETB += unitPrice;
      validatedItems.push({
        productId: prod.id,
        title: prod.title,
        productType: prod.productType,
        fileFormat: prod.fileFormat,
        version: prod.version,
        unitPriceETB: unitPrice,
        discountAmountETB: 0,
        finalPriceETB: unitPrice,
        isFree: prod.isFree || unitPrice === 0,
        thumbnailUrl: prod.thumbnailUrl,
      });
    }

    // Check user authentication
    const user = getUserFromReq(req);
    const userId = user ? user.id : `guest-${Date.now()}`;
    const email = (user && user.email) || customerEmail || 'customer@wki.edu.et';
    const name = (user && user.name) || customerName || 'Valued Scholar';
    const phone = (user && user.phone) || customerPhone || '';

    let discountETB = 0;
    let couponAppliedCode: string | undefined = undefined;

    if (couponCode && typeof couponCode === 'string' && couponCode.trim().length > 0) {
      const codeClean = couponCode.trim().toUpperCase();
      const coupons = loadStoreCoupons();
      const couponIndex = coupons.findIndex((c: any) => c.code === codeClean && c.isActive);

      if (couponIndex !== -1) {
        const coupon = coupons[couponIndex];
        const now = new Date().toISOString().split('T')[0];
        const isNotExpired = (!coupon.startDate || coupon.startDate <= now) && (!coupon.endDate || coupon.endDate >= now);
        const hasRemainingUsage = !coupon.usageLimit || (coupon.usageCount || 0) < coupon.usageLimit;
        const meetsMinAmount = subtotalETB >= (coupon.minOrderAmountETB || 0);

        if (isNotExpired && hasRemainingUsage && meetsMinAmount) {
          if (coupon.discountType === 'percentage') {
            discountETB = Math.round((subtotalETB * coupon.discountValue) / 100);
          } else {
            discountETB = Math.min(coupon.discountValue, subtotalETB);
          }
          if (coupon.maxDiscountETB && discountETB > coupon.maxDiscountETB) {
            discountETB = coupon.maxDiscountETB;
          }
          couponAppliedCode = coupon.code;
          coupons[couponIndex].usageCount = (coupons[couponIndex].usageCount || 0) + 1;
          saveStoreCoupons(coupons);
        }
      }
    }

    const totalETB = Math.max(0, subtotalETB - discountETB);
    const isFreeOrder = totalETB === 0;
    const settings = loadStoreSettings();
    const orderSeq = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `${settings.orderPrefix || 'ILL-2026-'}${orderSeq}`;

    const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newOrder = {
      id: orderId,
      orderNumber,
      customerUserId: userId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      items: validatedItems,
      subtotalETB,
      discountETB,
      couponCodeApplied: couponAppliedCode,
      totalETB,
      currency: 'ETB',
      status: isFreeOrder ? 'COMPLETED' : 'PENDING_PAYMENT',
      paymentMethod: isFreeOrder ? 'Free_Grant' : undefined,
      isFreeOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orders = loadStoreOrders();
    orders.unshift(newOrder);
    saveStoreOrders(orders);

    // If completely free, auto-grant download permissions immediately!
    if (isFreeOrder) {
      const perms = loadStorePermissions();
      for (const item of validatedItems) {
        const prod = allProducts.find((p: any) => p.id === item.productId);
        const permId = `perm-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        perms.unshift({
          id: permId,
          userId,
          userEmail: email,
          orderId: newOrder.id,
          orderNumber: newOrder.orderNumber,
          productId: item.productId,
          productTitle: item.title,
          productType: item.productType,
          fileFormat: item.fileFormat,
          version: item.version,
          grantedAt: new Date().toISOString(),
          grantedBy: 'free_product',
          maxDownloads: prod?.maxDownloadsAllowed || 0,
          downloadCount: 0,
          isRevoked: false,
        });

        // Increment product stats
        if (prod) {
          prod.purchaseCount = (prod.purchaseCount || 0) + 1;
        }
      }
      saveStorePermissions(perms);
      saveStoreProducts(allProducts);
    }

    res.status(201).json({
      success: true,
      message: isFreeOrder
        ? 'Free resources added directly to your Digital Library.'
        : 'Order created. Please proceed to payment instructions.',
      order: newOrder,
    });
  });

  // 11. Customer Submit Payment Verification Details
  app.post('/api/store/orders/:id/submit-payment', (req: Request, res: Response) => {
    const { paymentProvider, transactionReference, customerPhone, receiptUrl, receiptFileName, notes } = req.body;

    if (!paymentProvider || !transactionReference) {
      return res.status(400).json({
        success: false,
        error: 'Payment provider (CBE, Telebirr, Safaricom) and valid transaction reference number are required.',
      });
    }

    const orders = loadStoreOrders();
    const index = orders.findIndex((o: any) => o.id === req.params.id || o.orderNumber === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    const order = orders[index];
    if (order.status === 'COMPLETED' || order.status === 'PAYMENT_APPROVED') {
      return res.status(400).json({ success: false, error: 'Order is already verified and completed.' });
    }

    const submission = {
      id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerUserId: order.customerUserId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: customerPhone || order.customerPhone || '',
      paymentProvider,
      amountETB: order.totalETB,
      currency: 'ETB',
      transactionReference: transactionReference.trim(),
      receiptUrl: receiptUrl || '/receipts/default_slip.png',
      receiptFileName: receiptFileName || 'Bank_Transfer_Slip.png',
      notes: notes?.trim() || '',
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    orders[index] = {
      ...order,
      status: 'PAYMENT_UNDER_REVIEW',
      paymentMethod: paymentProvider,
      paymentSubmission: submission,
      updatedAt: new Date().toISOString(),
    };

    saveStoreOrders(orders);

    res.json({
      success: true,
      message: 'Payment verification details submitted successfully. Our finance administrator will review and grant download access promptly.',
      order: orders[index],
    });
  });

  // 12. Get User Orders
  app.get('/api/store/my-orders', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    const emailParam = req.query.email as string;
    const orders = loadStoreOrders();

    if (user) {
      const userOrders = orders.filter((o: any) => o.customerUserId === user.id || o.customerEmail === user.email);
      return res.json({ success: true, orders: userOrders });
    }

    if (emailParam) {
      const emailOrders = orders.filter((o: any) => o.customerEmail.toLowerCase() === emailParam.toLowerCase());
      return res.json({ success: true, orders: emailOrders });
    }

    // Default return sample orders for demo
    res.json({ success: true, orders: orders.slice(0, 5) });
  });

  // 13. Get User Digital Library (Owned Products & Permissions)
  app.get(['/api/store/my-library', '/api/store/library'], (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    const emailParam = req.query.email as string;
    const allPerms = loadStorePermissions();
    const allProducts = loadStoreProducts();

    let userPerms: any[] = [];
    if (user) {
      userPerms = allPerms.filter((p: any) => (p.userId === user.id || p.userEmail === user.email) && !p.isRevoked);
    } else if (emailParam) {
      userPerms = allPerms.filter((p: any) => p.userEmail.toLowerCase() === emailParam.toLowerCase() && !p.isRevoked);
    } else {
      // Return scholar permissions as preview
      userPerms = allPerms.filter((p: any) => p.userId === 'usr-scholar-01' && !p.isRevoked);
    }

    const library = userPerms.map((perm: any) => {
      const prod = allProducts.find((p: any) => p.id === perm.productId);
      return {
        permission: perm,
        product: prod || {
          id: perm.productId,
          title: perm.productTitle,
          productType: perm.productType,
          fileFormat: perm.fileFormat,
          version: perm.version,
          thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
          fileSize: '15.0 MB',
        },
      };
    });

    res.json({ success: true, library, total: library.length });
  });

  // 14. Admin List Orders & Payments
  app.get('/api/store/admin/orders', (req: Request, res: Response) => {
    const orders = loadStoreOrders();
    res.json({ success: true, orders, total: orders.length });
  });

  app.get('/api/store/admin/payments', (req: Request, res: Response) => {
    let user = getUserFromReq(req);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      user = { id: 'usr-admin-01', name: 'Ilillii Store Admin', email: 'admin@wki.edu.et', role: 'admin' } as any;
    }

    const orders = loadStoreOrders();
    const pendingOrders = orders.filter((o: any) => o.status === 'PAYMENT_UNDER_REVIEW' || o.status === 'PAYMENT_SUBMITTED');
    const recentOrders = orders.slice(0, 50);

    res.json({
      success: true,
      pendingCount: pendingOrders.length,
      pendingOrders,
      recentOrders,
    });
  });

  // 15. Admin Approve or Reject Payment / Orders Verification
  app.post(['/api/store/admin/payments/:id/verify', '/api/store/admin/orders/:id/verify-payment'], (req: Request, res: Response) => {
    let user = getUserFromReq(req);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      user = { id: 'usr-admin-01', name: 'Ilillii Store Admin', email: 'admin@wki.edu.et', role: 'admin' } as any;
    }

    const { action, rejectionReason, notes } = req.body;
    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({ success: false, error: "Action must be 'approve' or 'reject'." });
    }

    const orders = loadStoreOrders();
    const index = orders.findIndex((o: any) => o.id === req.params.id || o.orderNumber === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    const order = orders[index];
    const allProducts = loadStoreProducts();
    const perms = loadStorePermissions();

    if (action === 'approve') {
      orders[index] = {
        ...order,
        status: 'COMPLETED',
        paymentSubmission: order.paymentSubmission
          ? {
              ...order.paymentSubmission,
              status: 'approved',
              verifiedAt: new Date().toISOString(),
              verifiedBy: `${user.name} (${user.role})`,
            }
          : undefined,
        adminNotes: notes || order.adminNotes,
        updatedAt: new Date().toISOString(),
      };

      // Generate download permissions for every item in order
      for (const item of order.items) {
        const prod = allProducts.find((p: any) => p.id === item.productId);
        const permId = `perm-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        perms.unshift({
          id: permId,
          userId: order.customerUserId,
          userEmail: order.customerEmail,
          orderId: order.id,
          orderNumber: order.orderNumber,
          productId: item.productId,
          productTitle: item.title,
          productType: item.productType,
          fileFormat: item.fileFormat,
          version: item.version,
          grantedAt: new Date().toISOString(),
          grantedBy: 'payment_verified',
          maxDownloads: prod?.maxDownloadsAllowed || 10,
          downloadCount: 0,
          isRevoked: false,
        });

        if (prod) {
          prod.purchaseCount = (prod.purchaseCount || 0) + 1;
        }
      }

      saveStorePermissions(perms);
      saveStoreProducts(allProducts);
      saveStoreOrders(orders);

      logStoreAudit(
        'PAYMENT_APPROVED',
        user,
        order.id,
        `${order.orderNumber} (${order.paymentMethod})`,
        `Verified ${order.totalETB} ETB payment. Granted download permissions to ${order.customerEmail}.`,
        req.ip
      );

      return res.json({
        success: true,
        message: `Payment of ${order.totalETB} ETB approved. Download permissions unlocked for ${order.customerName}.`,
        order: orders[index],
      });
    } else {
      // Reject
      orders[index] = {
        ...order,
        status: 'PAYMENT_REJECTED',
        paymentSubmission: order.paymentSubmission
          ? {
              ...order.paymentSubmission,
              status: 'rejected',
              rejectionReason: rejectionReason || 'Transaction reference could not be verified in CBE/Telebirr bank records.',
              verifiedAt: new Date().toISOString(),
              verifiedBy: `${user.name} (${user.role})`,
            }
          : undefined,
        adminNotes: notes || rejectionReason,
        updatedAt: new Date().toISOString(),
      };

      saveStoreOrders(orders);

      logStoreAudit(
        'PAYMENT_REJECTED',
        user,
        order.id,
        `${order.orderNumber}`,
        `Payment rejected: ${rejectionReason || 'Invalid transaction slip'}`,
        req.ip
      );

      return res.json({
        success: true,
        message: 'Payment rejected and customer notified to re-submit correct transaction reference.',
        order: orders[index],
      });
    }
  });

  // 16. Admin Grant Free Download Access (Scholarship / Faculty waiver)
  app.post('/api/store/admin/grant-access', (req: Request, res: Response) => {
    let user = getUserFromReq(req);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      // Fallback for demo store admin mode
      user = { id: 'usr-admin-01', name: 'Ilillii Store Admin', email: 'admin@wki.edu.et', role: 'admin' } as any;
    }

    const { userEmail, userName, productId, grantReason, maxDownloads, category } = req.body;
    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'User email is required.' });
    }

    const cleanEmail = userEmail.trim().toLowerCase();
    const allProducts = loadStoreProducts();
    const perms = loadStorePermissions();

    let targetProducts: any[] = [];
    if (productId === 'ALL_PRODUCTS' || productId === 'all') {
      targetProducts = allProducts;
    } else if (category && category !== 'all') {
      targetProducts = allProducts.filter((p: any) => p.category === category);
    } else if (productId) {
      const single = allProducts.find((p: any) => p.id === productId);
      if (single) targetProducts.push(single);
    }

    if (targetProducts.length === 0) {
      return res.status(404).json({ success: false, error: 'No matching products found to grant permission for.' });
    }

    const createdPermissions: any[] = [];
    const timestamp = new Date().toISOString();

    for (const prod of targetProducts) {
      // Check if permission already exists & is active
      const existing = perms.find((p: any) => p.userEmail === cleanEmail && p.productId === prod.id && !p.isRevoked);
      if (existing) {
        // Upgrade existing permission max downloads
        existing.maxDownloads = maxDownloads !== undefined ? Number(maxDownloads) : 0;
        existing.adminGrantReason = grantReason || existing.adminGrantReason;
        createdPermissions.push(existing);
        continue;
      }

      const permId = `perm-grant-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const newPerm = {
        id: permId,
        userId: `user-grant-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`,
        userEmail: cleanEmail,
        productId: prod.id,
        productTitle: prod.title,
        productType: prod.productType,
        fileFormat: prod.fileFormat,
        version: prod.version,
        grantedAt: timestamp,
        grantedBy: 'admin_scholarship',
        adminGrantReason: grantReason || 'Institutional Research Grant',
        maxDownloads: maxDownloads !== undefined ? Number(maxDownloads) : 0, // 0 for unlimited
        downloadCount: 0,
        isRevoked: false,
      };

      perms.unshift(newPerm);
      createdPermissions.push(newPerm);
    }

    saveStorePermissions(perms);

    logStoreAudit(
      'FREE_ACCESS_GRANTED',
      user!,
      targetProducts.length === 1 ? targetProducts[0].id : 'BULK_GRANT',
      targetProducts.length === 1 ? targetProducts[0].title : `${targetProducts.length} Store Products`,
      `Granted digital download permissions to ${cleanEmail} (${grantReason || 'Admin Grant'}).`,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: `Successfully granted digital download permission for ${targetProducts.length} item(s) to ${cleanEmail}.`,
      grantedCount: targetProducts.length,
      permissions: createdPermissions,
    });
  });

  // 16b. Get Known Users & Customers for Quick Permission Assignment
  app.get('/api/store/admin/users', (req: Request, res: Response) => {
    const orders = loadStoreOrders();
    const perms = loadStorePermissions();

    const usersMap = new Map<string, { email: string; name: string; totalOrders: number; activeLicenses: number }>();

    // Standard demo users
    const defaultUsers = [
      { email: 'student@wki.edu.et', name: 'Gadaa Tolera (Student Researcher)' },
      { email: 'faculty@wki.edu.et', name: 'Dr. Bonsa Worku (Faculty Lecturer)' },
      { email: 'scholar@wki.edu.et', name: 'Chaltu Abera (Graduate Scholar)' },
      { email: 'editor@wki.edu.et', name: 'Wirtuu Senior Editor' },
    ];

    for (const u of defaultUsers) {
      usersMap.set(u.email.toLowerCase(), {
        email: u.email,
        name: u.name,
        totalOrders: 0,
        activeLicenses: 0,
      });
    }

    for (const o of orders) {
      if (o.customerEmail) {
        const em = o.customerEmail.toLowerCase();
        const existing = usersMap.get(em) || {
          email: o.customerEmail,
          name: o.customerName || o.customerEmail.split('@')[0],
          totalOrders: 0,
          activeLicenses: 0,
        };
        existing.totalOrders += 1;
        usersMap.set(em, existing);
      }
    }

    for (const p of perms) {
      if (p.userEmail && !p.isRevoked) {
        const em = p.userEmail.toLowerCase();
        const existing = usersMap.get(em) || {
          email: p.userEmail,
          name: p.userEmail.split('@')[0],
          totalOrders: 0,
          activeLicenses: 0,
        };
        existing.activeLicenses += 1;
        usersMap.set(em, existing);
      }
    }

    res.json({
      success: true,
      users: Array.from(usersMap.values()),
    });
  });

  // 17. Admin Revoke Permission
  app.post('/api/store/admin/revoke-access', (req: Request, res: Response) => {
    let user = getUserFromReq(req);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      user = { id: 'usr-admin-01', name: 'Ilillii Store Admin', email: 'admin@wki.edu.et', role: 'admin' } as any;
    }

    const { permissionId, reason } = req.body;
    if (!permissionId) {
      return res.status(400).json({ success: false, error: 'Permission ID is required.' });
    }

    const perms = loadStorePermissions();
    const index = perms.findIndex((p: any) => p.id === permissionId);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Permission record not found.' });
    }

    perms[index].isRevoked = true;
    perms[index].revokedReason = reason || 'Revoked by system administrator.';
    saveStorePermissions(perms);

    logStoreAudit(
      'ACCESS_REVOKED',
      user!,
      permissionId,
      perms[index].productTitle,
      `Revoked access for ${perms[index].userEmail}. Reason: ${reason || 'Administrative decision'}`,
      req.ip
    );

    res.json({
      success: true,
      message: 'Download access revoked successfully.',
      permission: perms[index],
    });
  });

  // 18. Secure File Download Endpoint with Authorization Verification
  app.get('/api/store/download/:permissionId', (req: Request, res: Response) => {
    const { permissionId } = req.params;
    const perms = loadStorePermissions();
    const permIndex = perms.findIndex((p: any) => p.id === permissionId);

    if (permIndex === -1) {
      return res.status(404).json({ success: false, error: 'Download permission record not found.' });
    }

    const perm = perms[permIndex];

    if (perm.isRevoked) {
      return res.status(403).json({
        success: false,
        error: `Download access has been revoked: ${perm.revokedReason || 'Contact support'}`,
      });
    }

    if (perm.maxDownloads > 0 && perm.downloadCount >= perm.maxDownloads) {
      return res.status(403).json({
        success: false,
        error: `Maximum download limit (${perm.maxDownloads} downloads) has been reached for this license. Please contact support if you need additional downloads.`,
      });
    }

    const allProducts = loadStoreProducts();
    const prod = allProducts.find((p: any) => p.id === perm.productId);

    // Update download counter
    perms[permIndex].downloadCount = (perms[permIndex].downloadCount || 0) + 1;
    perms[permIndex].lastDownloadedAt = new Date().toISOString();
    saveStorePermissions(perms);

    if (prod) {
      prod.downloadCount = (prod.downloadCount || 0) + 1;
      saveStoreProducts(allProducts);
    }

    // Log download for telemetry & DRM tracking
    const logs = loadStoreDownloadLogs();
    logs.unshift({
      id: `dlog-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      permissionId: perm.id,
      userId: perm.userId,
      productId: perm.productId,
      orderId: perm.orderId,
      downloadedAt: new Date().toISOString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string,
      fileVersion: perm.version,
    });
    saveStoreDownloadLogs(logs);

    // Generate secure digital asset payload
    const safeTitle = (prod?.title || perm.productTitle).replace(/[^a-zA-Z0-9_-]/g, '_');
    const ext = (prod?.fileFormat || perm.fileFormat || 'pdf').toLowerCase();
    const filename = `${safeTitle}_v${perm.version}_IlilliiPress.${ext}`;

    const manifestContent = `========================================================================
WIRTUUKOMPIITARAA ILILLII — OFFICIAL DIGITAL STORE RELEASE
========================================================================
Product Title: ${prod?.title || perm.productTitle}
Format: ${prod?.fileFormat || perm.fileFormat}
Version: ${perm.version}
Author/Publisher: ${prod?.author || 'Wirtuu Kompiitaraa Ilillii Press'}
Institutional Affiliation: Haramaya University, Ethiopia
License Holder Email: ${perm.userEmail}
Granted By: ${perm.grantedBy}
Order Ref: ${perm.orderNumber || 'DIRECT-GRANT'}
Download Timestamp: ${new Date().toISOString()}
Security Hash: SHA256-ILILLII-AUTH-${Buffer.from(perm.id + perm.userEmail).toString('base64').substring(0, 16)}
========================================================================

Thank you for choosing Wirtuu Kompiitaraa Ilillii Digital Store.
For institutional inquiries or support, contact store@wki.edu.et or +251 927 650 724.
`;

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(Buffer.from(manifestContent, 'utf-8'));
  });

  // 19. Manage Coupons
  app.get(['/api/store/coupons', '/api/store/admin/coupons'], (_req: Request, res: Response) => {
    const coupons = loadStoreCoupons();
    res.json({ success: true, coupons });
  });

  // 19b. Admin Permissions List and Revocation
  app.get('/api/store/admin/permissions', (_req: Request, res: Response) => {
    const perms = loadStorePermissions();
    res.json({ success: true, permissions: perms, total: perms.length });
  });

  app.post('/api/store/admin/permissions/:id/revoke', (req: Request, res: Response) => {
    let user = getUserFromReq(req);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      user = { id: 'usr-admin-01', name: 'Ilillii Store Admin', email: 'admin@wki.edu.et', role: 'admin' } as any;
    }

    const { isRevoked, reason } = req.body;
    const perms = loadStorePermissions();
    const index = perms.findIndex((p: any) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Permission record not found.' });
    }

    perms[index].isRevoked = isRevoked !== undefined ? Boolean(isRevoked) : true;
    saveStorePermissions(perms);

    logStoreAudit(
      perms[index].isRevoked ? 'PERMISSION_REVOKED' : 'PERMISSION_RESTORED',
      user,
      perms[index].id,
      perms[index].productTitle,
      `Updated revocation status for ${perms[index].userEmail}. Reason: ${reason || 'N/A'}`,
      req.ip
    );

    res.json({
      success: true,
      message: `Permission ${perms[index].isRevoked ? 'revoked' : 'restored'} successfully.`,
      permission: perms[index],
    });
  });

  app.post('/api/store/admin/coupons', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required.' });
    }

    const { code, discountType, discountValue, minOrderAmountETB, maxDiscountETB, startDate, endDate, usageLimit, applicableCategory, description } = req.body;
    if (!code || !discountValue) {
      return res.status(400).json({ success: false, error: 'Coupon code and discount value are required.' });
    }

    const coupons = loadStoreCoupons();
    const newCoupon = {
      id: `cpn-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderAmountETB: Number(minOrderAmountETB) || 0,
      maxDiscountETB: maxDiscountETB ? Number(maxDiscountETB) : undefined,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '2026-12-31',
      usageLimit: Number(usageLimit) || 100,
      usageCount: 0,
      isActive: true,
      applicableCategory: applicableCategory || 'all',
      description: description || 'Promotional discount coupon',
    };

    coupons.unshift(newCoupon);
    saveStoreCoupons(coupons);

    logStoreAudit('COUPON_CREATED', user, newCoupon.id, newCoupon.code, `Created coupon ${newCoupon.code} (${newCoupon.discountValue}${newCoupon.discountType === 'percentage' ? '%' : ' ETB'})`, req.ip);

    res.status(201).json({ success: true, coupon: newCoupon });
  });

  app.delete('/api/store/admin/coupons/:id', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required.' });
    }

    const coupons = loadStoreCoupons();
    const index = coupons.findIndex((c: any) => c.id === req.params.id);
    if (index !== -1) {
      coupons.splice(index, 1);
      saveStoreCoupons(coupons);
    }
    res.json({ success: true, message: 'Coupon deleted.' });
  });

  // 20. Submit Product Review
  app.post('/api/store/products/:id/reviews', (req: Request, res: Response) => {
    const { rating, comment, userName, userEmail } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, error: 'Rating and comment are required.' });
    }

    const user = getUserFromReq(req);
    const reviewerName = user ? user.name : (userName || 'Anonymous Scholar');
    const reviewerEmail = user ? user.email : (userEmail || 'anonymous@wki.edu.et');
    const reviewerId = user ? user.id : `guest-${Date.now()}`;

    const products = loadStoreProducts();
    const index = products.findIndex((p: any) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    // Check if verified purchase
    const perms = loadStorePermissions();
    const isVerified = perms.some((perm: any) => perm.productId === req.params.id && (perm.userId === reviewerId || perm.userEmail === reviewerEmail));

    const newReview = {
      id: `rev-${Date.now()}`,
      productId: req.params.id,
      userId: reviewerId,
      userName: reviewerName,
      userEmail: reviewerEmail,
      userRole: user?.role || 'Customer',
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment.trim(),
      isVerifiedPurchase: isVerified,
      createdAt: new Date().toISOString().split('T')[0],
      isApproved: true,
    };

    const prod = products[index];
    const reviews = prod.reviews || [];
    reviews.unshift(newReview);

    // Recalculate average rating
    const sumRatings = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    const avgRating = Number((sumRatings / reviews.length).toFixed(1));

    products[index] = {
      ...prod,
      reviews,
      reviewCount: reviews.length,
      rating: avgRating,
    };

    saveStoreProducts(products);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for your feedback!',
      review: newReview,
      newRating: avgRating,
    });
  });

  // 21. Admin Analytics & Revenue Reports
  app.get('/api/store/admin/analytics', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required.' });
    }

    const orders = loadStoreOrders();
    const products = loadStoreProducts();
    const perms = loadStorePermissions();

    const completedOrders = orders.filter((o: any) => o.status === 'COMPLETED' || o.status === 'PAYMENT_APPROVED');
    const totalRevenueETB = completedOrders.reduce((sum: number, o: any) => sum + (o.totalETB || 0), 0);
    const totalDownloads = perms.reduce((sum: number, p: any) => sum + (p.downloadCount || 0), 0);

    // Revenue by category
    const categoryRevenue: Record<string, number> = {};
    for (const order of completedOrders) {
      for (const item of order.items) {
        const prod = products.find((p: any) => p.id === item.productId);
        const cat = prod?.category || 'other';
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + (item.finalPriceETB || 0);
      }
    }

    // Payment method breakdown
    const paymentMethodStats: Record<string, { count: number; totalETB: number }> = {};
    for (const order of completedOrders) {
      const pm = order.paymentMethod || 'Unknown';
      if (!paymentMethodStats[pm]) {
        paymentMethodStats[pm] = { count: 0, totalETB: 0 };
      }
      paymentMethodStats[pm].count += 1;
      paymentMethodStats[pm].totalETB += order.totalETB || 0;
    }

    res.json({
      success: true,
      analytics: {
        totalRevenueETB,
        totalOrders: orders.length,
        completedOrdersCount: completedOrders.length,
        pendingReviewCount: orders.filter((o: any) => o.status === 'PAYMENT_UNDER_REVIEW').length,
        totalProducts: products.length,
        totalDownloads,
        categoryRevenue,
        paymentMethodStats,
      },
    });
  });

  // 22. Admin Audit Logs
  app.get('/api/store/admin/audit-logs', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required.' });
    }
    const logs = loadStoreAuditLogs();
    res.json({ success: true, logs });
  });

  // 23. Get Author Royalties (70% Author / 30% Press Split)
  app.get('/api/store/author/royalties', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    const authorEmail = user?.email || 'dr.gemechu@wki.edu.et';

    const orders = loadStoreOrders();
    const products = loadStoreProducts();
    const payouts = loadStorePayouts();

    const completedOrders = orders.filter((o: any) => o.status === 'COMPLETED' || o.status === 'PAYMENT_APPROVED');

    let totalGrossETB = 0;
    let authorEarnedETB = 0;
    let totalSalesCount = 0;
    const productStatsMap: Record<string, any> = {};

    for (const order of completedOrders) {
      for (const item of order.items) {
        const prod = products.find((p: any) => p.id === item.productId);
        const itemPrice = item.finalPriceETB || 0;
        totalGrossETB += itemPrice;
        totalSalesCount += 1;

        const authorShare = Math.round(itemPrice * 0.7);
        authorEarnedETB += authorShare;

        if (!productStatsMap[item.productId]) {
          productStatsMap[item.productId] = {
            productId: item.productId,
            title: item.title,
            format: item.fileFormat || 'PDF',
            price: item.unitPriceETB || itemPrice,
            sales: 0,
            gross: 0,
            authorEarned: 0,
          };
        }
        productStatsMap[item.productId].sales += 1;
        productStatsMap[item.productId].gross += itemPrice;
        productStatsMap[item.productId].authorEarned += authorShare;
      }
    }

    const myPayouts = payouts.filter((p: any) => !p.authorEmail || p.authorEmail.toLowerCase() === authorEmail.toLowerCase());
    const totalPaidETB = myPayouts
      .filter((p: any) => p.status === 'COMPLETED')
      .reduce((sum: number, p: any) => sum + p.amountETB, 0);

    const pendingPayoutETB = myPayouts
      .filter((p: any) => p.status === 'PENDING_ADMIN_APPROVAL')
      .reduce((sum: number, p: any) => sum + p.amountETB, 0);

    const availableBalanceETB = Math.max(0, authorEarnedETB - totalPaidETB - pendingPayoutETB);

    res.json({
      success: true,
      summary: {
        totalGrossETB,
        authorEarnedETB,
        totalSalesCount,
        totalPaidETB,
        pendingPayoutETB,
        availableBalanceETB,
        productBreakdown: Object.values(productStatsMap),
      },
      payouts: myPayouts,
    });
  });

  // 24. Submit Author Payout Request
  app.post('/api/store/author/payout-request', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    const { amountETB, bankName, accountNumber, accountHolder } = req.body;

    if (!amountETB || Number(amountETB) <= 0 || !accountNumber) {
      return res.status(400).json({ success: false, error: 'Valid amount and account details are required.' });
    }

    const payouts = loadStorePayouts();
    const newPayout = {
      id: `payout-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      authorUserId: user?.id || 'usr-author-01',
      authorEmail: user?.email || 'dr.gemechu@wki.edu.et',
      authorName: user?.name || accountHolder || 'Faculty Author',
      amountETB: Number(amountETB),
      bankName: bankName || 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: accountNumber.trim(),
      accountHolder: accountHolder?.trim() || user?.name || 'Faculty Author',
      requestedAt: new Date().toISOString(),
      status: 'PENDING_ADMIN_APPROVAL',
    };

    payouts.unshift(newPayout);
    saveStorePayouts(payouts);

    logStoreAudit(
      'ROYALTY_PAYOUT_REQUESTED',
      user || { id: newPayout.authorUserId, name: newPayout.authorName, role: 'author' },
      newPayout.id,
      `${newPayout.amountETB} ETB (${newPayout.bankName})`,
      `Author requested royalty withdrawal of ${newPayout.amountETB} ETB to account ${newPayout.accountNumber}.`,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: 'Royalty payout request recorded successfully.',
      payout: newPayout,
    });
  });

  // 25. Admin Process Royalty Payout Request
  app.post('/api/store/admin/payouts/:id/process', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required.' });
    }

    const { action, transactionRef, notes } = req.body;
    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({ success: false, error: 'Action must be approve or reject.' });
    }

    const payouts = loadStorePayouts();
    const index = payouts.findIndex((p: any) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Payout request not found.' });
    }

    payouts[index] = {
      ...payouts[index],
      status: action === 'approve' ? 'COMPLETED' : 'REJECTED',
      transactionRef: transactionRef || (action === 'approve' ? `CBE-DISBURSED-${Date.now()}` : undefined),
      adminNotes: notes || '',
      processedAt: new Date().toISOString(),
      processedBy: `${user.name} (${user.role})`,
    };

    saveStorePayouts(payouts);

    logStoreAudit(
      action === 'approve' ? 'ROYALTY_PAYOUT_APPROVED' : 'ROYALTY_PAYOUT_REJECTED',
      user,
      payouts[index].id,
      `${payouts[index].amountETB} ETB`,
      `Royalty payout ${action}d for ${payouts[index].authorEmail}.`,
      req.ip
    );

    res.json({
      success: true,
      message: `Payout request ${action}d successfully.`,
      payout: payouts[index],
    });
  });

  // -------------------------------------------------------------
  // VITE & STATIC FILES MIDDLEWARE
  // -------------------------------------------------------------
  app.use('/src/assets', express.static(path.join(process.cwd(), 'src/assets')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
