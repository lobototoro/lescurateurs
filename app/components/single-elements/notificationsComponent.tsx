/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';

export default function NotificationsComponent({
  notificationAction,
  performClosingActions,
  toTop,
}: {
  notificationAction: {
    message: boolean;
    text: string;
  } | null;
  performClosingActions: () => void;
  toTop: () => void;
}): React.ReactElement {
  const [visibility, setVisibility] = useState<boolean>(false);

  useEffect(() => {
    let notifTimeout: NodeJS.Timeout | undefined;
    if (notificationAction !== null) {
      toTop();
      setVisibility(true);
      notifTimeout = setTimeout(() => {
        performClosingActions();
        setVisibility(false);
      }, 6000);
    }

    return () => {
      if (notifTimeout) {
        clearTimeout(notifTimeout);
      }
    };
  }, [notificationAction, performClosingActions, toTop]);

  return (
    <div
      className={`notification ${notificationAction?.message ? 'is-success' : 'is-danger'} ${visibility ? 'is-block' : 'is-hidden'}`}
      data-testid="notification"
    >
      <p className="content">
        {notificationAction !== null && (
          <span className="has-text-weight-bold">
            {notificationAction.text}
          </span>
        )}
        <br />
        <span>Cette notification se fermera d'elle-même</span>
      </p>
    </div>
  );
}
