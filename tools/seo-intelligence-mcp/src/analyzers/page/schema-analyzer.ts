import type { AuditFinding } from '../../shared/scoring.js';

export interface SchemaInfo {
  type: string;
  raw: string;
  line: number;
}

export function extractSchemas(content: string): SchemaInfo[] {
  const schemas: SchemaInfo[] = [];
  const lines = content.split('\n');

  // Find JSON-LD script blocks
  const jsonLdRegex =
    /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = jsonLdRegex.exec(content)) !== null) {
    try {
      const parsed = JSON.parse(match[1]) as { '@type'?: string };
      const lineNum = content.substring(0, match.index).split('\n').length;
      schemas.push({
        type: parsed['@type'] ?? 'Unknown',
        raw: match[1].trim(),
        line: lineNum,
      });
    } catch {
      // Found a JSON-LD block but couldn't parse it
      const lineNum = content.substring(0, match.index).split('\n').length;
      schemas.push({
        type: 'InvalidJSON',
        raw: match[1].trim(),
        line: lineNum,
      });
    }
  }

  // Also detect schema injected via structured data helpers
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      line.includes('generateStructuredData') ||
      line.includes('JsonLd') ||
      line.includes('jsonLd') ||
      line.includes('structuredData') ||
      line.includes('schema.org')
    ) {
      // Check for @type references
      const typeMatch = line.match(/@type["':\s]+["'](\w+)["']/);
      if (typeMatch && !schemas.some(s => s.line === i + 1)) {
        schemas.push({ type: typeMatch[1], raw: line.trim(), line: i + 1 });
      }
    }
  }

  return schemas;
}

interface PageContext {
  pageType?: string;
  hasContactForm?: boolean;
  hasFAQ?: boolean;
  hasBreadcrumbs?: boolean;
  hasArticleContent?: boolean;
  hasProductInfo?: boolean;
}

function inferPageContext(content: string): PageContext {
  const lower = content.toLowerCase();
  return {
    hasContactForm:
      lower.includes('contactform') ||
      lower.includes('contact-form') ||
      lower.includes('emailjs'),
    hasFAQ:
      lower.includes('faq') ||
      lower.includes('frequently asked') ||
      lower.includes('question'),
    hasBreadcrumbs:
      lower.includes('breadcrumb') || lower.includes('breadcrumbs'),
    hasArticleContent:
      lower.includes('article') ||
      lower.includes('blog') ||
      lower.includes('post'),
    hasProductInfo:
      lower.includes('product') ||
      lower.includes('price') ||
      lower.includes('cart'),
  };
}

export function analyzeSchema(
  content: string,
  filePath: string,
  pageType?: string
): AuditFinding[] {
  const schemas = extractSchemas(content);
  const context = inferPageContext(content);
  const findings: AuditFinding[] = [];
  const existingTypes = new Set(schemas.map(s => s.type));

  // Check for invalid JSON-LD
  for (const schema of schemas) {
    if (schema.type === 'InvalidJSON') {
      findings.push({
        category: 'schema',
        issue: 'Invalid JSON-LD structured data',
        severity: 'critical',
        impact: 'Malformed JSON-LD is ignored by search engines',
        action: 'Fix the JSON syntax in the structured data block',
        target: `${filePath}:${schema.line}`,
      });
    }
  }

  // No schema at all
  if (schemas.length === 0) {
    findings.push({
      category: 'schema',
      issue: 'No structured data (JSON-LD) found',
      severity: 'high',
      impact:
        'Structured data enables rich search results and improves answer engine readiness',
      action: 'Add JSON-LD structured data appropriate for this page type',
      target: filePath,
    });
  }

  // Suggest missing schemas based on context
  if (
    !existingTypes.has('Organization') &&
    !existingTypes.has('LocalBusiness')
  ) {
    if (filePath.includes('index') || pageType === 'landing') {
      findings.push({
        category: 'schema',
        issue: 'Missing Organization schema on landing page',
        severity: 'medium',
        impact:
          'Organization schema helps search engines understand your brand',
        action:
          'Add Organization JSON-LD with name, url, logo, and social profiles',
        target: filePath,
      });
    }
  }

  if (context.hasFAQ && !existingTypes.has('FAQPage')) {
    findings.push({
      category: 'schema',
      issue: 'FAQ content detected but no FAQPage schema',
      severity: 'medium',
      impact: 'FAQPage schema can trigger rich FAQ results in search',
      action: 'Add FAQPage JSON-LD with question/answer pairs',
      target: filePath,
    });
  }

  if (!existingTypes.has('BreadcrumbList') && context.hasBreadcrumbs) {
    findings.push({
      category: 'schema',
      issue: 'Breadcrumb UI detected but no BreadcrumbList schema',
      severity: 'low',
      impact:
        'BreadcrumbList schema enables breadcrumb display in search results',
      action:
        'Add BreadcrumbList JSON-LD matching the visible breadcrumb navigation',
      target: filePath,
    });
  }

  if (
    context.hasArticleContent &&
    !existingTypes.has('Article') &&
    !existingTypes.has('BlogPosting')
  ) {
    findings.push({
      category: 'schema',
      issue: 'Article content detected but no Article/BlogPosting schema',
      severity: 'medium',
      impact: 'Article schema improves visibility in Google News and Discover',
      action:
        'Add Article or BlogPosting JSON-LD with headline, author, datePublished',
      target: filePath,
    });
  }

  if (context.hasProductInfo && !existingTypes.has('Product')) {
    findings.push({
      category: 'schema',
      issue: 'Product content detected but no Product schema',
      severity: 'high',
      impact:
        'Product schema enables rich product results with price and availability',
      action:
        'Add Product JSON-LD with name, description, price, and availability',
      target: filePath,
    });
  }

  return findings;
}
