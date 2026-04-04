'use client';
import { useState, useEffect } from 'react';
import { publishJob, updateJob, deleteJob, getJobs } from './actions';

interface Job {
  id: string;
  team: string;
  title: string;
  location: string;
  type: string;
  tags: string[];
  summary: string;
  sections: { title: string; bullets: string[] }[];
}

type View = 'dashboard' | 'create' | 'edit';

export default function AdminController() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [view, setView] = useState<View>('dashboard');
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch { /* */ }
  };


  // ─── Login gate ───
  if (!authed) {
    return (
      <>
        <div className="admin-login">
          <div className="login-box">
            <div className="login-tag">CONTROLLER</div>
            <h1>Admin Access</h1>
            <form onSubmit={async (e) => { e.preventDefault(); if (password === 'inquislab2026') { setAuthed(true); await loadJobs(); } else { setStatus('Wrong password'); } }}>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter controller password" autoFocus />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Unlock</button>
              {status && <div className="status-error">{status}</div>}
            </form>
          </div>
        </div>
        <style jsx>{`
          .admin-login { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 120px 24px 80px; }
          .login-box { max-width: 400px; width: 100%; }
          .login-tag { font-size: 11px; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
          .login-box h1 { font-size: 32px; font-weight: 600; letter-spacing: -.03em; margin-bottom: 32px; }
          .login-box input { width: 100%; padding: 14px; background: #0a0a0a; border: 1px solid var(--rule); color: var(--fg); border-radius: 6px; font-family: inherit; font-size: 14px; margin-bottom: 16px; }
          .login-box input:focus { outline: none; border-color: var(--accent); }
          .status-error { margin-top: 16px; color: #e55; font-size: 13px; text-align: center; }
        `}</style>
      </>
    );
  }

  // ─── Form handler ───
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, mode: 'create' | 'edit') => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const formData = new FormData(e.currentTarget);
      formData.set('password', password);
      if (mode === 'create') {
        await publishJob(formData);
        setStatus('✓ Job published successfully');
      } else {
        await updateJob(formData);
        setStatus('✓ Job updated successfully');
      }
      await loadJobs();
      setTimeout(() => { setView('dashboard'); setEditJob(null); setStatus(''); }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) setStatus(`✗ ${err.message}`);
      else setStatus('✗ An error occurred');
    }
    setLoading(false);
  };

  const handleDelete = async (jobId: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set('password', password);
      formData.set('id', jobId);
      await deleteJob(formData);
      setDeleteConfirm(null);
      await loadJobs();
      setStatus('✓ Job deleted');
      setTimeout(() => setStatus(''), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) setStatus(`✗ ${err.message}`);
      else setStatus('✗ An error occurred');
    }
    setLoading(false);
  };

  const startEdit = (job: Job) => {
    setEditJob(job);
    setView('edit');
    setStatus('');
  };

  // ─── Render form ───
  const renderForm = (mode: 'create' | 'edit') => {
    const j = mode === 'edit' ? editJob : null;
    const workBullets = j?.sections.find(s => s.title.toLowerCase().includes('work'))?.bullets.join('\n') || '';
    const lookBullets = j?.sections.find(s => s.title.toLowerCase().includes('look'))?.bullets.join('\n') || '';
    const leadBullets = j?.sections.find(s => s.title.toLowerCase().includes('leadership') || s.title.toLowerCase().includes('growth'))?.bullets.join('\n') || '';

    return (
      <form onSubmit={(e) => handleSubmit(e, mode)} className="admin-form">
        <div className="form-header">
          <button type="button" onClick={() => { setView('dashboard'); setEditJob(null); setStatus(''); }} className="back-btn">← Back</button>
          <h2>{mode === 'create' ? 'Create new role' : `Edit: ${j?.title}`}</h2>
        </div>

        {mode === 'edit' && <input type="hidden" name="id" value={j?.id} />}

        <div className="form-group">
          <label>Job Title</label>
          <input type="text" name="title" required defaultValue={j?.title || ''} placeholder="e.g. Engineer · Data" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Team</label>
            <select name="team" defaultValue={j?.team || 'Team 01 · Product Engineering'}>
              <option>Team 01 · Product Engineering</option>
              <option>Team 02 · Marketing &amp; Growth</option>
            </select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" defaultValue={j?.location || 'Remote · India'} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <input type="text" name="type" defaultValue={j?.type || 'Full-time'} />
          </div>
          <div className="form-group">
            <label>Tag</label>
            <input type="text" name="tag" defaultValue={j?.tags?.[0] || 'Work with founder'} />
          </div>
        </div>

        <div className="form-group">
          <label>Summary <span className="label-hint">(HTML ok: &lt;em&gt;italic&lt;/em&gt;)</span></label>
          <textarea name="summary" rows={3} required defaultValue={j?.summary || ''} placeholder="High-level description of the role..." />
        </div>

        <div className="form-divider">Role Sections</div>

        <div className="form-group">
          <label>What you&apos;ll work on <span className="label-hint">(one bullet per line)</span></label>
          <textarea name="work" rows={6} defaultValue={workBullets} placeholder="Build the core web app...&#10;Wire up the LLM pipeline..." />
        </div>

        <div className="form-group">
          <label>What we look for <span className="label-hint">(one bullet per line)</span></label>
          <textarea name="lookfor" rows={5} defaultValue={lookBullets} placeholder="React or Next.js fluency...&#10;A GitHub with finished projects..." />
        </div>

        <div className="form-group">
          <label>Leadership &amp; growth <span className="label-hint">(one bullet per line)</span></label>
          <textarea name="leadership" rows={4} defaultValue={leadBullets} placeholder="You'll own the codebase from day one..." />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Saving...' : mode === 'create' ? 'Publish to Live Site' : 'Update Job'}
        </button>

        {status && <div className={`status-msg ${status.startsWith('✓') ? 'success' : 'error'}`}>{status}</div>}
      </form>
    );
  };

  // ─── Dashboard ───
  return (
    <>
      <div className="admin-page">
        {view === 'dashboard' ? (
          <>
            <div className="admin-header">
              <div>
                <div className="admin-tag">CONTROLLER</div>
                <h1>Jobs CRM</h1>
                <p>{jobs.length} roles published</p>
              </div>
              <button onClick={() => { setView('create'); setStatus(''); }} className="btn btn-primary">+ New Role</button>
            </div>

            {status && <div className={`status-msg ${status.startsWith('✓') ? 'success' : 'error'}`}>{status}</div>}

            <div className="jobs-list">
              {jobs.map(job => (
                <div key={job.id} className="job-row">
                  <div className="job-row-info">
                    <div className="job-row-title">{job.title}</div>
                    <div className="job-row-meta">
                      <span>{job.team}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{job.sections.reduce((a, s) => a + s.bullets.length, 0)} bullets</span>
                    </div>
                  </div>
                  <div className="job-row-actions">
                    <button onClick={() => startEdit(job)} className="action-btn edit">Edit</button>
                    {deleteConfirm === job.id ? (
                      <div className="confirm-delete">
                        <span>Delete?</span>
                        <button onClick={() => handleDelete(job.id)} className="action-btn danger" disabled={loading}>Yes</button>
                        <button onClick={() => setDeleteConfirm(null)} className="action-btn">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(job.id)} className="action-btn delete">Delete</button>
                    )}
                    <a href={`/careers/${job.id}`} target="_blank" className="action-btn view">View ↗</a>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : view === 'create' ? (
          renderForm('create')
        ) : (
          renderForm('edit')
        )}
      </div>

      <style jsx>{`
        .admin-page { max-width: 900px; margin: 0 auto; padding: 120px 24px 80px; }

        .admin-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; flex-wrap: wrap; gap: 16px; }
        .admin-tag { font-size: 11px; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
        .admin-header h1 { font-size: 32px; font-weight: 600; letter-spacing: -.03em; margin-bottom: 4px; }
        .admin-header p { font-size: 14px; color: var(--fg-ghost); }

        .jobs-list { display: flex; flex-direction: column; gap: 2px; }
        .job-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: rgba(255,255,255,.02);
          border: 1px solid var(--rule);
          border-radius: 6px;
          transition: all .2s;
          flex-wrap: wrap;
          gap: 12px;
        }
        .job-row:hover { background: rgba(255,255,255,.04); border-color: var(--rule-hover); }
        .job-row-title { font-size: 16px; font-weight: 500; margin-bottom: 4px; }
        .job-row-meta { font-size: 12px; color: var(--fg-ghost); display: flex; gap: 8px; flex-wrap: wrap; }
        .job-row-actions { display: flex; gap: 8px; align-items: center; }

        .action-btn {
          padding: 6px 14px;
          font-size: 12px;
          font-family: inherit;
          font-weight: 500;
          border-radius: 4px;
          border: 1px solid var(--rule);
          background: transparent;
          color: var(--fg-dim);
          cursor: pointer;
          transition: all .2s;
        }
        .action-btn:hover { border-color: var(--rule-hover); color: var(--fg); }
        .action-btn.edit:hover { border-color: var(--accent); color: var(--accent); }
        .action-btn.delete:hover, .action-btn.danger { border-color: #e55; color: #e55; }
        .action-btn.danger:hover { background: #e55; color: #fff; }
        .action-btn.view { color: var(--fg-ghost); }
        .action-btn.view:hover { color: var(--accent); border-color: var(--accent); }

        .confirm-delete { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #e55; }

        /* ─── Form ─── */
        .admin-form { max-width: 700px; }
        .form-header { display: flex; align-items: center; gap: 20px; margin-bottom: 40px; }
        .form-header h2 { font-size: 24px; font-weight: 600; letter-spacing: -.02em; }
        .back-btn {
          padding: 8px 16px;
          font-size: 13px;
          font-family: inherit;
          border-radius: 6px;
          border: 1px solid var(--rule);
          background: transparent;
          color: var(--fg-dim);
          cursor: pointer;
          transition: all .2s;
        }
        .back-btn:hover { border-color: var(--rule-hover); color: var(--fg); }

        .form-group { margin-bottom: 24px; }
        .form-row { display: flex; gap: 16px; }
        .form-row .form-group { flex: 1; }
        label { display: block; font-size: 13px; color: var(--fg-ghost); margin-bottom: 8px; letter-spacing: .02em; }
        .label-hint { color: var(--fg-ghost); font-size: 11px; opacity: .7; }
        input, textarea, select {
          width: 100%;
          padding: 14px;
          background: #0a0a0a;
          border: 1px solid var(--rule);
          color: var(--fg);
          border-radius: 6px;
          font-family: inherit;
          font-size: 14px;
          transition: border-color .3s;
          line-height: 1.6;
        }
        select { cursor: pointer; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: var(--accent); }

        .form-divider {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--accent);
          padding: 20px 0;
          margin-bottom: 8px;
          border-top: 1px solid var(--rule);
        }

        .status-msg {
          margin-top: 20px;
          padding: 14px;
          border-radius: 6px;
          text-align: center;
          font-size: 14px;
        }
        .status-msg.success { background: rgba(34,197,94,.08); color: #22c55e; border: 1px solid rgba(34,197,94,.2); }
        .status-msg.error { background: rgba(239,68,68,.08); color: #ef4444; border: 1px solid rgba(239,68,68,.2); }

        @media(max-width: 768px) {
          .admin-page { padding: 100px 16px 60px; }
          .form-row { flex-direction: column; gap: 0; }
          .job-row { flex-direction: column; align-items: flex-start; }
          .job-row-actions { width: 100%; justify-content: flex-end; }
        }
      `}</style>
    </>
  );
}
