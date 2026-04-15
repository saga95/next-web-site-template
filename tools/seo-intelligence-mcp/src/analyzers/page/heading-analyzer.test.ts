import { describe, expect, it } from 'vitest';
import { analyzeHeadings, extractHeadings } from './heading-analyzer.js';

describe('extractHeadings', () => {
  it('extracts JSX headings', () => {
    const content = `<h1>Main Title</h1>\n<h2>Subtitle</h2>`;
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(2);
    expect(headings[0]).toEqual({ level: 1, text: 'Main Title', line: 1 });
    expect(headings[1]).toEqual({ level: 2, text: 'Subtitle', line: 2 });
  });

  it('extracts MUI Typography variant headings', () => {
    const content = `<Typography variant="h1">MUI Title</Typography>`;
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(1);
    expect(headings[0].level).toBe(1);
    expect(headings[0].text).toBe('MUI Title');
  });

  it('extracts Markdown headings', () => {
    const content = `# H1 Title\n## H2 Title\n### H3 Title`;
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(3);
    expect(headings[0]).toEqual({ level: 1, text: 'H1 Title', line: 1 });
    expect(headings[1]).toEqual({ level: 2, text: 'H2 Title', line: 2 });
    expect(headings[2]).toEqual({ level: 3, text: 'H3 Title', line: 3 });
  });

  it('returns empty array for no headings', () => {
    const headings = extractHeadings('const x = 1;\nconst y = 2;');
    expect(headings).toHaveLength(0);
  });
});

describe('analyzeHeadings', () => {
  const filePath = 'src/pages/about.tsx';

  it('reports missing H1 as critical', () => {
    const content = `<h2>Only a subtitle</h2>`;
    const findings = analyzeHeadings(content, filePath);
    const finding = findings.find(f => f.issue === 'Missing H1 heading');
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('critical');
  });

  it('reports multiple H1s', () => {
    const content = `<h1>First H1</h1>\n<h1>Second H1</h1>`;
    const findings = analyzeHeadings(content, filePath);
    const finding = findings.find(f =>
      f.issue.includes('Multiple H1 headings')
    );
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('high');
  });

  it('reports heading hierarchy skip', () => {
    const content = `<h1>Title</h1>\n<h3>Skipped to H3</h3>`;
    const findings = analyzeHeadings(content, filePath);
    const finding = findings.find(f =>
      f.issue.includes('Heading hierarchy skip')
    );
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('medium');
  });

  it('reports vague heading', () => {
    const content = `<h1>About Us</h1>\n<h2>Learn More</h2>`;
    const findings = analyzeHeadings(content, filePath);
    const finding = findings.find(f =>
      f.issue.includes('Vague heading: "Learn More"')
    );
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('low');
  });

  it('reports empty heading', () => {
    const content = `<h1>Title</h1>\n<h2></h2>`;
    const findings = analyzeHeadings(content, filePath);
    const finding = findings.find(f => f.issue.includes('Empty H2 heading'));
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('high');
  });

  it('reports keyword missing from H1', () => {
    const content = `<h1>Our Services Page</h1>`;
    const findings = analyzeHeadings(content, filePath, 'nextjs');
    const finding = findings.find(f =>
      f.issue.includes('Target keyword "nextjs" not found in H1')
    );
    expect(finding).toBeDefined();
  });

  it('does not report keyword when present in H1', () => {
    const content = `<h1>Getting Started with NextJS</h1>`;
    const findings = analyzeHeadings(content, filePath, 'nextjs');
    const finding = findings.find(f => f.issue.includes('Target keyword'));
    expect(finding).toBeUndefined();
  });

  it('produces no findings for a well-structured page', () => {
    const content = `<h1>About Our Company</h1>\n<h2>Our Mission</h2>\n<h3>Core Values</h3>`;
    const findings = analyzeHeadings(content, filePath);
    expect(findings).toHaveLength(0);
  });
});
