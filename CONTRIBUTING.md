# Contributing to Next.js Enterprise Template

Thank you for considering contributing! This guide will help you get started.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/saga95/next-web-site-template.git
cd next-web-site-template

# Run the bootstrap script
./scripts/bootstrap.sh

# Or setup manually
pnpm install
cp .env.example .env.local
pnpm dev
```

## Git Workflow

### Branch Strategy

| Branch        | Purpose                | Deploys to  |
| ------------- | ---------------------- | ----------- |
| `main`        | Production-ready code  | Production  |
| `staging`     | Pre-production testing | Staging     |
| `development` | Active development     | Development |

### Creating a Feature

```bash
git checkout development
git pull origin development
git checkout -b feature/your-feature-name

# Make your changes, then:
pnpm lint && pnpm type-check && pnpm test

git add .
git commit -m "feat: description of your feature"
git push origin feature/your-feature-name
# Open a PR to development
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix      | Usage                       |
| ----------- | --------------------------- |
| `feat:`     | New feature                 |
| `fix:`      | Bug fix                     |
| `docs:`     | Documentation only          |
| `style:`    | Formatting, no code change  |
| `refactor:` | Code restructuring          |
| `test:`     | Adding/updating tests       |
| `chore:`    | Build process, dependencies |

## Coding Standards

1. **TypeScript strict mode** — No `any` types. Use `unknown` when type is truly unknown.
2. **ESLint + Prettier** — Pre-commit hooks enforce these. Run `pnpm lint` before committing.
3. **Accessibility** — All interactive elements must meet WCAG 2.2 AA.
4. **i18n** — All user-facing text must use `useTranslation()`. Add keys to `public/locales/en/*.json`.
5. **Environment variables** — Use `getEnvVar()` / `getRequiredEnvVar()` from `src/lib/env.ts`.
6. **Logging** — Use `logger` from `src/lib/logger.ts` instead of `console.log`.
7. **SEO** — New pages must use `generatePageMeta()` from `src/lib/seo.ts`.
8. **Tests** — Minimum 70% coverage for new code. Place tests in `__tests__/` adjacent to the code.

## Testing

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage report
```

Tests should cover:

- Component rendering and user interactions
- Hook behavior and edge cases
- Utility function inputs/outputs
- Error scenarios

## Quality Checks

All PRs must pass these checks (enforced by CI):

```bash
pnpm lint              # ESLint (includes a11y rules)
pnpm type-check        # TypeScript strict checking
pnpm test              # Jest (70% coverage threshold)
pnpm build             # Production build succeeds
```

## Adding a New Page

1. Create the page in `src/pages/`
2. Add SEO metadata using `generatePageMeta()` from `src/lib/seo.ts`
3. Add translations to `public/locales/en/*.json`
4. Add navigation entry if needed
5. Write tests in `__tests__/`

## Adding a New Component

1. Place in `src/components/`
2. Use Material UI components with the project theme
3. Include TypeScript interface for props
4. Ensure accessibility (keyboard navigation, screen reader support)
5. Write unit tests in `__tests__/`

## Questions?

Open an issue with the `question` label.
