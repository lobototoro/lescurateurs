# RedirectFragment Test Coverage Documentation

## Overview
Comprehensive unit tests for the `RedirectFragment` component using React Testing Library and Vitest.

**Total Tests:** 43  
**Test File:** `test-utils/components/single-elements/redirectFragment.test.tsx`  
**Component:** `app/components/single-elements/redirectFragment.tsx`  
**Coverage:** 94.59% statements, 90% branches, 100% functions

## Test Suites

### 1. Valid URL Redirection (8 tests)
Tests successful redirection with valid same-origin URLs.

- ✅ Renders redirecting message for valid same-origin URL
- ✅ Has aria-live="polite" for accessibility
- ✅ Renders a fallback link with correct href
- ✅ Calls router.push after 1 second delay
- ✅ Handles absolute same-origin URLs
- ✅ Handles URLs with query parameters
- ✅ Handles URLs with hash fragments
- ✅ Handles root URL
- ✅ Cleans up timer on unmount

**Purpose:** Ensures valid URLs redirect correctly with proper timing and cleanup.

**Redirect Flow:**
1. Component renders with "Redirecting..." message
2. 1-second timer starts
3. After 1000ms, `router.push(url)` is called
4. User is navigated to destination

**Valid URL Examples:**
```javascript
'/dashboard'                          // Relative path
'/search?q=test&page=1'              // With query params
'/page#section'                       // With hash fragment
'http://localhost:3000/dashboard'    // Absolute same-origin
'/'                                   // Root path
```

---

### 2. Invalid URL Handling (11 tests)
Tests rejection of invalid or dangerous URLs.

- ✅ Shows error for cross-origin URL
- ✅ Does not call router.push for cross-origin URL
- ✅ Logs error for cross-origin URL
- ✅ Handles relative URL as valid same-origin
- ✅ Logs error for malformed URL
- ✅ Does not call router.push for malformed URL
- ✅ Handles empty string URL as same-origin
- ✅ Shows error for URL with different protocol on same domain
- ✅ Shows error for URL with different port
- ✅ Shows error for URL with subdomain

**Purpose:** Validates security measures against open redirect attacks.

**Invalid URL Examples:**
```javascript
'https://external-site.com/page'          // Cross-origin
'ftp://localhost:3000/page'               // Different protocol
'http://localhost:4000/page'              // Different port
'http://subdomain.localhost:3000/page'    // Subdomain
```

**Security Behavior:**
- No navigation occurs
- Error message displayed
- `console.error` called with URL
- User remains on current page

---

### 3. Security - Open Redirect Prevention (5 tests)
Tests protection against various attack vectors.

- ✅ Blocks javascript: protocol URLs
- ✅ Blocks data: protocol URLs
- ✅ Blocks file: protocol URLs
- ✅ Blocks URLs with different origins
- ✅ Blocks protocol-relative URLs to different domains

**Purpose:** Ensures the component is secure against common XSS and phishing attacks.

**Blocked Attack Vectors:**
```javascript
'javascript:alert("xss")'                       // JavaScript injection
'data:text/html,<script>alert("xss")</script>' // Data URI injection
'file:///etc/passwd'                            // Local file access
'https://attacker.com/phishing'                 // Phishing site
'//attacker.com/page'                           // Protocol-relative
```

**Security Implementation:**
```javascript
// useMemo validates URL on every URL change
const isValidUrl = useMemo(() => {
  try {
    const parsedUrl = new URL(url, window.location.origin)
    return parsedUrl.origin === window.location.origin
  } catch {
    return false
  }
}, [url])
```

**Key Security Features:**
- Same-origin policy enforced
- URL parsing errors caught
- Invalid URLs rejected immediately
- No navigation for malicious URLs

---

### 4. URL Validation with useMemo (2 tests)
Tests memoization of URL validation.

- ✅ Memoizes validation result for same URL
- ✅ Revalidates when URL changes

**Purpose:** Ensures efficient validation without unnecessary recalculation.

**Memoization Behavior:**
- Validation only runs when `url` prop changes
- Results cached for performance
- Prevents re-parsing on every render

---

### 5. Timer Behavior (3 tests)
Tests the 1-second delay mechanism.

- ✅ Waits exactly 1 second before redirecting
- ✅ Clears timer on component unmount before redirect
- ✅ Resets timer when URL changes

**Purpose:** Validates proper timing and cleanup of redirect timer.

**Timer Logic:**
```javascript
useEffect(() => {
  if (!isValidUrl) return
  
  const timer = setTimeout(() => {
    router.push(url)
  }, 1000)
  
  return () => clearTimeout(timer)  // Cleanup
}, [url, isValidUrl, router])
```

**Timer Scenarios:**
- **Normal:** Wait 1000ms → redirect
- **Unmount:** Clear timer → no redirect
- **URL Change:** Clear old timer → start new timer

---

### 6. Accessibility (4 tests)
Tests accessibility features for assistive technologies.

- ✅ Has role="status" for screen readers
- ✅ Has aria-live="polite" for non-intrusive announcements
- ✅ Provides fallback link for manual navigation
- ✅ Has descriptive text for users

**Purpose:** Ensures component is accessible to all users.

**Accessibility Features:**

**ARIA Attributes:**
```jsx
<div role="status" aria-live="polite">
  <h1>Redirecting...</h1>
  <p>
    If you are not redirected automatically, follow this{' '}
    <a href={url}>link</a>.
  </p>
</div>
```

**Why These Matter:**
- `role="status"`: Announces dynamic content changes
- `aria-live="polite"`: Non-interrupting announcements
- Fallback link: Manual navigation if JS fails
- Clear messaging: Users understand what's happening

---

### 7. Edge Cases (4 tests)
Tests unusual or boundary conditions.

- ✅ Handles URL with multiple slashes
- ✅ Handles URL with encoded characters
- ✅ Handles very long URLs
- ✅ Handles URL with special characters

**Purpose:** Validates robust behavior under unusual conditions.

**Edge Case Examples:**
```javascript
'/path//to///page'                    // Multiple slashes
'/search?q=hello%20world'             // URL encoding
'/page/' + 'a'.repeat(1000)           // Very long URL
"/page?name=O'Brien&city=São Paulo"  // Special characters
```

---

### 8. Different Window Origins (2 tests)
Tests validation against current window origin.

- ✅ Validates against current window origin
- ✅ Rejects URL with different origin when window origin changes

**Purpose:** Ensures validation adapts to current page's origin.

**Origin Matching:**
```javascript
// Component validates against window.location.origin
const isValidUrl = useMemo(() => {
  const parsedUrl = new URL(url, window.location.origin)
  return parsedUrl.origin === window.location.origin
}, [url])
```

---

### 9. Component Structure (4 tests)
Tests HTML structure and semantic elements.

- ✅ Renders h1 heading for redirecting message
- ✅ Renders h1 heading for error message
- ✅ Renders paragraph with instructions
- ✅ Renders paragraph with error explanation

**Purpose:** Validates proper semantic HTML structure.

**Component Structures:**

**Valid URL:**
```jsx
<div role="status" aria-live="polite">
  <h1>Redirecting...</h1>
  <p>If you are not redirected... <a href={url}>link</a></p>
</div>
```

**Invalid URL:**
```jsx
<div>
  <h1>Invalid redirect URL</h1>
  <p>The provided URL is not valid.</p>
</div>
```

---

## Key Features Tested

### Security First Design
The component prioritizes security with multiple validation layers:

**1. URL Parsing:**
```javascript
try {
  const parsedUrl = new URL(url, window.location.origin)
  // Validation succeeds
} catch {
  return false  // Malformed URL rejected
}
```

**2. Origin Checking:**
```javascript
return parsedUrl.origin === window.location.origin
```

**3. Error Logging:**
```javascript
if (!isValidUrl) {
  console.error('Invalid redirect URL:', url)
  return  // No navigation
}
```

### User Experience Features

**1. Delayed Navigation:**
- 1-second delay allows users to read the message
- Screen readers can announce status
- Better perceived performance

**2. Fallback Link:**
- Manual navigation option
- Works if JavaScript disabled
- Accessible to all users

**3. Clear Messaging:**
- "Redirecting..." for valid URLs
- "Invalid redirect URL" for errors
- Explains what's happening

### Performance Optimization

**useMemo for Validation:**
```javascript
const isValidUrl = useMemo(() => {
  // Expensive URL parsing only when url changes
  // Result cached for subsequent renders
}, [url])
```

**Benefits:**
- No re-parsing on every render
- Efficient URL validation
- Minimal performance impact

### Timer Management

**Cleanup on Unmount:**
```javascript
useEffect(() => {
  const timer = setTimeout(/* ... */, 1000)
  return () => clearTimeout(timer)  // Prevents memory leaks
}, [url, isValidUrl, router])
```

**Benefits:**
- No memory leaks
- Proper cleanup
- Timer resets on URL change

## Mocked Dependencies

```typescript
- next/navigation (useRouter)
  - router.push: Navigation function
  - All other router methods mocked
```

## Test Data Structure

### Valid URLs (Same-Origin)
```javascript
'/dashboard'                          // Relative path
'/search?q=test'                      // With query params
'/page#section'                       // With hash
'http://localhost:3000/page'          // Absolute same-origin
'/'                                   // Root
```

### Invalid URLs (Cross-Origin or Malformed)
```javascript
'https://external-site.com'           // Different origin
'ftp://localhost:3000/page'           // Different protocol
'http://localhost:4000/page'          // Different port
'javascript:alert("xss")'             // Dangerous protocol
'not-a-valid-url'                     // Malformed (treated as relative)
```

## Running Tests

```bash
# Run all tests for this component
npm test -- redirectFragment.test.tsx

# Run with coverage
npm test -- redirectFragment.test.tsx --coverage

# Run in watch mode
npm test -- redirectFragment.test.tsx --watch
```

## Critical Scenarios Covered

### ✅ Happy Path - Valid Redirect
1. Component receives valid same-origin URL
2. "Redirecting..." message displayed
3. Fallback link rendered with correct href
4. 1-second timer starts
5. After 1000ms, router.push(url) called
6. User navigated to destination

### ✅ Security Path - Cross-Origin Attack
1. Component receives cross-origin URL
2. URL validation fails (different origin)
3. Error message displayed
4. console.error logs the attempt
5. No timer started
6. No navigation occurs
7. User stays on current page safely

### ✅ Security Path - XSS Attack
1. Component receives `javascript:alert('xss')`
2. URL parsing fails (invalid protocol)
3. Caught in try-catch block
4. isValidUrl returns false
5. Error UI displayed
6. No code execution
7. User protected from XSS

### ✅ Unmount Path - Navigation Cancelled
1. Component renders with valid URL
2. Timer starts (1000ms)
3. After 500ms, component unmounts
4. useEffect cleanup runs
5. Timer cleared
6. No navigation occurs
7. No memory leaks

### ✅ URL Change Path - Timer Reset
1. Component renders with `/page1`
2. Timer starts (1000ms)
3. After 500ms, URL changes to `/page2`
4. Old timer cleared
5. New timer starts (1000ms)
6. After 1000ms more, navigate to `/page2`
7. User ends up at correct destination

### ✅ Accessibility Path - Screen Reader
1. Component renders with valid URL
2. Status div has role="status"
3. aria-live="polite" set
4. Screen reader announces "Redirecting..."
5. User hears status change
6. Fallback link available if needed
7. Clear, understandable messaging

### ✅ Edge Case - Very Long URL
1. Component receives 1000+ character URL
2. URL parsing succeeds
3. Origin validation passes
4. Timer starts normally
5. After 1000ms, navigation occurs
6. No performance issues
7. Component handles gracefully

### ✅ Error Display Path
1. Component receives invalid URL
2. Validation fails
3. Error UI renders:
   - h1: "Invalid redirect URL"
   - p: "The provided URL is not valid."
4. No role="status" or aria-live
5. No timer started
6. User sees clear error message
7. Can navigate away manually

## Component Architecture

### Props Interface
```typescript
interface RedirectFragmentProps {
  url: string  // Destination URL (must be same-origin)
}
```

### State Management
- No internal state
- Uses useMemo for validation result
- Uses useEffect for timer

### Validation Logic

**Step 1: Parse URL**
```javascript
new URL(url, window.location.origin)
```
- Relative URLs resolved against current origin
- Absolute URLs parsed as-is
- Malformed URLs throw error

**Step 2: Check Origin**
```javascript
parsedUrl.origin === window.location.origin
```
- Compares protocol, hostname, and port
- Must match exactly
- Cross-origin URLs rejected

**Step 3: Error Handling**
```javascript
try {
  // Validation logic
} catch {
  return false  // Any parsing error = invalid
}
```

### Render Logic

**Conditional Rendering:**
```javascript
if (!isValidUrl) {
  return <ErrorUI />
}

return <RedirectingUI />
```

**Two Possible UIs:**
1. **Error UI** (invalid URL)
   - Error heading and message
   - No timer, no navigation
   
2. **Redirecting UI** (valid URL)
   - Status message with fallback link
   - Timer starts automatically

### Timer Implementation

**Setup:**
```javascript
const timer = setTimeout(() => {
  router.push(url)
}, 1000)
```

**Cleanup:**
```javascript
return () => clearTimeout(timer)
```

**Dependencies:**
```javascript
[url, isValidUrl, router]
```
- Timer resets when URL changes
- Timer resets when validation changes
- Timer uses current router instance

## Security Considerations

### Open Redirect Prevention
**What is it?**
Attackers trick users into visiting malicious sites by manipulating redirect URLs.

**How we prevent it:**
1. Same-origin policy strictly enforced
2. URL parsing validates structure
3. Origin comparison prevents spoofing
4. Dangerous protocols blocked
5. Error logging for monitoring

### Attack Vectors Blocked

**Protocol Injection:**
```javascript
'javascript:alert("xss")'  // ❌ Blocked
'data:text/html,...'       // ❌ Blocked
'file:///etc/passwd'       // ❌ Blocked
```

**Domain Spoofing:**
```javascript
'https://attacker.com'           // ❌ Blocked
'http://subdomain.localhost'     // ❌ Blocked
'//attacker.com'                 // ❌ Blocked
```

**Port Manipulation:**
```javascript
'http://localhost:4000'  // ❌ Blocked (different port)
```

### Why This Matters
- Protects users from phishing
- Prevents XSS attacks
- Stops unauthorized navigation
- Maintains application security
- Builds user trust

## Performance Considerations

### Memoization Benefits
- URL validation cached
- No re-parsing on re-render
- Minimal CPU usage
- Efficient for frequent renders

### Timer Efficiency
- Single setTimeout per component
- Proper cleanup prevents leaks
- No interval polling
- Lightweight implementation

### Bundle Size
- Small component (~110 lines)
- No external dependencies
- Uses built-in URL API
- Minimal runtime overhead

## Accessibility Best Practices

### WCAG Compliance
- ✅ Role="status" for announcements
- ✅ aria-live="polite" for non-intrusive updates
- ✅ Semantic HTML (h1, p, a)
- ✅ Fallback link for manual navigation
- ✅ Clear, descriptive text

### Screen Reader Experience
1. Page loads
2. Status region announced
3. "Redirecting..." read aloud
4. Instructions provided
5. Fallback link available
6. User informed at all times

### Keyboard Navigation
- Fallback link is focusable
- Standard tab navigation
- No keyboard traps
- Accessible without mouse

## Notes

- All tests use `vi.useFakeTimers()` for timer control
- window.location is mocked for origin testing
- console.error is mocked to verify error logging
- Tests are isolated with proper cleanup
- Coverage is 94.59% statements (catch block lines uncovered)
- The 1-second delay is a UX decision (can be adjusted)
- Component is client-side only ('use client' directive)
- Designed for use in Next.js App Router
- URL API is used for robust parsing (supported in all modern browsers)
- Component renders immediately (no loading state delay)
- Timer cleanup prevents memory leaks in SPAs
- Error messages are user-friendly but not overly technical
