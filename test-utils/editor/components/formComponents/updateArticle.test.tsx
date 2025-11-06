import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import UpdateArticleForm from '@/app/editor/components/formComponents/updateArticle';
import * as articleActions from '@/app/articleActions';

vi.mock('@/app/articleActions', () => ({
  fetchArticleById: vi.fn(),
  updateArticleAction: vi.fn(),
}));

vi.mock('@/app/components/single-elements/articleHTMLForm', () => ({
  __esModule: true,
  default: (props: any) => (
    <form data-testid="article-form" onSubmit={props.handleSubmit}>
      <input {...props.register('title')} placeholder="Titre" />
      <input {...props.register('introduction')} placeholder="introduction" />
      <input {...props.register('main')} placeholder="Texte" />
      <input {...props.register('main_audio_url')} placeholder="Audio URL" />
      <input
        {...props.register('url_to_main_illustration')}
        placeholder="Illustration URL"
      />
      <button type="submit">Submit</button>
    </form>
  ),
}));

vi.mock('@/app/editor/components/formComponents/searchArticle', () => ({
  default: ({ setSelection }: any) => (
    <button onClick={() => setSelection(1)}>Select Article</button>
  ),
}));

vi.mock('@/app/components/single-elements/notificationsComponent', () => ({
  default: ({ state }: any) => (
    <div data-testid="notification">{state?.text}</div>
  ),
}));

const mockFetchArticleById = articleActions.fetchArticleById as Mock;
mockFetchArticleById.mockResolvedValue({
  article: {
    id: 1,
    slug: 'test-slug',
    title: 'Test Title',
    introduction:
      "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    main: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\nWhy do we use it?\nIt is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    published_at: null,
    created_at: '2025-11-05',
    updated_at: null,
    updated_by: null,
    author: 'John Doe',
    author_email: 'johndoe@example.com',
    validated: false,
    shipped: false,
    urls: [],
    main_audio_url: 'https://www.fr.fr/2.mp3',
    url_to_main_illustration: 'https://www.fr.com.1.jpg',
  },
});
const mockUpdateArticleAction = articleActions.updateArticleAction as Mock;
mockUpdateArticleAction.mockResolvedValue({
  message: true,
  text: 'Article updated',
});

const scrollTopAction = vi.fn();

describe('UpdateArticleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders SearchArticle when no article is selected', async () => {
    render(<UpdateArticleForm scrollTopAction={scrollTopAction} />);
    await waitFor(() => {
      expect(screen.getByText('Select Article')).toBeInTheDocument();
    });
  });

  it('loads article and renders ArticleMarkupForm after selection', async () => {
    render(<UpdateArticleForm scrollTopAction={scrollTopAction} />);
    fireEvent.click(screen.getByText('Select Article'));

    await waitFor(() => {
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  it('shows notification after successful update', async () => {
    render(<UpdateArticleForm scrollTopAction={scrollTopAction} />);

    fireEvent.click(screen.getByText('Select Article'));

    await waitFor(() => screen.getByText('Submit'));

    const introductionInput = screen.getByPlaceholderText('introduction');
    fireEvent.change(introductionInput, {
      target: {
        value:
          "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, GGGG",
      },
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Submit'));
      expect(mockUpdateArticleAction).toHaveBeenCalled();
    });
  });

  it('shows identical warning if no changes are made', async () => {
    render(<UpdateArticleForm scrollTopAction={scrollTopAction} />);
    fireEvent.click(screen.getByText('Select Article'));
    await waitFor(() => screen.getByText('Submit'));
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(
        screen.getByText("Aucune modification n'a été apportée à l'article.")
      ).toBeInTheDocument();
    });
  });

  it('returns to search when "Retour à la recherche" is clicked', async () => {
    render(<UpdateArticleForm scrollTopAction={scrollTopAction} />);
    fireEvent.click(screen.getByText('Select Article'));
    await waitFor(() => screen.getByText('Retour à la recherche'));
    fireEvent.click(screen.getByText('Retour à la recherche'));
    await waitFor(() => {
      expect(screen.getByText('Select Article')).toBeInTheDocument();
    });
  });
});
