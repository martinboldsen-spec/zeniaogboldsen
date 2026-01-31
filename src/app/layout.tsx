import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import '@/app/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getPageContent } from '@/lib/page-content-service';
import { Suspense } from 'react';
import AnalyticsWrapper from '@/components/layout/AnalyticsWrapper';

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getPageContent();
  const seo = content?.seo;

  const titleTemplate = seo?.titleTemplate || '%s | Zenia & Boldsen';
  const defaultTitle = seo?.defaultTitle || 'Zenia & Boldsen | Kunst og Keramik';
  const description = seo?.description || 'Udforsk unikke malerier af Martin Boldsen og håndlavet keramik af Anja Zenia.';
  const keywords = seo?.keywords || ['kunst', 'galleri', 'malerier', 'keramik', 'martin boldsen', 'anja zenia'];
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
  const fullUrl = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;

  const ogImageUrl = seo?.ogImageUrl 
    ? (seo.ogImageUrl.startsWith('http') ? seo.ogImageUrl : `${fullUrl}${seo.ogImageUrl}`)
    : undefined;
    
  const iconsBaseUrl = 'https://storage.googleapis.com/malerier/zeniaogboldsen';

  return {
    metadataBase: new URL(fullUrl),
    title: {
      template: titleTemplate,
      default: defaultTitle,
    },
    description: description,
    keywords: keywords,
    openGraph: {
      title: defaultTitle,
      description: description,
      siteName: defaultTitle,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
      type: 'website',
      locale: 'da_DK',
    },
    icons: {
      shortcut: `${iconsBaseUrl}/favicon.ico`,
      icon: [
        { url: `${iconsBaseUrl}/favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
        { url: `${iconsBaseUrl}/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
        { url: `${iconsBaseUrl}/android-chrome-192x192.png`, sizes: '192x192', type: 'image/png' },
        { url: `${iconsBaseUrl}/android-chrome-512x512.png`, sizes: '512x512', type: 'image/png' },
      ],
      apple: {
        url: `${iconsBaseUrl}/apple-touch-icon.png`,
        type: 'image/png',
      },
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Toaster />
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
