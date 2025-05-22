import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CreateArticleForm from "@/app/editor/components/formComponents/createArticles";
import { createArticleAction } from "@/app/articleActions";
import { urlsToArrayUtil } from "@/lib/utility-functions";

vi.mock("@/app/articleActions", () => ({
  createArticleAction: vi.fn(),
}));

vi.mock("@/lib/utility-functions", () => ({
  urlsToArrayUtil: vi.fn(() => []),
}));

describe("CreateArticleForm", () => {
  it("renders the form with all required fields", () => {
    render(<CreateArticleForm />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/introduction/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/main/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/main audio url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url to main illustration/i)).toBeInTheDocument();
  });

  it("validates form fields and shows errors", async () => {
    render(<CreateArticleForm />);

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/introduction is required/i)).toBeInTheDocument();
    });
  });

  it("submits the form with valid data", async () => {
    render(<CreateArticleForm />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Test Title" } });
    fireEvent.change(screen.getByLabelText(/introduction/i), { target: { value: "Test Introduction" } });
    fireEvent.change(screen.getByLabelText(/main/i), { target: { value: "Test Main Content" } });
    fireEvent.change(screen.getByLabelText(/main audio url/i), { target: { value: "http://example.com/audio.mp3" } });
    fireEvent.change(screen.getByLabelText(/url to main illustration/i), { target: { value: "http://example.com/image.jpg" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(createArticleAction).toHaveBeenCalled();
    });
  });

  it("adds and removes URL inputs", () => {
    render(<CreateArticleForm />);

    const addButton = screen.getByRole("button", { name: /add url/i });
    const removeButton = screen.getByRole("button", { name: /remove url/i });

    fireEvent.click(addButton);
    expect(urlsToArrayUtil).toHaveBeenCalled();

    fireEvent.click(removeButton);
    expect(urlsToArrayUtil).toHaveBeenCalled();
  });

  it("opens and closes the modal on form submission", async () => {
    render(<CreateArticleForm />);

    const modal = screen.getByTestId("form-sent-modal");
    expect(modal).not.toHaveClass("is-active");

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(modal).toHaveClass("is-active");
    });

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(modal).not.toHaveClass("is-active");
  });
});