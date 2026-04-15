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
import { runPageAudit } from '../engines/page-audit-engine.js';
import {
  formatMetadataRewriteReport,
  runMetadataRewrite,
} from '../engines/metadata-engine.js';
import {
  formatSchemaSuggestionReport,
  runSchemaSuggestion,
} from '../engines/schema-engine.js';
import {
  formatInternalLinkReport,
  runInternalLinkAnalysis,
} from '../engines/internal-link-engine.js';
import { analyzeGeo } from '../analyzers/geo/geo-analyzer.js';
import { analyzeAeo } from '../analyzers/aeo/aeo-analyzer.js';
import { readFileContent, resolveSafePath } from '../shared/file-utils.js';
import { buildAuditScore, calculateCategoryScore } from '../shared/scoring.js';
import {
  findingsToRecommendations,
  formatAuditReport,
} from '../shared/recommendations.js';

const logger = createLogger('tools');

function getProjectRoot(): string {
  return process.cwd();
}

export function registerTools(server: McpServer): void {
  server.tool(
    'page_audit',
    'Audit a page for SEO readiness. Returns an overall score, issue list by severity, and prioritized recommendations for metadata, headings, schema, and internal linking.',
    PageAuditInputSchema.shape,
    async (params, _extra) => {
      logger.info(`page_audit called for: ${params.filePath}`);
      try {
        const result = await runPageAudit(params.filePath, getProjectRoot(), {
          targetKeyword: params.targetKeyword,
        });
        return toolSuccess(result.report);
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
        // Phase 3: wire to keyword-brief-engine (requires Ahrefs integration)
        return toolSuccess(
          `[keyword_brief] Ahrefs integration not yet implemented.\n\nInput: ${JSON.stringify(params, null, 2)}`
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
        const result = await runMetadataRewrite(
          params.filePath,
          getProjectRoot(),
          {
            targetKeyword: params.targetKeyword,
            brandName: params.brandName,
          }
        );
        return toolSuccess(formatMetadataRewriteReport(result));
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
        const result = await runSchemaSuggestion(
          params.filePath,
          getProjectRoot(),
          params.pageType
        );
        return toolSuccess(formatSchemaSuggestionReport(result));
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
        const result = await runInternalLinkAnalysis(
          params.filePath,
          getProjectRoot(),
          params.routeScope
        );
        return toolSuccess(formatInternalLinkReport(result));
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
        const safePath = resolveSafePath(getProjectRoot(), params.filePath);
        const content = await readFileContent(safePath);
        const result = analyzeGeo(content, params.filePath);

        const categoryScores = [calculateCategoryScore('geo', result.findings)];
        const score = buildAuditScore(categoryScores);
        const recommendations = findingsToRecommendations(result.findings);

        const lines: string[] = [];
        lines.push(`## GEO Readiness Audit: ${params.filePath}`);
        lines.push('');
        lines.push(`**Overall Score: ${score.overall}/100**`);
        lines.push(`**Topic Clarity**: ${result.topicClarity}`);
        lines.push(`**Summary Readiness**: ${result.summaryReadiness}`);
        lines.push('');
        lines.push(
          formatAuditReport(params.filePath, score, recommendations)
            .split('\n')
            .slice(4)
            .join('\n')
        );

        return toolSuccess(lines.join('\n'));
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
        const safePath = resolveSafePath(getProjectRoot(), params.filePath);
        const content = await readFileContent(safePath);
        const result = analyzeAeo(content, params.filePath);

        const categoryScores = [calculateCategoryScore('aeo', result.findings)];
        const score = buildAuditScore(categoryScores);
        const recommendations = findingsToRecommendations(result.findings);

        const lines: string[] = [];
        lines.push(`## AEO Readiness Audit: ${params.filePath}`);
        lines.push('');
        lines.push(`**Overall Score: ${score.overall}/100**`);
        lines.push(
          `**Direct Answers**: ${result.hasDirectAnswers ? 'Yes' : 'No'}`
        );
        lines.push(
          `**FAQ Opportunities**: ${result.hasFaqOpportunities ? 'Yes' : 'No'}`
        );
        lines.push(`**Snippet Readiness**: ${result.snippetReadiness}`);
        lines.push('');
        lines.push(
          formatAuditReport(params.filePath, score, recommendations)
            .split('\n')
            .slice(4)
            .join('\n')
        );

        return toolSuccess(lines.join('\n'));
      } catch (err) {
        logger.error('aeo_audit failed', err);
        return toolError(formatErrorForUser(err));
      }
    }
  );

  logger.info('All 7 MVP tools registered successfully');
}
