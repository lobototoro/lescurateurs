import 'server-only';

// import fs from 'node:fs';
import sql from 'better-sqlite3';

// import slugify from 'slugify';
// import xss from 'xss';

const db = sql('lcfr.db');

export async function getArticle(slug: string) {
  return db
    .prepare('SELECT * FROM articles WHERE slug = ?')
    .get(slug, (err: any) => {
      if (err) {
        console.error('get article func ', err);
      }
    });
}

export async function getSlugs() {
  return db
    .prepare('SELECT * FROM slugs')
    .all((err: any) => {
      if (err) {
        console.error('get slugs func ', err);
      }
    });
}
