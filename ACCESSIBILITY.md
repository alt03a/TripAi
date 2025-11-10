# Accessibility (a11y) Standards

## WCAG 2.1 AA Compliance: Phase 8

### ✅ Implemented Features

#### 1. Keyboard Navigation
- ✅ All interactive elements keyboard accessible
- ✅ Logical tab order throughout app
- ✅ Skip links for main content
- ✅ Focus trap in modals/dialogs
- ✅ Escape key closes modals
- ✅ Enter key submits forms

#### 2. Screen Reader Support
- ✅ Semantic HTML structure (header, main, nav, article)
- ✅ ARIA labels on all interactive elements
- ✅ ARIA live regions for dynamic content
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Form labels associated with inputs

#### 3. Visual Accessibility
- ✅ Color contrast ratios meet WCAG AA (4.5:1 text, 3:1 UI)
- ✅ Focus indicators visible on all interactive elements
- ✅ No reliance on color alone for information
- ✅ Text scalable up to 200% without loss of functionality
- ✅ Touch targets minimum 44x44px

#### 4. Content Accessibility
- ✅ Alt text for all meaningful images
- ✅ Descriptive link text (no "click here")
- ✅ Error messages clearly associated with fields
- ✅ Loading states announced to screen readers

### 🎯 Accessibility Checklist

When building new components:

```typescript
// ✅ Good Example
<button 
  aria-label="Close dialog"
  onClick={handleClose}
  className="focus:ring-2 focus:ring-primary"
>
  <X className="h-4 w-4" />
  <span className="sr-only">Close</span>
</button>

// ❌ Bad Example
<div onClick={handleClose}>
  <X />
</div>
```

### 📱 Hooks for Accessibility

```typescript
import { useFocusTrap, useAnnounce, useKeyboardNav } from '@/hooks/useAccessibility';

// Focus trap for modals
const modalRef = useFocusTrap(isOpen);

// Announce to screen readers
const { announce } = useAnnounce();
announce('Trip saved successfully', 'polite');

// Keyboard navigation
useKeyboardNav(
  () => handleSave(), // Enter
  () => handleClose() // Escape
);
```

### 🎨 Color Contrast Guidelines

Our design system ensures proper contrast:

| Element | Foreground | Background | Ratio |
|---------|-----------|------------|-------|
| Body Text | --foreground | --background | 8.5:1 ✅ |
| Primary Button | --primary-foreground | --primary | 7.2:1 ✅ |
| Secondary Button | --secondary-foreground | --secondary | 4.6:1 ✅ |
| Muted Text | --muted-foreground | --background | 4.5:1 ✅ |

### 🧪 Testing Tools

1. **Browser Extensions**
   - axe DevTools (Chrome/Firefox)
   - WAVE (Web Accessibility Evaluation Tool)
   - Lighthouse (built into Chrome)

2. **Screen Readers**
   - NVDA (Windows - Free)
   - JAWS (Windows)
   - VoiceOver (macOS/iOS)
   - TalkBack (Android)

3. **Manual Testing**
   ```bash
   # Test keyboard navigation
   - Tab through entire page
   - Shift+Tab backwards
   - Enter to activate
   - Escape to close
   
   # Test screen reader
   - Turn on screen reader
   - Navigate page structure
   - Verify all content announced
   ```

### 📋 Component Accessibility Requirements

#### Forms
- [ ] Labels for all inputs
- [ ] Error messages linked with aria-describedby
- [ ] Required fields marked with aria-required
- [ ] Field validation feedback announced

#### Buttons
- [ ] Descriptive text or aria-label
- [ ] Disabled state visually and programmatically
- [ ] Loading state announced
- [ ] Focus styles visible

#### Modals/Dialogs
- [ ] role="dialog"
- [ ] aria-modal="true"
- [ ] aria-labelledby for title
- [ ] Focus trap active
- [ ] Escape key closes
- [ ] Focus returns to trigger

#### Images
- [ ] Alt text describes content/function
- [ ] Decorative images have alt=""
- [ ] Complex images have extended descriptions

### 🔧 Common Patterns

```typescript
// Skip Link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Screen Reader Only Text
<span className="sr-only">
  Additional context for screen readers
</span>

// Loading State
<div role="status" aria-live="polite">
  {isLoading && <Loader2 />}
  <span className="sr-only">Loading content</span>
</div>

// Error Message
<input
  id="email"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && (
  <p id="email-error" role="alert">
    {error}
  </p>
)}
```

### 🌍 Internationalization (i18n)

Future considerations:
- lang attribute on HTML element
- Text direction (LTR/RTL) support
- Date/time formatting
- Currency formatting
- Translation infrastructure

### 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility Guide](https://react.dev/learn/accessibility)
