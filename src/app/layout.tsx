
import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AccessibilityWidget } from '@/components/AccessibilityWidget';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const viewport: Viewport = {
  themeColor: '#0070f3',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://chayaisrael.com'),
  title: {
    default: 'Chaya Israel | Charity & Support for Families in Israel',
    template: '%s | Chaya Israel'
  },
  description: 'Chaya Israel Foundation provides essential support for widows, orphans, IDF soldiers, and families in need across Israel. Established by Rabbi Avraham Kramer in 2004.',
  keywords: ['Chaya Israel', 'charity Israel', 'support IDF', 'widows and orphans', 'Rabbi Avraham Kramer', 'donation Israel', 'Jewish charity', 'Israel relief'],
  icons: {
    icon: '/Logo.png',
    shortcut: '/Logo.png',
    apple: '/Logo.png',
  },
  authors: [{ name: 'Rabbi Avraham Kramer' }],
  creator: 'Chaya Israel Foundation',
  publisher: 'Chaya Israel Foundation',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Chaya Israel | Charity & Support for Families in Israel',
    description: 'Providing essential food and assistance to hundreds of families, orphans, widows, and soldiers in Israel since 2004.',
    url: 'https://chayaisrael.com',
    siteName: 'Chaya Israel',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chaya Israel | Charity & Support for Families in Israel',
    description: 'Support widows, orphans, and IDF soldiers in Israel through Chaya Israel Foundation.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={cn(poppins.variable)}>
      <body className={cn('font-sans antialiased bg-white')}>
        <FirebaseClientProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-primary focus:text-white focus:px-6 focus:py-3 focus:rounded-full focus:shadow-2xl">
            Skip to main content
          </a>
          <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
          <AccessibilityWidget />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
