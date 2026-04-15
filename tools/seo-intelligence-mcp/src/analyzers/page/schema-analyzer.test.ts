import { describe, expect, it } from 'vitest';
import { analyzeSchema, extractSchemas } from './schema-analyzer.js';

describe('extractSchemas', () => {
  it('extracts JSON-LD script blocks', () => {
    const content = `<script type="application/ld+json">{"@type":"Organization","name":"Test"}</script>`;
    const schemas = extractSchemas(content);
    expect(schemas).toHaveLength(1);
    expect(schemas[0].type).toBe('Organization');
  });

  it('marks invalid JSON-LD', () => {
    const content = `<script type="application/ld+json">{invalid json}</script>`;
    const schemas = extractSchemas(content);
    expect(schemas).toHaveLength(1);
    expect(schemas[0].type).toBe('InvalidJSON');
  });

  it('detects schema references in code with schema helpers', () => {
    const content = `const structuredData = { "@type": "Article" };`;
    const schemas = extractSchemas(content);
    expect(schemas.some(s => s.type === 'Article')).toBe(true);
  });

  it('does not detect @type without schema helper keywords', () => {
    const content = `const data = { "@type": "Article" };`;
    const schemas = extractSchemas(content);
    expect(schemas.some(s => s.type === 'Article')).toBe(false);
  });

  it('returns empty for no schemas', () => {
    const schemas = extractSchemas('const x = 1;');
    expect(schemas).toHaveLength(0);
  });
});

describe('analyzeSchema', () => {
  const filePath = 'src/pages/index.tsx';

  it('reports no structured data', () => {
    const findings = analyzeSchema('const x = 1;', filePath);
    const finding = findings.find(f => f.issue.includes('No structured data'));
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('high');
  });

  it('reports invalid JSON-LD as critical', () => {
    const content = `<script type="application/ld+json">{bad}</script>`;
    const findings = analyzeSchema(content, filePath);
    const finding = findings.find(f => f.issue.includes('Invalid JSON-LD'));
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('critical');
  });

  it('suggests Organization schema for index page', () => {
    const content = '<div>Welcome to our site</div>';
    const findings = analyzeSchema(content, 'src/pages/index.tsx');
    const finding = findings.find(f =>
      f.issue.includes('Missing Organization schema')
    );
    expect(finding).toBeDefined();
  });

  it('suggests FAQPage schema when FAQ content detected', () => {
    const content = 'Frequently Asked Questions: What is...?';
    const findings = analyzeSchema(content, filePath);
    const finding = findings.find(f => f.issue.includes('FAQPage schema'));
    expect(finding).toBeDefined();
  });

  it('suggests Product schema when product content detected', () => {
    const content = 'Product details with price $29.99 and add to cart';
    const findings = analyzeSchema(content, filePath);
    const finding = findings.find(f => f.issue.includes('Product schema'));
    expect(finding).toBeDefined();
  });

  it('suggests Article schema when article content detected', () => {
    const content = 'Blog post article content about technology';
    const findings = analyzeSchema(content, filePath);
    const finding = findings.find(f =>
      f.issue.includes('Article/BlogPosting schema')
    );
    expect(finding).toBeDefined();
  });

  it('does not suggest existing schemas', () => {
    const content = `
      <script type="application/ld+json">{"@type":"Organization","name":"Test"}</script>
      <script type="application/ld+json">{"@type":"FAQPage","mainEntity":[]}</script>
      Frequently asked questions here
    `;
    const findings = analyzeSchema(content, 'src/pages/index.tsx');
    const orgFinding = findings.find(f =>
      f.issue.includes('Missing Organization')
    );
    const faqFinding = findings.find(f => f.issue.includes('FAQPage schema'));
    expect(orgFinding).toBeUndefined();
    expect(faqFinding).toBeUndefined();
  });
});
