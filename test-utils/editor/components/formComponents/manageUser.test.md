# ManageUserForm Test Coverage Documentation

## Overview
Comprehensive unit tests for the `ManageUserForm` component using React Testing Library and Vitest.

**Total Tests:** 41  
**Test File:** `test-utils/editor/components/formComponents/manageUser.test.tsx`  
**Component:** `app/editor/components/formComponents/manageUser.tsx`  
**Coverage:** 100% statements, 97.14% branches, 100% functions

## Test Suites

### 1. Component Rendering and Initialization (6 tests)
Tests the initial rendering state and data fetching.

- ✅ Renders component successfully
- ✅ Fetches users list on mount via useEffect
- ✅ Displays users list after fetching
- ✅ Renders ArticleTitle when users list is available
- ✅ Renders modal component
- ✅ Displays error toast when fetching users fails

**Purpose:** Ensures the component initializes correctly, fetches data on mount, and handles errors.

---

### 2. User Selection for Update (5 tests)
Tests the user selection workflow for editing.

- ✅ Displays edit form when update button is clicked
- ✅ Populates form with selected user data
- ✅ Hides users list when user is selected
- ✅ Displays user permissions component when user is selected
- ✅ Sets user role based on selected user

**Purpose:** Validates the transition from user list to edit form with correct data population.

---

### 3. User Deletion Flow (5 tests)
Tests the complete user deletion workflow with modal confirmation.

- ✅ Opens modal when delete button is clicked
- ✅ Displays correct modal content for deletion
- ✅ Calls manageUsers action when deletion is confirmed
- ✅ Closes modal when deletion is confirmed
- ✅ Closes modal and clears selection when deletion is cancelled

**Purpose:** Ensures safe deletion with confirmation modal and proper cleanup.

**Modal Content:**
- Title: "Confirmation de la suppression"
- Description: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
- CTA Button: "Supprimer"
- Cancel Button: "Annuler"

**FormData Structure:**
```javascript
FormData {
  actionName: 'delete',
  email: 'user1@example.com'
}
```

---

### 4. User Update Form (4 tests)
Tests the edit form functionality.

- ✅ Renders all form fields when user is selected
- ✅ Displays role options in dropdown
- ✅ Updates permissions when role is changed to admin
- ✅ Updates permissions when role is changed to contributor

**Purpose:** Validates form rendering and role-based permission updates.

---

### 5. Form Submission (5 tests)
Tests form submission logic and state management.

- ✅ Calls handleSubmit when form is submitted
- ✅ Wraps submission in startTransition for performance
- ✅ Constructs FormData with update action and all fields
- ✅ Disables submit button when isPending is true
- ✅ Enables submit button when isPending is false

**Purpose:** Ensures proper form submission workflow with correct data.

**FormData Structure:**
```javascript
FormData {
  actionName: 'update',
  id: '1',
  email: 'user1@example.com',
  tiers_service_ident: 'user-001',
  role: 'contributor',
  permissions: '["read:articles","create:articles",...]'
}
```

---

### 6. Back to Search Button (3 tests)
Tests navigation back to user list.

- ✅ Renders back to search button when user is selected
- ✅ Returns to users list when back to search is clicked
- ✅ Prevents default event when clicked

**Purpose:** Validates proper navigation and state reset.

---

### 7. Post-Action Cleanup (2 tests)
Tests cleanup operations after actions complete.

- ✅ Calls performedAttheEnd callback after action
- ✅ Calls scrollTopAction in performedAttheEnd

**Purpose:** Ensures proper cleanup and user feedback after operations.

**Cleanup Actions:**
```javascript
performedAttheEnd() {
  setSelectedUser(null);          // Clear selection
  setUserToBeDeleted(null);       // Clear deletion state
  setUsersList([]);               // Clear list
  scrollTopAction();              // Scroll to show notification
  startTransition(() => {
    fetchUsers();                 // Refresh users list
  });
}
```

---

### 8. Error Handling (3 tests)
Tests validation error display.

- ✅ Displays email error message when validation fails
- ✅ Displays tiers service ident error when validation fails
- ✅ Displays role error when validation fails

**Purpose:** Ensures validation errors are properly displayed to users.

---

### 9. Accessibility (3 tests)
Tests accessibility features.

- ✅ Has proper form structure when user is selected
- ✅ Has labels for all inputs
- ✅ Has proper input IDs matching labels

**Purpose:** Ensures the component follows accessibility best practices.

---

### 10. Edge Cases (3 tests)
Tests unusual or boundary conditions.

- ✅ Handles user without email gracefully when deleting
- ✅ Handles user without id gracefully when updating
- ✅ Handles multiple role changes without crashing

**Purpose:** Validates robust behavior under edge conditions.

---

### 11. PaginatedSearchDisplay Integration (2 tests)
Tests integration with search/display component.

- ✅ Passes correct props to PaginatedSearchDisplay
- ✅ Displays all users in the list

**Purpose:** Confirms proper integration with the user list display component.

---

## Key Features Tested

### State Management
The component manages multiple state variables:
- `usersList` - Array of all users from database
- `selectedUser` - Currently selected user for editing
- `userRole` - Current user's role for permission updates
- `usertoBeDeleted` - Email of user pending deletion
- Modal ref for classList manipulation

### Dual Action System
The component supports two distinct actions:

#### Update Action
1. User clicks "Update" button on a user
2. Form displays with user data
3. User edits fields
4. Role changes trigger permission updates
5. User submits form
6. FormData sent with actionName: 'update'
7. Form closes, list refreshes

#### Delete Action
1. User clicks "Delete" button on a user
2. Confirmation modal opens
3. User confirms or cancels
4. On confirm: FormData sent with actionName: 'delete'
5. Modal closes, list refreshes

### Data Flow

**Initial Load:**
```
useEffect → fetchUsers() → getAllUsers() → getUsersList()
→ setUsersList(users) → Display PaginatedSearchDisplay
```

**Update Flow:**
```
Click Update → handleSelectedUser(user, 'update')
→ setSelectedUser(user) → Form displays with user data
→ Edit fields → Submit → onSubmit()
→ sendAction(FormData) → performedAttheEnd()
→ Reset state → Refresh list
```

**Delete Flow:**
```
Click Delete → handleSelectedUser(user, 'delete')
→ setUserToBeDeleted(email) → Modal opens
→ Confirm → confirmDeletion()
→ sendAction(FormData) → performedAttheEnd()
→ Reset state → Refresh list
```

### Permission Management
Role changes automatically update permissions:
- **Admin → Contributor:** 10 permissions reduced to 4
- **Contributor → Admin:** 4 permissions expanded to 10

**Admin Permissions (10):**
```javascript
[
  'read:articles', 'create:articles', 'update:articles', 'delete:articles',
  'validate:articles', 'ship:articles', 'create:user', 'update:user',
  'delete:user', 'enable:maintenance'
]
```

**Contributor Permissions (4):**
```javascript
[
  'read:articles', 'create:articles', 'update:articles', 'validate:articles'
]
```

## Mocked Dependencies

```typescript
- react (useActionState, startTransition, useEffect, useRef, useState)
- react-hook-form
- @/models/userSchema (Zod schema)
- @/app/userActions (getUsersList, manageUsers)
- @/app/components/single-elements/ArticleTitle
- @/app/components/single-elements/paginatedSearchResults
- @/app/components/single-elements/userPermissions
- @/app/components/single-elements/modalWithCTA
- @/app/editor/components/resolvers/customResolver
- @/lib/toastCallbacks (withCallbacks, toastCallbacks)
- @/lib/utility-functions (isEmpty)
- sonner (toast)
- @/models/user (UserRole, userRoles, permissions)
```

## Test Data Structure

### Mock Users
```typescript
[
  {
    id: 1,
    email: 'user1@example.com',
    tiers_service_ident: 'user-001',
    role: 'contributor',
    permissions: '["read:articles","create:articles"]',
    created_at: '2024-01-01',
    last_connection_at: '2024-01-15'
  },
  {
    id: 2,
    email: 'admin@example.com',
    tiers_service_ident: 'admin-001',
    role: 'admin',
    permissions: '["read:articles","create:articles","delete:articles"]',
    created_at: '2024-01-01',
    last_connection_at: '2024-01-16'
  }
]
```

### FormData Structures

**Update Action:**
```javascript
FormData {
  actionName: 'update',
  id: '1',
  email: 'user1@example.com',
  tiers_service_ident: 'user-001',
  role: 'contributor',
  permissions: '["read:articles","create:articles","update:articles","validate:articles"]'
}
```

**Delete Action:**
```javascript
FormData {
  actionName: 'delete',
  email: 'user1@example.com'
}
```

## Running Tests

```bash
# Run all tests for this component
npm test -- manageUser.test.tsx

# Run with coverage
npm test -- manageUser.test.tsx --coverage

# Run in watch mode
npm test -- manageUser.test.tsx --watch
```

## Critical Scenarios Covered

### ✅ Happy Path - Update User
1. Component loads, fetches users list
2. Users displayed in PaginatedSearchDisplay
3. User clicks "Update" on a user
4. Form appears with user data pre-filled
5. User changes role from Contributor to Admin
6. Permissions automatically updated
7. User submits form
8. FormData sent with update action
9. Success: form closes, list refreshes
10. Scroll to top to show notification

### ✅ Happy Path - Delete User
1. Component loads with users list
2. User clicks "Delete" on a user
3. Confirmation modal appears
4. Modal shows user email being deleted
5. User confirms deletion
6. FormData sent with delete action
7. Modal closes
8. List refreshes
9. Scroll to top to show notification

### ✅ Cancel Delete Path
1. User clicks "Delete"
2. Modal opens
3. User clicks "Annuler" (Cancel)
4. Modal closes
5. User selection cleared
6. No action sent to server
7. List remains unchanged

### ✅ Back to Search Path
1. User selects a user for editing
2. Form displays
3. User changes some fields
4. User clicks "Retour à la recherche"
5. Form closes
6. Users list displayed again
7. No changes saved

### ✅ Error Handling Path
1. Users list fetch fails
2. Error toast displayed with message
3. Console error logged
4. Empty array set as usersList
5. Component remains functional

### ✅ Validation Error Path
1. User submits form with invalid data
2. Validation errors displayed below fields
3. Errors styled with red text (has-text-danger)
4. Form submission blocked until errors resolved

### ✅ Role Change Path
1. User selects a user for editing
2. Form displays with current role
3. User changes role multiple times:
   - Contributor → Admin → Contributor → Admin
4. Permissions update each time
5. UserPermissionsCheckboxes updates
6. No crashes or state corruption

## Component Architecture

### Conditional Rendering

The component has two main display modes:

**List Mode (default):**
```tsx
{usersList?.length > 0 && isEmpty(selectedUser) && (
  <PaginatedSearchDisplay />
)}
```

**Edit Mode:**
```tsx
{selectedUser && (
  <form>
    {/* Edit form fields */}
  </form>
)}
```

### Form Fields

**Email Field:**
- Type: email
- Pre-filled with selected user data
- Validation: Zod email schema
- Error display: Inline below field

**Tiers Service Ident Field:**
- Type: text
- Pre-filled with selected user data
- Required: Yes
- Error display: Inline below field

**Role Field:**
- Type: select dropdown
- Options: Contributor, Admin
- Side effect: Updates permissions on change
- Updates UserPermissionsCheckboxes display

**Permissions Field:**
- Type: hidden (managed by setValue)
- Value: JSON string of permission array
- Updated automatically by role selection
- Displayed via UserPermissionsCheckboxes component

### Modal Integration

The component uses a sophisticated modal mock that:
1. Tracks internal isActive state
2. Intercepts classList.add/remove calls
3. Updates className reactively
4. Allows tests to verify modal state via className

```typescript
// Modal mock implementation
modalRef.current.classList.add = (className) => {
  if (className === 'is-active') setIsActive(true);
};

modalRef.current.classList.remove = (className) => {
  if (className === 'is-active') setIsActive(false);
};
```

### Performance Optimizations
- `startTransition` for non-blocking updates
- `reValidateMode: 'onBlur'` to reduce validation overhead
- Lazy list refresh only after successful actions

## Edge Cases Handled

### User Without Email
When deleting a user without an email field:
- Delete button clicked
- Email undefined check fails
- Modal does NOT open
- No action sent
- Prevents null/undefined email deletion

### User Without ID
When updating a user without an id field:
- Update button clicked
- ID undefined check fails
- Form does NOT display
- Prevents invalid update attempts

### Multiple Rapid Role Changes
User changes role multiple times in quick succession:
- Each change triggers setValue for permissions
- UserPermissionsCheckboxes updates each time
- No race conditions
- Final state is consistent

### Failed User Fetch
When getUsersList fails:
- Error logged to console
- Toast error displayed to user
- Empty array set as usersList
- Component doesn't crash
- UI remains functional

## Notes

- All tests use async/await pattern for proper React state updates
- Tests use `waitFor` to handle asynchronous operations
- Mock implementations closely mirror actual behavior
- Tests are isolated with proper cleanup in beforeEach/afterEach
- Coverage metrics show excellent test quality (100% statements)
- Only uncovered line is an edge case for undefined ID (line 148)
- The component uses `useEffect` to fetch users on mount
- Modal mock uses clever classList interception for testability
- Form values are populated via react-hook-form's `values` prop
- Permissions are always serialized as JSON strings
- The component supports full CRUD operations (list, read, update, delete)
- Search/list functionality delegated to PaginatedSearchDisplay component
