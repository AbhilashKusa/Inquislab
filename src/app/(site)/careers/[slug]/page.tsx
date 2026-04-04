'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import jobsData from '../../../../data/jobs.json';

export default function JobPage({ params }: { params: { slug: string } }) {
  const job = jobsData.find((j: any) => j.id === params.slug);

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
  }, [job]);

  if (!job) {
    return notFound();
  }

  return (
    <>
      <div className="page">
        <div className="breadcrumb">
          <Link href="/projects/industrial-automation">Industrial Automation</Link>
          <span className="sep">/</span>
          <span className="current">{job.title}</span>
        </div>

        <div className="role-header">
          <div className="role-team">{job.team}</div>
          <h1>{job.title}</h1>
          <div className="role-meta-bar">
            <span>{job.location}</span>
            <span className="dot"></span>
            <span>{job.type}</span>
            <span className="dot"></span>
            <span>{job.tags[0]}</span>
          </div>
          <p className="role-summary" dangerouslySetInnerHTML={{ __html: job.summary }}></p>
        </div>

        <div className="apply-bar">
          <a href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(job.applySubject)}&body=${encodeURIComponent(job.applyBody.replace(/\\n/g, '\n'))}`} className="btn btn-primary">Apply now →</a>
          <a href="mailto:hello@inquislab.com" className="btn btn-outline">Ask a question</a>
        </div>

        {job.sections.map((section: any, idx: number) => (
          <div key={idx} className="section reveal">
            <div className="section-title">{section.title}</div>
            <ul>
              {section.bullets.map((bullet: string, bidx: number) => (
                <li key={bidx} dangerouslySetInnerHTML={{ __html: bullet }}></li>
              ))}
            </ul>
          </div>
        ))}

        <Link href="/projects/industrial-automation" className="back-link"><span className="arrow">←</span> Back to Project</Link>
      </div>

      <style jsx>{`
        .page { max-width: 900px; margin: 0 auto; padding: 140px 48px 80px; }
        
        .breadcrumb { font-size: 13px; color: var(--fg-ghost); margin-bottom: 48px; display: flex; align-items: center; gap: 8px; opacity: 0; animation: fadeIn .6s ease .1s forwards; }
        .breadcrumb :global(a) { color: var(--fg-ghost); text-decoration: none; transition: color .3s; }
        .breadcrumb :global(a:hover) { color: var(--fg-dim); }
        .breadcrumb .sep { color: var(--fg-ghost); }
        .breadcrumb .current { color: var(--fg-dim); }
        
        .role-header { margin-bottom: 56px; padding-bottom: 40px; border-bottom: 1px solid var(--rule); }
        .role-team { font-size: 11px; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; opacity: 0; animation: fadeUp .7s ease .15s forwards; }
        .role-header h1 { font-size: clamp(32px, 5vw, 48px); font-weight: 600; line-height: 1.15; letter-spacing: -.02em; margin-bottom: 24px; opacity: 0; animation: fadeUp .8s ease .25s forwards; }
        .role-meta-bar { display: flex; gap: 24px; flex-wrap: wrap; font-size: 13px; color: var(--fg-dim); opacity: 0; animation: fadeUp .8s ease .35s forwards; }
        .role-meta-bar span { display: flex; align-items: center; gap: 6px; }
        .role-meta-bar .dot { width: 4px; height: 4px; background: var(--fg-ghost); border-radius: 50%; }
        .role-summary { font-size: 18px; color: var(--fg-dim); line-height: 1.7; font-weight: 300; margin-top: 24px; max-width: 720px; opacity: 0; animation: fadeUp .8s ease .4s forwards; }
        .role-summary :global(em) { font-style: normal; color: var(--fg); }
        
        .apply-bar { position: sticky; top: 76px; z-index: 40; background: rgba(5,5,5,.85); backdrop-filter: blur(12px); padding: 16px 0; margin-bottom: 48px; border-bottom: 1px solid var(--rule); }
        
        .section { margin-bottom: 48px; }
        .section-title { font-size: 12px; font-weight: 500; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--rule); }
        .section ul { list-style: none; display: flex; flex-direction: column; gap: 14px; }
        .section li { color: var(--fg-dim); padding-left: 20px; position: relative; font-size: 15px; line-height: 1.7; }
        .section li::before { content: '→'; position: absolute; left: 0; color: var(--accent); font-size: 13px; top: 2px; }
        .section li :global(em) { font-style: normal; color: var(--fg); }
        .section li :global(strong) { font-weight: 500; color: var(--fg); }
        
        .back-link { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--fg-ghost); text-decoration: none; margin-top: 64px; padding-top: 40px; border-top: 1px solid var(--rule); transition: color .3s; }
        .back-link:hover { color: var(--fg-dim); }
        .back-link:hover .arrow { transform: translateX(-4px); }

        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .reveal{opacity:0;transform:translateY(12px);transition:opacity .6s ease,transform .6s ease}
        .reveal.visible{opacity:1;transform:translateY(0)}

        @media(max-width: 768px) {
          .page { padding: 120px 24px 60px; }
          .role-meta-bar { flex-direction: column; gap: 8px; }
        }
      `}</style>
    </>
  );
}
