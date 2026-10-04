import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ABOUT_DATA } from '../data/portfolioData';
import { staggeredReveal } from '../utils/motion';

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

  const sectionRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray('.about-reveal');
      if (elements.length) {
        staggeredReveal(elements, 0.15, 0);
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={(el) => {
        sectionRef.current = el;
        sandboxRef.current = el;
      }} 
      id="about" 
      style={{ 
        backgroundColor: 'var(--color-surface)', 
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 0',
        overflow: 'hidden'
      }}
    >
      {/* 1. Massive Typography Background (Parallax Layer - Far Back) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '150%',
        transform: `translate(-50%, -50%) translate(${mousePos.x * -16}px, ${mousePos.y * -16}px)`,
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
            fontSize: 'clamp(3rem, 12vw, 14rem)', 
            lineHeight: 0.85, 
            margin: 0, 
            color: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', 
            WebkitTextStroke: i % 2 === 0 ? '2px rgba(255,255,255,0.05)' : 'none',
            fontFamily: 'var(--font-heading)', 
            fontWeight: 900, 
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}>
            ENGINEERING EMOTION
          </h2>
        ))}
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="grid-12" style={{ gap: 'max(60px, 8vw)', alignItems: 'center' }}>
          
          {/* Left: Floating Portrait & Badges */}
          <div className="about-photo-col about-reveal" style={{ gridColumn: 'span 12', position: 'relative' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
              margin: '0 auto',
            }}>
              <div style={{
                transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
                transition: 'transform 0.1s ease-out',
                width: '100%',
                aspectRatio: '4/5',
                borderRadius: '24px',
                border: '2px solid var(--color-black)',
                boxShadow: '16px 16px 0 rgba(0,0,0,0.15)',
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

              {/* Floating UI Badges */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                pointerEvents: 'none',
                transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`,
                transition: 'transform 0.1s ease-out',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-5%',
                  left: '-10%',
                  background: 'var(--color-black)',
                  color: '#111111',
                  padding: '12px 24px',
                  borderRadius: '99px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.85rem'
                }}>
                  2+ Years
                </div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '-5%',
                  right: '-10%',
                  background: 'var(--accent-blue)',
                  color: '#111111',
                  padding: '12px 24px',
                  borderRadius: '99px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap'
                }}>
                  Premiere • Resolve • AE
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text Copy */}
          <div className="about-text-col about-reveal" style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <h3 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
              color: 'var(--text-main)', 
              fontWeight: 800, 
              lineHeight: 1.1,
              margin: '0',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em'
            }}>
              I turn ideas into <br className="hide-mobile" />
              <span style={{ color: '#E4FF00', fontStyle: 'italic', fontFamily: "'Melodrama', serif", textTransform: 'none', fontWeight: 600 }}>visual stories people remember.</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0' }}>
                I’m <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Nikhil</span> — a creative director and visual storyteller who loves turning raw ideas into content that actually connects.
              </p>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0' }}>
                For the past 2+ years, I’ve been creating, directing, editing, and designing for creators, brands, and digital platforms. I’m obsessed with <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>storytelling, visual psychology, pacing, and the little details</span> that make people stop scrolling and keep watching.
              </p>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0' }}>
                Whether it’s a reel, a thumbnail, a campaign, or a complete visual identity — I don’t just make things look good. <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>I think about why they work.</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .about-photo-col { grid-column: span 5 !important; }
          .about-text-col { grid-column: span 7 !important; }
        }
      `}</style>
    </section>
  );
}
