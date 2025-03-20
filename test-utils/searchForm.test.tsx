import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { vi, expect, describe, it } from 'vitest';

import SearchArticle from '@/app/editor/components/formComponents/searchArticle';
import { getMockedSlugs } from './articles-mocked';

/**
 * Mocks the searchForSlugs function from the searchActions module.
 * 
 * This mock implementation simulates the behavior of the searchForSlugs function
 * by returning a predefined set of search results.
 * 
 * @returns {Object} An object containing:
 *   - message: A boolean indicating the success of the search (always true in this mock).
 *   - slugs: An array of slug objects, each containing:
 *     - id: A unique identifier for the slug.
 *     - slug: The actual slug string.
 *     - createdAt: The creation date of the slug.
 *     - articleId: The ID of the associated article.
 */
vi.mock('@/app/searchActions', () => ({
  searchForSlugs: vi.fn().mockImplementationOnce(() => {
    return {
      message: true,
      slugs: [
        { id: 1, slug: 'article-1', createdAt: '2025-03-20', articleId: 1 },
        { id: 2, slug: 'article-2', createdAt: '2025-03-20', articleId: 2 }
      ],
    }
  }).mockImplementationOnce(() => {
    return {
      message: false,
      slugs: [],
    }
  }).mockImplementationOnce(() => {
    return {
      message: true,
      slugs: getMockedSlugs(),
    }
  })
}));

describe('Search article', () => {
  it('Should render search results', async () => {
    const { getByTestId, getByText, debug } = render(<SearchArticle target="search" />);

    const searchInput = getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'slugs' } });
    const submitButton = getByTestId('submit-search');
    fireEvent.click(submitButton);

    await waitFor(() => {
      debug();
      expect(getByText('article-1')).toBeDefined();
    });
  });

  it('Should display no results message when no slugs are found', async () => {
    const { getByTestId, getByText } = render(<SearchArticle target="search" />);

    const searchInput = getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'nonexistent-slug' } });
    const submitButton = getByTestId('submit-search');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText('No slug results found')).toBeDefined();
    });
  });

  it('Should display pagination when results length is above 10', async () => {
    const { getByRole, getByTestId } = render(<SearchArticle target="search" />);

    const searchInput = getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'slugs' } });
    const submitButton = getByTestId('submit-search');
    fireEvent.click(submitButton);

    await waitFor(() => {
      // check that pagination numbering is displayed and that the first page is active
      expect(getByRole('navigation')).toBeDefined();
      const trs = document.querySelectorAll('table tbody tr');
      expect(trs.length).toBe(10);
    });

    act(() => {
      const nextButton = getByTestId('next-button');
      fireEvent.click(nextButton);  
    });

    await waitFor(() => {
      const trs = document.querySelectorAll('table tbody tr');
      expect(trs.length).toBe(1);
    });
  });
});
