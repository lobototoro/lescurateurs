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
