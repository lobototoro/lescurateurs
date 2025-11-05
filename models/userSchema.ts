import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().optional(),
  email: z
    .email({ message: 'Adresse email invalide' })
    .min(1, { message: 'Email requis' })
    .trim(),
  tiers_service_ident: z.string().min(1, { message: 'Champ requis' }).trim(),
  role: z.enum(['admin', 'contributor']),
  created_at: z.string().optional(),
  last_connection_at: z.string().optional(),
  permissions: z.string(),
  updated_at: z.string().optional().nullable(),
  updated_by: z.string().optional().nullable(),
});
