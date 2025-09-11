import { JSX } from "react";

export default function NotificationsComponent({
  state
}: {
  state: {
    message: boolean;
    text: string;
  };
}): JSX.Element {
  return (
    <div
      className={`notification ${state?.message ? 'is-success' : 'is-danger'}`}
      data-testid="notification"
    >
      <p className="content">
        {state?.text && (
          <span className="has-text-weight-bold">{state.text}</span>
        )}
        <br />
        <span>Cette notification se fermera d'elle-même</span>
      </p>
    </div>
  );
};