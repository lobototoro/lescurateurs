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
  urls: z.any().optional(),
  main_audio_url: z.string().trim(),
  url_to_main_illustration: z
    .string()
    .trim()
    .min(1, 'Au moins un lien est requis'),
  author: z.string().trim(),
  author_email: z.email().trim(),
  created_at: z.date(),
  updated_at: z.date().optional().nullable(),
  updated_by: z.string().optional().nullable(),
  published_at: z.date().optional().nullable(),
  validated: z.boolean().optional(),
  shipped: z.boolean().optional(),
});
