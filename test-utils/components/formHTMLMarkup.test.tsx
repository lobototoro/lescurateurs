import ArticleMarkupForm from "@/app/components/single-elements/articleHTMLForm";
import { fireEvent, render } from "@testing-library/react";
import { expect, it, vi } from "vitest";

it('should render correct markup', () => {
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
  };

  const { asFragment } = render(<ArticleMarkupForm {...mockProps} />);
  expect(asFragment()).toMatchSnapshot();
});

it('should render correct markup for update', () => {
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
    target: 'update',
  };

  const { asFragment, getByTestId } = render(<ArticleMarkupForm {...mockProps} />);
  expect(asFragment()).toMatchSnapshot();
  expect(getByTestId('title')).toHaveProperty('disabled', true);
});

it('Should display an additionnal link line with blinking validate button while modified', () => {
  const mockProps = {
    handleSubmit: vi.fn(),
    register: vi.fn(),
    errors: {},
    urlsToArray: ['type: website, url: https://example.com, credits: test'],
    updateUrls: vi.fn(),
    removeUrl: vi.fn(),
    addUrl: vi.fn(),
    handleChange: vi.fn(),
    addInputs: vi.fn(),
    removeInputs: vi.fn(),
    formSentModal: null,
    state: { message: true, text: 'TEST' },
    closeModal: vi.fn(),
    target: 'update',
  };
  const { getByTestId } = render(<ArticleMarkupForm {...mockProps} />);
  expect(getByTestId('select-type')).toBeDefined();
  fireEvent.change(getByTestId('select-type'), { target: { value: 'videos' } });
  expect(getByTestId('add-url-button')?.classList.toString()).toMatch(/blink/);
  fireEvent.click(getByTestId('add-url-button'));
  expect(getByTestId('add-url-button')?.classList.toString()).not.toMatch(/blink/);
});

