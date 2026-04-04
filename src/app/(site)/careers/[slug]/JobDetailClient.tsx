'use client';
import { useEffect } from 'react';
import Link from 'next/link';

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
      <div className="jd-page">
        <div className="jd-breadcrumb">
          <Link href="/projects/industrial-automation">Industrial Automation</Link>
          <span className="jd-sep">/</span>
          <span className="jd-current">{job.title}</span>
        </div>

        <div className="jd-header">
          <div className="jd-team">{job.team}</div>
          <h1 className="jd-title">{job.title}</h1>
          <div className="jd-meta-bar">
            <span>{job.location}</span>
            <span className="jd-dot"></span>
            <span>{job.type}</span>
            <span className="jd-dot"></span>
            <span>{job.tags[0]}</span>
          </div>
          <p className="jd-summary" dangerouslySetInnerHTML={{ __html: job.summary }}></p>
        </div>

        <div className="jd-apply-bar">
          <a href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(job.applySubject)}&body=${encodeURIComponent(job.applyBody.replace(/\\n/g, '\n'))}`} className="btn btn-primary">Apply now →</a>
          <a href="mailto:hello@inquislab.com" className="btn btn-outline">Ask a question</a>
        </div>

        {job.sections.map((section, idx) => (
          <div key={idx} className="jd-section reveal">
            <div className="jd-section-title">{section.title}</div>
            <ul className="jd-bullets">
              {section.bullets.map((bullet, bidx) => (
                <li key={bidx} dangerouslySetInnerHTML={{ __html: bullet }}></li>
              ))}
            </ul>
          </div>
        ))}

        <Link href="/projects/industrial-automation" className="jd-back-link">
          ← Back to Project
        </Link>
      </div>

      <style jsx global>{`
        .jd-page { max-width: 900px; margin: 0 auto; padding: 140px 48px 80px; }
        
        .jd-breadcrumb { font-size: 13px; color: var(--fg-ghost); margin-bottom: 48px; display: flex; align-items: center; gap: 8px; opacity: 0; animation: fadeUp .6s ease .1s forwards; }
        .jd-breadcrumb a { color: var(--fg-ghost) !important; text-decoration: none !important; transition: color .3s; }
        .jd-breadcrumb a:hover { color: var(--fg-dim) !important; }
        .jd-sep { color: var(--fg-ghost); }
        .jd-current { color: var(--fg-dim); }
        
        .jd-header { margin-bottom: 56px; padding-bottom: 40px; border-bottom: 1px solid var(--rule); }
        .jd-team { font-size: 11px; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; opacity: 0; animation: fadeUp .7s ease .15s forwards; }
        .jd-title { font-size: clamp(32px, 5vw, 48px) !important; font-weight: 600 !important; line-height: 1.15 !important; letter-spacing: -.02em !important; margin-bottom: 24px !important; opacity: 0; animation: fadeUp .8s ease .25s forwards; }
        .jd-meta-bar { display: flex; gap: 24px; flex-wrap: wrap; font-size: 13px; color: var(--fg-dim); opacity: 0; animation: fadeUp .8s ease .35s forwards; }
        .jd-meta-bar span { display: flex; align-items: center; gap: 6px; }
        .jd-dot { width: 4px; height: 4px; background: var(--fg-ghost); border-radius: 50%; }
        .jd-summary { font-size: 18px; color: var(--fg-dim); line-height: 1.7; font-weight: 300; margin-top: 24px; max-width: 720px; opacity: 0; animation: fadeUp .8s ease .4s forwards; }
        .jd-summary em { font-style: normal; color: var(--fg); }
        
        .jd-apply-bar { position: sticky; top: 76px; z-index: 40; background: rgba(5,5,5,.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); padding: 16px 0; margin-bottom: 48px; border-bottom: 1px solid var(--rule); display: flex; gap: 12px; }
        
        .jd-section { margin-bottom: 48px; }
        .jd-section-title { font-size: 12px; font-weight: 500; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--rule); }
        .jd-bullets { list-style: none; display: flex; flex-direction: column; gap: 14px; padding: 0; }
        .jd-bullets li { color: var(--fg-dim); padding-left: 20px; position: relative; font-size: 15px; line-height: 1.7; }
        .jd-bullets li::before { content: '→'; position: absolute; left: 0; color: var(--accent); font-size: 13px; top: 2px; }
        .jd-bullets li em { font-style: normal; color: var(--fg); }
        .jd-bullets li strong { font-weight: 500; color: var(--fg); }
        
        .jd-back-link { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--fg-ghost) !important; text-decoration: none !important; margin-top: 64px; padding-top: 40px; border-top: 1px solid var(--rule); transition: color .3s; }
        .jd-back-link:hover { color: var(--fg-dim) !important; }

        @media(max-width: 768px) {
          .jd-page { padding: 120px 24px 60px; }
          .jd-meta-bar { flex-direction: column; gap: 8px; }
        }
      `}</style>
    </>
  );
}
