# /wireframe

Generate a lo-fi React wireframe component for a specific screen.

## What I do:

1. Read `design-system/tokens.ts` for spacing and layout rules
2. Build a React component using ONLY grayscale + layout — no colors, no imagery
3. Use placeholder boxes, lorem text, and clear labels
4. Add annotations as comments explaining design decisions
5. Auto-generate a Storybook story

## Wireframe Rules:

- All colors: neutral grays ONLY (from tokens.colors.neutral)
- No icons (use labeled boxes instead)
- No images (use aspect-ratio placeholder boxes)
- All spacing from tokens.spacing
- All components labeled with their purpose
- Include mobile + desktop viewports in Storybook

## Output files:

- `ux-docs/wireframes/[Screen]Wireframe.tsx`
- `src/stories/wireframes/[Screen].stories.tsx`

## Usage:

```
/wireframe dashboard
/wireframe "user profile page"
/wireframe login --mobile-first
```
