import { describe, expect, it } from 'vitest';
import { analyzeGeo } from './geo-analyzer.js';

describe('analyzeGeo', () => {
  const filePath = 'src/pages/guide.tsx';

  it('reports weak topic framing when H1 absent', () => {
    const content = `<h2>Some subtitle</h2>\n<p>A short paragraph with no clear topic.</p>`;
    const result = analyzeGeo(content, filePath);
    const finding = result.findings.find(f =>
      f.issue.includes('Weak topic framing')
    );
    expect(finding).toBeDefined();
    expect(finding!.category).toBe('geo');
  });

  it('reports low entity clarity', () => {
    // Content with no proper nouns, no defined terms, no schema refs
    const content = `<h1>stuff here about things</h1>\n<p>some more stuff that is quite vague and generic and does not mention any real things at all in the paragraph</p>`;
    const result = analyzeGeo(content, filePath);
    const finding = result.findings.find(f =>
      f.issue.includes('Low entity clarity')
    );
    expect(finding).toBeDefined();
  });

  it('reports no summary-ready sections when content is long prose', () => {
    // Only very long paragraphs
    const longParagraph = 'This is a sentence. '.repeat(30);
    const content = `<h1>Topic</h1>\n<p>${longParagraph}</p>`;
    const result = analyzeGeo(content, filePath);
    const finding = result.findings.find(f =>
      f.issue.includes('No summary-ready content')
    );
    expect(finding).toBeDefined();
  });

  it('reports lack of intent-aligned headings', () => {
    const content = `<h1>Our Company</h1>\n<h2>Section A</h2>\n<h2>Section B</h2>\n${'word '.repeat(100)}`;
    const result = analyzeGeo(content, filePath);
    const finding = result.findings.find(f =>
      f.issue.includes('does not directly address user intent')
    );
    expect(finding).toBeDefined();
  });

  it('reports thin content', () => {
    const content = `<h1>Thin Page</h1>\n<p>Not enough words here.</p>`;
    const result = analyzeGeo(content, filePath);
    const finding = result.findings.find(f => f.issue.includes('Thin content'));
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('high');
  });

  it('returns strong ratings for well-optimized content', () => {
    const content = `
      <h1>How to Build a NextJS Application</h1>
      <p>NextJS is a React framework for building modern web applications. This guide covers everything you need to know.</p>

      <p>NextJS provides server-side rendering and static generation.</p>

      <h2>What is NextJS?</h2>
      <p>NextJS is built by Vercel and is one of the most popular React frameworks. It supports TypeScript, React Server Components, and more.</p>

      <h2>How to Get Started with NextJS</h2>
      <p>Getting started with NextJS requires Node.js installed on your machine. Run npx create-next-app to scaffold a project.</p>

      ${'This is additional content to meet the word count threshold for the GEO analyzer. '.repeat(20)}
    `;
    const result = analyzeGeo(content, filePath);
    expect(result.topicClarity).toBe('strong');
    expect(result.summaryReadiness).toBe('strong');
  });

  it('returns moderate ratings for partially optimized content', () => {
    const content = `
      <h1>Technology Overview</h1>
      <p>Technology is evolving rapidly. This page covers some general technology topics and their applications in the modern world.</p>

      <h2>Section One</h2>
      <p>Details about section one with some relevant information.</p>

      <h2>Section Two</h2>
      <p>Details about section two with different information.</p>

      ${'Additional content words to make the page longer for analysis. '.repeat(15)}
    `;
    const result = analyzeGeo(content, filePath);
    // Has topic framing (H1 + first para) but no intent headings
    expect(['strong', 'moderate']).toContain(result.topicClarity);
  });
});
