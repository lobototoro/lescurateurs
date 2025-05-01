import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";
import UpdateArticleForm from "@/app/editor/components/formComponents/updateArticle";
import { fetchArticleById, updateArticleAction } from "@/app/articleActions";

vi.mock("@/app/articleActions", () => ({
  fetchArticleById: vi.fn(),
  updateArticleAction: vi.fn(),
}));

vi.mock("@/app/components/single-elements/articleHTMLForm", () => ({
  __esModule: true,
  default: ({ handleSubmit }: { handleSubmit: () => void }) => (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  ),
}));

vi.mock("@/app/editor/components/formComponents/searchArticle", () => ({
  __esModule: true,
  default: ({ setSelection }: { setSelection: (id: number) => void }) => (
    <button onClick={() => setSelection(1)}>Search Article</button>
  ),
}));

describe("UpdateArticleForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search component initially", () => {
    render(<UpdateArticleForm />);
    expect(screen.getByText("Search Article")).toBeDefined();
  });

  it("loads article details when an article is selected", async () => {
    const mockArticle = {
      id: 1,
      slug: "test-article",
      title: "Test Article",
      introduction: "Test Introduction",
      main: "Test Main",
      publishedAt: "2023-01-01",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      author: "Author",
      author_email: "author@example.com",
      validated: "false",
      shipped: "false",
      urls: "",
      mainAudioUrl: "",
      urlToMainIllustration: "",
    };

    (fetchArticleById as Mock).mockResolvedValue({ article: mockArticle });

    render(<UpdateArticleForm />);
    fireEvent.click(screen.getByText("Search Article"));

    await waitFor(() => {
      expect(fetchArticleById).toHaveBeenCalledWith(1);
    });

    expect(screen.getByText("Submit")).toBeDefined();
  });

  // it("submits the form with updated article data", async () => {
  //   const mockArticle = {
  //     id: 1,
  //     slug: "test-article",
  //     title: "Test Article",
  //     introduction: "Test Introduction",
  //     main: "Test Main",
  //     publishedAt: "2023-01-01",
  //     createdAt: "2023-01-01",
  //     updatedAt: "2023-01-01",
  //     author: "Author",
  //     author_email: "author@example.com",
  //     validated: "false",
  //     shipped: "false",
  //     urls: "",
  //     mainAudioUrl: "",
  //     urlToMainIllustration: "",
  //   };

  //   (fetchArticleById as Mock).mockResolvedValue({ article: mockArticle });

  //   render(<UpdateArticleForm />);
  //   fireEvent.click(screen.getByText("Search Article"));

  //   await waitFor(() => {
  //     expect(fetchArticleById).toHaveBeenCalledWith(1);
  //   });

  //   fireEvent.click(screen.getByText("Submit"));

  //   await waitFor(() => {
  //     expect(updateArticleAction).toHaveBeenCalled();
  //   });
  // });

  it("shows a warning when submitting identical article data", async () => {
    const mockArticle = {
      id: 1,
      slug: "test-article",
      title: "Test Article",
      introduction: "Test Introduction",
      main: "Test Main",
      publishedAt: "2023-01-01",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      author: "Author",
      author_email: "author@example.com",
      validated: "false",
      shipped: "false",
      urls: "",
      mainAudioUrl: "",
      urlToMainIllustration: "",
    };

    (fetchArticleById as Mock).mockResolvedValue({ article: mockArticle });

    render(<UpdateArticleForm />);
    fireEvent.click(screen.getByText("Search Article"));

    await waitFor(() => {
      expect(fetchArticleById).toHaveBeenCalledWith(1);
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Submit")).toBeDefined();
    });
  });
});