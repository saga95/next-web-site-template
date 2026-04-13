import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Dynamic Sitemap Generator
 *
 * TODO: Add your pages to the `pages` array below.
 * This generates a sitemap.xml dynamically from NEXT_PUBLIC_APP_URL.
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';

  // TODO: Add your pages here
  const pages = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    // { path: '/about', changefreq: 'monthly', priority: '0.8' },
    // { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    page => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate'
  );
  res.status(200).send(sitemap);
}
