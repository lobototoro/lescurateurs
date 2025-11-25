import { startTransition, useActionState, useState } from 'react';
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
import { withCallbacks, toastCallbacks } from '@/lib/toastCallbacks';

/**
 * @packageDocumentation
 * @module CreateUserForm
 *
 * This module exports the default React component CreateUserForm which is used
 * to render a form for creating new users in the administration UI.
 *
 * The form integrates:
 * - react-hook-form for form state management,
 * - a Zod schema resolver for runtime validation,
 * - a server action (createUserAction) to submit the form,
 * - role-driven default permissions that are serialized to JSON and submitted.
 *
 * @remarks
 * The component ensures responsiveness by using startTransition for the submit
 * action. Notifications displayed after form submission invoke a scroll-to-top
 * action provided via props.
 *
 * @example
 * <CreateUserForm scrollTopAction={() => window.scrollTo(0, 0)} />
 *
 * @see {@link createUserAction}
 */

/**
 * Props for CreateUserForm component.
 *
 * @public
 * @typedef {Object} CreateUserFormProps
 * @property {() => void} scrollTopAction - Callback invoked when notifications
 *   request scrolling the view to the top (typically after a submission).
 */

/**
 * CreateUserForm
 *
 * Renders a user creation form including fields for:
 * - email
 * - tiers service identifier
 * - role selection (with automatic permission defaults)
 * - permission checkboxes (rendered by UserPermissionsCheckboxes)
 *
 * Validation and type safety are provided by a Zod schema wired to
 * react-hook-form through a custom resolver.
 *
 * @public
 * @function CreateUserForm
 * @param {CreateUserFormProps} props - Component props.
 * @returns {JSX.Element} The rendered create-user form section.
 *
 * @remarks
 * Implementation details:
 * - The permissions field is registered as a hidden form value and updated
 *   whenever the role selector changes. Permission objects are serialized to JSON
 *   before being appended to the FormData sent to the server.
 * - The submit handler wraps the server action call in startTransition to avoid
 *   blocking urgent UI updates.
 *
 * @example
 * // Render the component in a parent page
 * <CreateUserForm scrollTopAction={() => window.scrollTo(0, 0)} />
 */

export default function CreateUserForm({
  scrollTopAction,
}: {
  scrollTopAction: () => void;
}) {
  const [userRole, setUserRole] = useState<keyof typeof UserRole>(
    userRoles[1] as unknown as keyof typeof UserRole
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
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

  const performingAfter = () => {
    scrollTopAction();
    reset();
  };

  const [, formAction, isPending] = useActionState(
    withCallbacks(createUserAction, toastCallbacks, performingAfter),
    null
  );

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

  return (
    <section className="section">
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
                <UserPermissionsCheckboxes role={userRole as UserRole} />
              )}
            </div>
          </div>
        </div>

        <button
          role="button"
          data-testid="final-submit"
          type="submit"
          disabled={isPending}
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
