import CreateArticleForm from "@/app/editor/components/formComponents/createArticlesForm";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe } from "node:test";
import { expect, it, vi } from "vitest";

vi.mock('@/app/articleActions', () => ({
  createArticleAction: vi.fn().mockImplementation(() => {
    return {
      message: true,
      text: 'Article created'
    }
  })
}));

vi.mock('next/font/google', () => ({
  Alegreya: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
  Raleway: () => ({
    style: {
      fontFamily: 'mocked',
    },
  })
}));

describe('Create article form', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render correctly', () => {
    const { asFragment } = render(<CreateArticleForm />);
    
    expect(asFragment()).toMatchSnapshot();
  });


});