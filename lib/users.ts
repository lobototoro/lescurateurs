'use server';
import { cache } from 'react';
import sql from 'better-sqlite3';

import { User } from '@/models/user';

const db = sql('lcfr.db');

export const getUser = cache(async (email: string) => {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
});

export const createUser = cache(async (user: User) => {
  // mutation for permissions (stringify)
  // mutation for createdAt (date) to string 'yyyy-mm-dd'
  const permissions = JSON.stringify(user.permissions);
  const createdAt = new Date(user.createdAt).toISOString().slice(0, 10);
  const lastConnectionAt = new Date(user.lastConnectionAt)
    .toISOString()
    .slice(0, 10);

  db.prepare(
    `
    INSERT INTO users (
      email,
      tiersServiceIdent,
      role,
      permissions,
      createdAt,
      lastConnectionAt,
      updatedAt,
      updatedBy
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )`
  ).run(
    user.email,
    user.tiersServiceIdent,
    user.role,
    permissions,
    createdAt,
    lastConnectionAt,
    null,
    null
  );
});

export const updateUser = cache(async (user: User) => {
  db.prepare(
    `UPDATE users SET email = @email, tiersServiceIdent = @tiersServiceIdent, role = @role, permissions = @permissions, updatedAt = @updatedAt, updatedBy = @updatedBy WHERE id = @id`
  ).run(user);
});

export const deleteUser = cache(async (email: string) => {
  db.prepare('DELETE FROM users WHERE email = ?').run(email);
});

export const getAllUsers = cache(async () => {
  return db.prepare('SELECT * FROM users').all();
});

export const logConnection = cache(async (email: string) => {
  const lastConnectionAt = new Date().toISOString().slice(0, 10);
  db.prepare(`UPDATE users SET lastConnectionAt = ? WHERE email = ?`).run(
    lastConnectionAt,
    email
  );
});
