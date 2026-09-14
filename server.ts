import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'academic_wki_jwt_secret_secure_key_2026';
const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');

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
      id: `WKI-REQ-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'Submitted',
      ...req.body,
    };
    requests.unshift(newReq);
    saveRequests(requests);
    res.json({ success: true, request: newReq });
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
