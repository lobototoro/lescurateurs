import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().optional(),
  email: z
    .email({ message: 'Adresse email invalide' })
    .min(1, { message: 'Email requis' })
    .trim(),
  tiersServiceIdent: z.string().min(1, { message: 'Champ requis' }).trim(),
  role: z.enum(['admin', 'contributor']),
  createdAt: z.string().trim(),
  lastConnectionAt: z.string().trim(),
  permissions: z.string(),
  updatedAt: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});
