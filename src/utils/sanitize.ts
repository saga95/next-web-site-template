import DOMPurify from 'dompurify';

/**
 * Allowed HTML tags for rich text content (e.g., CMS, markdown rendered output).
 * Restrictive by default — extend per-project as needed.
 */
const RICH_TEXT_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
  'a', 'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'img', 'figure', 'figcaption',
  'div', 'span',
];

const RICH_TEXT_ATTRS = [
  'href', 'target', 'rel', 'src', 'alt', 'title',
  'class', 'id', 'width', 'height',
  'colspan', 'rowspan',
];

/**
 * Sanitize HTML string — allows a controlled set of tags and attributes.
 * Use for rendering CMS/markdown content where rich formatting is needed.
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side: strip all tags as a safe fallback
    return dirty.replace(/<[^>]*>/g, '');
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: RICH_TEXT_TAGS,
    ALLOWED_ATTR: RICH_TEXT_ATTRS,
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Strip all HTML and return plain text. Use for search indexing,
 * notification previews, or any context where markup is not wanted.
 */
export function sanitizeToText(dirty: string): string {
  if (typeof window === 'undefined') {
    return dirty.replace(/<[^>]*>/g, '').trim();
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

/**
 * Sanitize markdown-rendered HTML. Slightly more permissive for
 * code blocks and syntax highlighting spans.
 */
export function sanitizeMarkdown(dirty: string): string {
  if (typeof window === 'undefined') {
    return dirty.replace(/<[^>]*>/g, '');
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [...RICH_TEXT_TAGS, 'details', 'summary', 'abbr', 'del', 'ins'],
    ALLOWED_ATTR: [...RICH_TEXT_ATTRS, 'open', 'datetime', 'lang'],
    ALLOW_DATA_ATTR: false,
  });
}
