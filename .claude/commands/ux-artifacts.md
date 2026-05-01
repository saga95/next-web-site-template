# /empathy-map

Generate an empathy map for a given persona.

## Sections covered:

- **Says** — direct quotes, things they say out loud
- **Thinks** — internal thoughts, worries, aspirations
- **Does** — observable actions and behaviors
- **Feels** — emotional state, frustrations, satisfactions
- **Pain Points** — key problems to solve
- **Gains** — outcomes they desire

## Output:

- `ux-docs/empathy-maps/[persona]-empathy-map.md`
- `src/stories/ux/EmpathyMap.[Persona].stories.tsx`

## Usage:

```
/empathy-map "Sarah the Admin"
/empathy-map --persona=ux-docs/personas/sarah.md
```

---

# /ia

Generate an Information Architecture diagram for the project.

## What I do:

1. Scan existing routes and page components to auto-discover structure
2. Map content hierarchy and navigation relationships
3. Output a Mermaid diagram + a written hierarchy document
4. Identify orphaned pages, deep nesting issues, and navigation gaps

## Output:

- `ux-docs/information-architecture/ia-diagram.md` (Mermaid)
- `ux-docs/information-architecture/ia-notes.md`

## Usage:

```
/ia
/ia --depth=3
```

---

# /sitemap

Generate a visual sitemap of the entire application.

## What I do:

1. Auto-discover all routes from React Router config or Next.js pages
2. Map public vs authenticated pages
3. Show page relationships, parent/child hierarchy
4. Flag unreachable pages

## Output:

- `ux-docs/sitemaps/sitemap.md` (Mermaid)
- `ux-docs/sitemaps/sitemap.xml` (SEO-ready XML)

## Usage:

```
/sitemap
/sitemap --include-auth
```

---

# /journey

Generate a user journey map for a persona completing a specific goal.

## Sections:

- Stages (Awareness → Consideration → Decision → Onboarding → Retention)
- Actions per stage
- Thoughts per stage
- Emotions (plotted on a curve: 1–10)
- Pain points per stage
- Opportunities per stage
- Touchpoints (web, email, mobile, support)

## Output:

- `ux-docs/user-journeys/[persona]-[goal]-journey.md`
- `src/stories/ux/Journey.[Persona].stories.tsx`

## Usage:

```
/journey "Sarah" "complete first project setup"
/journey --persona=sarah --goal="upgrade plan"
```

---

# /mockup

Generate a hi-fidelity React mockup using the full design system.

## What I do:

1. Read `design-system/tokens.ts` and `design-system/theme.ts`
2. Build a production-quality React component with real styling
3. Use Tailwind or CSS modules — whichever the project uses
4. Include hover states, focus states, loading states, error states
5. Auto-generate Storybook story with all states documented

## Output:

- `src/components/[ComponentName]/[ComponentName].tsx`
- `src/components/[ComponentName]/[ComponentName].module.css` (if needed)
- `src/stories/[ComponentName].stories.tsx`

## Usage:

```
/mockup dashboard
/mockup "pricing page"
/mockup "user profile card" --dark
```

---

# /storybook

Generate a Storybook story for an existing component.

## What I generate:

- Default story
- All variant stories (size, color, state)
- Interactive controls (argTypes)
- Dark mode story
- Mobile viewport story
- Accessibility notes in docs

## Output:

- `src/stories/[ComponentName].stories.tsx`

## Usage:

```
/storybook Button
/storybook src/components/ui/Card.tsx
/storybook --all  (generates stories for all components missing them)
```
