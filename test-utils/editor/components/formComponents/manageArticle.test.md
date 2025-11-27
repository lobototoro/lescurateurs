# ManageArticleForm Test Coverage Documentation

## Overview
Comprehensive unit tests for the `ManageArticleForm` component using React Testing Library and Vitest.

**Total Tests:** 35  
**Test File:** `test-utils/editor/components/formComponents/manageArticle.test.tsx`  
**Component:** `app/editor/components/formComponents/manageArticle.tsx`  
**Coverage:** 99.26% statements, 95.23% branches, 100% functions

## Test Suites

### 1. Component Rendering (4 tests)
Tests the initial rendering state and component structure.

- ✅ Renders component successfully
- ✅ Renders SearchArticle with target "manage"
- ✅ Renders back to search button with correct text and styles
- ✅ Initializes with cancelSearchDisplay as false

**Purpose:** Ensures the component renders correctly in its initial state with all required child components.

---

### 2. Modal Integration (2 tests)
Validates modal component integration and props passing.

- ✅ Passes modal ref to ModalWithCTA
- ✅ Passes isPending prop to modal

**Purpose:** Confirms proper integration with the ModalWithCTA component and callback system.

---

### 3. Delete Action Flow (5 tests)
Tests the complete delete article workflow.

- ✅ Opens modal with delete confirmation when delete action is triggered
- ✅ Adds "is-active" class to modal when delete is triggered
- ✅ Calls manageArticle action when delete is confirmed
- ✅ Closes modal when delete is confirmed
- ✅ Closes modal when delete is cancelled

**Purpose:** Validates the destructive delete operation requires confirmation and properly submits the action.

**Modal Content:**
- Title: "Supprimer l'article"
- Description: "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
- CTA Button: "Supprimer"
- Cancel Button: "Annuler"

**FormData Structure:**
```javascript
actionName: 'delete'
id: '123'
```

---

### 4. Validate Action Flow (5 tests)
Tests the article validation/invalidation workflow.

- ✅ Opens modal with validate confirmation when validate action is triggered
- ✅ Adds "is-active" class to modal when validate is triggered
- ✅ Calls manageArticle action with validation=true when validate is confirmed
- ✅ Calls manageArticle action with validation=false when invalidate is clicked
- ✅ Closes modal when validate is confirmed

**Purpose:** Validates the validation toggle workflow with both positive and negative actions.

**Modal Content:**
- Title: "Valider l'article"
- Description: "Êtes-vous sûr de vouloir valider / invalider cet article ?"
- CTA Button: "Valider" (sets validation=true)
- Cancel Button: "Invalider" (sets validation=false)

**FormData Structure:**
```javascript
actionName: 'validate'
id: '456'
validation: 'true' | 'false'
```

---

### 5. Ship Action Flow (5 tests)
Tests the article publishing/unpublishing (MEP) workflow.

- ✅ Opens modal with ship confirmation when ship action is triggered
- ✅ Adds "is-active" class to modal when ship is triggered
- ✅ Calls manageArticle action with shipped=true when ONLINE is clicked
- ✅ Calls manageArticle action with shipped=false when OFFLINE is clicked
- ✅ Closes modal when ship is confirmed

**Purpose:** Validates the publish/unpublish (mise en production) workflow.

**Modal Content:**
- Title: "MEP de l'article"
- Description: "Êtes-vous sûr de vouloir MEP cet article ?"
- CTA Button: "ONLINE" (sets shipped=true)
- Cancel Button: "OFFLINE" (sets shipped=false)

**FormData Structure:**
```javascript
actionName: 'ship'
id: '789'
shipped: 'true' | 'false'
```

---

### 6. Back to Search Button (2 tests)
Tests navigation back to search interface.

- ✅ Sets cancelSearchDisplay to true when clicked
- ✅ Prevents default event when clicked

**Purpose:** Validates proper state reset when returning to search mode.

---

### 7. Modal Close Functionality (1 test)
Tests modal closing behavior.

- ✅ Closes modal when onClose is called

**Purpose:** Ensures modal can be closed via the close button.

---

### 8. startTransition Integration (1 test)
Tests React performance optimization.

- ✅ Wraps action submissions in startTransition

**Purpose:** Confirms actions are wrapped in startTransition for non-blocking UI updates.

---

### 9. Edge Cases (3 tests)
Tests unusual or boundary conditions.

- ✅ Does not open modal when action has no actionName
- ✅ Handles null modal ref gracefully
- ✅ Handles multiple rapid action selections

**Purpose:** Validates robust behavior under edge conditions and prevents errors.

---

### 10. useActionState Integration (2 tests)
Tests React server action integration.

- ✅ Initializes useActionState with wrapped action
- ✅ Calls scrollTopAction after successful action

**Purpose:** Confirms proper integration with Next.js server actions and post-action callbacks.

---

### 11. Accessibility (2 tests)
Tests accessibility features.

- ✅ Has accessible button for back to search
- ✅ Has proper modal structure with title and description

**Purpose:** Ensures the component follows accessibility best practices.

---

### 12. FormData Construction (3 tests)
Tests proper FormData building for server actions.

- ✅ Constructs FormData correctly for delete action
- ✅ Constructs FormData correctly for validate action with validation field
- ✅ Constructs FormData correctly for ship action with shipped field

**Purpose:** Validates that FormData is correctly constructed with all required fields for each action type.

---

## Key Features Tested

### State Management
- Action selection and modal state
- Cancel search display toggle
- Modal active/inactive state
- Loading/pending states

### Modal Workflow
Each action (delete, validate, ship) follows this pattern:
1. User selects action from SearchArticle component
2. Modal opens with action-specific content
3. Modal ref gets "is-active" class added
4. User confirms or cancels action
5. FormData is constructed and submitted
6. Modal closes (classList.remove('is-active'))
7. scrollTopAction is called

### Action Types
Three distinct action types with different behaviors:

#### Delete
- Single confirmation
- Destructive operation
- No additional parameters

#### Validate
- Dual action (validate/invalidate)
- CTA button validates (true)
- Cancel button invalidates (false)
- Both close the modal

#### Ship
- Dual action (online/offline)
- CTA button publishes (true)
- Cancel button unpublishes (false)
- Both close the modal

### Performance Optimizations
- React.startTransition usage for non-blocking updates
- Isolated sendAction helper function
- useEffect with actionName guard

## Mocked Dependencies

```typescript
- react (useActionState, startTransition, useState, useEffect, useRef)
- @/app/articleActions (manageArticleActions)
- @/app/editor/components/formComponents/searchArticle
- @/app/components/single-elements/modalWithCTA
- @/lib/toastCallbacks (withCallbacks, toastCallbacks)
```

## Test Data Structure

### Action Objects
```typescript
// Delete action
{ actionName: 'delete', id: '123' }

// Validate action
{ actionName: 'validate', id: '456' }

// Ship action
{ actionName: 'ship', id: '789' }

// No action (edge case)
{ id: '999' } // Missing actionName
```

### FormData Structures

```javascript
// Delete
FormData {
  actionName: 'delete',
  id: '123'
}

// Validate (true)
FormData {
  actionName: 'validate',
  id: '456',
  validation: 'true'
}

// Validate (false)
FormData {
  actionName: 'validate',
  id: '456',
  validation: 'false'
}

// Ship (online)
FormData {
  actionName: 'ship',
  id: '789',
  shipped: 'true'
}

// Ship (offline)
FormData {
  actionName: 'ship',
  id: '789',
  shipped: 'false'
}
```

## Running Tests

```bash
# Run all tests for this component
npm test -- manageArticle.test.tsx

# Run with coverage
npm test -- manageArticle.test.tsx --coverage

# Run in watch mode
npm test -- manageArticle.test.tsx --watch
```

## Critical Scenarios Covered

### ✅ Delete Flow
1. User searches for article
2. User clicks delete button
3. Confirmation modal appears
4. User confirms deletion
5. Server action called with delete + id
6. Modal closes
7. Page scrolls to top

### ✅ Validate/Invalidate Flow
1. User searches for article
2. User clicks validate button
3. Confirmation modal appears with two options
4. User clicks "Valider" → validation=true sent
5. OR user clicks "Invalider" → validation=false sent
6. Server action called
7. Modal closes
8. Page scrolls to top

### ✅ Ship/Unship Flow (MEP)
1. User searches for article
2. User clicks ship button
3. MEP modal appears with two options
4. User clicks "ONLINE" → shipped=true sent
5. OR user clicks "OFFLINE" → shipped=false sent
6. Server action called
7. Modal closes
8. Page scrolls to top

### ✅ Back to Search Flow
1. User is viewing article actions
2. User clicks "Retour à la recherche"
3. cancelSearchDisplay set to true
4. Search interface resets
5. No page navigation occurs (preventDefault)

### ✅ Edge Case: Rapid Action Changes
1. User clicks delete
2. User immediately clicks validate
3. User immediately clicks ship
4. Final modal shows ship content
5. No errors or race conditions

## Modal Mock Implementation

The modal mock uses a clever technique to handle classList operations:

```typescript
// Modal maintains internal isActive state
const [isActive, setIsActive] = React.useState(false);

// When classList.add('is-active') is called
modalRef.current.classList.add = (className) => {
  if (className === 'is-active') setIsActive(true);
};

// When classList.remove('is-active') is called
modalRef.current.classList.remove = (className) => {
  if (className === 'is-active') setIsActive(false);
};

// className updates reactively
<div className={isActive ? 'is-active' : ''}>
```

This allows tests to verify both:
1. The actual className in the DOM
2. The component's behavior without mocking classList as a spy

## Notes

- All tests use async/await pattern for proper React state updates
- Tests use `waitFor` to handle asynchronous operations
- Modal mock closely mirrors actual behavior with classList manipulation
- Tests are isolated with proper cleanup in beforeEach/afterEach
- Coverage metrics show excellent test quality (99%+ coverage)
- Only line 185 (a guard clause) is not covered
- The `sendAction` helper function is fully tested through all action flows
- FormData construction is verified for all three action types
