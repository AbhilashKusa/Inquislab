'use client';
import Link from 'next/link';
import projectsData from '../../data/projects.json';

export default function CareersPage() {
  return (
    <>
      <div className="projects-container">
        <nav className="breadcrumb-nav">
          <Link href="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Careers</span>
        </nav>
        <header className="projects-header">
          <div className="projects-tag">CAREERS</div>
          <h1>Projects</h1>
          <p>Explore our current projects and open positions.</p>
        </header>

        <div className="projects-grid">
          {projectsData.map((project) => (
            <Link key={project.id} href={`/careers/${project.id}`} className="project-card">
              <div className="project-wrapper">
                <div className="project-meta">
                  <span className="project-number">{project.projectNumber}</span>
                  <span className="project-status"><span className="status-dot"></span>{project.status}</span>
                </div>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
                <div className="project-arrow">→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
