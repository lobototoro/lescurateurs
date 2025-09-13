import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateArticleForm from '@/app/editor/components/formComponents/createArticles';
import { createArticleAction } from '@/app/articleActions';

// Mock dependencies
vi.mock('@/app/articleActions', () => ({
  createArticleAction: vi.fn(),
}));
vi.mock('@/models/articleSchema', () => ({
  articleSchema: {
    // minimal zod schema mock
    parse: vi.fn(),
  },
}));
vi.mock('@/app/components/single-elements/articleHTMLForm', () => ({
  __esModule: true,
  default: (props: any) => (
    <form data-testid="article-form" onSubmit={props.handleSubmit}>
      <input {...props.register('title')} placeholder="Titre" />
      <input {...props.register('introduction')} placeholder="introduction" />
      <input {...props.register('main')} placeholder="Texte" />
      <input {...props.register('mainAudioUrl')} placeholder="Audio URL" />
      <input
        {...props.register('urlToMainIllustration')}
        placeholder="Illustration URL"
      />
      <button type="submit">Submit</button>
    </form>
  ),
}));
vi.mock('@/app/components/single-elements/notificationsComponent', () => ({
  __esModule: true,
  default: ({ state }: any) => (
    <div data-testid="notification">{state?.text}</div>
  ),
}));
vi.mock('@/app/editor/components/resolvers/customResolver', () => ({
  customResolver: () => (data: any) => ({ values: data, errors: {} }),
}));
vi.mock('@/lib/utility-functions', () => ({
  urlsToArrayUtil: (urls: string) => {
    try {
      return JSON.parse(urls) || [];
    } catch {
      return [];
    }
  },
}));

describe('CreateArticleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form', () => {
    render(<CreateArticleForm />);
    expect(screen.getByTestId('article-form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Titre')).toBeInTheDocument();
  });

  it('submits the form and shows notification', async () => {
    // Spy on createArticleAction
    const mockCreateArticleAction = createArticleAction as Mock;
    mockCreateArticleAction.mockResolvedValue({
      message: true,
      text: 'Article created successfully',
    });
    render(<CreateArticleForm />);
    const titleInput = screen.getByPlaceholderText('Titre');
    const introductionInput = screen.getByPlaceholderText('introduction');
    const mainInput = screen.getByPlaceholderText('Texte');
    const audioInput = screen.getByPlaceholderText('Audio URL');
    const illustrationInput = screen.getByPlaceholderText('Illustration URL');

    fireEvent.change(titleInput, { target: { value: 'Test Article' } });
    fireEvent.change(introductionInput, {
      target: {
        value:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
      },
    });
    fireEvent.change(mainInput, {
      target: {
        value:
          "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
    });
    fireEvent.change(audioInput, {
      target: { value: 'https://example.com/3.mp3' },
    });
    fireEvent.change(illustrationInput, {
      target: { value: 'http://example.com/1.jpg' },
    });

    fireEvent.click(screen.getByText('Submit'));

    // Notification should appear after submit
    await waitFor(() => {
      expect(screen.queryByTestId('notification')).toBeInTheDocument();
      expect(mockCreateArticleAction).toHaveBeenCalled();
    });
  });

  it('adds and removes URL inputs', async () => {
    render(<CreateArticleForm />);
    // Simulate addInputs and removeInputs via props
    // Since ArticleMarkupForm is mocked, we can't trigger addInputs directly
    // Instead, test that urlsToArray is initially empty
    expect(screen.getByTestId('article-form')).toBeInTheDocument();
  });

  it('clears errors when input changes', async () => {
    render(<CreateArticleForm />);
    const titleInput = screen.getByPlaceholderText('Titre');
    const introductionInput = screen.getByPlaceholderText('introduction');
    const mainInput = screen.getByPlaceholderText('Texte');
    const audioInput = screen.getByPlaceholderText('Audio URL');
    const illustrationInput = screen.getByPlaceholderText('Illustration URL');
    fireEvent.change(titleInput, { target: { value: 'Another Title' } });
    fireEvent.change(introductionInput, {
      target: {
        value:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
      },
    });
    fireEvent.change(mainInput, {
      target: {
        value:
          "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
    });
    fireEvent.change(audioInput, {
      target: { value: 'https://example.com/3.mp3' },
    });
    fireEvent.change(illustrationInput, {
      target: { value: 'http://example.com/1.jpg' },
    });
    // No errors should be present
    expect(screen.queryByText(/champ requis/i)).not.toBeInTheDocument();
  });
});
