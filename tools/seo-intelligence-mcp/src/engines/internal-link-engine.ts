import { extractInternalLinks } from '../analyzers/page/internal-link-analyzer.js';
import { extractHeadings } from '../analyzers/page/heading-analyzer.js';
import {
  findPageFiles,
  readFileContent,
  resolveSafePath,
} from '../shared/file-utils.js';
import { createLogger } from '../shared/logger.js';
import { join, relative } from 'node:path';

const logger = createLogger('engine:internal-link');

export interface LinkOpportunity {
  sourceFile: string;
  targetRoute: string;
  targetFile: string;
  suggestedAnchorText: string;
  rationale: string;
}

export interface InternalLinkResult {
  filePath: string;
  existingLinks: number;
  opportunities: LinkOpportunity[];
}

function filePathToRoute(pagesDir: string, filePath: string): string {
  return filePath
    .replace(pagesDir, '')
    .replace(/\.(tsx?|jsx?)$/, '')
    .replace(/\/index$/, '/')
    .replace(/^$/, '/');
}

function extractTopicKeywords(content: string): string[] {
  const headingMatches = content.matchAll(/<h[1-3][^>]*>([^<]+)/gi);
  const keywords: string[] = [];
  for (const match of headingMatches) {
    keywords.push(
      ...match[1]
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 3)
    );
  }

  // Also check MUI Typography headings
  const muiMatches = content.matchAll(/variant=["']h[1-3]["'][^>]*>([^<]+)/gi);
  for (const match of muiMatches) {
    keywords.push(
      ...match[1]
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 3)
    );
  }

  return [...new Set(keywords)];
}

export async function runInternalLinkAnalysis(
  filePath: string,
  projectRoot: string,
  routeScope?: string
): Promise<InternalLinkResult> {
  const safePath = resolveSafePath(projectRoot, filePath);
  logger.info(`Running internal link analysis for ${safePath}`);

  const content = await readFileContent(safePath);
  const existingLinks = extractInternalLinks(content);
  const existingHrefs = new Set(existingLinks.map(l => l.href));

  const pagesDir = join(projectRoot, 'src', 'pages');
  let pageFiles: string[];
  try {
    pageFiles = await findPageFiles(pagesDir);
  } catch {
    logger.warn('Could not discover page files');
    return { filePath, existingLinks: existingLinks.length, opportunities: [] };
  }

  const sourceRoute = filePathToRoute(pagesDir, safePath);
  const sourceKeywords = extractTopicKeywords(content);

  const opportunities: LinkOpportunity[] = [];

  for (const targetFile of pageFiles) {
    const targetRoute = filePathToRoute(pagesDir, targetFile);

    // Skip self-links
    if (targetRoute === sourceRoute) continue;

    // Apply route scope filter
    if (routeScope && !targetRoute.startsWith(routeScope)) continue;

    // Skip already linked routes
    if (existingHrefs.has(targetRoute)) continue;

    // Read target to find topic overlap
    let targetContent: string;
    try {
      targetContent = await readFileContent(targetFile);
    } catch {
      continue;
    }

    const targetHeadings = extractHeadings(targetContent);
    const targetH1 = targetHeadings.find(h => h.level === 1);
    const targetKeywords = extractTopicKeywords(targetContent);

    // Check for topic overlap
    const overlap = sourceKeywords.filter(k => targetKeywords.includes(k));
    if (
      overlap.length >= 2 ||
      (targetH1 &&
        sourceKeywords.some(k => targetH1.text.toLowerCase().includes(k)))
    ) {
      const anchorText =
        targetH1?.text ?? targetRoute.replace(/\//g, ' ').trim();

      opportunities.push({
        sourceFile: filePath,
        targetRoute,
        targetFile: relative(projectRoot, targetFile),
        suggestedAnchorText: anchorText,
        rationale: `Topic overlap: ${overlap.slice(0, 5).join(', ')}${overlap.length > 5 ? '...' : ''}`,
      });
    }
  }

  // Sort by relevance (overlap count proxy — opportunities with rationale containing more keywords first)
  opportunities.sort((a, b) => b.rationale.length - a.rationale.length);

  return { filePath, existingLinks: existingLinks.length, opportunities };
}

export function formatInternalLinkReport(result: InternalLinkResult): string {
  const lines: string[] = [];

  lines.push(`## Internal Link Opportunities: ${result.filePath}`);
  lines.push('');
  lines.push(`**Existing internal links**: ${result.existingLinks}`);
  lines.push('');

  if (result.opportunities.length === 0) {
    lines.push('No additional internal linking opportunities found.');
    return lines.join('\n');
  }

  lines.push(`### Suggested Links (${result.opportunities.length})`);
  lines.push('');

  for (const opp of result.opportunities) {
    lines.push(`- **Link to**: \`${opp.targetRoute}\` (${opp.targetFile})`);
    lines.push(`  - **Suggested anchor text**: "${opp.suggestedAnchorText}"`);
    lines.push(`  - **Reason**: ${opp.rationale}`);
    lines.push('');
  }

  return lines.join('\n');
}
