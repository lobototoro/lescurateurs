import { render, screen, fireEvent } from '@testing-library/react';
import ArticleMarkupForm from '@/app/components/single-elements/articleHTMLForm';
import { describe, expect, it, vi } from 'vitest';

describe('ArticleMarkupForm', () => {
  const mockHandleSubmit = vi.fn();
  const mockRegister = vi.fn();
  const mockUpdateUrls = vi.fn();
  const mockAddInputs = vi.fn();
  const mockRemoveInputs = vi.fn();
  const mockCloseModal = vi.fn();

  const defaultProps = {
    handleSubmit: mockHandleSubmit,
    register: mockRegister,
    errors: {},
    urlsToArray: [],
    updateUrls: mockUpdateUrls,
    addInputs: mockAddInputs,
    removeInputs: mockRemoveInputs,
    formSentModal: { current: document.createElement('div') as HTMLDivElement },
    state: { message: false, text: '' },
    closeModal: mockCloseModal,
    target: '',
    identicalWarnMessage: false,
  };

  it('renders the form with all fields', () => {
    render(<ArticleMarkupForm {...defaultProps} />);

    expect(screen.getByTestId('title')).toBeDefined();
    expect(screen.getByTestId('introduction')).toBeDefined();
    expect(screen.getByTestId('main')).toBeDefined();
    expect(screen.getByTestId('urlToMainIllustration')).toBeDefined();
    expect(screen.getByTestId('mainAudioUrl')).toBeDefined();
    expect(screen.getByTestId('final-submit')).toBeDefined();
  });

  it('disables the title input when target is "update"', () => {
    render(<ArticleMarkupForm {...defaultProps} target="update" />);

    expect(screen.getByTestId('title')).property('disabled', true);
  });

  it('shows error messages when errors are present', () => {
    const errors = {
      title: { message: 'Title is required' },
      introduction: { message: 'Introduction is required' },
    };

    render(<ArticleMarkupForm {...defaultProps} errors={errors} />);

    expect(screen.getByText('Title is required')).toBeDefined();
    expect(screen.getByText('Introduction is required')).toBeDefined();
  });

  it('calls handleSubmit when the form is submitted', () => {
    render(<ArticleMarkupForm {...defaultProps} />);

    fireEvent.submit(screen.getByTestId('article-form'));

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('renders the modal with the correct state message', () => {
    const state = { message: true, text: 'Form submitted successfully' };

    render(<ArticleMarkupForm {...defaultProps} state={state} />);

    expect(screen.getByText('Form submitted successfully')).toBeDefined();
  });

  it('calls closeModal when the modal is clicked', () => {
    const formSentModal = { current: document.createElement('div') };

    render(<ArticleMarkupForm {...defaultProps} formSentModal={formSentModal} />);

    fireEvent.click(screen.getByTestId('create-article-modal'));

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('disables the submit button when there are errors', () => {
    const errors = { title: { message: 'Title is required' } };

    render(<ArticleMarkupForm {...defaultProps} errors={errors} />);

    expect(screen.getByTestId('final-submit')).property('disabled', true);
  });

  it('enables the submit button when there are no errors', () => {
    render(<ArticleMarkupForm {...defaultProps} />);

    expect(screen.getByTestId('final-submit')).property('disabled', false);
  });
});