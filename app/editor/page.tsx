/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { useUser } from "@auth0/nextjs-auth0/client";

import Profile from './profile';
import Header from './components/header';

export default function Login() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) {
    return (
      <>
        <a href="/api/auth/login?returnTo=/editor">
          <button>Log in</button>
        </a>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <Profile />
    </>
  );
}
