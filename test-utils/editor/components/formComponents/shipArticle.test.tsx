import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ShipArticleForm from '@/app/editor/components/formComponents/shipArticle';

vi.mock('@/app/articleActions', () => ({
  shipArticleAction: vi.fn().mockImplementation(() => {

    return {
      message: true,
      text: 'Test notification'
    }
  }),
}));

vi.mock("@/app/editor/components/formComponents/searchArticle", () => ({
  __esModule: true,
  default: ({ setSelection }: { setSelection: (id: number | string) => void }) => (
    <button onClick={() => setSelection(1)}>Mock SearchArticle</button>
  ),
}));

vi.mock("@/app/components/single-elements/modalWithCTA", () => ({
  __esModule: true,
  default: ({
    modalRef,
    ctaAction,
    cancelAction,
    onClose,
  }: {
    modalRef: React.RefObject<HTMLDivElement>;
    ctaAction: () => void;
    cancelAction: () => void;
    onClose: () => void;
  }) => (
    <div ref={modalRef} data-testid="modal">
      <button onClick={ctaAction}>Mock CTA</button>
      <button onClick={cancelAction}>Mock Cancel</button>
      <button onClick={onClose}>Mock Close</button>
    </div>
  ),
}));

describe("ShipArticleForm", () => {
  it("renders the component correctly", () => {
    render(<ShipArticleForm />);
    expect(screen.getByText("Mock SearchArticle")).toBeDefined();
  });

  it("opens the modal when an article is selected", async () => {
    render(<ShipArticleForm />);
    fireEvent.click(screen.getByText("Mock SearchArticle"));
    await waitFor(() => {
      expect(screen.getByText("Mock CTA")).toBeDefined();
    });
  });

  it("handles the CTA action correctly", async () => {
    render(<ShipArticleForm />);
    fireEvent.click(screen.getByText("Mock SearchArticle"));
    await waitFor(() => {
      fireEvent.click(screen.getByText("Mock CTA"));
    });
    // Add assertions for expected behavior after CTA action
  });

  it("handles the cancel action correctly", async () => {
    render(<ShipArticleForm />);
    fireEvent.click(screen.getByText("Mock SearchArticle"));
    await waitFor(() => {
      fireEvent.click(screen.getByText("Mock Cancel"));
    });
    // Add assertions for expected behavior after cancel action
  });

  it("closes the modal correctly", async () => {
    render(<ShipArticleForm />);
    fireEvent.click(screen.getByText("Mock SearchArticle"));
    await waitFor(() => {
      fireEvent.click(screen.getByText("Mock Close"));
    });
    // Add assertions for expected behavior after closing the modal
    expect(screen.getByTestId('modal').classList.contains('is-active')).toBe(
      false
    );
  });

  it("displays a notification when state changes", async () => {
    render(<ShipArticleForm />);
    fireEvent.click(screen.getByText("Mock SearchArticle"));
    fireEvent.click(screen.getByText("Mock CTA"));
    
    await waitFor(() => {
      expect(screen.getByText("Test notification")).toBeDefined();
    });
  });
});