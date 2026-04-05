'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '@/lib/project-utils';
import { Job } from '@/lib/job-utils';

gsap.registerPlugin(ScrollTrigger);

export function ProjectDetailClient({ project, jobs }: { project: Project, jobs: Job[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const teamsRef = useRef<HTMLDivElement>(null);
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
      if (stripRef.current) {
        gsap.from('.strip-item', {
          scrollTrigger: { trigger: stripRef.current, start: 'top 80%' },
          y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out'
        });
      }

      // Roles section - using fromTo with toggleActions for safety when section is already in view
      if (teamsRef.current) {
        gsap.fromTo('.roles-header',
          { y: 40, opacity: 0 },
          {
            scrollTrigger: { trigger: teamsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out'
          }
        );
        gsap.fromTo('.team-group',
          { y: 50, opacity: 0 },
          {
            scrollTrigger: { trigger: teamsRef.current, start: 'top 75%', toggleActions: 'play none none none' },
            y: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: 'power3.out'
          }
        );
        gsap.fromTo('.role-card',
          { x: -30, opacity: 0 },
          {
            scrollTrigger: { trigger: teamsRef.current, start: 'top 65%', toggleActions: 'play none none none' },
            x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out'
          }
        );
      }

      // CTA section
      if (ctaRef.current) {
        gsap.from('.cta-content', {
          scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
          y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
        });
      }
    });

    // Safety: ensure roles are visible if ScrollTrigger already passed
    setTimeout(() => {
      document.querySelectorAll('.roles-header, .team-group, .role-card').forEach(el => {
        const htmlEl = el as HTMLElement;
        if (parseFloat(getComputedStyle(htmlEl).opacity) < 0.1) {
          gsap.to(htmlEl, { opacity: 1, y: 0, x: 0, duration: 0.5 });
        }
      });
    }, 1500);

    return () => ctx.revert();
  }, [project.id]);

  // Filter jobs by targetTeams if specified
  const relevantJobs = project.targetTeams && project.targetTeams.length > 0 
    ? jobs.filter(job => project.targetTeams!.includes(job.team))
    : jobs;

  // Group jobs by team
  const teams = relevantJobs.reduce((acc, job) => {
    if (!acc[job.team]) acc[job.team] = [];
    acc[job.team].push(job);
    return acc;
  }, {} as Record<string, Job[]>);
  const teamKeys = Object.keys(teams);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-tag"><span className="pulse-dot"></span>{project.heroTag}</div>
          <h1 className="hero-h1" dangerouslySetInnerHTML={{ __html: project.heroH1 }}></h1>
          <p className="hero-sub">{project.heroSub}</p>
          <div className="hero-actions">
            <a href="#roles" className="btn btn-primary">See open roles <span className="arrow">↓</span></a>
            <a href={`mailto:${project.ctaEmail}`} className="btn btn-outline">Get in touch</a>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM STRIP ─── */}
      {project.stripItems && project.stripItems.length > 0 && (
        <section className="strip" ref={stripRef}>
          <div className="strip-inner">
            {project.stripItems.map((item, idx) => (
              <div key={idx} className="strip-item">
                <div className="strip-num">{item.num}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── OPEN ROLES ─── */}
      <section id="roles" className="roles-section" ref={teamsRef}>
        <div className="section-container">
          <div className="roles-header">
            <h2>{project.rolesTitle}</h2>
            <p>{project.rolesSub}</p>
          </div>

          {teamKeys.map((team) => (
            <div key={team} className="team-group">
              <h3 className="team-group-name">{team.split('·')[1]?.trim() || team}</h3>
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

      {/* ─── APPLY CTA ─── */}
      <section className="cta" ref={ctaRef}>
        <div className="cta-content">
          <div className="cta-pre">{project.ctaPre}</div>
          <h2 dangerouslySetInnerHTML={{ __html: project.ctaTitle }}></h2>
          <a href={`mailto:${project.ctaEmail}`} className="cta-email">{project.ctaEmail}</a>
          <div className="cta-note" dangerouslySetInnerHTML={{ __html: project.ctaNote }}></div>
        </div>
      </section>
    </>
  );
}
