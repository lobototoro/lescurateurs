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
          ${textContent?.message
              ? 'modal-content is-success'
              : 'modal-content is-danger'}
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