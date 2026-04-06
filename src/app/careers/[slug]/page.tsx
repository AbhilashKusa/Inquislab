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

import ErrorBoundary from '@/components/ErrorBoundary';

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const project = projectsData.find((p) => p.id === slug);
  if (project) {
    return (
      <ErrorBoundary fallback={<h2>Something went wrong loading the project. Please refresh.</h2>}>
        <ProjectDetailClient project={project} jobs={jobsData} />
      </ErrorBoundary>
    );
  }

  const job = jobsData.find((j) => j.id === slug);
  if (job) {
    return (
      <ErrorBoundary fallback={<h2>Something went wrong loading the job. Please refresh.</h2>}>
        <JobDetailClient job={job} />
      </ErrorBoundary>
    );
  }

  return notFound();
}
