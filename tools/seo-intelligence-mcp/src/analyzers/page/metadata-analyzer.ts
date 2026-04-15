import type { AuditFinding } from '../../shared/scoring.js';

export interface MetadataInfo {
  title: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  canonical: string | null;
}

const WEAK_TITLE_PATTERNS = [
  /^home$/i,
  /^untitled$/i,
  /^page$/i,
  /^welcome$/i,
  /^index$/i,
];

const TITLE_MIN_LENGTH = 20;
const TITLE_MAX_LENGTH = 60;
const DESC_MIN_LENGTH = 70;
const DESC_MAX_LENGTH = 160;

export function extractMetadata(content: string): MetadataInfo {
  const titleMatch =
    content.match(/title[=:]\s*["'`]([^"'`]+)["'`]/i) ??
    content.match(/<title>([^<]+)<\/title>/i) ??
    content.match(/generatePageMeta\(\s*\{[^}]*title:\s*['"`]([^'"`]+)['"`]/i);

  const descMatch =
    content.match(/description[=:]\s*["'`]([^"'`]+)["'`]/i) ??
    content.match(
      /meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
    );

  const ogTitleMatch = content.match(
    /property=["']og:title["']\s+content=["']([^"']+)["']/i
  );
  const ogDescMatch = content.match(
    /property=["']og:description["']\s+content=["']([^"']+)["']/i
  );
  const canonicalMatch = content.match(
    /rel=["']canonical["']\s+href=["']([^"']+)["']/i
  );

  return {
    title: titleMatch?.[1]?.trim() ?? null,
    description: descMatch?.[1]?.trim() ?? null,
    ogTitle: ogTitleMatch?.[1]?.trim() ?? null,
    ogDescription: ogDescMatch?.[1]?.trim() ?? null,
    canonical: canonicalMatch?.[1]?.trim() ?? null,
  };
}

export function analyzeMetadata(
  content: string,
  filePath: string,
  targetKeyword?: string
): AuditFinding[] {
  const meta = extractMetadata(content);
  const findings: AuditFinding[] = [];

  // Title checks
  if (!meta.title) {
    findings.push({
      category: 'metadata',
      issue: 'Missing page title',
      severity: 'critical',
      impact: 'Search engines cannot display a meaningful title in results',
      action:
        'Add a descriptive page title using generatePageMeta() or Head component',
      target: filePath,
    });
  } else {
    if (meta.title.length < TITLE_MIN_LENGTH) {
      findings.push({
        category: 'metadata',
        issue: `Title too short (${meta.title.length} chars, min ${TITLE_MIN_LENGTH})`,
        severity: 'high',
        impact:
          'Short titles miss keyword opportunities and reduce click-through rate',
        action: `Expand the title to ${TITLE_MIN_LENGTH}-${TITLE_MAX_LENGTH} characters with relevant keywords`,
        target: filePath,
      });
    }
    if (meta.title.length > TITLE_MAX_LENGTH) {
      findings.push({
        category: 'metadata',
        issue: `Title too long (${meta.title.length} chars, max ${TITLE_MAX_LENGTH})`,
        severity: 'medium',
        impact: 'Long titles get truncated in search results',
        action: `Shorten the title to under ${TITLE_MAX_LENGTH} characters`,
        target: filePath,
      });
    }
    if (WEAK_TITLE_PATTERNS.some(p => p.test(meta.title!))) {
      findings.push({
        category: 'metadata',
        issue: 'Weak or generic page title',
        severity: 'high',
        impact:
          'Generic titles do not differentiate the page in search results',
        action: 'Replace with a descriptive, keyword-rich title',
        target: filePath,
      });
    }
    if (
      targetKeyword &&
      !meta.title.toLowerCase().includes(targetKeyword.toLowerCase())
    ) {
      findings.push({
        category: 'metadata',
        issue: `Target keyword "${targetKeyword}" not found in title`,
        severity: 'medium',
        impact:
          'Title-keyword alignment improves relevance signals for search engines',
        action: `Include "${targetKeyword}" naturally in the page title`,
        target: filePath,
      });
    }
  }

  // Description checks
  if (!meta.description) {
    findings.push({
      category: 'metadata',
      issue: 'Missing meta description',
      severity: 'high',
      impact:
        'Search engines may generate an arbitrary snippet instead of your intended summary',
      action:
        'Add a meta description using generatePageMeta() or Head component',
      target: filePath,
    });
  } else {
    if (meta.description.length < DESC_MIN_LENGTH) {
      findings.push({
        category: 'metadata',
        issue: `Meta description too short (${meta.description.length} chars, min ${DESC_MIN_LENGTH})`,
        severity: 'medium',
        impact:
          'Short descriptions miss the opportunity to persuade searchers to click',
        action: `Expand the description to ${DESC_MIN_LENGTH}-${DESC_MAX_LENGTH} characters`,
        target: filePath,
      });
    }
    if (meta.description.length > DESC_MAX_LENGTH) {
      findings.push({
        category: 'metadata',
        issue: `Meta description too long (${meta.description.length} chars, max ${DESC_MAX_LENGTH})`,
        severity: 'low',
        impact: 'Long descriptions get truncated in search results',
        action: `Shorten the description to under ${DESC_MAX_LENGTH} characters`,
        target: filePath,
      });
    }
    if (
      targetKeyword &&
      !meta.description.toLowerCase().includes(targetKeyword.toLowerCase())
    ) {
      findings.push({
        category: 'metadata',
        issue: `Target keyword "${targetKeyword}" not found in meta description`,
        severity: 'low',
        impact: 'Keywords in descriptions can be bolded in search results',
        action: `Include "${targetKeyword}" naturally in the meta description`,
        target: filePath,
      });
    }
  }

  // OG checks
  if (!meta.ogTitle && meta.title) {
    findings.push({
      category: 'metadata',
      issue: 'Missing Open Graph title',
      severity: 'low',
      impact: 'Social media shares may not display the intended title',
      action: 'Add og:title meta tag for social media optimization',
      target: filePath,
    });
  }

  if (!meta.ogDescription && meta.description) {
    findings.push({
      category: 'metadata',
      issue: 'Missing Open Graph description',
      severity: 'low',
      impact: 'Social media shares may not display the intended description',
      action: 'Add og:description meta tag for social media optimization',
      target: filePath,
    });
  }

  return findings;
}
