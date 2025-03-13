import 'server-only';

// import fs from 'node:fs';
import sql from 'better-sqlite3';
import { Article } from '@/models/article';
import { Slugs } from '@/models/slugs';

// import slugify from 'slugify';
// import xss from 'xss';

const db = sql('lcfr.db');

export async function getArticle(slug: string) {
  return db
    .prepare('SELECT * FROM articles WHERE slug = ?')
    .get(slug);
}

export async function getSlugs() {
  return db
    .prepare('SELECT * FROM slugs')
    .all();
}

export async function createSlug(slugObject: Slugs) {
  return db.prepare('INSERT INTO slugs (slug, createdAt, articleId) VALUES (@slug, @createdAt, @articleId)')
    .run(slugObject);
}

export async function createArticle(article: Article) {
  return db.prepare('INSERT INTO articles (slug, title, introduction, main, urls, mainAudioUrl, urlToMainIllustration, author, author_email, createdAt, updatedAt, publishedAt, validated, shipped) VALUES (@slug, @title, @introduction, @main, @urls, @mainAudioUrl, @urlToMainIllustration, @author, @author_email, @createdAt, @updatedAt, @publishedAt, @validated, @shipped)') 
    .run(article);
}

export async function searchSlugs(searchTerm: string) {
  return db
    .prepare('SELECT * FROM slugs WHERE slug LIKE @searchTerm')
    .all({ searchTerm: `%${searchTerm}%` });
}

export async function searchArticles(searchTerm: string) {
  return db
    .prepare('SELECT * FROM articles WHERE slug LiKE @searchTerm')
    .all({ searchTerm: `%${searchTerm}%` });
}