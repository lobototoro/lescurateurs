'use server';
import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { createUser, updateUser, getAllUsers, deleteUser } from '@/lib/users';
import { User } from '@/models/user';

export async function createUserAction(preState: any, formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  const userCandidate = {
    email: formData.get('email'),
    tiers_service_ident: formData.get('tiers_service_ident'),
    role: formData.get('role'),
    permissions: formData.get('permissions'),
    created_at: formData.get('created_at'),
    last_connection_at: formData.get('last_connection_at'),
  };

  let usererror;
  try {
    await createUser(userCandidate as User);

    return {
      message: true,
      text: 'L’utilisateur a été créé avec succès',
    };
  } catch (error) {
    usererror = error;
  }
  if (usererror) {
    console.error('[!] while creating new user ', usererror);

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
    id: parseInt(formData.get('id') as string, 10),
    email: formData.get('email'),
    tiers_service_ident: formData.get('tiers_service_ident'),
    role: formData.get('role'),
    permissions: formData.get('permissions'),
    updated_at: new Date().toISOString().slice(0, 10),
    updated_by: session.user.email ?? '',
  };

  let usererror;
  try {
    await updateUser(userCandidate as User);

    return {
      message: true,
      text: 'L’utilisateur a été modifié avec succès',
    };
  } catch (error) {
    usererror = error;
  }
  if (usererror) {
    console.error('[!] while modifying new user ', usererror.toString());

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

  const email = formData.get('email');

  let usererror;
  try {
    await deleteUser(email as string);
  } catch (error) {
    usererror = error;
  }
  if (usererror) {
    console.error('[!] while deleting new user ', usererror);

    return {
      message: false,
      text: 'Une erreur est survenue lors de la suppression de l’utilisateur',
    };
  }

  return {
    message: true,
    text: 'L’utilisateur a été supprimé avec succès',
  };
}
