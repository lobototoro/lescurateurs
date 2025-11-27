# UpdateArticleForm Test Coverage Documentation

## Overview
Comprehensive unit tests for the `UpdateArticleForm` component using React Testing Library and Vitest.

**Total Tests:** 31  
**Test File:** `test-utils/editor/components/formComponents/updateArticle.test.tsx`  
**Component:** `app/editor/components/formComponents/updateArticle.tsx`  
**Coverage:** 96.44% statements, 95.65% branches, 87.5% functions

## Test Suites

### 1. Component Rendering (4 tests)
Tests the initial rendering state and component structure.

- ✅ Renders component successfully
- ✅ Renders ArticleTitle with correct props (h2, large, white, mt-6 mb-4)
- ✅ Displays SearchArticle component when no article is selected
- ✅ Does not display back to search button initially

**Purpose:** Ensures the component renders correctly in its initial state before any user interaction.

---

### 2. Form Initialization (2 tests)
Validates React Hook Form setup and field registration.

- ✅ Initializes useForm with correct configuration (onChange mode, resolver, default values)
- ✅ Registers all required fields (id, slug, author, author_email, created_at, updated_at, published_at, validated, shipped, updated_by, urls)

**Purpose:** Confirms proper form initialization with validation rules and default values.

---

### 3. Article Selection and Loading (4 tests)
Tests the article fetching and loading workflow.

- ✅ Fetches and displays article when selected (calls fetchArticleById)
- ✅ Displays toast error when article fetch fails
- ✅ Resets form when selectedId becomes undefined
- ✅ Displays back to search button when article is loaded

**Purpose:** Validates the complete article selection and loading flow, including error handling.

---

### 4. Form Submission (6 tests)
Tests form submission logic and validation.

- ✅ Submits form when data is modified
- ✅ Prevents submission when article is identical (Ramda.equals check)
- ✅ Calls scrollTopAction when identical article is detected
- ✅ Dismisses identical warning message when close button clicked
- ✅ Disables submit button when isPending is true
- ✅ Wraps submission in startTransition for performance

**Purpose:** Ensures proper form submission behavior, including the critical identical article check that prevents unnecessary updates.

---

### 5. URL Management (3 tests)
Tests dynamic URL input management.

- ✅ Displays URL inputs from loaded article
- ✅ Calls addInputs when add URL button is clicked
- ✅ Calls removeInputs when remove URL button is clicked

**Purpose:** Validates the dynamic URL array management using addRemoveInputsFactory.

---

### 6. Main Content Management (1 test)
Tests rich text editor integration.

- ✅ Updates main content via getMainContent callback

**Purpose:** Ensures the main content field (RTE) properly integrates with the form via setValue.

---

### 7. Back to Search Navigation (2 tests)
Tests navigation back to search interface.

- ✅ Returns to search view when back to search is clicked
- ✅ Calls scrollTopAction when back to search is clicked

**Purpose:** Validates proper state reset and navigation when returning to search.

---

### 8. Closing Actions (1 test)
Tests form cleanup after submission.

- ✅ Reset form state when closing actions are triggered

**Purpose:** Confirms proper cleanup via withCallbacks integration.

---

### 9. Error Handling (1 test)
Tests validation error handling.

- ✅ Does not submit form when there are validation errors

**Purpose:** Ensures form won't submit with validation errors present.

---

### 10. Suspense Fallback (1 test)
Tests React Suspense integration.

- ✅ Renders Suspense wrapper around form

**Purpose:** Validates async component loading wrapper.

---

### 11. Integration with useMainContentValidation (1 test)
Tests custom validation hook integration.

- ✅ Calls useMainContentValidation hook with correct parameters

**Purpose:** Confirms the main content validation hook is properly initialized.

---

### 12. Accessibility (2 tests)
Tests accessibility features.

- ✅ Has proper form structure when article is loaded
- ✅ Has accessible back to search button with proper classes and text

**Purpose:** Ensures the component follows accessibility best practices.

---

### 13. Edge Cases (3 tests)
Tests unusual or boundary conditions.

- ✅ Handles missing article data gracefully
- ✅ Handles article with empty urls array
- ✅ Handles rapid article selection changes

**Purpose:** Validates robust behavior under edge conditions.

---

## Key Features Tested

### State Management
- Article selection and loading state
- Form dirty state detection (identical article check)
- Warning message state
- Loading/pending states

### Data Flow
- Article fetching via server action (fetchArticleById)
- Form submission via server action (updateArticleAction)
- Toast notifications on success/error
- Form reset on navigation

### User Interactions
- Article search and selection
- Form field updates
- Dynamic URL addition/removal
- Back to search navigation
- Warning message dismissal

### Validation
- React Hook Form with Zod schema
- Custom resolver integration
- Main content validation hook
- Identical article detection (prevents no-op updates)

### Performance Optimizations
- React.startTransition usage
- Suspense for async loading

## Mocked Dependencies

```typescript
- react (useActionState, startTransition)
- react-hook-form
- ramda (equals for deep comparison)
- @/app/articleActions (fetchArticleById, updateArticleAction)
- @/app/components/single-elements/articleHTMLForm
- @/app/editor/components/formComponents/searchArticle
- @/lib/utility-functions (isEmpty, addRemoveInputsFactory)
- @/app/editor/components/resolvers/customResolver
- @/app/components/single-elements/ArticleTitle
- @/lib/useMaincontentValidation
- @/lib/toastCallbacks
- sonner (toast notifications)
```

## Test Data Structure

```typescript
mockArticle = {
  id: 123,
  slug: 'test-article',
  title: 'Test Article Title',
  introduction: 'Test introduction...',
  main: 'Test main content...',
  published_at: '2024-01-01T00:00:00.000Z',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-02T00:00:00.000Z',
  updated_by: 'test_user',
  author: 'Test Author',
  author_email: 'test@example.com',
  validated: true,
  shipped: false,
  urls: [
    { url: 'https://example.com/1', description: 'Example 1' },
    { url: 'https://example.com/2', description: 'Example 2' }
  ],
  main_audio_url: 'https://example.com/audio.mp3',
  url_to_main_illustration: 'https://example.com/image.jpg'
}
```

## Running Tests

```bash
# Run all tests for this component
npm test -- updateArticle.test.tsx

# Run with coverage
npm test -- updateArticle.test.tsx --coverage

# Run in watch mode
npm test -- updateArticle.test.tsx --watch
```

## Critical Scenarios Covered

### ✅ Happy Path
1. User searches for article
2. User selects article from results
3. Article loads successfully
4. User modifies article data
5. User submits form
6. Form submits successfully

### ✅ Validation Path
1. User loads article
2. User attempts to submit without changes
3. Warning displayed: "Aucune modification n'a été apportée à l'article"
4. Form submission prevented
5. User can dismiss warning

### ✅ Error Path
1. User searches for article
2. Article fetch fails
3. Error toast displayed
4. User remains on search screen

### ✅ Navigation Path
1. User loads article
2. User clicks "Retour à la recherche"
3. Form resets
4. Search interface displayed
5. Scroll to top triggered

## Notes

- All tests use async/await pattern for proper React state updates
- Tests use `waitFor` to handle asynchronous operations
- Mock implementations closely mirror actual behavior
- Tests are isolated with proper cleanup in beforeEach/afterEach
- Coverage metrics show high test quality (96%+ coverage)
