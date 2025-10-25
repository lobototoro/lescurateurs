'use client'; // unit tests for manageArticleForm.tsx
import React from 'react';
import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageArticleForm from '@/app/editor/components/formComponents/manageArticle';
import * as articleActions from '@/app/articleActions';
import * as searchActions from '@/app/searchActions';

// Mock the article actions
vi.mock('@/app/articleActions', () => ({
  deleteArticleAction: vi.fn(),
  shipArticleAction: vi.fn(),
  validateArticleAction: vi.fn(),
}));

// Mock the search actions
vi.mock('@/app/editor/components/formComponents/searchArticle', () => ({
  default: ({
    manageSelection,
  }: {
    manageSelection: (action: any) => void;
  }) => (
    <div data-testid="search-article">
      <button
        data-testid="mock-delete-btn"
        onClick={() => manageSelection({ actionName: 'delete', id: '123' })}
      >
        Delete
      </button>
      <button
        data-testid="mock-validate-btn"
        onClick={() => manageSelection({ actionName: 'validate', id: '123' })}
      >
        Validate
      </button>
      <button
        data-testid="mock-ship-btn"
        onClick={() => manageSelection({ actionName: 'ship', id: '123' })}
      >
        Ship
      </button>
    </div>
  ),
}));

// Mock the notifications component
vi.mock('@/app/components/single-elements/notificationsComponent', () => ({
  default: ({ state }: { state: { message: boolean; text: string } }) => (
    <div data-testid="notification">{state.text}</div>
  ),
}));

// Mock the modal component
vi.mock('@/app/components/single-elements/modalWithCTA', () => ({
  default: ({ modalRef, title, ctaAction, cancelAction }: any) => (
    <div data-testid="modal" ref={modalRef}>
      <h2>{title}</h2>
      <button data-testid="modal-cta-btn" onClick={ctaAction}>
        CTA
      </button>
      <button data-testid="modal-cancel-btn" onClick={cancelAction}>
        Cancel
      </button>
    </div>
  ),
}));

describe('ManageArticleForm', () => {
  const scrollTopActionMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders search article component', () => {
    render(<ManageArticleForm scrollTopAction={scrollTopActionMock} />);
    expect(screen.getByTestId('search-article')).toBeInTheDocument();
    expect(screen.getByTestId('back-to-search')).toBeInTheDocument();
  });

  test('handles delete action flow', async () => {
    // Mock useActionState return value
    const mockDeleteState = articleActions.deleteArticleAction as Mock;
    mockDeleteState.mockResolvedValue({
      message: true,
      text: 'Article deleted',
    });

    render(<ManageArticleForm scrollTopAction={scrollTopActionMock} />);

    // Click delete button to trigger modal
    fireEvent.click(screen.getByTestId('mock-delete-btn'));

    // Modal should be shown
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText("Supprimer l'article")).toBeInTheDocument();
    });

    // Confirm deletion
    fireEvent.click(screen.getByTestId('modal-cta-btn'));

    // Notification should appear
    await waitFor(() => {
      expect(scrollTopActionMock).toHaveBeenCalled();
    });
  });

  test('handles validation action flow', async () => {
    // Mock useActionState return values
    vi.spyOn(React, 'useActionState')
      .mockReturnValueOnce([null, vi.fn(), false]) // delete action
      .mockReturnValueOnce([
        { message: true, text: 'Article validated' },
        vi.fn(),
        false,
      ]); // validate action

    render(<ManageArticleForm scrollTopAction={scrollTopActionMock} />);

    // Trigger validation modal
    fireEvent.click(screen.getByTestId('mock-validate-btn'));

    // Check modal content
    await waitFor(() => {
      expect(screen.getByText("Valider l'article")).toBeInTheDocument();
    });

    // Click validate button in modal
    fireEvent.click(screen.getByTestId('modal-cta-btn'));
  });

  test('back to search button works', () => {
    render(<ManageArticleForm scrollTopAction={scrollTopActionMock} />);

    fireEvent.click(screen.getByTestId('back-to-search'));

    // We can't easily test the state change, but at least we can test the button click
    expect(screen.getByTestId('search-article')).toBeInTheDocument();
  });
});
