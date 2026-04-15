import { describe, expect, it } from 'vitest';
import {
  isPageFile,
  isSupported,
  resolveSafePath,
} from '../shared/file-utils.js';

describe('isSupported', () => {
  it('accepts .tsx files', () => expect(isSupported('page.tsx')).toBe(true));
  it('accepts .ts files', () => expect(isSupported('util.ts')).toBe(true));
  it('accepts .jsx files', () => expect(isSupported('comp.jsx')).toBe(true));
  it('accepts .js files', () => expect(isSupported('script.js')).toBe(true));
  it('accepts .md files', () => expect(isSupported('readme.md')).toBe(true));
  it('accepts .mdx files', () => expect(isSupported('doc.mdx')).toBe(true));
  it('rejects .css files', () => expect(isSupported('style.css')).toBe(false));
  it('rejects .json files', () => expect(isSupported('data.json')).toBe(false));
  it('rejects .png files', () => expect(isSupported('image.png')).toBe(false));
});

describe('isPageFile', () => {
  it('accepts .tsx', () => expect(isPageFile('page.tsx')).toBe(true));
  it('accepts .ts', () => expect(isPageFile('api.ts')).toBe(true));
  it('accepts .jsx', () => expect(isPageFile('page.jsx')).toBe(true));
  it('accepts .js', () => expect(isPageFile('page.js')).toBe(true));
  it('rejects .md', () => expect(isPageFile('readme.md')).toBe(false));
  it('rejects .css', () => expect(isPageFile('style.css')).toBe(false));
});

describe('resolveSafePath', () => {
  it('resolves valid subpath', () => {
    const result = resolveSafePath('/project', 'src/pages/index.tsx');
    expect(result).toBe('/project/src/pages/index.tsx');
  });

  it('rejects path traversal with ../', () => {
    expect(() => resolveSafePath('/project', '../etc/passwd')).toThrow(
      'Path traversal detected'
    );
  });

  it('rejects absolute path outside base', () => {
    expect(() => resolveSafePath('/project', '/etc/passwd')).toThrow(
      'Path traversal detected'
    );
  });
});
