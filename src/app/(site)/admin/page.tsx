'use client';
import { useState } from 'react';
import { publishJob } from './actions';

export default function AdminController() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const formData = new FormData(e.currentTarget);
      await publishJob(formData);
      setStatus('Success! Job published.');
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="page">
        <div className="hero">
          <div className="hero-tag">Controller</div>
          <h1>Post a new role</h1>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Controller Password</label>
            <input type="password" name="password" required placeholder="Enter admin password" />
          </div>

          <div className="form-group">
            <label>Job Title</label>
            <input type="text" name="title" required placeholder="e.g. Engineer · Data" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Team</label>
              <input type="text" name="team" defaultValue="Team 01 · Product Engineering" required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" defaultValue="Remote · India" required />
            </div>
          </div>

          <div className="form-group">
            <label>Short Summary</label>
            <textarea name="summary" rows={3} required placeholder="High-level description of what they will do... (HTML allowed e.g. <em>word</em>)"></textarea>
          </div>

          <div className="form-group">
            <label>Requirements (One per line)</label>
            <textarea name="requirements" rows={6} required placeholder="React or Next.js fluency...&#10;Comfortable with Python...&#10;Bonus: Industrial experience..."></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Publishing...' : 'Publish to Live Site'}
          </button>
          
          {status && <div className="status-msg">{status}</div>}
        </form>
      </div>

      <style jsx>{`
        .page { max-width: 600px; margin: 0 auto; padding: 140px 24px 80px; }
        .hero { margin-bottom: 40px; text-align: center; }
        .hero-tag { font-size: 12px; font-weight: 500; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
        .hero h1 { font-size: 36px; font-weight: 600; letter-spacing: -.03em; }
        
        .admin-form { background: rgba(5,5,5,.5); padding: 40px; border: 1px solid var(--rule); border-radius: 8px; }
        .form-group { margin-bottom: 24px; }
        .form-row { display: flex; gap: 16px; }
        .form-row .form-group { flex: 1; }
        label { display: block; font-size: 13px; color: var(--fg-ghost); margin-bottom: 8px; letter-spacing: .02em; }
        input, textarea { width: 100%; padding: 14px; background: #0a0a0a; border: 1px solid var(--rule); color: var(--fg); border-radius: 6px; font-family: inherit; font-size: 14px; transition: border-color .3s; }
        input:focus, textarea:focus { outline: none; border-color: var(--accent); }
        .status-msg { margin-top: 24px; padding: 16px; border: 1px dashed var(--rule); text-align: center; font-size: 14px; color: var(--accent); border-radius: 6px; }
      `}</style>
    </>
  );
}
