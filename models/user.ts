export interface User {
  id?: number | bigint;
  email: string;
  tiersServiceIdent: string;
  role: string;
  permissions: string;
  createdAt: string;
  lastConnectionAt: string;
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
  'enable:maintenance'
];

export const contributorPermissions = [
  'read:articles',
  'create:articles',
  'update:articles',
  'validate:articles'
];