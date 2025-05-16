import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import UpdateArticleForm from "@/app/editor/components/formComponents/updateArticle";
import { fetchArticleById, updateArticleAction } from "@/app/articleActions";

// Mocks
vi.mock("@/app/articleActions", () => ({
  fetchArticleById: vi.fn(),
  updateArticleAction: vi.fn(),
}));
vi.mock("@/models/article", () => ({
  UrlsTypes: { website: "website" },
}));
vi.mock("@/models/articleSchema", () => ({
  articleSchema: {
    parse: vi.fn(),
  },
}));
vi.mock("@/app/components/single-elements/articleHTMLForm", () => ({
  __esModule: true,
  default: (props: any) => (
    <form data-testid="article-form" onSubmit={e => { e.preventDefault(); props.handleSubmit({ preventDefault: () => {} }); }}>
      <button type="submit">Submit</button>
    </form>
  ),
}));
vi.mock("@/app/editor/components/formComponents/searchArticle", () => ({
  __esModule: true,
  default: (props: any) => (
    <div>
      <button data-testid="select-article" onClick={() => props.setSelection(1)}>
        Select Article
      </button>
    </div>
  ),
}));
vi.mock("@/lib/utility-functions", () => ({
  isEmpty: (obj: any) => !obj,
  urlsToArrayUtil: (urls: string) => {
    try {
      return JSON.parse(urls || "[]");
    } catch {
      return [];
    }
  },
}));
vi.mock("@/app/components/single-elements/notificationsComponent", () => ({
  __esModule: true,
  default: ({ notification }: { notification: string }) => <div data-testid="notification">{notification}</div>,
}));


describe("UpdateArticleForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetchArticleById as any).mockResolvedValue({
      article: {
        id: 1,
        slug: 'test-article',
        title: 'Test Article',
        introduction:
          'Non est magna pariatur aute culpa velit excepteur sint excepteur esse magna. Lorem consectetur velit in aliquip aliqua adipisicing ullamco Lorem commodo. Est aliqua commodo amet Lorem ut eu esse dolor officia do. Sunt laborum fugiat in elit anim ad excepteur elit ad excepteur non. Nisi id officia culpa aliqua irure in voluptate in irure exercitation fugiat aute eu voluptate.',
        main: 'Non est magna pariatur aute culpa velit excepteur sint excepteur esse magna. Lorem consectetur velit in aliquip aliqua adipisicing ullamco Lorem commodo. Est aliqua commodo amet Lorem ut eu esse dolor officia do. Sunt laborum fugiat in elit anim ad excepteur elit ad excepteur non. Nisi id officia culpa aliqua irure in voluptate in irure exercitation fugiat aute eu voluptate.\r\nQuis proident nisi dolore amet. Reprehenderit commodo aliquip in nisi excepteur quis sit et commodo elit sit sunt Lorem id. Ea deserunt laboris eu velit Lorem et non officia ex qui tempor ea. Commodo nostrud occaecat cillum fugiat cillum dolor. Minim sunt anim eiusmod exercitation voluptate pariatur ullamco Lorem est adipisicing labore nisi minim. Sit dolor qui qui Lorem aliquip aliquip eu ex dolor in eiusmod. Excepteur minim nostrud fugiat et incididunt eu ex sunt elit ex ad eu exercitation elit.',
        publishedAt: '2023-01-01',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        author: 'Author',
        author_email: 'author@email.com',
        validated: 'false',
        shipped: 'false',
        urls: '[]',
        mainAudioUrl: 'https://example.com/audio.mp3',
        urlToMainIllustration: 'https://example.com/image.jpg',
      },
    });
    (updateArticleAction as any).mockImplementation(() => Promise.resolve({ message: true, text: "Updated!" }));
  });

  it("renders SearchArticle when no article is selected", () => {
    render(<UpdateArticleForm />);
    expect(screen.getByTestId("select-article")).toBeDefined();
  });

  it("loads article and renders ArticleMarkupForm after selection", async () => {
    render(<UpdateArticleForm />);
    fireEvent.click(screen.getByTestId("select-article"));
    await waitFor(() => expect(fetchArticleById).toHaveBeenCalledWith(1));
    expect(await screen.findByTestId("article-form")).toBeDefined();
  });

  it("calls backToSearch and returns to SearchArticle", async () => {
    render(<UpdateArticleForm />);
    fireEvent.click(screen.getByTestId("select-article"));
    await waitFor(() => expect(fetchArticleById).toHaveBeenCalled());
    const backBtn = await screen.findByTestId("back-to-search");
    fireEvent.click(backBtn);
    expect(await screen.findByTestId("select-article")).toBeDefined();
  });
});