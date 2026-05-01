# /design-system

Bootstrap or update the project design system.

## What I do:

1. Read existing `design-system/tokens.ts` if it exists
2. Scan the codebase for existing color/spacing patterns
3. Generate or update the full token set
4. Create/update `design-system/theme.ts` (light + dark)
5. Generate CSS custom properties in `src/styles/tokens.css`
6. Create a Tailwind config extension in `tailwind.config.ts` if Tailwind is used
7. Generate a Storybook `Colors.stories.tsx` and `Typography.stories.tsx` for visual documentation

## Output files:

- `design-system/tokens.ts`
- `design-system/theme.ts`
- `src/styles/tokens.css`
- `tailwind.config.ts` (updated)
- `src/stories/design-system/Colors.stories.tsx`
- `src/stories/design-system/Typography.stories.tsx`
- `src/stories/design-system/Spacing.stories.tsx`

## Usage:

```
/design-system
/design-system --brand-color=#6366F1 --font=Inter
/design-system --from-figma  (reads Figma tokens JSON if present)
```
