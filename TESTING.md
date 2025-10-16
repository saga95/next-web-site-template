# Testing Guide

This template uses **Jest** and **React Testing Library** for unit and integration testing.

## Test Structure

```
src/
├── components/
│   └── __tests__/          # Component tests
├── hooks/
│   └── __tests__/          # Custom hook tests
├── lib/
│   └── __tests__/          # Utility function tests
└── pages/
    └── __tests__/          # Page component tests
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Configuration

### jest.config.js
- Configures Jest for Next.js environment
- Sets up module path aliases (@/*)
- Defines coverage thresholds (70% minimum)
- Configures test file patterns

### jest.setup.ts
- Imports @testing-library/jest-dom for DOM matchers
- Mocks Next.js router
- Mocks i18next for internationalization
- Mocks Material UI theme
- Sets up window.matchMedia and IntersectionObserver

## Writing Tests

### Component Tests
```typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Hook Tests
```typescript
import { renderHook } from '@testing-library/react'
import { useMyHook } from '../useMyHook'

describe('useMyHook', () => {
  it('returns expected value', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current).toBe(expectedValue)
  })
})
```

### Utility Function Tests
```typescript
import { myUtility } from '../utils'

describe('myUtility', () => {
  it('processes input correctly', () => {
    expect(myUtility('input')).toBe('expected output')
  })
})
```

## Testing Best Practices

1. **AAA Pattern**: Arrange, Act, Assert
2. **Test Behavior, Not Implementation**: Focus on what users see and do
3. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
4. **Mock External Dependencies**: Mock API calls, third-party libraries
5. **Keep Tests Simple**: One assertion per test when possible
6. **Test Edge Cases**: Empty states, errors, loading states

## Coverage Thresholds

Current thresholds set in `jest.config.js`:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Mocked Dependencies

The following are automatically mocked in tests:
- **next/router**: Using `next-router-mock`
- **react-i18next**: Returns keys instead of translations
- **@mui/material/styles**: Provides basic theme structure
- **window.matchMedia**: For responsive design tests
- **IntersectionObserver**: For lazy loading tests

## Common Testing Scenarios

### Form Testing
```typescript
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()
await user.type(screen.getByLabelText(/email/i), 'test@example.com')
await user.click(screen.getByRole('button', { name: /submit/i }))
```

### Async Testing
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

### Error Testing
```typescript
expect(() => dangerousFunction()).toThrow('Error message')
```

## Debugging Tests

### Run specific test file
```bash
npm test -- ContactForm.test.tsx
```

### Run tests matching pattern
```bash
npm test -- --testNamePattern="renders correctly"
```

### Debug in VS Code
Add breakpoints and use the Jest extension or add this to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
