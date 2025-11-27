/**
 * @file userPermissions.test.tsx
 * @description Comprehensive unit tests for UserPermissionsCheckboxes component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserPermissionsCheckboxes from '@/app/components/single-elements/userPermissions';
import { UserRole } from '@/models/user';

// Mock ArticleTitle component
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

// Mock user model
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

describe('UserPermissionsCheckboxes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component successfully with admin role', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      expect(screen.getByTestId('article-title')).toBeInTheDocument();
    });

    it('should render the component successfully with contributor role', () => {
      render(<UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />);

      expect(screen.getByTestId('article-title')).toBeInTheDocument();
    });

    it('should render the component successfully with null role', () => {
      render(<UserPermissionsCheckboxes role={null} />);

      expect(screen.getByTestId('article-title')).toBeInTheDocument();
    });

    it('should render ArticleTitle with correct props', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const titleElement = screen.getByTestId('article-title');
      expect(titleElement).toHaveAttribute('data-level', 'h4');
      expect(titleElement).toHaveAttribute('data-size', 'medium');
      expect(titleElement).toHaveAttribute('data-color', 'white');
      expect(titleElement).toHaveAttribute('data-spacings', 'mb-4');
    });

    it('should render title text in French', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      expect(
        screen.getByText('Ce rôle a accès aux permissions suivantes :')
      ).toBeInTheDocument();
    });
  });

  describe('Admin Role Permissions', () => {
    it('should display all 10 admin permissions', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(10);
    });

    it('should display read:articles permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('read:articles');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('read/articles')).toBeInTheDocument();
    });

    it('should display create:articles permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('create:articles');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('create/articles')).toBeInTheDocument();
    });

    it('should display update:articles permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('update:articles');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('update/articles')).toBeInTheDocument();
    });

    it('should display delete:articles permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('delete:articles');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('delete/articles')).toBeInTheDocument();
    });

    it('should display validate:articles permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('validate:articles');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('validate/articles')).toBeInTheDocument();
    });

    it('should display ship:articles permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('ship:articles');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('ship/articles')).toBeInTheDocument();
    });

    it('should display create:user permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('create:user');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('create/user')).toBeInTheDocument();
    });

    it('should display update:user permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('update:user');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('update/user')).toBeInTheDocument();
    });

    it('should display delete:user permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('delete:user');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('delete/user')).toBeInTheDocument();
    });

    it('should display enable:maintenance permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('enable:maintenance');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('enable/maintenance')).toBeInTheDocument();
    });

    it('should have all admin checkboxes checked', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });

    it('should have all admin checkboxes disabled', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled();
      });
    });
  });

  describe('Contributor Role Permissions', () => {
    it('should display all 4 contributor permissions', () => {
      render(<UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(4);
    });

    it('should display read:articles permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />);

      const checkbox = screen.getByTestId('read:articles');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('read/articles')).toBeInTheDocument();
    });

    it('should display create:articles permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />);

      const checkbox = screen.getByTestId('create:articles');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('create/articles')).toBeInTheDocument();
    });

    it('should display update:articles permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />);

      const checkbox = screen.getByTestId('update:articles');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('update/articles')).toBeInTheDocument();
    });

    it('should display validate:articles permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />);

      const checkbox = screen.getByTestId('validate:articles');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('validate/articles')).toBeInTheDocument();
    });

    it('should have all contributor checkboxes checked', () => {
      render(<UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });

    it('should have all contributor checkboxes disabled', () => {
      render(<UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled();
      });
    });

    it('should not display admin-only permissions', () => {
      render(<UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />);

      expect(screen.queryByTestId('delete:articles')).not.toBeInTheDocument();
      expect(screen.queryByTestId('ship:articles')).not.toBeInTheDocument();
      expect(screen.queryByTestId('create:user')).not.toBeInTheDocument();
      expect(screen.queryByTestId('update:user')).not.toBeInTheDocument();
      expect(screen.queryByTestId('delete:user')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('enable:maintenance')
      ).not.toBeInTheDocument();
    });
  });

  describe('Null Role Handling', () => {
    it('should default to contributor permissions when role is null', () => {
      render(<UserPermissionsCheckboxes role={null} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(4);
    });

    it('should display contributor permissions for null role', () => {
      render(<UserPermissionsCheckboxes role={null} />);

      expect(screen.getByTestId('read:articles')).toBeInTheDocument();
      expect(screen.getByTestId('create:articles')).toBeInTheDocument();
      expect(screen.getByTestId('update:articles')).toBeInTheDocument();
      expect(screen.getByTestId('validate:articles')).toBeInTheDocument();
    });

    it('should not display admin-only permissions for null role', () => {
      render(<UserPermissionsCheckboxes role={null} />);

      expect(screen.queryByTestId('delete:articles')).not.toBeInTheDocument();
      expect(screen.queryByTestId('create:user')).not.toBeInTheDocument();
    });
  });

  describe('Permission Display Format', () => {
    it('should convert colon to slash in permission display', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      // Check that colons are replaced with slashes in display text
      expect(screen.getByText('read/articles')).toBeInTheDocument();
      expect(screen.getByText('create/user')).toBeInTheDocument();
      expect(screen.getByText('enable/maintenance')).toBeInTheDocument();
    });

    it('should preserve original permission string in value attribute', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('read:articles');
      expect(checkbox).toHaveAttribute('value', 'read:articles');
    });

    it('should use original permission string in data-testid', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      // data-testid uses original format with colon
      expect(screen.getByTestId('read:articles')).toBeInTheDocument();
      expect(screen.getByTestId('create:user')).toBeInTheDocument();
    });
  });

  describe('Checkbox Attributes', () => {
    it('should have type="checkbox" attribute', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('type', 'checkbox');
      });
    });

    it('should have checked=true attribute', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('checked');
      });
    });

    it('should have disabled=true attribute', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('disabled');
      });
    });

    it('should have correct value attribute for each permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const readCheckbox = screen.getByTestId('read:articles');
      expect(readCheckbox).toHaveAttribute('value', 'read:articles');

      const createUserCheckbox = screen.getByTestId('create:user');
      expect(createUserCheckbox).toHaveAttribute('value', 'create:user');
    });

    it('should have checkbox class', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveClass('checkbox', 'mr-2');
      });
    });
  });

  describe('Label Elements', () => {
    it('should render hidden labels for each permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const labels = screen.getAllByRole('checkbox').map((checkbox) => {
        return checkbox.parentElement?.querySelector('label');
      });

      expect(labels.length).toBeGreaterThan(0);
      labels.forEach((label) => {
        expect(label).toHaveClass('is-hidden');
      });
    });

    it('should have htmlFor attribute matching permission', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const container = screen.getByTestId('read:articles').parentElement;
      const label = container?.querySelector('label');

      expect(label).toHaveAttribute('for', 'read:articles');
    });

    it('should have hidden label with original permission text', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const container = screen.getByTestId('read:articles').parentElement;
      const label = container?.querySelector('label');

      expect(label).toHaveTextContent('read:articles');
    });
  });

  describe('Container Structure', () => {
    it('should wrap each checkbox in a container div', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        const container = checkbox.parentElement;
        expect(container).toHaveClass('container', 'flex', 'items-center', 'mb-2');
      });
    });

    it('should render permissions in order', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toHaveAttribute('value', 'read:articles');
      expect(checkboxes[1]).toHaveAttribute('value', 'create:articles');
      expect(checkboxes[2]).toHaveAttribute('value', 'update:articles');
    });
  });

  describe('Role Comparison', () => {
    it('should show more permissions for admin than contributor', () => {
      const { unmount } = render(
        <UserPermissionsCheckboxes role={UserRole.ADMIN} />
      );
      const adminCheckboxes = screen.getAllByRole('checkbox');
      const adminCount = adminCheckboxes.length;
      unmount();

      render(<UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />);
      const contributorCheckboxes = screen.getAllByRole('checkbox');
      const contributorCount = contributorCheckboxes.length;

      expect(adminCount).toBeGreaterThan(contributorCount);
      expect(adminCount).toBe(10);
      expect(contributorCount).toBe(4);
    });

    it('should show contributor permissions as subset of admin permissions', () => {
      const { unmount } = render(
        <UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />
      );
      const contributorPerms = screen
        .getAllByRole('checkbox')
        .map((cb) => cb.getAttribute('value'));
      unmount();

      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);
      const adminPerms = screen
        .getAllByRole('checkbox')
        .map((cb) => cb.getAttribute('value'));

      contributorPerms.forEach((perm) => {
        expect(adminPerms).toContain(perm);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper checkbox role', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should have labels associated with checkboxes', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        const container = checkbox.parentElement;
        const label = container?.querySelector('label');
        const checkboxId = checkbox.getAttribute('data-testid');

        expect(label).toBeTruthy();
        expect(label?.getAttribute('for')).toBe(checkboxId);
      });
    });

    it('should indicate disabled state for screen readers', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled();
      });
    });

    it('should indicate checked state for screen readers', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });

    it('should have hidden labels with proper class', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const containers = screen
        .getAllByRole('checkbox')
        .map((cb) => cb.parentElement);

      containers.forEach((container) => {
        const label = container?.querySelector('label');
        expect(label).toHaveClass('is-hidden');
      });
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct classes to checkbox', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('read:articles');
      expect(checkbox).toHaveClass('checkbox', 'mr-2');
    });

    it('should apply correct classes to container', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const checkbox = screen.getByTestId('read:articles');
      const container = checkbox.parentElement;

      expect(container).toHaveClass('container', 'flex', 'items-center', 'mb-2');
    });

    it('should apply correct classes to label', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const container = screen.getByTestId('read:articles').parentElement;
      const label = container?.querySelector('label');

      expect(label).toHaveClass('is-hidden', 'text-sm', 'text-gray-700');
    });
  });

  describe('Edge Cases', () => {
    it('should handle role change from admin to contributor', () => {
      const { rerender } = render(
        <UserPermissionsCheckboxes role={UserRole.ADMIN} />
      );

      expect(screen.getAllByRole('checkbox')).toHaveLength(10);

      rerender(<UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />);

      expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    });

    it('should handle role change from contributor to admin', () => {
      const { rerender } = render(
        <UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />
      );

      expect(screen.getAllByRole('checkbox')).toHaveLength(4);

      rerender(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      expect(screen.getAllByRole('checkbox')).toHaveLength(10);
    });

    it('should handle role change from null to admin', () => {
      const { rerender } = render(<UserPermissionsCheckboxes role={null} />);

      expect(screen.getAllByRole('checkbox')).toHaveLength(4);

      rerender(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      expect(screen.getAllByRole('checkbox')).toHaveLength(10);
    });

    it('should handle role change from admin to null', () => {
      const { rerender } = render(
        <UserPermissionsCheckboxes role={UserRole.ADMIN} />
      );

      expect(screen.getAllByRole('checkbox')).toHaveLength(10);

      rerender(<UserPermissionsCheckboxes role={null} />);

      expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    });
  });

  describe('Component Output Structure', () => {
    it('should render as fragment with title and checkboxes', () => {
      const { container } = render(
        <UserPermissionsCheckboxes role={UserRole.ADMIN} />
      );

      expect(screen.getByTestId('article-title')).toBeInTheDocument();
      expect(container.querySelectorAll('.container.flex').length).toBe(10);
    });

    it('should not wrap content in additional div', () => {
      const { container } = render(
        <UserPermissionsCheckboxes role={UserRole.ADMIN} />
      );

      // Should use fragment, not a wrapping div
      // The first child should be the ArticleTitle
      expect(container.firstChild?.firstChild).toBeTruthy();
    });
  });

  describe('Permission Count Verification', () => {
    it('should have exactly 10 admin permissions', () => {
      render(<UserPermissionsCheckboxes role={UserRole.ADMIN} />);

      const expectedPermissions = [
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
      ];

      expectedPermissions.forEach((perm) => {
        expect(screen.getByTestId(perm)).toBeInTheDocument();
      });
    });

    it('should have exactly 4 contributor permissions', () => {
      render(<UserPermissionsCheckboxes role={UserRole.CONTRIBUTOR} />);

      const expectedPermissions = [
        'read:articles',
        'create:articles',
        'update:articles',
        'validate:articles',
      ];

      expectedPermissions.forEach((perm) => {
        expect(screen.getByTestId(perm)).toBeInTheDocument();
      });

      expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    });
  });
});
