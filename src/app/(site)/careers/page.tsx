'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function CareersOverview() {
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
      <div className="page">
        <div className="hero">
          <div className="hero-tag">InquisLab Work</div>
          <h1>Projects</h1>
          <p>We build specialized AI for distinct problem spaces. See what we're working on and join the team.</p>
        </div>

        <div className="team-section reveal">
          <div className="team-header">
            <span className="team-num">ACTIVE</span>
            <h2 className="team-name">Projects</h2>
          </div>
          
          <Link href="/projects/industrial-automation" className="role-card">
            <div className="role-info">
              <div className="role-title">Industrial Automation</div>
              <div className="role-meta">
                <span>Refineries · Plants · Manufacturing</span>
                <span>Team forming now</span>
              </div>
            </div>
            <div className="role-arrow">→</div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .page { max-width: 1200px; margin: 0 auto; padding: 140px 48px 80px; }
        .hero { margin-bottom: 80px; }
        .hero-tag { font-size: 12px; font-weight: 500; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); margin-bottom: 24px; opacity: 0; animation: fadeUp .7s ease .1s forwards; }
        .hero h1 { font-size: clamp(36px, 5vw, 56px); font-weight: 600; line-height: 1.1; letter-spacing: -.03em; margin-bottom: 20px; opacity: 0; animation: fadeUp .8s ease .2s forwards; }
        .hero p { font-size: 17px; color: var(--fg-dim); max-width: 600px; font-weight: 300; line-height: 1.7; opacity: 0; animation: fadeUp .8s ease .35s forwards; }
        
        .team-section { margin-bottom: 64px; }
        .team-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--rule); }
        .team-num { font-size: 11px; font-weight: 500; letter-spacing: .2em; color: var(--fg-ghost); }
        .team-name { font-size: 20px; font-weight: 500; letter-spacing: -.01em; }
        
        .role-card { display: flex; justify-content: space-between; align-items: center; padding: 28px 32px; border: 1px solid var(--rule); border-radius: 8px; margin-bottom: 8px; text-decoration: none; color: var(--fg); transition: all .3s ease; position: relative; overflow: hidden; }
        .role-card::before { content: ''; position: absolute; inset: 0; background: var(--accent-soft); opacity: 0; transition: opacity .3s; }
        .role-card:hover { border-color: var(--rule-hover); transform: translateY(-1px); }
        .role-card:hover::before { opacity: 1; }
        .role-info { position: relative; z-index: 1; }
        .role-title { font-size: 18px; font-weight: 500; margin-bottom: 4px; letter-spacing: -.01em; }
        .role-meta { font-size: 13px; color: var(--fg-dim); font-weight: 300; display: flex; gap: 16px; flex-wrap: wrap; }
        .role-meta span { display: flex; align-items: center; gap: 6px; }
        .role-arrow { font-size: 18px; color: var(--fg-ghost); transition: all .3s; position: relative; z-index: 1; }
        .role-card:hover .role-arrow { color: var(--accent); transform: translateX(4px); }
        
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .reveal{opacity:0;transform:translateY(12px);transition:opacity .6s ease,transform .6s ease}
        .reveal.visible{opacity:1;transform:translateY(0)}

        @media(max-width: 768px) {
          .page { padding-left: 24px; padding-right: 24px; }
          .role-card { padding: 20px 24px; flex-direction: column; align-items: flex-start; gap: 12px; }
          .role-meta { flex-direction: column; gap: 4px; }
        }
      `}</style>
    </>
  );
}
