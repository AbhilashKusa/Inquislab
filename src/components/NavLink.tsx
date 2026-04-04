'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export function NavLink({ href, children, exact = false }: { href: string; children: React.ReactNode; exact?: boolean }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname?.startsWith(href);
  
  return (
    <Link 
      href={href} 
      style={{
        color: isActive ? 'var(--accent)' : 'inherit',
        textDecoration: 'none',
        transition: 'color .3s'
      }}
    >
      {children}
    </Link>
  );
}
