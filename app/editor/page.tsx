import { auth0 } from '@/lib/auth0';
import { getUser, logConnection } from '@/lib/users';
import { User } from '@/models/user';
import EditorForm from './components/editorForm';
import { RedirectFragment } from '../components/single-elements/redirectFragment';

// import Header from "./components/formComponents/headerNode";

export default async function Login() {
  const session = await auth0.getSession();

  if (!session || !session.user || !session.user.email) {
    return <RedirectFragment url="/auth/login" />;
  }

  // NEX-49: Log user connection time
  try {
    await logConnection(session.user.email);
  } catch (error) {
    console.error('Error logging connection:', error);
    return <RedirectFragment url="/auth/login" />;
  }

  const credentials = (await getUser(session.user.email)) as User;
  if (!credentials) {
    throw new Error('User not found in database');
  }

  return (
    <>
      {/* <Header
        role={credentials.role}
        permissions={credentials.permissions}
      /> */}
      {session && credentials && (
        <EditorForm
          role={credentials.role}
          permissions={credentials.permissions}
        />
      )}
      <br />
      <a href="/auth/logout">
        <button>Log out</button>
      </a>
    </>
  );
}
