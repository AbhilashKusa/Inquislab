'use client';
import { useState } from 'react';
import { publishJob, updateJob, deleteJob, getJobs, authenticate, publishProject, updateProject, deleteProject, getProjects } from './actions';
import { Job } from '@/lib/job-utils';
import { Project } from '@/lib/project-utils';
import styles from './admin.module.css';
import ErrorBoundary from '@/components/ErrorBoundary';
import JobForm from '@/components/admin/JobForm';
import ProjectForm from '@/components/admin/ProjectForm';

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
      const res = await authenticate(password);
      if (res.success) {
        setAuthed(true);
        setInitialLoading(true);
        await loadData();
        setInitialLoading(false);
      } else {
        setStatus(`✗ ${res.error || 'Authentication failed'}`);
      }
    } catch (err) {
      setStatus('✗ Authentication error occurred');
    }
    setLoading(false);
  };

  // ─── Gate ───
  if (!authed) {
    return (
      <div className={styles.adminLogin}>
        <div className={styles.loginBox}>
          <div className={styles.loginTag}>CONTROLLER</div>
          <h1>Admin Access</h1>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter controller password" autoFocus />
            <button type="submit" disabled={loading} className={`btn btn-primary ${styles.w100} ${styles.jcCenter}`}>
              {loading ? 'Unlocking...' : 'Unlock'}
            </button>
            {status && <div className={styles.statusError}>{status}</div>}
          </form>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return <div className={styles.adminPage}><div className={styles.adminHeader}><h1>Loading...</h1></div></div>;
  }

  // ─── Job Handlers ───
  const handleJobSubmit = async (e: React.FormEvent<HTMLFormElement>, mode: 'create_job' | 'edit_job') => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const formData = new FormData(e.currentTarget);
      formData.set('password', password);
      const res = mode === 'create_job' ? await publishJob(formData) : await updateJob(formData);
      
      if (res.success) {
        setStatus(`✓ Job ${mode === 'create_job' ? 'published' : 'updated'} successfully`);
        await loadData();
        setTimeout(() => { setView('dashboard'); setEditJob(null); setStatus(''); }, 1500);
      } else {
        setStatus(`✗ ${res.error || 'Failed to save job'}`);
      }
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
      const res = await deleteJob(formData);
      
      if (res.success) {
        setDeleteConfirm(null);
        await loadData();
        setStatus('✓ Job deleted');
        setTimeout(() => setStatus(''), 2000);
      } else {
        setStatus(`✗ ${res.error || 'Failed to delete job'}`);
      }
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
      const res = mode === 'create_project' ? await publishProject(formData) : await updateProject(formData);
      
      if (res.success) {
        setStatus(`✓ Project ${mode === 'create_project' ? 'published' : 'updated'} successfully`);
        await loadData();
        setTimeout(() => { setView('dashboard'); setEditProject(null); setStatus(''); }, 1500);
      } else {
        setStatus(`✗ ${res.error || 'Failed to save project'}`);
      }
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
      const res = await deleteProject(formData);
      
      if (res.success) {
        setDeleteConfirm(null);
        await loadData();
        setStatus('✓ Project deleted');
        setTimeout(() => setStatus(''), 2000);
      } else {
        setStatus(`✗ ${res.error || 'Failed to delete project'}`);
      }
    } catch (err: unknown) {
      setStatus(`✗ ${err instanceof Error ? err.message : 'Error'}`);
    }
    setLoading(false);
  };

  return (
    <ErrorBoundary>
      <div className={styles.adminPage}>
        <div className={styles.adminHeader}>
          <div className={styles.headerLeft}>
            <h1>Controller</h1>
            <div className={styles.tabNav}>
              <button onClick={() => { setActiveTab('jobs'); setView('dashboard'); }} className={activeTab === 'jobs' ? styles.active : ''}>Jobs</button>
              <button onClick={() => { setActiveTab('projects'); setView('dashboard'); }} className={activeTab === 'projects' ? styles.active : ''}>Projects</button>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </div>

        {status && <div className={`${styles.statusBanner} ${status.startsWith('✓') ? styles.success : styles.error}`}>{status}</div>}

        {view === 'dashboard' && (
          <>
            <div className={styles.dashboardActions}>
              {activeTab === 'jobs' ? (
                <button onClick={() => setView('create_job')} className="btn btn-primary">+ Post New Job</button>
              ) : (
                <button onClick={() => setView('create_project')} className="btn btn-primary">+ Add New Project</button>
              )}
            </div>

            {activeTab === 'jobs' ? (
              <div className={styles.jobList}>
                {jobs.map(job => (
                  <div key={job.id} className={styles.jobRow}>
                    <div className={styles.jobRowInfo}>
                      <h3>{job.title}</h3>
                      <p>{job.team} · {job.location}</p>
                    </div>
                    <div className={styles.jobRowActions}>
                      <button onClick={() => { setEditJob(job); setView('edit_job'); setStatus(''); }} className={`${styles.actionBtn} ${styles.edit}`}>Edit</button>
                      {deleteConfirm === job.id ? (
                        <div className={styles.confirmDelete}>
                          <span>Delete?</span>
                          <button onClick={() => handleJobDelete(job.id)} className={`${styles.actionBtn} ${styles.danger}`} disabled={loading}>Yes</button>
                          <button onClick={() => setDeleteConfirm(null)} className={styles.actionBtn}>No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(job.id)} className={`${styles.actionBtn} ${styles.delete}`}>Delete</button>
                      )}
                      <a href={`/careers/${job.id}`} target="_blank" className={`${styles.actionBtn} ${styles.view}`}>View ↗</a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.jobList}>
                {projects.map(proj => (
                  <div key={proj.id} className={styles.jobRow}>
                    <div className={styles.jobRowInfo}>
                      <h3>{proj.title}</h3>
                      <p>{proj.summary}</p>
                    </div>
                    <div className={styles.jobRowActions}>
                      <button onClick={() => { setEditProject(proj); setView('edit_project'); setStatus(''); }} className={`${styles.actionBtn} ${styles.edit}`}>Edit</button>
                      {deleteConfirm === proj.id ? (
                        <div className={styles.confirmDelete}>
                          <span>Delete?</span>
                          <button onClick={() => handleProjectDelete(proj.id)} className={`${styles.actionBtn} ${styles.danger}`} disabled={loading}>Yes</button>
                          <button onClick={() => setDeleteConfirm(null)} className={styles.actionBtn}>No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(proj.id)} className={`${styles.actionBtn} ${styles.delete}`}>Delete</button>
                      )}
                      <a href={`/careers/${proj.id}`} target="_blank" className={`${styles.actionBtn} ${styles.view}`}>View ↗</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === 'create_job' && <JobForm mode="create_job" handleJobSubmit={handleJobSubmit} setView={setView} setEditJob={setEditJob} setStatus={setStatus} editJob={editJob} loading={loading} status={status} />}
        {view === 'edit_job' && <JobForm mode="edit_job" handleJobSubmit={handleJobSubmit} setView={setView} setEditJob={setEditJob} setStatus={setStatus} editJob={editJob} loading={loading} status={status} />}
        {view === 'create_project' && <ProjectForm mode="create_project" handleProjectSubmit={handleProjectSubmit} setView={setView} setEditProject={setEditProject} setStatus={setStatus} editProject={editProject} loading={loading} status={status} />}
        {view === 'edit_project' && <ProjectForm mode="edit_project" handleProjectSubmit={handleProjectSubmit} setView={setView} setEditProject={setEditProject} setStatus={setStatus} editProject={editProject} loading={loading} status={status} />}
      </div>
    </ErrorBoundary>
  );
}
