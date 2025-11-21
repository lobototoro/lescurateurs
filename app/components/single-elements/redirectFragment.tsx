/**
 * @packageDocumentation
 * Client-side redirection fragment for Next.js applications.
 *
 * @remarks
 * This module exports a React component that performs a delayed, client-side redirect
 * using the Next.js App Router. To mitigate open redirect attacks, the destination
 * URL is validated and must be same-origin with the current page.
 *
 * The component provides:
 * - A short delay before navigation for better UX and screen reader announcements.
 * - An accessible status region with a fallback link if automatic navigation fails.
 * - Clear error messaging when an invalid URL is supplied.
 *
 * @example
 * ```tsx
 * import { RedirectFragment } from './RedirectFragment';
 *
 * export default function Page() {
 *   return <RedirectFragment url="/dashboard" />;
 * }
 * ```
 *
 * @security
 * Only same-origin URLs are allowed. Cross-origin or malformed URLs will be rejected
 * and no navigation will occur.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing#linking-and-navigating
 * @see https://typedoc.org/
 * @since 1.0.0
 */

/**
 * Redirects to a validated, same-origin URL after a short delay while rendering an
 * accessible status message and a fallback link.
 *
 * @param props - Component properties.
 * @param props.url - Destination URL. Must share the same origin as the current page.
 * If invalid or cross-origin, the component displays an error and does not navigate.
 *
 * @returns A status UI indicating redirect progress, or an error message when the
 * provided URL is invalid.
 *
 * @example
 * ```tsx
 * // Navigate to an internal route
 * <RedirectFragment url="/settings/profile" />
 * ```
 *
 * @remarks
 * - Uses Next.js `useRouter().push` for internal navigation.
 * - Announces status changes via `aria-live="polite"` for assistive technologies.
 * - Includes a fallback anchor so users can manually navigate if needed.
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
