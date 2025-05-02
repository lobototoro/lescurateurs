import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { z } from 'zod';

import { PaginatedSearchDisplay } from "@/app/components/single-elements/paginatedSearchResults";
import { Slugs } from "@/models/slugs";
import { userSchema } from "@/models/userSchema";

describe("PaginatedSearchDisplay", () => {
  const mockHandleReference = vi.fn();

  const mockSlugs: Slugs[] = [
    {
      id: 1, slug: "slug-1", createdAt: "2023-01-01",
      articleId: 1
    },
    {
      id: 2, slug: "slug-2", createdAt: "2023-01-02",
      articleId: 2
    },
    {
      id: 3, slug: "slug-3", createdAt: "2023-01-03",
      articleId: 3
    },
  ];

  const mockUsers: z.infer<typeof userSchema>[] = [
    {
      id: 1, email: "user1@example.com", createdAt: "2023-01-01",
      tiersServiceIdent: "",
      role: "admin",
      lastConnectionAt: "",
      permissions: ""
    },
    {
      id: 2, email: "user2@example.com", createdAt: "2023-01-02",
      tiersServiceIdent: "",
      role: "admin",
      lastConnectionAt: "",
      permissions: ""
    },
    {
      id: 3, email: "user3@example.com", createdAt: "2023-01-03",
      tiersServiceIdent: "",
      role: "admin",
      lastConnectionAt: "",
      permissions: ""
    },
  ];

  it("renders the table with paginated items", () => {
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

    const trs = document.querySelectorAll("table tbody tr");
    expect(screen.getByText("slug-1")).toBeDefined();
    expect(screen.getByText("slug-2")).toBeDefined();
    expect(trs?.length).toBe(2);
  });

  it("navigates to the next page", () => {
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

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    expect(screen.getByText("slug-3")).toBeDefined();
    expect(screen.queryByText("slug-1")).toBeNull();
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

    const validateButton = screen.getAllByText("validez")[0];
    fireEvent.click(validateButton);

    expect(mockHandleReference).toHaveBeenCalledWith(0, "slug-1");
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

    const selectButton = screen.getAllByTestId("selection-button")[0];
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

    expect(screen.getByText("user1@example.com")).toBeDefined();
    expect(screen.getByText("user2@example.com")).toBeDefined();
    expect(screen.queryByText("user3@example.com")).toBeNull();
  });

  it("disables the previous button on the first page", () => {
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

    const previousButton = screen.getByText("Previous");
    expect(previousButton).property("disabled", true);
  });

  it("disables the next button on the last page", () => {
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

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).property("disabled", true);
  });
});