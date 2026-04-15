/**
 * TEMPLATE DEMO PAGE
 *
 * TODO: Replace this entire page with your own homepage.
 * This demo showcases the template features for first-time setup verification.
 *
 * Quick steps:
 * 1. Replace the content inside <main> with your own
 * 2. SEO meta tags below use env vars — configure in .env.local
 * 3. Or use generatePageMeta() from '@/lib/seo' for dynamic metadata
 */

import Head from 'next/head';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const features = [
    { icon: '⚡', title: 'Next.js 14.2', desc: 'React framework with SSR/SSG' },
    { icon: '📘', title: 'TypeScript 5', desc: 'Type-safe development' },
    { icon: '🎨', title: 'Material UI v6', desc: 'Comprehensive components' },
    { icon: '🌍', title: 'i18n Support', desc: '7 languages ready' },
    { icon: '♿', title: 'WCAG 2.2 AA', desc: 'Accessibility compliant' },
    { icon: '🔒', title: 'Security', desc: 'CSP, HTTPS, secure cookies' },
    { icon: '📱', title: 'Responsive', desc: 'Mobile-first design' },
    { icon: '🚀', title: 'Deploy Ready', desc: 'Vercel, Netlify, AWS' },
  ];

  const title = `${SITE_NAME} | Production-Ready Starter`;
  const description =
    'Battle-tested Next.js template with TypeScript, Material UI, i18n (7 languages), WCAG 2.2 AA accessibility, and enterprise-grade features.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='title' content={title} />
        <meta name='description' content={description} />
        <meta
          name='keywords'
          content='Next.js, TypeScript, React, Template, Material UI, i18n, Accessible, SEO, Enterprise'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={SITE_URL} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={`${SITE_URL}/og-image.svg`} />
        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content={SITE_URL} />
        <meta property='twitter:title' content={title} />
        <meta property='twitter:description' content={description} />
        <meta property='twitter:image' content={`${SITE_URL}/og-image.svg`} />
        <link rel='icon' href='/favicon.ico' />
        <link rel='canonical' href={SITE_URL} />
      </Head>

      <div className={styles['page']}>
        <main className={styles['main']}>
          <header className={styles['header']}>
            <h1 className={styles['title']}>
              <span className={styles['gradient']}>Next.js</span> Enterprise
              Template
            </h1>
            <p className={styles['subtitle']}>
              Production-ready foundation for client projects, prototypes, and
              SaaS applications
            </p>
          </header>

          <section className={styles['features']}>
            {features.map((feature, index) => (
              <div key={index} className={styles['feature']}>
                <span className={styles['featureIcon']} aria-hidden='true'>
                  {feature.icon}
                </span>
                <h3 className={styles['featureTitle']}>{feature.title}</h3>
                <p className={styles['featureDesc']}>{feature.desc}</p>
              </div>
            ))}
          </section>

          <section className={styles['quickStart']}>
            <h2 className={styles['sectionTitle']}>Quick Start</h2>
            <div className={styles['codeBlock']}>
              <code>
                git clone https://github.com/saga95/next-web-site-template.git
                <br />
                cd next-web-site-template
                <br />
                npm install
                <br />
                npm run dev
              </code>
            </div>
          </section>

          <div className={styles['ctas']}>
            <a
              href='https://github.com/saga95/next-web-site-template'
              target='_blank'
              rel='noopener noreferrer'
              className={styles['primary']}
            >
              <svg
                width='20'
                height='20'
                fill='currentColor'
                viewBox='0 0 16 16'
                aria-hidden='true'
              >
                <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z' />
              </svg>
              View on GitHub
            </a>
            <a
              href='https://github.com/saga95/next-web-site-template/blob/main/README.md'
              target='_blank'
              rel='noopener noreferrer'
              className={styles['secondary']}
            >
              📚 Read Documentation
            </a>
          </div>

          <section className={styles['useCases']}>
            <h2 className={styles['sectionTitle']}>Perfect For</h2>
            <div className={styles['useCaseGrid']}>
              <div className={styles['useCase']}>
                <h3>🏢 Client Projects</h3>
                <p>
                  Marketing sites and corporate websites with SEO optimization
                </p>
              </div>
              <div className={styles['useCase']}>
                <h3>🔐 Backoffice Apps</h3>
                <p>Admin dashboards and internal management tools</p>
              </div>
              <div className={styles['useCase']}>
                <h3>⚡ Rapid Prototypes</h3>
                <p>MVP validation and proof-of-concepts in 1-2 weeks</p>
              </div>
            </div>
          </section>
        </main>

        <footer className={styles['footer']}>
          <p className={styles['footerText']}>
            Built with ❤️ for modern web development
          </p>
          <div className={styles['footerLinks']}>
            <a
              href='https://github.com/saga95/next-web-site-template'
              target='_blank'
              rel='noopener noreferrer'
            >
              GitHub
            </a>
            <span className={styles['separator']}>•</span>
            <a
              href='https://github.com/saga95/next-web-site-template/blob/main/README.md'
              target='_blank'
              rel='noopener noreferrer'
            >
              Documentation
            </a>
            <span className={styles['separator']}>•</span>
            <a
              href='https://github.com/saga95/next-web-site-template/issues'
              target='_blank'
              rel='noopener noreferrer'
            >
              Issues
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
