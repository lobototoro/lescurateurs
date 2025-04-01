import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DeleteArticleForm from "@/app/editor/components/formComponents/deleteArticle";
import { deleteArticleAction } from "@/app/articleActions";

// Mock dependencies
vi.mock("@/app/articleActions", () => ({
  deleteArticleAction: vi.fn().mockImplementationOnce(() => {
    return {
      message: true,
      text: "L'article a été supprimé avec succès",
    };
  }).mockImplementationOnce(() => {
    return {
      message: false,
      text: "Erreur lors de la suppression de l'article",
    };
  }).mockImplementationOnce(() => {
    return {
      message: true,
      text: "Cette notification se fermera d'elle-même",
    };
  }).mockImplementationOnce(() => {
    return {
      message: false,
      text: "Erreur lors de la suppression de l'article",
    };
  })
}));

vi.mock("@/app/editor/components/formComponents/searchArticle", () => ({
  __esModule: true,
  default: ({ setSelection }: { setSelection: (id: number | string) => void }) => (
    <div data-testid="search-article">
      <button onClick={() => setSelection(1)}>Select Article</button>
    </div>
  ),
}));

describe("DeleteArticleForm", () => {
  it("renders the component correctly", () => {
    render(<DeleteArticleForm />);
    expect(screen.getByTestId("search-article")).toBeDefined();
  });

  it("opens the modal when an article is selected", async () => {
    render(<DeleteArticleForm />);
    const selectButton = screen.getByText("Select Article");
    fireEvent.click(selectButton);

    await waitFor(() => {
      const modal = screen.getByText("Voulez-vous vraiment supprimer cet article ?");
      expect(modal).toBeDefined();
    });
  });

  it("closes the modal when cancel button is clicked", async () => {
    render(<DeleteArticleForm />);
    const selectButton = screen.getByText("Select Article");
    fireEvent.click(selectButton);

    const cancelButton = await screen.findByText("Annuler");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      const modal = screen.getByTestId("delete-article-modal");
      expect(modal?.classList.contains("is-active")).toBe(false);
    });
  });

  it("calls the delete action when delete button is clicked", async () => {
    render(<DeleteArticleForm />);
    const selectButton = screen.getByText("Select Article");
    fireEvent.click(selectButton);

    const deleteButton = await screen.findByText("Supprimer");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteArticleAction).toHaveBeenCalled();
    });
  });

  it("displays a notification after performing an action", async () => {
    render(<DeleteArticleForm />);
    const selectButton = screen.getByText("Select Article");
    fireEvent.click(selectButton);

    const deleteButton = await screen.findByText("Supprimer");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      const notification = screen.getByText(/Cette notification se fermera d'elle-même/);
      expect(notification).toBeDefined();
    });
  });
});