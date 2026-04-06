'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '@/lib/project-utils';
import { Job } from '@/lib/job-utils';
import styles from './project-detail.module.css';

gsap.registerPlugin(ScrollTrigger);

export function ProjectDetailClient({ project, jobs }: { project: Project, jobs: Job[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const teamsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(`.${styles.heroTag}`, { y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.from(`.${styles.heroH1}`, { y: 50, opacity: 0, duration: 1, delay: 0.4, ease: 'power3.out' });
      gsap.from(`.${styles.heroSub}`, { y: 40, opacity: 0, duration: 0.9, delay: 0.6, ease: 'power3.out' });
      gsap.from(`.${styles.heroActions}`, { y: 30, opacity: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' });
      gsap.from(`.${styles.heroGlow}`, { scale: 0.6, opacity: 0, duration: 2, delay: 0.3, ease: 'power2.out' });

      // Strip cards - staggered scroll trigger
      if (stripRef.current) {
        gsap.from(`.${styles.stripItem}`, {
          scrollTrigger: { trigger: stripRef.current, start: 'top 80%' },
          y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out'
        });
      }

      // Roles section - using fromTo with toggleActions for safety when section is already in view
      if (teamsRef.current) {
        gsap.fromTo(`.${styles.rolesHeader}`,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: { trigger: teamsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out'
          }
        );
        gsap.fromTo(`.${styles.teamGroup}`,
          { y: 50, opacity: 0 },
          {
            scrollTrigger: { trigger: teamsRef.current, start: 'top 75%', toggleActions: 'play none none none' },
            y: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: 'power3.out'
          }
        );
        gsap.fromTo(`.${styles.roleCard}`,
          { x: -30, opacity: 0 },
          {
            scrollTrigger: { trigger: teamsRef.current, start: 'top 65%', toggleActions: 'play none none none' },
            x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out'
          }
        );
      }

      // CTA section
      if (ctaRef.current) {
        gsap.from(`.${styles.ctaContent}`, {
          scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
          y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
        });
      }
    });

    // Safety: ensure roles are visible if ScrollTrigger already passed
    setTimeout(() => {
      document.querySelectorAll(`.${styles.rolesHeader}, .${styles.teamGroup}, .${styles.roleCard}`).forEach(el => {
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
      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}><span className={styles.pulseDot}></span>{project.heroTag}</div>
          <h1 className={styles.heroH1} dangerouslySetInnerHTML={{ __html: project.heroH1 }}></h1>
          <p className={styles.heroSub}>{project.heroSub}</p>
          <div className={styles.heroActions}>
            <a href="#roles" className="btn btn-primary">See open roles <span className={styles.arrow}>↓</span></a>
            <a href={`mailto:${project.ctaEmail}`} className="btn btn-outline">Get in touch</a>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM STRIP ─── */}
      {project.stripItems && project.stripItems.length > 0 && (
        <section className={styles.strip} ref={stripRef}>
          <div className={styles.stripInner}>
            {project.stripItems.map((item, idx) => (
              <div key={idx} className={styles.stripItem}>
                <div className={styles.stripNum}>{item.num}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── OPEN ROLES ─── */}
      <section id="roles" className={styles.rolesSection} ref={teamsRef}>
        <div className={styles.sectionContainer}>
          <div className={styles.rolesHeader}>
            <h2>{project.rolesTitle}</h2>
            <p>{project.rolesSub}</p>
          </div>

          {teamKeys.map((team) => (
            <div key={team} className={styles.teamGroup}>
              <h3 className={styles.teamGroupName}>{team.split('·')[1]?.trim() || team}</h3>
              <div className={styles.roleCards}>
                {teams[team].map(job => (
                  <Link key={job.id} href={`/careers/${job.id}`} className={styles.roleCard}>
                    <div className={styles.roleInfo}>
                      <div className={styles.roleTitle}>{job.title}</div>
                      <div className={styles.roleMeta}>
                        <span>{job.location}</span>
                        <span className={styles.metaDot}></span>
                        <span>{job.type}</span>
                        <span className={styles.metaDot}></span>
                        <span>{job.tags[0]}</span>
                      </div>
                    </div>
                    <div className={styles.roleArrow}>→</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── APPLY CTA ─── */}
      <section className={styles.cta} ref={ctaRef}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaPre}>{project.ctaPre}</div>
          <h2 className={styles.ctaH2} dangerouslySetInnerHTML={{ __html: project.ctaTitle }}></h2>
          <a href={`mailto:${project.ctaEmail}`} className={styles.ctaEmail}>{project.ctaEmail}</a>
          <div className={styles.ctaNote} dangerouslySetInnerHTML={{ __html: project.ctaNote }}></div>
        </div>
      </section>
    </>
  );
}
