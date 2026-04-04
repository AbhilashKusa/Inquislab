'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import jobsData from '../../../../data/jobs.json';

export default function IndustrialAutomation() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Group jobs by team
  const teams = jobsData.reduce((acc, job) => {
    if (!acc[job.team]) acc[job.team] = [];
    acc[job.team].push(job);
    return acc;
  }, {} as Record<string, typeof jobsData>);

  const teamKeys = Object.keys(teams);

  return (
    <>
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-tag"><span className="dot"></span> Project 01</div>
          <h1>Industrial <em>Automation</em></h1>
          <p className="hero-sub">We're building software that changes how industrial operations run. Refineries, plants, logistics — the physical systems the world depends on run on software that's decades old.</p>
          <div className="hero-actions">
            <a href="#roles" className="btn btn-primary">See open roles <span className="arrow">↓</span></a>
          </div>
        </div>
      </section>

      <section className="strip">
        <div className="strip-inner">
          <div className="strip-item reveal">
            <div className="strip-num">01</div>
            <h3>Alarm Overload</h3>
            <p>Operators drown in alarms. Critical signals get lost. We fix this.</p>
          </div>
          <div className="strip-item reveal">
            <div className="strip-num">02</div>
            <h3>Rationalization</h3>
            <p>Months of spreadsheet work eliminated through AI analysis.</p>
          </div>
          <div className="strip-item reveal">
            <div className="strip-num">03</div>
            <h3>Intelligence</h3>
            <p>Pattern recognition and predictive insights for heavy operations.</p>
          </div>
        </div>
      </section>

      <section id="roles" className="roles-section">
        <div className="narrow-container">
          <div className="cta-header reveal">
            <h2>The Teams</h2>
            <p>Engineers and marketers building something that matters.</p>
          </div>

          {teamKeys.map((team, index) => (
            <div key={team} className="team-section reveal">
              <div className="team-header">
                <span className="team-num">TEAM 0{index + 1}</span>
                <h2 className="team-name">{team.split('·')[1]?.trim() || team}</h2>
              </div>
              <p className="team-desc">
                {index === 0 
                  ? "Two engineers building our first product together. Research and build, working as a pair." 
                  : "Two people finding the first hundred customers through content, outreach, and viral video."}
              </p>
              {teams[team].map(job => (
                <Link key={job.id} href={`/careers/${job.id}`} className="role-card">
                  <div className="role-info">
                    <div className="role-title">{job.title}</div>
                    <div className="role-meta">
                      <span>{job.location}</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="role-arrow">→</div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .hero {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 120px 48px 80px;
          overflow: hidden;
        }
        .hero-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(217,108,58,.06) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: breathe 8s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { opacity: .6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
        .hero-content {
          text-align: center;
          max-width: 800px;
          position: relative;
          z-index: 1;
        }
        .hero-tag {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          opacity: 0;
          animation: fadeIn .8s ease .2s forwards;
        }
        .hero h1 {
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -.03em;
          margin-bottom: 28px;
          opacity: 0;
          animation: fadeUp 1s ease .35s forwards;
        }
        .hero h1 em {
          font-style: normal;
          color: var(--accent);
          font-weight: 600;
        }
        .hero-sub {
          font-size: 18px;
          font-weight: 300;
          color: var(--fg-dim);
          max-width: 580px;
          margin: 0 auto 48px;
          line-height: 1.7;
          opacity: 0;
          animation: fadeUp 1s ease .55s forwards;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          opacity: 0;
          animation: fadeUp 1s ease .7s forwards;
        }
        
        .strip { padding: 80px 0; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
        .strip-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; }
        .strip-item { padding: 40px; text-align: center; position: relative; }
        .strip-item::after { content: ''; position: absolute; right: 0; top: 20%; height: 60%; width: 1px; background: var(--rule); }
        .strip-item:last-child::after { display: none; }
        .strip-num { font-size: 11px; font-weight: 500; letter-spacing: .2em; color: var(--fg-ghost); margin-bottom: 16px; }
        .strip-item h3 { font-size: 20px; font-weight: 500; margin-bottom: 8px; letter-spacing: -.01em; }
        .strip-item p { font-size: 14px; color: var(--fg-dim); font-weight: 300; line-height: 1.6; }

        .roles-section { padding: 120px 48px; }
        .narrow-container { max-width: 900px; margin: 0 auto; }
        .cta-header { text-align: center; margin-bottom: 80px; }
        .cta-header h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 500; letter-spacing: -.02em; margin-bottom: 16px; }
        .cta-header p { font-size: 16px; color: var(--fg-dim); font-weight: 300; }
        
        .team-section { margin-bottom: 64px; }
        .team-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--rule); }
        .team-num { font-size: 11px; font-weight: 500; letter-spacing: .2em; color: var(--fg-ghost); }
        .team-name { font-size: 20px; font-weight: 500; letter-spacing: -.01em; }
        .team-desc { font-size: 14px; color: var(--fg-dim); margin-bottom: 24px; max-width: 700px; line-height: 1.7; font-weight: 300; }
        
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

        @media(max-width: 768px) {
          .hero { padding: 120px 24px 60px; }
          .roles-section { padding: 80px 24px; }
          .strip-inner { grid-template-columns: 1fr; gap: 0; }
          .strip-item::after { display: none; }
          .strip-item { border-bottom: 1px solid var(--rule); text-align: left; }
          .strip-item:last-child { border-bottom: none; }
          .role-card { padding: 20px 24px; flex-direction: column; align-items: flex-start; gap: 12px; }
          .role-meta { flex-direction: column; gap: 4px; }
        }
      `}</style>
    </>
  );
}
