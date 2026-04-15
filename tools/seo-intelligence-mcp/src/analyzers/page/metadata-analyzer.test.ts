import { describe, expect, it } from 'vitest';
import { analyzeMetadata, extractMetadata } from './metadata-analyzer.js';

describe('extractMetadata', () => {
  it('extracts title from JSX attribute', () => {
    const content = `const meta = { title: "My Page Title" };`;
    const result = extractMetadata(content);
    expect(result.title).toBe('My Page Title');
  });

  it('extracts title from HTML <title> tag', () => {
    const content = `<title>HTML Page Title</title>`;
    const result = extractMetadata(content);
    expect(result.title).toBe('HTML Page Title');
  });

  it('extracts title from generatePageMeta', () => {
    const content = `generatePageMeta({ title: 'SEO Title Here' })`;
    const result = extractMetadata(content);
    expect(result.title).toBe('SEO Title Here');
  });

  it('extracts description', () => {
    const content = `description: "A detailed description of this page"`;
    const result = extractMetadata(content);
    expect(result.description).toBe('A detailed description of this page');
  });

  it('extracts description from meta tag', () => {
    const content = `<meta name="description" content="Meta tag description here">`;
    const result = extractMetadata(content);
    expect(result.description).toBe('Meta tag description here');
  });

  it('extracts OG title and description', () => {
    const content = `
      <meta property="og:title" content="OG Title" />
      <meta property="og:description" content="OG Desc" />
    `;
    const result = extractMetadata(content);
    expect(result.ogTitle).toBe('OG Title');
    expect(result.ogDescription).toBe('OG Desc');
  });

  it('extracts canonical URL', () => {
    const content = `<link rel="canonical" href="https://example.com/page" />`;
    const result = extractMetadata(content);
    expect(result.canonical).toBe('https://example.com/page');
  });

  it('returns null for missing fields', () => {
    const result = extractMetadata('const x = 1;');
    expect(result.title).toBeNull();
    expect(result.description).toBeNull();
    expect(result.ogTitle).toBeNull();
    expect(result.ogDescription).toBeNull();
    expect(result.canonical).toBeNull();
  });
});

describe('analyzeMetadata', () => {
  const filePath = 'src/pages/index.tsx';

  it('reports missing title as critical', () => {
    const findings = analyzeMetadata('const x = 1;', filePath);
    const titleFinding = findings.find(f => f.issue === 'Missing page title');
    expect(titleFinding).toBeDefined();
    expect(titleFinding!.severity).toBe('critical');
  });

  it('reports short title', () => {
    const content = `title: "Short"`;
    const findings = analyzeMetadata(content, filePath);
    const finding = findings.find(f => f.issue.includes('Title too short'));
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('high');
  });

  it('reports long title', () => {
    const longTitle = 'A'.repeat(65);
    const content = `title: "${longTitle}"`;
    const findings = analyzeMetadata(content, filePath);
    const finding = findings.find(f => f.issue.includes('Title too long'));
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('medium');
  });

  it('reports weak/generic title', () => {
    const content = `title: "Home"`;
    const findings = analyzeMetadata(content, filePath);
    const finding = findings.find(f =>
      f.issue.includes('Weak or generic page title')
    );
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('high');
  });

  it('reports keyword missing from title', () => {
    const content = `title: "Welcome to our great website today"`;
    const findings = analyzeMetadata(content, filePath, 'nextjs');
    const finding = findings.find(f =>
      f.issue.includes('Target keyword "nextjs" not found in title')
    );
    expect(finding).toBeDefined();
  });

  it('does not report keyword missing when present', () => {
    const content = `title: "Getting started with NextJS framework"`;
    const findings = analyzeMetadata(content, filePath, 'nextjs');
    const finding = findings.find(f => f.issue.includes('Target keyword'));
    expect(finding).toBeUndefined();
  });

  it('reports missing meta description as high', () => {
    const content = `title: "A Good Page Title For Testing"`;
    const findings = analyzeMetadata(content, filePath);
    const finding = findings.find(f =>
      f.issue.includes('Missing meta description')
    );
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('high');
  });

  it('reports short meta description', () => {
    const content = `description: "Too short desc"`;
    const findings = analyzeMetadata(content, filePath);
    const finding = findings.find(f =>
      f.issue.includes('Meta description too short')
    );
    expect(finding).toBeDefined();
  });

  it('reports long meta description', () => {
    const longDesc = 'A'.repeat(165);
    const content = `description: "${longDesc}"`;
    const findings = analyzeMetadata(content, filePath);
    const finding = findings.find(f =>
      f.issue.includes('Meta description too long')
    );
    expect(finding).toBeDefined();
  });

  it('reports missing OG title when title exists', () => {
    const content = `title: "A proper page title for now"`;
    const findings = analyzeMetadata(content, filePath);
    const finding = findings.find(f =>
      f.issue.includes('Missing Open Graph title')
    );
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('low');
  });

  it('does not report missing OG when no title at all', () => {
    const findings = analyzeMetadata('const x = 1;', filePath);
    const finding = findings.find(f =>
      f.issue.includes('Missing Open Graph title')
    );
    expect(finding).toBeUndefined();
  });

  it('produces no findings for a well-formed page', () => {
    const content = `
      title: "A Comprehensive Guide to Next.js SEO"
      description: "Learn everything about Next.js SEO with this comprehensive guide covering meta tags, structured data, and more best practices."
      <meta property="og:title" content="A Comprehensive Guide to Next.js SEO" />
      <meta property="og:description" content="Next.js SEO best practices" />
    `;
    const findings = analyzeMetadata(content, filePath);
    expect(findings).toHaveLength(0);
  });
});
