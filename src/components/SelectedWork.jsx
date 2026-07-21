import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PORTFOLIO_DATA = [
  {
    id: 1,
    title: 'Nike Air Max - Defy Gravity',
    category: 'COMMERCIAL',
    client: 'Nike Global',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
    metric: '12M+ Views',
  },
  {
    id: 2,
    title: 'The Art of Coffee',
    category: 'DOCUMENTARY',
    client: 'Blue Bottle',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop',
    metric: 'Staff Pick',
  },
  {
    id: 3,
    title: 'Tech Review Hook',
    category: 'REELS',
    client: 'Creator MKBHD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop',
    metric: '92% Retention',
  },
  {
    id: 4,
    title: 'Midnight Run',
    category: 'SHORT FILM',
    client: 'Independent',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535016120720-40c746a47ce4?q=80&w=2070&auto=format&fit=crop',
    metric: 'Award Winner',
  }
];

export default function SelectedWork({ onOpenVideo }) {
  const sectionRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check mobile to disable horizontal scroll on small screens
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Don't run horizontal GSAP on mobile (stack instead)

    const section = sectionRef.current;
    const wrapper = scrollWrapperRef.current;
    const cards = gsap.utils.toArray('.horizontal-card');
    const images = gsap.utils.toArray('.parallax-img');

    if (section && wrapper) {
      // Calculate total scroll distance based on content width
      const getScrollAmount = () => -(wrapper.scrollWidth - window.innerWidth);

      // The main horizontal scroll tween
      const tween = gsap.to(wrapper, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${wrapper.scrollWidth - window.innerWidth}`, // Pin duration matches width
          pin: true,
          scrub: 1, // Smooth scrub
          invalidateOnRefresh: true, // Recalculate on resize
        }
      });

      // Internal Image Parallax Loop
      images.forEach((img) => {
        // Move images slightly to the right inside their containers as you scroll left
        gsap.to(img, {
          xPercent: 30, // Parallax intensity
          ease: 'none',
          scrollTrigger: {
            trigger: section, // Bound to the same section trigger
            start: 'top top',
            end: () => `+=${wrapper.scrollWidth - window.innerWidth}`,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      });

      return () => {
        tween.kill();
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }
  }, [isMobile]);

  return (
    <section 
      id="work" 
      ref={sectionRef} 
      style={{ 
        backgroundColor: 'var(--color-surface)',
        overflow: 'hidden', // Hide overflow for the horizontal scrolling
        padding: isMobile ? '80px 0' : '0' // Mobile needs padding, Desktop uses 100vh pin
      }}
    >
      
      {/* Desktop Horizontal Scroll Wrapper */}
      <div 
        ref={scrollWrapperRef}
        style={{
          display: 'flex',
          height: isMobile ? 'auto' : '100vh',
          alignItems: 'center',
          padding: isMobile ? '0 24px' : '0 10vw',
          gap: isMobile ? '64px' : '8vw',
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'max-content'
        }}
      >
        
        {/* Intro Block (Scrolls with the gallery) */}
        <div style={{ 
          minWidth: isMobile ? '100%' : '30vw',
          maxWidth: isMobile ? '100%' : '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <h2 style={{ fontSize: 'clamp(4rem, 8vw, 6rem)', color: 'var(--color-black)', margin: 0, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em', fontWeight: 800 }}>
            SELECTED <br/><span style={{ color: 'var(--text-muted)' }}>WORK</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1.5, margin: 0 }}>
            A curated collection of my most impactful visual stories, commercial edits, and viral short-form content.
          </p>
        </div>

        {/* The Project Cards */}
        {PORTFOLIO_DATA.map((project, index) => (
          <div 
            key={project.id}
            className={`horizontal-card video-hover`} // Custom Cursor Hook
            onClick={() => onOpenVideo('https://www.w3schools.com/html/mov_bbb.mp4')}
            style={{
              position: 'relative',
              width: isMobile ? '100%' : '60vw',
              height: isMobile ? '50vh' : '70vh',
              minWidth: isMobile ? '100%' : '800px',
              borderRadius: '24px',
              overflow: 'hidden',
              cursor: 'none', // Hide standard cursor
              boxShadow: '0 32px 64px rgba(0,0,0,0.15)',
              border: '1px solid var(--glass-border)'
            }}
          >
            {/* Parallax Image Wrapper */}
            <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <img 
                className="parallax-img"
                src={project.thumbnailUrl} 
                alt={project.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: isMobile ? '0' : '-15%', // Offset for parallax calculation
                  width: isMobile ? '100%' : '130%', // Wider to allow for parallax sliding
                  height: '100%',
                  objectFit: 'cover',
                  willChange: 'transform'
                }}
              />
            </div>
            
            {/* Cinematic Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)',
              pointerEvents: 'none'
            }}></div>

            {/* Content Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              padding: isMobile ? '32px 24px' : '48px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              
              {/* Top Meta Data */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ padding: '6px 12px', backgroundColor: 'var(--accent-blue)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, borderRadius: '99px', textTransform: 'uppercase' }}>
                  {project.category}
                </span>
                <span style={{ color: '#ccc', fontSize: '0.85rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {project.client}
                </span>
              </div>

              {/* Title */}
              <h3 style={{ margin: 0, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#ffffff', fontFamily: 'var(--font-heading)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                {project.title}
              </h3>

              {/* Bottom Meta Data */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Key Metric</div>
                  <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 600 }}>{project.metric}</div>
                </div>
                
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <ArrowUpRight size={24} color="#fff" />
                </div>
              </div>

            </div>
          </div>
        ))}

      </div>

      <style>{`
        /* Smooth scrolling snap could go here if we didn't use scrub */
        @media (max-width: 768px) {
          #work { min-height: auto !important; }
        }
      `}</style>
    </section>
  );
}
