import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

import { userSchema } from '@/models/userSchema';
import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';
import {
  updateUserAction,
  getUsersList,
  deleteUserAction,
} from '@/app/userActions';
import { PaginatedSearchDisplay } from '@/app/components/single-elements/paginatedSearchResults';
import {
  adminPermissions,
  contributorPermissions,
  UserRole,
  userRoles,
} from '@/models/user';
import UserPermissionsCheckboxes from '@/app/components/single-elements/userPermissions';
import { isEmpty } from '@/lib/utility-functions';
import ModalWithCTA from '@/app/components/single-elements/modalWithCTA';
import NotificationsComponent from '@/app/components/single-elements/notificationsComponent';
import { customResolver } from '../resolvers/customResolver';
import { custom } from 'zod/v3';

export default function ManageUserForm({
  scrollTopAction,
}: {
  scrollTopAction: () => void;
}) {
  const [state, updateAction, isPending] = useActionState(
    updateUserAction,
    null
  );
  const [secondState, deleteAction, isDeletePending] = useActionState(
    deleteUserAction,
    null
  );
  const [usersList, setUsersList] = useState<z.infer<typeof userSchema>[]>([]);
  const [selectedUser, setSelectedUser] = useState<z.infer<
    typeof userSchema
  > | null>(null);
  const [userRole, setUserRole] = useState<keyof typeof UserRole>(
    userRoles[1] as unknown as keyof typeof UserRole
  );
  const [notification, setNotification] = useState<boolean>(false);
  const [usertoBeDeleted, setUserToBeDeleted] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof userSchema>>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    resolver: customResolver(userSchema),
    defaultValues: {
      email: '',
      tiers_service_ident: '',
      role: 'contributor',
      created_at: new Date().toISOString(),
      last_connection_at: new Date().toISOString(),
      permissions: JSON.stringify(contributorPermissions),
    },
    values: selectedUser || undefined,
  });

  const performedAttheEnd = () => {
    setNotification(false);
    setSelectedUser(null);
    setUserToBeDeleted(null);
    setUsersList([]);
    startTransition(() => {
      fetchUsers();
    });
  };

  const getAllUsers = async () => {
    const usersListResponse = await getUsersList();
    if (usersListResponse.message) {
      const usersList = usersListResponse?.usersList as z.infer<
        typeof userSchema
      >[];

      return usersList;
    } else {
      console.error('[!] while fetching users list ', usersListResponse.text);

      return [];
    }
  };

  const setTimer = () => {
    return setTimeout(() => {
      performedAttheEnd();
    }, 6000);
  };

  const fetchUsers = async () => {
    const usersList = await getAllUsers();
    setUsersList(usersList);
  };

  useEffect(() => {
    //performed only once when page is first displayed
    fetchUsers();
  }, []);

  useEffect(() => {
    let notifTimeout: NodeJS.Timeout | undefined;
    if (state) {
      setNotification(true);
      scrollTopAction();
      notifTimeout = setTimer();
    }
    if (secondState) {
      setNotification(true);
      scrollTopAction();
      notifTimeout = setTimer();
    }

    return () => {
      if (notifTimeout) {
        clearTimeout(notifTimeout);
      }
    };
  }, [state, secondState]);

  const handleSelectedUser = (
    user: z.infer<typeof userSchema>,
    action: string
  ) => {
    if (user?.id !== undefined && action === 'update') {
      // test for a valid user
      setSelectedUser(user);
      setUserRole(user?.role as keyof typeof UserRole);
    }
    if (action === 'delete') {
      if (user?.email !== undefined) {
        // on affiche modale de confirmation
        setUserToBeDeleted(user?.email);
        modalRef.current?.classList.add('is-active');
      }
    }
  };

  const confirmDeletion = () => {
    if (usertoBeDeleted !== null) {
      startTransition(() => {
        const formData = new FormData();
        formData.append('email', usertoBeDeleted);
        deleteAction(formData);
        modalRef.current?.classList.remove('is-active');
      });
    }
  };

  const cancelDeletion = () => {
    setSelectedUser(null);
    if (modalRef.current) {
      modalRef.current.classList.remove('is-active');
    }
  };

  const onSubmit = (data: z.infer<typeof userSchema>) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append('id', data.id !== undefined ? String(data.id) : '');
      formData.append('email', data.email);
      formData.append('tiers_service_ident', data.tiers_service_ident);
      formData.append('role', data.role);
      formData.append('permissions', data.permissions);
      formData.append('created_at', data.created_at);
      formData.append('last_connection_at', data.last_connection_at);
      updateAction(formData);
    });
  };

  return (
    <section className="section">
      <ModalWithCTA
        modalRef={modalRef as React.RefObject<HTMLDivElement>}
        title="Confirmation de la suppression"
        description="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
        ctaText="Supprimer"
        ctaAction={confirmDeletion}
        cancelAction={cancelDeletion}
        cancelText="Annuler"
        onClose={cancelDeletion}
      />
      {notification && state && (
        <NotificationsComponent
          state={state as { message: boolean; text: string }}
        />
      )}
      {notification && secondState && (
        <NotificationsComponent
          state={secondState as { message: boolean; text: string }}
        />
      )}
      {usersList?.length > 0 && isEmpty(selectedUser) && (
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="fixed-grid">
              <div className="grid">
                <div className="cell mb-6">
                  <div className="field">
                    <label htmlFor="Email" className="mr-2">
                      Email:
                    </label>
                    <input
                      id="Email"
                      type="email"
                      className="input mt-4"
                      data-testid="email"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="has-text-danger">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div className="cell mb-6">
                  <div className="field">
                    <label htmlFor="tiersServiceIdent" className="mr-2 mb-4">
                      Identifiant Tiers Service:
                    </label>
                    <input
                      id="tiersServiceIdent"
                      type="text"
                      className="input mt-4"
                      data-testid="tiersServiceIdent"
                      {...register('tiers_service_ident', {
                        required: true,
                      })}
                    />
                    {errors.tiers_service_ident && (
                      <p className="has-text-danger">
                        {errors.tiers_service_ident.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="cell">
                  <div className="field is-flex is-align-items-center">
                    <label htmlFor="role" className="mr-4">
                      Rôle:
                    </label>
                    <div className="select">
                      <select
                        id="role"
                        data-testid="role"
                        {...register('role')}
                        onChange={(e) => {
                          setUserRole(e.target.value as keyof typeof UserRole);
                          if (e.target.value === 'admin') {
                            setValue(
                              'permissions',
                              JSON.stringify(adminPermissions)
                            );
                          }
                          if (e.target.value === 'contributor') {
                            setValue(
                              'permissions',
                              JSON.stringify(contributorPermissions)
                            );
                          }
                        }}
                        className="select"
                      >
                        {userRoles.map((role) => (
                          <option
                            key={role}
                            value={role}
                            className="text-sm has-text-white"
                          >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.role && (
                      <p className="has-text-danger">{errors.role.message}</p>
                    )}
                  </div>
                </div>
                <div className="cell">
                  {userRole && (
                    <UserPermissionsCheckboxes
                      role={[userRole] as unknown as UserRole[] | null}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="buttons is-flex is-flex-direction-row is-justify-content-space-between mt-6">
              <button
                role="button"
                data-testid="final-submit"
                type="submit"
                className={
                  isPending || isDeletePending
                    ? 'button is-primary is-size-6 has-text-white is-loading'
                    : 'button is-primary is-size-6 has-text-white'
                }
              >
                {isPending || isDeletePending
                  ? 'Chargement...'
                  : "Modifier l'utilisateur"}
              </button>
              <button
                className="button is-secondary is-size-6 has-text-white"
                data-testid="back-to-search"
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setSelectedUser(null);
                }}
              >
                Retour à la recherche
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
