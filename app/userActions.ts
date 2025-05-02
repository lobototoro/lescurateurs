"use server";
import { auth0 } from "@/lib/auth0";
import { createUser, updateUser } from '@/lib/users';
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
    permissions: formData.get('permissions')
  };

  let usererror;
  try {
    await updateUser(userCandidate as User);
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