/**
 * @file searchArticle.test.tsx
 * @description Comprehensive unit tests for SearchArticle component
 */

import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchArticle from '@/app/editor/components/formComponents/searchArticle';
import * as React from 'react';

// Mock slug data
const mockSlugs = [
  {
    id: 1,
    slug: 'test-article-1',
    title: 'Test Article 1',
  },
  {
    id: 2,
    slug: 'test-article-2',
    title: 'Test Article 2',
  },
  {
    id: 3,
    slug: 'test-article-3',
    title: 'Test Article 3',
  },
];

// Mock dependencies
vi.mock('@/app/searchActions', () => ({
  searchForSlugs: vi.fn().mockResolvedValue({
    isSuccess: true,
    slugs: [
      { id: 1, slug: 'test-article-1', title: 'Test Article 1' },
      { id: 2, slug: 'test-article-2', title: 'Test Article 2' },
      { id: 3, slug: 'test-article-3', title: 'Test Article 3' },
    ],
  }),
}));

vi.mock('@/app/components/single-elements/ArticleTitle', () => ({
  ArticleTitle: vi.fn(({ text, level, size, color, spacings }) => (
    <div
      data-testid="article-title"
      data-level={level}
      data-size={size}
      data-color={color}
      data-spacings={spacings}
    >
      {text}
    </div>
  )),
}));

vi.mock('@/app/components/single-elements/paginatedSearchResults', () => ({
  PaginatedSearchDisplay: vi.fn(
    ({
      itemList,
      handleReference,
      target,
      context,
      defaultPage,
      defaultLimit,
    }: any) => (
      <div
        data-testid="paginated-search"
        data-target={target}
        data-context={context}
        data-page={defaultPage}
        data-limit={defaultLimit}
      >
        {itemList.map((item: any) => (
          <div key={item.id} data-testid={`result-item-${item.id}`}>
            <span>{item.title}</span>
            <button
              data-testid={`select-btn-${item.id}`}
              onClick={() => handleReference(item.id, item.slug)}
            >
              Select
            </button>
            <button
              data-testid={`update-btn-${item.id}`}
              onClick={() => handleReference(item.id, item.slug, 'update')}
            >
              Update
            </button>
            <button
              data-testid={`delete-btn-${item.id}`}
              onClick={() => handleReference(item.id, item.slug, 'delete')}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    )
  ),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('SearchArticle', () => {
  const mockSetSelection = vi.fn();
  const mockManageSelection = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component successfully', () => {
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-search')).toBeInTheDocument();
    });

    it('should render ArticleTitle with target as text', () => {
      render(
        <SearchArticle
          target="update"
          setSelection={mockSetSelection}
        />
      );

      expect(screen.getByText('update')).toBeInTheDocument();
      const titleElement = screen.getAllByTestId('article-title')[0];
      expect(titleElement).toHaveAttribute('data-level', 'h2');
      expect(titleElement).toHaveAttribute('data-size', 'large');
      expect(titleElement).toHaveAttribute('data-color', 'white');
    });

    it('should render search form with role="search"', () => {
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const form = screen.getByRole('search');
      expect(form).toBeInTheDocument();
      expect(form.tagName).toBe('FORM');
    });

    it('should render search input field', () => {
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('id', 'search');
    });

    it('should render submit button', () => {
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const button = screen.getByTestId('submit-search');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveTextContent('Search');
    });

    it('should have hidden label for accessibility', () => {
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const label = screen.getByLabelText('Search');
      expect(label).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should update search term when typing', async () => {
      const user = userEvent.setup();
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      await user.type(input, 'test search');

      expect(input).toHaveValue('test search');
    });

    it('should call searchForSlugs when form is submitted', async () => {
      const user = userEvent.setup();
      const { searchForSlugs } = await import('@/app/searchActions');

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(searchForSlugs).toHaveBeenCalledWith('test');
      });
    });

    it('should not submit when search term is empty', async () => {
      const user = userEvent.setup();
      const { searchForSlugs } = await import('@/app/searchActions');

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const submitButton = screen.getByTestId('submit-search');
      await user.click(submitButton);

      expect(searchForSlugs).not.toHaveBeenCalled();
    });

    it('should not submit when search term is only whitespace', async () => {
      const user = userEvent.setup();
      const { searchForSlugs } = await import('@/app/searchActions');

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, '   ');
      await user.click(submitButton);

      expect(searchForSlugs).not.toHaveBeenCalled();
    });

    it('should show loading state during search', async () => {
      const user = userEvent.setup();
      const { searchForSlugs } = await import('@/app/searchActions');

      (searchForSlugs as Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  isSuccess: true,
                  slugs: mockSlugs,
                }),
              100
            )
          )
      );

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      // Check loading state
      expect(submitButton).toHaveClass('is-loading');

      // Wait for search to complete
      await waitFor(() => {
        expect(submitButton).not.toHaveClass('is-loading');
      });
    });

    it('should display search results after successful search', async () => {
      const user = userEvent.setup();

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('paginated-search')).toBeInTheDocument();
        expect(screen.getByTestId('result-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('result-item-2')).toBeInTheDocument();
        expect(screen.getByTestId('result-item-3')).toBeInTheDocument();
      });
    });

    it('should display result count after search', async () => {
      const user = userEvent.setup();

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test search');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Vous avez cherché " test search " avec 3 résultat\(s\)/)
        ).toBeInTheDocument();
      });
    });

    it('should display error toast when search fails', async () => {
      const user = userEvent.setup();
      const { searchForSlugs } = await import('@/app/searchActions');
      const { toast } = await import('sonner');

      (searchForSlugs as Mock).mockResolvedValueOnce({
        isSuccess: false,
        message: 'Search failed',
      });

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Search failed');
      });
    });

    it('should handle empty results gracefully', async () => {
      const user = userEvent.setup();
      const { searchForSlugs } = await import('@/app/searchActions');

      (searchForSlugs as Mock).mockResolvedValueOnce({
        isSuccess: true,
        slugs: [],
      });

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'nonexistent');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByTestId('paginated-search')).not.toBeInTheDocument();
      });
    });
  });

  describe('Target: search', () => {
    it('should call setSelection with slug path when result is selected', async () => {
      const user = userEvent.setup();

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('select-btn-1')).toBeInTheDocument();
      });

      const selectButton = screen.getByTestId('select-btn-1');
      await user.click(selectButton);

      expect(mockSetSelection).toHaveBeenCalledWith('/article/test-article-1');
    });

    it('should not call setSelection if slug is undefined', async () => {
      const user = userEvent.setup();
      const { searchForSlugs } = await import('@/app/searchActions');

      (searchForSlugs as Mock).mockResolvedValueOnce({
        isSuccess: true,
        slugs: [{ id: 1, title: 'Test' }],
      });

      const { PaginatedSearchDisplay } = await import(
        '@/app/components/single-elements/paginatedSearchResults'
      );

      (PaginatedSearchDisplay as Mock).mockImplementationOnce(
        ({ handleReference }: any) => (
          <div data-testid="paginated-search">
            <button
              data-testid="select-no-slug"
              onClick={() => handleReference(1, undefined)}
            >
              Select
            </button>
          </div>
        )
      );

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('select-no-slug')).toBeInTheDocument();
      });

      const selectButton = screen.getByTestId('select-no-slug');
      await user.click(selectButton);

      expect(mockSetSelection).not.toHaveBeenCalled();
    });
  });

  describe('Target: update', () => {
    it('should call setSelection with id when result is selected', async () => {
      const user = userEvent.setup();

      render(
        <SearchArticle
          target="update"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('select-btn-2')).toBeInTheDocument();
      });

      const selectButton = screen.getByTestId('select-btn-2');
      await user.click(selectButton);

      expect(mockSetSelection).toHaveBeenCalledWith(2);
    });

    it('should not call setSelection if id is undefined', async () => {
      const user = userEvent.setup();
      const { PaginatedSearchDisplay } = await import(
        '@/app/components/single-elements/paginatedSearchResults'
      );

      (PaginatedSearchDisplay as Mock).mockImplementationOnce(
        ({ handleReference }: any) => (
          <div data-testid="paginated-search">
            <button
              data-testid="select-no-id"
              onClick={() => handleReference(undefined, 'slug')}
            >
              Select
            </button>
          </div>
        )
      );

      render(
        <SearchArticle
          target="update"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('select-no-id')).toBeInTheDocument();
      });

      const selectButton = screen.getByTestId('select-no-id');
      await user.click(selectButton);

      expect(mockSetSelection).not.toHaveBeenCalled();
    });
  });

  describe('Target: manage', () => {
    it('should call manageSelection with id and actionName', async () => {
      const user = userEvent.setup();

      render(
        <SearchArticle
          target="manage"
          manageSelection={mockManageSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('update-btn-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      expect(mockManageSelection).toHaveBeenCalledWith({
        id: 1,
        actionName: 'update',
      });
    });

    it('should handle delete action', async () => {
      const user = userEvent.setup();

      render(
        <SearchArticle
          target="manage"
          manageSelection={mockManageSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('delete-btn-2')).toBeInTheDocument();
      });

      const deleteButton = screen.getByTestId('delete-btn-2');
      await user.click(deleteButton);

      expect(mockManageSelection).toHaveBeenCalledWith({
        id: 2,
        actionName: 'delete',
      });
    });

    it('should not call manageSelection if id is undefined', async () => {
      const user = userEvent.setup();
      const { PaginatedSearchDisplay } = await import(
        '@/app/components/single-elements/paginatedSearchResults'
      );

      (PaginatedSearchDisplay as Mock).mockImplementationOnce(
        ({ handleReference }: any) => (
          <div data-testid="paginated-search">
            <button
              data-testid="manage-no-id"
              onClick={() => handleReference(undefined, 'slug', 'update')}
            >
              Manage
            </button>
          </div>
        )
      );

      render(
        <SearchArticle
          target="manage"
          manageSelection={mockManageSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('manage-no-id')).toBeInTheDocument();
      });

      const manageButton = screen.getByTestId('manage-no-id');
      await user.click(manageButton);

      expect(mockManageSelection).not.toHaveBeenCalled();
    });
  });

  describe('Cancel Search Display', () => {
    it('should reset search when cancelSearchDisplay becomes true', async () => {
      const { rerender } = render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
          cancelSearchDisplay={false}
        />
      );

      const input = screen.getByTestId('search-input');
      const user = userEvent.setup();

      // Type and submit search
      await user.type(input, 'test search');
      const submitButton = screen.getByTestId('submit-search');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('paginated-search')).toBeInTheDocument();
      });

      // Cancel search display
      rerender(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
          cancelSearchDisplay={true}
        />
      );

      await waitFor(() => {
        expect(input).toHaveValue('');
        expect(screen.queryByTestId('paginated-search')).not.toBeInTheDocument();
      });
    });

    it('should not reset search when cancelSearchDisplay is false', () => {
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
          cancelSearchDisplay={false}
        />
      );

      const input = screen.getByTestId('search-input');
      expect(input).toHaveValue('');
    });
  });

  describe('PaginatedSearchDisplay Integration', () => {
    it('should pass correct props to PaginatedSearchDisplay', async () => {
      const user = userEvent.setup();

      render(
        <SearchArticle
          target="update"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        const paginatedSearch = screen.getByTestId('paginated-search');
        expect(paginatedSearch).toHaveAttribute('data-target', 'update');
        expect(paginatedSearch).toHaveAttribute('data-context', 'article');
        expect(paginatedSearch).toHaveAttribute('data-page', '1');
        expect(paginatedSearch).toHaveAttribute('data-limit', '10');
      });
    });

    it('should pass search results to PaginatedSearchDisplay', async () => {
      const user = userEvent.setup();

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
        expect(screen.getByText('Test Article 2')).toBeInTheDocument();
        expect(screen.getByText('Test Article 3')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form with search role', () => {
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const form = screen.getByRole('search');
      expect(form).toBeInTheDocument();
    });

    it('should have hidden label for screen readers', () => {
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const label = screen.getByLabelText('Search');
      expect(label).toBeInTheDocument();
      expect(label.previousElementSibling).toHaveClass('is-hidden');
    });

    it('should have proper input id matching label', () => {
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      expect(input).toHaveAttribute('id', 'search');

      const label = screen.getByLabelText('Search');
      expect(label).toBe(input);
    });

    it('should have proper button type for submit', () => {
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const button = screen.getByTestId('submit-search');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined slugs in response', async () => {
      const user = userEvent.setup();
      const { searchForSlugs } = await import('@/app/searchActions');

      (searchForSlugs as Mock).mockResolvedValueOnce({
        isSuccess: true,
        slugs: undefined,
      });

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByTestId('paginated-search')).not.toBeInTheDocument();
      });
    });

    it('should handle multiple rapid searches', async () => {
      const user = userEvent.setup();
      const { searchForSlugs } = await import('@/app/searchActions');

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      // First search
      await user.type(input, 'test1');
      await user.click(submitButton);

      // Second search
      await user.clear(input);
      await user.type(input, 'test2');
      await user.click(submitButton);

      // Third search
      await user.clear(input);
      await user.type(input, 'test3');
      await user.click(submitButton);

      await waitFor(() => {
        expect(searchForSlugs).toHaveBeenCalledTimes(3);
        expect(searchForSlugs).toHaveBeenLastCalledWith('test3');
      });
    });

    it('should handle default target case', async () => {
      const user = userEvent.setup();
      const { PaginatedSearchDisplay } = await import(
        '@/app/components/single-elements/paginatedSearchResults'
      );

      (PaginatedSearchDisplay as Mock).mockImplementationOnce(
        ({ handleReference }: any) => (
          <div data-testid="paginated-search">
            <button
              data-testid="default-action"
              onClick={() => handleReference(1, 'slug', 'unknown')}
            >
              Action
            </button>
          </div>
        )
      );

      render(
        <SearchArticle
          target={'unknown' as any}
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('default-action')).toBeInTheDocument();
      });

      const actionButton = screen.getByTestId('default-action');
      await user.click(actionButton);

      // Should not call any callbacks for unknown target
      expect(mockSetSelection).not.toHaveBeenCalled();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct classes to input', () => {
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      expect(input).toHaveClass('input', 'is-inline-flex');
    });

    it('should apply loading class to button when pending', async () => {
      const user = userEvent.setup();
      const { searchForSlugs } = await import('@/app/searchActions');

      (searchForSlugs as Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  isSuccess: true,
                  slugs: mockSlugs,
                }),
              100
            )
          )
      );

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');
      const submitButton = screen.getByTestId('submit-search');

      await user.type(input, 'test');
      await user.click(submitButton);

      expect(submitButton).toHaveClass('button', 'is-inline-flex', 'ml-4', 'mr-4', 'is-loading');

      await waitFor(() => {
        expect(submitButton).not.toHaveClass('is-loading');
      });
    });

    it('should not have loading class when not pending', () => {
      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const submitButton = screen.getByTestId('submit-search');
      expect(submitButton).toHaveClass('button', 'is-inline-flex', 'ml-4', 'mr-4');
      expect(submitButton).not.toHaveClass('is-loading');
    });
  });

  describe('Form Submission via Enter Key', () => {
    it('should submit form when pressing Enter in input', async () => {
      const user = userEvent.setup();
      const { searchForSlugs } = await import('@/app/searchActions');

      render(
        <SearchArticle
          target="search"
          setSelection={mockSetSelection}
        />
      );

      const input = screen.getByTestId('search-input');

      await user.type(input, 'test search{Enter}');

      await waitFor(() => {
        expect(searchForSlugs).toHaveBeenCalledWith('test search');
      });
    });
  });
});
