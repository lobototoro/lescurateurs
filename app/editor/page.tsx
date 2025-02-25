/* eslint-disable @next/next/no-html-link-for-pages */
import { auth0 } from "@/lib/auth0"
import { getUser } from "@/lib/users";
import { User } from "@/models/user";
import Header from "./components/header";

export default async function Login() {
  const session = await auth0.getSession()

  if (!session) {
    return (
      <>
        <a href="/auth/login?returnTo=/editor">
          <button>Log in</button>
        </a>
      </>
    );
  }

  const credentials = await getUser(session?.user.email as string) as User;

  return (
    <>
      <Header
        role={credentials.role}
        permissions={credentials.permissions}
      />
      <br />
      <a href="/auth/logout">
        <button>Log out</button>
      </a>
    </>
  );
}
