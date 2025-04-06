import './globals.css';

import type { Metadata } from 'next';
import { Geist, Roboto } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import QueryProvider from '@/context/query-provider';
import { ThemeProvider } from '@/context/theme-provider';
import ReduxProvider from '@/store/ReduxProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: 'Schema Forge',
  description: 'A tool for creating and managing JSON schemas.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${roboto.variable} overflow-x-hidden antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
          storageKey='schema-forge-theme'
        >
          <ReduxProvider>
            <QueryProvider>{children}</QueryProvider>
          </ReduxProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
