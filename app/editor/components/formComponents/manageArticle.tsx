"use client";
import {
  JSX,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react'; 
import { deleteArticleAction, shipArticleAction, validateArticleAction } from "@/app/articleActions";
import NotificationsComponent from "@/app/components/single-elements/notificationsComponent";
import SearchArticle from "./searchArticle";
import ModalWithCTA from "@/app/components/single-elements/modalWithCTA";


const sendAction = (action: string, id: string | number, actionMethod: any, choice?: string) => {
  // console.info(`Action: ${action}, ID: ${id} and Method: ${actionMethod}`);
  startTransition(() => {
    const formData = new FormData();
    formData.append("id", String(id));
    if (action === "validate") {
      formData.append("validation", choice as string);
    }
    if (action === "ship") {
      formData.append("shipped", choice as string);
    }

    return actionMethod(formData);
    
    // console.info("method fired!", formData);
  });
}

export default function ManageArticleForm(): JSX.Element {
  const [deleteState, deleteAction, isDeletePending] = useActionState(deleteArticleAction, null);
  const [validateState, validateAction, isValidatePending] = useActionState(validateArticleAction, null);
  const [shipState, shipAction, isShipPending] = useActionState(shipArticleAction, null); // Assuming shipAction is defined elsewhere
  const [notification, setNotification] = useState<boolean>(false);
  const [action, setAction] = useState<Record<string, any>>({});
  const [modalInfos, setModalInfos] = useState<Record<string, any>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  const onclose = () => {
    if (modalRef.current) {
      modalRef.current.classList.remove("is-active");
    }
  };

  useEffect(() => {
    switch (action.actionName) {
      case "delete":
        setModalInfos({
          title: "Supprimer l'article",
          text: "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.",
          ctaText: "Supprimer",
          ctaAction: () => {
            sendAction("delete", action.id, deleteAction);
            onclose();
          },
          cancelAction: () => {
            setAction({});
            onclose();
          },
          cancelText: "Annuler",
          onClose: onclose,
        });
        modalRef.current?.classList.add("is-active");
        break;
      case "validate":
        setModalInfos({
          title: "Valider l'article",
          text: "Êtes-vous sûr de vouloir valider / invalider cet article ?",
          ctaText: "Valider",
          ctaAction: () => {
            sendAction("validate", action.id, validateAction, 'true');
            onclose();
          },
          cancelAction: () => {
            sendAction('validate', action.id, validateAction, 'false');
            onclose();
          },
          cancelText: "Invalider",
          onClose: onclose,
        });
        modalRef.current?.classList.add("is-active");
        break;
      case "ship":
        setModalInfos({
          title: "MEP de l'article",
          text: "Êtes-vous sûr de vouloir MEP cet article ?",
          ctaText: "ONLINE",
          ctaAction: () => {
            sendAction("ship", action.id, shipAction, 'true');
            onclose();
          },
          cancelAction: () => {
            sendAction('ship', action.id, shipAction, 'false');
            onclose();
          },
          cancelText: "OFFLINE",
          onClose: onclose,
        });
        modalRef.current?.classList.add("is-active");
        break;
      default:
        console.warn("Unknown action:", action.actionName);
        break;
    }
  }, [action]);

  useEffect(() => {
    let notifTimeout: NodeJS.Timeout | undefined;
    if (deleteState?.message || validateState?.message || shipState?.message) {
      setNotification(true);
      notifTimeout = setTimeout(() => {
        setNotification(false);
      }, 6000);
    }

    return () => {
      if (notifTimeout) {
        clearTimeout(notifTimeout);
      }
    };
  }, [deleteState, validateState, shipState]);
  
  return (
    <>
      <ModalWithCTA
        modalRef={modalRef as React.RefObject<HTMLDivElement>}
        title={modalInfos.title}
        description={modalInfos.text}
        ctaText={modalInfos.ctaText}
        ctaAction={modalInfos.ctaAction}
        cancelAction={modalInfos.cancelAction}
        cancelText={modalInfos.cancelText}
        onClose={modalInfos.onClose}
      />
      {notification && deleteState?.message && (
        <NotificationsComponent
          state={deleteState as { message: boolean; text: string }}
        />
      )}
      {notification && validateState?.message && (
        <NotificationsComponent
          state={validateState as { message: boolean; text: string }}
        />
      )}
      {notification && shipState?.message && (
        <NotificationsComponent
          state={shipState as { message: boolean; text: string }}
        />
      )}
      {!notification && (
        <>
          <SearchArticle target="manage" manageSelection={setAction} />
          <div className="is-flex is-justify-content-flex-end">
            <button
              className="button is-secondary is-size-6 has-text-white mt-6 mb-5"
              data-testid="back-to-search"
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
              }}
            >
              Retour à la recherche
            </button>
          </div>
        </>
      )}
    </>
  );
};