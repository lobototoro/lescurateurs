import { render, screen } from "@testing-library/react";
import NotificationsComponent from "@/app/components/single-elements/notificationsComponent";
import { describe, expect, it } from "vitest";

describe("NotificationsComponent", () => {
  it("renders the notification with success state", () => {
    render(
      <NotificationsComponent
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
        state={{ message: true, text: "Static" }}
      />
    );

    const staticMessage = screen.getByText("Cette notification se fermera d'elle-même");
    expect(staticMessage).toBeDefined();
  });
});