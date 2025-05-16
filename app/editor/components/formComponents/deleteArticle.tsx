"use client";

import { JSX, startTransition, useActionState, useEffect, useRef, useState } from "react";

import SearchArticle from "@/app/editor/components/formComponents/searchArticle";
import { deleteArticleAction } from "@/app/articleActions";
import ModalWithCTA from "@/app/components/single-elements/modalWithCTA";
import NotificationsComponent from "@/app/components/single-elements/notificationsComponent";

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
      handleCancel();
    });
  };

  const handleCancel = () => {
    setSelectedId('');
    if (modalRef.current) {
      modalRef.current.classList.remove("is-active");
    }
  };

  return (
    <>
      {notification && <NotificationsComponent notification={notification} state={state as { message: boolean, text: string }} />}
      {!notification && (
        <SearchArticle target="delete" setSelection={setSelectedId} />
      )}
      <ModalWithCTA
        modalRef={modalRef as React.RefObject<HTMLDivElement>}
        title="Supprimer un article"
        description="Voulez-vous vraiment supprimer cet article ?"
        ctaText={isPending ? 'Chargement' : 'Supprimer'}
        ctaAction={handleDelete}
        cancelAction={handleCancel}
        cancelText="Annuler"
        onClose={handleCancel}
      />
    </>
  );
};