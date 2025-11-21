/**
 * ModalWithCTA component
 *
 * Renders a modal dialog with a primary "call-to-action" button and a cancel button.
 *
 * @param modalRef - Ref to the root modal element (HTMLDivElement) used for focus management and tests.
 * @param title - Title string displayed in the modal header.
 * @param description - Body content string displayed in the modal body.
 * @param ctaText - Text for the primary action button.
 * @param ctaAction - Callback executed when the primary action button is clicked.
 * @param cancelAction - Callback executed when the cancel button is clicked.
 * @param cancelText - Text for the cancel button.
 * @param onClose - Callback executed when the modal is closed (background click or close button).
 * @param isPending - Optional flag indicating whether an action is in progress; when truthy the buttons show a loading state.
 *
 * @returns React.ReactElement - A fully accessible modal React element.
 *
 * @remarks
 * - The modal uses Bulma CSS classes (modal, modal-card, modal-card-head, modal-card-body, modal-card-foot).
 * - Clicks on the modal background and the header close button will call `onClose`.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * <ModalWithCTA
 *   modalRef={ref}
 *   title="Confirm"
 *   description="Are you sure?"
 *   ctaText="Confirm"
 *   ctaAction={() => doConfirm()}
 *   cancelAction={() => doCancel()}
 *   cancelText="Cancel"
 *   onClose={() => setShowModal(false)}
 *   isPending={isLoading}
 * />
 */

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
}): React.ReactElement {
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
