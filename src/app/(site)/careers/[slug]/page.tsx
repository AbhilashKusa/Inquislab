import Link from 'next/link';
import { notFound } from 'next/navigation';
import jobsData from '../../../../data/jobs.json';
import { JobDetailClient } from './JobDetailClient';

// Generate static paths for all jobs
export function generateStaticParams() {
  return jobsData.map((job) => ({
    slug: job.id,
  }));
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = jobsData.find((j) => j.id === slug);

  if (!job) {
    return notFound();
  }

  return <JobDetailClient job={job} />;
}
