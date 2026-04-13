## Description

<!-- What does this PR do? Link to related issue(s). -->

Fixes #

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Security patch

## Quality Gate Checklist

### Code Quality
- [ ] I have run `pnpm quality:quick` with no errors
- [ ] My code follows the project coding standards
- [ ] I have added/updated tests for my changes
- [ ] Test coverage meets the 70% threshold

### Security
- [ ] No secrets, tokens, or credentials in code
- [ ] User input is sanitized (DOMPurify / Zod validation)
- [ ] Error messages do not expose internal details
- [ ] No use of `eval()`, `innerHTML`, or `dangerouslySetInnerHTML`

### Performance
- [ ] No unnecessary re-renders introduced
- [ ] Large dependencies are code-split / lazy loaded
- [ ] Images use Next.js `<Image>` with proper dimensions

### Accessibility
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader tested (or `aria-*` attributes verified)
- [ ] Color contrast meets WCAG 2.2 AA (4.5:1 text, 3:1 UI)

### Internationalization
- [ ] All user-facing text uses `useTranslation()` / i18n keys
- [ ] Translations added to `public/locales/en/*.json`

### Documentation
- [ ] I have added SEO metadata (if adding a new page)
- [ ] I have updated documentation if needed

## Screenshots (if applicable)

<!-- Add before/after screenshots for UI changes -->

## Testing Notes

<!-- How should reviewers test this PR? -->
