"use client";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import LoginPage from './components/loginPage';

export default function Login() {
  return (
    <UserProvider>
      <LoginPage />
    </UserProvider>
  );
}
