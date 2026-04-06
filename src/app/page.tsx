'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './home.module.css';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 2.5 } });

      tl.from(`.${styles.labName}`, { 
        opacity: 0, 
        y: 10,
        delay: 0.8
      })
      .from(`.${styles.coreQuestion}`, { 
        opacity: 0, 
        y: 30,
      }, '-=1.8')
      .from(`.${styles.responseLine}`, { 
        opacity: 0, 
        y: 20,
      }, '-=1.5')
      .from(`.${styles.philosophy}`, { 
        opacity: 0, 
        filter: 'blur(10px)',
      }, '-=1.2');
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.homeContainer} ref={containerRef}>
      <div className={styles.philosophicalContent}>
        <span className={styles.labName}>InquisLabs Research</span>
        
        <h1 className={styles.coreQuestion}>
          What does curiosity do to humanity?
        </h1>
        
        <p className={styles.responseLine}>
          It builds, questions, and redefines what’s possible.
        </p>

        <p className={styles.philosophy}>
          A relentless search for what <span>matters</span>.
        </p>
      </div>
    </div>
  );
}
