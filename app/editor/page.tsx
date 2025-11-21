/**
 * Editor Login Page
 *
 * @packageDocumentation
 *
 * @remarks
 * This module exports the default async React Server Component `Login`.
 * It orchestrates authentication and user lookup, logs connections to Supabase,
 * and renders the editor form for authorized users or redirects unauthenticated
 * visitors to the login page.
 *
 * @example
 * // Route to this component
 * GET /editor -> Login()
 *
 */

/**
 * Login - Server component that renders the editor or redirects to authentication.
 *
 * @async
 * @returns {JSX.Element} The editor form for authenticated users, or a RedirectFragment to the login page.
 *
 * @throws {Error} If the authenticated user is not found in the database.
 *
 * @remarks
 * Execution flow:
 * 1. Retrieve the Auth0 session.
 * 2. If no valid session or missing email, return a redirect to the login page.
 * 3. Log the user connection timestamp (best-effort; failures are caught and logged).
 * 4. Fetch user credentials from Supabase and render the EditorForm with the user's role and permissions.
 *
 * @see {@link auth0} Authentication/session provider
 * @see {@link getUser} Supabase helper to fetch user credentials
 * @see {@link logConnection} Supabase helper to record connection timestamps
 * @see {@link EditorForm} Editor UI component
 * @see {@link RedirectFragment} Small component used to perform client redirects
 */
import { auth0 } from '@/lib/auth0';
import { getUser, logConnection } from '@/lib/supabase/users';

import { User } from '@/models/user';
import EditorForm from './components/editorForm';
import { RedirectFragment } from '../components/single-elements/redirectFragment';

// import Header from "./components/formComponents/headerNode";

export default async function Login() {
  const session = await auth0.getSession();

  if (!session || !session.user || !session.user.email) {
    return <RedirectFragment url="/auth/login?returnTo=/editor" />;
  }

  // NEX-49: Log user connection time
  try {
    await logConnection(session.user.email);
  } catch (error) {
    console.error('Error logging connection:', error);
  }

  const credentials = (await getUser(session.user.email)) as unknown as
    | User[]
    | null;
  if (!credentials || credentials.length === 0) {
    throw new Error('User not found in database');
  }

  const [user] = credentials;
  const { role, permissions } = user;

  return (
    <>
      {user && <EditorForm role={role} permissions={permissions} />}
      <br />
      <a href="/auth/logout">
        <button>Log out</button>
      </a>
    </>
  );
}
