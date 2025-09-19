import ArticleMarkupForm from "@/app/components/single-elements/articleHTMLForm";
import { fireEvent, render } from "@testing-library/react";
import { expect, it, vi } from "vitest";

const mockProps = {
    handleSubmit: vi.fn(),
    register: vi.fn(),
    errors: {},
    urlsToArray: [],
    updateUrls: vi.fn(),
    removeUrl: vi.fn(),
    addUrl: vi.fn(),
    handleChange: vi.fn(),
    addInputs: vi.fn(),
    removeInputs: vi.fn(),
    formSentModal: null,
    state: { message: false, text: '' },
    closeModal: vi.fn(),
    target: 'create',
    getMainContent: vi.fn(),
    setMainContent: vi.fn(),
  };

it('should render correct markup', () => {
  const { asFragment } = render(<ArticleMarkupForm {...mockProps} />);
  expect(asFragment()).toMatchSnapshot();
});

it('should render correct markup for update', () => {
  const mockPropsUpdate = {
    ...mockProps,
    target: 'update',
  };

  const { asFragment, getByTestId } = render(
    <ArticleMarkupForm {...mockPropsUpdate} />
  );
  expect(asFragment()).toMatchSnapshot();
  expect(getByTestId('title')).toHaveProperty('disabled', true);
});

it('Should display an additionnal link line with blinking validate button while modified', () => {
  const mockPropsAddUrl = {
    ...mockProps,
    urlsToArray: ['type: website, url: https://example.com, credits: test'],
    state: { message: true, text: 'TEST' },
    target: 'update',
  };
  const { getByTestId } = render(<ArticleMarkupForm {...mockPropsAddUrl} />);
  expect(getByTestId('select-type')).toBeDefined();
  fireEvent.change(getByTestId('select-type'), { target: { value: 'videos' } });
  expect(getByTestId('add-url-button')?.classList.toString()).toMatch(/blink/);
  fireEvent.click(getByTestId('add-url-button'));
  expect(getByTestId('add-url-button')?.classList.toString()).not.toMatch(/blink/);
});

