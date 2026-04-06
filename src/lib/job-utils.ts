// Job utilities - not a server action file

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

export function getPassword(): string {
  return process.env.ADMIN_PASSWORD || '';
}

export function validatePassword(password: string | null) {
  const current = getPassword();
  if (!current) throw new Error('ADMIN_PASSWORD environment variable is not set.');
  if (password !== current) throw new Error('Invalid controller password.');
}

export function isValidPassword(password: string | null): boolean {
  const current = getPassword();
  return !!current && password === current;
}

export function buildJobFromForm(formData: FormData): Omit<Job, 'applyEmail' | 'applySubject' | 'applyBody'> & {
  applyEmail: string;
  applySubject: string;
  applyBody: string;
} {
  const title = formData.get('title')?.toString() || 'New Role';
  return {
    id: formData.get('id')?.toString() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    team: formData.get('team')?.toString() || 'Team 01 · Product Engineering',
    title,
    location: formData.get('location')?.toString() || 'Remote · India',
    type: formData.get('type')?.toString() || 'Full-time',
    tags: [formData.get('tag')?.toString() || 'Work with founder'],
    summary: formData.get('summary')?.toString() || '',
    sections: Array.from({ length: 4 }).map((_, i) => ({
      title: formData.get(`secTitle${i + 1}`)?.toString() || '',
      bullets: formData.get(`secBullets${i + 1}`)?.toString().split('\n').map(b => b.trim()).filter(Boolean) || []
    })).filter(s => s.title && s.bullets.length > 0),
    applyEmail: 'careers@inquislab.com',
    applySubject: `${title} — Application`,
    applyBody: `Please share:

1. Technical links you're proud of (GitHub, personal website, or a deployed project).
2. A concise explanation of the most ambiguous technical problem you've recently solved.
3. Why you are interested in InquisLab.

No cover letters required.`
  };
}
