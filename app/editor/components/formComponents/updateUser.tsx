import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { userSchema } from '@/models/userSchema';
import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';
import { updateUserAction, getUsersList, deleteUserAction } from '@/app/userActions';
import { PaginatedSearchDisplay } from '@/app/components/single-elements/paginatedSearchResults';
import {
  adminPermissions,
  contributorPermissions,
  UserRole,
  userRoles,
} from '@/models/user';
import ModalComponent from '@/app/components/single-elements/modalComponent';

export default function UpdateUserForm() {
  const [state, updateAction, isPending] = useActionState(updateUserAction, null);
  const [secondState, deleteAction, isDeletePending] = useActionState(deleteUserAction, null);
  const [usersList, setUsersList] = useState<z.infer<typeof userSchema>[]>([]);
  const [selectedUser, setSelectedUser] = useState<z.infer<typeof userSchema> | null>(null);
  const [notification, setNotification] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    formState: { errors }
  } = useForm<z.infer<typeof userSchema>>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      tiersServiceIdent: '',
      role: 'contributor',
      createdAt: new Date().toISOString(),
      lastConnectionAt: new Date().toISOString(),
      permissions: JSON.stringify(contributorPermissions),
    },
    values: selectedUser || undefined
  });

  const getAllUsers = async () => {
    const usersListResponse = await getUsersList();
    if (usersListResponse.message) {
      const usersList = usersListResponse?.usersList as z.infer<typeof userSchema>[];

      return usersList;
    } else {
      console.error('[!] while fetching users list ', usersListResponse.text);
      
      return [];
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await getAllUsers() as z.infer<typeof userSchema>[];
      if (usersList?.length > 0) {
        setUsersList(usersList);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectedUser = (user: z.infer<typeof userSchema>, action: string) => {
    console.info('Selected user: ', action, user);
    if (user?.id !== undefined && action === 'update') { // test for a valid user
      setSelectedUser(user);
    }
    if (action === 'delete') {
      if (user?.email !== undefined) {
        // on affiche modale de confirmation
        modalRef.current?.classList.add('is-active');
        setNotification('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
        
        // startTransition(() => {
        //   const formData = new FormData();
        //   formData.append('email', user.email);
        //   deleteAction(formData);
        // });
      }
    }

  }

  return (
    <section className="section">
      <ModalComponent
        formSentModal={modalRef as React.RefObject<HTMLDivElement>}
        closeModal={() => {
          setNotification('');
          
          // reset();
        }}
        title="Confirmation de la suppression"
        identicalWarnMessage={false}
        textContent={secondState}
      />
      {notification && (
        <div
          className={`notification ${state && state.message ? 'is-success' : 'is-danger'} ${secondState && secondState.message ? 'is-success' : 'is-danger'}`}
        >
          <p className="content">
            {state && state.message ? 'Succès' : 'Erreur'}:{' '}
            {state && state.text}
            {secondState && secondState.message ? 'Succès' : 'Erreur'}:{' '}
            {secondState && secondState.text}
            <br />
            <span>Cette notification se fermera d'elle-même</span>
          </p>
        </div>
      )}
      {usersList?.length > 0 && (
        <div className="box">
          <ArticleTitle
            text="Sélectionnez un utilisateur"
            level="h2"
            size="large"
            color="black"
            spacings="mt-5 mb-5"
          />
          <PaginatedSearchDisplay
            itemList={usersList}
            defaultPage={1}
            defaultLimit={10}
            target="user"
            context="user"
            handleSelectedUser={handleSelectedUser}
          />
        </div>
      )}
      {selectedUser && (
        <div className="box">
          <form></form>
        </div>
      )}
    </section>
  );
};
