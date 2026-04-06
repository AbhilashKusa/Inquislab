import { Job } from '@/lib/job-utils';
import styles from '@/app/admin/admin.module.css';

interface JobFormProps {
  mode: 'create_job' | 'edit_job';
  handleJobSubmit: (e: React.FormEvent<HTMLFormElement>, mode: 'create_job' | 'edit_job') => void;
  setView: (view: any) => void;
  setEditJob: (job: Job | null) => void;
  setStatus: (status: string) => void;
  editJob: Job | null;
  loading: boolean;
  status: string;
}

export default function JobForm({
  mode,
  handleJobSubmit,
  setView,
  setEditJob,
  setStatus,
  editJob,
  loading,
  status,
}: JobFormProps) {
  const j = mode === 'edit_job' ? editJob : null;

  return (
    <form onSubmit={(e) => handleJobSubmit(e, mode)} className={styles.adminForm}>
      <div className={styles.formHeader}>
        <button type="button" onClick={() => { setView('dashboard'); setEditJob(null); setStatus(''); }} className={styles.backBtn}>← Back</button>
        <h2>{mode === 'create_job' ? 'Create new role' : `Edit: ${j?.title}`}</h2>
      </div>
      {mode === 'edit_job' && <input type="hidden" name="id" value={j?.id} />}

      <div className={styles.configCard}>
        <div className={styles.configHeader}>1. Core Metadata</div>
        <div className={styles.formGroup}><label className={styles.label}>Job Title</label><input type="text" name="title" className={styles.input} required defaultValue={j?.title || ''} /></div>
        <div className={styles.formGroup}><label className={styles.label}>Summary</label><textarea name="summary" className={styles.textarea} rows={3} required defaultValue={j?.summary || ''} placeholder="Brief role overview..." /></div>
      </div>

      <div className={styles.configCard}>
        <div className={styles.configHeader}>2. Taxonomy & Routing</div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}><label className={styles.label}>Team</label><select name="team" className={styles.select} defaultValue={j?.team || 'Team 01 · Product Engineering'}><option>Team 01 · Product Engineering</option><option>Team 02 · Marketing &amp; Growth</option></select></div>
          <div className={styles.formGroup}><label className={styles.label}>Location</label><input type="text" name="location" className={styles.input} defaultValue={j?.location || 'Remote · India'} /></div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}><label className={styles.label}>Type</label><input type="text" name="type" className={styles.input} defaultValue={j?.type || 'Full-time'} /></div>
          <div className={styles.formGroup}><label className={styles.label}>Tag</label><input type="text" name="tag" className={styles.input} defaultValue={j?.tags?.[0] || 'Work with founder'} /></div>
        </div>
      </div>

      <div className={styles.configCard}>
        <div className={styles.configHeader}>3. Content Sections</div>
        <div className={styles.configSubtext}>Leave sections blank to omit them from the job post.</div>
        {[1, 2, 3, 4].map(i => {
          const section = j?.sections?.[i - 1];
          const defaultTitle = i === 1 ? 'Expect to focus on' : i === 2 ? 'You may be a good fit if you' : i === 3 ? 'InquisLab is for you if' : '';
          return (
            <div className={styles.sectionBlock} key={i}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Section {i} Title</label>
                <input type="text" name={`secTitle${i}`} className={styles.input} defaultValue={section?.title || (mode === 'create_job' ? defaultTitle : '')} placeholder="e.g. Responsibilities" />
              </div>
              <div className={`${styles.formGroup} ${styles.mb0}`}>
                <label className={styles.label}>Section {i} Bullets <span className={styles.labelHint}>(one bullet per line)</span></label>
                <textarea name={`secBullets${i}`} className={styles.textarea} rows={i === 1 ? 5 : i === 2 ? 4 : 3} defaultValue={section?.bullets?.join('\n') || ''} placeholder="Add specific details..." />
              </div>
            </div>
          );
        })}
      </div>

      <button type="submit" disabled={loading} className={`btn btn-primary ${styles.w100} ${styles.jcCenter} ${styles.mt24} ${styles.p16}`}>
        {loading ? 'Saving...' : mode === 'create_job' ? 'Publish Job' : 'Update Job'}
      </button>
      {status && <div className={`${styles.statusMsg} ${status.startsWith('✓') ? styles.success : styles.error}`}>{status}</div>}
    </form>
  );
}
