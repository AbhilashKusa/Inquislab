import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import SiteNav from '@/components/SiteNav';

export const metadata: Metadata = {
  title: 'InquisLab — AI Software for Industrial Operations',
  description: 'We build AI software for the industries that build everything else. Refineries, chemical plants, factories — their software is decades old. We\'re changing that.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <SiteNav />

        <main>{children}</main>

        <footer className="site-footer">
          <div className="footer-inner">
            <div>InquisLab © 2026</div>
            <Link href="mailto:hello@inquislab.com">hello@inquislab.com</Link>
            <div>Remote · India</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
