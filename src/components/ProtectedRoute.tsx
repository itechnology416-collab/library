import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from './LoginPage';
import { Language, UserRole } from '../types';

interface ProtectedRouteProps {
  children: ReactNode;
  currentLanguage: Language;
  routeName: string;
  allowedRoles?: UserRole[];
  onLoginSuccess?: () => void;
  onNavigateHome?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  currentLanguage,
  routeName,
  allowedRoles,
  onLoginSuccess,
  onNavigateHome,
}) => {
  const { isAuthenticated, isLoading, user, setIntendedRoute } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 py-12">
        <div className="w-12 h-12 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin" />
        <p className="text-xs font-mono text-on-surface-variant animate-pulse">
          Verifying institutional session credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Record intended route for redirect after login
    setIntendedRoute(routeName);

    return (
      <div className="space-y-6 py-6 animate-in fade-in duration-200">
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-amber-600">lock</span>
          </div>
          <div className="text-xs">
            <div className="font-bold">Authentication Required</div>
            <p className="text-amber-800/80 dark:text-amber-300/80">
              Please sign in to access the <strong>{routeName.replace('_', ' ').toUpperCase()}</strong> workspace.
            </p>
          </div>
        </div>

        <LoginPage
          currentLanguage={currentLanguage}
          onSuccessRedirect={onLoginSuccess}
        />
      </div>
    );
  }

  // Check role authorization if specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-gutter-mobile text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/15 border border-rose-500/30 text-rose-600 mx-auto flex items-center justify-center">
          <span className="material-symbols-outlined text-[32px]">no_accounts</span>
        </div>
        <h2 className="text-2xl font-bold font-serif text-on-surface">
          Restricted Workspace Clearance
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
          Your current authenticated profile (<strong>{user.name}</strong> • Role: <strong>{user.role}</strong>) does not have clearance for this dashboard.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface cursor-pointer"
            >
              Return Home
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
