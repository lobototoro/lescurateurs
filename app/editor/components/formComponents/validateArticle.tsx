"use client";

import { JSX, startTransition, useActionState, useEffect, useRef, useState } from "react";

import SearchArticle from "@/app/editor/components/formComponents/searchArticle";
import { validateArticleAction } from "@/app/articleActions";
import ModalWithCTA from "@/app/components/single-elements/modalWithCTA";

export default function ValidateArticleForm(): JSX.Element {
  const [state, formAction, isPending] = useActionState(validateArticleAction, null);
  const [selectedId, setSelectedId] = useState<number | string>("");
  const [notification, setNotification] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedId) {
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

  const handleValidate = (validation: string) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("id", String(selectedId));
      formData.append("validation", validation);
      formAction(formData);
      setSelectedId("");
      closeDeleteModal();
    });
  };

  const closeDeleteModal = () => {
    setSelectedId('');
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
      <ModalWithCTA
        modalRef={modalRef as React.RefObject<HTMLDivElement>}
        title="Validation de l'article"
        description="Voulez-vous vraiment valider cet article ?"
        ctaText="Valider"
        ctaAction={() => handleValidate('true')}
        cancelAction={() => handleValidate('false')}
        cancelText="Invalider"
        onClose={() => {
          closeDeleteModal();
        }}
      />
    </>
  );
};