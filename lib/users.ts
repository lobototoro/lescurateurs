'use server';

import { User } from '@/models/user';

import { executeQuery } from './db-utilities';

export const getUser = async (email: string) => {
  return executeQuery(
    'get user by email',
    'SELECT * FROM users WHERE email = ?',
    'get',
    email
  );
};

export const createUser = async (user: User) => {
  // mutation for permissions (stringify)
  // mutation for created_at (date) to string 'yyyy-mm-dd'
  const permissions = JSON.stringify(user.permissions);
  const created_at = new Date(user.created_at).toISOString().slice(0, 10);
  const last_connection_at = new Date(user.last_connection_at)
    .toISOString()
    .slice(0, 10);
  const mutatedUser = {
    ...user,
    permissions,
    created_at,
    last_connection_at,
    updated_at: null,
    updated_by: null,
  };

  return executeQuery(
    'create user',
    'INSERT INTO users (email, tiersServiceIdent, role, permissions, created_at, last_connection_at, updated_at, updated_by) VALUES (@email, @tiersServiceIdent, @role, @permissions, @created_at, @last_connection_at, @updated_at, @updated_by)',
    'run',
    mutatedUser
  );
};

export const updateUser = async (user: User) => {
  return executeQuery(
    'update user by id',
    `UPDATE users SET email = @email, tiersServiceIdent = @tiersServiceIdent, role = @role, permissions = @permissions, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id`,
    'run',
    user
  );
};

export const deleteUser = async (email: string) => {
  return executeQuery(
    'delete user by email',
    'DELETE FROM users WHERE email = ?',
    'run',
    email
  );
};

export const getAllUsers = async () => {
  return executeQuery('get all users', 'SELECT * FROM users', 'all');
};

export const logConnection = async (email: string) => {
  return executeQuery(
    'log user connection',
    'UPDATE users SET last_connection_at = @last_connection_at WHERE email = @email',
    'run',
    {
      last_connection_at: new Date().toISOString().slice(0, 10),
      email,
    }
  );
};
