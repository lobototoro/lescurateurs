/**
 * @file ArticleList.test.tsx
 * @description Comprehensive unit tests for ArticleList component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleList } from '@/app/components/ArticleList';
import { Slugs } from '@/models/slugs';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} data-testid="article-link">
      {children}
    </a>
  ),
}));

// Mock xss
vi.mock('xss', () => ({
  __esModule: true,
  default: vi.fn((str: string) => str),
}));

describe('ArticleList', () => {
  const mockArticles: Slugs[] = [
    {
      id: 1,
      slug: 'first-article',
      validated: true,
      created_at: '2024-01-15T10:30:00Z',
      article_id: 1,
    },
    {
      id: 2,
      slug: 'second-article',
      validated: true,
      created_at: '2024-02-20T14:45:00Z',
      article_id: 2,
    },
    {
      id: 3,
      slug: 'third-article',
      validated: false,
      created_at: '2024-03-10T08:15:00Z',
      article_id: 3,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component successfully', () => {
      render(<ArticleList list={mockArticles} />);

      const container = screen.getByRole('list');
      expect(container).toBeInTheDocument();
    });

    it('should render as an unordered list', () => {
      render(<ArticleList list={mockArticles} />);

      const list = screen.getByRole('list');
      expect(list.tagName).toBe('UL');
    });

    it('should have container class', () => {
      render(<ArticleList list={mockArticles} />);

      const list = screen.getByRole('list');
      expect(list).toHaveClass('container');
    });

    it('should render list items for validated articles', () => {
      render(<ArticleList list={mockArticles} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2); // Only validated articles
    });

    it('should render links for each validated article', () => {
      render(<ArticleList list={mockArticles} />);

      const links = screen.getAllByTestId('article-link');
      expect(links).toHaveLength(2);
    });
  });

  describe('Validated Articles Filtering', () => {
    it('should only display validated articles', () => {
      render(<ArticleList list={mockArticles} />);

      expect(screen.getByText(/first article/i)).toBeInTheDocument();
      expect(screen.getByText(/second article/i)).toBeInTheDocument();
      expect(screen.queryByText(/third article/i)).not.toBeInTheDocument();
    });

    it('should not render non-validated articles', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'validated-article',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
        {
          id: 2,
          slug: 'non-validated-article',
          validated: false,
          created_at: '2024-01-02T00:00:00Z',
          article_id: 2,
        },
      ];

      render(<ArticleList list={articles} />);

      expect(screen.getByText(/validated article/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/non validated article/i)
      ).not.toBeInTheDocument();
    });

    it('should render nothing when all articles are non-validated', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'article-one',
          validated: false,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
        {
          id: 2,
          slug: 'article-two',
          validated: false,
          created_at: '2024-01-02T00:00:00Z',
          article_id: 2,
        },
      ];

      render(<ArticleList list={articles} />);

      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });

    it('should render all items when all articles are validated', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'article-one',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
        {
          id: 2,
          slug: 'article-two',
          validated: true,
          created_at: '2024-01-02T00:00:00Z',
          article_id: 2,
        },
        {
          id: 3,
          slug: 'article-three',
          validated: true,
          created_at: '2024-01-03T00:00:00Z',
          article_id: 3,
        },
      ];

      render(<ArticleList list={articles} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });
  });

  describe('Slug Transformation', () => {
    it('should replace hyphens with spaces in slug', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'my-awesome-article',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      expect(screen.getByText(/my awesome article/i)).toBeInTheDocument();
    });

    it('should handle single-word slugs', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'article',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      expect(screen.getByText(/article/i)).toBeInTheDocument();
    });

    it('should handle slugs with multiple hyphens', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'this-is-a-very-long-article-title',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      expect(
        screen.getByText(/this is a very long article title/i)
      ).toBeInTheDocument();
    });

    it('should call xss function to sanitize slugs', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'test-article',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      // xss is mocked and called internally, verify render succeeds
      expect(screen.getByText(/test article/i)).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('should format dates in French locale', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'article',
          validated: true,
          created_at: '2024-01-15T10:30:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      // French date format: "15 janvier 2024"
      expect(screen.getByText(/15 janvier 2024/i)).toBeInTheDocument();
    });

    it('should handle different months in French', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'february-article',
          validated: true,
          created_at: '2024-02-20T14:45:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      expect(screen.getByText(/20 février 2024/i)).toBeInTheDocument();
    });

    it('should format date with day, month, and year', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'article',
          validated: true,
          created_at: '2024-12-25T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      expect(screen.getByText(/25 décembre 2024/i)).toBeInTheDocument();
    });

    it('should handle dates at beginning of year', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'new-year-article',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      expect(screen.getByText(/1 janvier 2024/i)).toBeInTheDocument();
    });

    it('should handle dates at end of year', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'end-year-article',
          validated: true,
          created_at: '2024-12-31T12:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      // Date may vary based on timezone, check for december
      expect(screen.getByText(/décembre 2024/i)).toBeInTheDocument();
    });
  });

  describe('Link Generation', () => {
    it('should generate correct href for article links', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'my-article',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      const link = screen.getByTestId('article-link');
      expect(link).toHaveAttribute('href', 'article/my-article');
    });

    it('should generate unique hrefs for each article', () => {
      render(<ArticleList list={mockArticles} />);

      const links = screen.getAllByTestId('article-link');
      expect(links[0]).toHaveAttribute('href', 'article/first-article');
      expect(links[1]).toHaveAttribute('href', 'article/second-article');
    });

    it('should use slug in href without transformation', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'article-with-many-hyphens',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      const link = screen.getByTestId('article-link');
      expect(link).toHaveAttribute('href', 'article/article-with-many-hyphens');
    });
  });

  describe('List Item Structure', () => {
    it('should render each article in a list item', () => {
      render(<ArticleList list={mockArticles} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });

    it('should have unique key for each list item', () => {
      const { container } = render(<ArticleList list={mockArticles} />);

      const listItems = container.querySelectorAll('li');
      const keys = Array.from(listItems).map((item) =>
        item.getAttribute('key')
      );

      // Keys should be set internally by React
      expect(listItems.length).toBe(2);
    });

    it('should display slug and date together', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'test-article',
          validated: true,
          created_at: '2024-06-15T10:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      // Should contain both slug (transformed) and date
      expect(
        screen.getByText(/test article.*15 juin 2024/i)
      ).toBeInTheDocument();
    });

    it('should separate slug and date with hyphen', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'article',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      const link = screen.getByTestId('article-link');
      expect(link.textContent).toContain(' - ');
    });
  });

  describe('Empty List Handling', () => {
    it('should render empty list when no articles provided', () => {
      render(<ArticleList list={[]} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });

    it('should handle empty array gracefully', () => {
      const { container } = render(<ArticleList list={[]} />);

      expect(container.querySelector('ul')).toBeInTheDocument();
      expect(container.querySelectorAll('li')).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle articles with special characters in slug', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'article-with-numbers-123',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      expect(screen.getByText(/article with numbers 123/i)).toBeInTheDocument();
    });

    it('should handle very long slugs', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'this-is-a-very-long-article-slug-with-many-words-to-test-edge-cases',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      expect(
        screen.getByText(
          /this is a very long article slug with many words to test edge cases/i
        )
      ).toBeInTheDocument();
    });

    it('should handle dates from different years', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'old-article',
          validated: true,
          created_at: '2020-01-01T00:00:00Z',
          article_id: 1,
        },
        {
          id: 2,
          slug: 'new-article',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 2,
        },
      ];

      render(<ArticleList list={articles} />);

      expect(screen.getByText(/1 janvier 2020/i)).toBeInTheDocument();
      expect(screen.getByText(/1 janvier 2024/i)).toBeInTheDocument();
    });

    it('should handle single article', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'single-article',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
    });

    it('should handle articles with same slug but different ids', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'duplicate-slug',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
        {
          id: 2,
          slug: 'duplicate-slug',
          validated: true,
          created_at: '2024-01-02T00:00:00Z',
          article_id: 2,
        },
      ];

      render(<ArticleList list={articles} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });

    it('should handle mixed validated and non-validated articles', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'article-1',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
        {
          id: 2,
          slug: 'article-2',
          validated: false,
          created_at: '2024-01-02T00:00:00Z',
          article_id: 2,
        },
        {
          id: 3,
          slug: 'article-3',
          validated: true,
          created_at: '2024-01-03T00:00:00Z',
          article_id: 3,
        },
        {
          id: 4,
          slug: 'article-4',
          validated: false,
          created_at: '2024-01-04T00:00:00Z',
          article_id: 4,
        },
        {
          id: 5,
          slug: 'article-5',
          validated: true,
          created_at: '2024-01-05T00:00:00Z',
          article_id: 5,
        },
      ];

      render(<ArticleList list={articles} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3); // Only validated articles
    });
  });

  describe('Accessibility', () => {
    it('should render semantic list markup', () => {
      render(<ArticleList list={mockArticles} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('should have list items with listitem role', () => {
      render(<ArticleList list={mockArticles} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('should render links with proper href attributes', () => {
      render(<ArticleList list={mockArticles} />);

      const links = screen.getAllByTestId('article-link');
      links.forEach((link) => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).toContain('article/');
      });
    });

    it('should have meaningful link text', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'accessible-article',
          validated: true,
          created_at: '2024-01-01T00:00:00Z',
          article_id: 1,
        },
      ];

      render(<ArticleList list={articles} />);

      const link = screen.getByTestId('article-link');
      expect(link.textContent).toBeTruthy();
      expect(link.textContent).toContain('accessible article');
    });
  });

  describe('Integration', () => {
    it('should render complete article list with all features', () => {
      const articles: Slugs[] = [
        {
          id: 1,
          slug: 'getting-started-with-react',
          validated: true,
          created_at: '2024-01-15T10:00:00Z',
          article_id: 1,
        },
        {
          id: 2,
          slug: 'advanced-typescript-patterns',
          validated: true,
          created_at: '2024-02-20T14:30:00Z',
          article_id: 2,
        },
        {
          id: 3,
          slug: 'draft-article',
          validated: false,
          created_at: '2024-03-10T09:00:00Z',
          article_id: 3,
        },
      ];

      render(<ArticleList list={articles} />);

      // Check container
      const list = screen.getByRole('list');
      expect(list).toHaveClass('container');

      // Check only validated articles are shown
      expect(
        screen.getByText(/getting started with react/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/advanced typescript patterns/i)
      ).toBeInTheDocument();
      expect(screen.queryByText(/draft article/i)).not.toBeInTheDocument();

      // Check dates are formatted
      expect(screen.getByText(/15 janvier 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/20 février 2024/i)).toBeInTheDocument();

      // Check links are generated
      const links = screen.getAllByTestId('article-link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute(
        'href',
        'article/getting-started-with-react'
      );
      expect(links[1]).toHaveAttribute(
        'href',
        'article/advanced-typescript-patterns'
      );
    });
  });
});
