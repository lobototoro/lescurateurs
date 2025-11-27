/**
 * @file createUser.test.tsx
 * @description Comprehensive unit tests for CreateUserForm component
 */

import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateUserForm from '@/app/editor/components/formComponents/createUser';
import * as ReactHookForm from 'react-hook-form';
import * as React from 'react';

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

    return fn({
      email: 'test@example.com',
      tiers_service_ident: 'test-ident',
      role: 'contributor',
      permissions: JSON.stringify([
        'read:articles',
        'create:articles',
        'update:articles',
        'validate:articles',
      ]),
    });
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
  createUserAction: vi.fn().mockResolvedValue({
    isSuccess: true,
    message: 'User created successfully',
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

vi.mock('@/app/components/single-elements/userPermissions', () => ({
  __esModule: true,
  default: vi.fn(({ role }: { role: string }) => (
    <div data-testid="user-permissions" data-role={role}>
      User Permissions for {role}
    </div>
  )),
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

describe('CreateUserForm', () => {
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
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByTestId('article-title')).toBeInTheDocument();
      expect(screen.getByText('Créer un utilisateur')).toBeInTheDocument();
    });

    it('should render ArticleTitle with correct props', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const titleElement = screen.getByTestId('article-title');
      expect(titleElement).toHaveAttribute('data-level', 'h2');
      expect(titleElement).toHaveAttribute('data-size', 'large');
      expect(titleElement).toHaveAttribute('data-color', 'white');
      expect(titleElement).toHaveAttribute('data-spacings', 'mb-6');
    });

    it('should render email input field', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const emailInput = screen.getByTestId('email');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(screen.getByText('Email:')).toBeInTheDocument();
    });

    it('should render tiers service ident input field', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const tiersInput = screen.getByTestId('tiersServiceIdent');
      expect(tiersInput).toBeInTheDocument();
      expect(tiersInput).toHaveAttribute('type', 'text');
      expect(
        screen.getByText('Identifiant Tiers Service:')
      ).toBeInTheDocument();
    });

    it('should render role select dropdown', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const roleSelect = screen.getByTestId('role');
      expect(roleSelect).toBeInTheDocument();
      expect(screen.getByText('Rôle:')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Créer l'utilisateur");
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should render user permissions component', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const permissionsComponent = screen.getByTestId('user-permissions');
      expect(permissionsComponent).toBeInTheDocument();
    });
  });

  describe('Form Initialization', () => {
    it('should initialize useForm with correct configuration', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(ReactHookForm.useForm).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'onChange',
          reValidateMode: 'onBlur',
          defaultValues: {
            email: '',
            tiers_service_ident: '',
            role: 'contributor',
            permissions: JSON.stringify([
              'read:articles',
              'create:articles',
              'update:articles',
              'validate:articles',
            ]),
          },
        })
      );
    });

    it('should register permissions field as required', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(mockFormMethods.register).toHaveBeenCalledWith('permissions', {
        required: true,
      });
    });

    it('should initialize with admin role by default', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const permissionsComponent = screen.getByTestId('user-permissions');
      expect(permissionsComponent).toHaveAttribute('data-role', 'admin');
    });
  });

  describe('Role Selection', () => {
    it('should display all available roles in dropdown', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByText('Contributor')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('should update permissions when admin role is selected', async () => {
      const user = userEvent.setup();
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const roleSelect = screen.getByTestId('role');
      await user.selectOptions(roleSelect, 'admin');

      await waitFor(() => {
        expect(mockFormMethods.setValue).toHaveBeenCalledWith(
          'permissions',
          JSON.stringify([
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
          ])
        );
      });
    });

    it('should update permissions when contributor role is selected', async () => {
      const user = userEvent.setup();
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const roleSelect = screen.getByTestId('role');
      await user.selectOptions(roleSelect, 'contributor');

      await waitFor(() => {
        expect(mockFormMethods.setValue).toHaveBeenCalledWith(
          'permissions',
          JSON.stringify([
            'read:articles',
            'create:articles',
            'update:articles',
            'validate:articles',
          ])
        );
      });
    });

    it('should update UserPermissionsCheckboxes when role changes', async () => {
      const user = userEvent.setup();
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const roleSelect = screen.getByTestId('role');
      await user.selectOptions(roleSelect, 'admin');

      await waitFor(() => {
        const permissionsComponent = screen.getByTestId('user-permissions');
        expect(permissionsComponent).toHaveAttribute('data-role', 'admin');
      });
    });
  });

  describe('Form Submission', () => {
    it('should call handleSubmit when form is submitted', async () => {
      const user = userEvent.setup();
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      await user.click(submitButton);

      expect(mockFormMethods.handleSubmit).toHaveBeenCalled();
    });

    it('should wrap submission in startTransition', async () => {
      const user = userEvent.setup();
      const mockStartTransition = vi.fn((callback) => callback());
      (React.startTransition as Mock).mockImplementation(mockStartTransition);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockStartTransition).toHaveBeenCalled();
      });
    });

    it('should construct FormData with all required fields', async () => {
      const user = userEvent.setup();
      const mockFormAction = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockFormAction,
        false,
      ]);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFormAction).toHaveBeenCalled();
        const formData = mockFormAction.mock.calls[0][0];
        expect(formData).toBeInstanceOf(FormData);
        expect(formData.get('email')).toBe('test@example.com');
        expect(formData.get('tiers_service_ident')).toBe('test-ident');
        expect(formData.get('role')).toBe('contributor');
        expect(formData.get('permissions')).toBeTruthy();
      });
    });

    it('should serialize permissions as JSON string', async () => {
      const user = userEvent.setup();
      const mockFormAction = vi.fn();
      (React.useActionState as Mock).mockReturnValue([
        null,
        mockFormAction,
        false,
      ]);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      await user.click(submitButton);

      await waitFor(() => {
        const formData = mockFormAction.mock.calls[0][0];
        const permissions = formData.get('permissions');
        expect(() => JSON.parse(permissions as string)).not.toThrow();
      });
    });

    it('should disable submit button when isPending is true', () => {
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), true]);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Chargement...');
      expect(submitButton).toHaveClass('is-loading');
    });

    it('should enable submit button when isPending is false', () => {
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), false]);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Créer l'utilisateur");
      expect(submitButton).not.toHaveClass('is-loading');
    });
  });

  describe('Post-Submission Actions', () => {
    it('should call scrollTopAction after successful submission', async () => {
      const user = userEvent.setup();
      const mockFormAction = vi
        .fn()
        .mockResolvedValue({ isSuccess: true, message: 'Success' });

      const { withCallbacks } = await import('@/lib/toastCallbacks');
      const wrappedAction = withCallbacks(
        () => mockFormAction(),
        {},
        () => {
          mockScrollTopAction();
          mockFormMethods.reset();
        }
      );

      (React.useActionState as Mock).mockReturnValue([
        null,
        wrappedAction,
        false,
      ]);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockScrollTopAction).toHaveBeenCalled();
      });
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      const mockFormAction = vi
        .fn()
        .mockResolvedValue({ isSuccess: true, message: 'Success' });

      const { withCallbacks } = await import('@/lib/toastCallbacks');
      const wrappedAction = withCallbacks(
        () => mockFormAction(),
        {},
        () => {
          mockScrollTopAction();
          mockFormMethods.reset();
        }
      );

      (React.useActionState as Mock).mockReturnValue([
        null,
        wrappedAction,
        false,
      ]);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFormMethods.reset).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display email error message when validation fails', () => {
      mockFormMethods.formState = {
        errors: {
          email: { message: 'Invalid email address' },
        },
      };

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Invalid email address')).toHaveClass(
        'has-text-danger'
      );
    });

    it('should display tiers service ident error message when validation fails', () => {
      mockFormMethods.formState = {
        errors: {
          tiers_service_ident: { message: 'Field is required' },
        },
      };

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByText('Field is required')).toBeInTheDocument();
      expect(screen.getByText('Field is required')).toHaveClass(
        'has-text-danger'
      );
    });

    it('should display role error message when validation fails', () => {
      mockFormMethods.formState = {
        errors: {
          role: { message: 'Role is required' },
        },
      };

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByText('Role is required')).toBeInTheDocument();
      expect(screen.getByText('Role is required')).toHaveClass(
        'has-text-danger'
      );
    });

    it('should display multiple error messages simultaneously', () => {
      mockFormMethods.formState = {
        errors: {
          email: { message: 'Invalid email' },
          tiers_service_ident: { message: 'Field is required' },
          role: { message: 'Role is required' },
        },
      };

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      expect(screen.getByText('Field is required')).toBeInTheDocument();
      expect(screen.getByText('Role is required')).toBeInTheDocument();
    });
  });

  describe('useActionState Integration', () => {
    it('should initialize useActionState with wrapped action', async () => {
      const { withCallbacks } = await import('@/lib/toastCallbacks');

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(React.useActionState).toHaveBeenCalledWith(
        expect.any(Function),
        null
      );
      expect(withCallbacks).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('should pass performingAfter callback to withCallbacks', async () => {
      const { withCallbacks } = await import('@/lib/toastCallbacks');

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(withCallbacks).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
        expect.any(Function)
      );

      const performingAfter = (withCallbacks as Mock).mock.calls[0][2];
      expect(typeof performingAfter).toBe('function');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const form = screen
        .getByRole('button', {
          name: /créer l'utilisateur/i,
        })
        .closest('form');
      expect(form).toBeInTheDocument();
      expect(form?.tagName).toBe('FORM');
    });

    it('should have labels for all inputs', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/identifiant tiers service/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/rôle/i)).toBeInTheDocument();
    });

    it('should have proper input IDs matching labels', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const emailInput = screen.getByTestId('email');
      expect(emailInput).toHaveAttribute('id', 'Email');

      const tiersInput = screen.getByTestId('tiersServiceIdent');
      expect(tiersInput).toHaveAttribute('id', 'tiersServiceIdent');

      const roleSelect = screen.getByTestId('role');
      expect(roleSelect).toHaveAttribute('id', 'role');
    });

    it('should have proper button role', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      expect(submitButton).toHaveAttribute('role', 'button');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Edge Cases', () => {
    it('should handle role change without crashing', async () => {
      const user = userEvent.setup();
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const roleSelect = screen.getByTestId('role');

      // Change role multiple times
      await user.selectOptions(roleSelect, 'admin');
      await user.selectOptions(roleSelect, 'contributor');
      await user.selectOptions(roleSelect, 'admin');

      expect(screen.getByTestId('user-permissions')).toBeInTheDocument();
    });

    it('should maintain form state when role changes', async () => {
      const user = userEvent.setup();
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const emailInput = screen.getByTestId('email');
      const roleSelect = screen.getByTestId('role');

      // Type in email
      await user.type(emailInput, 'test@example.com');

      // Change role
      await user.selectOptions(roleSelect, 'admin');

      // Email should still be there
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should handle empty form submission gracefully', async () => {
      const user = userEvent.setup();
      mockFormMethods.handleSubmit = vi.fn((fn) => (e: any) => {
        e?.preventDefault?.();

        return fn({
          email: '',
          tiers_service_ident: '',
          role: 'contributor',
          permissions: JSON.stringify([]),
        });
      });

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      await user.click(submitButton);

      expect(mockFormMethods.handleSubmit).toHaveBeenCalled();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct classes to form elements', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const emailInput = screen.getByTestId('email');
      expect(emailInput).toHaveClass('input', 'mt-4');

      const tiersInput = screen.getByTestId('tiersServiceIdent');
      expect(tiersInput).toHaveClass('input', 'mt-4');
    });

    it('should apply correct classes to submit button when not pending', () => {
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), false]);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      expect(submitButton).toHaveClass(
        'button',
        'is-primary',
        'is-size-6',
        'has-text-white',
        'mt-5'
      );
      expect(submitButton).not.toHaveClass('is-loading');
    });

    it('should apply loading class to submit button when pending', () => {
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), true]);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      expect(submitButton).toHaveClass(
        'button',
        'is-primary',
        'is-size-6',
        'has-text-white',
        'mt-5',
        'is-loading'
      );
    });
  });

  describe('Permission Management', () => {
    it('should set admin permissions JSON string when admin is selected', async () => {
      const user = userEvent.setup();
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const roleSelect = screen.getByTestId('role');
      await user.selectOptions(roleSelect, 'admin');

      await waitFor(() => {
        const calls = mockFormMethods.setValue.mock.calls.filter(
          (call) => call[0] === 'permissions'
        );
        expect(calls.length).toBeGreaterThan(0);
        const permissionsValue = calls[calls.length - 1][1];
        const parsedPermissions = JSON.parse(permissionsValue);
        expect(parsedPermissions).toContain('delete:articles');
        expect(parsedPermissions).toContain('create:user');
        expect(parsedPermissions).toContain('enable:maintenance');
      });
    });

    it('should set contributor permissions JSON string when contributor is selected', async () => {
      const user = userEvent.setup();
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const roleSelect = screen.getByTestId('role');
      await user.selectOptions(roleSelect, 'contributor');

      await waitFor(() => {
        const calls = mockFormMethods.setValue.mock.calls.filter(
          (call) => call[0] === 'permissions'
        );
        expect(calls.length).toBeGreaterThan(0);
        const permissionsValue = calls[calls.length - 1][1];
        const parsedPermissions = JSON.parse(permissionsValue);
        expect(parsedPermissions).toContain('read:articles');
        expect(parsedPermissions).toContain('create:articles');
        expect(parsedPermissions).not.toContain('delete:articles');
        expect(parsedPermissions).not.toContain('create:user');
      });
    });
  });
});
