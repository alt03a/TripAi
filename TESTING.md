# Testing Strategy

## Testing Framework Setup: Phase 8

### 🧪 Testing Stack (To Be Implemented)

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "vitest": "^1.0.0",
    "jsdom": "^23.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### 📝 Testing Levels

#### 1. Unit Tests (Vitest + React Testing Library)

Test individual components and utilities:

```typescript
// Example: useAuth.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth', () => {
  it('should sign in user successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(result.current.user).toBeTruthy();
    });
  });
});
```

#### 2. Integration Tests

Test component interactions:

```typescript
// Example: TripPlanner.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TripPlanner } from '@/components/trips/TripPlanner';

describe('TripPlanner', () => {
  it('should generate itinerary after form submission', async () => {
    render(<TripPlanner onComplete={jest.fn()} />);
    
    fireEvent.change(screen.getByLabelText('Destination'), {
      target: { value: 'Paris' }
    });
    
    fireEvent.click(screen.getByText('Generate Itinerary'));
    
    await screen.findByText('Itinerary Generated!');
  });
});
```

#### 3. End-to-End Tests (Playwright)

Test complete user workflows:

```typescript
// Example: auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up and access dashboard', async ({ page }) => {
  await page.goto('/auth');
  
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  await page.click('button:has-text("Sign Up")');
  
  await expect(page).toHaveURL('/');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

### 🎯 Testing Priority

| Priority | Test Type | Coverage Target |
|----------|-----------|-----------------|
| High | Auth flows | 100% |
| High | Critical paths | 90% |
| Medium | UI components | 70% |
| Low | Edge cases | 50% |

### 📊 Coverage Goals

```bash
# Run tests with coverage
npm run test:coverage

# Coverage targets
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%
```

### 🔍 What to Test

#### Critical User Flows
- [ ] Authentication (sign up, sign in, sign out)
- [ ] Trip creation and editing
- [ ] AI chat interactions
- [ ] Destination search and filtering
- [ ] Document upload and management

#### Component Tests
- [ ] Form validation and error handling
- [ ] Button states (loading, disabled)
- [ ] Modal open/close behavior
- [ ] Data loading states
- [ ] Error boundaries

#### Hook Tests
- [ ] useAuth authentication state
- [ ] useTrips data fetching
- [ ] useDestinations filtering
- [ ] useChat message handling

#### Utility Tests
- [ ] Input validation schemas
- [ ] API client error handling
- [ ] Date formatting utilities
- [ ] URL sanitization

### 🚀 Test Automation

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:e2e
```

### 🎭 Test Best Practices

1. **Arrange-Act-Assert Pattern**
```typescript
test('example', () => {
  // Arrange
  const user = { name: 'John' };
  
  // Act
  const result = formatUserName(user);
  
  // Assert
  expect(result).toBe('John');
});
```

2. **Test User Behavior, Not Implementation**
```typescript
// ✅ Good
expect(screen.getByRole('button', { name: 'Save Trip' })).toBeInTheDocument();

// ❌ Bad
expect(component.state.isSaving).toBe(false);
```

3. **Mock External Dependencies**
```typescript
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signIn: vi.fn(),
    },
  },
}));
```

4. **Clean Up After Tests**
```typescript
afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});
```

### 🐛 Debugging Tests

```typescript
// Enable debug output
import { screen, render } from '@testing-library/react';

render(<Component />);
screen.debug(); // Prints DOM tree

// Pause test execution
await page.pause(); // Playwright
```

### 📚 Resources

- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Guide](https://vitest.dev/guide/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### 🎬 Next Steps

1. Set up Vitest configuration
2. Write tests for critical auth flow
3. Add tests for trip creation
4. Implement E2E tests for main user journeys
5. Set up CI/CD pipeline
6. Add coverage reporting
