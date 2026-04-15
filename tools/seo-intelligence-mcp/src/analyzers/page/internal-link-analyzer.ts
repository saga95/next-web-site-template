import type { AuditFinding } from '../../shared/scoring.js';

export interface InternalLinkInfo {
  href: string;
  text: string;
  line: number;
}

export function extractInternalLinks(content: string): InternalLinkInfo[] {
  const links: InternalLinkInfo[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Next.js Link component: <Link href="/..."
    const nextLinkMatches = line.matchAll(
      /<Link\s+[^>]*href=["']([^"']+)["'][^>]*>([^<]*)/gi
    );
    for (const match of nextLinkMatches) {
      if (match[1].startsWith('/') || match[1].startsWith('./')) {
        links.push({ href: match[1], text: match[2].trim(), line: i + 1 });
      }
    }

    // Standard anchor tags: <a href="/..."
    const anchorMatches = line.matchAll(
      /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([^<]*)/gi
    );
    for (const match of anchorMatches) {
      if (match[1].startsWith('/') || match[1].startsWith('./')) {
        links.push({ href: match[1], text: match[2].trim(), line: i + 1 });
      }
    }

    // Markdown links: [text](path)
    const mdMatches = line.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
    for (const match of mdMatches) {
      if (match[2].startsWith('/') || match[2].startsWith('./')) {
        links.push({ href: match[2], text: match[1].trim(), line: i + 1 });
      }
    }
  }

  return links;
}

export function analyzeInternalLinks(
  content: string,
  filePath: string,
  availableRoutes: string[] = []
): AuditFinding[] {
  const links = extractInternalLinks(content);
  const findings: AuditFinding[] = [];

  // Check link density
  const wordCount = content.split(/\s+/).length;
  const linkDensity = wordCount > 0 ? links.length / (wordCount / 500) : 0;

  if (links.length === 0) {
    findings.push({
      category: 'internal-linking',
      issue: 'No internal links found on this page',
      severity: 'high',
      impact:
        'Internal links help search engines discover and understand page relationships',
      action: 'Add contextual internal links to relevant pages in the site',
      target: filePath,
    });
  } else if (linkDensity < 0.5) {
    findings.push({
      category: 'internal-linking',
      issue: `Low internal link density (${links.length} links for ~${wordCount} words)`,
      severity: 'medium',
      impact:
        'Sparse internal linking limits crawl depth and topical authority distribution',
      action: 'Add more contextual internal links where relevant',
      target: filePath,
    });
  }

  // Check for generic anchor text
  const genericAnchors = [
    'click here',
    'here',
    'read more',
    'learn more',
    'link',
    'this',
  ];
  for (const link of links) {
    if (genericAnchors.includes(link.text.toLowerCase())) {
      findings.push({
        category: 'internal-linking',
        issue: `Generic anchor text: "${link.text}" → ${link.href}`,
        severity: 'medium',
        impact:
          'Descriptive anchor text helps search engines understand the target page topic',
        action: `Replace "${link.text}" with descriptive text that indicates what the linked page is about`,
        target: `${filePath}:${link.line}`,
      });
    }
  }

  // Check for broken internal links (if routes are provided)
  if (availableRoutes.length > 0) {
    for (const link of links) {
      const normalizedHref =
        link.href === '/'
          ? '/'
          : link.href.replace(/\/$/, '').replace(/\.(tsx?|jsx?)$/, '');
      const isValid = availableRoutes.some(
        route =>
          normalizedHref === route || normalizedHref.startsWith(`${route}/`)
      );
      if (!isValid) {
        findings.push({
          category: 'internal-linking',
          issue: `Potentially broken internal link: ${link.href}`,
          severity: 'high',
          impact:
            'Broken links waste crawl budget and create poor user experience',
          action: `Verify the link target "${link.href}" exists or update to a valid route`,
          target: `${filePath}:${link.line}`,
        });
      }
    }
  }

  return findings;
}
