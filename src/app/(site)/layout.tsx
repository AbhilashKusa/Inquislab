import Link from 'next/link';
import { NavLink } from '@/components/NavLink';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav style={{ padding: '24px 0', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(5,5,5,.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }} className="nav-inner">
          <Link href="/" style={{ fontWeight: 600, fontSize: '18px', letterSpacing: '.02em', color: 'var(--fg)', textDecoration: 'none' }} className="logo">
            Inquis<span style={{ color: 'var(--accent)' }}>Lab</span>
          </Link>
          <div style={{ display: 'flex', gap: '32px', fontSize: '13px', fontWeight: 400, letterSpacing: '.04em', color: 'var(--fg-ghost)' }} className="nav-links">
            <NavLink href="/" exact>Home</NavLink>
            <NavLink href="/careers">Careers</NavLink>
            <Link href="mailto:hello@inquislab.com" style={{ textDecoration: 'none', transition: 'color .3s' }}>Contact</Link>
          </div>
        </div>
      </nav>

      {children}

      <footer style={{ borderTop: '1px solid var(--rule)', padding: '28px 0', fontSize: '12px', color: 'var(--fg-ghost)', letterSpacing: '.03em', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }} className="footer-inner">
          <div>InquisLab © 2026</div>
          <Link href="mailto:hello@inquislab.com" style={{ color: 'var(--fg-ghost)', textDecoration: 'none', transition: 'color .3s' }}>hello@inquislab.com</Link>
          <div>Remote · India</div>
        </div>
      </footer>
    </>
  );
}
