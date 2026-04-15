import { extractMetadata } from '../analyzers/page/metadata-analyzer.js';
import { extractHeadings } from '../analyzers/page/heading-analyzer.js';
import { readFileContent, resolveSafePath } from '../shared/file-utils.js';
import { createLogger } from '../shared/logger.js';

const logger = createLogger('engine:metadata');

export interface MetadataRewriteResult {
  currentTitle: string | null;
  currentDescription: string | null;
  suggestedTitles: string[];
  suggestedDescriptions: string[];
  rationale: string;
  target: string;
}

export async function runMetadataRewrite(
  filePath: string,
  projectRoot: string,
  options: { targetKeyword?: string; brandName?: string } = {}
): Promise<MetadataRewriteResult> {
  const safePath = resolveSafePath(projectRoot, filePath);
  logger.info(`Running metadata rewrite for ${safePath}`);

  const content = await readFileContent(safePath);
  const meta = extractMetadata(content);
  const headings = extractHeadings(content);

  const h1 = headings.find(h => h.level === 1);
  const topicHint = h1?.text ?? options.targetKeyword ?? 'this page';
  const brand = options.brandName ? ` | ${options.brandName}` : '';
  const keyword = options.targetKeyword ?? topicHint;

  const suggestedTitles: string[] = [];
  const suggestedDescriptions: string[] = [];
  const rationalePoints: string[] = [];

  // Generate title suggestions
  if (!meta.title) {
    suggestedTitles.push(`${keyword}${brand}`);
    suggestedTitles.push(`${keyword} — Your Complete Guide${brand}`);
    rationalePoints.push(
      'No title was found. A descriptive title targeting the main keyword is essential.'
    );
  } else {
    if (meta.title.length < 20) {
      suggestedTitles.push(`${meta.title} — ${keyword}${brand}`);
      rationalePoints.push(
        `Current title "${meta.title}" is too short. Expanding with keyword context.`
      );
    }
    if (meta.title.length > 60) {
      const shortened = meta.title.substring(0, 55).replace(/\s+\S*$/, '');
      suggestedTitles.push(`${shortened}${brand}`);
      rationalePoints.push(
        `Current title is ${meta.title.length} chars and will be truncated.`
      );
    }
    if (
      options.targetKeyword &&
      !meta.title.toLowerCase().includes(options.targetKeyword.toLowerCase())
    ) {
      suggestedTitles.push(`${options.targetKeyword} — ${meta.title}`);
      rationalePoints.push(
        `Target keyword "${options.targetKeyword}" is missing from the title.`
      );
    }
  }

  // Always add a general optimization suggestion
  if (suggestedTitles.length === 0) {
    suggestedTitles.push(meta.title ?? keyword);
    rationalePoints.push(
      'Title looks reasonable. Minor variations may still improve CTR.'
    );
  }

  // Generate description suggestions
  if (!meta.description) {
    suggestedDescriptions.push(
      `Learn about ${keyword}. This guide covers everything you need to know with actionable insights and expert recommendations.`
    );
    rationalePoints.push(
      'No meta description was found. Adding a compelling summary is critical.'
    );
  } else {
    if (meta.description.length < 70) {
      suggestedDescriptions.push(
        `${meta.description} Discover actionable insights about ${keyword} and how it can help you.`
      );
      rationalePoints.push(
        `Current description is short (${meta.description.length} chars). Expanding for more impact.`
      );
    }
    if (meta.description.length > 160) {
      const shortened = meta.description
        .substring(0, 155)
        .replace(/\s+\S*$/, '');
      suggestedDescriptions.push(`${shortened}...`);
      rationalePoints.push(
        `Current description will be truncated at 160 chars.`
      );
    }
  }

  if (suggestedDescriptions.length === 0) {
    suggestedDescriptions.push(
      meta.description ?? `Comprehensive guide to ${keyword}.`
    );
    rationalePoints.push(
      'Description looks reasonable. Consider A/B testing variations.'
    );
  }

  const rationale = rationalePoints.join('\n- ');

  return {
    currentTitle: meta.title,
    currentDescription: meta.description,
    suggestedTitles,
    suggestedDescriptions,
    rationale: `- ${rationale}`,
    target: filePath,
  };
}

export function formatMetadataRewriteReport(
  result: MetadataRewriteResult
): string {
  const lines: string[] = [];

  lines.push(`## Metadata Rewrite Suggestions: ${result.target}`);
  lines.push('');

  lines.push('### Current Metadata');
  lines.push(`- **Title**: ${result.currentTitle ?? '(missing)'}`);
  lines.push(`- **Description**: ${result.currentDescription ?? '(missing)'}`);
  lines.push('');

  lines.push('### Suggested Titles');
  for (const title of result.suggestedTitles) {
    lines.push(`- "${title}" (${title.length} chars)`);
  }
  lines.push('');

  lines.push('### Suggested Descriptions');
  for (const desc of result.suggestedDescriptions) {
    lines.push(`- "${desc}" (${desc.length} chars)`);
  }
  lines.push('');

  lines.push('### Rationale');
  lines.push(result.rationale);

  return lines.join('\n');
}
