import { notFound } from 'next/navigation';
import jobsData from '../../../data/jobs.json';
import projectsData from '../../../data/projects.json';
import { JobDetailClient } from './JobDetailClient';
import { ProjectDetailClient } from './ProjectDetailClient';

// Generate static paths for all jobs and projects
export function generateStaticParams() {
  const jobParams = jobsData.map((job) => ({ slug: job.id }));
  const projectParams = projectsData.map((project) => ({ slug: project.id }));
  return [...jobParams, ...projectParams];
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const project = projectsData.find((p) => p.id === slug);
  if (project) {
    return <ProjectDetailClient project={project} jobs={jobsData} />;
  }

  const job = jobsData.find((j) => j.id === slug);
  if (job) {
    return <JobDetailClient job={job} />;
  }

  return notFound();
}
