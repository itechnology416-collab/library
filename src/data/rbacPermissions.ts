import { GranularPermission, PermissionCategoryGroup } from '../types';

export const ALL_PERMISSIONS: GranularPermission[] = [
  // User Management
  'users.view',
  'users.create',
  'users.edit',
  'users.delete',
  'users.suspend',
  'users.activate',
  'users.reset_password',

  // Administrator Management
  'admins.view',
  'admins.create',
  'admins.edit',
  'admins.delete',
  'admins.suspend',
  'admins.activate',
  'admins.permissions',

  // Client Management
  'clients.view',
  'clients.create',
  'clients.edit',
  'clients.delete',
  'clients.suspend',
  'clients.activate',

  // Content Management
  'content.view',
  'content.create',
  'content.edit',
  'content.delete',
  'content.publish',

  // Digital Resources
  'resources.view',
  'resources.upload',
  'resources.edit',
  'resources.delete',
  'resources.publish',
  'resources.download',

  // Sales
  'sales.view',
  'sales.create',
  'sales.edit',
  'sales.refund',

  // Payments
  'payments.view',
  'payments.verify',
  'payments.approve',
  'payments.reject',

  // Download Access
  'downloads.view',
  'downloads.approve',
  'downloads.revoke',

  // Reports
  'reports.view',
  'reports.export',

  // System
  'settings.view',
  'settings.edit',
  'audit_logs.view',
  'notifications.manage',
];

export const PERMISSION_GROUPS: PermissionCategoryGroup[] = [
  {
    id: 'user_management',
    name: 'User Management',
    icon: 'group',
    permissions: [
      { id: 'users.view', label: 'View Users', description: 'View standard user profiles and accounts' },
      { id: 'users.create', label: 'Create Users', description: 'Register and create new user accounts' },
      { id: 'users.edit', label: 'Edit Users', description: 'Update profile info and preferences' },
      { id: 'users.delete', label: 'Delete Users', description: 'Remove user accounts from system' },
      { id: 'users.suspend', label: 'Suspend Users', description: 'Temporarily lock and suspend user access' },
      { id: 'users.activate', label: 'Activate Users', description: 'Restore and activate pending/suspended users' },
      { id: 'users.reset_password', label: 'Reset Password', description: 'Trigger or set new temporary passwords' },
    ],
  },
  {
    id: 'admin_management',
    name: 'Administrator Management',
    icon: 'admin_panel_settings',
    permissions: [
      { id: 'admins.view', label: 'View Administrators', description: 'View list of system administrators' },
      { id: 'admins.create', label: 'Create Administrators', description: 'Provision new admin accounts' },
      { id: 'admins.edit', label: 'Edit Administrators', description: 'Modify administrator details & scopes' },
      { id: 'admins.delete', label: 'Delete Administrators', description: 'Remove administrator accounts' },
      { id: 'admins.suspend', label: 'Suspend Administrators', description: 'Suspend administrator permissions' },
      { id: 'admins.activate', label: 'Activate Administrators', description: 'Reactivate suspended admin accounts' },
      { id: 'admins.permissions', label: 'Manage Permissions', description: 'Assign and revoke granular permissions' },
    ],
  },
  {
    id: 'client_management',
    name: 'Client Management',
    icon: 'domain',
    permissions: [
      { id: 'clients.view', label: 'View Clients', description: 'View institutional and corporate client accounts' },
      { id: 'clients.create', label: 'Create Clients', description: 'Onboard new institutional clients' },
      { id: 'clients.edit', label: 'Edit Clients', description: 'Update client details and agreements' },
      { id: 'clients.delete', label: 'Delete Clients', description: 'Remove client accounts' },
      { id: 'clients.suspend', label: 'Suspend Clients', description: 'Suspend client access & user sub-accounts' },
      { id: 'clients.activate', label: 'Activate Clients', description: 'Reactivate suspended client accounts' },
    ],
  },
  {
    id: 'content_management',
    name: 'Content Management',
    icon: 'article',
    permissions: [
      { id: 'content.view', label: 'View Content', description: 'Access articles, posts, and publications' },
      { id: 'content.create', label: 'Create Content', description: 'Draft new publications and announcements' },
      { id: 'content.edit', label: 'Edit Content', description: 'Modify existing articles and monographs' },
      { id: 'content.delete', label: 'Delete Content', description: 'Archive or remove published content' },
      { id: 'content.publish', label: 'Publish Content', description: 'Approve and publish content publicly' },
    ],
  },
  {
    id: 'digital_resources',
    name: 'Digital Resources',
    icon: 'folder_zip',
    permissions: [
      { id: 'resources.view', label: 'View Resources', description: 'Browse digital asset catalog (PDF, PPT, Audio, Video)' },
      { id: 'resources.upload', label: 'Upload Resources', description: 'Upload new downloadable digital assets' },
      { id: 'resources.edit', label: 'Edit Resources', description: 'Update metadata, price, and version files' },
      { id: 'resources.delete', label: 'Delete Resources', description: 'Remove resources from catalog' },
      { id: 'resources.publish', label: 'Publish Resources', description: 'Toggle store visibility and release' },
      { id: 'resources.download', label: 'Direct Download', description: 'Direct download without payment requirements' },
    ],
  },
  {
    id: 'sales',
    name: 'Sales & Orders',
    icon: 'shopping_bag',
    permissions: [
      { id: 'sales.view', label: 'View Sales', description: 'View store order history and sales metrics' },
      { id: 'sales.create', label: 'Create Orders', description: 'Manually generate custom orders' },
      { id: 'sales.edit', label: 'Edit Orders', description: 'Modify order items and totals' },
      { id: 'sales.refund', label: 'Issue Refunds', description: 'Process order cancellations & refunds' },
    ],
  },
  {
    id: 'payments',
    name: 'Payments & Verification',
    icon: 'payments',
    permissions: [
      { id: 'payments.view', label: 'View Payments', description: 'View CBE, Telebirr, Safaricom receipt logs' },
      { id: 'payments.verify', label: 'Verify Payments', description: 'Inspect bank receipt transaction reference' },
      { id: 'payments.approve', label: 'Approve Payments', description: 'Approve payment & grant product access' },
      { id: 'payments.reject', label: 'Reject Payments', description: 'Reject invalid payment submissions' },
    ],
  },
  {
    id: 'download_access',
    name: 'Download Access Control',
    icon: 'vpn_key',
    permissions: [
      { id: 'downloads.view', label: 'View Permissions', description: 'Audit granted download waivers & permissions' },
      { id: 'downloads.approve', label: 'Approve Download Access', description: 'Grant download access manually' },
      { id: 'downloads.revoke', label: 'Revoke Download Access', description: 'Cancel active download permissions' },
    ],
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    icon: 'analytics',
    permissions: [
      { id: 'reports.view', label: 'View Reports', description: 'Access platform analytics and financial summaries' },
      { id: 'reports.export', label: 'Export Reports', description: 'Export audit data and sales reports as CSV/PDF' },
    ],
  },
  {
    id: 'system',
    name: 'System & Security',
    icon: 'settings',
    permissions: [
      { id: 'settings.view', label: 'View Settings', description: 'View global platform settings' },
      { id: 'settings.edit', label: 'Edit Settings', description: 'Modify system defaults and notice banners' },
      { id: 'audit_logs.view', label: 'View Audit Logs', description: 'Access comprehensive security audit trail' },
      { id: 'notifications.manage', label: 'Manage Notifications', description: 'Send broadcasts and alerts' },
    ],
  },
];
