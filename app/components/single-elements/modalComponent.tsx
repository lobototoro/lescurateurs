/**
 * @module ModalComponent
 * @remarks
 * Provides a reusable modal component to display success/error messages and an
 * optional "no changes detected" warning. The component is intentionally
 * presentation-focused and expects a parent to control its visibility via the
 * provided ref and close callback.
 */

/**
 * Props for ModalComponent.
 *
 * */
export type ModalComponentProps = {
  formSentModal: React.RefObject<HTMLDivElement> | null;
  closeModal: () => void;
  title: string;
  identicalWarnMessage?: boolean;
  textContent?: { message: boolean; text: string } | null;
};

/**
 * ModalComponent
 *
 * Renders a modal dialog with:
 * - a background click area that closes the modal,
 * - a header displaying `title`,
 * - a body showing `textContent.text` and a conditional identical-change warning,
 * - a simple footer with an "OK" button that also closes the modal.
 *
 * @public
 * @param {ModalComponentProps} props - Component properties.
 * @returns {JSX.Element} The rendered modal element.
 *
 * @example
 * <ModalComponent
 *   formSentModal={modalRef}
 *   closeModal={() => setIsModalOpen(false)}
 *   title="Save Status"
 *   identicalWarnMessage={false}
 *   textContent={{ message: true, text: "Saved successfully." }}
 * />
 *
 * @see {@link https://typedoc.org/ | TypeDoc} for documentation generation details.
 */
export default function ModalComponent({
  formSentModal,
  closeModal,
  title,
  identicalWarnMessage,
  textContent,
}: {
  formSentModal: React.RefObject<HTMLDivElement> | null;
  closeModal: () => void;
  title: string;
  identicalWarnMessage?: boolean;
  textContent: { message: boolean; text: string } | null;
}) {
  return (
    <div
      className="modal"
      ref={formSentModal}
      data-testid="modal"
      aria-hidden="true"
    >
      <div
        className="modal-background"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          closeModal();
        }}
      />
      <div
        className={`
          modal-card ${identicalWarnMessage ? 'is-danger' : ''}
          ${
            textContent?.message
              ? 'modal-content is-success'
              : 'modal-content is-danger'
          }
        `}
      >
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
        </header>
        <section className="modal-card-body">
          <p className="is-size-6 has-text-white has-background-primary p-6">
            {textContent?.text}
          </p>
          {identicalWarnMessage && (
            <div className="modal-content is-warning">
              <p className="is-size-6 has-text-white has-background-primary p-6">
                Aucune modification détectée sur l'article.
              </p>
            </div>
          )}
          <footer>
            <button
              className="button"
              aria-label="accept button"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                closeModal();
              }}
            >
              OK
            </button>
          </footer>
        </section>
      </div>
    </div>
  );
}
