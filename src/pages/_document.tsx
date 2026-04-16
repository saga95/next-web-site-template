import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        {/* Meta for theme color (mobile browser chrome) */}
        <meta
          name='theme-color'
          content='#6366f1'
          media='(prefers-color-scheme: light)'
        />
        <meta
          name='theme-color'
          content='#818cf8'
          media='(prefers-color-scheme: dark)'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
