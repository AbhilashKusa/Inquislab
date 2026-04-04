'use server';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import jobsData from '../../../data/jobs.json';
import { revalidatePath } from 'next/cache';

export async function publishJob(formData: FormData) {
  // Simple "password" for the form
  if (formData.get('password') !== 'inquislab2026') {
    throw new Error('Invalid controller password.');
  }

  const newJob = {
    id: formData.get('title')?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'new-role',
    team: formData.get('team')?.toString() || 'Team 01',
    title: formData.get('title')?.toString() || 'New Role',
    location: formData.get('location')?.toString() || 'Remote · India',
    type: formData.get('type')?.toString() || 'Full-time',
    tags: [formData.get('tag')?.toString() || 'Work with founder'],
    summary: formData.get('summary')?.toString() || '',
    sections: [
      {
        title: "Requirements",
        bullets: formData.get('requirements')?.toString().split('\n').filter(Boolean) || []
      }
    ],
    applyEmail: 'careers@inquislab.com',
    applySubject: `${formData.get('title')} — Application`,
    applyBody: 'Attach your details. No cover letters.'
  };

  const updatedJobs = [...jobsData, newJob];
  const fileContent = JSON.stringify(updatedJobs, null, 2);

  if (process.env.NODE_ENV === 'development') {
    // Write locally in development
    const filePath = path.join(process.cwd(), 'src/data/jobs.json');
    fs.writeFileSync(filePath, fileContent);
  } else {
    // Write via GitHub API in Production
    const token = process.env.GITHUB_PAT;
    if (!token) throw new Error('Missing GITHUB_PAT environment variable.');
    
    const octokit = new Octokit({ auth: token });
    const repoOwner = 'AbhilashKusa';
    const repoName = 'Inquislab';
    const jsonPath = 'src/data/jobs.json';

    // 1. Get file SHA
    const { data: fileData } = await octokit.repos.getContent({
      owner: repoOwner,
      repo: repoName,
      path: jsonPath,
    });

    if (!('sha' in fileData)) throw new Error('Could not get file SHA');

    // 2. Commit new file
    await octokit.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path: jsonPath,
      message: `Admin Controller: Published new role ${newJob.title}`,
      content: Buffer.from(fileContent).toString('base64'),
      sha: fileData.sha,
    });
  }

  revalidatePath('/careers');
  revalidatePath('/projects/industrial-automation');

  return { success: true };
}
