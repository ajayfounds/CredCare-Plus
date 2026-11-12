import type { Metadata, Viewport } from 'next';
import { Manrope, IBM_Plex_Mono } from 'next/font/google';
import '@/styles/tokens.css';
import '@/styles/app.css';
import '@/styles/shell.css';
import { AppProvider } from '@/lib/store';
import { Shell } from '@/components/Shell';

const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-manrope', display: 'swap' });
const plex = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex', display: 'swap' });

export const metadata: Metadata = {
  title: 'CredCare',
  description: 'A day-by-day plan to bring your CIBIL score back.',
  applicationName: 'CredCare',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F8F9FC',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${manrope.variable} ${plex.variable}`}>
      <body>
        <AppProvider>
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
