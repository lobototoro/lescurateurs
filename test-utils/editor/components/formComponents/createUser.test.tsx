import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreateUserForm from "../../../../app/editor/components/formComponents/createUser";

vi.mock("@/app/userActions", () => ({
  createUserAction: vi.fn().mockImplementationOnce((prev: any, data: any) => {

    return new Promise((resolve) => {
      resolve({ message: true, text: "User created successfully" });
    });
  }).mockImplementationOnce((prev: any, data: any) => {

    return new Promise((resolve) => {
      resolve({ message: false, text: "Failed to create user" });
    });
  }),
}));

vi.mock("@/app/components/single-elements/ArticleTitle", () => ({
  ArticleTitle: ({ text }: { text: string }) => <h2>{text}</h2>,
}));

describe("CreateUserForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with all fields", () => {
    render(<CreateUserForm />);

    expect(screen.getByText("Créer un utilisateur")).toBeDefined();
    expect(screen.getByLabelText("Email:")).toBeDefined();
    expect(screen.getByLabelText("Identifiant Tiers Service:")).toBeDefined();
    expect(screen.getByLabelText("Rôle:")).toBeDefined();
    expect(screen.getByTestId("final-submit")).toBeDefined();
  });

  it("validates required fields", async () => {
    render(<CreateUserForm />);

    fireEvent.click(screen.getByRole("button", { name: "Créer l'utilisateur" }));

    await waitFor(() => {
      expect(screen.getByText("Email requis")).toBeDefined();
      expect(screen.getByText("Champ requis")).toBeDefined();
    });
  });

  it("updates permissions when role changes", async () => {
    render(<CreateUserForm />);

    const roleSelect = screen.getByLabelText("Rôle:");
    fireEvent.change(roleSelect, { target: { value: "admin" } });
    
    await waitFor(() => {
      const checkboxes = document.querySelectorAll("input[type='checkbox']");
      expect(checkboxes.length).toEqual(10); // Assuming adminPermissions has 10 permissions
    });

    fireEvent.change(roleSelect, { target: { value: "contributor" } });

    await waitFor(() => {
      const checkboxes = document.querySelectorAll("input[type='checkbox']");
      expect(checkboxes.length).toEqual(4); // Assuming contributorPermissions has 4 permissions
    });
  });

  it("displays a success notification on successful submission", async () => {

    render(<CreateUserForm />);

    fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Identifiant Tiers Service:"), { target: { value: "12345" } });
    fireEvent.change(screen.getByLabelText("Rôle:"), { target: { value: "contributor" } });

    fireEvent.click(screen.getByRole("button", { name: "Créer l'utilisateur" }));

    await waitFor(() => {
      expect(screen.getByText("Succès: User created successfully")).toBeDefined();
    });
  });

  it("displays an error notification on failed submission", async () => {

    render(<CreateUserForm />);

    fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Identifiant Tiers Service:"), { target: { value: "12345" } });
    fireEvent.change(screen.getByLabelText("Rôle:"), { target: { value: "contributor" } });

    fireEvent.click(screen.getByRole("button", { name: "Créer l'utilisateur" }));

    await waitFor(() => {
      expect(screen.getByText("Erreur: Failed to create user")).toBeDefined();
    });
  });
});