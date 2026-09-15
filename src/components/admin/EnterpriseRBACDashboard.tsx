import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus, EnterpriseAuditLog, GranularPermission } from '../../types';
import { PERMISSION_GROUPS, ALL_PERMISSIONS } from '../../data/rbacPermissions';
import { useAuth } from '../../context/AuthContext';

interface RBACMetrics {
  totalUsers: number;
  superAdmins: number;
  admins: number;
  clients: number;
  activeUsers: number;
  suspendedUsers: number;
  totalProducts: number;
  pendingPayments: number;
  totalAuditEvents: number;
  recentSecurityEvents: EnterpriseAuditLog[];
  isPrimarySuperAdmin: boolean;
  scopeId: string;
}

interface EnterpriseRBACDashboardProps {
  onNavigateHome?: () => void;
  onShowToast?: (msg: string) => void;
}

export const EnterpriseRBACDashboard: React.FC<EnterpriseRBACDashboardProps> = ({
  onNavigateHome,
  onShowToast,
}) => {
  const { user: currentUser, token, hasPermission, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'admins' | 'clients' | 'users' | 'permissions' | 'audit' | 'hierarchy'>('overview');
  const [metrics, setMetrics] = useState<RBACMetrics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<EnterpriseAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected User for Permission Matrix Editing
  const [selectedUserForPerms, setSelectedUserForPerms] = useState<User | null>(null);
  const [selectedUserPerms, setSelectedUserPerms] = useState<string[]>([]);

  // Create User/Admin Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createRole, setCreateRole] = useState<UserRole>('admin');
  const [createEmail, setCreateEmail] = useState<string>('');
  const [createPassword, setCreatePassword] = useState<string>('');
  const [createName, setCreateName] = useState<string>('');
  const [createUsername, setCreateUsername] = useState<string>('');
  const [createPhone, setCreatePhone] = useState<string>('');
  const [createAffiliation, setCreateAffiliation] = useState<string>('');
  const [createScopeId, setCreateScopeId] = useState<string>('scope-alpha');
  const [createStatus, setCreateStatus] = useState<UserStatus>('ACTIVE');
  const [createExpirationDate, setCreateExpirationDate] = useState<string>('');
  const [createSelectedPerms, setCreateSelectedPerms] = useState<string[]>([]);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editAffiliation, setEditAffiliation] = useState<string>('');
  const [editScopeId, setEditScopeId] = useState<string>('');
  const [editRole, setEditRole] = useState<UserRole>('user');
  const [editStatus, setEditStatus] = useState<UserStatus>('ACTIVE');
  const [editExpirationDate, setEditExpirationDate] = useState<string>('');
  const [editPassword, setEditPassword] = useState<string>('');

  // Password Reset Result State
  const [resetResult, setResetResult] = useState<{ userId: string; tempPass: string } | null>(null);

  const isPrimarySuperAdmin = !!(
    currentUser?.isPrimarySuperAdmin ||
    currentUser?.id === 'usr-super-admin-01' ||
    currentUser?.email.toLowerCase() === 'superadmin@wki.edu.et'
  );

  // Fetch initial data
  useEffect(() => {
    loadDashboardData();
  }, [token]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Load Users
      const usersRes = await fetch('/api/admin/rbac/users', { headers });
      if (usersRes.ok) {
        const uData = await usersRes.json();
        if (uData.success) {
          setUsers(uData.users || []);
        }
      }

      // Load Metrics
      const metricsRes = await fetch('/api/admin/rbac/metrics', { headers });
      if (metricsRes.ok) {
        const mData = await metricsRes.json();
        if (mData.success) {
          setMetrics(mData.metrics);
        }
      }

      // Load Audit Logs
      const auditRes = await fetch('/api/admin/rbac/audit-logs', { headers });
      if (auditRes.ok) {
        const aData = await auditRes.json();
        if (aData.success) {
          setAuditLogs(aData.logs || []);
        }
      }
    } catch (err) {
      console.error('Error loading RBAC dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    // Primary Super Admin strict rule check
    if (createRole === 'superadmin') {
      const existingSuperAdmin = users.find((u) => u.role === 'superadmin' || u.isPrimarySuperAdmin);
      if (existingSuperAdmin) {
        setCreateError('A primary Super Admin already exists. Only one primary Super Admin is allowed.');
        return;
      }
    }

    try {
      const res = await fetch('/api/admin/rbac/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: createEmail,
          password: createPassword,
          name: createName,
          username: createUsername,
          role: createRole,
          status: createStatus,
          scopeId: createScopeId,
          permissions: createSelectedPerms,
          expirationDate: createExpirationDate || undefined,
          phone: createPhone,
          affiliation: createAffiliation,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowCreateModal(false);
        resetCreateForm();
        if (onShowToast) onShowToast(data.message || 'Account created successfully.');
        loadDashboardData();
      } else {
        setCreateError(data.message || 'Failed to create user account.');
      }
    } catch (err: any) {
      setCreateError('Network error while creating account.');
    }
  };

  const resetCreateForm = () => {
    setCreateEmail('');
    setCreatePassword('');
    setCreateName('');
    setCreateUsername('');
    setCreatePhone('');
    setCreateAffiliation('');
    setCreateScopeId('scope-alpha');
    setCreateRole('admin');
    setCreateStatus('ACTIVE');
    setCreateExpirationDate('');
    setCreateSelectedPerms([]);
    setCreateError(null);
  };

  const handleOpenEditUser = (u: User) => {
    setEditingUser(u);
    setEditName(u.name || '');
    setEditPhone(u.phone || '');
    setEditAffiliation(u.affiliation || '');
    setEditScopeId(u.scopeId || 'default');
    setEditRole(u.role);
    setEditStatus(u.status || 'ACTIVE');
    setEditExpirationDate(u.expirationDate || '');
    setEditPassword('');
  };

  const handleSaveEditedUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch(`/api/admin/rbac/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          affiliation: editAffiliation,
          role: editRole,
          status: editStatus,
          scopeId: editScopeId,
          expirationDate: editExpirationDate || undefined,
          password: editPassword || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEditingUser(null);
        if (onShowToast) onShowToast(data.message || 'User updated successfully.');
        loadDashboardData();
        refreshUser();
      } else {
        alert(data.message || 'Failed to update user.');
      }
    } catch (err) {
      alert('Network error while updating user.');
    }
  };

  const handleOpenPermissionStudio = (u: User) => {
    setSelectedUserForPerms(u);
    setSelectedUserPerms(u.permissions || []);
    setActiveTab('permissions');
  };

  const handleTogglePermission = (permId: string) => {
    setSelectedUserPerms((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleSelectCategoryPermissions = (permIds: string[], selectAll: boolean) => {
    setSelectedUserPerms((prev) => {
      const set = new Set(prev);
      if (selectAll) {
        permIds.forEach((p) => set.add(p));
      } else {
        permIds.forEach((p) => set.delete(p));
      }
      return Array.from(set);
    });
  };

  const handleSaveUserPermissions = async () => {
    if (!selectedUserForPerms) return;

    try {
      const res = await fetch(`/api/admin/rbac/users/${selectedUserForPerms.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          permissions: selectedUserPerms,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (onShowToast) onShowToast(`Updated permissions for ${selectedUserForPerms.name}!`);
        loadDashboardData();
      } else {
        alert(data.message || 'Failed to update permissions.');
      }
    } catch (err) {
      alert('Network error while updating permissions.');
    }
  };

  const handleToggleUserStatus = async (userToToggle: User, newStatus: UserStatus) => {
    try {
      const res = await fetch(`/api/admin/rbac/users/${userToToggle.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (onShowToast) onShowToast(`Account status changed to ${newStatus}.`);
        loadDashboardData();
      } else {
        alert(data.message || 'Failed to change user status.');
      }
    } catch (err) {
      alert('Network error changing account status.');
    }
  };

  const handleResetUserPassword = async (userToReset: User) => {
    if (!confirm(`Reset temporary password for ${userToReset.name} (${userToReset.email})?`)) return;

    try {
      const res = await fetch(`/api/admin/rbac/users/${userToReset.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResetResult({ userId: userToReset.id, tempPass: data.temporaryPassword });
        if (onShowToast) onShowToast(`Password reset for ${userToReset.name}`);
        loadDashboardData();
      } else {
        alert(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      alert('Network error resetting password.');
    }
  };

  // Preset Template Application
  const applyPresetPermissions = (template: 'full_admin' | 'content_manager' | 'financial_verifier' | 'client_lead') => {
    let perms: string[] = [];
    if (template === 'full_admin') {
      perms = ALL_PERMISSIONS.filter((p) => p !== 'admins.permissions');
    } else if (template === 'content_manager') {
      perms = ['content.view', 'content.create', 'content.edit', 'content.publish', 'resources.view', 'resources.upload', 'resources.edit', 'resources.publish', 'resources.download'];
    } else if (template === 'financial_verifier') {
      perms = ['sales.view', 'sales.create', 'sales.edit', 'sales.refund', 'payments.view', 'payments.verify', 'payments.approve', 'payments.reject', 'downloads.view', 'downloads.approve', 'reports.view', 'reports.export'];
    } else if (template === 'client_lead') {
      perms = ['users.view', 'users.create', 'clients.view', 'content.view', 'resources.view', 'resources.download', 'sales.view', 'payments.view'];
    }
    setSelectedUserPerms(perms);
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.scopeId && u.scopeId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesQuery && matchesRole && matchesStatus;
  });

  const adminsList = users.filter((u) => u.role === 'admin');
  const clientsList = users.filter((u) => u.role === 'client');
  const superAdminUser = users.find((u) => u.role === 'superadmin' || u.isPrimarySuperAdmin);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-indigo-400">shield</span>
                Enterprise RBAC System
              </span>

              {isPrimarySuperAdmin ? (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-amber-400">workspace_premium</span>
                  Primary Super Admin
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                  Scoped Administrator ({currentUser?.scopeId || 'Tenant Scope'})
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">
              Hierarchical Administration & Permission Center
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Server-authoritative Role-Based Access Control, tenant isolation, granular permission assignment, and immutable security audit logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCreateRole('admin');
                setShowCreateModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 border border-indigo-400/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Provision Administrator
            </button>

            <button
              onClick={loadDashboardData}
              title="Refresh Data"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[20px] ${isLoading ? 'animate-spin' : ''}`}>
                refresh
              </span>
            </button>
          </div>
        </div>

        {/* Primary Super Admin Notice Badge */}
        {superAdminUser && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[18px]">verified_user</span>
              <span>
                Primary Super Admin: <strong className="text-white font-semibold">{superAdminUser.name}</strong> ({superAdminUser.email}) — Protected from demotion/deletion
              </span>
            </div>
            <span className="hidden sm:inline-block text-slate-500 font-mono">
              Strict Rule: 1 Super Admin Max
            </span>
          </div>
        )}
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/40 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'overview', label: 'Executive Overview', icon: 'dashboard' },
          { id: 'hierarchy', label: 'Hierarchy & Tree', icon: 'account_tree' },
          { id: 'admins', label: `Administrators (${adminsList.length})`, icon: 'admin_panel_settings' },
          { id: 'clients', label: `Clients (${clientsList.length})`, icon: 'domain' },
          { id: 'users', label: `All Users (${users.length})`, icon: 'group' },
          { id: 'permissions', label: 'Permission Matrix Studio', icon: 'tune' },
          { id: 'audit', label: `Audit Trail (${auditLogs.length})`, icon: 'receipt_long' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-t-xl font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary/10 text-primary border-b-2 border-primary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-surface border border-outline-variant/40 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                <span>Total Accounts</span>
                <span className="material-symbols-outlined text-indigo-500">groups</span>
              </div>
              <div className="text-2xl font-bold font-display text-on-surface">{metrics?.totalUsers || users.length}</div>
              <p className="text-xs text-on-surface-variant">Active across all scopes</p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-outline-variant/40 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                <span>Administrators</span>
                <span className="material-symbols-outlined text-amber-500">admin_panel_settings</span>
              </div>
              <div className="text-2xl font-bold font-display text-amber-600 dark:text-amber-400">
                {metrics?.admins || adminsList.length}
              </div>
              <p className="text-xs text-on-surface-variant">Delegated scope admins</p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-outline-variant/40 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                <span>Institutional Clients</span>
                <span className="material-symbols-outlined text-blue-500">domain</span>
              </div>
              <div className="text-2xl font-bold font-display text-blue-600 dark:text-blue-400">
                {metrics?.clients || clientsList.length}
              </div>
              <p className="text-xs text-on-surface-variant">Corporate & partner clients</p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-outline-variant/40 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                <span>Active Accounts</span>
                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              </div>
              <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
                {metrics?.activeUsers || users.filter((u) => u.status === 'ACTIVE').length}
              </div>
              <p className="text-xs text-on-surface-variant">Active authenticated status</p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-outline-variant/40 shadow-sm space-y-2 col-span-2 md:col-span-1">
              <div className="flex items-center justify-between text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                <span>Suspended / Locked</span>
                <span className="material-symbols-outlined text-rose-500">lock_clock</span>
              </div>
              <div className="text-2xl font-bold font-display text-rose-600 dark:text-rose-400">
                {metrics?.suspendedUsers || users.filter((u) => u.status === 'SUSPENDED' || u.status === 'DISABLED').length}
              </div>
              <p className="text-xs text-on-surface-variant">Access revoked by admin</p>
            </div>
          </div>

          {/* Quick Actions & Recent Security Events */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl bg-surface border border-outline-variant/40 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold font-display text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">security</span>
                    Recent Security Audit Events
                  </h2>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All Audit Logs
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>

                <div className="divide-y divide-outline-variant/30">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-semibold uppercase text-[10px] ${
                              log.result === 'SUCCESS'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : log.result === 'DENIED'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {log.result}
                          </span>
                          <span className="font-semibold text-on-surface">{log.action}</span>
                          <span className="text-on-surface-variant">• {log.target}</span>
                        </div>
                        <p className="text-on-surface-variant">{log.details}</p>
                        <div className="text-[11px] text-on-surface-variant/70 flex items-center gap-3">
                          <span>Actor: <strong>{log.performedByUserName}</strong> ({log.performedByUserRole})</span>
                          <span>IP: {log.ipAddress || '127.0.0.1'}</span>
                        </div>
                      </div>
                      <span className="text-on-surface-variant/70 whitespace-nowrap text-[11px]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}

                  {auditLogs.length === 0 && (
                    <div className="py-8 text-center text-on-surface-variant text-sm">
                      No security audit events recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Management Actions Card */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-surface border border-outline-variant/40 p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold font-display text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-500">bolt</span>
                  Quick Management Actions
                </h2>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setCreateRole('admin');
                      setShowCreateModal(true);
                    }}
                    className="w-full p-3 rounded-xl bg-surface-variant/40 hover:bg-surface-variant text-left transition-colors flex items-center gap-3 border border-outline-variant/30 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">person_add</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-on-surface">Provision Administrator</div>
                      <div className="text-xs text-on-surface-variant">Create admin with assigned scope & rights</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setCreateRole('client');
                      setShowCreateModal(true);
                    }}
                    className="w-full p-3 rounded-xl bg-surface-variant/40 hover:bg-surface-variant text-left transition-colors flex items-center gap-3 border border-outline-variant/30 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">domain_add</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-on-surface">Onboard Institutional Client</div>
                      <div className="text-xs text-on-surface-variant">Add corporate client account</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('permissions')}
                    className="w-full p-3 rounded-xl bg-surface-variant/40 hover:bg-surface-variant text-left transition-colors flex items-center gap-3 border border-outline-variant/30 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">tune</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-on-surface">Permission Matrix Studio</div>
                      <div className="text-xs text-on-surface-variant">Configure 10 granular permission modules</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('hierarchy')}
                    className="w-full p-3 rounded-xl bg-surface-variant/40 hover:bg-surface-variant text-left transition-colors flex items-center gap-3 border border-outline-variant/30 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">account_tree</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-on-surface">View Authority Tree</div>
                      <div className="text-xs text-on-surface-variant">Inspect SuperAdmin - Admin - Client tree</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HIERARCHY & TREE */}
      {activeTab === 'hierarchy' && (
        <div className="rounded-2xl bg-surface border border-outline-variant/40 p-6 md:p-8 space-y-8 animate-in fade-in duration-200">
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-display text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_tree</span>
              Organizational Security & Authority Hierarchy
            </h2>
            <p className="text-sm text-on-surface-variant">
              The Primary Super Admin sits at the root, managing delegated Administrators. Each Administrator manages assigned Clients and Users within their scoped boundary.
            </p>
          </div>

          {/* Visual Hierarchy Tree Canvas */}
          <div className="p-6 md:p-8 rounded-2xl bg-surface-variant/30 border border-outline-variant/40 space-y-8">
            {/* Level 1: SUPER ADMIN */}
            <div className="flex justify-center">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-500/20 border-2 border-amber-500/40 text-center space-y-2 max-w-sm shadow-xl">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">workspace_premium</span>
                  Super Admin (Primary)
                </span>
                <h3 className="text-base font-bold text-on-surface">
                  {superAdminUser ? superAdminUser.name : 'Primary Super Administrator'}
                </h3>
                <p className="text-xs text-on-surface-variant font-mono">
                  {superAdminUser ? superAdminUser.email : 'superadmin@wki.edu.et'}
                </p>
                <div className="pt-2 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  • Full Unrestricted System Authority • Cannot be demoted or deleted
                </div>
              </div>
            </div>

            {/* Tree Branch Connector */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-outline-variant" />
            </div>

            {/* Level 2: ADMINISTRATORS */}
            <div className="space-y-4">
              <div className="text-center text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Delegated Administrators ({adminsList.length})
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {adminsList.map((adm, idx) => (
                  <div
                    key={adm.id}
                    className="p-5 rounded-2xl bg-surface border border-outline-variant/60 shadow-md space-y-3 relative hover:border-indigo-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                        Admin {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-variant text-[11px] font-mono text-on-surface-variant">
                        {adm.scopeId || 'scope-alpha'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-on-surface text-sm">{adm.name}</h4>
                      <p className="text-xs text-on-surface-variant font-mono truncate">{adm.email}</p>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant font-medium">
                        {adm.permissions ? adm.permissions.length : 0} Permissions
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          adm.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {adm.status}
                      </span>
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenPermissionStudio(adm)}
                        className="w-full py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Edit Rights
                      </button>
                    </div>
                  </div>
                ))}

                {adminsList.length === 0 && (
                  <div className="col-span-3 text-center py-6 text-sm text-on-surface-variant">
                    No delegated administrators created yet.
                  </div>
                )}
              </div>
            </div>

            {/* Tree Branch Connector */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-outline-variant" />
            </div>

            {/* Level 3: CLIENTS & USERS */}
            <div className="space-y-4">
              <div className="text-center text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Clients & Scoped End-Users ({clientsList.length} Clients, {users.length - adminsList.length - 1} Users)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {clientsList.slice(0, 4).map((cl) => (
                  <div key={cl.id} className="p-4 rounded-xl bg-surface border border-outline-variant/40 space-y-2">
                    <div className="flex items-center gap-2 text-blue-500 text-xs font-semibold">
                      <span className="material-symbols-outlined text-sm">domain</span>
                      Client Account
                    </div>
                    <div className="font-bold text-sm text-on-surface truncate">{cl.name}</div>
                    <div className="text-xs text-on-surface-variant font-mono truncate">{cl.email}</div>
                  </div>
                ))}

                {clientsList.length === 0 && (
                  <div className="col-span-4 text-center py-4 text-xs text-on-surface-variant">
                    No institutional client accounts provisioned yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADMINISTRATORS MANAGEMENT */}
      {activeTab === 'admins' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-display text-on-surface">System Administrators</h2>
              <p className="text-sm text-on-surface-variant">
                Manage delegated administrators and scope boundary assignments.
              </p>
            </div>

            <button
              onClick={() => {
                setCreateRole('admin');
                setShowCreateModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Provision New Admin
            </button>
          </div>

          <div className="rounded-2xl bg-surface border border-outline-variant/40 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-variant/40 text-on-surface-variant font-semibold text-xs uppercase tracking-wider border-b border-outline-variant/40">
                  <tr>
                    <th className="p-4">Administrator</th>
                    <th className="p-4">Role & Scope</th>
                    <th className="p-4">Permissions</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {adminsList.map((adm) => (
                    <tr key={adm.id} className="hover:bg-surface-variant/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center">
                            {adm.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-on-surface flex items-center gap-1.5">
                              {adm.name}
                              {adm.isPrimarySuperAdmin && (
                                <span className="material-symbols-outlined text-amber-500 text-sm" title="Primary Super Admin">
                                  workspace_premium
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-on-surface-variant font-mono">{adm.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wide">
                            {adm.role}
                          </span>
                          <div className="text-xs text-on-surface-variant font-mono">Scope: {adm.scopeId || 'global'}</div>
                        </div>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleOpenPermissionStudio(adm)}
                          className="px-2.5 py-1 rounded-lg bg-surface-variant hover:bg-surface-variant/80 text-on-surface text-xs font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">tune</span>
                          {adm.permissions ? adm.permissions.length : 0} Rights
                        </button>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            adm.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {adm.status}
                        </span>
                      </td>

                      <td className="p-4 text-xs text-on-surface-variant font-mono">
                        {new Date(adm.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditUser(adm)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                          title="Edit Admin Details"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>

                        {!adm.isPrimarySuperAdmin && (
                          <button
                            onClick={() => handleToggleUserStatus(adm, adm.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title={adm.status === 'ACTIVE' ? 'Suspend Admin' : 'Activate Admin'}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {adm.status === 'ACTIVE' ? 'lock' : 'lock_open'}
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CLIENTS MANAGEMENT */}
      {activeTab === 'clients' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-display text-on-surface">Institutional & Corporate Clients</h2>
              <p className="text-sm text-on-surface-variant">
                Manage corporate client accounts and assign them to responsible administrators.
              </p>
            </div>

            <button
              onClick={() => {
                setCreateRole('client');
                setShowCreateModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">domain_add</span>
              Onboard Client Account
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientsList.map((cl) => (
              <div key={cl.id} className="p-6 rounded-2xl bg-surface border border-outline-variant/40 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-lg flex items-center justify-center">
                    <span className="material-symbols-outlined">domain</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      cl.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {cl.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-on-surface text-base">{cl.name}</h3>
                  <p className="text-xs text-on-surface-variant font-mono">{cl.email}</p>
                  {cl.affiliation && (
                    <p className="text-xs text-on-surface-variant mt-1">{cl.affiliation}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-outline-variant/30 text-xs space-y-1 text-on-surface-variant">
                  <div>Scope: <strong className="text-on-surface font-mono">{cl.scopeId || 'default'}</strong></div>
                  <div>Phone: {cl.phone || 'N/A'}</div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenPermissionStudio(cl)}
                    className="flex-1 py-2 rounded-xl bg-surface-variant hover:bg-surface-variant/80 text-on-surface font-medium text-xs transition-colors cursor-pointer"
                  >
                    Permissions ({cl.permissions?.length || 0})
                  </button>
                  <button
                    onClick={() => handleOpenEditUser(cl)}
                    className="p-2 rounded-xl bg-surface-variant hover:bg-surface-variant/80 text-on-surface transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
              </div>
            ))}

            {clientsList.length === 0 && (
              <div className="col-span-3 text-center py-12 text-on-surface-variant text-sm bg-surface rounded-2xl border border-outline-variant/40">
                No institutional clients registered. Click "Onboard Client Account" to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: ALL USERS TABLE & CONTROLS */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-display text-on-surface">User Accounts & Directory</h2>
              <p className="text-sm text-on-surface-variant">
                Manage all system users across roles, toggle statuses, and reset credentials securely.
              </p>
            </div>

            <button
              onClick={() => {
                setCreateRole('user');
                setShowCreateModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-medium text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Add User Account
            </button>
          </div>

          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-surface border border-outline-variant/40 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-72 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search name, email, scope..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm font-medium text-on-surface cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="client">Client</option>
                <option value="author">Author</option>
                <option value="scholar">Scholar</option>
                <option value="reviewer">Reviewer</option>
                <option value="faculty">Faculty</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm font-medium text-on-surface cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="DISABLED">Disabled</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl bg-surface border border-outline-variant/40 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-variant/40 text-on-surface-variant font-semibold text-xs uppercase tracking-wider border-b border-outline-variant/40">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Scope</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-variant/20 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-on-surface flex items-center gap-1.5">
                          {u.name}
                          {u.isPrimarySuperAdmin && (
                            <span className="material-symbols-outlined text-amber-500 text-sm" title="Primary Super Admin">
                              workspace_premium
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-on-surface-variant font-mono">{u.email}</div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded bg-surface-variant font-bold text-xs uppercase text-on-surface">
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-xs text-on-surface-variant">
                        {u.scopeId || 'default'}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="p-4 text-xs font-mono text-on-surface-variant">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenPermissionStudio(u)}
                          className="px-2.5 py-1 rounded-lg bg-surface-variant hover:bg-surface-variant/80 text-xs font-medium cursor-pointer"
                        >
                          Rights
                        </button>

                        <button
                          onClick={() => handleResetUserPassword(u)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium cursor-pointer"
                          title="Reset Password"
                        >
                          Reset Pass
                        </button>

                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GRANULAR PERMISSION MATRIX STUDIO */}
      {activeTab === 'permissions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-display text-on-surface">Granular Permission Matrix Studio</h2>
              <p className="text-sm text-on-surface-variant">
                Configure explicit 10-category permissions for administrators and clients.
              </p>
            </div>

            {selectedUserForPerms && (
              <button
                onClick={handleSaveUserPermissions}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">save</span>
                Save Matrix for {selectedUserForPerms.name}
              </button>
            )}
          </div>

          {/* User Selector for Permission Matrix */}
          <div className="p-5 rounded-2xl bg-surface border border-outline-variant/40 space-y-4">
            <label className="text-sm font-semibold text-on-surface block">Target Account for Permission Configuration:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedUserForPerms?.id || ''}
                onChange={(e) => {
                  const u = users.find((x) => x.id === e.target.value);
                  if (u) {
                    setSelectedUserForPerms(u);
                    setSelectedUserPerms(u.permissions || []);
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm font-medium text-on-surface cursor-pointer"
              >
                <option value="">-- Select Administrator / Account --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role.toUpperCase()}) — {u.email}
                  </option>
                ))}
              </select>

              {/* Preset Templates */}
              <div className="col-span-2 flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">Apply Presets:</span>
                <button
                  onClick={() => applyPresetPermissions('full_admin')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold text-xs whitespace-nowrap cursor-pointer"
                >
                  Full Admin Template
                </button>
                <button
                  onClick={() => applyPresetPermissions('content_manager')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs whitespace-nowrap cursor-pointer"
                >
                  Content Manager
                </button>
                <button
                  onClick={() => applyPresetPermissions('financial_verifier')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold text-xs whitespace-nowrap cursor-pointer"
                >
                  Financial Verifier
                </button>
                <button
                  onClick={() => applyPresetPermissions('client_lead')}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold text-xs whitespace-nowrap cursor-pointer"
                >
                  Client Lead
                </button>
              </div>
            </div>
          </div>

          {/* 10 Granular Permission Groups */}
          {selectedUserForPerms ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PERMISSION_GROUPS.map((group) => {
                const groupPermIds = group.permissions.map((p) => p.id);
                const allSelected = groupPermIds.every((id) => selectedUserPerms.includes(id));
                const someSelected = groupPermIds.some((id) => selectedUserPerms.includes(id));

                return (
                  <div key={group.id} className="p-6 rounded-2xl bg-surface border border-outline-variant/40 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[22px]">{group.icon}</span>
                        <h3 className="font-bold text-on-surface text-base">{group.name}</h3>
                      </div>

                      <button
                        onClick={() => handleSelectCategoryPermissions(groupPermIds, !allSelected)}
                        className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                      >
                        {allSelected ? 'Deselect Category' : 'Select Category'}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {group.permissions.map((perm) => {
                        const isChecked = selectedUserPerms.includes(perm.id);
                        return (
                          <label
                            key={perm.id}
                            className={`p-3 rounded-xl border transition-colors flex items-start gap-3 cursor-pointer ${
                              isChecked
                                ? 'bg-primary/5 border-primary/40'
                                : 'bg-surface-variant/20 border-outline-variant/20 hover:bg-surface-variant/40'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePermission(perm.id)}
                              className="mt-0.5 rounded text-primary focus:ring-primary/40 w-4 h-4 cursor-pointer"
                            />
                            <div className="space-y-0.5">
                              <div className="text-sm font-semibold text-on-surface flex items-center gap-2">
                                {perm.label}
                                <span className="text-[11px] font-mono text-on-surface-variant/70">({perm.id})</span>
                              </div>
                              <p className="text-xs text-on-surface-variant">{perm.description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-on-surface-variant text-base bg-surface rounded-2xl border border-outline-variant/40">
              Select an account from the dropdown above to edit its granular permission matrix.
            </div>
          )}
        </div>
      )}

      {/* TAB 7: IMMUTABLE AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold font-display text-on-surface">Security Audit Trail</h2>
            <p className="text-sm text-on-surface-variant">
              Immutable server-side record of all administrative, security, and permission events.
            </p>
          </div>

          <div className="rounded-2xl bg-surface border border-outline-variant/40 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-variant/40 text-on-surface-variant font-semibold text-xs uppercase tracking-wider border-b border-outline-variant/40">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Target</th>
                    <th className="p-4">Details</th>
                    <th className="p-4">Result</th>
                    <th className="p-4">Client IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-variant/20 transition-colors">
                      <td className="p-4 text-xs font-mono text-on-surface-variant whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-on-surface text-xs">{log.performedByUserName}</div>
                        <div className="text-[11px] font-mono text-on-surface-variant">{log.performedByUserRole}</div>
                      </td>

                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {log.action}
                        </span>
                      </td>

                      <td className="p-4 text-xs">
                        <div className="font-semibold text-on-surface">{log.target}</div>
                        <div className="text-[11px] font-mono text-on-surface-variant">{log.targetName || log.targetId}</div>
                      </td>

                      <td className="p-4 text-xs text-on-surface-variant max-w-xs truncate">
                        {log.details}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            log.result === 'SUCCESS'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : log.result === 'DENIED'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {log.result}
                        </span>
                      </td>

                      <td className="p-4 text-xs font-mono text-on-surface-variant">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE USER / ADMIN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-outline-variant/40 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <h3 className="text-xl font-bold font-display text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span>
                Provision New {createRole.toUpperCase()} Account
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {createError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="e.g. Ato Muktar Ahmed"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    placeholder="admin@wki.edu.et"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Initial Password *</label>
                  <input
                    type="password"
                    required
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Target Role *</label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm font-medium cursor-pointer"
                  >
                    <option value="admin">Administrator (Admin)</option>
                    <option value="client">Client (Corporate/Institutional)</option>
                    <option value="author">Author</option>
                    <option value="scholar">Scholar</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="faculty">Faculty</option>
                    {isPrimarySuperAdmin && <option value="superadmin">Super Admin (Protected)</option>}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Tenant / Scope ID</label>
                  <input
                    type="text"
                    value={createScopeId}
                    onChange={(e) => setCreateScopeId(e.target.value)}
                    placeholder="scope-alpha"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    placeholder="+251 911 ..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-variant text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-outline-variant/40 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <h3 className="text-lg font-bold font-display text-on-surface">
                Edit User Details: {editingUser.name}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEditedUser} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">Phone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as UserStatus)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="DISABLED">DISABLED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">Scope ID</label>
                <input
                  type="text"
                  value={editScopeId}
                  onChange={(e) => setEditScopeId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant/30 text-sm"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-variant text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD RESET RESULT MODAL */}
      {resetResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-amber-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <span className="material-symbols-outlined text-amber-500 text-4xl">key</span>
            <h3 className="text-lg font-bold font-display text-on-surface">Temporary Password Generated</h3>
            <p className="text-xs text-on-surface-variant">Please provide this temporary password to the user:</p>
            <div className="p-3 bg-surface-variant rounded-xl font-mono text-lg font-bold text-amber-600 dark:text-amber-400 select-all">
              {resetResult.tempPass}
            </div>
            <button
              onClick={() => setResetResult(null)}
              className="px-6 py-2 rounded-xl bg-primary text-on-primary font-semibold text-sm cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
