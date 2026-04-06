import { Project } from '@/lib/project-utils';
import styles from '@/app/admin/admin.module.css';

interface ProjectFormProps {
  mode: 'create_project' | 'edit_project';
  handleProjectSubmit: (e: React.FormEvent<HTMLFormElement>, mode: 'create_project' | 'edit_project') => void;
  setView: (view: any) => void;
  setEditProject: (project: Project | null) => void;
  setStatus: (status: string) => void;
  editProject: Project | null;
  loading: boolean;
  status: string;
}

export default function ProjectForm({
  mode,
  handleProjectSubmit,
  setView,
  setEditProject,
  setStatus,
  editProject,
  loading,
  status,
}: ProjectFormProps) {
  const p = mode === 'edit_project' ? editProject : null;

  return (
    <form onSubmit={(e) => handleProjectSubmit(e, mode)} className={styles.adminForm}>
      <div className={styles.formHeader}>
        <button type="button" onClick={() => { setView('dashboard'); setEditProject(null); setStatus(''); }} className={styles.backBtn}>← Back</button>
        <h2>{mode === 'create_project' ? 'Create new project' : `Edit: ${p?.title}`}</h2>
      </div>
      {mode === 'edit_project' && <input type="hidden" name="id" value={p?.id} />}

      <div className={styles.formDivider}>Basic Info (Careers List)</div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}><label className={styles.label}>Project Title</label><input type="text" name="title" className={styles.input} required defaultValue={p?.title || ''} /></div>
        <div className={styles.formGroup}><label className={styles.label}>Project Number</label><input type="text" name="projectNumber" className={styles.input} defaultValue={p?.projectNumber || 'PROJECT 01'} /></div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}><label className={styles.label}>Status Tag</label><input type="text" name="status" className={styles.input} defaultValue={p?.status || 'Hiring'} /></div>
      </div>
      <div className={styles.formGroup}><label className={styles.label}>Project Summary</label><textarea name="summary" className={styles.textarea} rows={3} required defaultValue={p?.summary || ''} /></div>

      <div className={styles.formDivider}>Detail Page: Hero</div>
      <div className={styles.formGroup}><label className={styles.label}>Hero Tag</label><input type="text" name="heroTag" className={styles.input} defaultValue={p?.heroTag || ''} /></div>
      <div className={styles.formGroup}><label className={styles.label}>Hero Title (HTML ok)</label><textarea name="heroH1" className={styles.textarea} rows={3} defaultValue={p?.heroH1 || ''} /></div>
      <div className={styles.formGroup}><label className={styles.label}>Hero Subtitle</label><textarea name="heroSub" className={styles.textarea} rows={3} defaultValue={p?.heroSub || ''} /></div>

      <div className={styles.formDivider}>Detail Page: Problem Strip Items</div>
      {[1, 2, 3].map(i => {
        const item = p?.stripItems?.[i - 1];
        return (
          <div className={styles.formRow} key={i}>
            <div className={`${styles.formGroup} ${styles.flex1}`}><label className={styles.label}>Strip {i} Title</label><input type="text" name={`stripTitle${i}`} className={styles.input} defaultValue={item?.title || ''} /></div>
            <div className={`${styles.formGroup} ${styles.flex2}`}><label className={styles.label}>Strip {i} Description</label><input type="text" name={`stripDesc${i}`} className={styles.input} defaultValue={item?.desc || ''} /></div>
          </div>
        );
      })}

      <div className={styles.formDivider}>Detail Page: Roles Section & CTA</div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Target Teams <span className={styles.labelHint}>(One per line. Leave empty to display jobs from ALL teams)</span></label>
        <textarea name="targetTeams" className={styles.textarea} rows={3} defaultValue={p?.targetTeams?.join('\n') || ''} placeholder="Team 01 · Product Engineering" />
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}><label className={styles.label}>Roles Title</label><input type="text" name="rolesTitle" className={styles.input} defaultValue={p?.rolesTitle || 'Open Roles'} /></div>
        <div className={styles.formGroup}><label className={styles.label}>Roles Subtitle</label><input type="text" name="rolesSub" className={styles.input} defaultValue={p?.rolesSub || ''} /></div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}><label className={styles.label}>CTA Pre-title</label><input type="text" name="ctaPre" className={styles.input} defaultValue={p?.ctaPre || 'How to apply'} /></div>
        <div className={styles.formGroup}><label className={styles.label}>CTA Email</label><input type="text" name="ctaEmail" className={styles.input} defaultValue={p?.ctaEmail || 'careers@inquislab.com'} /></div>
      </div>
      <div className={styles.formGroup}><label className={styles.label}>CTA Title (HTML ok)</label><input type="text" name="ctaTitle" className={styles.input} defaultValue={p?.ctaTitle || ''} /></div>
      <div className={styles.formGroup}><label className={styles.label}>CTA Note (HTML ok)</label><textarea name="ctaNote" className={styles.textarea} rows={3} defaultValue={p?.ctaNote || ''} /></div>

      <button type="submit" disabled={loading} className={`btn btn-primary ${styles.w100} ${styles.jcCenter}`}>
        {loading ? 'Saving...' : mode === 'create_project' ? 'Publish Project' : 'Update Project'}
      </button>
      {status && <div className={`${styles.statusMsg} ${status.startsWith('✓') ? styles.success : styles.error}`}>{status}</div>}
    </form>
  );
}
