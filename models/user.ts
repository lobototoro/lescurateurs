export interface User {
  id?: number | bigint;
  email: string;
  tiers_service_ident: string;
  role: string;
  permissions: string;
  created_at: string;
  last_connection_at: string;
  updated_at?: string | null;
  updated_by?: string | null;
}

export enum UserRole {
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor',
}
export const userRoles = Object.values(UserRole);

export const adminPermissions = [
  'read:articles',
  'create:articles',
  'update:articles',
  'delete:articles',
  'validate:articles',
  'ship:articles',
  'create:user',
  'update:user',
  'delete:user',
  'enable:maintenance',
];

export const contributorPermissions = [
  'read:articles',
  'create:articles',
  'update:articles',
  'validate:articles',
];
