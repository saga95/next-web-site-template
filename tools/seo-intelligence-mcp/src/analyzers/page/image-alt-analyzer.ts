import type { AuditFinding } from '../../shared/scoring.js';

export interface ImageInfo {
  src: string;
  alt: string | null;
  line: number;
}

const WEAK_ALT_PATTERNS = [
  /^image$/i,
  /^photo$/i,
  /^picture$/i,
  /^img$/i,
  /^icon$/i,
  /^banner$/i,
  /^logo$/i,
  /^\d+$/,
  /^untitled$/i,
  /^screenshot$/i,
  /^DSC_?\d+/i,
  /^IMG_?\d+/i,
];

export function extractImages(content: string): ImageInfo[] {
  const images: ImageInfo[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // HTML/JSX img tags: <img src="..." alt="...">
    const imgMatches = line.matchAll(/<img\s[^>]*src=["']([^"']+)["'][^>]*/gi);
    for (const match of imgMatches) {
      const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
      images.push({
        src: match[1],
        alt: altMatch ? altMatch[1] : null,
        line: i + 1,
      });
    }

    // Next.js Image component: <Image src="..." alt="...">
    const nextImgMatches = line.matchAll(
      /<Image\s[^>]*src=["'{]([^"'}]+)["'}][^>]*/gi
    );
    for (const match of nextImgMatches) {
      const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
      images.push({
        src: match[1],
        alt: altMatch ? altMatch[1] : null,
        line: i + 1,
      });
    }

    // Markdown images: ![alt](src)
    const mdMatches = line.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g);
    for (const match of mdMatches) {
      images.push({
        src: match[2],
        alt: match[1] || null,
        line: i + 1,
      });
    }
  }

  return images;
}

export function analyzeImageAlts(
  content: string,
  filePath: string
): AuditFinding[] {
  const images = extractImages(content);
  const findings: AuditFinding[] = [];

  if (images.length === 0) return findings;

  const missingAlt = images.filter(img => img.alt === null);
  const emptyAlt = images.filter(
    img => img.alt !== null && img.alt.trim() === ''
  );
  const weakAlt = images.filter(
    img =>
      img.alt !== null &&
      img.alt.trim().length > 0 &&
      WEAK_ALT_PATTERNS.some(p => p.test(img.alt!.trim()))
  );

  if (missingAlt.length > 0) {
    findings.push({
      category: 'images',
      issue: `${missingAlt.length} image(s) missing alt attribute`,
      severity: 'high',
      impact:
        'Missing alt text hurts accessibility and image search visibility',
      action: `Add descriptive alt text to images on lines: ${missingAlt.map(i => i.line).join(', ')}`,
      target: filePath,
    });
  }

  if (emptyAlt.length > 0) {
    findings.push({
      category: 'images',
      issue: `${emptyAlt.length} image(s) with empty alt text`,
      severity: 'medium',
      impact:
        'Empty alt text is appropriate only for decorative images — content images need descriptive text',
      action: `Review images on lines ${emptyAlt.map(i => i.line).join(', ')} and add descriptive alt text if they convey meaning`,
      target: filePath,
    });
  }

  if (weakAlt.length > 0) {
    findings.push({
      category: 'images',
      issue: `${weakAlt.length} image(s) with generic/weak alt text`,
      severity: 'low',
      impact:
        'Generic alt text misses the opportunity to describe the image content for accessibility and SEO',
      action: `Replace generic alt text with specific descriptions on lines: ${weakAlt.map(i => i.line).join(', ')}`,
      target: filePath,
    });
  }

  return findings;
}
