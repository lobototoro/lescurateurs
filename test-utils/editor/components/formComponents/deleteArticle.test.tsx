import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteArticleForm from "@/app/editor/components/formComponents/deleteArticle";
import { deleteArticleAction } from "@/app/articleActions";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/articleActions", () => ({
  deleteArticleAction: vi.fn(),
}));

vi.mock("@/app/editor/components/formComponents/searchArticle", () => ({
  __esModule: true,
  default: ({ setSelection }: { setSelection: (id: number | string) => void }) => (
    <div data-testid="search-article">
      <button onClick={() => setSelection(1)}>Select Article</button>
    </div>
  ),
}));

vi.mock("@/app/components/single-elements/modalWithCTA", () => ({
  __esModule: true,
  default: ({
    modalRef,
    ctaAction,
    cancelAction,
  }: {
    modalRef: React.RefObject<HTMLDivElement>;
    ctaAction: () => void;
    cancelAction: () => void;
  }) => (
    <div ref={modalRef} data-testid="modal">
      <button onClick={ctaAction}>Confirm Delete</button>
      <button onClick={cancelAction}>Cancel</button>
    </div>
  ),
}));

describe("DeleteArticleForm", () => {
  it("renders the search article component initially", () => {
    render(<DeleteArticleForm />);
    expect(screen.getByTestId("search-article")).toBeDefined();
  });

  it("opens the modal when an article is selected", async () => {
    const { getByTestId } = render(<DeleteArticleForm />);
    fireEvent.click(screen.getByText("Select Article"));

    await waitFor(() => {
      expect(getByTestId("modal").classList.contains("is-active")).toBe(true);
    });
  });

  it("calls the delete action when confirm delete is clicked", async () => {
    vi.mocked(deleteArticleAction).mockResolvedValue({ message: true, text: "Mocked success message" });

    const { getByTestId } = render(<DeleteArticleForm />);
    fireEvent.click(screen.getByText("Select Article"));

    await waitFor(() => {
      expect(getByTestId("modal").classList.contains("is-active")).toBe(true);
    });

    fireEvent.click(screen.getByText("Confirm Delete"));

    await waitFor(() => {
      expect(deleteArticleAction).toHaveBeenCalled();
    });
  });

  it("closes the modal when cancel is clicked", async () => {
    const { getByTestId } = render(<DeleteArticleForm />);
    fireEvent.click(screen.getByText("Select Article"));

    await waitFor(() => {
      expect(getByTestId("modal").classList.contains("is-active")).toBe(true);
    });

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(getByTestId("modal").classList.contains("is-active")).toBe(false);
    });
  });

  it("displays a notification after the delete action", async () => {
    vi.mocked(deleteArticleAction).mockResolvedValue({ text: "Article deleted successfully", message: true });

    render(<DeleteArticleForm />);
    fireEvent.click(screen.getByText("Select Article"));
    fireEvent.click(screen.getByText("Confirm Delete"));

    await waitFor(() => {
      expect(screen.getByText("Article deleted successfully")).toBeDefined();
    });
  });
});