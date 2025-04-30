import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";
import UpdateArticleForm from "@/app/editor/components/formComponents/updateArticle";
import { fetchArticleById, updateArticleAction } from "@/app/articleActions";

vi.mock('@/app/articleActions', () => ({
  fetchArticleById: vi.fn(),
  updateArticleAction: vi
    .fn()
    .mockImplementationOnce(() => {
      return {
        message: true,
        text: 'Article was successfully updated',
      };
    })
    .mockImplementationOnce(() => {
      return {
        message: false,
        text: 'Error updating article',
      };
    }),
}));

// vi.mock("@/app/components/articleHTMLForm", () => ({
//   __esModule: true,
//   default: ({ handleSubmit }: { handleSubmit: () => void }) => (
//     <form onSubmit={handleSubmit}>
//       <button type="submit">Submit</button>
//     </form>
//   ),
// }));

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
      introduction: "Ullamco quis est excepteur exercitation proident dolore incididunt.",
      main: "Ipsum dolore sit irure eu ut pariatur nisi. Labore Lorem sint occaecat sint incididunt eiusmod deserunt est. Esse anim sint laboris ipsum culpa culpa.",
      publishedAt: "2023-01-01",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      author: "Author",
      author_email: "author@example.com",
      validated: "false",
      shipped: "false",
      urls: "",
      mainAudioUrl: "https://example.com/audio.mp3",
      urlToMainIllustration: "https://example.com/image.jpg",
    };

    (fetchArticleById as Mock).mockResolvedValue({
      message: true,
      article: mockArticle,
    });

    render(<UpdateArticleForm />);

    fireEvent.click(screen.getByText("Search Article"));

    await waitFor(() => {
      expect(fetchArticleById).toHaveBeenCalledWith(1);
      expect(screen.getByTestId('final-submit')).toBeDefined();
    });
  });

  // it("submits the form with updated article data", async () => {
  //   const user = userEvent.setup();
  //   const mockArticle = {
  //     id: 1,
  //     slug: 'test-article',
  //     title: 'Test Article',
  //     introduction:
  //       'Ullamco quis est excepteur exercitation proident dolore incididunt.',
  //     main: 'Ipsum dolore sit irure eu ut pariatur nisi. Labore Lorem sint occaecat sint incididunt eiusmod deserunt est. Esse anim sint laboris ipsum culpa culpa. Ipsum dolore sit irure eu ut pariatur nisi. Labore Lorem sint occaecat sint incididunt eiusmod deserunt est. Esse anim sint laboris ipsum culpa culpa.',
  //     publishedAt: '2023-01-01',
  //     createdAt: '2023-01-01',
  //     updatedAt: '2023-01-01',
  //     author: 'Author',
  //     author_email: 'author@example.com',
  //     validated: 'false',
  //     shipped: 'false',
  //     urls: '',
  //     mainAudioUrl: 'https://example.com/audio.mp3',
  //     urlToMainIllustration: 'https://example.com/image.jpg',
  //   };

  //   (fetchArticleById as Mock).mockResolvedValue({
  //     message: true,
  //     article: mockArticle,
  //   });

  //   render(<UpdateArticleForm />);

  //   fireEvent.click(screen.getByText("Search Article"));

  //   await waitFor(() => {
  //     expect(fetchArticleById).toHaveBeenCalledWith(1);
  //   });

  //   const submitButton = screen.getByTestId("final-submit");

  //   user.type(
  //     screen.getByTestId('introduction'),
  //     'Ullamco quis est excepteur exercitation proident dolore incididunt. GGGGGGGGG'
  //   );
  //   fireEvent.click(submitButton);
    
  //   await waitFor(() => {
  //     expect(updateArticleAction).toHaveBeenCalled();
  //   });
  // });

  // it("shows a warning modal if the article data is identical", async () => {
  //   const user = userEvent.setup();
  //   const mockArticle = {
  //     id: 1,
  //     slug: 'test-article',
  //     title: 'Test Article',
  //     introduction:
  //       'Ullamco quis est excepteur exercitation proident dolore incididunt.',
  //     main: 'Ipsum dolore sit irure eu ut pariatur nisi. Labore Lorem sint occaecat sint incididunt eiusmod deserunt est. Esse anim sint laboris ipsum culpa culpa.',
  //     publishedAt: '2023-01-01',
  //     createdAt: '2023-01-01',
  //     updatedAt: '2023-01-01',
  //     author: 'Author',
  //     author_email: 'author@example.com',
  //     validated: 'false',
  //     shipped: 'false',
  //     urls: '',
  //     mainAudioUrl: 'https://example.com/audio.mp3',
  //     urlToMainIllustration: 'https://example.com/image.jpg',
  //   };

  //   (fetchArticleById as Mock).mockResolvedValue({ article: mockArticle });

  //   render(<UpdateArticleForm />);

  //   fireEvent.click(screen.getByText("Search Article"));

  //   await waitFor(() => {
  //     expect(fetchArticleById).toHaveBeenCalledWith(1);
  //   });
    
  //   const submitButton = screen.getByText("Submit");

  //   await act(async () => {
  //     fireEvent.click(submitButton);
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText("Search Article")).toBeDefined();
  //   });
  // });
});