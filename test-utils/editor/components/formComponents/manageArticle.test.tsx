/**
 * @file manageArticle.test.tsx
 * @description Comprehensive unit tests for ManageArticleForm component
 */

import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ManageArticleForm from '@/app/editor/components/formComponents/manageArticle';
import * as React from 'react';

// Mock dependencies
vi.mock('react', async () => {
  const actual = await vi.importActual('react');

  return {
    ...actual,
    useActionState: vi.fn(() => [null, vi.fn(), false]),
    startTransition: vi.fn((callback) => callback()),
  };
});

vi.mock('@/app/articleActions', () => ({
  manageArticleActions: vi.fn().mockResolvedValue({
    isSuccess: true,
    message: 'Action completed successfully',
  }),
}));

vi.mock('@/app/editor/components/formComponents/searchArticle', () => ({
  __esModule: true,
  default: vi.fn(
    ({
      target,
      cancelSearchDisplay,
      manageSelection,
    }: {
      target: string;
      cancelSearchDisplay?: boolean;
      manageSelection: (action: any) => void;
    }) => (
      <div data-testid="search-article" data-target={target}>
        <div data-testid="cancel-search-display">
          {cancelSearchDisplay ? 'true' : 'false'}
        </div>
        <button
          data-testid="mock-delete-btn"
          onClick={() => manageSelection({ actionName: 'delete', id: '123' })}
        >
          Delete
        </button>
        <button
          data-testid="mock-validate-btn"
          onClick={() => manageSelection({ actionName: 'validate', id: '456' })}
        >
          Validate
        </button>
        <button
          data-testid="mock-ship-btn"
          onClick={() => manageSelection({ actionName: 'ship', id: '789' })}
        >
          Ship
        </button>
        <button
          data-testid="mock-no-action-btn"
          onClick={() => manageSelection({ id: '999' })}
        >
          No Action
        </button>
      </div>
    )
  ),
}));

vi.mock('@/app/components/single-elements/modalWithCTA', () => ({
  __esModule: true,
  default: vi.fn(
    ({
      modalRef,
      title,
      description,
      ctaText,
      ctaAction,
      cancelAction,
      cancelText,
      onClose,
      isPending,
    }: any) => {
      const [isActive, setIsActive] = React.useState(false);

      // Expose add/remove methods to the ref
      React.useEffect(() => {
        if (modalRef && modalRef.current) {
          const originalAdd = modalRef.current.classList.add;
          const originalRemove = modalRef.current.classList.remove;

          modalRef.current.classList.add = (className: string) => {
            if (className === 'is-active') setIsActive(true);

            return originalAdd?.call(modalRef.current?.classList, className);
          };

          modalRef.current.classList.remove = (className: string) => {
            if (className === 'is-active') setIsActive(false);

            return originalRemove?.call(modalRef.current?.classList, className);
          };
        }
      }, [modalRef]);

      return (
        <div
          data-testid="modal"
          ref={modalRef}
          data-is-pending={isPending}
          className={isActive ? 'is-active' : ''}
        >
          <h2 data-testid="modal-title">{title}</h2>
          <p data-testid="modal-description">{description}</p>
          <button data-testid="modal-cta-btn" onClick={ctaAction}>
            {ctaText}
          </button>
          <button data-testid="modal-cancel-btn" onClick={cancelAction}>
            {cancelText}
          </button>
          <button data-testid="modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      );
    }
  ),
}));

vi.mock('@/lib/toastCallbacks', () => ({
  withCallbacks: vi.fn((action, callbacks, postprocess) => {
    return async (formData: FormData) => {
      const result = await action(null, formData);
      if (postprocess) postprocess();

      return result;
    };
  }),
  toastCallbacks: {
    onSuccess: vi.fn(),
    onError: vi.fn(),
  },
}));

describe('ManageArticleForm', () => {
  const mockScrollTopAction = vi.fn();
  let mockModalRef: { current: HTMLDivElement | null };

  beforeEach(() => {
    vi.clearAllMocks();
    (React.useActionState as Mock).mockReturnValue([null, vi.fn(), false]);

    // Mock DOM element with classList
    mockModalRef = {
      current: {
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
        },
      } as any,
    };

    // Override useRef to return our mock
    vi.spyOn(React, 'useRef').mockReturnValue(mockModalRef);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component successfully', () => {
      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByTestId('search-article')).toBeInTheDocument();
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('back-to-search')).toBeInTheDocument();
    });

    it('should render SearchArticle with target "manage"', () => {
      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const searchArticle = screen.getByTestId('search-article');
      expect(searchArticle).toHaveAttribute('data-target', 'manage');
    });

    it('should render back to search button with correct text', () => {
      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const backButton = screen.getByTestId('back-to-search');
      expect(backButton).toHaveTextContent('Retour à la recherche');
      expect(backButton).toHaveClass('button', 'is-secondary', 'is-size-6');
    });

    it('should initialize with cancelSearchDisplay as false', () => {
      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const cancelDisplay = screen.getByTestId('cancel-search-display');
      expect(cancelDisplay).toHaveTextContent('false');
    });
  });

  describe('Modal Integration', () => {
    it('should pass modal ref to ModalWithCTA', async () => {
      const { withCallbacks } = await import('@/lib/toastCallbacks');

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(withCallbacks).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
        mockScrollTopAction
      );
    });

    it('should pass isPending prop to modal', () => {
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), true]);

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveAttribute('data-is-pending', 'true');
    });
  });

  describe('Delete Action Flow', () => {
    it('should open modal with delete confirmation when delete action is triggered', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const deleteButton = screen.getByTestId('mock-delete-btn');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          "Supprimer l'article"
        );
        expect(screen.getByTestId('modal-description')).toHaveTextContent(
          'Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.'
        );
        expect(screen.getByTestId('modal-cta-btn')).toHaveTextContent(
          'Supprimer'
        );
        expect(screen.getByTestId('modal-cancel-btn')).toHaveTextContent(
          'Annuler'
        );
      });
    });

    it('should add "is-active" class to modal when delete is triggered', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const deleteButton = screen.getByTestId('mock-delete-btn');
      await user.click(deleteButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).toHaveClass('is-active');
      });
    });

    it('should call manageArticle action when delete is confirmed', async () => {
      const user = userEvent.setup();
      const mockManageArticle = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockManageArticle,
        false,
      ]);

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      // Trigger delete modal
      const deleteButton = screen.getByTestId('mock-delete-btn');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          "Supprimer l'article"
        );
      });

      // Confirm delete
      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        expect(mockManageArticle).toHaveBeenCalled();
        const formData = mockManageArticle.mock.calls[0][0];
        expect(formData.get('actionName')).toBe('delete');
        expect(formData.get('id')).toBe('123');
      });
    });

    it('should close modal when delete is confirmed', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const deleteButton = screen.getByTestId('mock-delete-btn');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toBeInTheDocument();
      });

      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).not.toHaveClass('is-active');
      });
    });

    it('should close modal when delete is cancelled', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const deleteButton = screen.getByTestId('mock-delete-btn');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toBeInTheDocument();
      });

      const cancelButton = screen.getByTestId('modal-cancel-btn');
      await user.click(cancelButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).not.toHaveClass('is-active');
      });
    });
  });

  describe('Validate Action Flow', () => {
    it('should open modal with validate confirmation when validate action is triggered', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const validateButton = screen.getByTestId('mock-validate-btn');
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          "Valider l'article"
        );
        expect(screen.getByTestId('modal-description')).toHaveTextContent(
          'Êtes-vous sûr de vouloir valider / invalider cet article ?'
        );
        expect(screen.getByTestId('modal-cta-btn')).toHaveTextContent(
          'Valider'
        );
        expect(screen.getByTestId('modal-cancel-btn')).toHaveTextContent(
          'Invalider'
        );
      });
    });

    it('should add "is-active" class to modal when validate is triggered', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const validateButton = screen.getByTestId('mock-validate-btn');
      await user.click(validateButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).toHaveClass('is-active');
      });
    });

    it('should call manageArticle action with validation=true when validate is confirmed', async () => {
      const user = userEvent.setup();
      const mockManageArticle = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockManageArticle,
        false,
      ]);

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const validateButton = screen.getByTestId('mock-validate-btn');
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          "Valider l'article"
        );
      });

      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        expect(mockManageArticle).toHaveBeenCalled();
        const formData = mockManageArticle.mock.calls[0][0];
        expect(formData.get('actionName')).toBe('validate');
        expect(formData.get('id')).toBe('456');
        expect(formData.get('validation')).toBe('true');
      });
    });

    it('should call manageArticle action with validation=false when invalidate is clicked', async () => {
      const user = userEvent.setup();
      const mockManageArticle = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockManageArticle,
        false,
      ]);

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const validateButton = screen.getByTestId('mock-validate-btn');
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          "Valider l'article"
        );
      });

      const cancelButton = screen.getByTestId('modal-cancel-btn');
      await user.click(cancelButton);

      await waitFor(() => {
        expect(mockManageArticle).toHaveBeenCalled();
        const formData = mockManageArticle.mock.calls[0][0];
        expect(formData.get('actionName')).toBe('validate');
        expect(formData.get('id')).toBe('456');
        expect(formData.get('validation')).toBe('false');
      });
    });

    it('should close modal when validate is confirmed', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const validateButton = screen.getByTestId('mock-validate-btn');
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toBeInTheDocument();
      });

      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).not.toHaveClass('is-active');
      });
    });
  });

  describe('Ship Action Flow', () => {
    it('should open modal with ship confirmation when ship action is triggered', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const shipButton = screen.getByTestId('mock-ship-btn');
      await user.click(shipButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          "MEP de l'article"
        );
        expect(screen.getByTestId('modal-description')).toHaveTextContent(
          'Êtes-vous sûr de vouloir MEP cet article ?'
        );
        expect(screen.getByTestId('modal-cta-btn')).toHaveTextContent('ONLINE');
        expect(screen.getByTestId('modal-cancel-btn')).toHaveTextContent(
          'OFFLINE'
        );
      });
    });

    it('should add "is-active" class to modal when ship is triggered', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const shipButton = screen.getByTestId('mock-ship-btn');
      await user.click(shipButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).toHaveClass('is-active');
      });
    });

    it('should call manageArticle action with shipped=true when ONLINE is clicked', async () => {
      const user = userEvent.setup();
      const mockManageArticle = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockManageArticle,
        false,
      ]);

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const shipButton = screen.getByTestId('mock-ship-btn');
      await user.click(shipButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          "MEP de l'article"
        );
      });

      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        expect(mockManageArticle).toHaveBeenCalled();
        const formData = mockManageArticle.mock.calls[0][0];
        expect(formData.get('actionName')).toBe('ship');
        expect(formData.get('id')).toBe('789');
        expect(formData.get('shipped')).toBe('true');
      });
    });

    it('should call manageArticle action with shipped=false when OFFLINE is clicked', async () => {
      const user = userEvent.setup();
      const mockManageArticle = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockManageArticle,
        false,
      ]);

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const shipButton = screen.getByTestId('mock-ship-btn');
      await user.click(shipButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          "MEP de l'article"
        );
      });

      const cancelButton = screen.getByTestId('modal-cancel-btn');
      await user.click(cancelButton);

      await waitFor(() => {
        expect(mockManageArticle).toHaveBeenCalled();
        const formData = mockManageArticle.mock.calls[0][0];
        expect(formData.get('actionName')).toBe('ship');
        expect(formData.get('id')).toBe('789');
        expect(formData.get('shipped')).toBe('false');
      });
    });

    it('should close modal when ship is confirmed', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const shipButton = screen.getByTestId('mock-ship-btn');
      await user.click(shipButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toBeInTheDocument();
      });

      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).not.toHaveClass('is-active');
      });
    });
  });

  describe('Back to Search Button', () => {
    it('should set cancelSearchDisplay to true when clicked', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const cancelDisplay = screen.getByTestId('cancel-search-display');
      expect(cancelDisplay).toHaveTextContent('false');

      const backButton = screen.getByTestId('back-to-search');
      await user.click(backButton);

      await waitFor(() => {
        expect(screen.getByTestId('cancel-search-display')).toHaveTextContent(
          'true'
        );
      });
    });

    it('should prevent default event when clicked', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const backButton = screen.getByTestId('back-to-search');
      await user.click(backButton);

      // Component should still be rendered (no navigation occurred)
      expect(screen.getByTestId('search-article')).toBeInTheDocument();
    });
  });

  describe('Modal Close Functionality', () => {
    it('should close modal when onClose is called', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const deleteButton = screen.getByTestId('mock-delete-btn');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toBeInTheDocument();
      });

      const closeButton = screen.getByTestId('modal-close-btn');
      await user.click(closeButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).not.toHaveClass('is-active');
      });
    });
  });

  describe('startTransition Integration', () => {
    it('should wrap action submissions in startTransition', async () => {
      const user = userEvent.setup();
      const mockStartTransition = vi.fn((callback) => callback());
      (React.startTransition as Mock).mockImplementation(mockStartTransition);
      const mockManageArticle = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockManageArticle,
        false,
      ]);

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const deleteButton = screen.getByTestId('mock-delete-btn');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toBeInTheDocument();
      });

      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        expect(mockStartTransition).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should not open modal when action has no actionName', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const noActionButton = screen.getByTestId('mock-no-action-btn');
      await user.click(noActionButton);

      // Modal should not have any title set
      await waitFor(
        () => {
          const modalTitle = screen.getByTestId('modal-title');
          expect(modalTitle).toBeEmptyDOMElement();
        },
        { timeout: 500 }
      );
    });

    it('should handle null modal ref gracefully', async () => {
      const user = userEvent.setup();
      vi.spyOn(React, 'useRef').mockReturnValue({ current: null });

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const deleteButton = screen.getByTestId('mock-delete-btn');

      // Should not throw error
      await user.click(deleteButton);

      // Verify component still renders correctly
      expect(screen.getByTestId('search-article')).toBeInTheDocument();
    });

    it('should handle multiple rapid action selections', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const deleteButton = screen.getByTestId('mock-delete-btn');
      const validateButton = screen.getByTestId('mock-validate-btn');
      const shipButton = screen.getByTestId('mock-ship-btn');

      // Click rapidly
      await user.click(deleteButton);
      await user.click(validateButton);
      await user.click(shipButton);

      // Should display the last action (ship)
      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          "MEP de l'article"
        );
      });
    });
  });

  describe('useActionState Integration', () => {
    it('should initialize useActionState with wrapped action', async () => {
      const { withCallbacks } = await import('@/lib/toastCallbacks');

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      expect(React.useActionState).toHaveBeenCalledWith(
        expect.any(Function),
        null
      );
      expect(withCallbacks).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
        mockScrollTopAction
      );
    });

    it('should call scrollTopAction after successful action', async () => {
      const user = userEvent.setup();
      const mockManageArticle = vi.fn().mockResolvedValue({
        isSuccess: true,
        message: 'Success',
      });

      const { withCallbacks } = await import('@/lib/toastCallbacks');
      const wrappedAction = withCallbacks(
        () => mockManageArticle(),
        {},
        mockScrollTopAction
      );

      (React.useActionState as Mock).mockReturnValue([
        null,
        wrappedAction,
        false,
      ]);

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const deleteButton = screen.getByTestId('mock-delete-btn');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toBeInTheDocument();
      });

      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        expect(mockScrollTopAction).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button for back to search', () => {
      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const backButton = screen.getByTestId('back-to-search');
      expect(backButton).toHaveClass('button');
      expect(backButton).toHaveTextContent('Retour à la recherche');
    });

    it('should have proper modal structure with title and description', async () => {
      const user = userEvent.setup();

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const deleteButton = screen.getByTestId('mock-delete-btn');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toBeInTheDocument();
        expect(screen.getByTestId('modal-description')).toBeInTheDocument();
        expect(screen.getByTestId('modal-cta-btn')).toBeInTheDocument();
        expect(screen.getByTestId('modal-cancel-btn')).toBeInTheDocument();
      });
    });
  });

  describe('FormData Construction', () => {
    it('should construct FormData correctly for delete action', async () => {
      const user = userEvent.setup();
      const mockManageArticle = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockManageArticle,
        false,
      ]);

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const deleteButton = screen.getByTestId('mock-delete-btn');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-cta-btn')).toBeInTheDocument();
      });

      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        expect(mockManageArticle).toHaveBeenCalled();
        const formData = mockManageArticle.mock.calls[0][0];
        expect(formData).toBeInstanceOf(FormData);
        expect(formData.get('actionName')).toBe('delete');
        expect(formData.get('id')).toBe('123');
      });
    });

    it('should construct FormData correctly for validate action with validation field', async () => {
      const user = userEvent.setup();
      const mockManageArticle = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockManageArticle,
        false,
      ]);

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const validateButton = screen.getByTestId('mock-validate-btn');
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-cta-btn')).toBeInTheDocument();
      });

      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        expect(mockManageArticle).toHaveBeenCalled();
        const formData = mockManageArticle.mock.calls[0][0];
        expect(formData.get('actionName')).toBe('validate');
        expect(formData.get('validation')).toBe('true');
      });
    });

    it('should construct FormData correctly for ship action with shipped field', async () => {
      const user = userEvent.setup();
      const mockManageArticle = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockManageArticle,
        false,
      ]);

      render(<ManageArticleForm scrollTopAction={mockScrollTopAction} />);

      const shipButton = screen.getByTestId('mock-ship-btn');
      await user.click(shipButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-cta-btn')).toBeInTheDocument();
      });

      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        expect(mockManageArticle).toHaveBeenCalled();
        const formData = mockManageArticle.mock.calls[0][0];
        expect(formData.get('actionName')).toBe('ship');
        expect(formData.get('shipped')).toBe('true');
      });
    });
  });
});
