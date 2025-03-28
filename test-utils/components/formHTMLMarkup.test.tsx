import ArticleMarkupForm from "@/app/components/articleHTMLForm";
import { render } from "@testing-library/react";
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

it('Should open a modal with the expected text value', () => {
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
    state: { message: true, text: 'TEST' },
    closeModal: vi.fn(),
    target: 'update',
  };
  const { getByText } = render(<ArticleMarkupForm {...mockProps} />);
  expect(getByText('TEST')).toBeDefined();
});