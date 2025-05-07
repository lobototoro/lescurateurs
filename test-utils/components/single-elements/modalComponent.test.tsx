import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ModalComponent from '@/app/components/single-elements/modalComponent';

describe('ModalComponent', () => {
  const closeModalMock = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal with the correct title and text content', () => {
    render(
      <ModalComponent
        formSentModal={null}
        closeModal={closeModalMock}
        title="Test Modal"
        textContent={{ message: true, text: 'This is a success message' }}
      />
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('This is a success message')).toBeInTheDocument();
  });

  it('applies the correct class when identicalWarnMessage is true', () => {
    render(
      <ModalComponent
        formSentModal={null}
        closeModal={closeModalMock}
        title="Warning Modal"
        identicalWarnMessage={true}
        textContent={{ message: false, text: 'This is a warning message' }}
      />
    );

    const modalCard = screen.getByTestId('modal').querySelector('.modal-card');
    expect(modalCard).toHaveClass('is-danger');
  });

  it('renders the warning message when identicalWarnMessage is true', () => {
    render(
      <ModalComponent
        formSentModal={null}
        closeModal={closeModalMock}
        title="Warning Modal"
        identicalWarnMessage={true}
        textContent={{ message: false, text: 'This is a warning message' }}
      />
    );

    expect(
      screen.getByText("Aucune modification détectée sur l'article.")
    ).toBeInTheDocument();
  });

  it('calls closeModal when the background is clicked', () => {
    render(
      <ModalComponent
        formSentModal={null}
        closeModal={closeModalMock}
        title="Test Modal"
        textContent={{ message: true, text: 'This is a success message' }}
      />
    );

    const background = screen.getByTestId('modal').querySelector('.modal-background');
    fireEvent.click(background!);

    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });

  it('calls closeModal when the OK button is clicked', () => {
    render(
      <ModalComponent
        formSentModal={null}
        closeModal={closeModalMock}
        title="Test Modal"
        textContent={{ message: true, text: 'This is a success message' }}
      />
    );

    const button = screen.getByLabelText('accept button');
    fireEvent.click(button);

    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });
});