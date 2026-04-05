'use server';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { Job, validatePassword, buildJobFromForm } from '@/lib/job-utils';
import { Project, buildProjectFromForm } from '@/lib/project-utils';

const REPO_OWNER = 'AbhilashKusa';
const REPO_NAME = 'Inquislab';
const JOBS_PATH = 'src/data/jobs.json';
const PROJECTS_PATH = 'src/data/projects.json';

function getFilePath(relativePath: string) {
  return path.join(process.cwd(), relativePath);
}

function readData<T>(relativePath: string): T[] {
  try {
    const filePath = getFilePath(relativePath);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Missing or invalid data file: ${relativePath}`, err);
    return [];
  }
}

async function saveData<T>(relativePath: string, data: T[], commitMessage: string) {
  const fileContent = JSON.stringify(data, null, 2);

  if (process.env.NODE_ENV === 'development') {
    fs.writeFileSync(getFilePath(relativePath), fileContent);
  } else {
    const token = process.env.GITHUB_PAT;
    if (!token) throw new Error('Missing GITHUB_PAT environment variable.');

    const octokit = new Octokit({ auth: token });

    let sha: string | undefined;
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: relativePath,
      });
      if (!Array.isArray(fileData) && fileData.type === 'file') {
        sha = fileData.sha;
      }
    } catch {
      // File doesn't exist yet
    }

    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: relativePath,
      message: commitMessage,
      content: Buffer.from(fileContent).toString('base64'),
      ...(sha ? { sha } : {})
    });
  }
  
  // High-level revalidation
  revalidatePath('/');
  revalidatePath('/careers');
}

// ─── JOBS ───
export async function getJobs() {
  return readData<Job>(JOBS_PATH);
}

export async function publishJob(formData: FormData) {
  validatePassword(formData.get('password')?.toString() || null);
  const jobs = await getJobs();
  const newJob = buildJobFromForm(formData);

  if (jobs.some(j => j.id === newJob.id)) {
    throw new Error(`Job with ID "${newJob.id}" already exists.`);
  }

  jobs.push(newJob);
  await saveData(JOBS_PATH, jobs, `Controller: Published job "${newJob.title}"`);
  revalidatePath(`/careers/${newJob.id}`);
  return { success: true };
}

export async function updateJob(formData: FormData) {
  validatePassword(formData.get('password')?.toString() || null);
  const jobs = await getJobs();
  const jobId = formData.get('id')?.toString();
  const index = jobs.findIndex(j => j.id === jobId);

  if (index === -1) throw new Error(`Job "${jobId}" not found.`);

  const updatedJob = buildJobFromForm(formData);
  updatedJob.id = jobId!;
  jobs[index] = updatedJob;
  await saveData(JOBS_PATH, jobs, `Controller: Updated job "${updatedJob.title}"`);
  revalidatePath(`/careers/${updatedJob.id}`);
  return { success: true };
}

export async function deleteJob(formData: FormData) {
  validatePassword(formData.get('password')?.toString() || null);
  const jobs = await getJobs();
  const jobId = formData.get('id')?.toString();
  const index = jobs.findIndex(j => j.id === jobId);

  if (index === -1) throw new Error(`Job "${jobId}" not found.`);

  const job = jobs[index];
  jobs.splice(index, 1);
  await saveData(JOBS_PATH, jobs, `Controller: Deleted job "${job.title}"`);
  return { success: true };
}

// ─── PROJECTS ───
export async function getProjects() {
  return readData<Project>(PROJECTS_PATH);
}

export async function publishProject(formData: FormData) {
  validatePassword(formData.get('password')?.toString() || null);
  const projects = await getProjects();
  const newProj = buildProjectFromForm(formData);

  if (projects.some(p => p.id === newProj.id)) {
    throw new Error(`Project with ID "${newProj.id}" already exists.`);
  }

  projects.push(newProj);
  await saveData(PROJECTS_PATH, projects, `Controller: Published project "${newProj.title}"`);
  revalidatePath(`/careers/${newProj.id}`);
  return { success: true };
}

export async function updateProject(formData: FormData) {
  validatePassword(formData.get('password')?.toString() || null);
  const projects = await getProjects();
  const projId = formData.get('id')?.toString();
  const index = projects.findIndex(p => p.id === projId);

  if (index === -1) throw new Error(`Project "${projId}" not found.`);

  const updatedProj = buildProjectFromForm(formData);
  updatedProj.id = projId!;
  projects[index] = updatedProj;
  await saveData(PROJECTS_PATH, projects, `Controller: Updated project "${updatedProj.title}"`);
  revalidatePath(`/careers/${updatedProj.id}`);
  return { success: true };
}

export async function deleteProject(formData: FormData) {
  validatePassword(formData.get('password')?.toString() || null);
  const projects = await getProjects();
  const projId = formData.get('id')?.toString();
  const index = projects.findIndex(p => p.id === projId);

  if (index === -1) throw new Error(`Project "${projId}" not found.`);

  const proj = projects[index];
  projects.splice(index, 1);
  await saveData(PROJECTS_PATH, projects, `Controller: Deleted project "${proj.title}"`);
  return { success: true };
}

// ─── AUTH ───
export async function authenticate(password: string) {
  const current = process.env.ADMIN_PASSWORD || '';
  if (!current) throw new Error('ADMIN_PASSWORD environment variable is not set.');
  if (password !== current) throw new Error('Invalid controller password.');
  return { success: true };
}
