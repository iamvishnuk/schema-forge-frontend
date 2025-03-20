import './globals.css';

import type { Metadata } from 'next';
import { Geist, Roboto } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import QueryProvider from '@/context/query-provider';

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
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${roboto.variable} overflow-x-hidden bg-linear-to-b from-slate-900 to-slate-800 antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
