# MCP (Model Context Protocol) Configuration Guide

## 🤖 What is MCP?

Model Context Protocol (MCP) allows AI assistants like GitHub Copilot to interact with external tools and services. This template includes pre-configured MCP servers to enhance your development workflow with agentic AI capabilities.

---

## 📋 Table of Contents

- [Available MCP Servers](#available-mcp-servers)
- [Quick Setup](#quick-setup)
- [Configuration Details](#configuration-details)
- [Figma Integration](#figma-integration)
- [GitHub Integration](#github-integration)
- [Troubleshooting](#troubleshooting)

---

## 🛠️ Available MCP Servers

This template includes configurations for the following MCP servers:

### 1. **Figma MCP Server** 🎨
Extract design tokens, components, and assets directly from Figma files.

**Capabilities**:
- Get design context from Figma nodes
- Extract metadata (colors, typography, spacing)
- Generate code from designs
- Download assets

### 2. **Filesystem MCP Server** 📁
Read and write files in your project directory.

**Capabilities**:
- File operations (read, write, list)
- Directory operations
- File search

### 3. **Git MCP Server** 🔀
Git operations and repository management.

**Capabilities**:
- View git status, logs, diffs
- Create commits
- Branch management
- Repository information

### 4. **GitHub MCP Server** 🐙
Interact with GitHub API (issues, PRs, releases).

**Capabilities**:
- Create/update issues and PRs
- Repository management
- GitHub Actions workflows
- Release management

---

## ⚡ Quick Setup

### Step 1: Enable MCP in VS Code

The `mcp.json` file is already configured in this template. To use it:

1. **Ensure you have GitHub Copilot Chat** installed in VS Code
2. **The configuration is automatically detected** from `mcp.json`
3. **Configure required tokens** (see below)

### Step 2: Configure Access Tokens

#### Figma Access Token (Optional)

If you want to use Figma integration:

1. **Get your Figma Personal Access Token**:
   - Go to https://www.figma.com/developers/api#access-tokens
   - Click on your profile → Settings → Account
   - Scroll down to "Personal access tokens"
   - Click "Generate new token"
   - Copy the token

2. **Add to your environment**:

   **Option A: Using .env file (Recommended)**
   ```bash
   # Add to .env.local
   FIGMA_PERSONAL_ACCESS_TOKEN=your_token_here
   ```

   **Option B: Using VS Code settings**
   - Open VS Code Settings (Cmd/Ctrl + ,)
   - Search for "MCP"
   - Add the token to Figma MCP Server environment variables

3. **Update mcp.json** (if not using environment variables):
   ```json
   {
     "mcpServers": {
       "figma": {
         "env": {
           "FIGMA_PERSONAL_ACCESS_TOKEN": "your_token_here"
         }
       }
     }
   }
   ```

#### GitHub Access Token (Optional)

If you want to use GitHub integration:

1. **Generate GitHub Personal Access Token**:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `workflow`, `read:org`
   - Copy the token

2. **Add to your environment**:
   ```bash
   # Add to .env.local
   GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
   ```

3. **Update mcp.json** (if not using environment variables):
   ```json
   {
     "mcpServers": {
       "github": {
         "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
         }
       }
     }
   }
   ```

---

## 🔧 Configuration Details

### mcp.json Structure

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",              // Command to run
      "args": ["-y", "package-name"], // Arguments
      "env": {                        // Environment variables
        "TOKEN_NAME": "value"
      },
      "disabled": false,              // Enable/disable server
      "alwaysAllow": []               // Auto-approve certain operations
    }
  }
}
```

### Disabling Servers

To disable a server you don't need:

```json
{
  "mcpServers": {
    "figma": {
      "disabled": true  // ← Set to true to disable
    }
  }
}
```

Or remove the entire server configuration from `mcp.json`.

---

## 🎨 Figma Integration

### Common Use Cases

#### 1. Extract Design Tokens from Figma

```
Ask Copilot:
"Extract design tokens from Figma file <file-key> node <node-id>"
```

#### 2. Generate Component from Figma Design

```
Ask Copilot:
"Generate a React component based on Figma design at 
https://figma.com/design/<file-key>/<file-name>?node-id=<node-id>"
```

#### 3. Get Design System Colors

```
Ask Copilot:
"Get all colors from Figma design system node 8-81"
```

### Troubleshooting Figma MCP

#### Error: "Unable to access Figma file"

**Causes**:
1. Invalid or missing Figma access token
2. Node ID format incorrect (should be `8-81` not `8:81`)
3. File not shared or private

**Solutions**:

1. **Check token format**:
   ```bash
   # Token should start with 'figd_'
   echo $FIGMA_PERSONAL_ACCESS_TOKEN
   ```

2. **Verify node ID format**:
   ```
   ✅ Correct: "8-81" or "206-979"
   ❌ Wrong: "8:81" or "206:979"
   ```

3. **Convert Figma URL to node ID**:
   ```
   URL: https://figma.com/design/abc123/MyFile?node-id=206-979
   
   Extract:
   - File Key: abc123
   - Node ID: 206-979 (replace : with -)
   ```

4. **Ensure file permissions**:
   - File must be accessible with your token
   - Check file sharing settings in Figma

#### Error: "get_design_context failed"

This usually means the node doesn't exist or isn't accessible. Try:
1. Use `get_metadata` first to explore the file structure
2. Use correct node ID format (`-` not `:`)
3. Check if the node is inside a page or frame

#### Example: Working Figma MCP Request

```typescript
// In Copilot Chat:
"Using Figma MCP, extract design from:
- File: 0toliZWxovylPMYHjdurF0
- Node: 8-81

Convert the node-id format from colon to dash if needed."
```

---

## 🐙 GitHub Integration

### Common Use Cases

#### 1. Create Issue

```
Ask Copilot:
"Create a GitHub issue titled 'Add dark mode support' with label 'enhancement'"
```

#### 2. View Recent PRs

```
Ask Copilot:
"Show me the last 5 pull requests in this repository"
```

#### 3. Check GitHub Actions Status

```
Ask Copilot:
"What's the status of the latest GitHub Actions run?"
```

---

## 🐛 Troubleshooting

### General MCP Issues

#### MCP Servers Not Loading

1. **Check VS Code Extensions**:
   - Ensure GitHub Copilot Chat is installed
   - Update to latest version

2. **Verify mcp.json syntax**:
   ```bash
   # Validate JSON syntax
   cat mcp.json | npx jsonlint
   ```

3. **Check VS Code Output**:
   - View → Output
   - Select "GitHub Copilot Chat" from dropdown
   - Look for MCP-related errors

#### Token Not Working

1. **Check environment variables**:
   ```bash
   # In terminal
   echo $FIGMA_PERSONAL_ACCESS_TOKEN
   echo $GITHUB_PERSONAL_ACCESS_TOKEN
   ```

2. **Reload VS Code**:
   - Cmd/Ctrl + Shift + P
   - "Developer: Reload Window"

3. **Check token permissions**:
   - Figma: Ensure token has file access
   - GitHub: Ensure token has required scopes

### Common Error Messages

#### "Command not found: npx"

**Solution**: Install Node.js
```bash
# Check Node.js installation
node --version
npm --version

# If not installed, download from:
# https://nodejs.org/
```

#### "Failed to install MCP package"

**Solution**: Clear npm cache and retry
```bash
npm cache clean --force
rm -rf ~/.npm/_npx
```

#### "Permission denied"

**Solution**: Check file permissions
```bash
chmod +x mcp.json
```

---

## 📚 Additional Resources

### Official Documentation

- **MCP Specification**: https://spec.modelcontextprotocol.io/
- **Figma MCP Server**: https://github.com/modelcontextprotocol/servers/tree/main/src/figma
- **GitHub MCP Server**: https://github.com/modelcontextprotocol/servers/tree/main/src/github
- **Filesystem MCP Server**: https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
- **Git MCP Server**: https://github.com/modelcontextprotocol/servers/tree/main/src/git

### Community Resources

- **MCP Discord**: https://discord.gg/modelcontextprotocol
- **GitHub Discussions**: https://github.com/saga95/next-web-site-template/discussions

---

## 🎯 Best Practices

### 1. **Security**

- ✅ Never commit tokens to git
- ✅ Use environment variables for tokens
- ✅ Add `.env.local` to `.gitignore`
- ✅ Rotate tokens regularly

### 2. **Performance**

- ✅ Disable unused MCP servers
- ✅ Use specific node IDs instead of full file scans
- ✅ Cache Figma data when possible

### 3. **Development Workflow**

```
1. Design in Figma → 2. Extract with MCP → 3. Generate Code → 4. Commit with Git MCP
```

---

## 🚀 Example Workflows

### Workflow 1: Design to Code

1. **Design component in Figma**
2. **Copy Figma node URL**
3. **Ask Copilot**:
   ```
   "Generate a React component from this Figma design:
   https://figma.com/design/abc/MyDesign?node-id=123-456"
   ```
4. **Review and customize generated code**
5. **Commit with Git MCP**

### Workflow 2: Extract Design System

1. **Create design system in Figma**
2. **Ask Copilot**:
   ```
   "Extract all design tokens (colors, typography, spacing) 
   from Figma file abc123 and create a tokens.json file"
   ```
3. **Generate TypeScript types**:
   ```
   "Generate TypeScript types from tokens.json"
   ```
4. **Create theme provider**

### Workflow 3: Component Library from Figma

1. **Design component library in Figma**
2. **Ask Copilot**:
   ```
   "Extract all components from Figma page 'Components'
   and generate a React component library with:
   - TypeScript
   - Storybook stories
   - Unit tests"
   ```
3. **Review and organize components**
4. **Build and publish**

---

## 📝 Notes

- **Node ID Format**: Figma URLs use `:` (colon) but MCP expects `-` (dash)
  - URL: `node-id=206:979`
  - MCP: `nodeId: "206-979"`

- **File Keys**: Found in Figma URLs
  - URL: `https://figma.com/design/abc123xyz/MyFile`
  - File Key: `abc123xyz`

- **Token Security**: 
  - Store tokens in `.env.local` (never commit)
  - Use different tokens for dev/prod
  - Revoke unused tokens

---

## 🎉 You're Ready!

MCP is now configured for your project. Start by asking Copilot:

```
"What MCP servers are available?"
"Help me extract design from Figma"
"Show me git status using MCP"
```

Happy coding with agentic AI! 🚀
