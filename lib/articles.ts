'use server';
import sql from 'better-sqlite3';

import { Article } from '@/models/article';
import { Slugs } from '@/models/slugs';

const db = sql('lcfr.db');

export const getArticle = async (slug: string) => {
  try {
    return db
      .prepare("SELECT * FROM articles WHERE slug = ? AND validated = 'true'")
      .get(slug);
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    throw new Error('Failed to fetch article');
  }
};

export const getArticleById = async (id: number | bigint) => {
  try {
    return db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    throw new Error('Failed to fetch article');
  }
};

export const getSlugs = async () => {
  try {
    return db.prepare("SELECT * FROM slugs WHERE validated='true'").all();
  } catch (error) {
    console.error('Error fetching slugs:', error);
    throw new Error('Failed to fetch slug');
  }
};

export const createSlug = async (slugObject: Slugs) => {
  try {
    return db
      .prepare(
        'INSERT INTO slugs (slug, createdAt, articleId, validated) VALUES (@slug, @createdAt, @articleId, @validated)'
      )
      .run(slugObject);
  } catch (error) {
    console.error('Error creating slug:', error);
    throw new Error('Failed to create slug');
  }
};

export const createArticle = async (article: Article) => {
  try {
    return db
      .prepare(
        'INSERT INTO articles (slug, title, introduction, main, urls, mainAudioUrl, urlToMainIllustration, author, author_email, createdAt, updatedAt, publishedAt, validated, shipped) VALUES (@slug, @title, @introduction, @main, @urls, @mainAudioUrl, @urlToMainIllustration, @author, @author_email, @createdAt, @updatedAt, @publishedAt, @validated, @shipped)'
      )
      .run(article);
  } catch (error) {
    console.error('Error creating article:', error);
    throw new Error('Failed to create article');
  }
};

export const searchSlugs = async (searchTerm: string) => {
  try {
    return db
      .prepare('SELECT * FROM slugs WHERE slug LIKE @searchTerm')
      .all({ searchTerm: `%${searchTerm}%` });
  } catch (error) {
    console.error('Error searching slugs:', error);
    throw new Error('Failed to search slugs');
  }
};

export const searchArticles = async (searchTerm: string) => {
  try {
    return db
      .prepare('SELECT * FROM articles WHERE slug LIKE @searchTerm')
      .all({ searchTerm: `%${searchTerm}%` });
  } catch (error) {
    console.error('Error searching articles:', error);
    throw new Error('Failed to search articles');
  }
};

export const deleteArticle = async (articleId: number | bigint) => {
  try {
    return db.prepare('DELETE FROM articles WHERE id = ?').run(articleId);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw new Error('Failed to delete article');
  }
};

export const deleteSlug = async (slugId: number | bigint) => {
  try {
    return db.prepare('DELETE FROM slugs WHERE articleId = ?').run(slugId);
  } catch (error) {
    console.error('Error deleting slug:', error);
    throw new Error('Failed to delete slug');
  }
};

export const updateArticle = async (article: Article) => {
  try {
    return db
      .prepare(
        'UPDATE articles SET title = @title, introduction = @introduction, main = @main, urls = @urls, mainAudioUrl = @mainAudioUrl, urlToMainIllustration = @urlToMainIllustration, createdAt = @createdAt, updatedAt = @updatedAt, publishedAt = @publishedAt, validated = @validated, shipped = @shipped, author = @author, author_email = @author_email, slug = @slug WHERE id = @id'
      )
      .run(article);
  } catch (error) {
    console.error('Error updating article:', error);
    throw new Error('Failed to update article');
  }
};

export const updateSlug = async (validatedArgs: Slugs) => {
  try {
    return db
      .prepare(
        'UPDATE slugs SET slug = @slug, createdAt = @createdAt, articleId = @articleId, validated = @validated WHERE id = @id'
      )
      .run(validatedArgs);
  } catch (error) {
    console.error('Error updating slug:', error);
    throw new Error('Failed to update slug');
  }
};

export const validateArticle = async (validateProps: {
  articleId: number | bigint;
  validatedValue: string;
  updatedAt: string;
}) => {
  try {
    return db
      .prepare(
        'UPDATE articles SET validated = @validatedValue, updatedAt = @updatedAt WHERE id = @articleId'
      )
      .run(validateProps);
  } catch (error) {
    console.error('Error validating article:', error);
    throw new Error('Failed to validate article');
  }
};

export const validateSlugField = async (validateProps: {
  slugId: number | bigint;
  validatedValue: string;
}) => {
  try {
    return db
      .prepare(
        'UPDATE slugs SET validated = @validatedValue WHERE id = @slugId'
      )
      .run(validateProps);
  } catch (error) {
    console.error('Error validating slug:', error);
    throw new Error('Failed to validate slug');
  }
};

export const shipArticle = async (shipProps: {
  articleId: number | bigint;
  shippedValue: string;
  updatedAt: string;
}) => {
  try {
    return db
      .prepare(
        'UPDATE articles SET shipped = @shippedValue, updatedAt = @updatedAt WHERE id = @articleId'
      )
      .run(shipProps);
  } catch (error) {
    console.error('Error shipping article:', error);
    throw new Error('Failed to ship article');
  }
};
