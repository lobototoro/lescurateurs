import { JSX } from 'react';

export default function ModalWithCTA({
  modalRef,
  title,
  description,
  ctaText,
  ctaAction,
  cancelAction,
  cancelText,
  onClose,
  isPending,
}: {
  modalRef: React.RefObject<HTMLDivElement>;
  title: string;
  description: string;
  ctaText: string;
  ctaAction: () => void;
  cancelAction: () => void;
  cancelText: string;
  onClose: () => void;
  isPending?: unknown;
}): JSX.Element {
  return (
    <div className="modal" ref={modalRef} data-testid="article-modal">
      <div
        className="modal-background"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          onClose();
        }}
      ></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onClose();
            }}
          ></button>
        </header>
        <section className="modal-card-body">
          <div className="content">
            <p>{description}</p>
          </div>
        </section>
        <footer className="modal-card-foot">
          <div className="buttons ">
            <button
              data-testid="cta-action"
              className={isPending ? 'button is-loading' : 'button'}
              onClick={() => ctaAction()}
            >
              {ctaText}
            </button>
            <button
              data-testid="cancel-action"
              className={isPending ? 'button is-loading' : 'button'}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                cancelAction();
              }}
            >
              {cancelText}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
