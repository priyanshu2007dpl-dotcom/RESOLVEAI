// ResolveAI — Shared Types
// Used by both frontend and backend for type-safe contracts.

export type UserRole = 'CUSTOMER' | 'SUPPORT_AGENT' | 'SUPPORT_MANAGER' | 'ADMIN';

export const USER_ROLES: UserRole[] = [
  'CUSTOMER',
  'SUPPORT_AGENT',
  'SUPPORT_MANAGER',
  'ADMIN',
];

export const ROLE_LABELS: Record<UserRole, string> = {
  CUSTOMER: 'Customer',
  SUPPORT_AGENT: 'Support Agent',
  SUPPORT_MANAGER: 'Support Manager',
  ADMIN: 'Administrator',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  CUSTOMER: 'Can submit tickets and track their own cases',
  SUPPORT_AGENT: 'Can handle assigned tickets and investigate cases',
  SUPPORT_MANAGER: 'Can oversee all tickets, manage agents, and escalate',
  ADMIN: 'Full system access including user management and configuration',
};

// --- Auth Types ---

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
  createdAt: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: unknown;
  error: string | null;
}

// --- API Types ---

export interface ApiError {
  error: string;
  code: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  service: string;
  timestamp: string;
  version: string;
  checks?: Record<string, boolean>;
}

// --- RBAC Permission Types ---

export type Permission =
  | 'ticket:create'
  | 'ticket:read:own'
  | 'ticket:read:all'
  | 'ticket:update:own'
  | 'ticket:update:all'
  | 'case:investigate'
  | 'case:escalate'
  | 'user:manage'
  | 'analytics:read'
  | 'system:configure';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CUSTOMER: ['ticket:create', 'ticket:read:own', 'ticket:update:own'],
  SUPPORT_AGENT: ['ticket:read:all', 'ticket:update:all', 'case:investigate'],
  SUPPORT_MANAGER: [
    'ticket:read:all',
    'ticket:update:all',
    'case:investigate',
    'case:escalate',
    'analytics:read',
  ],
  ADMIN: [
    'ticket:read:all',
    'ticket:update:all',
    'case:investigate',
    'case:escalate',
    'user:manage',
    'analytics:read',
    'system:configure',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
