'use server';
import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
} from '@/lib/supabase/users';
import { User, UserRole } from '@/models/user';
import { toActionState } from '@/lib/toastCallbacks';
import { ActionState, TSearchResponse } from '@/models/actionState';

/**
 * @packageDocumentation
 * Utilities for managing application users (server-actions).
 *
 * This module exposes server-side actions to create, update, list and delete users.
 * Each function expects a FormData payload and performs authentication checks using auth0.
 *
 * @remarks
 * These functions are intended to be used as server actions in a Next.js app
 * and will redirect to '/editor' when no valid session is present.
 */

/**
 * Create a new user in the system.
 *
 * This server action reads user data from the provided FormData and calls the
 * underlying createUser helper to persist the user in Supabase.
 *
 * @param preState - Current UI/preflight state passed by the caller (opaque).
 * @param formData - FormData containing user fields:
 *   - email: string
 *   - tiers_service_ident: string
 *   - role: UserRole
 *   - permissions: string
 *
 * @returns A promise that resolves to an object describing the result:
 *   message: string;
 *   status: number | Record<string, unknown> | undefined;
 *   isSuccess: boolean;
 *
 * @example
 * const result = await createUserAction(prevState, formData);
 *
 * @public
 */

/**
 * Update an existing user.
 *
 * Reads the user id and other updatable fields from FormData, attaches the
 * modifier information from the authenticated session, and invokes updateUser.
 *
 * @param preState - Current UI/preflight state passed by the caller (opaque).
 * @param formData - FormData containing user fields:
 *   - id: string (parsed to number)
 *   - email: string
 *   - tiers_service_ident: string
 *   - role: UserRole
 *   - permissions: string
 *
 * @returns A promise that resolves to an object describing the result:
 *   message: string;
 *   status: number | Record<string, unknown> | undefined;
 *   isSuccess: boolean;
 *
 * @public
 */

/**
 * Retrieve the complete list of users.
 *
 * Performs an authentication check and returns the list of users fetched via getAllUsers.
 *
 * @returns A promise that resolves to an object:
 *   - message: boolean (success flag)
 *   - usersList?: User[] (when successful)
 *   - text?: string (localized error message)
 *
 * @public
 */

/**
 * Delete a user by email.
 *
 * Reads the email from the provided FormData and delegates deletion to deleteUser.
 *
 * @param preState - Current UI/preflight state passed by the caller (opaque).
 * @param formData - FormData containing:
 *   - email: string
 *
 * @returns A promise that resolves to an object describing the result:
 *   message: string;
 *   status: number | Record<string, unknown> | undefined;
 *   isSuccess: boolean;
 *
 * @public
 */

/**
 * Generic manager for user-related form actions.
 *
 * Dispatches the incoming actionName to the proper action handler.
 * Supported actions: 'update', 'delete'.
 *
 * @param prevState - Current UI/preflight state passed by the caller (opaque).
 * @param formData - FormData containing at least:
 *   - actionName: string ('update' | 'delete' | other)
 *
 * @returns The result of the dispatched action, or an error object when the action is not recognized.
 *
 * @example
 * // Update:
 * formData.set('actionName', 'update');
 * const res = await manageUsers(prevState, formData);
 *
 * @public
 */

export async function createUserAction(
  _preState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  const userCandidate = {
    email: formData.get('email') as string,
    tiers_service_ident: formData.get('tiers_service_ident') as string,
    role: formData.get('role') as UserRole,
    permissions: formData.get('permissions') as string,
  };

  try {
    const createUserStatus = await createUser(userCandidate as User);

    revalidatePath('/editor');

    return toActionState(
      'L’utilisateur a été créé avec succès',
      createUserStatus,
      true
    );
  } catch (error) {
    console.error(error);

    return toActionState(
      'Une erreur est survenue lors de la création de l’utilisateur',
      undefined,
      false
    );
  }
}

export async function updateUserAction(
  _preState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  const userCandidate = {
    id: parseInt(formData.get('id') as string, 10) as number | bigint,
    email: formData.get('email') as string,
    tiers_service_ident: formData.get('tiers_service_ident') as string,
    role: formData.get('role') as UserRole,
    permissions: formData.get('permissions') as string,
    updated_by:
      session.user.nickname || session.user.email || ('Anon' as string),
  };

  try {
    const updatedUserStatus = await updateUser(userCandidate as User);

    revalidatePath('/editor');

    return toActionState(
      'L’utilisateur a été modifié avec succès',
      updatedUserStatus,
      true
    );
  } catch (error) {
    console.error(error);

    return toActionState(
      'Une erreur est survenue lors de la modification de l’utilisateur',
      undefined,
      false
    );
  }
}

export async function getUsersList(): Promise<TSearchResponse> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  try {
    const usersList = (await getAllUsers()) as unknown as User[];

    return {
      isSuccess: true,
      usersList,
    };
  } catch (error) {
    console.error('[!] while getting all users ', error);

    return {
      isSuccess: false,
      message:
        'Une erreur est survenue lors de la récupération de la liste des  utilisateurs',
    };
  }
}

export async function deleteUserAction(
  _preState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  const email = formData.get('email') as string;

  try {
    const deletedUserStatus = await deleteUser(email);

    revalidatePath('/editor');

    return toActionState(
      'L’utilisateur a été supprimé avec succès',
      deletedUserStatus,
      true
    );
  } catch (error) {
    console.error('[!] while deleting new user');

    return toActionState(
      'Une erreur est survenue lors de la suppression de l’utilisateur',
      undefined,
      false
    );
  }
}

export async function manageUsers(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const actionName = formData.get('actionName') as string;

  switch (actionName) {
    case 'update':
      return await updateUserAction(_prevState, formData);
    case 'delete':
      return await deleteUserAction(_prevState, formData);
    default:
      return toActionState(
        "Action d'utilisateur non reconnue",
        undefined,
        false
      );
  }
}
