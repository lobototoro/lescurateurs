import { describe, it, expect, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import EditorForm from '@/app/editor/components/editorForm';

// Mock child components
vi.mock('@auth0/nextjs-auth0/server');
vi.mock('@/app/editor/components/headerMenu', () => ({
  default: ({ role, permissions, setSelection, selection }: any) => (
    <div data-testid="header-node">
      HeaderMenu {role} {permissions} {selection}
      <button onClick={() => setSelection('createarticles')}>
        Create Articles
      </button>
      <button onClick={() => setSelection('updatearticles')}>
        Update Articles
      </button>
      <button onClick={() => setSelection('managearticles')}>
        Manage Articles
      </button>
      <button onClick={() => setSelection('createuser')}>Create User</button>
      <button onClick={() => setSelection('manageuser')}>Manage User</button>
    </div>
  ),
}));
vi.mock('@/app/editor/components/formComponents/createArticles', () => ({
  default: ({ scrolltoTop }: any) => <div data-testid="create-articles">CreateArticleForm</div>,
}));
vi.mock('@/app/editor/components/formComponents/updateArticle', () => ({
  default: ({ scrolltoTop }: any) => <div data-testid="update-articles">UpdateArticleForm</div>,
}));
vi.mock('@/app/editor/components/formComponents/manageArticle', () => ({
  default: ({ scrolltoTop }: any) => <div data-testid="manage-articles">ManageArticleForm</div>,
}));
vi.mock('@/app/editor/components/formComponents/createUser', () => ({
  default: ({ scrolltoTop }: any) => <div data-testid="create-user">CreateUserForm</div>,
}));
vi.mock('@/app/editor/components/formComponents/manageUser', () => ({
  default: ({ scrolltoTop }: any) => (
    <div data-testid="manage-user">ManageUserForm</div>
  ),
}));

describe('EditorForm', () => {
  it('renders HeaderMenu with correct props', () => {
    render(<EditorForm role="admin" permissions="all" />);
    expect(screen.getByTestId('header-node')).toBeInTheDocument();
    expect(screen.getByText(/HeaderMenu admin all/)).toBeInTheDocument();
  });

  it('renders nothing except HeaderMenu and topPointRef div by default', () => {
    render(<EditorForm role="editor" permissions="edit" />);
    expect(screen.getByTestId('header-node')).toBeInTheDocument();
    expect(screen.queryByTestId('create-articles')).not.toBeInTheDocument();
    expect(screen.queryByTestId('update-articles')).not.toBeInTheDocument();
    expect(screen.queryByTestId('manage-articles')).not.toBeInTheDocument();
    expect(screen.queryByTestId('create-user')).not.toBeInTheDocument();
    expect(screen.queryByTestId('manage-user')).not.toBeInTheDocument();
  });

  it('renders CreateArticleForm when selection is createarticles', async () => {
    render(<EditorForm role="editor" permissions="edit" />);
    act(() => screen.getByText('Create Articles').click());
    await waitFor(() => {
      expect(screen.getByTestId('create-articles')).toBeInTheDocument();
    });
  });

  it('renders UpdateArticleForm when selection is updatearticles', async () => {
    render(<EditorForm role="editor" permissions="edit" />);
    act(() => screen.getByText('Update Articles').click());
    await waitFor(() => {
      expect(screen.getByTestId('update-articles')).toBeInTheDocument();
    });
  });

  it('renders ManageArticleForm when selection is managearticles', async () => {
    render(<EditorForm role="editor" permissions="edit" />);
    act(() => screen.getByText('Manage Articles').click());
    await waitFor(() => {
      expect(screen.getByTestId('manage-articles')).toBeInTheDocument();
    });
  });

  it('renders CreateUserForm when selection is createuser', async () => {
    render(<EditorForm role="editor" permissions="edit" />);
    act(() => screen.getByText('Create User').click());
    await waitFor(() => {
      expect(screen.getByTestId('create-user')).toBeInTheDocument();
    });
  });

  it('renders ManageUserForm when selection is manageuser', async () => {
    render(<EditorForm role="editor" permissions="edit" />);
    act(() => screen.getByText('Manage User').click());
    await waitFor(() => {
      expect(screen.getByTestId('manage-user')).toBeInTheDocument();
    });
  });
});