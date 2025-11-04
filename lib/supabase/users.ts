'use server';

// import { createClient } from './client';
import { createClient } from './back-office.client';

import { User } from '@/models/user';
import { Json } from './database.types';

// const supabaseFront = createClient();
const supabase = createClient();
const usersDb = `users-${process.env.NODE_ENV}`;

// fetch in tables actions
export const getAllUsers = async () => {
  const { data, error } = await supabase.from(usersDb).select();

  if (error) {
    throw new Error('Users: could not retrieve users list');
  }

  return data;
};

export const getUser = async (email: string) => {
  try {
    const { data } = await supabase.from(usersDb).select().eq('email', email);
    // response is an array of object, even if there's one item

    return data;
  } catch (err) {
    throw new Error('Users: could not find the user');
  }
};

// create items in tables actions
export const createUser = async (user: User) => {
  const permissions = user.permissions as Json;
  const created_at = new Date();
  const last_connection_at = new Date();

  const mutatedUser = {
    ...user,
    permissions,
    created_at,
    last_connection_at,
    updated_at: null,
    updated_by: null,
  };
  const { error, status } = await supabase
    .from(usersDb)
    .insert(mutatedUser)
    .select();

  if (error) {
    throw new Error('Users: could not create user');
  }

  return status;
};

// update items in tables actions
export const updateUser = async (user: User) => {
  const { id, tiers_service_ident, role, permissions, updated_at, updated_by } =
    user;
  const { error, status } = await supabase
    .from(usersDb)
    .update({
      tiers_service_ident,
      role,
      permissions,
      updated_at,
      updated_by,
    })
    .eq('id', id);

  if (error) {
    throw new Error('Users: could not update user');
  }

  return status;
};

// delete items in tables actions
export const deleteUser = async (email: string) => {
  const { error, status } = await supabase
    .from(usersDb)
    .delete()
    .eq('email', email);

  if (error) {
    throw new Error('Users: could not delete user');
  }

  return status;
};

export const logConnection = async (email: string) => {
  const last_connection_at = new Date();
  const { error, status } = await supabase
    .from(usersDb)
    .update({
      last_connection_at,
    })
    .eq('email', email);

  if (error) {
    throw new Error('Users: could not log last connection for user');
  }

  return status;
};
