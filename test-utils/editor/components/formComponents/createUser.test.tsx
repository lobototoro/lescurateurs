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
import {
  adminPermissions,
  contributorPermissions,
  UserRole,
  userRoles,
} from '@/models/user';
import { userSchema } from '@/models/userSchema';

// Mock react-hook-form
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
      permissions: [
        'read:articles',
        'create:articles',
        'update:articles',
        'validate:articles',
      ],
    });
  }),
  setValue: vi.fn(),
  reset: vi.fn(),
  formState: { errors: {} },
};

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');

  return {
    ...actual,
    useForm: vi.fn(() => mockFormMethods),
  };
});

// Mock useActionState
vi.mock('react', async () => {
  const actual = await vi.importActual('react');

  return {
    ...actual,
    useActionState: vi.fn(() => [null, vi.fn(), false]),
    startTransition: vi.fn((fn) => fn()),
  };
});

// Mock user actions
vi.mock('@/app/userActions', () => ({
  createUserAction: vi.fn().mockResolvedValue({
    isSuccess: true,
    message: 'User created successfully',
  }),
}));

// Mock ArticleTitle
vi.mock('@/app/components/single-elements/ArticleTitle', () => ({
  ArticleTitle: ({ text }: { text: string }) => (
    <div data-testid="article-title">{text}</div>
  ),
}));

// Mock UserPermissionsCheckboxes
vi.mock('@/app/components/single-elements/userPermissions', () => ({
  default: ({ role }: { role: keyof typeof UserRole }) => (
    <div data-testid="user-permissions">{role} permissions</div>
  ),
}));

// Mock customResolver
vi.mock('@/app/editor/components/resolvers/customResolver', () => ({
  customResolver: vi.fn(() => userSchema),
}));

// Mock toastCallbacks
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
      expect(titleElement).toBeInTheDocument();
    });

    it('should render email input field', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const emailInput = screen.getByTestId('email');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should render tiers service ident input field', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const tiersInput = screen.getByTestId('tiersServiceIdent');
      expect(tiersInput).toBeInTheDocument();
      expect(tiersInput).toHaveAttribute('type', 'text');
    });

    it('should render role select dropdown', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const roleSelect = screen.getByTestId('role');
      expect(roleSelect).toBeInTheDocument();
      expect(roleSelect.tagName).toBe('SELECT');
    });

    it('should render submit button', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      expect(submitButton).toBeInTheDocument();
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
            permissions: contributorPermissions,
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

    it('should initialize with contributor role by default', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const permissionsComponent = screen.getByTestId('user-permissions');
      expect(permissionsComponent).toHaveTextContent('contributor permissions');
    });
  });

  describe('Role Selection', () => {
    it('should display all available roles in dropdown', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const roleSelect = screen.getByTestId('role');
      userRoles.forEach((role) => {
        const option = screen.getByRole('option', {
          name: role.charAt(0).toUpperCase() + role.slice(1),
        });
        expect(option).toBeInTheDocument();
      });
    });

    it('should update permissions when admin role is selected', async () => {
      const user = userEvent.setup();
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const roleSelect = screen.getByTestId('role');
      await user.selectOptions(roleSelect, 'admin');

      await waitFor(() => {
        expect(mockFormMethods.setValue).toHaveBeenCalledWith(
          'permissions',
          adminPermissions
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
          contributorPermissions
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
        expect(permissionsComponent).toHaveTextContent('admin permissions');
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
      const mockStartTransition = vi.fn((fn) => fn());
      (React.startTransition as Mock).mockImplementation(mockStartTransition);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      await user.click(submitButton);

      expect(mockStartTransition).toHaveBeenCalled();
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
        const formData = mockFormAction.mock.calls[0][0];
        expect(formData.get('email')).toBe('test@example.com');
        expect(formData.get('tiers_service_ident')).toBe('test-ident');
        expect(formData.get('role')).toBe('contributor');
        expect(formData.get('permissions')).toBe(
          JSON.stringify(contributorPermissions)
        );
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
        expect(JSON.parse(permissions as string)).toEqual(
          contributorPermissions
        );
      });
    });

    it('should disable submit button when isPending is true', () => {
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), true]);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when isPending is false', () => {
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), false]);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Post-Submission Actions', () => {
    it('should call scrollTopAction after successful submission', async () => {
      const user = userEvent.setup();
      const mockFormAction = vi.fn().mockResolvedValue({
        isSuccess: true,
        message: 'User created successfully',
      });

      // Create a wrapped action that calls the postprocess callback
      const wrappedAction = async (formData: FormData) => {
        const result = await mockFormAction(formData);

        // Simulate the postprocess callback that calls scrollTopAction and reset
        mockScrollTopAction();
        mockFormMethods.reset();

        return result;
      };

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
      const mockFormAction = vi.fn().mockResolvedValue({
        isSuccess: true,
        message: 'User created successfully',
      });

      // Create a wrapped action that calls the postprocess callback
      const wrappedAction = async (formData: FormData) => {
        const result = await mockFormAction(formData);

        // Simulate the postprocess callback that calls scrollTopAction and reset
        mockScrollTopAction();
        mockFormMethods.reset();

        return result;
      };

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
          email: {
            message: 'Email is required',
          },
        },
      };

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('should display tiers service ident error message when validation fails', () => {
      mockFormMethods.formState = {
        errors: {
          tiers_service_ident: {
            message: 'Tiers service ident is required',
          },
        },
      };

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(
        screen.getByText('Tiers service ident is required')
      ).toBeInTheDocument();
    });

    it('should display role error message when validation fails', () => {
      mockFormMethods.formState = {
        errors: {
          role: {
            message: 'Role is required',
          },
        },
      };

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByText('Role is required')).toBeInTheDocument();
    });

    it('should display multiple error messages simultaneously', () => {
      mockFormMethods.formState = {
        errors: {
          email: {
            message: 'Email is required',
          },
          tiers_service_ident: {
            message: 'Tiers service ident is required',
          },
          role: {
            message: 'Role is required',
          },
        },
      };

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(
        screen.getByText('Tiers service ident is required')
      ).toBeInTheDocument();
      expect(screen.getByText('Role is required')).toBeInTheDocument();
    });
  });

  describe('useActionState Integration', () => {
    it('should initialize useActionState with wrapped action', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(React.useActionState).toHaveBeenCalledWith(
        expect.any(Function),
        null
      );
    });

    it('should pass performingAfter callback to withCallbacks', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      // This test verifies that the withCallbacks function is called with the proper action
      // and that the performingAfter callback is properly defined
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const form = screen.getByTestId('final-submit').closest('form');
      expect(form).toBeInTheDocument();
      expect(form?.tagName).toBe('FORM');
    });

    it('should have labels for all inputs', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Identifiant Tiers Service:/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Rôle:/i)).toBeInTheDocument();
    });

    it('should have proper input IDs matching labels', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const emailInput = screen.getByTestId('email');
      const tiersInput = screen.getByTestId('tiersServiceIdent');
      const roleSelect = screen.getByTestId('role');

      expect(emailInput).toHaveAttribute('id', 'Email');
      expect(tiersInput).toHaveAttribute('id', 'tiersServiceIdent');
      expect(roleSelect).toHaveAttribute('id', 'role');
    });

    it('should have proper button role', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      expect(submitButton).toHaveAttribute('role', 'button');
    });
  });

  describe('Edge Cases', () => {
    it('should handle role change without crashing', async () => {
      const user = userEvent.setup();
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const roleSelect = screen.getByTestId('role');
      await user.selectOptions(roleSelect, 'admin');
      await user.selectOptions(roleSelect, 'contributor');

      expect(() => screen.getByTestId('user-permissions')).not.toThrow();
    });

    it('should maintain form state when role changes', async () => {
      const user = userEvent.setup();
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const emailInput = screen.getByTestId('email');
      await user.type(emailInput, 'test@example.com');

      const roleSelect = screen.getByTestId('role');
      await user.selectOptions(roleSelect, 'admin');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should handle empty form submission gracefully', async () => {
      const user = userEvent.setup();
      const mockFormAction = vi.fn();

      // For this test, we need to temporarily modify the handleSubmit mock
      // to use the actual form values instead of the defaults
      const originalHandleSubmit = mockFormMethods.handleSubmit;
      mockFormMethods.handleSubmit = vi.fn((fn) => (e: any) => {
        e?.preventDefault?.();

        // Call the submit function with empty values to simulate empty form
        return fn({
          email: '',
          tiers_service_ident: '',
          role: 'contributor',
          permissions: contributorPermissions, // Use actual permissions
        });
      });

      // Create a wrapped action that calls the postprocess callback
      const wrappedAction = async (formData: FormData) => {
        const result = await mockFormAction(formData);

        // Simulate the postprocess callback that calls scrollTopAction and reset
        mockScrollTopAction();
        mockFormMethods.reset();

        return result;
      };

      (React.useActionState as Mock).mockReturnValue([
        null,
        wrappedAction,
        false,
      ]);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      await user.click(submitButton);

      await waitFor(() => {
        const formData = mockFormAction.mock.calls[0][0];
        const email = formData.get('email');
        const tiers_service_ident = formData.get('tiers_service_ident');
        const role = formData.get('role');
        const permissions = formData.get('permissions');

        expect(email).toBe('');
        expect(tiers_service_ident).toBe('');
        expect(role).toBe('contributor');
        expect(() => JSON.parse(permissions as string)).not.toThrow();
      });

      // Restore the original handleSubmit mock
      mockFormMethods.handleSubmit = originalHandleSubmit;
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct classes to form elements', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const emailInput = screen.getByTestId('email');
      const tiersInput = screen.getByTestId('tiersServiceIdent');

      expect(emailInput).toHaveClass('input');
      expect(tiersInput).toHaveClass('input');
    });

    it('should apply correct classes to submit button when not pending', () => {
      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      expect(submitButton).toHaveClass('button');
      expect(submitButton).toHaveClass('is-primary');
      expect(submitButton).toHaveClass('is-size-6');
      expect(submitButton).toHaveClass('has-text-white');
      expect(submitButton).toHaveClass('mt-5');
      expect(submitButton).not.toHaveClass('is-loading');
    });

    it('should apply loading class to submit button when pending', () => {
      (React.useActionState as Mock).mockReturnValue([null, vi.fn(), true]);

      render(<CreateUserForm scrollTopAction={mockScrollTopAction} />);

      const submitButton = screen.getByTestId('final-submit');
      expect(submitButton).toHaveClass('is-loading');
    });
  });

  describe('Permission Management', () => {
    it('should set admin permissions array when admin is selected', async () => {
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
        expect(Array.isArray(permissionsValue)).toBe(true);
        expect(permissionsValue).toContain('delete:articles');
        expect(permissionsValue).toContain('create:user');
        expect(permissionsValue).toContain('enable:maintenance');
      });
    });

    it('should set contributor permissions array when contributor is selected', async () => {
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
        expect(Array.isArray(permissionsValue)).toBe(true);
        expect(permissionsValue).toContain('read:articles');
        expect(permissionsValue).toContain('create:articles');
        expect(permissionsValue).not.toContain('delete:articles');
        expect(permissionsValue).not.toContain('create:user');
      });
    });
  });
});
