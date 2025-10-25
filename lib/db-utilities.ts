'use server';
import sql from 'better-sqlite3';

// utility for db queries - serialization
const databaseName = process.env.NEXT_PUBLIC_DATABASE_NAME;
if (!databaseName) {
  throw new Error('Database name is not defined in environment variables.');
}
const db = sql(databaseName);

export const executeQuery = async <T = any>(
  queryName: string,
  query: string,
  type: 'get' | 'all' | 'run' = 'get',
  params?: Record<string, any> | string | number | bigint
): Promise<T> => {
  try {
    if (type === 'all') {
      if (typeof params === 'undefined') {
        return db.prepare(query).all() as T;
      }

      return db.prepare(query).all(params) as T;
    } else if (type === 'run') {
      return db.prepare(query).run(params) as T;
    }

    return db.prepare(query).get(params) as T;
  } catch (err) {
    console.error(`Error executing query: ${queryName}`, err);
    throw err;
  }
};
