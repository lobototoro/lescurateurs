"use server";

import sql from 'better-sqlite3';

import { User } from '../models/user';

const db = sql('lcfr.db');

export async function getUser(email: string) {
  return db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email);
}

export async function createUser(user: User) {
  // mutation for permissions (stringify)
  // mutation for createdAt (date) to string 'yyyy-mm-dd'
  const permissions = JSON.stringify(user.permissions);
  const createdAt = new Date(user.createdAt).toISOString().slice(0, 10);

  db.prepare(`
    INSERT INTO users (
      email,
      tiersServiceIdent,
      role,
      permissions,
      createdAt,
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      ?
    )`)
    .run(user.email, user.tiersServiceIdent, user.role, permissions, createdAt);
}

export async function updateUser(user: User) {
  // mutation for permissions (stringify)
  // mutation for createdAt (date) to string 'yyyy-mm-dd'
  const permissions = JSON.stringify(user.permissions);
  const createdAt = new Date(user.createdAt).toISOString().slice(0, 10);

  db.prepare(`
    UPDATE users
    SET
      email = ?,
      tiersServiceIdent = ?,
      role = ?,
      permissions = ?,
      createdAt = ?
    WHERE email = ?`)
    .run(user.email, user.tiersServiceIdent, user.role, permissions, createdAt, user.email);
}

export async function deleteUser(email: string) {
  db.prepare('DELETE FROM users WHERE email = ?')
    .run(email);
}

export async function getAllUsers() {
  return db
    .prepare('SELECT * FROM users')
    .all();
}
