/**
 * @file manageUser.test.tsx
 * @description Comprehensive unit tests for ManageUserForm component
 */

import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ManageUserForm from '@/app/editor/components/formComponents/manageUser';
import * as ReactHookForm from 'react-hook-form';
import * as React from 'react';

// Mock user data
const mockUsers = [
  {
    id: 1,
    email: 'user1@example.com',
    tiers_service_ident: 'user-001',
    role: 'contributor',
    permissions: JSON.stringify(['read:articles', 'create:articles']),
    created_at: '2024-01-01',
    last_connection_at: '2024-01-15',
  },
  {
    id: 2,
    email: 'admin@example.com',
    tiers_service_ident: 'admin-001',
    role: 'admin',
    permissions: JSON.stringify([
      'read:articles',
      'create:articles',
      'delete:articles',
    ]),
    created_at: '2024-01-01',
    last_connection_at: '2024-01-16',
  },
];

// Mock form methods
const mockFormMethods = {
  register: vi.fn((name, options) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  })),
  handleSubmit: vi.fn((fn) => (e: any) => {
    e?.preventDefault?.();

    return fn(mockUsers[0]);
  }),
  setValue: vi.fn(),
  reset: vi.fn(),
  formState: { errors: {} },
};

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

vi.mock('@/models/userSchema', () => ({
  userSchema: {
    parse: vi.fn((data) => data),
    safeParse: vi.fn((data) => ({ success: true, data })),
  },
}));

vi.mock('@/app/userActions', () => ({
  getUsersList: vi.fn().mockResolvedValue({
    isSuccess: true,
    usersList: [
      {
        id: 1,
        email: 'user1@example.com',
        tiers_service_ident: 'user-001',
        role: 'contributor',
        permissions: JSON.stringify(['read:articles', 'create:articles']),
        created_at: '2024-01-01',
        last_connection_at: '2024-01-15',
      },
      {
        id: 2,
        email: 'admin@example.com',
        tiers_service_ident: 'admin-001',
        role: 'admin',
        permissions: JSON.stringify([
          'read:articles',
          'create:articles',
          'delete:articles',
        ]),
        created_at: '2024-01-01',
        last_connection_at: '2024-01-16',
      },
    ],
  }),
  manageUsers: vi.fn().mockResolvedValue({
    isSuccess: true,
    message: 'User updated successfully',
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
    ({ itemList, handleSelectedUser, target, context }: any) => (
      <div
        data-testid="paginated-search"
        data-target={target}
        data-context={context}
      >
        {itemList.map((user: any) => (
          <div key={user.id} data-testid={`user-item-${user.id}`}>
            <span>{user.email}</span>
            <button
              data-testid={`update-btn-${user.id}`}
              onClick={() => handleSelectedUser(user, 'update')}
            >
              Update
            </button>
            <button
              data-testid={`delete-btn-${user.id}`}
              onClick={() => handleSelectedUser(user, 'delete')}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    )
  ),
}));

vi.mock('@/app/components/single-elements/userPermissions', () => ({
  __esModule: true,
  default: vi.fn(({ role }: { role: string }) => (
    <div data-testid="user-permissions" data-role={role}>
      User Permissions for {role}
    </div>
  )),
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
    }: any) => {
      const [isActive, setIsActive] = React.useState(false);

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

vi.mock('@/app/editor/components/resolvers/customResolver', () => ({
  customResolver: vi.fn(() => vi.fn()),
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

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/lib/utility-functions', () => ({
  isEmpty: vi.fn((value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'object') return Object.keys(value).length === 0;

    return false;
  }),
}));

vi.mock('@/models/user', () => ({
  UserRole: {
    ADMIN: 'admin',
    CONTRIBUTOR: 'contributor',
  },
  userRoles: ['contributor', 'admin'],
  adminPermissions: [
    'read:articles',
    'create:articles',
    'update:articles',
    'delete:articles',
    'validate:articles',
    'ship:articles',
    'create:user',
    'update:user',
    'delete:user',
    'enable:maintenance',
  ],
  contributorPermissions: [
    'read:articles',
    'create:articles',
    'update:articles',
    'validate:articles',
  ],
}));

describe('ManageUserForm', () => {
  const mockScrollTopAction = vi.fn();
  let mockModalRef: { current: HTMLDivElement | null };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFormMethods.formState = { errors: {} };
    (React.useActionState as Mock).mockReturnValue([null, vi.fn(), false]);

    mockModalRef = {
      current: {
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
        },
      } as any,
    };

    vi.spyOn(React, 'useRef').mockReturnValue(mockModalRef);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering and Initialization', () => {
    it('should render the component successfully', async () => {
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('paginated-search')).toBeInTheDocument();
      });
    });

    it('should fetch users list on mount', async () => {
      const { getUsersList } = await import('@/app/userActions');

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(getUsersList).toHaveBeenCalled();
      });
    });

    it('should display users list after fetching', async () => {
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('user-item-2')).toBeInTheDocument();
      });
    });

    it('should render ArticleTitle when users list is available', async () => {
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('article-title')).toBeInTheDocument();
        expect(
          screen.getByText('Sélectionnez un utilisateur')
        ).toBeInTheDocument();
      });
    });

    it('should render modal component', () => {
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should display error toast when fetching users fails', async () => {
      const { getUsersList } = await import('@/app/userActions');
      const { toast } = await import('sonner');

      (getUsersList as Mock).mockResolvedValueOnce({
        isSuccess: false,
        message: 'Failed to fetch users',
      });

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to fetch users');
      });
    });
  });

  describe('User Selection for Update', () => {
    it('should display edit form when update button is clicked', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('email')).toBeInTheDocument();
        expect(screen.getByTestId('tiersServiceIdent')).toBeInTheDocument();
        expect(screen.getByTestId('role')).toBeInTheDocument();
        expect(screen.getByTestId('final-submit')).toBeInTheDocument();
      });
    });

    it('should populate form with selected user data', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(ReactHookForm.useForm).toHaveBeenCalledWith(
          expect.objectContaining({
            values: mockUsers[0],
          })
        );
      });
    });

    it('should hide users list when user is selected', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId('paginated-search')
        ).not.toBeInTheDocument();
      });
    });

    it('should display user permissions component when user is selected', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('user-permissions')).toBeInTheDocument();
      });
    });

    it('should set user role based on selected user', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        const permissionsComponent = screen.getByTestId('user-permissions');
        expect(permissionsComponent).toHaveAttribute(
          'data-role',
          'contributor'
        );
      });
    });
  });

  describe('User Deletion Flow', () => {
    it('should open modal when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const deleteButton = screen.getByTestId('delete-btn-1');
      await user.click(deleteButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).toHaveClass('is-active');
      });
    });

    it('should display correct modal content for deletion', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const deleteButton = screen.getByTestId('delete-btn-1');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          'Confirmation de la suppression'
        );
        expect(screen.getByTestId('modal-description')).toHaveTextContent(
          'Êtes-vous sûr de vouloir supprimer cet utilisateur ?'
        );
        expect(screen.getByTestId('modal-cta-btn')).toHaveTextContent(
          'Supprimer'
        );
        expect(screen.getByTestId('modal-cancel-btn')).toHaveTextContent(
          'Annuler'
        );
      });
    });

    it('should call manageUsers action when deletion is confirmed', async () => {
      const user = userEvent.setup();
      const mockSendAction = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockSendAction,
        false,
      ]);

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const deleteButton = screen.getByTestId('delete-btn-1');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toHaveClass('is-active');
      });

      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        expect(mockSendAction).toHaveBeenCalled();
        const formData = mockSendAction.mock.calls[0][0];
        expect(formData.get('actionName')).toBe('delete');
        expect(formData.get('email')).toBe('user1@example.com');
      });
    });

    it('should close modal when deletion is confirmed', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const deleteButton = screen.getByTestId('delete-btn-1');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toHaveClass('is-active');
      });

      const ctaButton = screen.getByTestId('modal-cta-btn');
      await user.click(ctaButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).not.toHaveClass('is-active');
      });
    });

    it('should close modal and clear selection when deletion is cancelled', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const deleteButton = screen.getByTestId('delete-btn-1');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toHaveClass('is-active');
      });

      const cancelButton = screen.getByTestId('modal-cancel-btn');
      await user.click(cancelButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).not.toHaveClass('is-active');
      });
    });
  });

  describe('User Update Form', () => {
    it('should render all form fields when user is selected', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(
          screen.getByLabelText(/identifiant tiers service/i)
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/rôle/i)).toBeInTheDocument();
      });
    });

    it('should display role options in dropdown', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Contributor')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
      });
    });

    it('should update permissions when role is changed to admin', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('role')).toBeInTheDocument();
      });

      const roleSelect = screen.getByTestId('role');
      await user.selectOptions(roleSelect, 'admin');

      await waitFor(() => {
        expect(mockFormMethods.setValue).toHaveBeenCalledWith(
          'permissions',
          expect.arrayContaining(['delete:articles'])
        );
      });
    });

    it('should update permissions when role is changed to contributor', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-2')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-2');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('role')).toBeInTheDocument();
      });

      const roleSelect = screen.getByTestId('role');
      await user.selectOptions(roleSelect, 'contributor');

      await waitFor(() => {
        expect(mockFormMethods.setValue).toHaveBeenCalledWith(
          'permissions',
          expect.arrayContaining(['read:articles'])
        );
        expect(mockFormMethods.setValue).toHaveBeenCalledWith(
          'permissions',
          expect.not.arrayContaining(['delete:articles'])
        );
      });
    });
  });

  describe('Form Submission', () => {
    it('should call handleSubmit when form is submitted', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('final-submit')).toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('final-submit');
      await user.click(submitButton);

      expect(mockFormMethods.handleSubmit).toHaveBeenCalled();
    });

    it('should wrap submission in startTransition', async () => {
      const user = userEvent.setup();
      const mockStartTransition = vi.fn((callback) => callback());
      (React.startTransition as Mock).mockImplementation(mockStartTransition);

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('final-submit')).toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('final-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockStartTransition).toHaveBeenCalled();
      });
    });

    it('should construct FormData with update action', async () => {
      const user = userEvent.setup();
      const mockSendAction = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockSendAction,
        false,
      ]);

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('final-submit')).toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('final-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSendAction).toHaveBeenCalled();
        const formData = mockSendAction.mock.calls[0][0];
        expect(formData.get('actionName')).toBe('update');
        expect(formData.get('email')).toBe('user1@example.com');
        expect(formData.get('tiers_service_ident')).toBe('user-001');
        expect(formData.get('role')).toBe('contributor');
        expect(formData.get('permissions')).toBeTruthy();
      });
    });

    it('should disable submit button when isPending is true', async () => {
      const user = userEvent.setup();
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), true]);

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        const submitButton = screen.getByTestId('final-submit');
        expect(submitButton).toHaveClass('is-loading');
        expect(submitButton).toHaveTextContent('Chargement...');
      });
    });

    it('should enable submit button when isPending is false', async () => {
      const user = userEvent.setup();
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), false]);

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        const submitButton = screen.getByTestId('final-submit');
        expect(submitButton).not.toHaveClass('is-loading');
        expect(submitButton).toHaveTextContent("Modifier l'utilisateur");
      });
    });
  });

  describe('Back to Search Button', () => {
    it('should render back to search button when user is selected', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('back-to-search')).toBeInTheDocument();
      });
    });

    it('should return to users list when back to search is clicked', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('back-to-search')).toBeInTheDocument();
      });

      const backButton = screen.getByTestId('back-to-search');
      await user.click(backButton);

      await waitFor(() => {
        expect(screen.getByTestId('paginated-search')).toBeInTheDocument();
      });
    });

    it('should prevent default when back to search is clicked', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('back-to-search')).toBeInTheDocument();
      });

      const backButton = screen.getByTestId('back-to-search');
      await user.click(backButton);

      // Component should still be rendered (no navigation)
      expect(screen.getByTestId('paginated-search')).toBeInTheDocument();
    });
  });

  describe('Post-Action Cleanup', () => {
    it('should call performedAttheEnd callback after action', async () => {
      const { withCallbacks } = await import('@/lib/toastCallbacks');

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      expect(withCallbacks).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('should call scrollTopAction in performedAttheEnd', async () => {
      const user = userEvent.setup();
      const mockSendAction = vi
        .fn()
        .mockResolvedValue({ isSuccess: true, message: 'Success' });

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      const { withCallbacks } = await import('@/lib/toastCallbacks');

      await waitFor(() => {
        expect(withCallbacks).toHaveBeenCalled();
      });

      const performedAttheEnd = (withCallbacks as Mock).mock.calls[0][2];

      // Trigger the callback
      performedAttheEnd();

      await waitFor(() => {
        expect(mockScrollTopAction).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display email error message when validation fails', async () => {
      const user = userEvent.setup();
      mockFormMethods.formState = {
        errors: {
          email: { message: 'Invalid email address' },
        },
      };

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        expect(screen.getByText('Invalid email address')).toHaveClass(
          'has-text-danger'
        );
      });
    });

    it('should display tiers service ident error when validation fails', async () => {
      const user = userEvent.setup();
      mockFormMethods.formState = {
        errors: {
          tiers_service_ident: { message: 'Field is required' },
        },
      };

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Field is required')).toBeInTheDocument();
        expect(screen.getByText('Field is required')).toHaveClass(
          'has-text-danger'
        );
      });
    });

    it('should display role error when validation fails', async () => {
      const user = userEvent.setup();
      mockFormMethods.formState = {
        errors: {
          role: { message: 'Role is required' },
        },
      };

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Role is required')).toBeInTheDocument();
        expect(screen.getByText('Role is required')).toHaveClass(
          'has-text-danger'
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure when user is selected', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        const form = screen.getByTestId('final-submit').closest('form');
        expect(form).toBeInTheDocument();
        expect(form?.tagName).toBe('FORM');
      });
    });

    it('should have labels for all inputs', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(
          screen.getByLabelText(/identifiant tiers service/i)
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/rôle/i)).toBeInTheDocument();
      });
    });

    it('should have proper input IDs matching labels', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        const emailInput = screen.getByTestId('email');
        expect(emailInput).toHaveAttribute('id', 'Email');

        const tiersInput = screen.getByTestId('tiersServiceIdent');
        expect(tiersInput).toHaveAttribute('id', 'tiersServiceIdent');

        const roleSelect = screen.getByTestId('role');
        expect(roleSelect).toHaveAttribute('id', 'role');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle user without email gracefully when deleting', async () => {
      const user = userEvent.setup();
      const userWithoutEmail = { ...mockUsers[0], email: undefined };
      const { PaginatedSearchDisplay } = await import(
        '@/app/components/single-elements/paginatedSearchResults'
      );

      (PaginatedSearchDisplay as Mock).mockImplementationOnce(
        ({ handleSelectedUser }: any) => (
          <div data-testid="paginated-search">
            <button
              data-testid="delete-no-email"
              onClick={() => handleSelectedUser(userWithoutEmail, 'delete')}
            >
              Delete No Email
            </button>
          </div>
        )
      );

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('delete-no-email')).toBeInTheDocument();
      });

      const deleteButton = screen.getByTestId('delete-no-email');
      await user.click(deleteButton);

      // Modal should not open
      const modal = screen.getByTestId('modal');
      expect(modal).not.toHaveClass('is-active');
    });

    it('should handle user without id gracefully when updating', async () => {
      const user = userEvent.setup();
      const userWithoutId = { ...mockUsers[0], id: undefined };
      const { PaginatedSearchDisplay } = await import(
        '@/app/components/single-elements/paginatedSearchResults'
      );

      (PaginatedSearchDisplay as Mock).mockImplementationOnce(
        ({ handleSelectedUser }: any) => (
          <div data-testid="paginated-search">
            <button
              data-testid="update-no-id"
              onClick={() => handleSelectedUser(userWithoutId, 'update')}
            >
              Update No ID
            </button>
          </div>
        )
      );

      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('update-no-id')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-no-id');
      await user.click(updateButton);

      // Form should not be displayed
      expect(screen.queryByTestId('final-submit')).not.toBeInTheDocument();
    });

    it('should handle multiple role changes without crashing', async () => {
      const user = userEvent.setup();
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-btn-1');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('role')).toBeInTheDocument();
      });

      const roleSelect = screen.getByTestId('role');

      // Change role multiple times
      await user.selectOptions(roleSelect, 'admin');
      await user.selectOptions(roleSelect, 'contributor');
      await user.selectOptions(roleSelect, 'admin');

      expect(screen.getByTestId('user-permissions')).toBeInTheDocument();
    });
  });

  describe('PaginatedSearchDisplay Integration', () => {
    it('should pass correct props to PaginatedSearchDisplay', async () => {
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        const searchDisplay = screen.getByTestId('paginated-search');
        expect(searchDisplay).toHaveAttribute('data-target', 'user');
        expect(searchDisplay).toHaveAttribute('data-context', 'user');
      });
    });

    it('should display all users in the list', async () => {
      render(<ManageUserForm scrollTopAction={mockScrollTopAction} />);

      await waitFor(() => {
        expect(screen.getByText('user1@example.com')).toBeInTheDocument();
        expect(screen.getByText('admin@example.com')).toBeInTheDocument();
      });
    });
  });
});
