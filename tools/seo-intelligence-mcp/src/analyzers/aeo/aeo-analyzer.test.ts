import { describe, expect, it } from 'vitest';
import { analyzeAeo } from './aeo-analyzer.js';

describe('analyzeAeo', () => {
  const filePath = 'src/pages/faq.tsx';

  it('reports no direct answer blocks', () => {
    const content = `<h1>Title</h1>\n<p>A very long paragraph that goes on and on without providing any concise answers to specific questions. It just rambles about various unrelated topics. ${'more words '.repeat(50)}</p>`;
    const result = analyzeAeo(content, filePath);
    const finding = result.findings.find(f =>
      f.issue.includes('No direct answer blocks')
    );
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('high');
    expect(result.hasDirectAnswers).toBe(false);
  });

  it('detects direct answer blocks', () => {
    const content = `
      <h1>What is SEO?</h1>

      <p>SEO is the practice of optimizing web pages to rank higher in search engine results.</p>

      <p>It involves keyword research, content optimization, and technical improvements.</p>
    `;
    const result = analyzeAeo(content, filePath);
    expect(result.hasDirectAnswers).toBe(true);
  });

  it('reports missing FAQ section when questions exist in headings', () => {
    const content = `
      <h1>Help Center</h1>
      <h2>How do I reset my password?</h2>
      <p>Go to settings and click reset.</p>
      <h2>How do I contact support?</h2>
      <p>Email us at support@example.com.</p>
    `;
    const result = analyzeAeo(content, filePath);
    expect(result.hasFaqOpportunities).toBe(true);
    const finding = result.findings.find(f =>
      f.issue.includes('question-style headings found but no dedicated FAQ')
    );
    expect(finding).toBeDefined();
  });

  it('reports no question-based content', () => {
    const content = `<h1>About Us</h1>\n<h2>Our Mission</h2>\n<h2>Our Team</h2>`;
    const result = analyzeAeo(content, filePath);
    const finding = result.findings.find(f =>
      f.issue.includes('No question-based headings')
    );
    expect(finding).toBeDefined();
  });

  it('reports no snippet-friendly formatting', () => {
    const content = `<h1>Topic</h1>\n<p>Just plain paragraphs without any structured content.</p>`;
    const result = analyzeAeo(content, filePath);
    const finding = result.findings.find(f =>
      f.issue.includes('No snippet-friendly formatting')
    );
    expect(finding).toBeDefined();
  });

  it('detects snippet-friendly formatting with lists', () => {
    const content = `
      <h1>Steps to Setup</h1>
      <p>SEO is the practice of improving search visibility.</p>
      <ul>
        <li>Step 1: Research keywords</li>
        <li>Step 2: Optimize content</li>
      </ul>
    `;
    const result = analyzeAeo(content, filePath);
    const finding = result.findings.find(f =>
      f.issue.includes('No snippet-friendly formatting')
    );
    expect(finding).toBeUndefined();
  });

  it('returns strong snippet readiness for well-optimized content', () => {
    const content = `
      <h1>What is TypeScript?</h1>

      <p>TypeScript is a strongly typed programming language that builds on JavaScript.</p>

      <h2>How does TypeScript work?</h2>
      <ol>
        <li>Write TypeScript code</li>
        <li>Compile to JavaScript</li>
        <li>Run in any JS runtime</li>
      </ol>
    `;
    const result = analyzeAeo(content, filePath);
    expect(result.snippetReadiness).toBe('strong');
  });

  it('returns weak snippet readiness for unoptimized content', () => {
    const content = `<h1>Page Title</h1>\n<p>A very long unfocused paragraph that rambles without structure. ${'more filler '.repeat(50)}</p>`;
    const result = analyzeAeo(content, filePath);
    expect(result.snippetReadiness).toBe('weak');
  });
});
