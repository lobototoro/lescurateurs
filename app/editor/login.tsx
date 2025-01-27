import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function Login() {
  return (
    <UserProvider>
      <h1>login</h1>
    </UserProvider>
  );
}
