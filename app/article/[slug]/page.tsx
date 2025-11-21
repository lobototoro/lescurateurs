/**
 * @packageDocumentation
 * @module pages/article
 *
 * Page component for rendering a single article.
 *
 * This file exports the default async React Server Component ArticlePage which
 * fetches an article by slug and renders its content, author, and publication date.
 *
 * @remarks
 * - Uses date-fns for localized relative time formatting (fr).
 * - Fetches article data via the Supabase helper `getArticle`.
 * - Renders HTML content for the main article body using `dangerouslySetInnerHTML`.
 */

/**
 * Article model and data fetching utilities.
 *
 * @see {@link Article}
 * @see {@link getArticle}
 */

/**
 * Renders the article page.
 *
 * @remarks
 * This is an async Server Component which expects props containing a Promise<Params>.
 * It awaits params, fetches the article via getArticle, formats the publication date
 * using date-fns, and returns the JSX markup for the article page.
 *
 * @param props - Component props
 * @param props.params - A Promise resolving to route params containing a `slug`
 *
 * @returns A Promise resolving to a React element representing the article page.
 *
 * @example
 * // Next.js app route will call this component with props.params set from route
 * <ArticlePage params={fetchParams()} />
 *
 * @public
 */
import { fr } from 'date-fns/locale/fr';
import { formatDistanceToNow } from 'date-fns';

import { Article } from '@/models/article';
import { getArticle } from '@/lib/supabase/articles';
import { Params } from '@/models/slugs';
import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';

export default async function ArticlePage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const article = await getArticle(params.slug);

  const publishedDate =
    article.published_at &&
    formatDistanceToNow(article.published_at || '', {
      locale: fr,
      addSuffix: true,
    });

  return (
    <div className="container">
      <ArticleTitle
        text={article.title}
        level="h2"
        size="extra-large"
        color="black"
      />
      <p>{article.introduction}</p>
      <p dangerouslySetInnerHTML={{ __html: article.main }} />
      {publishedDate && <p>Article publié {publishedDate} par</p>}
      <h5>{article.author}</h5>
    </div>
  );
}
