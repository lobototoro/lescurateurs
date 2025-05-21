"use server";
import { auth0 } from "@/lib/auth0";
import { createUser, updateUser, getAllUsers, deleteUser } from '@/lib/users';
import { User } from "@/models/user";

export async function createUserAction(preState: any, formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return {
      message: false,
      text: 'You must be logged in to create an article'
    }
  }

  const userCandidate = {
    email: formData.get('email'),
    tiersServiceIdent: formData.get('tiersServiceIdent'),
    role: formData.get('role'),
    permissions: formData.get('permissions'),
    createdAt: formData.get('createdAt'),
    lastConnectionAt: formData.get('lastConnectionAt'),
  };

  let usererror;
  try {
    await createUser(userCandidate as User);
  } catch (error) {
    usererror = error;
  }
  if (usererror) {
    console.error('[!] while creating new user ', usererror);

    return {
      message: false,
      text: 'Une erreur est survenue lors de la création de l’utilisateur'
    }
  }

  return {
    message: true,
    text: 'L’utilisateur a été créé avec succès',
  }
}

export async function updateUserAction(preState: any, formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return {
      message: false,
      text: 'You must be logged in to create an article'
    }
  }

  const userCandidate = {
    email: formData.get('email'),
    tiersServiceIdent: formData.get('tiersServiceIdent'),
    role: formData.get('role'),
    permissions: JSON.stringify(formData.get('permissions')),
  };

  console.log('userCandidate', userCandidate);

  let usererror;
  try {
    await updateUser(userCandidate as User);
  } catch (error) {
    usererror = error;
  }
  if (usererror) {
    console.error('[!] while modifying new user ', usererror);

    return {
      message: false,
      text: 'Une erreur est survenue lors de la modification de l’utilisateur'
    }
  }

  return {
    message: true,
    text: 'L’utilisateur a été modifié avec succès',
  }
}

export async function getUsersList() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return {
      message: false,
      text: 'You must be logged in to create an article'
    }
  }

  try {
    const usersList = await getAllUsers() as unknown as User[];

    return {
      message: true,
      usersList,
    }
  } catch (error) {
    console.error('[!] while getting all users ', error);

    return {
      message: false,
      text: 'Une erreur est survenue lors de la récupération de la liste des  utilisateurs'
    }
  }
}

export async function deleteUserAction(preState: any, formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return {
      message: false,
      text: 'You must be logged in to create an article'
    }
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
      text: 'Une erreur est survenue lors de la suppression de l’utilisateur'
    }
  }

  return {
    message: true,
    text: 'L’utilisateur a été supprimé avec succès',
  }
}