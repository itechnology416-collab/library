import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Language, UserRole } from '../types';

interface LoginPageProps {
  currentLanguage: Language;
  onSuccessRedirect?: () => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentLanguage,
  onSuccessRedirect,
  onClose,
  isModal = false,
}) => {
  const { login, register, isAuthenticated, intendedRoute, setIntendedRoute } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<UserRole>('author');
  const [affiliation, setAffiliation] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [staffOrStudentId, setStaffOrStudentId] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Quick Seed Credentials
  const seedAccounts = [
    { label: 'Author / Client', email: 'author@wki.edu.et', pass: 'AuthorPass123!', icon: 'assignment', role: 'author' },
    { label: 'Postgraduate Scholar', email: 'scholar@wki.edu.et', pass: 'ScholarPass123!', icon: 'school', role: 'scholar' },
    { label: 'Peer Reviewer', email: 'reviewer@wki.edu.et', pass: 'ReviewerPass123!', icon: 'rate_review', role: 'reviewer' },
    { label: 'Faculty PI / Researcher', email: 'faculty@wki.edu.et', pass: 'FacultyPass123!', icon: 'account_balance_wallet', role: 'faculty' },
    { label: 'Press Registrar / Admin', email: 'admin@wki.edu.et', pass: 'AdminPass123!', icon: 'admin_panel_settings', role: 'admin' },
  ];

  const handleSelectSeed = (item: { email: string; pass: string }) => {
    setMode('login');
    setEmail(item.email);
    setPassword(item.pass);
    setErrorMsg(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Client validation
    if (!email || !email.includes('@')) {
      setErrorMsg('Please provide a valid institutional or personal email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMsg('Authentication verified. Redirecting to your workspace...');
          setTimeout(() => {
            if (onSuccessRedirect) {
              onSuccessRedirect();
            }
          }, 400);
        } else {
          setErrorMsg(res.message || 'Invalid credentials.');
        }
      } else {
        if (!name.trim()) {
          setErrorMsg('Please enter your full official name.');
          setIsSubmitting(false);
          return;
        }

        const res = await register({
          email,
          password,
          name,
          role,
          affiliation,
          phone,
          staffOrStudentId,
        });

        if (res.success) {
          setSuccessMsg('Account registered successfully! Redirecting...');
          setTimeout(() => {
            if (onSuccessRedirect) {
              onSuccessRedirect();
            }
          }, 400);
        } else {
          setErrorMsg(res.message || 'Registration failed.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full ${isModal ? 'p-0' : 'max-w-5xl mx-auto px-gutter-mobile py-8'}`}>
      <div className="bg-surface-container-low rounded-3xl border border-outline-variant/30 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Brand & Academic Credentials Banner */}
        <div className="lg:col-span-5 bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white flex flex-col justify-between space-y-8 relative overflow-hidden">
          {/* Subtle Ambient pattern */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-amber-300">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-indigo-300 uppercase block font-bold">
                  Institutional Auth
                </span>
                <span className="text-sm font-bold font-serif text-white">
                  Wirtuu Kompiitaraa Ilillii
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                {mode === 'login' ? 'Academic Single Sign-On' : 'Create Academic Identity'}
              </h2>
              <p className="text-xs text-indigo-100/80 leading-relaxed">
                Securely access your postgraduate research deliverables, double-blind peer reviews, book monographs, and verified certificates.
              </p>
            </div>

            {/* Quick Fill Pre-configured Test Accounts */}
            <div className="pt-4 border-t border-indigo-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  One-Click Demo Personas
                </span>
                <span className="text-[10px] text-indigo-200/60">Click to autofill</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {seedAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectSeed(acc)}
                    className="p-2 rounded-xl bg-indigo-900/30 hover:bg-indigo-900/60 border border-indigo-700/30 text-left flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[16px] text-indigo-400 group-hover:text-amber-300">
                        {acc.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white group-hover:text-amber-300 truncate">
                          {acc.label}
                        </div>
                        <div className="text-[9px] font-mono text-indigo-200/70 truncate">
                          {acc.email}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-indigo-300 font-mono shrink-0 pl-1">
                      Fill
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative pt-4 border-t border-indigo-800/40 flex items-center justify-between text-[11px] text-indigo-200/80">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-emerald-400">lock</span>
              JWT 256-Bit Encrypted
            </span>
            <span>Haramaya University Press</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-surface flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Top Bar with Mode Toggle and optional Close */}
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div className="flex items-center p-1 rounded-xl bg-surface-container border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-secondary text-on-secondary shadow-xs'
                      : 'text-on-surface hover:text-secondary'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-secondary text-on-secondary shadow-xs'
                      : 'text-on-surface hover:text-secondary'
                  }`}
                >
                  Register
                </button>
              </div>

              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
                  title="Close"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Error or Success notification */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px] shrink-0 text-rose-500">error</span>
                <span className="leading-relaxed font-medium">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px] shrink-0 text-emerald-500">check_circle</span>
                <span className="leading-relaxed font-medium">{successMsg}</span>
              </div>
            )}

            {/* Intended Route notification */}
            {intendedRoute && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Please sign in to access your requested dashboard: <strong>{intendedRoute.toUpperCase()}</strong></span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface">Full Official Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Dr. Chaltu Benti / Ato Feysal"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface">Primary Role *</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full h-11 px-3 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface cursor-pointer"
                      >
                        <option value="author">Author / Publishing Client</option>
                        <option value="scholar">Postgraduate Scholar / Student</option>
                        <option value="reviewer">Peer Reviewer / Editorial Board</option>
                        <option value="faculty">Faculty Researcher / PI</option>
                        <option value="admin">University Press Registrar</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface">Staff or Student ID</label>
                      <input
                        type="text"
                        placeholder="e.g., HU-PGS-7741"
                        value={staffOrStudentId}
                        onChange={(e) => setStaffOrStudentId(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-secondary font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface">Institutional Affiliation</label>
                      <input
                        type="text"
                        placeholder="e.g., College of Agriculture"
                        value={affiliation}
                        onChange={(e) => setAffiliation(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-secondary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface">Phone (Telegram / SMS)</label>
                      <input
                        type="tel"
                        placeholder="+251 91 ..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-secondary font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface">Institutional / Personal Email *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@wki.edu.et or user@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-secondary"
                  />
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 top-3">
                    mail
                  </span>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface">Password *</label>
                  {mode === 'login' && (
                    <span className="text-[10px] text-secondary font-medium hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-secondary font-mono"
                  />
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 top-3">
                    lock
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Authenticating with University Server...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      {mode === 'login' ? 'login' : 'how_to_reg'}
                    </span>
                    <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create Verified Account'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-outline-variant/20 text-center text-[11px] text-on-surface-variant">
            {mode === 'login' ? (
              <span>
                Don't have an academic account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-secondary hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-secondary hover:underline cursor-pointer"
                >
                  Sign in to existing account
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
