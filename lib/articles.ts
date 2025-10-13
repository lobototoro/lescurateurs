'use server';

import { Article } from '@/models/article';
import { Slugs } from '@/models/slugs';

import { executeQuery } from './db-utilities';

export const getArticle = async (slug: string) => {
  return executeQuery(
    'get article by slug',
    "SELECT * FROM articles WHERE slug = ? AND validated = 'true'",
    'get',
    slug
  );
};

export const getArticleById = async (id: number | bigint) => {
  return executeQuery(
    'get article by ID',
    'SELECT * FROM articles WHERE id = ?',
    'get',
    id
  );
};

export const getSlugs = async () => {
  return executeQuery(
    'get slugs',
    "SELECT * FROM slugs WHERE validated = 'true'",
    'all'
  );
};

export const createSlug = async (slugObject: Slugs) => {
  return executeQuery(
    'create slug',
    'INSERT INTO slugs (slug, created_at, article_id, validated) VALUES (@slug, @created_at, @article_id, @validated)',
    'run',
    slugObject
  );
};

export const createArticle = async (article: Article) => {
  return executeQuery(
    'create article',
    'INSERT INTO articles (slug, title, introduction, main, urls, main_audio_url, url_to_main_illustration, author, author_email, created_at, updated_at, updated_by, published_at, validated, shipped) VALUES (@slug, @title, @introduction, @main, @urls, @main_audio_url, @url_to_main_illustration, @author, @author_email, @created_at, @updated_at, @updated_by, @published_at, @validated, @shipped)',
    'run',
    article
  );
};

export const searchSlugs = async (searchTerm: string) => {
  return executeQuery(
    'search slugs',
    'SELECT * FROM slugs WHERE slug LIKE @searchTerm',
    'all',
    { searchTerm: `%${searchTerm}%` }
  );
};

export const searchArticles = async (searchTerm: string) => {
  return executeQuery(
    'search articles',
    'SELECT * FROM articles WHERE slug LIKE @searchTerm',
    'all',
    { searchTerm: `%${searchTerm}%` }
  );
};

export const deleteArticle = async (article_id: number | bigint) => {
  return executeQuery(
    'delete article',
    'DELETE FROM articles WHERE id = ?',
    'run',
    article_id
  );
};

export const deleteSlug = async (slugId: number | bigint) => {
  return executeQuery(
    'delete slug',
    'DELETE FROM slugs WHERE article_id = ?',
    'run',
    slugId
  );
};

export const updateArticle = async (article: Article) => {
  return executeQuery(
    'update article',
    'UPDATE articles SET title = @title, introduction = @introduction, main = @main, urls = @urls, main_audio_url = @main_audio_url, url_to_main_illustration = @url_to_main_illustration, created_at = @created_at, updated_at = @updated_at, updated_by = @updated_by, published_at = @published_at, validated = @validated, shipped = @shipped, author = @author, author_email = @author_email, slug = @slug WHERE id = @id',
    'run',
    article
  );
};

export const updateSlug = async (validatedArgs: Slugs) => {
  return executeQuery(
    'update slug',
    'UPDATE slugs SET slug = @slug, created_at = @created_at, article_id = @article_id, validated = @validated WHERE id = @id',
    'run',
    validatedArgs
  );
};

export const validateArticle = async (validateProps: {
  article_id: number | bigint;
  validatedValue: string;
  updated_at: string;
  updated_by: string;
}) => {
  return executeQuery(
    'validate article',
    'UPDATE articles SET validated = @validatedValue, updated_at = @updated_at, updated_by = @updated_by WHERE id = @article_id',
    'run',
    validateProps
  );
};

export const validateSlugField = async (validateProps: {
  slugId: number | bigint;
  validatedValue: string;
}) => {
  return executeQuery(
    'validate slug',
    'UPDATE slugs SET validated = @validatedValue WHERE id = @slugId',
    'run',
    validateProps
  );
};

export const shipArticle = async (shipProps: {
  article_id: number | bigint;
  shippedValue: string;
  updated_at: string;
  updated_by: string;
}) => {
  return executeQuery(
    'ship article',
    'UPDATE articles SET shipped = @shippedValue, updated_at = @updated_at, updated_by = @updated_by WHERE id = @article_id',
    'run',
    shipProps
  );
};
