import { JSX } from "react";

export default function NotificationsComponent({
  notification,
  state,
}: {
  notification: string;
  state: {
    message: boolean;
    text: string;
  };
}): JSX.Element {
  return (
    <div
      className={`notification ${state?.message ? 'is-success' : 'is-danger'}`}
    >
      <p className="content">
        {notification}
        <br />
        <span>Cette notification se fermera d'elle-même</span>
      </p>
    </div>
  );
};