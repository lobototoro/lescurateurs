'use server';

import { createClient } from './back-office.client';

import { User } from '@/models/user';

/**
 * Back-office Users data-access layer powered by Supabase.
 *
 * @packageDocumentation
 * @module UsersActions
 *
 * This server-only module exposes CRUD operations and utility actions for the
 * `users-development` table. Each action communicates with Supabase and throws
 * a descriptive error when an operation fails.
 *
 * Exported actions:
 * - getAllUsers: Fetch all users.
 * - getUser: Fetch a user by email.
 * - createUser: Insert a new user.
 * - updateUser: Update an existing user by ID.
 * - deleteUser: Delete a user by email.
 * - logConnection: Update the last connection timestamp for a user.
 *
 * @remarks
 * - These functions are intended to run on the server and rely on a Supabase client.
 * - Error handling is standardized: failures throw `Error` with a human-readable message.
 * - Some functions return Supabase status codes; others return data arrays as provided by Supabase.
 *
 * @see createClient for Supabase initialization
 * @see User for the user model
 *
 * @example
 * ```ts
 * import { getUser, createUser, logConnection } from './back-office.users.actions';
 *
 * // Get a user
 * const data = await getUser('jane.doe@example.com');
 * const user = data?.[0];
 *
 * // Create a user
 * await createUser({
 *   id: 'uuid',
 *   email: 'john.doe@example.com',
 *   role: 'admin',
 *   permissions: ['read', 'write'],
 *   tiers_service_ident: 'service-123',
 *   created_at: undefined as any, // server-populated
 *   updated_at: null,
 *   updated_by: null,
 *   last_connection_at: undefined as any // server-populated
 * });
 *
 * // Log connection
 * await logConnection('john.doe@example.com');
 * ```
 */

const supabase = createClient();

const usersDb = `users-development`;

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
  const created_at = new Date();
  const last_connection_at = new Date();

  const insertedUser = {
    ...user,
    created_at,
    last_connection_at,
    updated_at: null,
    updated_by: null,
  };

  const { error, status } = await supabase
    .from(usersDb)
    .insert(insertedUser)
    .select();

  if (error) {
    throw new Error('Users: could not create user');
  }

  return status;
};

// update items in tables actions
export const updateUser = async (user: User) => {
  const { id, tiers_service_ident, role, permissions, updated_by } = user;
  const { error, status } = await supabase
    .from(usersDb)
    .update({
      tiers_service_ident,
      role,
      permissions,
      updated_at: new Date(),
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
