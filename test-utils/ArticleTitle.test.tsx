import { render, screen } from '@testing-library/react';
import { vi, expect, test } from 'vitest';

import { ArticleTitle } from '../app/components/single-elements/ArticleTitle';

// vitest.mock('isomorphic-dompurify', () => ({
//   default: vitest.fn().mockImplementation(() => {
//     return {
//       sanitize: vitest.fn().mockImplementation((html) => html),
//     };
//   })
// }));

vi.mock('next/font/google', () => ({
  Alegreya: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
}))

test('ArticleTitle', () => {
  render(<ArticleTitle text="Article title" level="h1" size="extra-large" color="white" />);

  const container = screen.getByText('Article title');
  expect(container).toBeDefined();
  expect(container.className).toBe('undefined article-title_extra-large article-title_white');
});
