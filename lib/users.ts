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
    'get user by email',
    'SELECT * FROM users WHERE email = ?',
    'get',
    mutatedUser
  );
};

export const updateUser = async (user: User) => {
  return executeQuery(
    'get user by id',
    'SELECT * FROM users WHERE id = ?',
    'get',
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
    'UPDATE users SET lastConnectionAt = ? WHERE email = ?',
    'run',
    email
  );
};
