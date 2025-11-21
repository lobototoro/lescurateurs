/**
 * ManageArticleForm module
 *
 * This module provides a React server/client component used to manage articles
 * from the admin/editor UI. It wraps a search helper, notification display and
 * a modal confirmation flow for destructive or state-changing actions such as
 * delete, validate and ship (publish).
 *
 * The component uses a server action (manageArticleActions) via useActionState
 * and exposes a small, isolated helper `sendAction` to build the FormData and
 * submit the action in a transition.
 *
 * @packageDocumentation
 */

/**
 * Sends an action to the server action handler using FormData.
 *
 * This helper is intentionally isolated so that validation and shipping can
 * be submitted from different UI paths while sharing the same submission
 * logic. The call is performed inside startTransition to avoid blocking the
 * immediate UI thread during the action.
 *
 * @internal
 *
 * @param action - The name of the action to perform (e.g. "delete", "validate", "ship").
 * @param id - The target article id, will be stringified and appended to the FormData.
 * @param actionMethod - The action method returned from server actions (used as a form submitter).
 * @param choice - Optional extra choice string (e.g. "true" or "false") used for validate/ship.
 *
 * @example
 * sendAction('delete', 123, manageArticle);
 * sendAction('validate', 'abc', manageArticle, 'true');
 */

/**
 * ManageArticleForm React component
 *
 * Renders:
 *  - ModalWithCTA: confirmation modal used for delete/validate/ship flows.
 *  - NotificationsComponent: displays server-side notifications returned by actions.
 *  - SearchArticle: a search UI that can provide a selected item to `manageSelection`.
 *  - A "Retour à la recherche" button to reset the search state.
 *
 * The component orchestrates the modal information state and the action execution.
 *
 * @public
 *
 * @param props - Component props.
 * @param props.scrollTopAction - Callback invoked by notifications to scroll the page to top.
 *
 * @returns React.ReactElement - The managed article UI for admin/editor workflows.
 *
 * @remarks
 * The component relies on useActionState to call server actions and receives
 * an action state object which is forwarded to NotificationsComponent.
 *
 * TODO:
 * - Improve the actionName guard used in the useEffect (currently a small dirty fix).
 *
 * @example
 * <ManageArticleForm scrollTopAction={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
 */
'use client';
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';

import { manageArticleActions } from '@/app/articleActions';
import NotificationsComponent from '@/app/components/single-elements/notificationsComponent';
import SearchArticle from './searchArticle';
import ModalWithCTA from '@/app/components/single-elements/modalWithCTA';

// isolated submit for validation and shipping
const sendAction = (
  action: string,
  id: string | number,
  actionMethod: any,
  choice?: string
) => {
  startTransition(() => {
    const formData = new FormData();
    formData.append('actionName', action);
    formData.append('id', String(id));
    if (action === 'validate') {
      formData.append('validation', choice as string);
    }
    if (action === 'ship') {
      formData.append('shipped', choice as string);
    }

    return actionMethod(formData);
  });
};

export default function ManageArticleForm({
  scrollTopAction,
}: {
  scrollTopAction: () => void;
}): React.ReactElement {
  const [state, manageArticle, isPending] = useActionState(
    manageArticleActions,
    null
  );
  const [action, setAction] = useState<Record<string, any>>({});
  const [modalInfos, setModalInfos] = useState<Record<string, any>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const [cancelSearchDisplay, setCancelSearchDisplay] =
    useState<boolean>(false);

  // close action on modal
  const onclose = () => {
    if (modalRef.current) {
      modalRef.current.classList.remove('is-active');
    }
  };

  // general switch taht fills the infos for the modal
  const handleAction = (action: Record<string, any>) => {
    switch (action.actionName) {
      case 'delete':
        setModalInfos({
          title: "Supprimer l'article",
          text: 'Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.',
          ctaText: 'Supprimer',
          ctaAction: () => {
            sendAction('delete', action.id, manageArticle);
            onclose();
          },
          cancelAction: () => {
            setAction({});
            onclose();
          },
          cancelText: 'Annuler',
          onClose: onclose,
        });

        modalRef.current?.classList.add('is-active');
        break;
      case 'validate':
        setModalInfos({
          title: "Valider l'article",
          text: 'Êtes-vous sûr de vouloir valider / invalider cet article ?',
          ctaText: 'Valider',
          ctaAction: () => {
            sendAction('validate', action.id, manageArticle, 'true');
            onclose();
          },
          cancelAction: () => {
            sendAction('validate', action.id, manageArticle, 'false');
            onclose();
          },
          cancelText: 'Invalider',
          onClose: onclose,
        });

        modalRef.current?.classList.add('is-active');
        break;
      case 'ship':
        setModalInfos({
          title: "MEP de l'article",
          text: 'Êtes-vous sûr de vouloir MEP cet article ?',
          ctaText: 'ONLINE',
          ctaAction: () => {
            sendAction('ship', action.id, manageArticle, 'true');
            onclose();
          },
          cancelAction: () => {
            sendAction('ship', action.id, manageArticle, 'false');
            onclose();
          },
          cancelText: 'OFFLINE',
          onClose: onclose,
        });

        modalRef.current?.classList.add('is-active');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // securing action name: dirty fix for a bug, TODO: implement a proper solution
    if (action?.actionName === undefined) {
      return;
    } else {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      handleAction(action);
    }
  }, [action]);

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
        isPending={isPending}
      />
      {state && (
        <NotificationsComponent
          notificationAction={state as { message: boolean; text: string }}
          performClosingActions={() => {}}
          toTop={scrollTopAction}
        />
      )}
      <SearchArticle
        target="manage"
        cancelSearchDisplay={cancelSearchDisplay}
        manageSelection={setAction}
      />
      <div className="is-flex is-justify-content-flex-end">
        <button
          className="button is-secondary is-size-6 has-text-white mt-2 mb-2"
          data-testid="back-to-search"
          onClick={(event: React.MouseEvent) => {
            event.preventDefault();

            // probably flush states from all useActionState methods
            // setNotification(false);
            setCancelSearchDisplay(true);
          }}
        >
          Retour à la recherche
        </button>
      </div>
    </>
  );
}
