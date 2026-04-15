import { access, readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { FileNotFoundError, UnsupportedFileError } from './errors.js';

const SUPPORTED_EXTENSIONS = new Set([
  '.tsx',
  '.ts',
  '.jsx',
  '.js',
  '.md',
  '.mdx',
]);
const PAGE_EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js']);

export function isSupported(filePath: string): boolean {
  return SUPPORTED_EXTENSIONS.has(extname(filePath));
}

export function isPageFile(filePath: string): boolean {
  return PAGE_EXTENSIONS.has(extname(filePath));
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readFileContent(filePath: string): Promise<string> {
  const resolved = resolve(filePath);

  if (!(await fileExists(resolved))) {
    throw new FileNotFoundError(resolved);
  }

  if (!isSupported(resolved)) {
    throw new UnsupportedFileError(resolved);
  }

  return readFile(resolved, 'utf-8');
}

export function resolveSafePath(basePath: string, targetPath: string): string {
  const resolved = resolve(basePath, targetPath);
  const rel = relative(basePath, resolved);

  if (rel.startsWith('..') || resolve(basePath, rel) !== resolved) {
    throw new Error(`Path traversal detected: ${targetPath}`);
  }

  return resolved;
}

export async function findPageFiles(pagesDir: string): Promise<string[]> {
  const pages: string[] = [];

  async function walk(dir: string): Promise<void> {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (isPageFile(fullPath) && !entry.name.startsWith('_')) {
        pages.push(fullPath);
      }
    }
  }

  await walk(pagesDir);
  return pages;
}

export async function getFileStats(
  filePath: string
): Promise<{ size: number; modified: Date }> {
  const stats = await stat(filePath);
  return { size: stats.size, modified: stats.mtime };
}
