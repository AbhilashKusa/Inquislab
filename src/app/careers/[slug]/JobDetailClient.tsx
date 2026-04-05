'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { buildMailtoLink } from '@/lib/job-utils';

interface Job {
  id: string;
  team: string;
  title: string;
  location: string;
  type: string;
  tags: string[];
  summary: string;
  sections: { title: string; bullets: string[] }[];
  applyEmail: string;
  applySubject: string;
  applyBody: string;
}

export function JobDetailClient({ job }: { job: Job }) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <article className="jd-page">
        <div className="jd-breadcrumb reveal">
          <Link href="/">Home</Link>
          <span className="jd-sep">/</span>
          <Link href="/careers">Careers</Link>
          <span className="jd-sep">/</span>
          <span className="jd-current">{job.title}</span>
        </div>

        <header className="jd-header reveal" style={{ animationDelay: '0.1s' }}>
          <h1 className="jd-title">{job.title}</h1>
        </header>

        <div className="jd-grid">
          {/* Main Content Column */}
          <div className="jd-main">
            <p className="jd-summary reveal" style={{ animationDelay: '0.2s' }} dangerouslySetInnerHTML={{ __html: job.summary }}></p>

            {job.sections.map((section, idx) => (
              <section key={idx} className="jd-section reveal" style={{ animationDelay: `${0.3 + (idx * 0.1)}s` }}>
                <h2 className="jd-section-title">{section.title}</h2>
                <ul className="jd-bullets">
                  {section.bullets.map((bullet, bidx) => (
                    <li key={bidx} dangerouslySetInnerHTML={{ __html: bullet }}></li>
                  ))}
                </ul>
              </section>
            ))}

            <Link href="/careers" className="jd-back-link reveal" style={{ animationDelay: '0.6s' }}>
              ← Back to all roles
            </Link>
          </div>

          {/* Sticky Sidebar Column */}
          <aside className="jd-sidebar reveal" style={{ animationDelay: '0.25s' }}>
            <div className="jd-sidebar-inner">
              <div className="jd-team">{job.team}</div>
              
              <div className="jd-pills">
                <div className="jd-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {job.location}
                </div>
                <div className="jd-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  {job.type}
                </div>
                {job.tags && job.tags.length > 0 && job.tags[0] && (
                  <div className="jd-pill jd-pill-accent">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                    {job.tags[0]}
                  </div>
                )}
              </div>

              <div className="jd-actions">
                <a href={buildMailtoLink(job.applyEmail, job.applySubject, job.applyBody)} className="btn btn-primary jd-apply-btn">Apply for this job →</a>
                <a href="mailto:hello@inquislab.com" className="btn btn-outline jd-ask-btn">Questions? Email us</a>
              </div>
            </div>
          </aside>
        </div>
      </article>

      <style jsx global>{`
        .jd-page { max-width: 1100px; margin: 0 auto; padding: 140px 48px 80px; }
        
        .jd-breadcrumb { font-size: 13px; color: var(--fg-ghost); margin-bottom: 40px; display: flex; align-items: center; gap: 8px; }
        .jd-breadcrumb a { color: var(--fg-ghost) !important; text-decoration: none !important; transition: color .3s; }
        .jd-breadcrumb a:hover { color: var(--fg-dim) !important; }
        .jd-sep { color: var(--fg-ghost); opacity: .5; }
        .jd-current { color: var(--fg-dim); }
        
        .jd-header { margin-bottom: 56px; }
        .jd-title { font-size: clamp(40px, 6vw, 64px) !important; font-weight: 600 !important; line-height: 1.1 !important; letter-spacing: -.03em !important; color: var(--fg); }
        
        .jd-grid { display: grid; grid-template-columns: 1fr 340px; gap: 80px; align-items: start; }
        
        .jd-summary { font-size: 20px; color: var(--fg-ghost); line-height: 1.6; font-weight: 300; margin-bottom: 64px; }
        .jd-summary em { font-style: normal; color: var(--fg); }
        
        .jd-section { margin-bottom: 64px; }
        .jd-section-title { font-size: 24px; font-weight: 500; letter-spacing: -.02em; color: var(--fg); margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--rule); }
        
        .jd-bullets { list-style: none; display: flex; flex-direction: column; gap: 16px; padding: 0; }
        .jd-bullets li { color: var(--fg-dim); padding-left: 24px; position: relative; font-size: 16px; line-height: 1.7; }
        .jd-bullets li::before { content: ''; position: absolute; left: 0; top: 10px; width: 6px; height: 6px; background: var(--accent); border-radius: 50%; opacity: 0.8; }
        .jd-bullets li em { font-style: normal; color: var(--fg); }
        .jd-bullets li strong { font-weight: 500; color: var(--fg); }
        
        .jd-sidebar-inner { position: sticky; top: 110px; padding: 32px; background: rgba(255,255,255,0.015); border: 1px solid var(--rule); border-radius: 12px; }
        .jd-team { font-size: 12px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); margin-bottom: 24px; }
        
        .jd-pills { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid var(--rule); }
        .jd-pill { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--fg-dim); font-weight: 400; }
        .jd-pill svg { color: var(--fg-ghost); }
        .jd-pill-accent { color: var(--accent); }
        .jd-pill-accent svg { color: var(--accent); }
        
        .jd-actions { display: flex; flex-direction: column; gap: 12px; }
        .jd-apply-btn, .jd-ask-btn { width: 100%; justify-content: center; padding: 16px; font-size: 14px; }
        
        .jd-back-link { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--fg-ghost) !important; text-decoration: none !important; margin-top: 24px; padding-top: 40px; border-top: 1px solid var(--rule); transition: color .3s; }
        .jd-back-link:hover { color: var(--fg-dim) !important; }
        
        .reveal { opacity: 0; transform: translateY(16px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        @media(max-width: 900px) {
          .jd-grid { grid-template-columns: 1fr; gap: 56px; }
          .jd-sidebar-inner { position: relative; top: 0; padding: 24px; }
        }
        @media(max-width: 768px) {
          .jd-page { padding: 120px 24px 60px; }
          .jd-title { font-size: 36px !important; }
          .jd-pills { flex-direction: row; flex-wrap: wrap; gap: 20px; }
        }
      `}</style>
    </>
  );
}
