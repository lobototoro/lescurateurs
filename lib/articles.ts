"use server";
import sql from 'better-sqlite3';
import { cache } from 'react';

import { Article } from '@/models/article';
import { Slugs } from '@/models/slugs';

// import slugify from 'slugify';
// import xss from 'xss';

const db = sql('lcfr.db');

export const getArticle = cache(async (slug: string) => {
  return db
    .prepare('SELECT * FROM articles WHERE slug = ?')
    .get(slug);
});

export const getArticleById = cache(async (id: number | bigint) =>{
  return db
    .prepare('SELECT * FROM articles WHERE id =?')
    .get(id);
});

export const getSlugs = cache(async () => {
  return db
    .prepare('SELECT * FROM slugs')
    .all();
});

export const createSlug = cache(async (slugObject: Slugs) => {
  return db.prepare('INSERT INTO slugs (slug, createdAt, articleId) VALUES (@slug, @createdAt, @articleId)')
    .run(slugObject);
});

export const createArticle = cache(async (article: Article) => {
  return db.prepare('INSERT INTO articles (slug, title, introduction, main, urls, mainAudioUrl, urlToMainIllustration, author, author_email, createdAt, updatedAt, publishedAt, validated, shipped) VALUES (@slug, @title, @introduction, @main, @urls, @mainAudioUrl, @urlToMainIllustration, @author, @author_email, @createdAt, @updatedAt, @publishedAt, @validated, @shipped)') 
    .run(article);
});

export const searchSlugs = cache(async (searchTerm: string) => {
  return db
    .prepare('SELECT * FROM slugs WHERE slug LIKE @searchTerm')
    .all({ searchTerm: `%${searchTerm}%` });
});

export const searchArticles = cache(async (searchTerm: string) => {
  return db
    .prepare('SELECT * FROM articles WHERE slug LiKE @searchTerm')
    .all({ searchTerm: `%${searchTerm}%` });
});

export const deleteArticle = cache (async(articleId: number | bigint) => {
  return db.prepare('DELETE FROM articles WHERE id = ?')
    .run(articleId);
});

export const updateArticle = cache(async (article: Article) => {
  return db.prepare('UPDATE articles SET title = @title, introduction = @introduction, main = @main, urls = @urls, mainAudioUrl = @mainAudioUrl, urlToMainIllustration = @urlToMainIllustration, createdAt = @createdAt, updatedAt = @updatedAt, publishedAt = @publishedAt, validated = @validated, shipped = @shipped, author = @author, author_email = @author_email, slug = @slug WHERE id = @id')
  .run(article);
});