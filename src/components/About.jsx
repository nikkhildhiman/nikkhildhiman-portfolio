import React, { useEffect, useState, useRef } from 'react';
import { ABOUT_DATA } from '../data/portfolioData';

export default function About() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sandboxRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sandboxRef.current) return;
      const rect = sandboxRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the sandbox, normalized -1 to 1
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      
      setMousePos({ x, y });
    };

    const element = sandboxRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (element) element.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section id="about" style={{ backgroundColor: 'var(--color-surface)', position: 'relative' }}>
      
      {/* =========================================
          PART 1: THE INTERACTIVE SANDBOX
          ========================================= */}
      <div 
        ref={sandboxRef}
        style={{ 
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '2px solid var(--color-black)'
        }}
      >
        {/* 1. Massive Typography Background (Parallax Layer - Far Back) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150%', // Wider to allow movement
          transform: `translate(-50%, -50%) translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: 0,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0px'
        }}>
          {[...Array(5)].map((_, i) => (
            <h2 key={i} style={{ 
              fontSize: 'clamp(2.5rem, 10vw, 12rem)', 
              lineHeight: 0.85, 
              margin: 0, 
              color: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.03)', 
              WebkitTextStroke: i % 2 === 0 ? '2px rgba(0,0,0,0.1)' : 'none',
              fontFamily: 'var(--font-heading)', 
              fontWeight: 900, 
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>
              ENGINEERING EMOTION
            </h2>
          ))}
        </div>

        {/* 2. Floating Centerpiece Portrait (Parallax Layer - Middle) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: 2,
          width: 'min(70vw, 360px)',
          aspectRatio: '4/5',
          borderRadius: '24px',
          border: '2px solid var(--color-black)',
          boxShadow: '16px 16px 0 rgba(0,0,0,0.15)', // Brutalist shadow
          overflow: 'hidden',
          backgroundColor: '#000'
        }}>
          <img
            src={ABOUT_DATA.portrait}
            alt="Nikhil Dhiman"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: 'contrast(1.05)'
            }}
          />
        </div>

        {/* 3. Floating UI Badges (Parallax Layer - Front) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'min(85vw, 500px)',
          height: '400px',
          transform: `translate(-50%, -50%) translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: 3,
          pointerEvents: 'none'
        }}>
          {/* Badge 1 */}
          <div style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            background: 'var(--color-black)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '99px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.85rem'
          }}>
            2+ Years Studio
          </div>
          
          {/* Badge 2 */}
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            background: 'var(--accent-blue)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '99px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.85rem'
          }}>
            Premiere • Resolve • AE
          </div>
        </div>
      </div>

      {/* =========================================
          PART 2: THE READABLE PHILOSOPHY
          ========================================= */}
      <div className="container" style={{ position: 'relative', zIndex: 10, padding: '80px 0' }}>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)', 
          gap: '40px'
        }}>
          
          <div style={{ gridColumn: 'span 12' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--color-black)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em' }}>
              [ BEHIND THE CRAFT ]
            </div>
          </div>

          <div style={{ gridColumn: 'span 12' }} className="about-text-left">
            <h3 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              color: 'var(--color-black)', 
              fontWeight: 900, 
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: '0',
              textTransform: 'uppercase'
            }}>
              "I build high-converting narrative engines for top creators."
            </h3>
          </div>

          <div style={{ gridColumn: 'span 12' }} className="about-text-right">
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0' }}>
              With over 2 years of active directorial and studio experience, my approach is hyper-focused on visual psychology. By obsessing over narrative rhythm, DaVinci Resolve color grading, and high-CTR thumbnail design, I ensure every frame drives measurable retention.
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .about-text-left { grid-column: span 7 !important; }
          .about-text-right { grid-column: span 5 !important; }
        }
      `}</style>

    </section>
  );
}
