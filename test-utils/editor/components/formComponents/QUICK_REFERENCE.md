# CreateArticleForm Tests - Quick Reference

## 🚀 Quick Start

### Run Tests
```bash
npm test -- test-utils/editor/components/formComponents/createArticles.test.tsx
```

### Run with Coverage
```bash
npm test -- createArticles.test.tsx --coverage
```

### Watch Mode
```bash
npm test -- createArticles.test.tsx --watch
```

## 📊 Test Statistics

| Metric | Value |
|--------|-------|
| Total Tests | 20 |
| Passing | 20 (100%) |
| Statement Coverage | 96% |
| Branch Coverage | 100% |
| Function Coverage | 75% |
| Execution Time | ~150ms |

## 🧪 Test Categories

```
CreateArticleForm (20 tests)
├── Component Rendering (3)
├── Form Initialization (3)
├── Form Submission (4)
├── URL Management (2)
├── Main Content Validation (1)
├── Error Handling (1)
├── Post-submission Behavior (1)
├── Server Action Integration (1)
├── Accessibility (2)
└── Edge Cases (2)
```

## 🔑 Key Test Patterns

### Testing User Interactions
```typescript
const user = userEvent.setup();
await user.click(screen.getByTestId('submit-button'));
```

### Testing Form State
```typescript
render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);
expect(screen.getByPlaceholderText('Titre')).toBeInTheDocument();
```

### Testing Async Behavior
```typescript
await waitFor(() => {
  expect(mockFunction).toHaveBeenCalled();
});
```

### Testing Props
```typescript
const element = screen.getByTestId('article-title');
expect(element).toHaveAttribute('data-level', 'h2');
```

## 🎯 What's Tested

### ✅ Core Functionality
- Form rendering and initialization
- Field registration and validation
- Form submission flow
- Dynamic URL field management
- Rich text editor integration
- Error handling and display
- Loading states (isPending)

### ✅ React Features
- react-hook-form integration
- useActionState hook
- startTransition (concurrent rendering)
- Custom hooks (useMainContentValidation)

### ✅ User Interactions
- Button clicks (submit, add, remove)
- Form submission
- Content updates
- Loading states

### ✅ Edge Cases
- Empty data handling
- Empty URL arrays
- Form submission without changes

## 🔧 Mock Setup

### Form Methods Mock
```typescript
const mockFormMethods = {
  register: vi.fn(),
  handleSubmit: vi.fn((fn) => (e) => fn(mockFormData)),
  watch: vi.fn(),
  setValue: vi.fn(),
  getValues: vi.fn(() => ({ urls: [] })),
  reset: vi.fn(),
  trigger: vi.fn().mockResolvedValue(true),
  clearErrors: vi.fn(),
  formState: { errors: {} }
};
```

### Key Mocked Modules
- `react-hook-form` - Form management
- `@/app/articleActions` - Server actions
- `@/app/components/single-elements/articleHTMLForm` - Form UI
- `@/lib/utility-functions` - URL management
- `@/lib/toastCallbacks` - Notifications

## 📝 Common Commands

### Debug Rendered Output
```typescript
render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);
screen.debug();
```

### Check Element Presence
```typescript
expect(screen.getByText('Créer un article')).toBeInTheDocument();
expect(screen.queryByText('Not there')).not.toBeInTheDocument();
```

### Test Button States
```typescript
const button = screen.getByTestId('submit-button');
expect(button).toBeDisabled(); // or .not.toBeDisabled()
expect(button).toHaveTextContent('Submit');
```

### Simulate User Actions
```typescript
const user = userEvent.setup();
await user.click(element);
await user.type(input, 'text');
await user.clear(input);
```

## 🐛 Troubleshooting

### Test Failing: Element Not Found
```typescript
// Use screen.debug() to see what's rendered
screen.debug();

// Or query for specific element
const element = screen.queryByTestId('my-element');
console.log('Element found:', !!element);
```

### Test Failing: Mock Not Called
```typescript
// Verify mock was set up correctly
expect(mockFunction).toBeDefined();

// Check if it was called
console.log('Mock calls:', mockFunction.mock.calls);
```

### Test Failing: Async Timing
```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(element).toBeInTheDocument();
}, { timeout: 3000 });
```

## 📚 Related Files

- **Component:** `app/editor/components/formComponents/createArticles.tsx`
- **Tests:** `test-utils/editor/components/formComponents/createArticles.test.tsx`
- **Full Docs:** `test-utils/editor/components/formComponents/createArticles.README.md`
- **Summary:** `test-utils/editor/components/formComponents/TEST_SUMMARY.md`

## 🎨 Test Structure Template

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something specific', () => {
    // Arrange
    render(<Component />);
    
    // Act
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Assert
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

## ⚡ Performance Tips

1. Use `beforeEach` to reset mocks
2. Avoid unnecessary re-renders
3. Use `queryBy*` for elements that may not exist
4. Use `getBy*` for elements that must exist
5. Use `findBy*` for async elements

## 🔍 Coverage Report Location

```
lcfr/coverage/
├── index.html          # HTML coverage report
├── coverage-final.json # JSON coverage data
└── lcov.info          # LCOV format
```

Open HTML report:
```bash
open coverage/index.html
```

## 📖 External Resources

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [User Event API](https://testing-library.com/docs/user-event/intro)
- [Jest-DOM Matchers](https://github.com/testing-library/jest-dom)

---

**Last Updated:** 2024  
**Test File Version:** 1.0  
**Status:** ✅ All tests passing
