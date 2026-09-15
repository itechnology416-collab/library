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

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'author' | 'scholar' | 'reviewer' | 'faculty' | 'admin';
  affiliation?: string;
  phone?: string;
  orcid?: string;
  staffOrStudentId?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

// Ensure data storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to load users from persistence
function loadUsers(): StoredUser[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading users file:', err);
  }
  return [];
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

// Auth Middleware to verify tokens
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
    if (err) {
      res.status(403).json({ success: false, message: 'Session expired or invalid. Please sign in again.' });
      return;
    }
    (req as any).user = decoded;
    next();
  });
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

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
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
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

      res.cookie('wki_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

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
      const userPayload = (req as any).user;
      const users = loadUsers();
      const user = users.find((u) => u.id === userPayload.id);

      if (!user) {
        res.status(404).json({ success: false, message: 'User account not found.' });
        return;
      }

      res.json({
        success: true,
        user: sanitizeUser(user),
      });
    } catch (err: any) {
      console.error('Auth verification error:', err);
      res.status(500).json({ success: false, message: 'Failed to verify authentication status.' });
    }
  });

  // 6. Logout
  app.post('/api/auth/logout', (_req: Request, res: Response) => {
    res.clearCookie('wki_auth_token');
    res.json({ success: true, message: 'Logged out successfully.' });
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

  // -------------------------------------------------------------
  // VITE & STATIC FILES MIDDLEWARE
  // -------------------------------------------------------------
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
