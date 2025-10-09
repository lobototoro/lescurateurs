'use client';
import { useEffect } from 'react';

export const RedirectFragment = ({ url }: { url: string }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = url;
    }, 1000);

    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div>
      <h1>Redirecting...</h1>
      <p>
        If you are not redirected automatically, follow this{' '}
        <a href={url}>link</a>.
      </p>
    </div>
  );
};
