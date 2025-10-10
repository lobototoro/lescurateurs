import { z } from 'zod';

export const articleSchema = z.object({
  id: z.number().optional(),
  slug: z
    .string()
    .trim()
    .max(50, 'Le slug ne doit pas avoir plus de 50 caractères')
    .min(2, 'Le slug doit avoir au moins 2 caractères')
    .optional(),
  title: z
    .string()
    .trim()
    .max(50, 'Le titre ne doit pas dépasser 50 caractères')
    .min(2, 'Le titre doit avoir au moins 2 caractères'),
  introduction: z
    .string()
    .trim()
    .min(20, 'L’introduction doit avoir au moins 20 caractères'),
  main: z
    .string()
    .trim()
    .min(50, 'Le texte principal doit avoir au moins 50 caractères'),
  urls: z.string().trim(),
  mainAudioUrl: z.string().trim(),
  urlToMainIllustration: z
    .string()
    .trim()
    .min(1, 'Au moins un lien est requis'),
  author: z.string().trim().optional(),
  author_email: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional().nullable(),
  publishedAt: z.string().optional(),
  validated: z.string().optional(),
  shipped: z.string().optional(),
});
