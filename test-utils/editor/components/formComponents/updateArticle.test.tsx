/**
 * @file updateArticle.test.tsx
 * @description Comprehensive unit tests for UpdateArticleForm component
 */

import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpdateArticleForm from '@/app/editor/components/formComponents/updateArticle';
import * as ReactHookForm from 'react-hook-form';
import * as React from 'react';
import * as Ramda from 'ramda';

// Mock article data
const mockArticle = {
  id: 123,
  slug: 'test-article',
  title: 'Test Article Title',
  introduction:
    'This is a test introduction with enough characters to pass validation',
  main: 'This is the main content with enough characters to pass validation',
  published_at: '2024-01-01T00:00:00.000Z',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-02T00:00:00.000Z',
  updated_by: 'test_user',
  author: 'Test Author',
  author_email: 'test@example.com',
  validated: true,
  shipped: false,
  urls: [
    { url: 'https://example.com/1', description: 'Example 1' },
    { url: 'https://example.com/2', description: 'Example 2' },
  ],
  main_audio_url: 'https://example.com/audio.mp3',
  url_to_main_illustration: 'https://example.com/image.jpg',
};

const mockModifiedArticle = {
  ...mockArticle,
  title: 'Modified Test Article Title',
  introduction: 'This is a modified introduction',
};

// Mock form methods
const mockFormMethods = {
  register: vi.fn(),
  handleSubmit: vi.fn((fn) => (e: any) => {
    e?.preventDefault?.();

    return fn(mockModifiedArticle);
  }),
  watch: vi.fn((fieldName?: string) => {
    if (fieldName === 'main') return mockArticle.main;
    if (fieldName === 'urls') return mockArticle.urls;

    return undefined;
  }),
  setValue: vi.fn(),
  getValues: vi.fn((fieldName?: string) => {
    if (fieldName === 'urls') return mockArticle.urls;

    return mockArticle;
  }),
  reset: vi.fn(),
  trigger: vi.fn().mockResolvedValue(true),
  clearErrors: vi.fn(),
  formState: { errors: {} },
};

const mockAddInputs = vi.fn();
const mockRemoveInputs = vi.fn();
const mockUpdateUrls = vi.fn();

// Mock dependencies
vi.mock('react', async () => {
  const actual = await vi.importActual('react');

  return {
    ...actual,
    useActionState: vi.fn(() => [null, vi.fn(), false]),
    startTransition: vi.fn((callback) => callback()),
  };
});

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => mockFormMethods),
}));

vi.mock('ramda', async () => {
  const actual = await vi.importActual('ramda');

  return {
    ...actual,
    equals: vi.fn((a, b) => JSON.stringify(a) === JSON.stringify(b)),
  };
});

vi.mock('@/models/articleSchema', () => ({
  articleSchema: {
    parse: vi.fn((data) => data),
    safeParse: vi.fn((data) => ({ success: true, data })),
  },
}));

vi.mock('@/app/articleActions', () => ({
  updateArticleAction: vi.fn().mockResolvedValue({
    isSuccess: true,
    message: 'Article updated successfully',
  }),
  fetchArticleById: vi.fn().mockResolvedValue({
    isSuccess: true,
    article: {
      id: 123,
      slug: 'test-article',
      title: 'Test Article Title',
      introduction:
        'This is a test introduction with enough characters to pass validation',
      main: 'This is the main content with enough characters to pass validation',
      published_at: '2024-01-01T00:00:00.000Z',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-02T00:00:00.000Z',
      updated_by: 'test_user',
      author: 'Test Author',
      author_email: 'test@example.com',
      validated: true,
      shipped: false,
      urls: [
        { url: 'https://example.com/1', description: 'Example 1' },
        { url: 'https://example.com/2', description: 'Example 2' },
      ],
      main_audio_url: 'https://example.com/audio.mp3',
      url_to_main_illustration: 'https://example.com/image.jpg',
    },
  }),
}));

vi.mock('@/app/components/single-elements/articleHTMLForm', () => ({
  __esModule: true,
  default: vi.fn((props: any) => (
    <form data-testid="article-markup-form" onSubmit={props.handleSubmit}>
      <input {...props.register('title')} placeholder="Titre" />
      <input {...props.register('introduction')} placeholder="Introduction" />
      <div data-testid="rte-container">
        <button
          type="button"
          onClick={() => props.getMainContent('Updated main content')}
        >
          Update Main Content
        </button>
      </div>
      <input {...props.register('main_audio_url')} placeholder="Audio URL" />
      <input
        {...props.register('url_to_main_illustration')}
        placeholder="Illustration URL"
      />
      {props.urlsToArray?.map((url: any, index: number) => (
        <div key={index} data-testid={`url-input-${index}`}>
          URL {index}: {url.url}
        </div>
      ))}
      <button
        type="button"
        onClick={props.addInputs}
        data-testid="add-url-button"
      >
        Add URL
      </button>
      <button
        type="button"
        onClick={props.removeInputs}
        data-testid="remove-url-button"
      >
        Remove URL
      </button>
      <button
        type="submit"
        disabled={props.isPending}
        data-testid="submit-button"
      >
        {props.isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )),
}));

vi.mock('@/app/editor/components/formComponents/searchArticle', () => ({
  __esModule: true,
  default: vi.fn(({ setSelection }: { setSelection: any }) => (
    <div data-testid="search-article">
      <button
        data-testid="select-article-btn"
        onClick={() => setSelection(123)}
      >
        Select Article
      </button>
    </div>
  )),
}));

vi.mock('@/lib/utility-functions', () => ({
  addRemoveInputsFactory: vi.fn(() => [
    mockAddInputs,
    mockRemoveInputs,
    mockUpdateUrls,
  ]),
  isEmpty: vi.fn((value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'object') return Object.keys(value).length === 0;

    return false;
  }),
}));

vi.mock('@/app/editor/components/resolvers/customResolver', () => ({
  customResolver: vi.fn(() => vi.fn()),
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

vi.mock('@/lib/useMaincontentValidation', () => ({
  useMainContentValidation: vi.fn(),
}));

vi.mock('@/lib/toastCallbacks', () => ({
  withCallbacks: vi.fn((action, callbacks, postprocess) => {
    return async (prevState: any, formData: any) => {
      const result = await action(prevState, formData);
      if (postprocess) postprocess();

      return result;
    };
  }),
  toastCallbacks: {
    onSuccess: vi.fn(),
    onError: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('UpdateArticleForm', () => {
  const mockScrollTopAction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFormMethods.formState = { errors: {} };
    (React.useActionState as Mock).mockReturnValue([null, vi.fn(), false]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component successfully', () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByTestId('article-title')).toBeInTheDocument();
      expect(screen.getByText('Mettre à jour un article')).toBeInTheDocument();
    });

    it('should render ArticleTitle with correct props', () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const titleElement = screen.getByTestId('article-title');
      expect(titleElement).toHaveAttribute('data-level', 'h2');
      expect(titleElement).toHaveAttribute('data-size', 'large');
      expect(titleElement).toHaveAttribute('data-color', 'white');
      expect(titleElement).toHaveAttribute('data-spacings', 'mt-6 mb-4');
    });

    it('should render SearchArticle component when no article is selected', () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByTestId('search-article')).toBeInTheDocument();
      expect(
        screen.queryByTestId('article-markup-form')
      ).not.toBeInTheDocument();
    });

    it('should not display the back to search button initially', () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.queryByTestId('back-to-search')).not.toBeInTheDocument();
    });
  });

  describe('Form Initialization', () => {
    it('should initialize useForm with correct configuration', () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(ReactHookForm.useForm).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'onChange',
          reValidateMode: 'onChange',
          defaultValues: {
            id: 0,
            slug: '',
            title: '',
            introduction: '',
            main: '',
            published_at: null,
            created_at: '',
            updated_at: null,
            updated_by: null,
            author: 'x',
            author_email: 'example@example.com',
            validated: false,
            shipped: false,
            urls: [],
            main_audio_url: '',
            url_to_main_illustration: '',
          },
        })
      );
    });

    it('should register all required fields', () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(mockFormMethods.register).toHaveBeenCalledWith('id', {
        required: true,
      });
      expect(mockFormMethods.register).toHaveBeenCalledWith('slug', {
        required: true,
      });
      expect(mockFormMethods.register).toHaveBeenCalledWith('author', {
        required: true,
      });
      expect(mockFormMethods.register).toHaveBeenCalledWith('author_email', {
        required: true,
      });
      expect(mockFormMethods.register).toHaveBeenCalledWith('created_at', {
        required: true,
      });
      expect(mockFormMethods.register).toHaveBeenCalledWith('updated_at', {
        required: true,
      });
      expect(mockFormMethods.register).toHaveBeenCalledWith('published_at', {
        required: true,
      });
      expect(mockFormMethods.register).toHaveBeenCalledWith('validated', {
        required: true,
      });
      expect(mockFormMethods.register).toHaveBeenCalledWith('shipped', {
        required: true,
      });
      expect(mockFormMethods.register).toHaveBeenCalledWith('updated_by');
      expect(mockFormMethods.register).toHaveBeenCalledWith('urls');
    });
  });

  describe('Article Selection and Loading', () => {
    it('should fetch and display article when an article is selected', async () => {
      const { fetchArticleById } = await import('@/app/articleActions');

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(fetchArticleById).toHaveBeenCalledWith(123);
      });

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });
    });

    it('should display toast error when article fetch fails', async () => {
      const { fetchArticleById } = await import('@/app/articleActions');
      const { toast } = await import('sonner');

      (fetchArticleById as Mock).mockResolvedValueOnce({
        isSuccess: false,
        message: 'Article not found',
      });

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Article not found');
      });
    });

    it('should reset form when selectedId becomes undefined', async () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      // First select an article
      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });

      // Then click back to search
      const backButton = screen.getByTestId('back-to-search');
      await userEvent.click(backButton);

      await waitFor(() => {
        expect(mockFormMethods.reset).toHaveBeenCalled();
      });
    });

    it('should display back to search button when article is loaded', async () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('back-to-search')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form when data is modified', async () => {
      const { updateArticleAction } = await import('@/app/articleActions');
      const mockFormAction = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockFormAction,
        false,
      ]);

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      // Select an article
      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });

      // Submit the form
      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockFormMethods.handleSubmit).toHaveBeenCalled();
      });
    });

    it('should prevent submission when article is identical', async () => {
      const mockFormAction = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockFormAction,
        false,
      ]);
      (Ramda.equals as Mock).mockReturnValue(true);

      mockFormMethods.handleSubmit = vi.fn((fn) => (e: any) => {
        e?.preventDefault?.();

        return fn(mockArticle); // Submit identical data
      });

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      // Select an article
      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });

      // Submit the form
      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Aucune modification n'a été apportée à l'article.")
        ).toBeInTheDocument();
      });

      expect(mockFormAction).not.toHaveBeenCalled();
    });

    it('should call scrollTopAction when identical article is detected', async () => {
      (Ramda.equals as Mock).mockReturnValue(true);

      mockFormMethods.handleSubmit = vi.fn((fn) => (e: any) => {
        e?.preventDefault?.();

        return fn(mockArticle);
      });

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      // Select an article
      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });

      // Submit the form
      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockScrollTopAction).toHaveBeenCalled();
      });
    });

    it('should dismiss identical warning message when close button is clicked', async () => {
      (Ramda.equals as Mock).mockReturnValue(true);

      mockFormMethods.handleSubmit = vi.fn((fn) => (e: any) => {
        e?.preventDefault?.();

        return fn(mockArticle);
      });

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      // Select an article
      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });

      // Submit identical data
      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Aucune modification n'a été apportée à l'article.")
        ).toBeInTheDocument();
      });

      // Click the close button
      const closeButton = screen.getByRole('button', { name: '' });
      await userEvent.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByText(
            "Aucune modification n'a été apportée à l'article."
          )
        ).not.toBeInTheDocument();
      });
    });

    it('should disable submit button when isPending is true', async () => {
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), true]);

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      // Select an article
      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('submit-button')).toBeDisabled();
      });
    });

    it('should wrap submission in startTransition', async () => {
      const mockStartTransition = vi.fn((callback) => callback());
      (React.startTransition as Mock).mockImplementation(mockStartTransition);

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      // Select an article
      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });

      // Submit the form
      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockStartTransition).toHaveBeenCalled();
      });
    });
  });

  describe('URL Management', () => {
    it('should display URL inputs from loaded article', async () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('url-input-0')).toBeInTheDocument();
        expect(screen.getByTestId('url-input-1')).toBeInTheDocument();
      });
    });

    it('should call addInputs when add URL button is clicked', async () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });

      const addButton = screen.getByTestId('add-url-button');
      await userEvent.click(addButton);

      expect(mockAddInputs).toHaveBeenCalled();
    });

    it('should call removeInputs when remove URL button is clicked', async () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });

      const removeButton = screen.getByTestId('remove-url-button');
      await userEvent.click(removeButton);

      expect(mockRemoveInputs).toHaveBeenCalled();
    });
  });

  describe('Main Content Management', () => {
    it('should update main content via getMainContent callback', async () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });

      const updateButton = screen.getByText('Update Main Content');
      await userEvent.click(updateButton);

      expect(mockFormMethods.setValue).toHaveBeenCalledWith(
        'main',
        'Updated main content'
      );
    });
  });

  describe('Back to Search Navigation', () => {
    it('should return to search view when back to search is clicked', async () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      // Select an article
      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });

      // Click back to search
      const backButton = screen.getByTestId('back-to-search');
      await userEvent.click(backButton);

      await waitFor(() => {
        expect(screen.getByTestId('search-article')).toBeInTheDocument();
      });
    });

    it('should call scrollTopAction when back to search is clicked', async () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      // Select an article
      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });

      // Click back to search
      const backButton = screen.getByTestId('back-to-search');
      await userEvent.click(backButton);

      expect(mockScrollTopAction).toHaveBeenCalled();
    });
  });

  describe('Closing Actions', () => {
    it('should reset form state when closing actions are triggered', async () => {
      const mockClosingActions = vi.fn();
      const { withCallbacks } = await import('@/lib/toastCallbacks');

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      // Verify withCallbacks was called with closing actions
      expect(withCallbacks).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
        expect.any(Function)
      );
    });
  });

  describe('Error Handling', () => {
    it('should not submit form when there are validation errors', async () => {
      const mockFormAction = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockFormAction,
        false,
      ]);

      mockFormMethods.formState = {
        errors: {
          title: { message: 'Title is required' },
        },
      };

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      // Select an article
      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });

      // Attempt to submit
      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);

      // Form action should not be called due to errors
      expect(mockFormAction).not.toHaveBeenCalled();
    });
  });

  describe('Suspense Fallback', () => {
    it('should render Suspense wrapper around form', async () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });
    });
  });

  describe('Integration with useMainContentValidation', () => {
    it('should call useMainContentValidation hook', async () => {
      const { useMainContentValidation } = await import(
        '@/lib/useMaincontentValidation'
      );

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(useMainContentValidation).toHaveBeenCalledWith(
        'main',
        expect.any(Function),
        expect.any(Function),
        expect.any(Function)
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure when article is loaded', async () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        const form = screen.getByTestId('article-markup-form');
        expect(form).toBeInTheDocument();
        expect(form.tagName).toBe('FORM');
      });
    });

    it('should have accessible back to search button', async () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        const backButton = screen.getByTestId('back-to-search');
        expect(backButton).toHaveClass('button');
        expect(backButton).toHaveTextContent('Retour à la recherche');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing article data gracefully', async () => {
      const { fetchArticleById } = await import('@/app/articleActions');
      (fetchArticleById as Mock).mockResolvedValueOnce({
        isSuccess: true,
        article: null,
      });

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('search-article')).toBeInTheDocument();
      });
    });

    it('should handle article with empty urls array', async () => {
      const articleWithoutUrls = { ...mockArticle, urls: [] };
      mockFormMethods.getValues = vi.fn((fieldName?: string) => {
        if (fieldName === 'urls') return [];

        return articleWithoutUrls;
      });

      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });
    });

    it('should handle rapid article selection changes', async () => {
      render(<UpdateArticleForm scrollTopAction={mockScrollTopAction} />);

      const selectButton = screen.getByTestId('select-article-btn');

      // Click multiple times rapidly
      await userEvent.click(selectButton);
      await userEvent.click(selectButton);
      await userEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
      });
    });
  });
});
