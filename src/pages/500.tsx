import Head from 'next/head';
import { SITE_NAME } from '@/lib/seo';

export default function Custom500() {
  return (
    <>
      <Head>
        <title>{`Server Error | ${SITE_NAME}`}</title>
      </Head>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <h1 style={{ fontSize: '4rem', margin: 0 }}>500</h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginTop: '0.5rem' }}>
          Something went wrong on our end
        </p>
        <a
          href='/'
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Go home
        </a>
      </div>
    </>
  );
}
