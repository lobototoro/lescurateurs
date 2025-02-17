import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { ArticleTitle } from '../app/components/ArticleTitle';

// vitest.mock('isomorphic-dompurify', () => ({
//   default: vitest.fn().mockImplementation(() => {
//     return {
//       sanitize: vitest.fn().mockImplementation((html) => html),
//     };
//   })
// }));

test('ArticleTitle', () => {
  render(<ArticleTitle text="Article title" level="h1" size="extra-large" color="white" />);

  const container = screen.getByText('Article title');
  expect(container).toBeDefined();
  expect(container.className).toBe('article-title_extra-large article-title_white');
});
