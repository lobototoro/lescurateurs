"use client";

import { JSX, startTransition, useActionState, useEffect, useRef, useState } from "react";

import SearchArticle from "@/app/editor/components/formComponents/searchArticle";
import { deleteArticleAction } from "@/app/articleActions";

export default function DeleteArticleForm(): JSX.Element {
  const [state, formAction, isPending] = useActionState(deleteArticleAction, null);
  const [selectedId, setSelectedId] = useState<number | string>("");
  const [notification, setNotification] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedId) {
      // Perform the delete action here
      modalRef.current?.classList.add("is-active");
      
      // Call your delete function or API here
    }
    let notifTimeout: NodeJS.Timeout | undefined;
    if (state) {
      setNotification(state?.text);
      notifTimeout = setTimeout(() => {
        setNotification("");
      }
      , 6000);
    }

    return () => {
      if (notifTimeout) {
        clearTimeout(notifTimeout);
      }
    };
  }, [selectedId, state]);

  const handleDelete = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("id", String(selectedId));
      formAction(formData);
      setSelectedId("");
      closeDeleteModal();
    });
  };

  const closeDeleteModal = () => {
    if (modalRef.current) {
      modalRef.current.classList.remove("is-active");
    }
  };

  return (
    <>
      {notification && (
        <div className={`notification ${state?.message ? "is-success" : "is-danger"}`}>
          <p className="content">
            {notification}<br />
            <span>Cette notification se fermera d'elle-même</span>
          </p>
        </div>
      )}
      {!notification && <SearchArticle target="delete" setSelection={setSelectedId} />}
      <div className="modal" ref={modalRef} data-testid="delete-article-modal">
        <div className="modal-background" onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          closeDeleteModal()
        }}></div>
        <div className="modal-content">
          Voulez-vous vraiment supprimer cet article ?
          <div className="buttons">
            <button className="button is-danger" onClick={() => handleDelete()}>
              {isPending ? 'Chargement' : 'Supprimer'}
            </button>
            <button className="button" onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                setSelectedId("");
                closeDeleteModal();
              }}
              disabled={isPending}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </>
  );
};