'use client';

export default function Home() {
  return (
    <div className="coming-soon-page">
      <header className="cs-header">
        <div className="cs-logo">InquisLab</div>
      </header>

      <main className="cs-main">
        <h1 className="cs-title">
          Building
          <span className="cs-subtitle">something new.</span>
        </h1>
        <div className="cs-line"></div>
      </main>

      <footer className="cs-footer">
        <div className="cs-status"><span className="cs-dot"></span>Coming Soon</div>
        <a href="mailto:hello@inquislab.com" className="cs-contact">hello@inquislab.com</a>
      </footer>

      <style jsx>{`
        .coming-soon-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          background: #000;
          color: #fff;
          overflow: hidden;
        }

        .cs-header {
          opacity: 0;
          animation: csFade 1s ease forwards 0.2s;
        }

        .cs-logo {
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .cs-main {
          position: relative;
        }

        .cs-title {
          font-size: clamp(3rem, 12vw, 10rem);
          font-weight: 600;
          letter-spacing: -0.04em;
          line-height: 0.9;
          opacity: 0;
          animation: csSlideUp 1s ease forwards 0.4s;
        }

        .cs-subtitle {
          display: block;
          color: #444;
        }

        .cs-line {
          position: absolute;
          left: 0;
          bottom: -2rem;
          width: 60px;
          height: 2px;
          background: #fff;
          opacity: 0;
          animation: csGrow 0.8s ease forwards 1s;
        }

        .cs-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          opacity: 0;
          animation: csFade 1s ease forwards 0.6s;
        }

        .cs-status {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #666;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cs-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: csBlink 2s ease-in-out infinite;
        }

        .cs-contact {
          font-size: 0.875rem;
          color: #666 !important;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .cs-contact:hover {
          color: #fff !important;
        }

        @keyframes csFade {
          to { opacity: 1; }
        }

        @keyframes csSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes csGrow {
          from { opacity: 0; width: 0; }
          to { opacity: 1; width: 60px; }
        }

        @keyframes csBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @media (max-width: 600px) {
          .coming-soon-page { padding: 2rem; }
          .cs-footer { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
      `}</style>
    </div>
  );
}
