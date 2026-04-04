'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import jobsData from '../data/jobs.json';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const teamsRef = useRef<HTMLDivElement>(null);
  const dealRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.hero-tag', { y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.from('.hero-h1', { y: 50, opacity: 0, duration: 1, delay: 0.4, ease: 'power3.out' });
      gsap.from('.hero-sub', { y: 40, opacity: 0, duration: 0.9, delay: 0.6, ease: 'power3.out' });
      gsap.from('.hero-actions', { y: 30, opacity: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' });
      gsap.from('.hero-glow', { scale: 0.6, opacity: 0, duration: 2, delay: 0.3, ease: 'power2.out' });

      // Strip cards - staggered scroll trigger
      gsap.from('.strip-item', {
        scrollTrigger: { trigger: stripRef.current, start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out'
      });

      // Teams section
      gsap.from('.teams-header', {
        scrollTrigger: { trigger: teamsRef.current, start: 'top 75%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
      gsap.from('.team-block', {
        scrollTrigger: { trigger: teamsRef.current, start: 'top 65%' },
        y: 50, opacity: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out'
      });
      gsap.from('.role-card', {
        scrollTrigger: { trigger: teamsRef.current, start: 'top 55%' },
        x: -30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out'
      });

      // Deal section
      gsap.from('.deal-content', {
        scrollTrigger: { trigger: dealRef.current, start: 'top 75%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
      });

      // CTA section
      gsap.from('.cta-content', {
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
      });
    });

    return () => ctx.revert();
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
      {/* ─── HERO ─── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-tag"><span className="pulse-dot"></span>Project 01 · Industrial Automation</div>
          <h1 className="hero-h1">
            AI Software for the<br/>
            Industries That Build<br/>
            <em>Everything Else.</em>
          </h1>
          <p className="hero-sub">
            Refineries, chemical plants, distribution centers, factories — the physical systems the world depends on run on software that&apos;s decades old. We&apos;re changing that.
          </p>
          <div className="hero-actions">
            <a href="#roles" className="btn btn-primary">See open roles <span className="arrow">↓</span></a>
            <a href="mailto:hello@inquislab.com" className="btn btn-outline">Get in touch</a>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM STRIP ─── */}
      <section className="strip" ref={stripRef}>
        <div className="strip-inner">
          <div className="strip-item">
            <div className="strip-num">01</div>
            <h3>Alarm Overload</h3>
            <p>Operators drown in thousands of alarms. Critical signals get lost in the noise. We fix this.</p>
          </div>
          <div className="strip-item">
            <div className="strip-num">02</div>
            <h3>Rationalization</h3>
            <p>Months of spreadsheet-based alarm review eliminated through AI-driven analysis.</p>
          </div>
          <div className="strip-item">
            <div className="strip-num">03</div>
            <h3>Intelligence</h3>
            <p>Pattern recognition and predictive insights for heavy industrial operations.</p>
          </div>
        </div>
      </section>

      {/* ─── TEAMS + ROLES ─── */}
      <section id="roles" className="teams-section" ref={teamsRef}>
        <div className="section-container">
          <div className="teams-header">
            <div className="teams-pre">How we&apos;re hiring</div>
            <h2>Two teams. <em>Four people.</em> Working in pairs.</h2>
            <p className="teams-intro">
              We&apos;re building one product, <em>Reliability Twin</em>, and taking it to market. That needs two teams: a product team that builds it, and a marketing team that sells it. Each team is two people working together.
            </p>
          </div>

          {teamKeys.map((team, index) => (
            <div key={team} className="team-block">
              <div className="team-header">
                <span className="team-num">TEAM 0{index + 1}</span>
                <h3 className="team-name">{team.split('·')[1]?.trim() || team}</h3>
              </div>
              <p className="team-desc">
                {index === 0
                  ? "Two engineers building our first product together. One leans toward research and architecture — mapping the problem space, running POCs. The other leans toward execution — writing the production code, shipping features. Both do both."
                  : "Two people finding the first hundred customers through AI-driven content and viral video. One goes to the ground — collecting real stories. The other turns those hooks into short videos that get watched."}
              </p>
              <div className="role-cards">
                {teams[team].map(job => (
                  <Link key={job.id} href={`/careers/${job.id}`} className="role-card">
                    <div className="role-info">
                      <div className="role-title">{job.title}</div>
                      <div className="role-meta">
                        <span>{job.location}</span>
                        <span className="meta-dot"></span>
                        <span>{job.type}</span>
                        <span className="meta-dot"></span>
                        <span>{job.tags[0]}</span>
                      </div>
                    </div>
                    <div className="role-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── THE DEAL ─── */}
      <section className="deal" ref={dealRef}>
        <div className="section-container">
          <div className="deal-content">
            <div className="deal-label">The money</div>
            <div className="deal-body">
              <p>Starting stipend. <strong>We&apos;ll talk real numbers in the conversation</strong> — we want to know what works for you and match it to where we are. As the company generates revenue, your compensation grows with it.</p>
              <p>Six-month starting term, then full-time conversion with equity and a real raise. <em>The people here at the start will run the teams later.</em></p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── APPLY CTA ─── */}
      <section className="cta" ref={ctaRef}>
        <div className="cta-content">
          <div className="cta-pre">How to apply</div>
          <h2>Send us <em>something real.</em></h2>
          <a href="mailto:careers@inquislab.com" className="cta-email">careers@inquislab.com</a>
          <div className="cta-note">
            Click any role above · Or email us directly<br/>
            Tell us what you&apos;ve built, what we should build, why this role<br/>
            No cover letters · We reply within 48 hours
          </div>
        </div>
      </section>

      <style jsx>{`
        /* ─── Hero ─── */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 120px 48px 80px;
          overflow: hidden;
        }
        .hero-glow {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(217,108,58,.05) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .hero-content {
          text-align: center;
          max-width: 900px;
          position: relative;
          z-index: 1;
        }
        .hero-tag {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse 2.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(217,108,58,.4); }
          50% { opacity: .6; box-shadow: 0 0 0 8px rgba(217,108,58,0); }
        }
        .hero-h1 {
          font-size: clamp(36px, 5.5vw, 68px);
          font-weight: 600;
          line-height: 1.08;
          letter-spacing: -.03em;
          margin-bottom: 32px;
        }
        .hero-h1 em {
          font-style: normal;
          color: var(--accent);
        }
        .hero-sub {
          font-size: 18px;
          font-weight: 300;
          color: var(--fg-dim);
          max-width: 640px;
          margin: 0 auto 48px;
          line-height: 1.7;
        }
        .hero-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .arrow { transition: transform .3s; }
        .hero-actions a:hover .arrow { transform: translateY(2px); }

        /* ─── Strip ─── */
        .strip {
          padding: 0;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }
        .strip-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        .strip-item {
          padding: 56px 40px;
          position: relative;
          border-right: 1px solid var(--rule);
        }
        .strip-item:last-child { border-right: none; }
        .strip-num {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .2em;
          color: var(--accent-dim);
          margin-bottom: 20px;
        }
        .strip-item h3 {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 10px;
          letter-spacing: -.01em;
        }
        .strip-item p {
          font-size: 14px;
          color: var(--fg-dim);
          font-weight: 300;
          line-height: 1.7;
        }

        /* ─── Teams ─── */
        .teams-section {
          padding: 120px 48px;
        }
        .section-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .teams-header {
          margin-bottom: 80px;
        }
        .teams-pre {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .teams-pre::before {
          content: '';
          width: 40px;
          height: 1px;
          background: var(--accent);
        }
        .teams-header h2 {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 300;
          letter-spacing: -.02em;
          line-height: 1.1;
          margin-bottom: 24px;
        }
        .teams-header h2 em {
          font-style: italic;
          color: var(--accent);
          font-weight: 400;
        }
        .teams-intro {
          font-size: 17px;
          color: var(--fg-dim);
          line-height: 1.7;
          max-width: 780px;
          font-weight: 300;
        }
        .teams-intro em {
          font-style: italic;
          color: var(--fg);
        }

        .team-block {
          padding: 64px 0;
          border-top: 1px solid var(--rule);
        }
        .team-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .team-num {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .2em;
          color: var(--fg-ghost);
        }
        .team-name {
          font-size: 24px;
          font-weight: 500;
          letter-spacing: -.01em;
        }
        .team-desc {
          font-size: 15px;
          color: var(--fg-dim);
          margin-bottom: 32px;
          max-width: 780px;
          line-height: 1.7;
          font-weight: 300;
        }

        .role-cards {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .role-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 32px;
          border: 1px solid var(--rule);
          border-radius: 8px;
          color: var(--fg);
          transition: all .35s ease;
          position: relative;
          overflow: hidden;
        }
        .role-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--accent-soft);
          opacity: 0;
          transition: opacity .35s;
        }
        .role-card:hover {
          border-color: var(--rule-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,.3);
        }
        .role-card:hover::before { opacity: 1; }
        .role-info { position: relative; z-index: 1; }
        .role-title {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 6px;
          letter-spacing: -.01em;
        }
        .role-meta {
          font-size: 13px;
          color: var(--fg-dim);
          font-weight: 300;
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .meta-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--fg-ghost);
        }
        .role-arrow {
          font-size: 18px;
          color: var(--fg-ghost);
          transition: all .35s;
          position: relative;
          z-index: 1;
        }
        .role-card:hover .role-arrow {
          color: var(--accent);
          transform: translateX(4px);
        }

        /* ─── Deal ─── */
        .deal {
          padding: 80px 48px;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }
        .deal-content {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 72px;
          align-items: start;
        }
        .deal-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 6px;
        }
        .deal-label::before {
          content: '';
          width: 40px;
          height: 1px;
          background: var(--accent);
        }
        .deal-body p {
          font-size: 18px;
          line-height: 1.65;
          color: var(--fg-dim);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .deal-body p:last-child { margin-bottom: 0; }
        .deal-body em { font-style: italic; color: var(--fg); }
        .deal-body strong { font-weight: 400; color: var(--accent); font-style: italic; }

        /* ─── CTA ─── */
        .cta {
          padding: 120px 48px;
          text-align: center;
        }
        .cta-content { max-width: 700px; margin: 0 auto; }
        .cta-pre {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--fg-ghost);
          margin-bottom: 28px;
        }
        .cta h2 {
          font-size: clamp(32px, 4.5vw, 56px);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -.025em;
          margin-bottom: 40px;
        }
        .cta h2 em { font-style: italic; color: var(--accent); }
        .cta-email {
          font-size: 24px;
          font-weight: 400;
          font-style: italic;
          color: var(--fg);
          border-bottom: 1px solid var(--accent);
          padding-bottom: 4px;
          transition: color .3s;
        }
        .cta-email:hover { color: var(--accent); }
        .cta-note {
          font-size: 12px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--fg-ghost);
          margin-top: 36px;
          line-height: 2;
        }

        @media(max-width: 768px) {
          .hero { padding: 100px 24px 60px; }
          .strip-inner { grid-template-columns: 1fr; }
          .strip-item { border-right: none; border-bottom: 1px solid var(--rule); }
          .strip-item:last-child { border-bottom: none; }
          .teams-section { padding: 80px 24px; }
          .deal { padding: 60px 24px; }
          .deal-content { grid-template-columns: 1fr; gap: 24px; }
          .cta { padding: 80px 24px; }
          .role-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 20px 24px;
          }
          .role-meta { flex-direction: column; gap: 4px; }
          .meta-dot { display: none; }
        }
      `}</style>
    </>
  );
}
