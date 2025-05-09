import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ModalWithCTA from '@/app/components/single-elements/modalWithCTA';

describe("ModalWithCTA Component", () => {
  const mockModalRef = { current: document.createElement("div") } as React.RefObject<HTMLDivElement>;
  const mockOnClose = vi.fn();
  const mockCtaAction = vi.fn();
  const mockCancelAction = vi.fn();

  const defaultProps = {
    modalRef: mockModalRef,
    title: "Test Modal Title",
    description: "This is a test description.",
    ctaText: "Confirm",
    ctaAction: mockCtaAction,
    cancelAction: mockCancelAction,
    cancelText: "Cancel",
    onClose: mockOnClose,
  };

  it("renders the modal with the correct title and description", () => {
    render(<ModalWithCTA {...defaultProps} />);

    expect(screen.getByText("Test Modal Title")).toBeDefined();
    expect(screen.getByText("This is a test description.")).toBeDefined();
  });

  it("calls onClose when the background is clicked", () => {
    render(<ModalWithCTA {...defaultProps} />);

    const background = screen.getByTestId("article-modal").querySelector(".modal-background");
    fireEvent.click(background!);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when the close button is clicked", () => {
    render(<ModalWithCTA {...defaultProps} />);

    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls ctaAction when the CTA button is clicked", () => {
    render(<ModalWithCTA {...defaultProps} />);

    const ctaButton = screen.getByText("Confirm");
    fireEvent.click(ctaButton);

    expect(mockCtaAction).toHaveBeenCalled();
  });

  it("calls cancelAction when the cancel button is clicked", () => {
    render(<ModalWithCTA {...defaultProps} />);

    const cancelButton = screen.getByText("Annuler");
    fireEvent.click(cancelButton);

    expect(mockCancelAction).toHaveBeenCalled();
  });
});