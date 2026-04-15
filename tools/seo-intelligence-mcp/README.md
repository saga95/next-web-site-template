# SEO Intelligence MCP Server

Optional developer add-on for the Next.js Enterprise Template. Provides SEO, GEO, and AEO analysis tools via MCP (Model Context Protocol) for use with VS Code Copilot, Claude Code, and similar IDE agents.

## Quick Start

### 1. Install dependencies

```bash
cd tools/seo-intelligence-mcp
npm install
```

### 2. Build the server

```bash
# From project root
pnpm seo:mcp:build
```

### 3. Configure environment (optional for Ahrefs features)

Set `AHREFS_API_KEY` in the `seo-intelligence` entry in `mcp.json` or via environment variables.

### 4. Enable in mcp.json

In the root `mcp.json`, set `"disabled": false` for the `seo-intelligence` server.

## Available Tools

| Tool                          | Description                               |
| ----------------------------- | ----------------------------------------- |
| `page_audit`                  | Full SEO audit with per-category scores   |
| `keyword_brief`               | Keyword research brief (Ahrefs or local)  |
| `metadata_rewrite`            | Suggest improved page title & description |
| `schema_suggestion`           | Suggest JSON-LD schema opportunities      |
| `internal_link_opportunities` | Find internal linking opportunities       |
| `geo_audit`                   | Generative Engine Optimization readiness  |
| `aeo_audit`                   | Answer Engine Optimization readiness      |

## Sample Prompts

Use these prompts in your IDE agent (Copilot, Claude Code, etc.) after enabling the MCP server:

### Page Audit

```
Run a page_audit on src/pages/index.tsx with target keyword "nextjs enterprise template"
```

### Metadata Rewrite

```
Use metadata_rewrite on src/pages/about.tsx with brandName "Acme Corp" and targetKeyword "about acme"
```

### Schema Suggestion

```
Run schema_suggestion on src/pages/index.tsx with pageType "landing"
```

### Internal Link Opportunities

```
Find internal_link_opportunities for src/pages/auth/login.tsx
```

### Keyword Brief

```
Generate a keyword_brief for topic "nextjs seo best practices" with pageType "article"
```

### GEO Audit

```
Run a geo_audit on src/pages/index.tsx to check generative engine readiness
```

### AEO Audit

```
Run an aeo_audit on src/pages/index.tsx to check answer engine readiness
```

## Environment Variables

| Variable             | Required | Default                     | Description                         |
| -------------------- | -------- | --------------------------- | ----------------------------------- |
| `AHREFS_API_KEY`     | No\*     | —                           | Ahrefs Public API key               |
| `AHREFS_BASE_URL`    | No       | `https://api.ahrefs.com/v3` | Ahrefs API base URL                 |
| `SEO_MCP_LOG_LEVEL`  | No       | `info`                      | Log level: debug, info, warn, error |
| `SEO_MCP_TIMEOUT_MS` | No       | `30000`                     | External API timeout in ms          |
| `SEO_MCP_CACHE_TTL`  | No       | `3600000`                   | Cache TTL in ms                     |

\* Without `AHREFS_API_KEY`, the `keyword_brief` tool works in local-only mode (intent inference without search volume data).

## Architecture

```
src/
├── index.ts                   # MCP server entry point
├── config/env.ts              # Zod-validated environment config
├── mcp/
│   ├── types.ts               # Zod input schemas, ToolResult helpers
│   └── register-tools.ts      # All 7 tools registered with handlers
├── analyzers/
│   ├── page/                  # SEO analyzers (metadata, heading, schema, links, images)
│   ├── geo/                   # GEO readiness analyzer
│   └── aeo/                   # AEO readiness analyzer
├── engines/                   # Orchestration engines (audit, metadata, schema, links, keyword)
├── integrations/ahrefs/       # Ahrefs API client, types, mapper
└── shared/                    # Logger, errors, file utils, scoring, recommendations
```

## Development

```bash
# Dev mode with hot reload
pnpm seo:mcp:dev

# Run tests
cd tools/seo-intelligence-mcp && npx vitest run

# Type-check
cd tools/seo-intelligence-mcp && npx tsc --noEmit
```

## Testing

138 unit tests cover all analyzers, engines, shared utilities, and integrations:

```bash
cd tools/seo-intelligence-mcp
npx vitest run          # single run
npx vitest              # watch mode
```

## IDE Compatibility

| IDE / Agent     | Status    | Notes                      |
| --------------- | --------- | -------------------------- |
| VS Code Copilot | Supported | Configure via `mcp.json`   |
| Claude Code     | Supported | Configure via `mcp.json`   |
| Cursor          | Supported | Add MCP server in settings |
| Windsurf        | Supported | Add MCP server in settings |

## Troubleshooting

- **Tools not appearing**: Ensure `"disabled": false` in `mcp.json` and the server is built (`pnpm seo:mcp:build`).
- **Ahrefs errors**: Check that `AHREFS_API_KEY` is valid. The server logs to stderr.
- **File not found**: Paths are relative to the project root. Use `src/pages/index.tsx` not `/Users/.../index.tsx`.
- **Path traversal error**: The server blocks paths that escape the project root for security.

\* Required only for `keyword_brief` and Ahrefs-powered features. Local analysis tools work without it.

## Scripts

```bash
pnpm seo:mcp:dev     # Development mode with hot reload
pnpm seo:mcp:build   # Compile TypeScript
pnpm seo:mcp:start   # Run compiled server
```

## Architecture

```
src/
├── index.ts                  # Server entrypoint
├── config/env.ts             # Environment loading & validation
├── mcp/
│   ├── register-tools.ts     # Tool registration
│   └── types.ts              # Input/output schemas
├── integrations/ahrefs/      # Ahrefs API client (Phase 3)
├── analyzers/
│   ├── page/                 # SEO page analyzers (Phase 2)
│   ├── geo/                  # GEO analyzer (Phase 4)
│   └── aeo/                  # AEO analyzer (Phase 4)
├── engines/                  # Business logic engines (Phase 2-4)
└── shared/                   # Logger, errors, file utils, scoring
```

## IDE Usage

### VS Code Copilot

Once the server is built and enabled in `mcp.json`, tools are available through Copilot chat:

```
Audit src/pages/index.tsx for SEO issues
Generate a keyword brief for "enterprise SaaS template"
Suggest schema markup for my about page
```

### Claude Code

The server works with any MCP-compatible client. Configure the server in your IDE's MCP settings.
