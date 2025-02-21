export interface User {
  id: number;
  email: string;
  tiersServiceIdent: string;
  role: string;
  permissions: string;
  createdAt: string;
  lastConnectionAt: string;
}