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
  // mutation for createdAt (date) to string 'yyyy-mm-dd'
  const permissions = JSON.stringify(user.permissions);
  const createdAt = new Date(user.createdAt).toISOString().slice(0, 10);
  const lastConnectionAt = new Date(user.lastConnectionAt)
    .toISOString()
    .slice(0, 10);
  const mutatedUser = {
    ...user,
    permissions,
    createdAt,
    lastConnectionAt,
    updatedAt: null,
    updatedBy: null,
  };

  return executeQuery(
    'create user',
    'INSERT INTO users (email, tiersServiceIdent, role, permissions, createdAt, lastConnectionAt, updatedAt, updatedBy) VALUES (@email, @tiersServiceIdent, @role, @permissions, @createdAt, @lastConnectionAt, @updatedAt, @updatedBy)',
    'run',
    mutatedUser
  );
};

export const updateUser = async (user: User) => {
  return executeQuery(
    'update user by id',
    `UPDATE users SET email = @email, tiersServiceIdent = @tiersServiceIdent, role = @role, permissions = @permissions, updatedAt = @updatedAt, updatedBy = @updatedBy WHERE id = @id`,
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
    'UPDATE users SET lastConnectionAt = @lastConnectionAt WHERE email = @email',
    'run',
    {
      lastConnectionAt: new Date().toISOString().slice(0, 10),
      email,
    }
  );
};
