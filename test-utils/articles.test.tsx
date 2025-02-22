// @vitest-environment node
import { expect, test, vitest } from 'vitest';

import { getArticle, getSlugs } from '../lib/articles';
import { getMockedSlugs } from './articles-mocked';
import { Article } from '../models/article';

vitest.mock("server-only", () => {
  return {
    // mock server-only module
  };
});

vitest.mock('better-sqlite3', () => ({
  default: vitest.fn().mockImplementation(() => {
    return {
      prepare: vitest.fn().mockImplementation(() => {
        return {
          get: vitest.fn().mockImplementation(() => {
            return {
              id: 1,
              title: 'Article title 1',
              slug: 'article-title-1',
              introduction: 'Article introduction 1',
              main: 'Article main 1',
              publishedAt: '2022-01-01',
              createAt: '2022-01-01',
              updateAt: '2022-01-01',
              author: 'Article author 1',
              author_email: 'Article author_email 1',
              urls: [
                {
                  type: 'website',
                  url: 'https://example.com/article-title-1',
                },
              ],
            };
          }),
          all: vitest.fn().mockImplementation(() => { 
            return getMockedSlugs();
          }),
        };
      }),
    };
  }),
}));

test('getArticle', async () => {
  const article = await getArticle('article-title-1') as Article;

  expect(article.title).toBe('Article title 1');
});

test('getSlugs', async () => {
  const slugs = await getSlugs() as Article[];

  expect(slugs.length).toBe(2);
});