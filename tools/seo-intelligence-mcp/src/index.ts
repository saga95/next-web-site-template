import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config/env.js';
import { registerTools } from './mcp/register-tools.js';
import { createLogger } from './shared/logger.js';

const logger = createLogger('server');

async function main(): Promise<void> {
  try {
    const config = loadConfig();
    logger.info('Configuration loaded successfully');

    if (!config.AHREFS_API_KEY) {
      logger.warn(
        'AHREFS_API_KEY not set — keyword_brief and Ahrefs-powered features will be unavailable. ' +
          'Local analysis tools (page_audit, metadata_rewrite, schema_suggestion, internal_link_opportunities, geo_audit, aeo_audit) will still work.'
      );
    }

    const server = new McpServer({
      name: 'seo-intelligence',
      version: '0.1.0',
    });

    registerTools(server);

    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info('SEO Intelligence MCP server started on stdio transport');
  } catch (error) {
    logger.error('Failed to start SEO Intelligence MCP server', error);
    process.exit(1);
  }
}

main();
