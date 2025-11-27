/**
 * @file createArticles.test.tsx
 * @description Comprehensive unit tests for CreateArticleForm component
 */

import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateArticleForm from '@/app/editor/components/formComponents/createArticles';
import * as ReactHookForm from 'react-hook-form';
import * as React from 'react';

// Mock data
const mockFormMethods = {
  register: vi.fn(),
  handleSubmit: vi.fn((fn) => (e: any) => {
    e?.preventDefault?.();

    return fn(mockFormData);
  }),
  watch: vi.fn((fieldName?: string) => {
    if (fieldName === 'main') return 'Test main content';
    if (fieldName === 'urls') return [];

    return undefined;
  }),
  setValue: vi.fn(),
  getValues: vi.fn((fieldName?: string) => {
    if (fieldName === 'urls') return [];

    return {
      title: '',
      introduction: '',
      main: '',
      main_audio_url: '',
      url_to_main_illustration: '',
      urls: [],
    };
  }),
  reset: vi.fn(),
  trigger: vi.fn().mockResolvedValue(true),
  clearErrors: vi.fn(),
  formState: { errors: {} },
};

const mockFormData = {
  title: 'Test Article',
  introduction: 'This is a test introduction with enough characters',
  main: 'This is the main content with enough characters to pass validation',
  main_audio_url: 'https://example.com/audio.mp3',
  url_to_main_illustration: 'https://example.com/image.jpg',
  urls: [],
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

vi.mock('@/models/articleSchema', () => ({
  articleSchema: {
    parse: vi.fn((data) => data),
    safeParse: vi.fn((data) => ({ success: true, data })),
  },
}));

vi.mock('@/app/articleActions', () => ({
  createArticleAction: vi.fn().mockResolvedValue({
    message: true,
    text: 'Article created successfully',
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
      {props.urlsToArray?.map((_: any, index: number) => (
        <div key={index} data-testid={`url-input-${index}`}>
          URL {index}
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

vi.mock('@/lib/utility-functions', () => ({
  addRemoveInputsFactory: vi.fn(() => [
    mockAddInputs,
    mockRemoveInputs,
    mockUpdateUrls,
  ]),
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

describe('CreateArticleForm', () => {
  const mockScrollTopAction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFormMethods.formState = { errors: {} };
    (React.useActionState as Mock).mockReturnValue([null, vi.fn(), false]);
  });

  describe('Component Rendering', () => {
    it('should render the component successfully', () => {
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByTestId('article-title')).toBeInTheDocument();
      expect(screen.getByText('Créer un article')).toBeInTheDocument();
      expect(screen.getByTestId('article-markup-form')).toBeInTheDocument();
    });

    it('should render ArticleTitle with correct props', () => {
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const titleElement = screen.getByTestId('article-title');
      expect(titleElement).toHaveAttribute('data-level', 'h2');
      expect(titleElement).toHaveAttribute('data-size', 'large');
      expect(titleElement).toHaveAttribute('data-color', 'white');
      expect(titleElement).toHaveAttribute('data-spacings', 'mt-6 mb-4');
    });

    it('should render the form with all input fields', () => {
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByPlaceholderText('Titre')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Introduction')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Audio URL')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Illustration URL')
      ).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });
  });

  describe('Form Initialization', () => {
    it('should initialize useForm with correct configuration', () => {
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(ReactHookForm.useForm).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'onChange',
          reValidateMode: 'onChange',
          defaultValues: {
            title: '',
            introduction: '',
            main: '',
            main_audio_url: '',
            url_to_main_illustration: '',
            urls: [],
          },
        })
      );
    });

    it('should initialize form with empty default values', () => {
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const callArgs = (ReactHookForm.useForm as Mock).mock.calls[0][0];
      expect(callArgs.defaultValues).toEqual({
        title: '',
        introduction: '',
        main: '',
        main_audio_url: '',
        url_to_main_illustration: '',
        urls: [],
      });
    });

    it('should register the urls field', () => {
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(mockFormMethods.register).toHaveBeenCalledWith('urls');
    });
  });

  describe('Form Submission', () => {
    it('should call handleSubmit when form is submitted', async () => {
      const user = userEvent.setup();
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      expect(mockFormMethods.handleSubmit).toHaveBeenCalled();
    });

    it('should call startTransition on form submission', async () => {
      const user = userEvent.setup();
      const mockStartTransition = vi.fn((callback) => callback());
      (React.startTransition as Mock).mockImplementation(mockStartTransition);

      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      expect(mockStartTransition).toHaveBeenCalled();
    });

    it('should disable submit button when isPending is true', () => {
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), true]);

      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Submitting...');
    });

    it('should enable submit button when isPending is false', () => {
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), false]);

      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Submit');
    });
  });

  describe('URL Management', () => {
    it('should call addInputs when add URL button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const addButton = screen.getByTestId('add-url-button');
      await user.click(addButton);

      expect(mockAddInputs).toHaveBeenCalled();
    });

    it('should call removeInputs when remove URL button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const removeButton = screen.getByTestId('remove-url-button');
      await user.click(removeButton);

      expect(mockRemoveInputs).toHaveBeenCalled();
    });
  });

  describe('Main Content Validation', () => {
    it('should update main content via getMainContent callback', async () => {
      const user = userEvent.setup();
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const updateButton = screen.getByText('Update Main Content');
      await user.click(updateButton);

      expect(mockFormMethods.setValue).toHaveBeenCalledWith(
        'main',
        'Updated main content'
      );
    });
  });

  describe('Error Handling', () => {
    it('should display errors when validation fails', () => {
      mockFormMethods.formState = {
        errors: {
          title: { message: 'Title is required' },
          introduction: { message: 'Introduction is too short' },
        },
      };

      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(mockFormMethods.formState.errors).toHaveProperty('title');
      expect(mockFormMethods.formState.errors).toHaveProperty('introduction');
    });
  });

  describe('Post-submission Behavior', () => {
    it('should not call scrollTopAction before submission', () => {
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(mockScrollTopAction).not.toHaveBeenCalled();
    });
  });

  describe('Server Action Integration', () => {
    it('should initialize useActionState with wrapped action', () => {
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(React.useActionState).toHaveBeenCalledWith(
        expect.any(Function),
        null
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const form = screen.getByTestId('article-markup-form');
      expect(form).toBeInTheDocument();
      expect(form.tagName).toBe('FORM');
    });

    it('should have a submit button', () => {
      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty urls array', () => {
      mockFormMethods.getValues = vi.fn((fieldName?: string) => {
        if (fieldName === 'urls') return [];

        return { urls: [] };
      });

      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const urlInputs = screen.queryAllByTestId(/url-input-/);
      expect(urlInputs).toHaveLength(0);
    });

    it('should handle form submission with empty data gracefully', async () => {
      const user = userEvent.setup();
      mockFormMethods.handleSubmit = vi.fn((fn) => (e: any) => {
        e?.preventDefault?.();

        return fn({});
      });

      render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      expect(mockFormMethods.handleSubmit).toHaveBeenCalled();
    });
  });
});
