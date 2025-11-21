import DOMPurify from 'isomorphic-dompurify';
import { Alegreya } from 'next/font/google';

/**
 * @packageDocumentation
 * @module components/ArticleTitle
 *
 * Renders an article title using the Alegreya font and DOMPurify to safely inject HTML.
 *
 * @remarks
 * The component accepts a text string and a heading level (h1-h6), optional size, color,
 * spacing classes and an optional link. It sanitizes the generated HTML with DOMPurify and
 * uses dangerouslySetInnerHTML to render the resulting HTML string. When `link` is provided,
 * the title is wrapped with an anchor tag that opens in a new tab.
 *
 * Example:
 * ```tsx
 * <ArticleTitle text="Hello" level="h2" size="large" color="primary" link="https://example.com" />
 * ```
 */

/**
 * Props for ArticleTitle component.
 *
 * @typedef ArticleTitleProps
 * @property text - The text content to display inside the heading.
 * @property level - The heading level to use ('h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6').
 * @property color - Optional color variant ('white' | 'black' | 'primary' | 'secondary'). Defaults to 'white'.
 * @property size - Optional size variant ('small' | 'medium' | 'large' | 'extra-large'). Defaults to 'medium'.
 * @property spacings - Optional additional spacing CSS classes.
 * @property link - Optional URL to wrap the heading in an anchor tag (opens in a new tab).
 */

/**
 * ArticleTitle component.
 *
 * @public
 *
 * @param props - Component props.
 * @param props.text - The string content to render inside the heading element.
 * @param props.level - The heading level tag to use (h1-h6).
 * @param props.size - Visual size variant for the title; defaults to "medium".
 * @param props.color - Color variant for the title; defaults to "white".
 * @param props.spacings - Additional spacing CSS classes to append to the title container.
 * @param props.link - If provided, wraps the title in an anchor element that opens in a new tab.
 *
 * @returns A JSX element containing the sanitized heading HTML, optionally wrapped in a sanitized anchor.
 */

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
});

export const ArticleTitle = ({
  text,
  level,
  size = 'medium',
  color = 'white',
  spacings = '',
  link,
}: {
  text: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: 'white' | 'black' | 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  spacings?: string | '';
  link?: string;
}) => {
  const tag: string = DOMPurify.sanitize(
    `<${level} class="${alegreya.className} article-title_${size} article-title_${color} ${spacings}">${text}</${level}>`
  );

  if (link) {
    const urlLink = DOMPurify.sanitize(
      `<a href="${link}" target="_blank" class="is-primary">${tag}</a>`
    );

    return <div dangerouslySetInnerHTML={{ __html: urlLink }} />;
  }

  return <div dangerouslySetInnerHTML={{ __html: tag }} />;
};
