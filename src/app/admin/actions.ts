'use server';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { Job, buildJobFromForm, validatePassword, isValidPassword } from '@/lib/job-utils';
import { Project, buildProjectFromForm } from '@/lib/project-utils';

const REPO_OWNER = 'AbhilashKusa';
const REPO_NAME = 'Inquislab';
const JOBS_PATH = 'src/data/jobs.json';
const PROJECTS_PATH = 'src/data/projects.json';

type Item = Job | Project;
type ItemType = 'job' | 'project';

function getFilePath(relativePath: string) {
  return path.join(process.cwd(), relativePath);
}

function readData<T>(relativePath: string): T[] {
  try {
    const filePath = getFilePath(relativePath);
    if (!fs.existsSync(filePath)) return [];
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
  
  revalidatePath('/');
  revalidatePath('/careers');
}

// ─── GENERIC HANDLERS ───

async function publish(type: ItemType, formData: FormData) {
    const pwd = formData.get('password')?.toString() || null;
    if (!isValidPassword(pwd)) return { success: false, error: 'Invalid controller password.' };

    const path = type === 'job' ? JOBS_PATH : PROJECTS_PATH;
    const data = readData<Item>(path);
    const newItem = type === 'job' ? buildJobFromForm(formData) : buildProjectFromForm(formData);

    if (data.some(item => item.id === newItem.id)) {
        return { success: false, error: `${type} with ID "${newItem.id}" already exists.` };
    }

    data.push(newItem);
    try {
        await saveData(path, data, `Controller: Published ${type} "${newItem.title}"`);
        if (type === 'job') revalidatePath(`/careers/${newItem.id}`);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || 'Failed to save data to GitHub.' };
    }
}

async function update(type: ItemType, formData: FormData) {
    const pwd = formData.get('password')?.toString() || null;
    if (!isValidPassword(pwd)) return { success: false, error: 'Invalid controller password.' };

    const path = type === 'job' ? JOBS_PATH : PROJECTS_PATH;
    const data = readData<Item>(path);
    const itemId = formData.get('id')?.toString();
    const index = data.findIndex(item => item.id === itemId);

    if (index === -1) return { success: false, error: `${type} "${itemId}" not found.` };

    const updatedItem = type === 'job' ? buildJobFromForm(formData) : buildProjectFromForm(formData);
    updatedItem.id = itemId!;
    data[index] = updatedItem;
    
    try {
        await saveData(path, data, `Controller: Updated ${type} "${updatedItem.title}"`);
        if (type === 'job') revalidatePath(`/careers/${updatedItem.id}`);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || 'Failed to save update to GitHub.' };
    }
}

async function del(type: ItemType, formData: FormData) {
    const pwd = formData.get('password')?.toString() || null;
    if (!isValidPassword(pwd)) return { success: false, error: 'Invalid controller password.' };

    const path = type === 'job' ? JOBS_PATH : PROJECTS_PATH;
    const data = readData<Item>(path);
    const itemId = formData.get('id')?.toString();
    const index = data.findIndex(item => item.id === itemId);

    if (index === -1) return { success: false, error: `${type} "${itemId}" not found.` };

    const item = data[index];
    data.splice(index, 1);
    
    try {
        await saveData(path, data, `Controller: Deleted ${type} "${item.title}"`);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || 'Failed to delete from GitHub.' };
    }
}

// ─── JOBS ───
export async function getJobs() {
  return readData<Job>(JOBS_PATH);
}

export async function publishJob(formData: FormData) {
  return publish('job', formData);
}

export async function updateJob(formData: FormData) {
  return update('job', formData);
}

export async function deleteJob(formData: FormData) {
  return del('job', formData);
}

// ─── PROJECTS ───
export async function getProjects() {
  return readData<Project>(PROJECTS_PATH);
}

export async function publishProject(formData: FormData) {
  return publish('project', formData);
}

export async function updateProject(formData: FormData) {
  return update('project', formData);
}

export async function deleteProject(formData: FormData) {
  return del('project', formData);
}

// ─── AUTH ───
export async function authenticate(password: string) {
  if (isValidPassword(password)) {
    return { success: true };
  }
  return { success: false, error: 'Invalid controller password.' };
}
