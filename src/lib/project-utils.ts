export interface StripItem {
  num: string;
  title: string;
  desc: string;
}

export interface Project {
  id: string;
  status: string;
  projectNumber: string;
  title: string;
  summary: string;
  heroTag: string;
  heroH1: string;
  heroSub: string;
  stripItems: StripItem[];
  rolesTitle: string;
  rolesSub: string;
  ctaPre: string;
  ctaTitle: string;
  ctaEmail: string;
  ctaNote: string;
  targetTeams?: string[];
}

export function buildProjectFromForm(formData: FormData): Project {
  const title = formData.get('title')?.toString() || 'New Project';
  
  // Extract strip items dynamically
  const stripItems: StripItem[] = [];
  for (let i = 1; i <= 3; i++) {
    const sTitle = formData.get(`stripTitle${i}`)?.toString();
    const sDesc = formData.get(`stripDesc${i}`)?.toString();
    if (sTitle && sDesc) {
      stripItems.push({
        num: `0${i}`,
        title: sTitle,
        desc: sDesc
      });
    }
  }

  return {
    id: formData.get('id')?.toString() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    status: formData.get('status')?.toString() || 'Active',
    projectNumber: formData.get('projectNumber')?.toString() || 'PROJECT 01',
    title,
    summary: formData.get('summary')?.toString() || '',
    heroTag: formData.get('heroTag')?.toString() || '',
    heroH1: formData.get('heroH1')?.toString() || title,
    heroSub: formData.get('heroSub')?.toString() || '',
    stripItems,
    rolesTitle: formData.get('rolesTitle')?.toString() || 'Open Roles',
    rolesSub: formData.get('rolesSub')?.toString() || '',
    ctaPre: formData.get('ctaPre')?.toString() || 'How to apply',
    ctaTitle: formData.get('ctaTitle')?.toString() || 'Send us something real.',
    ctaEmail: formData.get('ctaEmail')?.toString() || 'careers@inquislab.com',
    ctaNote: formData.get('ctaNote')?.toString() || 'Email us directly.\nNo cover letters required.',
    targetTeams: formData.get('targetTeams')?.toString().split('\n').map(t => t.trim()).filter(Boolean) || []
  };
}
