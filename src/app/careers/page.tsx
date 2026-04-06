'use client';
import Link from 'next/link';
import projectsData from '../../data/projects.json';
import styles from './careers.module.css';

export default function CareersPage() {
  return (
    <>
      <div className={styles.projectsContainer}>
        <nav className="breadcrumb-nav">
          <Link href="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Careers</span>
        </nav>
        <header className={styles.projectsHeader}>
          <div className={styles.projectsTag}>CAREERS</div>
          <h1>Projects</h1>
          <p>Explore our current projects and open positions.</p>
        </header>

        <div className={styles.projectsGrid}>
          {projectsData.map((project) => (
            <Link key={project.id} href={`/careers/${project.id}`} className={styles.projectCard}>
              <div className={styles.projectWrapper}>
                <div className={styles.projectMeta}>
                  <span className={styles.projectNumber}>{project.projectNumber}</span>
                  <span className={styles.projectStatus}><span className={styles.statusDot}></span>{project.status}</span>
                </div>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
                <div className={styles.projectArrow}>→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
