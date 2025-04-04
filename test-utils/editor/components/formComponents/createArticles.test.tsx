import CreateArticleForm from "@/app/editor/components/formComponents/createArticles";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { expect, it, vi, describe } from "vitest";

vi.mock('@/app/articleActions', () => ({
  createArticleAction: vi.fn().mockImplementation(() => {
    return {
      message: true,
      text: 'Article created'
    }
  })
}));

describe('Create article form', () => {

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

    fireEvent.click(getByTestId('final-submit'));

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

    fireEvent.click(getByTestId('final-submit'));

    await waitFor(() => {
      const modal = getByTestId('create-article-modal');
      const modalInnerContent = modal.querySelector('.modal-content');
      expect(modalInnerContent?.classList.contains('is-danger')).toBeTruthy();
    });
  });

  it("should add a new URL input when addInputs is called", async () => {
    const { getByTestId } = render(<CreateArticleForm />);

    const addButton = getByTestId("add-url");
    fireEvent.click(addButton);

    await waitFor(() => {
      const urlInputs = getByTestId("url-inputs-container").querySelectorAll("input");
      expect(urlInputs.length).toBeGreaterThan(1);
    });
  });

  it("should remove a URL input when removeInputs is called", async () => {
    const { getByTestId } = render(<CreateArticleForm />);

    const addButton = getByTestId("add-url");
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    const removeButton = getByTestId("remove-url");
    fireEvent.click(removeButton);

    await waitFor(() => {
      const urlInputs = getByTestId("url-inputs-container").querySelectorAll("input");
      expect(urlInputs.length).toBe(2); // since there's a group buttons to add and remove under the same node
    });
  });

  // it("should update URL inputs when updateUrls is called", async () => {
  //   const { getByTestId } = render(<CreateArticleForm />);

  //   const addButton = getByTestId("add-url-button");
  //   fireEvent.click(addButton);

  //   const urlInput = getByTestId("url-input-0");
  //   fireEvent.change(urlInput, { target: { value: "https://example.com" } });

  //   await waitFor(() => {
  //     expect(urlInput.value).toBe("https://example.com");
  //   });
  // });

  it("should reset the form and close the modal after successful submission", async () => {
    const { getByTestId } = render(<CreateArticleForm />);

    fireEvent.change(getByTestId("title"), { target: { value: "My title" } });
    fireEvent.change(getByTestId("introduction"), { target: { value: "Introduction text" } });
    fireEvent.change(getByTestId("main"), { target: { value: "Main content" } });
    fireEvent.change(getByTestId("mainAudioUrl"), { target: { value: "https://audio.com" } });
    fireEvent.change(getByTestId("urlToMainIllustration"), { target: { value: "https://image.com" } });

    fireEvent.click(getByTestId("final-submit"));

    await waitFor(() => {
      const modal = getByTestId("create-article-modal");
      expect(modal.classList.contains("is-active")).toBeFalsy();
    });
  });
});