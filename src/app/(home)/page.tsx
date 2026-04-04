'use client';
export default function Home() {
  return (
    <>
      <header>
        <div className="logo">InquisLab</div>
      </header>

      <main>
        <h1>
          Building
          <span>something new.</span>
        </h1>
        <div className="line"></div>
      </main>

      <footer>
        <div className="status"><span></span>Coming Soon</div>
        <a href="mailto:hello@inquislab.com" className="contact">hello@inquislab.com</a>
      </footer>

      <style jsx global>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            height: 100%;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: #000;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 3rem;
            overflow: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        header {
            opacity: 0;
            animation: fade 1s ease forwards 0.2s;
        }

        .logo {
            font-size: 1rem;
            font-weight: 500;
            letter-spacing: 0.15em;
            text-transform: uppercase;
        }

        main {
            position: relative;
        }

        h1 {
            font-size: clamp(3rem, 12vw, 10rem);
            font-weight: 600;
            letter-spacing: -0.04em;
            line-height: 0.9;
            opacity: 0;
            animation: slideUp 1s ease forwards 0.4s;
        }

        h1 span {
            display: block;
            color: #444;
        }

        .line {
            position: absolute;
            left: 0;
            bottom: -2rem;
            width: 60px;
            height: 2px;
            background: #fff;
            opacity: 0;
            animation: grow 0.8s ease forwards 1s;
        }

        footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            opacity: 0;
            animation: fade 1s ease forwards 0.6s;
        }

        .status {
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #666;
        }

        .status span {
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #22c55e;
            border-radius: 50%;
            margin-right: 0.5rem;
            animation: blink 2s ease-in-out infinite;
        }

        .contact {
            font-size: 0.875rem;
            color: #666;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .contact:hover {
            color: #fff;
        }

        /* Animations */
        @keyframes fade {
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes grow {
            from {
                opacity: 0;
                width: 0;
            }
            to {
                opacity: 1;
                width: 60px;
            }
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            body {
                padding: 2rem;
            }
            
            footer {
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;
            }
        }
      `}</style>
    </>
  );
}
