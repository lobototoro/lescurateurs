import Link from 'next/link';
import { Slugs } from '@/models/slugs';
import xss from 'xss';

/**
 * @packageDocumentation
 * Module providing a small presentational React component to render a list of articles.
 *
 * @remarks
 * The exported component, {@link ArticleList}, receives an array of {@link Slugs} and
 * renders an unordered list of links for those items that are marked as validated.
 * Dates are formatted using the French locale (`fr-FR`) and slugs are converted to
 * human-readable strings by replacing hyphens with spaces.
 *
 * @example
 * <ArticleList list={[{ id: 1, slug: 'mon-article', validated: true, created_at: '2022-01-01T00:00:00Z' }]} />
 *
 * @public
 */

/**
 * React component that renders a list of articles as links.
 *
 * @param props - Component properties.
 * @param props.list - Array of {@link Slugs} objects to render. Each item is expected to include:
 *  - `id`: unique identifier
 *  - `slug`: kebab-cased string used for the link and displayed text
 *  - `validated`: boolean flag indicating whether the article should be shown
 *  - `created_at`: ISO date string used for display
 *
 * @returns A JSX element containing an unordered list of article links. Only validated items are rendered.
 *
 * @category Components
 * @public
 */

export const ArticleList = ({ list }: { list: Slugs[] }) => {
  const unslugged = (str: string) => xss(str.replace(/-/g, ' '));
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <ul className="container">
      {list.map(
        (article) =>
          article.validated && (
            <li key={article.id}>
              <Link href={`article/${article.slug}`}>
                {unslugged(article.slug)} - {formatDate(article.created_at)}
              </Link>
            </li>
          )
      )}
    </ul>
  );
};
