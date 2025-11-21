import React, { useState, useEffect } from 'react';

/**
 * @packageDocumentation
 * NotificationsComponent module.
 *
 * This module exposes a default React component that renders a transient
 * notification UI element. The notification is shown when `notificationAction`
 * is provided and hides itself after a timeout (6000ms).
 *
 * @remarks
 * - Styling: uses Bulma-like classes `is-success` or `is-danger` and `is-block`/`is-hidden`.
 * - Behavior: scrolls to top when shown via the provided `toTop` callback and calls
 *   `performClosingActions` when the timeout elapses.
 */

/**
 * Props for the NotificationsComponent.
 *
 * @public
 */
export type NotificationsComponentProps = {
  
  /**
   * Controls the visibility and content of the notification.
   *
   * When non-null, the notification will be displayed. The object contains:
   * - `message`: boolean flag used to determine success (true) vs danger (false) styling.
   * - `text`: the text content shown in bold inside the notification.
   */
  notificationAction: {
    
    /**
     * True for success styling, false for danger styling.
     */
    message: boolean;

    /**
     * Text to display inside the notification.
     */
    text: string;
  } | null;

  /**
   * Callback invoked when the notification should perform any closing logic.
   *
   * Called automatically after the notification timeout elapses.
   */
  performClosingActions: () => void;

  /**
   * Callback to scroll or otherwise move focus to the top of the UI when a notification appears.
   */
  toTop: () => void;
};

/**
 * NotificationsComponent
 *
 * Renders a transient notification. The component manages internal visibility state
 * and triggers provided callbacks for scrolling to top and closing actions.
 *
 * @param props - Props for the component (see NotificationsComponentProps)
 * @returns A React element representing the notification UI.
 */
/* eslint-disable react-hooks/set-state-in-effect */

export default function NotificationsComponent(props: NotificationsComponentProps): React.ReactElement {
  const [visibility, setVisibility] = useState<boolean>(false);

  useEffect(() => {
    let notifTimeout: NodeJS.Timeout | undefined;
    if (props.notificationAction !== null) {
      props.toTop();
      setVisibility(true);
      notifTimeout = setTimeout(() => {
        setVisibility(false);
        props.performClosingActions();
      }, 6000);
    }

    return () => {
      if (notifTimeout) {
        clearTimeout(notifTimeout);
      }
    };
  }, [props.notificationAction, props.performClosingActions, props.toTop]);

  return (
    <div
      className={`notification ${props.notificationAction?.message ? 'is-success' : 'is-danger'} ${visibility ? 'is-block' : 'is-hidden'}`}
      data-testid="notification"
    >
      <p className="content">
        {props.notificationAction !== null && (
          <span className="has-text-weight-bold">
            {props.notificationAction.text}
          </span>
        )}
        <br />
        <span>Cette notification se fermera d'elle-même</span>
      </p>
    </div>
  );
}
