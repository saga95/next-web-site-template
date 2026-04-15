import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  AeoAuditInputSchema,
  GeoAuditInputSchema,
  InternalLinkInputSchema,
  KeywordBriefInputSchema,
  MetadataRewriteInputSchema,
  PageAuditInputSchema,
  SchemaSuggestionInputSchema,
  toolError,
  toolSuccess,
} from './types.js';
import { formatErrorForUser } from '../shared/errors.js';
import { createLogger } from '../shared/logger.js';

const logger = createLogger('tools');

export function registerTools(server: McpServer): void {
  server.tool(
    'page_audit',
    'Audit a page for SEO readiness. Returns an overall score, issue list by severity, and prioritized recommendations for metadata, headings, schema, and internal linking.',
    PageAuditInputSchema.shape,
    async (params, _extra) => {
      logger.info(`page_audit called for: ${params.filePath}`);
      try {
        // Phase 2: wire to page-audit-engine
        return toolSuccess(
          `[page_audit] Tool registered successfully. Analysis engine not yet implemented.\n\nInput: ${JSON.stringify(params, null, 2)}`
        );
      } catch (err) {
        logger.error('page_audit failed', err);
        return toolError(formatErrorForUser(err));
      }
    }
  );

  server.tool(
    'keyword_brief',
    'Generate a keyword brief using Ahrefs data for a topic, page, or domain context. Returns primary keyword, related keywords, question keywords, and likely search intent.',
    KeywordBriefInputSchema.shape,
    async (params, _extra) => {
      logger.info(`keyword_brief called for topic: ${params.topic}`);
      try {
        // Phase 3: wire to keyword-brief-engine
        return toolSuccess(
          `[keyword_brief] Tool registered successfully. Ahrefs integration not yet implemented.\n\nInput: ${JSON.stringify(params, null, 2)}`
        );
      } catch (err) {
        logger.error('keyword_brief failed', err);
        return toolError(formatErrorForUser(err));
      }
    }
  );

  server.tool(
    'metadata_rewrite',
    'Suggest improved page title and meta description for a page based on content analysis and optional keyword targeting.',
    MetadataRewriteInputSchema.shape,
    async (params, _extra) => {
      logger.info(`metadata_rewrite called for: ${params.filePath}`);
      try {
        // Phase 2: wire to metadata-engine
        return toolSuccess(
          `[metadata_rewrite] Tool registered successfully. Metadata engine not yet implemented.\n\nInput: ${JSON.stringify(params, null, 2)}`
        );
      } catch (err) {
        logger.error('metadata_rewrite failed', err);
        return toolError(formatErrorForUser(err));
      }
    }
  );

  server.tool(
    'schema_suggestion',
    'Suggest relevant schema markup (JSON-LD) opportunities for a page, with reasoning and starter structures.',
    SchemaSuggestionInputSchema.shape,
    async (params, _extra) => {
      logger.info(`schema_suggestion called for: ${params.filePath}`);
      try {
        // Phase 2: wire to schema-engine
        return toolSuccess(
          `[schema_suggestion] Tool registered successfully. Schema engine not yet implemented.\n\nInput: ${JSON.stringify(params, null, 2)}`
        );
      } catch (err) {
        logger.error('schema_suggestion failed', err);
        return toolError(formatErrorForUser(err));
      }
    }
  );

  server.tool(
    'internal_link_opportunities',
    'Suggest internal linking opportunities by scanning routes and page relationships in the project.',
    InternalLinkInputSchema.shape,
    async (params, _extra) => {
      logger.info(`internal_link_opportunities called for: ${params.filePath}`);
      try {
        // Phase 2: wire to internal-link-engine
        return toolSuccess(
          `[internal_link_opportunities] Tool registered successfully. Internal link engine not yet implemented.\n\nInput: ${JSON.stringify(params, null, 2)}`
        );
      } catch (err) {
        logger.error('internal_link_opportunities failed', err);
        return toolError(formatErrorForUser(err));
      }
    }
  );

  server.tool(
    'geo_audit',
    'Assess a page for GEO (Generative Engine Optimization) readiness. Checks topic framing, entity clarity, and summary-friendly structure.',
    GeoAuditInputSchema.shape,
    async (params, _extra) => {
      logger.info(`geo_audit called for: ${params.filePath}`);
      try {
        // Phase 4: wire to geo analyzer
        return toolSuccess(
          `[geo_audit] Tool registered successfully. GEO analyzer not yet implemented.\n\nInput: ${JSON.stringify(params, null, 2)}`
        );
      } catch (err) {
        logger.error('geo_audit failed', err);
        return toolError(formatErrorForUser(err));
      }
    }
  );

  server.tool(
    'aeo_audit',
    'Assess a page for AEO (Answer Engine Optimization) readiness. Checks for direct answer sections, FAQ opportunities, and snippet-friendly formatting.',
    AeoAuditInputSchema.shape,
    async (params, _extra) => {
      logger.info(`aeo_audit called for: ${params.filePath}`);
      try {
        // Phase 4: wire to aeo analyzer
        return toolSuccess(
          `[aeo_audit] Tool registered successfully. AEO analyzer not yet implemented.\n\nInput: ${JSON.stringify(params, null, 2)}`
        );
      } catch (err) {
        logger.error('aeo_audit failed', err);
        return toolError(formatErrorForUser(err));
      }
    }
  );

  logger.info('All 7 MVP tools registered successfully');
}
