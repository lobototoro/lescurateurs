'use server';
import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';

import {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
} from '@/lib/supabase/users';
import { User, UserRole } from '@/models/user';
import { Json } from '@/lib/supabase/database.types';

export async function createUserAction(preState: any, formData: FormData) {
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

    return {
      message: true,
      status: createUserStatus,
      text: 'L’utilisateur a été créé avec succès',
    };
  } catch (error) {
    console.log(error);

    return {
      message: false,
      text: 'Une erreur est survenue lors de la création de l’utilisateur',
    };
  }
}

export async function updateUserAction(preState: any, formData: FormData) {
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
    const updatedUserSatus = await updateUser(userCandidate as User);

    return {
      message: true,
      status: updatedUserSatus,
      text: 'L’utilisateur a été modifié avec succès',
    };
  } catch (error) {
    console.log(error);

    return {
      message: false,
      text: 'Une erreur est survenue lors de la modification de l’utilisateur',
    };
  }
}

export async function getUsersList() {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  try {
    const usersList = (await getAllUsers()) as unknown as User[];

    return {
      message: true,
      usersList,
    };
  } catch (error) {
    console.error('[!] while getting all users ', error);

    return {
      message: false,
      text: 'Une erreur est survenue lors de la récupération de la liste des  utilisateurs',
    };
  }
}

export async function deleteUserAction(preState: any, formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  const email = formData.get('email') as string;

  try {
    const deletedUserStatus = await deleteUser(email as string);

    return {
      message: true,
      status: deletedUserStatus,
      text: 'L’utilisateur a été supprimé avec succès',
    };
  } catch (error) {
    console.error('[!] while deleting new user');

    return {
      message: false,
      text: 'Une erreur est survenue lors de la suppression de l’utilisateur',
    };
  }
}
