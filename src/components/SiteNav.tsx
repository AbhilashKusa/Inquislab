'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav">
      <div className="nav-inner" style={{ justifyContent: pathname === '/' ? 'flex-end' : 'space-between' }}>
        {pathname !== '/' && (
          <Link href="/" className="logo">
            Inquis<span>Lab</span>
          </Link>
        )}
        <div className="nav-links">
          <Link href="/careers">Careers</Link>
        </div>
      </div>
    </nav>
  );
}
