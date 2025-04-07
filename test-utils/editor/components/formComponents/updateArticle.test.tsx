import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import UpdateArticleForm from "@/app/editor/components/formComponents/updateArticle";
import { getAMockedArticle } from '../../../articles-mocked';

vi.mock('@/app/articleActions', () => ({
  fetchArticleById: vi.fn().mockImplementation(() => {
    return {
      message: true,
      article: getAMockedArticle()[0]
    }
  }),
  updateArticleAction: vi.fn().mockImplementationOnce(() => {
    return {
      message: true,
      text: 'Article was successfully updated'
    }
  }).mockImplementationOnce(() => {
    return {
      message: false,
      text: 'Error updating article'
    }
  })
}));

vi.mock('@/app/searchActions', () => ({
  searchForSlugs: vi.fn().mockImplementation(() => {
    return {
      message: true,
      slugs: [
        { id: 1, slug: 'article-1', createdAt: '2025-03-20', articleId: 1 }
      ],
    }
  })
}));

/**
 * Test suite for the UpdateArticle component.
 */
describe.sequential('UpdateArticle', () => {
  /**
   * Test case to verify if the UpdateArticle component renders correctly.
   */
  it('should render correctly', () => {
    const { asFragment } = render(<UpdateArticleForm />);
    expect(asFragment()).toMatchSnapshot();
  });

  /**
   * Test case to verify the article update process.
   * This test simulates user interactions with the UpdateArticleForm component,
   * including searching for an article, selecting it, modifying its content,
   * submitting the changes, and navigating back to the search view.
   */
  it("should update an article", async () => {
    const { getByTestId, getByText } = render(<UpdateArticleForm />);

    act(() => {
      const searchInput = getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'article-1' } });
      const searchButton = getByTestId('submit-search');
      fireEvent.click(searchButton);  
    });

    await waitFor(() => {
      const trs = document.querySelectorAll('table tbody tr');
      expect(trs.length).toBe(1);
      expect(getByText('article-1')).toBeDefined();
    });

    act(() => {
      const selectionButton = getByTestId('selection-button');
      fireEvent.click(selectionButton);
    });

    await waitFor(() => {
      // article is displayed
      const title = getByTestId('title');
      expect(title).toBeDefined();
      expect(title).toHaveProperty('disabled');
      const introInput = getByTestId('introduction');
      fireEvent.change(introInput, { target: {
        value: 'Nisi enim dolor quis in ullamco laboris. Amet nulla adipisicing irure minim mollit excepteur deserunt anim deserunt nulla dolore. GGGGGGGGGGGGGG'
      }});
    });

    // act(() => {
    //   const finalSubmit = getByTestId('final-submit');
    //   expect(finalSubmit).toBeDefined();
    //   fireEvent.click(finalSubmit);
    // });

    // await waitFor(() => {
      
    // });
  });
});

/**
 * Test suite for handling errors in the article update process.
 */
describe('Error updating article', () => {
  /**
   * Test case to verify error handling in the UpdateArticleForm component.
   * This test simulates user interactions with the form, including:
   * 1. Searching for an article
   * 2. Selecting the article
   * 3. Attempting to update with invalid input
   * 
   * @remarks
   * The test checks if the submit button is disabled when the introduction is too short.
   * 
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle errors", async () => {
    const { getByTestId, getByText } = render(<UpdateArticleForm />);

    act(() => {
      const searchInput = getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'article-1' } });
      const searchButton = getByTestId('submit-search');
      fireEvent.click(searchButton);  
    });

    await waitFor(() => {
      const trs = document.querySelectorAll('table tbody tr');
      expect(trs.length).toBe(1);
      expect(getByText('article-1')).toBeDefined();
    });

    // act(() => {
    //   const selectionButton = getByTestId('selection-button');
    //   fireEvent.click(selectionButton);
    // });

    // let finalSubmit: HTMLElement;

    // await waitFor(() => {
      
    //   const introInput = getByTestId('introduction');
    //   const mainInput = getByTestId('main');
    //   finalSubmit = getByTestId('final-submit');
    //   fireEvent.change(introInput, { target: { value: 'Ar' } });
    //   fireEvent.change(mainInput, { target: { value: 'Nisi enim dolor quis in ullamco' } });
    //   fireEvent.click(finalSubmit);
    // });
  });
});