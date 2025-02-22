/* eslint-disable @next/next/no-html-link-for-pages */
import { auth0 } from "@/lib/auth0"

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
  
  return (
    <>
      You're logged in {session?.user.name}!
      <br />
      <a href="/auth/logout">
        <button>Log out</button>
      </a>
    </>
  );
}
