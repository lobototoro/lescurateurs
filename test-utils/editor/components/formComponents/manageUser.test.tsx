import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import ManageUserForm from '@/app/editor/components/formComponents/manageUser';
import { getUsersList, updateUserAction, deleteUserAction } from '@/app/userActions';

// Mocks for dependencies
vi.mock('@/app/userActions', () => ({
  updateUserAction: vi.fn(),
  getUsersList: vi.fn(),
  deleteUserAction: vi.fn(),
}));

// vi.mock('@/models/userSchema', () => ({
//   userSchema: {},
// }));
vi.mock('@/models/user', () => ({
  adminPermissions: ['perm1', 'perm2'],
  contributorPermissions: ['perm3'],
  UserRole: { admin: 'admin', contributor: 'contributor' },
  userRoles: ['admin', 'contributor'],
}));
vi.mock('@/app/components/single-elements/ArticleTitle', () => ({
  ArticleTitle: (props: any) => <div data-testid="article-title">{props.text}</div>,
}));
vi.mock('@/app/components/single-elements/paginatedSearchResults', () => ({
  PaginatedSearchDisplay: (props: any) => (
    <div data-testid="paginated-search" onClick={() => props.handleSelectedUser(props.itemList[0], 'update')}>
      PaginatedSearchDisplay
    </div>
  ),
}));
vi.mock('@/app/components/single-elements/userPermissions', () => ({
  default: (props: any) => <div data-testid="user-permissions">{props.role}</div>,
}));
vi.mock('@/lib/utility-functions', () => ({
  isEmpty: (obj: any) => obj === null,
}));
vi.mock('@/app/components/single-elements/modalWithCTA', () => ({
  default: (props: any) => (
    <div data-testid="modal">
      <button data-testid="confirm-delete" onClick={props.ctaAction}>Supprimer</button>
      <button data-testid="cancel-delete" onClick={props.cancelAction}>Annuler</button>
    </div>
  ),
}));
vi.mock('@/app/components/single-elements/notificationsComponent', () => ({
  default: (props: any) => <div data-testid="notification">{props.notification}</div>,
}));

const mockUser = {
  id: 1,
  email: 'test@example.com',
  tiersServiceIdent: 'TSI123',
  role: 'contributor',
  createdAt: new Date().toISOString(),
  lastConnectionAt: new Date().toISOString(),
  permissions: JSON.stringify(['perm3']),
};

const scrolltoTop = vi.fn();

describe('ManageUserForm', () => {
  beforeEach(() => {

    // @ts-ignore
    getUsersList.mockResolvedValue({
      message: true,
      usersList: [mockUser],
    });

    // @ts-ignore
    updateUserAction.mockResolvedValue({ message: true, text: 'User updated' });

    // @ts-ignore
    deleteUserAction.mockResolvedValue({ message: true, text: 'User deleted' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders user search when no user is selected', async () => {
    render(<ManageUserForm scrolltoTop={scrolltoTop} />);
    expect(await screen.findByTestId('article-title')).toHaveTextContent('Sélectionnez un utilisateur');
    expect(screen.getByTestId('paginated-search')).toBeInTheDocument();
  });

  it('shows user form when a user is selected', async () => {
    render(<ManageUserForm scrolltoTop={scrolltoTop} />);
    
    // Simulate user selection via PaginatedSearchDisplay
    fireEvent.click(await screen.findByTestId('paginated-search'));
    expect(await screen.findByTestId('email')).toHaveValue(mockUser.email);
    expect(screen.getByTestId('tiersServiceIdent')).toHaveValue(mockUser.tiersServiceIdent);
    expect(screen.getByTestId('role')).toHaveValue(mockUser.role);
    expect(screen.getByTestId('user-permissions')).toBeInTheDocument();
  });

  // it('submits the form and shows notification', async () => {
  //   render(<ManageUserForm scrolltoTop={scrolltoTop} />);
  //   fireEvent.click(await screen.findByTestId('paginated-search'));
  //   const submitBtn = await screen.findByTestId('final-submit');
  //   fireEvent.click(submitBtn);
  //   await waitFor(() => {
  //     expect(screen.getByTestId('notification')).toHaveTextContent('User updated');
  //   });
  // });

  it('returns to search when clicking "Retour à la recherche"', async () => {
    render(<ManageUserForm scrolltoTop={scrolltoTop} />);
    fireEvent.click(await screen.findByTestId('paginated-search'));
    const backBtn = await screen.findByTestId('back-to-search');
    fireEvent.click(backBtn);
    expect(await screen.findByTestId('article-title')).toHaveTextContent('Sélectionnez un utilisateur');
  });

  // it('shows and handles delete modal', async () => {
  //   render(<ManageUserForm scrolltoTop={scrolltoTop} />);
  //   // Simulate delete action
  //   fireEvent.click(await screen.findByTestId('paginated-search'));
  //   screen.debug();
  //   // Simulate handleSelectedUser for delete
  //   // @ts-ignore
  //   screen.getByTestId('paginated-search').onclick({ ...mockUser, action: 'delete' });
  //   // Modal should be present
  //   expect(screen.getByTestId('modal')).toBeInTheDocument();
  //   // Confirm deletion
  //   fireEvent.click(screen.getByTestId('confirm-delete'));
  //   await waitFor(() => {
  //     expect(screen.getByTestId('notification')).toHaveTextContent('User deleted');
  //   });
  // });

  // it('handles cancel deletion', async () => {
  //   render(<ManageUserForm scrolltoTop={scrolltoTop} />);
  //   fireEvent.click(await screen.findByTestId('paginated-search'));
  //   // Simulate handleSelectedUser for delete
  //   // @ts-ignore
  //   screen.getByTestId('paginated-search').onclick({ ...mockUser, action: 'delete' });
  //   // Cancel deletion
  //   fireEvent.click(screen.getByTestId('cancel-delete'));
  //   expect(screen.getByTestId('modal')).toBeInTheDocument();
  // });

  it('changes role and updates permissions', async () => {
    render(<ManageUserForm scrolltoTop={scrolltoTop} />);
    fireEvent.click(await screen.findByTestId('paginated-search'));
    const roleSelect = await screen.findByTestId('role');
    fireEvent.change(roleSelect, { target: { value: 'admin' } });
    expect(screen.getByTestId('user-permissions')).toBeInTheDocument();
  });
});