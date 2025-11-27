/**
 * @file redirectFragment.test.tsx
 * @description Comprehensive unit tests for RedirectFragment component
 */

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RedirectFragment } from '@/app/components/single-elements/redirectFragment';

// Mock Next.js router
const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

describe('RedirectFragment', () => {
  let originalLocation: Location;
  let originalConsoleError: typeof console.error;
  let defaultMockLocation: Location; // Store the default mock location object created in beforeEach

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Store the original window.location and console.error before mocking
    originalLocation = window.location;
    originalConsoleError = console.error;

    // Define a comprehensive mock Location object for default tests
    defaultMockLocation = {
      href: 'http://localhost:3000/current-page',
      origin: 'http://localhost:3000',
      protocol: 'http:',
      host: 'localhost:3000',
      hostname: 'localhost',
      port: '3000',
      pathname: '/current-page',
      search: '',
      hash: '',
      assign: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn(),
      ancestorOrigins: originalLocation.ancestorOrigins, // Keep original ancestorOrigins or mock as needed
      toString: () => 'http://localhost:3000/current-page',
    } as Location; // Cast the mock object to Location

    // Mock window.location using Object.defineProperty for reliable testing of read-only properties
    Object.defineProperty(window, 'location', {
      configurable: true, // Allows redefining the property
      enumerable: true,
      value: defaultMockLocation,
    });

    // Mock console.error
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();

    // Restore original window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: originalLocation,
    });

    // Restore original console.error
    console.error = originalConsoleError;
    vi.clearAllMocks();
  });

  describe('Valid URL Redirection', () => {
    it('should render redirecting message for valid same-origin URL', () => {
      render(<RedirectFragment url="/dashboard" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Redirecting...')).toBeInTheDocument();
      expect(
        screen.getByText(/If you are not redirected automatically/)
      ).toBeInTheDocument();
    });

    it('should have aria-live="polite" for accessibility', () => {
      render(<RedirectFragment url="/dashboard" />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should render a fallback link with correct href', () => {
      render(<RedirectFragment url="/settings/profile" />);

      const link = screen.getByRole('link', { name: /link/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/settings/profile');
    });

    it('should call router.push after 1 second delay', () => {
      render(<RedirectFragment url="/dashboard" />);

      expect(mockPush).not.toHaveBeenCalled();

      // Fast-forward time by 1 second
      vi.advanceTimersByTime(1000);

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('should handle absolute same-origin URLs', () => {
      render(<RedirectFragment url="http://localhost:3000/dashboard" />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();

      vi.advanceTimersByTime(1000);

      expect(mockPush).toHaveBeenCalledWith('http://localhost:3000/dashboard');
    });

    it('should handle URLs with query parameters', () => {
      render(<RedirectFragment url="/search?q=test&page=1" />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();

      vi.advanceTimersByTime(1000);

      expect(mockPush).toHaveBeenCalledWith('/search?q=test&page=1');
    });

    it('should handle URLs with hash fragments', () => {
      render(<RedirectFragment url="/page#section" />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();

      vi.advanceTimersByTime(1000);

      expect(mockPush).toHaveBeenCalledWith('/page#section');
    });

    it('should handle root URL', () => {
      render(<RedirectFragment url="/" />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();

      vi.advanceTimersByTime(1000);

      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should cleanup timer on unmount', () => {
      const { unmount } = render(<RedirectFragment url="/dashboard" />);

      unmount();

      vi.advanceTimersByTime(1000);

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Invalid URL Handling', () => {
    it('should show error for cross-origin URL', () => {
      render(<RedirectFragment url="https://external-site.com/page" />);

      expect(screen.getByText('Invalid redirect URL')).toBeInTheDocument();
      expect(
        screen.getByText('The provided URL is not valid.')
      ).toBeInTheDocument();
      expect(screen.queryByText('Redirecting...')).not.toBeInTheDocument();
    });

    it('should not call router.push for cross-origin URL', () => {
      render(<RedirectFragment url="https://external-site.com/page" />);

      vi.advanceTimersByTime(2000);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should log error for cross-origin URL', () => {
      render(<RedirectFragment url="https://external-site.com/page" />);

      expect(console.error).toHaveBeenCalledWith(
        'Invalid redirect URL:',
        'https://external-site.com/page'
      );
    });

    // Modified test to correctly reflect behavior and fix diagnostic
    it('should treat relative URLs as valid same-origin and redirect', () => {
      render(<RedirectFragment url="not-a-valid-url" />);

      // Relative URLs are valid and treated as same-origin
      expect(screen.getByText('Redirecting...')).toBeInTheDocument();
      vi.advanceTimersByTime(1000); // Advance time to trigger redirection
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('not-a-valid-url');
    });

    it('should log error for malformed URL', () => {
      render(<RedirectFragment url="javascript:alert('xss')" />);

      expect(console.error).toHaveBeenCalledWith(
        'Invalid redirect URL:',
        "javascript:alert('xss')"
      );
    });

    it('should handle empty string URL as same-origin', () => {
      render(<RedirectFragment url="" />);

      // Empty string is treated as same-origin by URL constructor
      expect(screen.getByText('Redirecting...')).toBeInTheDocument();
      vi.advanceTimersByTime(1000);
      expect(mockPush).toHaveBeenCalledWith('');
    });

    it('should show error for URL with different protocol on same domain', () => {
      render(<RedirectFragment url="ftp://localhost:3000/page" />);

      expect(screen.getByText('Invalid redirect URL')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should show error for URL with different port', () => {
      render(<RedirectFragment url="http://localhost:4000/page" />);

      expect(screen.getByText('Invalid redirect URL')).toBeInTheDocument();
    });

    it('should show error for URL with subdomain', () => {
      render(<RedirectFragment url="http://subdomain.localhost:3000/page" />);

      expect(screen.getByText('Invalid redirect URL')).toBeInTheDocument();
    });
  });

  describe('Security - Open Redirect Prevention', () => {
    it('should block javascript: protocol URLs', () => {
      render(<RedirectFragment url="javascript:alert('xss')" />);

      expect(screen.getByText('Invalid redirect URL')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should block data: protocol URLs', () => {
      render(
        <RedirectFragment url="data:text/html,<script>alert('xss')</script>" />
      );

      expect(screen.getByText('Invalid redirect URL')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should block file: protocol URLs', () => {
      render(<RedirectFragment url="file:///etc/passwd" />);

      expect(screen.getByText('Invalid redirect URL')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should block URLs with different origins', () => {
      render(<RedirectFragment url="https://attacker.com/phishing" />);

      expect(screen.getByText('Invalid redirect URL')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should block protocol-relative URLs to different domains', () => {
      render(<RedirectFragment url="//attacker.com/page" />);

      expect(screen.getByText('Invalid redirect URL')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('URL Validation with useMemo', () => {
    it('should memoize validation result for same URL', () => {
      const { rerender } = render(<RedirectFragment url="/dashboard" />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();

      // Rerender with same URL
      rerender(<RedirectFragment url="/dashboard" />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();

      // Validation should not be recalculated
    });

    it('should revalidate when URL changes', () => {
      const { rerender } = render(<RedirectFragment url="/dashboard" />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();

      // Rerender with different URL
      rerender(<RedirectFragment url="https://external.com" />);

      expect(screen.getByText('Invalid redirect URL')).toBeInTheDocument();
    });
  });

  describe('Timer Behavior', () => {
    it('should wait exactly 1 second before redirecting', () => {
      render(<RedirectFragment url="/dashboard" />);

      // After 999ms, should not redirect
      vi.advanceTimersByTime(999);
      expect(mockPush).not.toHaveBeenCalled();

      // After 1000ms, should redirect
      vi.advanceTimersByTime(1);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it('should clear timer on component unmount before redirect', () => {
      const { unmount } = render(<RedirectFragment url="/dashboard" />);

      vi.advanceTimersByTime(500);
      unmount();
      vi.advanceTimersByTime(500);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should reset timer when URL changes', () => {
      const { rerender } = render(<RedirectFragment url="/page1" />);

      vi.advanceTimersByTime(500);

      // Change URL, timer should reset
      rerender(<RedirectFragment url="/page2" />);

      vi.advanceTimersByTime(500);
      expect(mockPush).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(mockPush).toHaveBeenCalledWith('/page2');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status" for screen readers', () => {
      render(<RedirectFragment url="/dashboard" />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toBeInTheDocument();
    });

    it('should have aria-live="polite" for non-intrusive announcements', () => {
      render(<RedirectFragment url="/dashboard" />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should provide fallback link for manual navigation', () => {
      render(<RedirectFragment url="/dashboard" />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/dashboard');
    });

    it('should have descriptive text for users', () => {
      render(<RedirectFragment url="/dashboard" />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();
      expect(
        screen.getByText(/If you are not redirected automatically, follow this/)
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle URL with multiple slashes', () => {
      render(<RedirectFragment url="/path//to///page" />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();

      vi.advanceTimersByTime(1000);

      expect(mockPush).toHaveBeenCalledWith('/path//to///page');
    });

    it('should handle URL with encoded characters', () => {
      render(<RedirectFragment url="/search?q=hello%20world" />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();

      vi.advanceTimersByTime(1000);

      expect(mockPush).toHaveBeenCalledWith('/search?q=hello%20world');
    });

    it('should handle very long URLs', () => {
      const longPath = '/page/' + 'a'.repeat(1000);
      render(<RedirectFragment url={longPath} />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();

      vi.advanceTimersByTime(1000);

      expect(mockPush).toHaveBeenCalledWith(longPath);
    });

    it('should handle URL with special characters', () => {
      render(<RedirectFragment url="/page?name=O'Brien&city=São Paulo" />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();

      vi.advanceTimersByTime(1000);

      expect(mockPush).toHaveBeenCalledWith(
        "/page?name=O'Brien&city=São Paulo"
      );
    });
  });

  describe('Different Window Origins', () => {
    // Nested beforeEach/afterEach to manage temporary window.location changes
    let tempMockLocation: Location;

    beforeEach(() => {
      // Capture the current mocked window.location (from the parent beforeEach)
      tempMockLocation = window.location;
    });

    afterEach(() => {
      // Restore the window.location to the state set by the parent beforeEach
      Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        value: tempMockLocation,
      });
    });

    it('should validate against current window origin', () => {
      // Temporarily redefine window.location for this test
      Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        value: {
          ...tempMockLocation, // Start with the base mock properties
          origin: 'https://example.com',
          href: 'https://example.com/page',
          protocol: 'https:',
          host: 'example.com',
          hostname: 'example.com',
          port: '', // Default HTTPS port
          pathname: '/page',
          toString: () => 'https://example.com/page',
        } as Location,
      });

      render(<RedirectFragment url="https://example.com/dashboard" />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();
      vi.advanceTimersByTime(1000);
      expect(mockPush).toHaveBeenCalledWith('https://example.com/dashboard');
    });

    it('should reject URL with different origin when window origin changes', () => {
      // Temporarily redefine window.location for this test
      Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        value: {
          ...tempMockLocation, // Start with the base mock properties
          origin: 'https://example.com',
          href: 'https://example.com/page',
          protocol: 'https:',
          host: 'example.com',
          hostname: 'example.com',
          port: '',
          pathname: '/page',
          toString: () => 'https://example.com/page',
        } as Location,
      });

      render(<RedirectFragment url="http://localhost:3000/dashboard" />);

      expect(screen.getByText('Invalid redirect URL')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Component Structure', () => {
    it('should render h1 heading for redirecting message', () => {
      render(<RedirectFragment url="/dashboard" />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Redirecting...');
    });

    it('should render h1 heading for error message', () => {
      render(<RedirectFragment url="https://external.com" />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Invalid redirect URL');
    });

    it('should render paragraph with instructions', () => {
      render(<RedirectFragment url="/dashboard" />);

      const paragraph = screen.getByText(
        /If you are not redirected automatically/
      );
      expect(paragraph.tagName).toBe('P');
    });

    it('should render paragraph with error explanation', () => {
      render(<RedirectFragment url="https://external.com" />);

      const paragraph = screen.getByText('The provided URL is not valid.');
      expect(paragraph.tagName).toBe('P');
    });
  });
});
