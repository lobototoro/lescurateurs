import { render, screen } from '@testing-library/react';
import NotificationsComponent from '@/app/components/single-elements/notificationsComponent';
import { describe, expect, it, vi } from 'vitest';

const scrollTopAction = vi.fn();

describe('NotificationsComponent', () => {
  it('renders the notification with success state', () => {
    render(
      <NotificationsComponent
        notificationAction={{ message: true, text: 'Success' }}
        performClosingActions={() => {}}
        toTop={scrollTopAction}
      />
    );

    const notificationElement = screen.getByText('Success');
    expect(notificationElement).toBeDefined();
    expect(
      notificationElement.closest('.notification')?.classList
    ).toContainEqual('is-success');
  });

  it('renders the notification with danger state', () => {
    render(
      <NotificationsComponent
        notificationAction={{ message: false, text: 'Error' }}
        performClosingActions={() => {}}
        toTop={scrollTopAction}
      />
    );

    const notificationElement = screen.getByText('Error');
    expect(notificationElement).toBeDefined();
    expect(
      notificationElement.closest('.notification')?.classList
    ).toContainEqual('is-danger');
  });

  it('renders the static message', () => {
    render(
      <NotificationsComponent
        notificationAction={{ message: true, text: 'Static' }}
        performClosingActions={() => {}}
        toTop={scrollTopAction}
      />
    );

    const staticMessage = screen.getByText(
      "Cette notification se fermera d'elle-même"
    );
    expect(staticMessage).toBeDefined();
  });
});
