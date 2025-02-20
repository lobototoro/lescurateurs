/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Header() {
  const { user } = useUser();

  return (
    <header>
      { user && (
        <>
          <a href="/api/auth/logout" title='logout'>
            Logout
          </a>
        </>
      ) }
    </header>
  );
}