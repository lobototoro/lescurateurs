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
