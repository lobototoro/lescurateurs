'use server';
import sql from 'better-sqlite3';

import { Article } from '@/models/article';
import { Slugs } from '@/models/slugs';

// import slugify from 'slugify';
// import xss from 'xss';

const db = sql('lcfr.db');

export const getArticle = async (slug: string) => {
  return db
    .prepare("SELECT * FROM articles WHERE slug = ? AND validated = 'true' ")
    .get(slug);
};

export const getArticleById = async (id: number | bigint) => {
  return db.prepare('SELECT * FROM articles WHERE id =?').get(id);
};

export const getSlugs = async () => {
  return db.prepare("SELECT * FROM slugs WHERE validated='true'").all();
};

export const createSlug = async (slugObject: Slugs) => {
  return db
    .prepare(
      'INSERT INTO slugs (slug, createdAt, articleId, validated) VALUES (@slug, @createdAt, @articleId, @validated)'
    )
    .run(slugObject);
};

export const createArticle = async (article: Article) => {
  return db
    .prepare(
      'INSERT INTO articles (slug, title, introduction, main, urls, mainAudioUrl, urlToMainIllustration, author, author_email, createdAt, updatedAt, publishedAt, validated, shipped) VALUES (@slug, @title, @introduction, @main, @urls, @mainAudioUrl, @urlToMainIllustration, @author, @author_email, @createdAt, @updatedAt, @publishedAt, @validated, @shipped)'
    )
    .run(article);
};

export const searchSlugs = async (searchTerm: string) => {
  return db
    .prepare('SELECT * FROM slugs WHERE slug LIKE @searchTerm')
    .all({ searchTerm: `%${searchTerm}%` });
};

export const searchArticles = async (searchTerm: string) => {
  return db
    .prepare('SELECT * FROM articles WHERE slug LiKE @searchTerm')
    .all({ searchTerm: `%${searchTerm}%` });
};

export const deleteArticle = async (articleId: number | bigint) => {
  return db.prepare('DELETE FROM articles WHERE id = ?').run(articleId);
};

export const deleteSlug = async (slugId: number | bigint) => {
  return db.prepare('DELETE FROM slugs WHERE articleId = ?').run(slugId);
};

export const updateArticle = async (article: Article) => {
  return db
    .prepare(
      'UPDATE articles SET title = @title, introduction = @introduction, main = @main, urls = @urls, mainAudioUrl = @mainAudioUrl, urlToMainIllustration = @urlToMainIllustration, createdAt = @createdAt, updatedAt = @updatedAt, publishedAt = @publishedAt, validated = @validated, shipped = @shipped, author = @author, author_email = @author_email, slug = @slug WHERE id = @id'
    )
    .run(article);
};

export const updateSlug = async (validatedArgs: Slugs) => {
  return db
    .prepare(
      'UPDATE slugs SET slug = @slug, createdAt = @createdAt, articleId = @articleId, validated = @validated WHERE id = @id'
    )
    .run(validatedArgs);
};

export const validateArticle = async (validateProps: {
  articleId: number | bigint;
  validatedValue: string;
  updatedAt: string;
}) => {
  return db
    .prepare(
      'UPDATE articles SET validated = @validatedValue, updatedAt = @updatedAt WHERE id = @articleId'
    )
    .run(validateProps);
};

export const validateSlugField = async (validateProps: {
  slugId: number | bigint;
  validatedValue: string;
}) => {
  return db
    .prepare('UPDATE slugs SET validated = @validatedValue WHERE id = @slugId')
    .run(validateProps);
};

export const shipArticle = async (shipProps: {
  articleId: number | bigint;
  shippedValue: string;
  updatedAt: string;
}) => {
  return db
    .prepare(
      'UPDATE articles SET shipped = @shippedValue, updatedAt = @updatedAt WHERE id = @articleId'
    )
    .run(shipProps);
};
