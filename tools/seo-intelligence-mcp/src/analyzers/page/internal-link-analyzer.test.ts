import { describe, expect, it } from 'vitest';
import {
  analyzeInternalLinks,
  extractInternalLinks,
} from './internal-link-analyzer.js';

describe('extractInternalLinks', () => {
  it('extracts Next.js Link components', () => {
    const content = `<Link href="/about">About Us</Link>`;
    const links = extractInternalLinks(content);
    expect(links).toHaveLength(1);
    expect(links[0]).toEqual({ href: '/about', text: 'About Us', line: 1 });
  });

  it('extracts standard anchor tags with internal paths', () => {
    const content = `<a href="/contact">Contact</a>`;
    const links = extractInternalLinks(content);
    expect(links).toHaveLength(1);
    expect(links[0].href).toBe('/contact');
  });

  it('extracts relative path links', () => {
    const content = `<Link href="./features">Features</Link>`;
    const links = extractInternalLinks(content);
    expect(links).toHaveLength(1);
    expect(links[0].href).toBe('./features');
  });

  it('extracts Markdown links', () => {
    const content = `[Home](/home)`;
    const links = extractInternalLinks(content);
    expect(links).toHaveLength(1);
    expect(links[0]).toEqual({ href: '/home', text: 'Home', line: 1 });
  });

  it('ignores external links', () => {
    const content = `<a href="https://example.com">External</a>`;
    const links = extractInternalLinks(content);
    expect(links).toHaveLength(0);
  });

  it('returns empty for no links', () => {
    const links = extractInternalLinks('const x = 1;');
    expect(links).toHaveLength(0);
  });
});

describe('analyzeInternalLinks', () => {
  const filePath = 'src/pages/index.tsx';

  it('reports no internal links', () => {
    const content = 'const page = () => <div>Hello world</div>';
    const findings = analyzeInternalLinks(content, filePath);
    const finding = findings.find(f =>
      f.issue.includes('No internal links found')
    );
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('high');
  });

  it('reports generic anchor text', () => {
    const content = `<Link href="/about">click here</Link>`;
    const findings = analyzeInternalLinks(content, filePath);
    const finding = findings.find(f => f.issue.includes('Generic anchor text'));
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('medium');
  });

  it('reports potentially broken internal link given routes', () => {
    const content = `<Link href="/nonexistent">Broken</Link>`;
    const routes = ['/', '/about', '/contact'];
    const findings = analyzeInternalLinks(content, filePath, routes);
    const finding = findings.find(f =>
      f.issue.includes('Potentially broken internal link')
    );
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe('high');
  });

  it('does not report broken link when route matches', () => {
    const content = `<Link href="/about">About</Link>`;
    const routes = ['/', '/about', '/contact'];
    const findings = analyzeInternalLinks(content, filePath, routes);
    const finding = findings.find(f => f.issue.includes('Potentially broken'));
    expect(finding).toBeUndefined();
  });
});
