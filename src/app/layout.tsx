import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

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
        <nav className="site-nav">
          <div className="nav-inner">
            <Link href="/" className="logo">
              Inquis<span>Lab</span>
            </Link>
            <div className="nav-links">
              <Link href="/#roles">Roles</Link>
              <Link href="/admin">Controller</Link>
              <Link href="mailto:careers@inquislab.com">Contact</Link>
            </div>
          </div>
        </nav>

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
