/**
 * @module editor/search
 * @remarks
 * Server-side helpers for searching articles and slugs used by the editor.
 * These functions perform authentication checks and call Supabase helper
 * functions to fetch data.
 *
 * The file uses `auth0` to validate the session and `redirect` from Next.js
 * navigation to forward unauthenticated users to the editor entry point.
 */

/**
 * Search for matching slugs for a given search term.
 *
 * @remarks
 * This function verifies the current session using the auth0 helper and will
 * redirect to `/editor` when no authenticated user is present. On success it
 * returns an object with `message: true` and the found `slugs`. On failure it
 * returns an object with `message: false` and a plain error `text`.
 *
 * @param searchTerm - The term to search for among article slugs.
 * @returns A promise resolving to an object describing the result:
 * - When successful: { message: true, slugs: Slugs[] }
 * - When an error occurs: { message: false, text: string }
 *
 * @example
 * const result = await searchForSlugs('getting-started');
 * if (result.message) {
 *   console.log('slugs', result.slugs);
 * } else {
 *   console.error(result.text);
 * }
 *
 * @see {@link searchSlugs} for the lower-level Supabase query implementation.
 */

/**
 * Search for an article by slug.
 *
 * @remarks
 * This function verifies the current session using the auth0 helper and will
 * redirect to `/editor` when no authenticated user is present. On success it
 * returns an object with `message: true` and the fetched `article`. On
 * failure it returns an object with `message: false` and a plain error `text`.
 *
 * @param slug - The slug of the article to retrieve.
 * @returns A promise resolving to an object describing the result:
 * - When successful: { message: true, article: Article[] }
 * - When an error occurs: { message: false, text: string }
 *
 * @example
 * const result = await searchForArticle('my-article-slug');
 * if (result.message) {
 *   // use result.article
 * } else {
 *   console.error(result.text);
 * }
 *
 * @see {@link searchArticles} for the lower-level Supabase query implementation.
 */
'use server';

import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { searchArticles, searchSlugs } from '@/lib/supabase/articles';
import { Article } from '@/models/article';
import { Slugs } from '@/models/slugs';

export async function searchForSlugs(searchTerm: string) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  try {
    const slugs = (await searchSlugs(searchTerm)) as Slugs[];

    return {
      message: true,
      slugs,
    };
  } catch (error) {
    return {
      message: false,
      text: 'Error searching for slugs',
    };
  }
}

export async function searchForArticle(slug: string) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  try {
    const article = await searchArticles(slug) as Article[];

    return {
      message: true,
      article,
    };
  } catch (error) {
    return {
      message: false,
      text: 'Error getting article',
    };
  }
}
