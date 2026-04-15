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

| Tool                          | Description                               | Phase   |
| ----------------------------- | ----------------------------------------- | ------- |
| `page_audit`                  | Audit a page for SEO readiness            | Phase 2 |
| `keyword_brief`               | Generate keyword brief using Ahrefs data  | Phase 3 |
| `metadata_rewrite`            | Suggest improved page title & description | Phase 2 |
| `schema_suggestion`           | Suggest JSON-LD schema opportunities      | Phase 2 |
| `internal_link_opportunities` | Find internal linking opportunities       | Phase 2 |
| `geo_audit`                   | Assess GEO readiness                      | Phase 4 |
| `aeo_audit`                   | Assess AEO readiness                      | Phase 4 |

## Environment Variables

| Variable             | Required | Default                     | Description                         |
| -------------------- | -------- | --------------------------- | ----------------------------------- |
| `AHREFS_API_KEY`     | No\*     | —                           | Ahrefs Public API key               |
| `AHREFS_BASE_URL`    | No       | `https://api.ahrefs.com/v3` | Ahrefs API base URL                 |
| `SEO_MCP_LOG_LEVEL`  | No       | `info`                      | Log level: debug, info, warn, error |
| `SEO_MCP_TIMEOUT_MS` | No       | `30000`                     | External API timeout in ms          |
| `SEO_MCP_CACHE_TTL`  | No       | `3600000`                   | Cache TTL in ms                     |

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
