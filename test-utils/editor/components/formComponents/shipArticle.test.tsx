import { useActionState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import ShipArticleForm from '@/app/editor/components/formComponents/shipArticle';

// Mock dependencies
vi.mock('react', async () => {
  const actual = await vi.importActual('react');

  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

vi.mock('@/app/editor/components/formComponents/searchArticle', () => ({
  __esModule: true,
  default: ({
    setSelection,
  }: {
    setSelection: (id: number | string) => void;
  }) => (
    <div data-testid="search-article">
      <button onClick={() => setSelection(1)}>Select Article</button>
    </div>
  ),
}));

vi.mock('@/app/articleActions', () => ({
  __esModule: true,
  shipArticleAction: vi.fn().mockImplementation(() => ({
    message: 'Success',
    text: 'Success message',
  })),
}));

describe('ShipArticleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useActionState as Mock).mockReturnValue([null, vi.fn(), false]);
  });

  it('renders the SearchArticle component when no notification is present', () => {
    render(<ShipArticleForm />);
    expect(screen.getByTestId('search-article')).toBeDefined();
  });

  it('displays a notification when state is updated', async () => {
    (useActionState as Mock).mockReturnValue([
      { text: 'Success message' },
      vi.fn(),
      false,
    ]);
    render(<ShipArticleForm />);
    expect(screen.getByText('Success message')).toBeDefined();
  });

  it('opens the modal when an article is selected', async () => {
    render(<ShipArticleForm />);
    fireEvent.click(screen.getByText('Select Article'));
    await waitFor(() => {
      expect(screen.getByTestId('delete-article-modal').classList).toContain(
        'is-active'
      );
    });
  });

  it('closes the modal when the background is clicked', async () => {
    render(<ShipArticleForm />);
    fireEvent.click(screen.getByText('Select Article'));
    await waitFor(() => {
      expect(screen.getByTestId('delete-article-modal').classList).toContain(
        'is-active'
      );
    });
    fireEvent.click(
      screen
        .getByTestId('delete-article-modal')
        .querySelector('.modal-background')!
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('delete-article-modal').classList
      ).not.toContain('is-active');
    });
  });

  it("calls handleValidate with true when 'Mep ?' button is clicked", async () => {
    const mockFormAction = vi.fn();
    (useActionState as Mock).mockReturnValue([null, mockFormAction, false]);

    render(<ShipArticleForm />);
    fireEvent.click(screen.getByText('Select Article'));
    fireEvent.click(screen.getByText('Mep ?'));

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it("calls handleValidate with false when 'retirer de la Mep ?' button is clicked", async () => {
    const mockFormAction = vi.fn();
    (useActionState as Mock).mockReturnValue([null, mockFormAction, false]);

    render(<ShipArticleForm />);
    fireEvent.click(screen.getByText('Select Article'));
    fireEvent.click(screen.getByText('retirer de la Mep ?'));

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it("closes the modal and resets selectedId when 'Annuler' button is clicked", async () => {
    render(<ShipArticleForm />);
    fireEvent.click(screen.getByText('Select Article'));
    fireEvent.click(screen.getByText('Annuler'));

    await waitFor(() => {
      expect(
        screen.getByTestId('delete-article-modal').classList
      ).not.toContain('is-active');
    });
  });
});
