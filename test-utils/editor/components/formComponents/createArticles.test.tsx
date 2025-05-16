import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import CreateArticleForm from "@/app/editor/components/formComponents/createArticles";

// Mock dependencies
vi.mock("@/models/articleSchema", () => ({
  articleSchema: {},
}));
vi.mock("@/app/articleActions", () => ({
  createArticleAction: vi.fn(),
}));
vi.mock("@/models/article", () => ({
  UrlsTypes: { website: "website" },
}));
vi.mock("@/lib/utility-functions", () => ({
  urlsToArrayUtil: vi.fn((urls: string) => {
    try {
      return urls ? JSON.parse(urls) : [];
    } catch {
      return [];
    }
  }),
}));
vi.mock("@/app/components/single-elements/articleHTMLForm", () => ({
  __esModule: true,
  default: vi.fn(({ handleSubmit, register, errors, urlsToArray, updateUrls, addInputs, removeInputs, target }) => (
    <form data-testid="article-form" onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
      <button type="button" onClick={addInputs}>Add URL</button>
      <button type="button" onClick={removeInputs}>Remove URL</button>
    </form>
  )),
}));
vi.mock("@/app/components/single-elements/notificationsComponent", () => ({
  __esModule: true,
  default: ({ notification }: { notification: string }) =>
    notification ? <div data-testid="notification">{notification}</div> : null,
}));

// Import after mocks

describe("CreateArticleForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the ArticleMarkupForm", () => {
    render(<CreateArticleForm />);
    expect(screen.getByTestId("article-form")).toBeDefined();
  });
});