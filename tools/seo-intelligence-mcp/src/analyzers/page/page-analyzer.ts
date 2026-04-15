import type { AuditFinding } from '../../shared/scoring.js';
import {
  type MetadataInfo,
  analyzeMetadata,
  extractMetadata,
} from './metadata-analyzer.js';
import {
  type HeadingInfo,
  analyzeHeadings,
  extractHeadings,
} from './heading-analyzer.js';
import {
  type InternalLinkInfo,
  analyzeInternalLinks,
  extractInternalLinks,
} from './internal-link-analyzer.js';
import {
  type SchemaInfo,
  analyzeSchema,
  extractSchemas,
} from './schema-analyzer.js';
import {
  type ImageInfo,
  analyzeImageAlts,
  extractImages,
} from './image-alt-analyzer.js';

export interface PageAnalysisResult {
  filePath: string;
  metadata: MetadataInfo;
  headings: HeadingInfo[];
  internalLinks: InternalLinkInfo[];
  schemas: SchemaInfo[];
  images: ImageInfo[];
  findings: AuditFinding[];
}

export interface PageAnalysisOptions {
  targetKeyword?: string;
  pageType?: string;
  availableRoutes?: string[];
}

export function analyzePage(
  content: string,
  filePath: string,
  options: PageAnalysisOptions = {}
): PageAnalysisResult {
  const metadata = extractMetadata(content);
  const headings = extractHeadings(content);
  const internalLinks = extractInternalLinks(content);
  const schemas = extractSchemas(content);
  const images = extractImages(content);

  const findings: AuditFinding[] = [
    ...analyzeMetadata(content, filePath, options.targetKeyword),
    ...analyzeHeadings(content, filePath, options.targetKeyword),
    ...analyzeInternalLinks(content, filePath, options.availableRoutes),
    ...analyzeSchema(content, filePath, options.pageType),
    ...analyzeImageAlts(content, filePath),
  ];

  return {
    filePath,
    metadata,
    headings,
    internalLinks,
    schemas,
    images,
    findings,
  };
}
