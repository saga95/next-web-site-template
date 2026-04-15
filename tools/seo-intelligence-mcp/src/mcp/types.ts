import { z } from 'zod';

// --- Tool Input Schemas ---

export const PageAuditInputSchema = z.object({
  filePath: z
    .string()
    .describe('Path to the page file to audit (relative to project root)'),
  route: z
    .string()
    .optional()
    .describe('The URL route for this page (e.g., /about)'),
  targetKeyword: z
    .string()
    .optional()
    .describe('Target keyword to check alignment against'),
});

export const KeywordBriefInputSchema = z.object({
  topic: z.string().describe('The topic or keyword to generate a brief for'),
  domain: z.string().optional().describe('The website domain for context'),
  pageType: z
    .enum(['landing', 'article', 'product', 'service', 'faq', 'other'])
    .optional()
    .describe('The type of page being planned'),
});

export const MetadataRewriteInputSchema = z.object({
  filePath: z
    .string()
    .describe('Path to the page file to suggest metadata for'),
  targetKeyword: z
    .string()
    .optional()
    .describe('Target keyword for metadata optimization'),
  brandName: z
    .string()
    .optional()
    .describe('Brand name to include in metadata'),
});

export const SchemaSuggestionInputSchema = z.object({
  filePath: z
    .string()
    .describe('Path to the page file to analyze for schema opportunities'),
  pageType: z
    .enum([
      'landing',
      'article',
      'product',
      'service',
      'faq',
      'organization',
      'local-business',
      'other',
    ])
    .optional()
    .describe('The type of page to tailor schema suggestions'),
});

export const InternalLinkInputSchema = z.object({
  filePath: z
    .string()
    .describe('Path to the page file to find linking opportunities for'),
  routeScope: z
    .string()
    .optional()
    .describe('Limit link suggestions to routes under this prefix'),
});

export const GeoAuditInputSchema = z.object({
  filePath: z
    .string()
    .describe('Path to the page file to audit for GEO readiness'),
});

export const AeoAuditInputSchema = z.object({
  filePath: z
    .string()
    .describe('Path to the page file to audit for AEO readiness'),
});

// --- Tool Input Types ---

export type PageAuditInput = z.infer<typeof PageAuditInputSchema>;
export type KeywordBriefInput = z.infer<typeof KeywordBriefInputSchema>;
export type MetadataRewriteInput = z.infer<typeof MetadataRewriteInputSchema>;
export type SchemaSuggestionInput = z.infer<typeof SchemaSuggestionInputSchema>;
export type InternalLinkInput = z.infer<typeof InternalLinkInputSchema>;
export type GeoAuditInput = z.infer<typeof GeoAuditInputSchema>;
export type AeoAuditInput = z.infer<typeof AeoAuditInputSchema>;

// --- Tool Output Types ---

export interface ToolResult {
  [key: string]: unknown;
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

export function toolSuccess(text: string): ToolResult {
  return {
    content: [{ type: 'text', text }],
  };
}

export function toolError(message: string): ToolResult {
  return {
    content: [{ type: 'text', text: `Error: ${message}` }],
    isError: true,
  };
}
