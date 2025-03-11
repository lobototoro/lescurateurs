import CreateArticleForm from "@/app/editor/components/formComponents/createArticlesForm";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { expect, it, vi, describe, afterEach } from "vitest";

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

  it('should return an ok response after creation', async () => {
    const { getByText, getByTestId } = render(<CreateArticleForm />);

    fireEvent.change(getByTestId('title'), {
      target: { value: 'My title' }
    });
    
    fireEvent.change(getByTestId('introduction'), {
      target: { value: 'Nisi enim dolor quis in ullamco laboris. Amet nulla adipisicing irure minim mollit excepteur deserunt anim deserunt nulla dolore.' }
    });

    fireEvent.change(getByTestId('main'), {
      target: { value: 'Nisi enim dolor quis in ullamco laboris. Amet nulla adipisicing irure minim mollit excepteur deserunt anim deserunt nulla anim non incididunt. Occaecat culpa velit irure mollit quis occaecat nulla. Nostrud cupidatat do sunt in do. Sint consectetur tempor nulla est ut dolor incididunt proident sunt aliquip nisi do aute voluptate.' }
    });

    fireEvent.change(getByTestId('mainAudioUrl'), {
      target: { value: 'https://example.com' }
    });

    fireEvent.change(getByTestId('urlToMainIllustration'), {
      target: { value: 'https://example.com' }
    });

    fireEvent.click(getByTestId('submit'));

    await waitFor(() => {
      expect(getByText('Article created')).toBeDefined();
    });
  });

  it("should return an error response after creation", async () => {
    const { getByTestId } = render(<CreateArticleForm />);

    fireEvent.change(getByTestId('title'), {
      target: { value: 'My title' }
    });
    
    fireEvent.change(getByTestId('introduction'), {    
      target: { value: 'Nisi enim dolor quis in ullamco laboris. Amet nulla adipisicing irure minim mollit excepteur deserunt anim deserunt nulla dolore.' }
    });  

    fireEvent.change(getByTestId('main'), {
      target: { value: 'Nisi enim dolor quis in ullamco laboris. Amet nulla adipisicing irure minim mollit excepteur deserunt anim deserunt nulla anim non incididunt. Occaecat culpa velit irure mollit quis occaecat nulla. Nostrud cupidatat do sunt in do. Sint consectetur tempor nulla est ut dolor incididunt proident sunt aliquip nisi do aute voluptate.' }
    });

    fireEvent.change(getByTestId('mainAudioUrl'), {
      target: { value: 'my url' }
    });

    fireEvent.change(getByTestId('urlToMainIllustration'), {
      target: { value: 'https://example.com' }
    });

    fireEvent.click(getByTestId('submit'));

    await waitFor(() => {
      const modal = getByTestId('create-article-modal');
      const modalInnerContent = modal.querySelector('.modal-content');
      expect(modalInnerContent?.classList.contains('is-danger')).toBeTruthy();
    });
  });
});