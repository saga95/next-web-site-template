# /audit

Scan the entire codebase for design inconsistencies and theme violations.

## What I check:

1. **Hardcoded colors** — any hex, rgb, hsl values not from tokens
2. **Hardcoded spacing** — arbitrary px/rem values not from tokens
3. **Rogue fonts** — font-family declarations not from design system
4. **Missing dark mode** — components without dark: variants
5. **Missing ARIA labels** — interactive elements without accessibility attributes
6. **Storybook coverage** — components missing stories
7. **Responsive gaps** — components missing mobile breakpoints
8. **z-index chaos** — z-index values not from tokens.zIndex

## Output:

- A prioritized violation report grouped by severity (Critical / Warning / Info)
- Auto-fix suggestions for each violation
- Optional: `--fix` flag to auto-correct simple violations

## Usage:

```
/audit
/audit --fix
/audit --only=colors
/audit src/components/Dashboard
```

## Example Output:

```
🔴 CRITICAL (3 violations)
  src/components/Button.tsx:14  — hardcoded color #3b82f6 → use tokens.colors.brand[500]
  src/components/Card.tsx:8     — hardcoded padding 16px → use tokens.spacing[4]

🟡 WARNING (5 violations)
  src/components/Modal.tsx      — missing dark mode styles
  src/components/Table.tsx      — no Storybook story found

🔵 INFO (2 suggestions)
  src/components/Nav.tsx        — z-index: 999 → use tokens.zIndex.sticky
```
