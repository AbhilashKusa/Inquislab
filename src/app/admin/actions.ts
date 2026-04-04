'use server';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const REPO_OWNER = 'AbhilashKusa';
const REPO_NAME = 'Inquislab';
const JSON_PATH = 'src/data/jobs.json';
const PASSWORD = 'inquislab2026';

function getJobsFilePath() {
  return path.join(process.cwd(), JSON_PATH);
}

function readJobs(): Job[] {
  const filePath = getJobsFilePath();
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export interface Job {
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

async function saveJobs(jobs: Job[], commitMessage: string) {
  const fileContent = JSON.stringify(jobs, null, 2);

  if (process.env.NODE_ENV === 'development') {
    fs.writeFileSync(getJobsFilePath(), fileContent);
  } else {
    const token = process.env.GITHUB_PAT;
    if (!token) throw new Error('Missing GITHUB_PAT environment variable.');

    const octokit = new Octokit({ auth: token });

    const { data: fileData } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: JSON_PATH,
    });

    if (!('sha' in fileData)) throw new Error('Could not get file SHA');

    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: JSON_PATH,
      message: commitMessage,
      content: Buffer.from(fileContent).toString('base64'),
      sha: fileData.sha,
    });
  }

  revalidatePath('/');
  revalidatePath('/careers');
}

function validatePassword(password: string | null) {
  if (password !== PASSWORD) throw new Error('Invalid controller password.');
}

function buildJobFromForm(formData: FormData) {
  const title = formData.get('title')?.toString() || 'New Role';
  return {
    id: formData.get('id')?.toString() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    team: formData.get('team')?.toString() || 'Team 01 · Product Engineering',
    title,
    location: formData.get('location')?.toString() || 'Remote · India',
    type: formData.get('type')?.toString() || 'Full-time',
    tags: [formData.get('tag')?.toString() || 'Work with founder'],
    summary: formData.get('summary')?.toString() || '',
    sections: [
      {
        title: "What you'll work on",
        bullets: formData.get('work')?.toString().split('\n').filter(Boolean) || []
      },
      {
        title: "What we look for",
        bullets: formData.get('lookfor')?.toString().split('\n').filter(Boolean) || []
      },
      {
        title: "Leadership & growth",
        bullets: formData.get('leadership')?.toString().split('\n').filter(Boolean) || []
      }
    ].filter(s => s.bullets.length > 0),
    applyEmail: 'careers@inquislab.com',
    applySubject: `${title} — Application`,
    applyBody: 'Tell us:\n\n1. Something you\'ve built that you\'re proud of\n2. What you think we should build next\n3. Why this role, for you\n\nNo cover letters.'
  };
}

// ─── CREATE ───
export async function publishJob(formData: FormData) {
  validatePassword(formData.get('password')?.toString() || null);
  const jobs = readJobs();
  const newJob = buildJobFromForm(formData);

  if (jobs.some((j: Job) => j.id === newJob.id)) {
    throw new Error(`Job with ID "${newJob.id}" already exists.`);
  }

  jobs.push(newJob);
  await saveJobs(jobs, `Controller: Published "${newJob.title}"`);
  return { success: true };
}

// ─── UPDATE ───
export async function updateJob(formData: FormData) {
  validatePassword(formData.get('password')?.toString() || null);
  const jobs = readJobs();
  const jobId = formData.get('id')?.toString();
  const index = jobs.findIndex((j: Job) => j.id === jobId);

  if (index === -1) throw new Error(`Job "${jobId}" not found.`);

  const updatedJob = buildJobFromForm(formData);
  updatedJob.id = jobId!; // keep the original ID
  jobs[index] = updatedJob;
  await saveJobs(jobs, `Controller: Updated "${updatedJob.title}"`);
  return { success: true };
}

// ─── DELETE ───
export async function deleteJob(formData: FormData) {
  validatePassword(formData.get('password')?.toString() || null);
  const jobs = readJobs();
  const jobId = formData.get('id')?.toString();
  const index = jobs.findIndex((j: Job) => j.id === jobId);

  if (index === -1) throw new Error(`Job "${jobId}" not found.`);

  const title = jobs[index].title;
  jobs.splice(index, 1);
  await saveJobs(jobs, `Controller: Deleted "${title}"`);
  return { success: true };
}

// ─── READ ───
export async function getJobs() {
  return readJobs();
}
