import { z } from "zod";

export const userSchema = z.object({
  id: z.number().optional(),
  email: z.string().min(1, { message: 'Email requis' }).email({ message: 'Mauvais format d\'email' }).trim(),
  tiersServiceIdent: z.string().min(1, { message: 'Champ requis' }).trim(),
  role: z.enum(['admin', 'contributor']),
  createdAt: z.string().trim(),
  lastConnectionAt: z.string().trim(),
  permissions: z.string(),
});