import type { AuditFinding } from '../../shared/scoring.js';

export interface HeadingInfo {
  level: number;
  text: string;
  line: number;
}

const VAGUE_HEADING_PATTERNS = [
  /^learn more$/i,
  /^click here$/i,
  /^read more$/i,
  /^overview$/i,
  /^introduction$/i,
  /^details$/i,
  /^info$/i,
  /^content$/i,
  /^section \d+$/i,
];

export function extractHeadings(content: string): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // JSX headings: <h1>..., <h2>..., etc.
    const jsxMatch = line.match(/<h([1-6])[^>]*>([^<]*)/i);
    if (jsxMatch) {
      headings.push({
        level: parseInt(jsxMatch[1], 10),
        text: jsxMatch[2].trim(),
        line: i + 1,
      });
      continue;
    }

    // MUI Typography variant headings
    const muiMatch = line.match(/variant=["']h([1-6])["'][^>]*>([^<]*)/i);
    if (muiMatch) {
      headings.push({
        level: parseInt(muiMatch[1], 10),
        text: muiMatch[2].trim(),
        line: i + 1,
      });
      continue;
    }

    // Markdown headings
    const mdMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (mdMatch) {
      headings.push({
        level: mdMatch[1].length,
        text: mdMatch[2].trim(),
        line: i + 1,
      });
    }
  }

  return headings;
}

export function analyzeHeadings(
  content: string,
  filePath: string,
  targetKeyword?: string
): AuditFinding[] {
  const headings = extractHeadings(content);
  const findings: AuditFinding[] = [];

  // H1 checks
  const h1s = headings.filter(h => h.level === 1);

  if (h1s.length === 0) {
    findings.push({
      category: 'structure',
      issue: 'Missing H1 heading',
      severity: 'critical',
      impact:
        'H1 is the primary signal for page topic — search engines expect exactly one',
      action: 'Add a single H1 heading that clearly describes the page topic',
      target: filePath,
    });
  } else if (h1s.length > 1) {
    findings.push({
      category: 'structure',
      issue: `Multiple H1 headings found (${h1s.length})`,
      severity: 'high',
      impact: 'Multiple H1s dilute the main topic signal for search engines',
      action: 'Keep only one H1 and convert others to H2 or lower',
      target: `${filePath} (lines: ${h1s.map(h => h.line).join(', ')})`,
    });
  }

  // H1 keyword alignment
  if (h1s.length === 1 && targetKeyword) {
    const h1Text = h1s[0].text.toLowerCase();
    if (!h1Text.includes(targetKeyword.toLowerCase())) {
      findings.push({
        category: 'structure',
        issue: `Target keyword "${targetKeyword}" not found in H1`,
        severity: 'medium',
        impact: 'H1-keyword alignment strengthens topical relevance',
        action: `Include "${targetKeyword}" naturally in the H1 heading`,
        target: `${filePath}:${h1s[0].line}`,
      });
    }
  }

  // Hierarchy checks
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1];
    const curr = headings[i];

    if (curr.level > prev.level + 1) {
      findings.push({
        category: 'structure',
        issue: `Heading hierarchy skip: H${prev.level} → H${curr.level}`,
        severity: 'medium',
        impact:
          'Skipped heading levels confuse screen readers and weaken document structure',
        action: `Insert an H${prev.level + 1} before the H${curr.level} on line ${curr.line}`,
        target: `${filePath}:${curr.line}`,
      });
    }
  }

  // Vague heading checks
  for (const heading of headings) {
    if (VAGUE_HEADING_PATTERNS.some(p => p.test(heading.text))) {
      findings.push({
        category: 'structure',
        issue: `Vague heading: "${heading.text}"`,
        severity: 'low',
        impact:
          'Vague headings reduce scannability and miss keyword opportunities',
        action: `Replace "${heading.text}" with a descriptive, topic-specific heading`,
        target: `${filePath}:${heading.line}`,
      });
    }
  }

  // Empty heading check
  for (const heading of headings) {
    if (!heading.text || heading.text.trim().length === 0) {
      findings.push({
        category: 'structure',
        issue: `Empty H${heading.level} heading`,
        severity: 'high',
        impact:
          'Empty headings create accessibility issues and confuse document structure',
        action: `Add descriptive text to the H${heading.level} heading or remove it`,
        target: `${filePath}:${heading.line}`,
      });
    }
  }

  return findings;
}
