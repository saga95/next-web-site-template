import { describe, expect, it } from 'vitest';
import { analyzeImageAlts, extractImages } from './image-alt-analyzer.js';

describe('extractImages', () => {
  it('extracts HTML img tags', () => {
    const content = `<img src="/hero.png" alt="Hero image" />`;
    const images = extractImages(content);
    expect(images).toHaveLength(1);
    expect(images[0]).toEqual({ src: '/hero.png', alt: 'Hero image', line: 1 });
  });

  it('detects missing alt attribute', () => {
    const content = `<img src="/photo.jpg" />`;
    const images = extractImages(content);
    expect(images).toHaveLength(1);
    expect(images[0].alt).toBeNull();
  });

  it('detects empty alt attribute', () => {
    const content = `<img src="/decorative.png" alt="" />`;
    const images = extractImages(content);
    expect(images).toHaveLength(1);
    expect(images[0].alt).toBe('');
  });

  it('extracts Next.js Image components', () => {
    const content = `<Image src="/banner.webp" alt="Banner" width={1200} />`;
    const images = extractImages(content);
    expect(images).toHaveLength(1);
    expect(images[0].src).toBe('/banner.webp');
    expect(images[0].alt).toBe('Banner');
  });

  it('extracts Markdown images', () => {
    const content = `![Alt text](/images/screenshot.png)`;
    const images = extractImages(content);
    expect(images).toHaveLength(1);
    expect(images[0]).toEqual({
      src: '/images/screenshot.png',
      alt: 'Alt text',
      line: 1,
    });
  });

  it('handles Markdown image with empty alt', () => {
    const content = `![](/images/test.png)`;
    const images = extractImages(content);
    expect(images).toHaveLength(1);
    expect(images[0].alt).toBeNull();
  });

  it('returns empty for no images', () => {
    const images = extractImages('const x = 1;');
    expect(images).toHaveLength(0);
  });
});

describe('analyzeImageAlts', () => {
  const filePath = 'src/pages/index.tsx';

  it('returns no findings when no images exist', () => {
    const findings = analyzeImageAlts('const x = 1;', filePath);
    expect(findings).toHaveLength(0);
  });

  it('reports missing alt attributes', () => {
    const content = `<img src="/a.png" />\n<img src="/b.png" />`;
    const findings = analyzeImageAlts(content, filePath);
    const finding = findings.find(f =>
      f.issue.includes('missing alt attribute')
    );
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('high');
    expect(finding!.issue).toContain('2 image(s)');
  });

  it('reports empty alt text', () => {
    const content = `<img src="/a.png" alt="" />`;
    const findings = analyzeImageAlts(content, filePath);
    const finding = findings.find(f => f.issue.includes('empty alt text'));
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('medium');
  });

  it('reports weak/generic alt text', () => {
    const content = `<img src="/a.png" alt="image" />`;
    const findings = analyzeImageAlts(content, filePath);
    const finding = findings.find(f =>
      f.issue.includes('generic/weak alt text')
    );
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('low');
  });

  it('does not flag descriptive alt text', () => {
    const content = `<img src="/team.jpg" alt="Our engineering team at the 2024 company retreat" />`;
    const findings = analyzeImageAlts(content, filePath);
    expect(findings).toHaveLength(0);
  });
});
