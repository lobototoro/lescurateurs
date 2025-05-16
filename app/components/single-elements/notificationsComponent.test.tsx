import { render, screen } from "@testing-library/react";
import NotificationsComponent from "./notificationsComponent";
import { describe, expect, it } from "vitest";

describe("NotificationsComponent", () => {
  it("renders the notification with success state", () => {
    render(
      <NotificationsComponent
        notification="Success notification"
        state={{ message: true, text: "Success" }}
      />
    );

    const notificationElement = screen.getByText("Success notification");
    expect(notificationElement).toBeDefined();
    expect(notificationElement.closest(".notification")?.classList).toContainEqual("is-success");
  });

  it("renders the notification with danger state", () => {
    render(
      <NotificationsComponent
        notification="Error notification"
        state={{ message: false, text: "Error" }}
      />
    );

    const notificationElement = screen.getByText("Error notification");
    expect(notificationElement).toBeDefined();
    expect(notificationElement.closest(".notification")?.classList).toContainEqual("is-danger");
  });

  it("renders the static message", () => {
    render(
      <NotificationsComponent
        notification="Static message test"
        state={{ message: true, text: "Static" }}
      />
    );

    const staticMessage = screen.getByText("Cette notification se fermera d'elle-même");
    expect(staticMessage).toBeDefined();
  });
});