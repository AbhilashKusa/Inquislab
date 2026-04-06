'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from './job-detail.module.css';
import { submitApplication } from '../actions';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll(`.${styles.reveal}`).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    formData.append('jobId', job.id);
    formData.append('jobTitle', job.title);

    const result = await submitApplication(formData);
    setStatus(result);
    setIsSubmitting(false);

    if (result.success) {
      formRef.current?.reset();
      setFileName(null);
    }
  };

  return (
    <article className={styles.jdPage}>
      <div className={`${styles.jdBreadcrumb} ${styles.reveal}`}>
        <Link href="/">Home</Link>
        <span className={styles.jdSep}>/</span>
        <Link href="/careers">Careers</Link>
        <span className={styles.jdSep}>/</span>
        <span className={styles.jdCurrent}>{job.title}</span>
      </div>

      <header className={`${styles.jdHeader} ${styles.reveal}`} style={{ animationDelay: '0.1s' }}>
        <h1 className={styles.jdTitle}>{job.title}</h1>
      </header>

      <div className={styles.jdGrid}>
        {/* Main Content Column */}
        <div className={styles.jdMain}>
          <p className={`${styles.jdSummary} ${styles.reveal}`} style={{ animationDelay: '0.2s' }} dangerouslySetInnerHTML={{ __html: job.summary }}></p>

          {job.sections.map((section, idx) => (
            <section key={idx} className={`${styles.jdSection} ${styles.reveal}`} style={{ animationDelay: `${0.3 + (idx * 0.1)}s` }}>
              <h2 className={styles.jdSectionTitle}>{section.title}</h2>
              <ul className={styles.jdBullets}>
                {section.bullets.map((bullet, bidx) => (
                  <li key={bidx} dangerouslySetInnerHTML={{ __html: bullet }}></li>
                ))}
              </ul>
            </section>
          ))}

          {/* Application Form Section */}
          <section id="apply" className={`${styles.applySection} ${styles.reveal}`}>
            <div className={styles.applyHeader}>
              <h2>Apply for this role</h2>
              <p>Tell us what you've built and why you're curious about this frontier.</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className={styles.applyForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" required className={styles.input} placeholder="Human Name" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" required className={styles.input} placeholder="email@example.com" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="linkedin">LinkedIn / Portfolio</label>
                  <input type="text" id="linkedin" name="linkedin" className={styles.input} placeholder="https://..." />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="github">GitHub / Work Links</label>
                  <input type="text" id="github" name="github" className={styles.input} placeholder="https://github.com/..." />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                <label htmlFor="notes">Briefly, why InquisLab?</label>
                <textarea id="notes" name="notes" rows={4} className={styles.textarea} placeholder="What drives your curiosity?"></textarea>
              </div>

              <div className={styles.fileInputWrapper}>
                <label>Resume / CV</label>
                <div className={styles.fileInput}>
                  <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
                  <div className={styles.fileLabel}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    <span className={fileName ? styles.fileSelected : ''}>
                      {fileName || 'Drop your resume here or click to browse'}
                    </span>
                    <span style={{ fontSize: '12px', opacity: 0.6 }}>PDF, DOCX (Max 5MB)</span>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className={`btn btn-primary ${styles.submitBtn}`}>
                {isSubmitting ? 'Sending Application...' : 'Submit Application →'}
              </button>

              {status && (
                <div className={`${styles.statusMessage} ${status.success ? styles.success : styles.error}`}>
                  {status.message}
                </div>
              )}
            </form>
          </section>

          <Link href="/careers" className={`${styles.jdBackLink} ${styles.reveal}`} style={{ animationDelay: '0.6s' }}>
            ← Back to all roles
          </Link>
        </div>

        {/* Sticky Sidebar Column */}
        <aside className={`${styles.jdSidebar} ${styles.reveal}`} style={{ animationDelay: '0.25s' }}>
          <div className={styles.jdSidebarInner}>
            <div className={styles.jdTeam}>{job.team}</div>
            
            <div className={styles.jdPills}>
              <div className={styles.jdPill}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {job.location}
              </div>
              <div className={styles.jdPill}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                {job.type}
              </div>
              {job.tags && job.tags.length > 0 && job.tags[0] && (
                <div className={`${styles.jdPill} ${styles.jdPillAccent}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                  {job.tags[0]}
                </div>
              )}
            </div>

            <div className={styles.jdActions}>
              <a href="#apply" className={`btn btn-primary ${styles.jdApplyBtn}`}>Apply for this job →</a>
              <a href="mailto:careers@inquislab.com" className={`btn btn-outline ${styles.jdAskBtn}`}>Questions? Email us</a>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
