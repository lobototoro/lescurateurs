import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, expect, it, Mock } from "vitest";

import DeleteArticleForm from "./validateArticle";
import { useActionState } from "react";

// Mock dependencies
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

vi.mock("@/app/editor/components/formComponents/searchArticle", () => ({
  __esModule: true,
  default: ({ setSelection }: { setSelection: (id: number | string) => void }) => (
    <div data-testid="search-article" onClick={() => setSelection(1)}>
      Mocked SearchArticle
    </div>
  ),
}));

describe("DeleteArticleForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the SearchArticle component when no notification is present", () => {
    (useActionState as Mock).mockReturnValue([null, vi.fn(), false]);

    render(<DeleteArticleForm />);

    expect(screen.getByTestId("search-article")).toBeDefined();
  });

  it("displays a notification when state is set", async () => {
    (useActionState as Mock).mockReturnValue([{ text: "Success message", message: true }, vi.fn(), false]);

    render(<DeleteArticleForm />);

    expect(screen.getByText("Success message")).toBeDefined();
    expect(screen.getByText("Cette notification se fermera d'elle-même")).toBeDefined();
  });

  it("opens the modal when an article is selected", async () => {
    (useActionState as Mock).mockReturnValue([null, vi.fn(), false]);

    render(<DeleteArticleForm />);

    fireEvent.click(screen.getByTestId("search-article"));

    await waitFor(() => {
      expect(screen.getByTestId("delete-article-modal").classList).toContain("is-active");
    });
  });

  it("calls the formAction with correct data when validating", async () => {
    const mockFormAction = vi.fn();
    (useActionState as Mock).mockReturnValue([null, mockFormAction, false]);

    render(<DeleteArticleForm />);

    fireEvent.click(screen.getByTestId("search-article"));

    await waitFor(() => {
      expect(screen.getByTestId("delete-article-modal").classList).toContain("is-active");
    });

    fireEvent.click(screen.getByText("Valider"));

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalledWith(expect.any(FormData));
      const formData = mockFormAction.mock.calls[0][0];
      expect(formData.get("id")).toBe("1");
      expect(formData.get("validation")).toBe("true");
    });
  });

  it("closes the modal when cancel is clicked", async () => {
    (useActionState as Mock).mockReturnValue([null, vi.fn(), false]);

    render(<DeleteArticleForm />);

    fireEvent.click(screen.getByTestId("search-article"));

    await waitFor(() => {
      expect(screen.getByTestId("delete-article-modal").classList).toContain("is-active");
    });

    fireEvent.click(screen.getByText("Annuler"));

    await waitFor(() => {
      expect(screen.getByTestId("delete-article-modal").classList).not.toContain("is-active");
    });
  });
});