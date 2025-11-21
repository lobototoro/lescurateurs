import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

import { PaginatedSearchDisplay } from '@/app/components/single-elements/paginatedSearchResults';
import { Slugs } from '@/models/slugs';
import { userSchema } from '@/models/userSchema';

describe('PaginatedSearchDisplay', () => {
  const mockHandleReference = vi.fn();

  const mockSlugs: Slugs[] = [
    {
      id: 1,
      slug: 'slug-1',
      created_at: '2023-01-01',
      article_id: 1,
      validated: false,
    },
    {
      id: 2,
      slug: 'slug-2',
      created_at: '2023-01-02',
      article_id: 2,
      validated: true,
    },
    {
      id: 3,
      slug: 'slug-3',
      created_at: '2023-01-03',
      article_id: 3,
      validated: false,
    },
  ];

  const mockUsers: z.infer<typeof userSchema>[] = [
    {
      id: 1,
      email: 'user1@example.com',
      created_at: '2023-01-01',
      tiers_service_ident: '',
      role: 'admin',
      last_connection_at: '',
      permissions: '',
    },
    {
      id: 2,
      email: 'user2@example.com',
      created_at: '2023-01-02',
      tiers_service_ident: '',
      role: 'admin',
      last_connection_at: '',
      permissions: '',
    },
    {
      id: 3,
      email: 'user3@example.com',
      created_at: '2023-01-03',
      tiers_service_ident: '',
      role: 'admin',
      last_connection_at: '',
      permissions: '',
    },
  ];

  it('renders the table with paginated items', () => {
    render(
      <PaginatedSearchDisplay
        itemList={mockSlugs}
        defaultPage={1}
        defaultLimit={2}
        target="search"
        context="article"
        handleReference={mockHandleReference}
      />
    );

    const trs = document.querySelectorAll('table tbody tr');
    expect(screen.getByText('slug-1')).toBeDefined();
    expect(screen.getByText('slug-2')).toBeDefined();
    expect(trs?.length).toBe(2);
  });

  it('navigates to the next page', () => {
    render(
      <PaginatedSearchDisplay
        itemList={mockSlugs}
        defaultPage={1}
        defaultLimit={2}
        target="search"
        context="article"
        handleReference={mockHandleReference}
      />
    );

    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);

    expect(screen.getByText('slug-3')).toBeInTheDocument();
    expect(screen.queryByText('slug-1')).toBeNull();
  });

  it("calls handleReference with correct arguments for 'search' target", () => {
    render(
      <PaginatedSearchDisplay
        itemList={mockSlugs}
        defaultPage={1}
        defaultLimit={2}
        target="search"
        context="article"
        handleReference={mockHandleReference}
      />
    );

    const validateButton = screen.getAllByText('validez')[0];
    fireEvent.click(validateButton);

    expect(mockHandleReference).toHaveBeenCalledWith(0, 'slug-1');
  });

  it("calls handleReference with correct arguments for 'update' target", () => {
    render(
      <PaginatedSearchDisplay
        itemList={mockSlugs}
        defaultPage={1}
        defaultLimit={2}
        target="update"
        context="article"
        handleReference={mockHandleReference}
      />
    );

    const selectButton = screen.getAllByTestId('selection-button')[0];
    fireEvent.click(selectButton);

    expect(mockHandleReference).toHaveBeenCalledWith(1);
  });

  it("renders user emails when context is 'user'", () => {
    render(
      <PaginatedSearchDisplay
        itemList={mockUsers}
        defaultPage={1}
        defaultLimit={2}
        target="search"
        context="user"
        handleReference={mockHandleReference}
      />
    );

    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    expect(screen.queryByText('user3@example.com')).toBeNull();
  });

  it('disables the previous button on the first page', () => {
    render(
      <PaginatedSearchDisplay
        itemList={mockSlugs}
        defaultPage={1}
        defaultLimit={2}
        target="search"
        context="article"
        handleReference={mockHandleReference}
      />
    );

    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  it('disables the next button on the last page', () => {
    render(
      <PaginatedSearchDisplay
        itemList={mockSlugs}
        defaultPage={2}
        defaultLimit={2}
        target="search"
        context="article"
        handleReference={mockHandleReference}
      />
    );

    const nextButton = screen.getByTestId('next-button');
    expect(nextButton).toBeDisabled();
  });

  it("calls handleSelectedUser with correct arguments for 'update' action", async () => {
    const mockHandleSelectedUser = vi.fn();

    render(
      <PaginatedSearchDisplay
        itemList={mockUsers}
        defaultPage={1}
        defaultLimit={2}
        target="search"
        context="user"
        handleSelectedUser={mockHandleSelectedUser}
      />
    );

    await waitFor(() => {
      const updateButton = screen.getAllByTestId('user-update-button')[0];
      fireEvent.click(updateButton);
      expect(mockHandleSelectedUser).toHaveBeenCalledWith(
        mockUsers[0],
        'update'
      );
    });
  });

  it("calls handleSelectedUser with correct arguments for 'delete' action", () => {
    const mockHandleSelectedUser = vi.fn();

    render(
      <PaginatedSearchDisplay
        itemList={mockUsers}
        defaultPage={1}
        defaultLimit={2}
        target="search"
        context="user"
        handleSelectedUser={mockHandleSelectedUser}
      />
    );

    const deleteButton = screen.getAllByText('delete')[0];
    fireEvent.click(deleteButton);

    expect(mockHandleSelectedUser).toHaveBeenCalledWith(mockUsers[0], 'delete');
  });

  it('renders correct pagination links', () => {
    render(
      <PaginatedSearchDisplay
        itemList={mockSlugs}
        defaultPage={1}
        defaultLimit={2}
        target="search"
        context="article"
        handleReference={mockHandleReference}
      />
    );

    const paginationLinks = screen.getAllByRole('button', {
      name: /Goto page/i,
    });
    expect(paginationLinks.length).toBe(2); // Two pages
    expect(paginationLinks[0]).toHaveTextContent('1');
    expect(paginationLinks[1]).toHaveTextContent('2');
  });

  it('changes page when a pagination link is clicked', () => {
    render(
      <PaginatedSearchDisplay
        itemList={mockSlugs}
        defaultPage={1}
        defaultLimit={2}
        target="search"
        context="article"
        handleReference={mockHandleReference}
      />
    );

    const page2Link = screen.getByRole('button', { name: 'Goto page 2' });
    fireEvent.click(page2Link);

    expect(screen.getByText('slug-3')).toBeInTheDocument();
    expect(screen.queryByText('slug-1')).toBeNull();
  });

  it("calls manageActions with correct arguments for 'manage' target", () => {
    const mockManageActions = vi.fn();

    render(
      <PaginatedSearchDisplay
        itemList={mockSlugs}
        defaultPage={1}
        defaultLimit={2}
        target="manage"
        context="article"
        handleReference={mockManageActions}
      />
    );

    const effacerButton = screen.getAllByText('Effacer')[0];
    fireEvent.click(effacerButton);
    expect(mockManageActions).toHaveBeenCalledWith(1, '', 'delete');

    const validerButton = screen.getAllByText('Valider / Invalider')[0];
    fireEvent.click(validerButton);
    expect(mockManageActions).toHaveBeenCalledWith(1, '', 'validate');

    const shipButton = screen.getAllByText('Online / Offline')[0];
    fireEvent.click(shipButton);
    expect(mockManageActions).toHaveBeenCalledWith(1, '', 'ship');
  });

  it('renders nothing if itemList is empty', () => {
    render(
      <PaginatedSearchDisplay
        itemList={[]}
        defaultPage={1}
        defaultLimit={2}
        target="search"
        context="article"
      />
    );
    expect(document.querySelectorAll('table>tbody>tr').length).toBe(0);
  });

  it('shows correct items after changing page multiple times', () => {
    render(
      <PaginatedSearchDisplay
        itemList={mockSlugs}
        defaultPage={1}
        defaultLimit={1}
        target="search"
        context="article"
        handleReference={mockHandleReference}
      />
    );

    // Page 1
    expect(screen.getByText('slug-1')).toBeInTheDocument();

    // Go to page 2
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    expect(screen.getByText('slug-2')).toBeInTheDocument();
    expect(screen.queryByText('slug-1')).toBeNull();

    // Go to page 3
    fireEvent.click(nextButton);
    expect(screen.getByText('slug-3')).toBeInTheDocument();
    expect(screen.queryByText('slug-2')).toBeNull();
  });

  it('highlights the current page in pagination', () => {
    render(
      <PaginatedSearchDisplay
        itemList={mockSlugs}
        defaultPage={2}
        defaultLimit={1}
        target="search"
        context="article"
        handleReference={mockHandleReference}
      />
    );
    const currentPage = screen.getByRole('button', { name: 'Goto page 2' });
    expect(currentPage.className).toContain('is-current');
  });
});
