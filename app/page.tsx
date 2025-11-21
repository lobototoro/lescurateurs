import { getSlugs } from '@/lib/supabase/articles';
import { ArticleList } from './components/ArticleList';
import { Suspense } from 'react';

/**
 * Main module for the homepage.
 *
 * @packageDocumentation
 *
 * This module defines the default export `Home`, an async React Server Component
 * that loads article slugs and renders them using the `ArticleList` component
 * inside a `Suspense` boundary.
 *
 * @remarks
 * - Data fetching is performed via the `getSlugs` helper from the Supabase-backed
 *   articles library.
 * - The component is async so it can await server-side data before rendering.
 * - A `Suspense` fallback is provided to show a loading state while the list is
 *   resolving.
 *
 * @example
 * // Render the Home component
 * <Home />
 */

/**
 * getSlugs
 *
 * @remarks
 * Placeholder documentation for the imported `getSlugs` utility.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of article slugs.
 */

/**
 * ArticleList
 *
 * @remarks
 * Placeholder documentation for the imported `ArticleList` component.
 *
 * @param props.list - An array of article slugs to be rendered as a list.
 */

/**
 * Home
 *
 * Async React Server Component that:
 * - Fetches article slugs using `getSlugs`.
 * - Renders an `ArticleList` with a `Suspense` fallback.
 *
 * @returns {JSX.Element} The homepage section containing the article list.
 */

export default async function Home() {
  const slugs = await getSlugs();

  return (
    <section>
      <Suspense fallback={<p>Loading...</p>}>
        <ArticleList list={slugs} />
      </Suspense>
    </section>
  );
}
