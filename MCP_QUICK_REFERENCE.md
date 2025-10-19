# MCP Quick Reference Card

## 🚀 Quick Commands for Copilot Chat

### Figma Integration

```
✅ "Extract design tokens from Figma file <file-key> node <node-id>"
✅ "Generate React component from Figma design at https://figma.com/design/..."
✅ "Get all colors from Figma design system"
✅ "Convert Figma component to TypeScript + Material UI"
```

### Node ID Format Conversion

```
Figma URL:  node-id=206:979  → MCP: "206-979"
Figma URL:  node-id=8:81     → MCP: "8-81"

⚠️ Always replace : (colon) with - (dash) for MCP
```

### Common Workflows

#### 1. Design → Code
```
"Using Figma MCP, extract the button component from:
- File: abc123xyz
- Node: 206-979
Generate a Material UI Button component with TypeScript"
```

#### 2. Extract Design System
```
"Extract all design tokens (colors, typography, spacing) from Figma 
and create a theme.ts file for Material UI"
```

#### 3. Component Library
```
"Generate a complete component library from Figma page 'Components'
with TypeScript, Storybook, and unit tests"
```

## 🐛 Troubleshooting

### Error: "Unable to access Figma file"
1. Check `FIGMA_PERSONAL_ACCESS_TOKEN` in `.env.local`
2. Ensure token starts with `figd_`
3. Verify node ID uses `-` not `:`

### Error: "get_design_context failed"
1. Use `get_metadata` to explore file structure first
2. Check node ID format (dash, not colon)
3. Ensure node is accessible in Figma

### Error: "Token not found"
1. Reload VS Code window (Cmd/Ctrl + Shift + P → "Reload Window")
2. Check `.env.local` exists and has token
3. Verify `mcp.json` references environment variable

## 📚 Token Setup

```bash
# 1. Create .env.local
cp .env.example .env.local

# 2. Add tokens (get from links in .env.example)
FIGMA_PERSONAL_ACCESS_TOKEN=figd_...
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...

# 3. Reload VS Code
Cmd/Ctrl + Shift + P → "Developer: Reload Window"
```

## 🎯 Best Practices

1. **Always use dash format** for node IDs (`8-81` not `8:81`)
2. **Get metadata first** before extracting design
3. **Use specific nodes** instead of full file scans
4. **Cache tokens** in environment variables
5. **Never commit** `.env.local` to git

## 📖 Full Documentation

See [MCP_SETUP_GUIDE.md](./MCP_SETUP_GUIDE.md) for complete instructions.
