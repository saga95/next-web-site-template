/**
 * SEO, AEO, and GEO Configuration
 *
 * Centralized SEO metadata management for consistent optimization across all pages.
 * Patterns derived from friday.lk, nconnection, and tmsaaokenki-dev/website.
 *
 * SEO = Search Engine Optimization (Google, Bing, Yahoo)
 * AEO = Answer Engine Optimization (Featured Snippets, Voice Search, AI Answers)
 * GEO = Generative Engine Optimization (ChatGPT, Perplexity, Bing Copilot, Claude)
 */

// ─── Site-wide Configuration ───────────────────────────────────────────────────

// TODO: Update SITE_URL and SITE_NAME in .env.local for your project
export const SITE_URL =
  process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';
export const SITE_NAME = process.env['NEXT_PUBLIC_APP_NAME'] || 'My App';

// TODO: Replace public/og-image.svg with your actual OG image (1200×630px JPG/PNG recommended)
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og-image.svg`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} - Open Graph Image`,
};

// ─── Default Metadata ──────────────────────────────────────────────────────────

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: { url: string; alt: string; width?: number; height?: number };
  noIndex?: boolean;
  type?: 'website' | 'article' | 'product';
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

/**
 * Generate full page metadata for Next.js Head component.
 * Use in getStaticProps/getServerSideProps or directly in pages.
 */
export function generatePageMeta(page: PageMetadata) {
  const url = page.path ? `${SITE_URL}${page.path}` : SITE_URL;
  const image = page.image || DEFAULT_OG_IMAGE;

  return {
    title: page.title,
    description: page.description,
    canonical: url,
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: SITE_NAME,
      type: page.type || 'website',
      locale: page.locale || 'en_US',
      images: [
        {
          url: image.url,
          width: image.width || 1200,
          height: image.height || 630,
          alt: image.alt,
        },
      ],
      ...(page.publishedTime && {
        article: {
          publishedTime: page.publishedTime,
          modifiedTime: page.modifiedTime,
          authors: page.author ? [page.author] : undefined,
        },
      }),
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: page.title,
      description: page.description,
      images: [image.url],
    },
    robots: page.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
          },
        },
    alternates: {
      canonical: url,
    },
    ...(page.keywords && { keywords: page.keywords }),
  };
}

// ─── JSON-LD Structured Data Generators ────────────────────────────────────────

/**
 * Generate Organization JSON-LD.
 * Place in root layout for site-wide organization schema.
 */
export function generateOrganizationJsonLd(org?: {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org?.name || SITE_NAME,
    url: org?.url || SITE_URL,
    ...(org?.logo && { logo: org.logo }),
    ...(org?.description && { description: org.description }),
    ...(org?.email && { email: org.email }),
    ...(org?.phone && { telephone: org.phone }),
    ...(org?.address && {
      address: {
        '@type': 'PostalAddress',
        ...(org.address.street && { streetAddress: org.address.street }),
        ...(org.address.city && { addressLocality: org.address.city }),
        ...(org.address.region && { addressRegion: org.address.region }),
        ...(org.address.postalCode && { postalCode: org.address.postalCode }),
        ...(org.address.country && { addressCountry: org.address.country }),
      },
    }),
    ...(org?.sameAs && { sameAs: org.sameAs }),
  };
}

/**
 * Generate WebSite JSON-LD with SearchAction.
 * Enables sitelinks search box in Google.
 */
export function generateWebSiteJsonLd(options?: {
  name?: string;
  url?: string;
  searchPath?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: options?.name || SITE_NAME,
    url: options?.url || SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${options?.url || SITE_URL}${options?.searchPath || '/search?q={search_term_string}'}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD.
 * Pass breadcrumb items for the current page hierarchy.
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQ JSON-LD for rich results.
 * Each FAQ should have a question and answer.
 */
export function generateFAQJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article JSON-LD for blog posts / content pages.
 */
export function generateArticleJsonLd(article: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: { name: string; url?: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    ...(article.image && { image: article.image }),
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author.name,
      ...(article.author.url && { url: article.author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/**
 * Generate LocalBusiness JSON-LD.
 */
export function generateLocalBusinessJsonLd(business: {
  name: string;
  description?: string;
  url?: string;
  phone?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    region?: string;
    postalCode?: string;
    country: string;
  };
  openingHours?: string[];
  priceRange?: string;
  image?: string;
  geo?: { latitude: number; longitude: number };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    ...(business.description && { description: business.description }),
    ...(business.url && { url: business.url }),
    ...(business.phone && { telephone: business.phone }),
    ...(business.email && { email: business.email }),
    ...(business.image && { image: business.image }),
    ...(business.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address.street,
        addressLocality: business.address.city,
        ...(business.address.region && {
          addressRegion: business.address.region,
        }),
        ...(business.address.postalCode && {
          postalCode: business.address.postalCode,
        }),
        addressCountry: business.address.country,
      },
    }),
    ...(business.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      },
    }),
    ...(business.openingHours && {
      openingHoursSpecification: business.openingHours,
    }),
    ...(business.priceRange && { priceRange: business.priceRange }),
  };
}

/**
 * Generate Product JSON-LD for e-commerce or SaaS product pages.
 */
export function generateProductJsonLd(product: {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  rating?: { value: number; count: number };
  brand?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: product.url,
    ...(product.image && { image: product.image }),
    ...(product.brand && { brand: { '@type': 'Brand', name: product.brand } }),
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'USD',
        availability: `https://schema.org/${product.availability || 'InStock'}`,
        url: product.url,
      },
    }),
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.value,
        reviewCount: product.rating.count,
      },
    }),
  };
}

// ─── Utility: Safe JSON-LD Script Tag Props ────────────────────────────────────

/**
 * Returns props for a <script> tag to embed JSON-LD.
 * Usage: <script {...jsonLdScriptProps(data)} />
 */
export function jsonLdScriptProps(data: Record<string, unknown>) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    },
  };
}

// ─── Sitemap Ping ──────────────────────────────────────────────────────────────

/**
 * Ping search engines about sitemap updates.
 * Call after content changes in production.
 */
export async function pingSitemap(sitemapUrl?: string): Promise<void> {
  const url = sitemapUrl || `${SITE_URL}/sitemap.xml`;
  const endpoints = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(url)}`,
  ];

  await Promise.allSettled(
    endpoints.map(endpoint =>
      fetch(endpoint, { method: 'GET' }).catch(() => {
        // Silently fail — ping is best-effort
      })
    )
  );
}
