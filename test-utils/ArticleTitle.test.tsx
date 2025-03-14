import { render, screen, cleanup } from '@testing-library/react';
import { vi, expect, test } from 'vitest';

import { ArticleTitle } from '../app/components/single-elements/ArticleTitle';

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

test('articleTitle with link', () => {
  cleanup();
  render(<ArticleTitle text="Article title" level="h1" size="extra-large" color="white" link="/article/slug" />);
  
  const link = document.querySelector('a');
  expect(link?.classList[0]).toBe('is-primary');
  expect(link?.tagName).toBe('A');
  expect(link?.getAttribute('href')).toBe('/article/slug');
});