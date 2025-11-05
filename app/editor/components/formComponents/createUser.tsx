import { startTransition, useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';
import UserPermissionsCheckboxes from '@/app/components/single-elements/userPermissions';
import {
  adminPermissions,
  contributorPermissions,
  UserRole,
  userRoles,
} from '@/models/user';
import { userSchema } from '@/models/userSchema';
import { createUserAction } from '@/app/userActions';
import { customResolver } from '@/app/editor/components/resolvers/customResolver';

export default function CreateUserForm({
  scrollTopAction,
}: {
  scrollTopAction: () => void;
}) {
  const [state, formAction, isPending] = useActionState(createUserAction, null);
  const [userRole, setUserRole] = useState<keyof typeof UserRole>(
    userRoles[1] as unknown as keyof typeof UserRole
  );
  const [notification, setNotification] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof userSchema>>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    resolver: customResolver(userSchema) as any,
    defaultValues: {
      email: '',
      tiers_service_ident: '',
      role: 'contributor',
      permissions: JSON.stringify(contributorPermissions),
    },
  });

  const onSubmit = (data: z.infer<typeof userSchema>) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('tiers_service_ident', data.tiers_service_ident);
      formData.append('role', data.role);
      formData.append('permissions', data.permissions);
      formAction(formData);
    });
  };

  register('permissions', { required: true });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        clearErrors(name);
      }
    });

    let notifTimeout: NodeJS.Timeout | undefined;
    if (state) {
      setNotification(true);
      scrollTopAction();
      reset();
      notifTimeout = setTimeout(() => {
        setNotification(false);
      }, 6000);
    }

    return () => {
      if (notifTimeout) {
        clearTimeout(notifTimeout);
      }

      subscription.unsubscribe();
    };
  }, [state, watch, clearErrors]);

  console.info('errors ', errors);

  return (
    <section className="section">
      {notification && (
        <div
          className={`notification ${state && state.message ? 'is-success' : 'is-danger'}`}
        >
          <p className="content">
            {state && state.message ? 'Succès' : 'Erreur'}:{' '}
            {state && state.text}
            <br />
            <span>Cette notification se fermera d'elle-même</span>
          </p>
        </div>
      )}
      <ArticleTitle
        text="Créer un utilisateur"
        level="h2"
        color="white"
        size="large"
        spacings="mb-6"
      />
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
                <UserPermissionsCheckboxes role={[userRole as UserRole]} />
              )}
            </div>
          </div>
        </div>

        <button
          role="button"
          data-testid="final-submit"
          type="submit"
          className={
            isPending
              ? 'button is-primary is-size-6 has-text-white mt-5 is-loading'
              : 'button is-primary is-size-6 has-text-white mt-5'
          }
        >
          {isPending ? 'Chargement...' : "Créer l'utilisateur"}
        </button>
      </form>
    </section>
  );
}
