# CreateArticleForm Component Tests

## Overview

This test suite provides comprehensive unit testing for the `CreateArticleForm` component using Vitest and React Testing Library. The component manages the creation of articles through a form interface with validation, server actions, and dynamic URL management.

## Test Coverage

Current coverage: **96% statements, 100% branches, 75% functions**

### Test Categories

#### 1. Component Rendering (3 tests)
- **should render the component successfully**: Verifies that the component renders without errors and displays the main title and form.
- **should render ArticleTitle with correct props**: Checks that the ArticleTitle component receives the correct props (level, size, color, spacings).
- **should render the form with all input fields**: Ensures all required form inputs are present (title, introduction, audio URL, illustration URL, submit button).

#### 2. Form Initialization (3 tests)
- **should initialize useForm with correct configuration**: Validates that react-hook-form is initialized with the correct mode, reValidateMode, and resolver settings.
- **should initialize form with empty default values**: Confirms all form fields start with empty default values.
- **should register the urls field**: Verifies that the dynamic urls array field is properly registered with the form.

#### 3. Form Submission (4 tests)
- **should call handleSubmit when form is submitted**: Tests that form submission triggers the handleSubmit callback.
- **should call startTransition on form submission**: Ensures React's startTransition is used for concurrent rendering during submission.
- **should disable submit button when isPending is true**: Verifies the submit button is disabled and shows loading state during submission.
- **should enable submit button when isPending is false**: Confirms the submit button is enabled and shows normal text when not submitting.

#### 4. URL Management (2 tests)
- **should call addInputs when add URL button is clicked**: Tests the functionality to add new URL input fields.
- **should call removeInputs when remove URL button is clicked**: Tests the functionality to remove URL input fields.

#### 5. Main Content Validation (1 test)
- **should update main content via getMainContent callback**: Verifies that the rich text editor's content updates are properly propagated to the form state.

#### 6. Error Handling (1 test)
- **should display errors when validation fails**: Tests that validation errors are properly captured in the form state.

#### 7. Post-submission Behavior (1 test)
- **should not call scrollTopAction before submission**: Ensures the scroll action is not called prematurely.

#### 8. Server Action Integration (1 test)
- **should initialize useActionState with wrapped action**: Verifies that the server action is properly integrated with React's useActionState hook.

#### 9. Accessibility (2 tests)
- **should have proper form structure**: Confirms the component renders a proper HTML form element.
- **should have a submit button**: Ensures the submit button has the correct type attribute.

#### 10. Edge Cases (2 tests)
- **should handle empty urls array**: Tests behavior when no URL inputs are present.
- **should handle form submission with empty data gracefully**: Ensures the form handles submission with missing data without crashing.

## Mock Dependencies

### External Libraries
- **react-hook-form**: Mocked to control form state and methods
- **react**: Mocked useActionState and startTransition for server actions
- **@testing-library/user-event**: Used for simulating user interactions

### Internal Modules
- **@/models/articleSchema**: Article validation schema (Zod)
- **@/app/articleActions**: createArticleAction server action
- **@/app/components/single-elements/articleHTMLForm**: Main form UI component
- **@/app/components/single-elements/ArticleTitle**: Page title component
- **@/lib/utility-functions**: addRemoveInputsFactory for URL management
- **@/app/editor/components/resolvers/customResolver**: Custom form resolver
- **@/lib/useMaincontentValidation**: Custom hook for main content validation
- **@/lib/toastCallbacks**: Toast notification utilities

## Running the Tests

### Run all CreateArticleForm tests
```bash
npm test -- test-utils/editor/components/formComponents/createArticles.test.tsx
```

### Run with coverage
```bash
npm test -- test-utils/editor/components/formComponents/createArticles.test.tsx --coverage
```

### Run in watch mode (during development)
```bash
npm test -- test-utils/editor/components/formComponents/createArticles.test.tsx --watch
```

### Run with verbose output
```bash
npm test -- test-utils/editor/components/formComponents/createArticles.test.tsx --reporter=verbose
```

## Test Structure

```
CreateArticleForm
├── Component Rendering
├── Form Initialization
├── Form Submission
├── URL Management
├── Main Content Validation
├── Error Handling
├── Post-submission Behavior
├── Server Action Integration
├── Accessibility
└── Edge Cases
```

## Key Testing Patterns

### 1. User Interaction Testing
Uses `@testing-library/user-event` for realistic user interactions:
```typescript
const user = userEvent.setup();
await user.click(submitButton);
```

### 2. Mock Function Verification
Verifies that callbacks and functions are called correctly:
```typescript
expect(mockFormMethods.handleSubmit).toHaveBeenCalled();
expect(mockFormMethods.setValue).toHaveBeenCalledWith('main', 'Updated main content');
```

### 3. Component Props Testing
Checks that child components receive correct props:
```typescript
expect(titleElement).toHaveAttribute('data-level', 'h2');
expect(titleElement).toHaveAttribute('data-color', 'white');
```

### 4. Form State Testing
Validates form state changes and error handling:
```typescript
mockFormMethods.formState = { errors: { title: { message: 'Title is required' } } };
```

## Mock Data

### Form Default Values
```typescript
{
  title: '',
  introduction: '',
  main: '',
  main_audio_url: '',
  url_to_main_illustration: '',
  urls: []
}
```

### Sample Valid Form Data
```typescript
{
  title: 'Test Article',
  introduction: 'This is a test introduction with enough characters',
  main: 'This is the main content with enough characters to pass validation',
  main_audio_url: 'https://example.com/audio.mp3',
  url_to_main_illustration: 'https://example.com/image.jpg',
  urls: []
}
```

## Common Testing Scenarios

### Testing Form Submission
```typescript
const user = userEvent.setup();
render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);
const submitButton = screen.getByTestId('submit-button');
await user.click(submitButton);
expect(mockFormMethods.handleSubmit).toHaveBeenCalled();
```

### Testing Dynamic Field Updates
```typescript
const updateButton = screen.getByText('Update Main Content');
await user.click(updateButton);
expect(mockFormMethods.setValue).toHaveBeenCalledWith('main', 'Updated main content');
```

### Testing Conditional Rendering
```typescript
(React.useActionState as Mock).mockReturnValue([null, vi.fn(), true]);
render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);
expect(submitButton).toBeDisabled();
```

## Troubleshooting

### Test Fails: "Cannot find module"
Ensure all mocks are defined at the top of the test file before any imports.

### Test Fails: "TypeError: X is not a function"
Check that the mocked function is properly defined in the mock setup:
```typescript
vi.fn(() => expectedReturnValue)
```

### Test Fails: Element not found
Use `screen.debug()` to see what's actually rendered:
```typescript
render(<CreateArticleForm scrollTopAction={mockScrollTopAction} />);
screen.debug();
```

## Best Practices

1. **Clear Mocks Between Tests**: Always use `vi.clearAllMocks()` in `beforeEach`
2. **Realistic User Interactions**: Use `userEvent` instead of `fireEvent` for more realistic simulations
3. **Async Handling**: Use `waitFor` for operations that involve async state updates
4. **Descriptive Test Names**: Test names should clearly describe what is being tested
5. **Arrange-Act-Assert**: Follow the AAA pattern for clear test structure
6. **Isolated Tests**: Each test should be independent and not rely on other tests

## Future Enhancements

- [ ] Add integration tests with real form submissions
- [ ] Test error recovery scenarios
- [ ] Add accessibility testing with jest-axe
- [ ] Test keyboard navigation
- [ ] Add visual regression tests for form states
- [ ] Test with different viewport sizes
- [ ] Add performance testing for large forms

## Related Documentation

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Add tests to the appropriate describe block
3. Update this README with new test descriptions
4. Ensure all tests pass before committing
5. Maintain or improve code coverage

## Maintenance Notes

- Mock implementations should mirror actual component interfaces
- Keep test data realistic and representative of production use
- Update tests when component behavior changes
- Review and update deprecated testing patterns regularly
