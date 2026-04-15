import { extractSchemas } from '../analyzers/page/schema-analyzer.js';
import { readFileContent, resolveSafePath } from '../shared/file-utils.js';
import { createLogger } from '../shared/logger.js';

const logger = createLogger('engine:schema');

export interface SchemaSuggestion {
  schemaType: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  starterJsonLd: Record<string, unknown>;
  implementationNotes: string;
}

export interface SchemaSuggestionResult {
  filePath: string;
  existingSchemas: string[];
  suggestions: SchemaSuggestion[];
}

const SCHEMA_TEMPLATES: Record<
  string,
  (context: PageContext) => SchemaSuggestion
> = {
  Organization: ctx => ({
    schemaType: 'Organization',
    reasoning:
      'Establishes brand identity for search engines and knowledge panels.',
    priority: 'high',
    starterJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Your Company Name',
      url: ctx.url ?? 'https://yoursite.com',
      logo: 'https://yoursite.com/logo.png',
      sameAs: [
        'https://twitter.com/yourcompany',
        'https://linkedin.com/company/yourcompany',
      ],
    },
    implementationNotes:
      'Add to the homepage or layout component. Update name, url, logo, and sameAs with real values.',
  }),

  FAQPage: () => ({
    schemaType: 'FAQPage',
    reasoning:
      'FAQ content detected. This schema can trigger rich FAQ results in Google.',
    priority: 'high',
    starterJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Your question here?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Your answer here.',
          },
        },
      ],
    },
    implementationNotes:
      'Extract Q&A pairs from the page content and populate the mainEntity array.',
  }),

  Article: () => ({
    schemaType: 'Article',
    reasoning:
      'Article/blog content detected. Article schema improves visibility in Google News and Discover.',
    priority: 'medium',
    starterJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Article Title',
      author: { '@type': 'Person', name: 'Author Name' },
      datePublished: new Date().toISOString().split('T')[0],
      image: 'https://yoursite.com/article-image.jpg',
    },
    implementationNotes:
      'Set headline from the page title, author from the post metadata, and datePublished from the publish date.',
  }),

  BreadcrumbList: () => ({
    schemaType: 'BreadcrumbList',
    reasoning:
      'Breadcrumb navigation detected. This schema enables breadcrumb display in search results.',
    priority: 'low',
    starterJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://yoursite.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Category',
          item: 'https://yoursite.com/category',
        },
      ],
    },
    implementationNotes:
      'Generate BreadcrumbList dynamically from the current route path.',
  }),

  Product: () => ({
    schemaType: 'Product',
    reasoning:
      'Product information detected. Product schema enables rich product results with price and ratings.',
    priority: 'high',
    starterJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Product Name',
      description: 'Product description',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
    implementationNotes:
      'Populate with actual product data from your data source.',
  }),

  LocalBusiness: () => ({
    schemaType: 'LocalBusiness',
    reasoning:
      'Suitable for businesses with physical locations to improve local search visibility.',
    priority: 'medium',
    starterJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Business Name',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Main St',
        addressLocality: 'City',
        addressRegion: 'State',
        postalCode: '12345',
        addressCountry: 'US',
      },
      telephone: '+1-555-555-5555',
    },
    implementationNotes:
      'Add to the homepage or contact page. Update with real business address and contact info.',
  }),

  WebSite: ctx => ({
    schemaType: 'WebSite',
    reasoning:
      'WebSite schema with SearchAction enables sitelinks search box in Google results.',
    priority: 'medium',
    starterJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Your Site Name',
      url: ctx.url ?? 'https://yoursite.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${ctx.url ?? 'https://yoursite.com'}/search?q={search_term}`,
        'query-input': 'required name=search_term',
      },
    },
    implementationNotes:
      'Add to the homepage. Update name and url. SearchAction is optional if no site search exists.',
  }),
};

interface PageContext {
  url?: string;
  hasFAQ: boolean;
  hasArticle: boolean;
  hasBreadcrumbs: boolean;
  hasProduct: boolean;
  isHomepage: boolean;
}

function inferContext(content: string, filePath: string): PageContext {
  const lower = content.toLowerCase();
  return {
    hasFAQ:
      lower.includes('faq') ||
      lower.includes('frequently asked') ||
      lower.includes('question'),
    hasArticle:
      lower.includes('article') ||
      lower.includes('blog') ||
      lower.includes('post'),
    hasBreadcrumbs: lower.includes('breadcrumb'),
    hasProduct:
      lower.includes('product') ||
      lower.includes('price') ||
      lower.includes('cart'),
    isHomepage: filePath.includes('index'),
  };
}

export async function runSchemaSuggestion(
  filePath: string,
  projectRoot: string,
  pageType?: string
): Promise<SchemaSuggestionResult> {
  const safePath = resolveSafePath(projectRoot, filePath);
  logger.info(`Running schema suggestion for ${safePath}`);

  const content = await readFileContent(safePath);
  const existingSchemas = extractSchemas(content).map(s => s.type);
  const context = inferContext(content, filePath);
  const existingSet = new Set(existingSchemas);

  const suggestions: SchemaSuggestion[] = [];

  // Homepage schemas
  if (context.isHomepage || pageType === 'landing') {
    if (!existingSet.has('Organization')) {
      suggestions.push(SCHEMA_TEMPLATES['Organization'](context));
    }
    if (!existingSet.has('WebSite')) {
      suggestions.push(SCHEMA_TEMPLATES['WebSite'](context));
    }
  }

  // Content-specific schemas
  if (context.hasFAQ && !existingSet.has('FAQPage')) {
    suggestions.push(SCHEMA_TEMPLATES['FAQPage'](context));
  }
  if (
    context.hasArticle &&
    !existingSet.has('Article') &&
    !existingSet.has('BlogPosting')
  ) {
    suggestions.push(SCHEMA_TEMPLATES['Article'](context));
  }
  if (context.hasBreadcrumbs && !existingSet.has('BreadcrumbList')) {
    suggestions.push(SCHEMA_TEMPLATES['BreadcrumbList'](context));
  }
  if (context.hasProduct && !existingSet.has('Product')) {
    suggestions.push(SCHEMA_TEMPLATES['Product'](context));
  }

  if (pageType === 'local-business' && !existingSet.has('LocalBusiness')) {
    suggestions.push(SCHEMA_TEMPLATES['LocalBusiness'](context));
  }

  return { filePath, existingSchemas, suggestions };
}

export function formatSchemaSuggestionReport(
  result: SchemaSuggestionResult
): string {
  const lines: string[] = [];

  lines.push(`## Schema Suggestions: ${result.filePath}`);
  lines.push('');

  if (result.existingSchemas.length > 0) {
    lines.push(`### Existing Schema: ${result.existingSchemas.join(', ')}`);
  } else {
    lines.push('### Existing Schema: None');
  }
  lines.push('');

  if (result.suggestions.length === 0) {
    lines.push('No additional schema opportunities identified.');
    return lines.join('\n');
  }

  lines.push(`### Suggested Schemas (${result.suggestions.length})`);
  lines.push('');

  for (const s of result.suggestions) {
    lines.push(`#### ${s.schemaType} [${s.priority.toUpperCase()}]`);
    lines.push(`**Why**: ${s.reasoning}`);
    lines.push('');
    lines.push('**Starter JSON-LD**:');
    lines.push('```json');
    lines.push(JSON.stringify(s.starterJsonLd, null, 2));
    lines.push('```');
    lines.push('');
    lines.push(`**Implementation**: ${s.implementationNotes}`);
    lines.push('');
  }

  return lines.join('\n');
}
