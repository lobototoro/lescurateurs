/**
 * Module documentation for the RedirectFragment component file.
 *
 * @packageDocumentation
 *
 * This module exposes a small React component that displays a "Redirecting..."
 * message and performs a client-side navigation to a provided URL after a short delay.
 *
 * @remarks
 * - The implementation relies on a client-only effect (useEffect) to perform the redirect.
 * - A timer is used to delay the navigation and it's cleared on unmount to avoid leaks.
 */

/**
 * RedirectFragment
 *
 * Renders a brief "Redirecting..." message and programmatically navigates the browser
 * to the provided URL after a short timeout.
 *
 * @remarks
 * - This component is intended for client-side use only.
 * - It uses window.location.href to perform the redirect.
 * - The internal timer is cleaned up in the effect cleanup function.
 *
 * @param props - Component properties.
 * @param props.url - The destination URL to navigate to. Example: "https://example.com"
 *
 * @example
 * <RedirectFragment url="https://example.com" />
 *
 * @public
 */
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export const RedirectFragment = ({ url }: { url: string }) => {
  const router = useRouter();
    
  // Validate URL to prevent open redirect attacks
  const isValidUrl = useMemo(() => {
    try {
      const parsedUrl = new URL(url, window.location.origin);
      
      // Allow only same-origin URLs or explicitly allowlisted domains
      return parsedUrl.origin === window.location.origin;
    } catch {
      return false;
    }
  }, [url]);
  
  useEffect(() => {
    if (!isValidUrl) {
      console.error('Invalid redirect URL:', url);
      
      return;
    }
  
    const timer = setTimeout(() => {
      
      // Use Next.js router for internal navigation
      router.push(url);
    }, 1000);
  
    return () => clearTimeout(timer);
  }, [url, isValidUrl, router]);
  
  if (!isValidUrl) {
    return (
      <div>
        <h1>Invalid redirect URL</h1>
        <p>The provided URL is not valid.</p>
      </div>
    );
  }
  
  return (
    <div role="status" aria-live="polite">
      <h1>Redirecting...</h1>
      <p>
        If you are not redirected automatically, follow this{' '}
        <a href={url}>link</a>.
      </p>
    </div>
  );
};
