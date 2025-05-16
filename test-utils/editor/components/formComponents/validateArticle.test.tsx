import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ValidateArticleForm from "@/app/editor/components/formComponents/validateArticle";
import { describe, expect, it, vi } from "vitest";
import { useActionState } from "react";

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
      <button onClick={ctaAction}>Mock Validate</button>
      <button onClick={cancelAction}>Mock Invalidate</button>
      <button onClick={onClose}>Mock Close</button>
    </div>
  ),
}));

vi.mock("@/app/articleActions", () => ({
  validateArticleAction: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: vi.fn(() => [null, vi.fn(), false]),
  };
});

describe("ValidateArticleForm", () => {
  it("renders without crashing", () => {
    render(<ValidateArticleForm />);
    expect(screen.getByText("Mock SearchArticle")).toBeDefined();
  });

  it("opens the modal when an article is selected", async () => {
    render(<ValidateArticleForm />);
    fireEvent.click(screen.getByText("Mock SearchArticle"));
    await waitFor(() => {
      expect(screen.getByText("Mock Validate")).toBeDefined();
    });
  });

  it("handles validation action", async () => {
    const mockFormAction = vi.fn();
    (vi.mocked(useActionState) as any).mockReturnValue([null, mockFormAction, false]);

    render(<ValidateArticleForm />);
    fireEvent.click(screen.getByText("Mock SearchArticle"));
    fireEvent.click(screen.getByText("Mock Validate"));

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalled();
    });
  });

  it("handles invalidation action", async () => {
    const mockFormAction = vi.fn();
    (vi.mocked(useActionState) as any).mockReturnValue([null, mockFormAction, false]);

    render(<ValidateArticleForm />);
    fireEvent.click(screen.getByText("Mock SearchArticle"));
    fireEvent.click(screen.getByText("Mock Invalidate"));

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalled();
    });
  });

  it("closes the modal", async () => {
    render(<ValidateArticleForm />);
    fireEvent.click(screen.getByText("Mock SearchArticle"));
    fireEvent.click(screen.getByText("Mock Close"));

    await waitFor(() => {
      expect(screen.getByTestId('modal').classList.contains('is-active')).toBe(false);
    });
  });

  it("displays notification when state changes", async () => {
    (vi.mocked(useActionState) as any).mockReturnValue([{ text: "Success", message: true }, vi.fn(), false]);

    render(<ValidateArticleForm />);
    expect(screen.getByText("Success")).toBeDefined();
  });
});