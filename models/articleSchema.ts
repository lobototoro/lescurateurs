import { z } from 'zod';
import { UrlsTypes } from './article';

const urlsTypes = z.enum(UrlsTypes);

const urlLinksSchema = z.object({
  type: urlsTypes,
  url: z.string(),
  credits: z.string().optional(),
});

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
  urls: z.array(urlLinksSchema).optional(),
  main_audio_url: z
    .string()
    .trim()
    .min(10, "L'URL audio doit avoir au moins 10 caractères"),
  url_to_main_illustration: z
    .string()
    .trim()
    .min(10, "L'URL d'illustration doit avoir au moins 10 caractères"),
  author: z.string().trim().optional(),
  author_email: z.email().trim().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional().nullable(),
  updated_by: z.string().optional().nullable(),
  published_at: z.string().optional().nullable(),
  validated: z.boolean().optional(),
  shipped: z.boolean().optional(),
});
