import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-code">404</div>
      <h1 className="not-found-heading">Page not found</h1>
      <p className="not-found-text">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="not-found-link">
        ← Go home
      </Link>
    </div>
  );
}
