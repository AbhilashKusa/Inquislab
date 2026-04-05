'use client';
import { useState } from 'react';
import { publishJob, updateJob, deleteJob, getJobs, authenticate, publishProject, updateProject, deleteProject, getProjects } from './actions';
import { Job } from '@/lib/job-utils';
import { Project } from '@/lib/project-utils';

type Tab = 'jobs' | 'projects';
type View = 'dashboard' | 'create_job' | 'edit_job' | 'create_project' | 'edit_project';

export default function AdminController() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('jobs');
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [view, setView] = useState<View>('dashboard');
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [editProject, setEditProject] = useState<Project | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null); // holds job ID or project ID

  const loadData = async () => {
    try {
      const jData = await getJobs();
      const pData = await getProjects();
      setJobs(jData);
      setProjects(pData);
    } catch (err) {
      setStatus('Failed to load data');
      console.error('Failed to load data:', err);
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    setPassword('');
    setJobs([]);
    setProjects([]);
    setView('dashboard');
    setEditJob(null);
    setEditProject(null);
    setStatus('');
    setActiveTab('jobs');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await authenticate(password);
      setAuthed(true);
      setInitialLoading(true);
      await loadData();
      setInitialLoading(false);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Authentication failed');
    }
    setLoading(false);
  };

  // ─── Gate ───
  if (!authed) {
    return (
      <div className="admin-login">
        <div className="login-box">
          <div className="login-tag">CONTROLLER</div>
          <h1>Admin Access</h1>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter controller password" autoFocus />
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Unlocking...' : 'Unlock'}
            </button>
            {status && <div className="status-error">{status}</div>}
          </form>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return <div className="admin-page"><div className="admin-header"><h1>Loading...</h1></div></div>;
  }

  // ─── Job Handlers ───
  const handleJobSubmit = async (e: React.FormEvent<HTMLFormElement>, mode: 'create_job' | 'edit_job') => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const formData = new FormData(e.currentTarget);
      formData.set('password', password);
      if (mode === 'create_job') await publishJob(formData);
      else await updateJob(formData);
      setStatus(`✓ Job ${mode === 'create_job' ? 'published' : 'updated'} successfully`);
      await loadData();
      setTimeout(() => { setView('dashboard'); setEditJob(null); setStatus(''); }, 1500);
    } catch (err: unknown) {
      setStatus(`✗ ${err instanceof Error ? err.message : 'Error'}`);
    }
    setLoading(false);
  };

  const handleJobDelete = async (jobId: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set('password', password);
      formData.set('id', jobId);
      await deleteJob(formData);
      setDeleteConfirm(null);
      await loadData();
      setStatus('✓ Job deleted');
      setTimeout(() => setStatus(''), 2000);
    } catch (err: unknown) {
      setStatus(`✗ ${err instanceof Error ? err.message : 'Error'}`);
    }
    setLoading(false);
  };

  // ─── Project Handlers ───
  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>, mode: 'create_project' | 'edit_project') => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const formData = new FormData(e.currentTarget);
      formData.set('password', password);
      if (mode === 'create_project') await publishProject(formData);
      else await updateProject(formData);
      setStatus(`✓ Project ${mode === 'create_project' ? 'published' : 'updated'} successfully`);
      await loadData();
      setTimeout(() => { setView('dashboard'); setEditProject(null); setStatus(''); }, 1500);
    } catch (err: unknown) {
      setStatus(`✗ ${err instanceof Error ? err.message : 'Error'}`);
    }
    setLoading(false);
  };

  const handleProjectDelete = async (projId: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set('password', password);
      formData.set('id', projId);
      await deleteProject(formData);
      setDeleteConfirm(null);
      await loadData();
      setStatus('✓ Project deleted');
      setTimeout(() => setStatus(''), 2000);
    } catch (err: unknown) {
      setStatus(`✗ ${err instanceof Error ? err.message : 'Error'}`);
    }
    setLoading(false);
  };

  // ─── Forms ───
  const renderJobForm = (mode: 'create_job' | 'edit_job') => {
    const j = mode === 'edit_job' ? editJob : null;

    return (
      <form onSubmit={(e) => handleJobSubmit(e, mode)} className="admin-form">
        <div className="form-header">
          <button type="button" onClick={() => { setView('dashboard'); setEditJob(null); setStatus(''); }} className="back-btn">← Back</button>
          <h2>{mode === 'create_job' ? 'Create new role' : `Edit: ${j?.title}`}</h2>
        </div>
        {mode === 'edit_job' && <input type="hidden" name="id" value={j?.id} />}

        <div className="config-card">
          <div className="config-header">1. Core Metadata</div>
          <div className="form-group"><label>Job Title</label><input type="text" name="title" required defaultValue={j?.title || ''} /></div>
          <div className="form-group"><label>Summary</label><textarea name="summary" rows={3} required defaultValue={j?.summary || ''} placeholder="Brief role overview..." /></div>
        </div>

        <div className="config-card">
          <div className="config-header">2. Taxonomy & Routing</div>
          <div className="form-row">
            <div className="form-group"><label>Team</label><select name="team" defaultValue={j?.team || 'Team 01 · Product Engineering'}><option>Team 01 · Product Engineering</option><option>Team 02 · Marketing &amp; Growth</option></select></div>
            <div className="form-group"><label>Location</label><input type="text" name="location" defaultValue={j?.location || 'Remote · India'} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Type</label><input type="text" name="type" defaultValue={j?.type || 'Full-time'} /></div>
            <div className="form-group"><label>Tag</label><input type="text" name="tag" defaultValue={j?.tags?.[0] || 'Work with founder'} /></div>
          </div>
        </div>

        <div className="config-card">
          <div className="config-header">3. Content Sections</div>
          <div className="config-subtext">Leave sections blank to omit them from the job post.</div>
          {[1, 2, 3, 4].map(i => {
            const section = j?.sections?.[i - 1];
            const defaultTitle = i === 1 ? 'Expect to focus on' : i === 2 ? 'You may be a good fit if you' : i === 3 ? 'InquisLab is for you if' : '';
            return (
              <div className="section-block" key={i}>
                <div className="form-group">
                  <label>Section {i} Title</label>
                  <input type="text" name={`secTitle${i}`} defaultValue={section?.title || (mode === 'create_job' ? defaultTitle : '')} placeholder="e.g. Responsibilities" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Section {i} Bullets <span className="label-hint">(one bullet per line)</span></label>
                  <textarea name={`secBullets${i}`} rows={i === 1 ? 5 : i === 2 ? 4 : 3} defaultValue={section?.bullets?.join('\n') || ''} placeholder="Add specific details..." />
                </div>
              </div>
            );
          })}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '24px', padding: '16px' }}>
          {loading ? 'Saving...' : mode === 'create_job' ? 'Publish Job' : 'Update Job'}
        </button>
        {status && <div className={`status-msg ${status.startsWith('✓') ? 'success' : 'error'}`}>{status}</div>}
      </form>
    );
  };

  const renderProjectForm = (mode: 'create_project' | 'edit_project') => {
    const p = mode === 'edit_project' ? editProject : null;

    return (
      <form onSubmit={(e) => handleProjectSubmit(e, mode)} className="admin-form">
        <div className="form-header">
          <button type="button" onClick={() => { setView('dashboard'); setEditProject(null); setStatus(''); }} className="back-btn">← Back</button>
          <h2>{mode === 'create_project' ? 'Create new project' : `Edit: ${p?.title}`}</h2>
        </div>
        {mode === 'edit_project' && <input type="hidden" name="id" value={p?.id} />}

        <div className="form-divider">Basic Info (Careers List)</div>
        <div className="form-row">
          <div className="form-group"><label>Project Title</label><input type="text" name="title" required defaultValue={p?.title || ''} /></div>
          <div className="form-group"><label>Project Number</label><input type="text" name="projectNumber" defaultValue={p?.projectNumber || 'PROJECT 01'} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Status Tag</label><input type="text" name="status" defaultValue={p?.status || 'Hiring'} /></div>
        </div>
        <div className="form-group"><label>Project Summary</label><textarea name="summary" rows={3} required defaultValue={p?.summary || ''} /></div>

        <div className="form-divider">Detail Page: Hero</div>
        <div className="form-group"><label>Hero Tag</label><input type="text" name="heroTag" defaultValue={p?.heroTag || ''} /></div>
        <div className="form-group"><label>Hero Title (HTML ok)</label><textarea name="heroH1" rows={3} defaultValue={p?.heroH1 || ''} /></div>
        <div className="form-group"><label>Hero Subtitle</label><textarea name="heroSub" rows={3} defaultValue={p?.heroSub || ''} /></div>

        <div className="form-divider">Detail Page: Problem Strip Items</div>
        {[1, 2, 3].map(i => {
          const item = p?.stripItems?.[i - 1];
          return (
            <div className="form-row" key={i}>
              <div className="form-group" style={{ flex: 1 }}><label>Strip {i} Title</label><input type="text" name={`stripTitle${i}`} defaultValue={item?.title || ''} /></div>
              <div className="form-group" style={{ flex: 2 }}><label>Strip {i} Description</label><input type="text" name={`stripDesc${i}`} defaultValue={item?.desc || ''} /></div>
            </div>
          );
        })}

        <div className="form-divider">Detail Page: Roles Section & CTA</div>
        <div className="form-group">
          <label>Target Teams <span className="label-hint">(One per line. Leave empty to display jobs from ALL teams)</span></label>
          <textarea name="targetTeams" rows={3} defaultValue={p?.targetTeams?.join('\n') || ''} placeholder="Team 01 · Product Engineering" />
        </div>
        <div className="form-row">
          <div className="form-group"><label>Roles Title</label><input type="text" name="rolesTitle" defaultValue={p?.rolesTitle || 'Open Roles'} /></div>
          <div className="form-group"><label>Roles Subtitle</label><input type="text" name="rolesSub" defaultValue={p?.rolesSub || ''} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>CTA Pre-title</label><input type="text" name="ctaPre" defaultValue={p?.ctaPre || 'How to apply'} /></div>
          <div className="form-group"><label>CTA Email</label><input type="text" name="ctaEmail" defaultValue={p?.ctaEmail || 'careers@inquislab.com'} /></div>
        </div>
        <div className="form-group"><label>CTA Title (HTML ok)</label><input type="text" name="ctaTitle" defaultValue={p?.ctaTitle || ''} /></div>
        <div className="form-group"><label>CTA Note (HTML ok)</label><textarea name="ctaNote" rows={3} defaultValue={p?.ctaNote || ''} /></div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Saving...' : mode === 'create_project' ? 'Publish Project' : 'Update Project'}
        </button>
        {status && <div className={`status-msg ${status.startsWith('✓') ? 'success' : 'error'}`}>{status}</div>}
      </form>
    );
  };

  // ─── UI ───
  return (
    <div className="admin-page">
      {view === 'dashboard' && (
        <>
          <div className="admin-header">
            <div>
              <div className="admin-tag">CONTROLLER</div>
              <h1>{activeTab === 'jobs' ? 'Jobs CRM' : 'Projects CRM'}</h1>
              <p>{activeTab === 'jobs' ? jobs.length : projects.length} {activeTab === 'jobs' ? 'roles' : 'projects'} published</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => { setView(activeTab === 'jobs' ? 'create_job' : 'create_project'); setStatus(''); }} 
                className="btn btn-primary"
              >
                + New {activeTab === 'jobs' ? 'Role' : 'Project'}
              </button>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </div>
          </div>

          <div className="admin-tabs" style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '1px solid var(--rule)' }}>
            <button 
              style={{ background: 'transparent', border: 'none', color: activeTab === 'jobs' ? 'var(--fg)' : 'var(--fg-dim)', paddingBottom: '12px', borderBottom: activeTab === 'jobs' ? '2px solid var(--accent)' : '2px solid transparent', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
              onClick={() => setActiveTab('jobs')}
            >Jobs</button>
            <button 
              style={{ background: 'transparent', border: 'none', color: activeTab === 'projects' ? 'var(--fg)' : 'var(--fg-dim)', paddingBottom: '12px', borderBottom: activeTab === 'projects' ? '2px solid var(--accent)' : '2px solid transparent', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
              onClick={() => setActiveTab('projects')}
            >Projects</button>
          </div>

          {status && <div className={`status-msg ${status.startsWith('✓') ? 'success' : 'error'}`} style={{ marginBottom: '24px' }}>{status}</div>}

          {activeTab === 'jobs' ? (
            <div className="jobs-list">
              {jobs.map(job => (
                <div key={job.id} className="job-row">
                  <div className="job-row-info">
                    <div className="job-row-title">{job.title}</div>
                    <div className="job-row-meta">
                      <span>{job.team}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="job-row-actions">
                    <button onClick={() => { setEditJob(job); setView('edit_job'); setStatus(''); }} className="action-btn edit">Edit</button>
                    {deleteConfirm === job.id ? (
                      <div className="confirm-delete">
                        <span>Delete?</span>
                        <button onClick={() => handleJobDelete(job.id)} className="action-btn danger" disabled={loading}>Yes</button>
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
          ) : (
            <div className="jobs-list">
              {projects.map(proj => (
                <div key={proj.id} className="job-row">
                  <div className="job-row-info">
                    <div className="job-row-title">{proj.title}</div>
                    <div className="job-row-meta">
                      <span>{proj.projectNumber}</span>
                      <span>·</span>
                      <span>{proj.status}</span>
                    </div>
                  </div>
                  <div className="job-row-actions">
                    <button onClick={() => { setEditProject(proj); setView('edit_project'); setStatus(''); }} className="action-btn edit">Edit</button>
                    {deleteConfirm === proj.id ? (
                      <div className="confirm-delete">
                        <span>Delete?</span>
                        <button onClick={() => handleProjectDelete(proj.id)} className="action-btn danger" disabled={loading}>Yes</button>
                        <button onClick={() => setDeleteConfirm(null)} className="action-btn">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(proj.id)} className="action-btn delete">Delete</button>
                    )}
                    <a href={`/careers/${proj.id}`} target="_blank" className="action-btn view">View ↗</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === 'create_job' && renderJobForm('create_job')}
      {view === 'edit_job' && renderJobForm('edit_job')}
      {view === 'create_project' && renderProjectForm('create_project')}
      {view === 'edit_project' && renderProjectForm('edit_project')}
    </div>
  );
}
