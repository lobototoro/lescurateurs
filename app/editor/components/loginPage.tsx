import { useUser } from '@auth0/nextjs-auth0/client';

// import Link from 'next/link';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  if (!isLoading && user) {
    router.push('/editor/profile');

    return;
  }

  return (
    <section>
      <a href='api/auth/login'>
        Log In
      </a>
    </section>
  );
}