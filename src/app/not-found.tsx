import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050505',
      color: '#f0f0f0',
      fontFamily: "'Poppins', system-ui, sans-serif",
      textAlign: 'center',
      padding: '48px',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase' as const, color: '#d96c3a', marginBottom: '24px' }}>404</div>
      <h1 style={{ fontSize: '36px', fontWeight: 600, letterSpacing: '-.02em', marginBottom: '16px' }}>Page not found</h1>
      <p style={{ fontSize: '15px', color: '#888', marginBottom: '36px', fontWeight: 300 }}>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, letterSpacing: '.04em', padding: '14px 28px', borderRadius: '6px', background: '#d96c3a', color: '#fff', textDecoration: 'none', transition: 'all .3s' }}>
        ← Go home
      </Link>
    </div>
  );
}
