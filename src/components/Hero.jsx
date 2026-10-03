import React, { useRef, useEffect, useState } from 'react';

// ==========================================
// REAL PROJECT DATA
// ==========================================
const baseProjects = [
  { id: '01', title: 'SEQUENCE 01', category: 'FILM', video: '/assets/Sequence_01_25.mp4', poster: '/assets/Sequence_01_25.jpg' },
  { id: '02', title: 'SOCIALZ PROMO', category: 'SHORT-FORM', video: '/assets/Nikkhil_x_socialz_2.MP4', poster: '/assets/Nikkhil_x_socialz_2.jpg' },
  { id: '03', title: 'JECRC CONCEPT', category: 'GRAPHICS', video: '', poster: '/assets/concept-jecrc.jpg' },
  { id: '04', title: 'KHUSHAL COLLAB', category: 'THUMBNAIL', video: '', poster: '/assets/Nikhil_x_Khushal.jpg' },
  { id: '05', title: 'GIRLS REE 4K', category: 'SHORT-FORM', video: '', poster: '/assets/girls-ree-4k.jpg' },
  { id: '06', title: 'YEH DIL', category: 'CAMPAIGN', video: '', poster: '/assets/YEH_DIL_FOR_JECRC.jpg' },
  { id: '07', title: 'SHOOT BTS', category: 'CINEMATOGRAPHY', video: '', poster: '/assets/DSC_7738.jpg' },
];

export const orbitProjects = Array.from({ length: 10 }).map((_, i) => ({
  ...baseProjects[i % baseProjects.length],
  uid: `orb-${i}`
}));

// ==========================================
// ORBIT CARD COMPONENT
// ==========================================
const OrbitCard = ({ project, isHovered, onHover, onLeave }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div
      className="portfolio-orbit-card"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '190px',
        height: '260px',
        marginTop: '-130px',
        marginLeft: '-95px',
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity, z-index',
        opacity: 0,
        transition: 'z-index 0.4s ease'
      }}
    >
      <div 
        className="orbit-card-inner"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.10)',
          transition: 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 450ms ease',
          // Hover pops card forward without breaking the fisheye base transform applied by parent
          transform: isHovered ? 'translateZ(30px) scale(1.02)' : 'translateZ(0px) scale(1)',
          boxShadow: isHovered ? '0 25px 60px rgba(0,0,0,0.14)' : '0 15px 35px rgba(0,0,0,0.07)'
        }}
      >
        {project.video ? (
          <video
            ref={videoRef}
            src={project.video}
            poster={project.poster}
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <img 
            src={project.poster} 
            alt={project.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        )}
      </div>
    </div>
  );
};

// ==========================================
// MAIN HERO SECTION
// ==========================================
export default function Hero() {
  const containerRef = useRef(null);
  const animState = useRef({ progress: 0, speed: 1 });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const ORBIT_DURATION = 36000;

  useEffect(() => {
    let reqId;
    let lastTime = performance.now();

    const render = (time) => {
      const dt = time - lastTime;
      lastTime = time;

      animState.current.progress += (dt / ORBIT_DURATION) * animState.current.speed;
      if (animState.current.progress > 1) animState.current.progress -= 1;

      const cards = containerRef.current.querySelectorAll('.portfolio-orbit-card');
      const total = cards.length; 

      cards.forEach((card, i) => {
        let p = (animState.current.progress + (i / total)) % 1;
        let v = (p - 0.5) * total;
        const absV = Math.abs(v);
        
        // --- POSITION ---
        const x = v * 220; 
        const y = Math.pow(absV, 2) * 5; 

        // --- FISHEYE & PERSPECTIVE SPEC ---
        // Center: rotZ(0), rotY(0), scale(1)
        // Outer: rotZ(9), rotY(18), scale(0.93), scaleX(1.14)
        const rotateZ = v * 3;
        const rotateY = v * 6;
        
        const overallScale = 1.0 - (absV * 0.023); // 1.0 -> ~0.93
        const scaleX = 1.0 + (Math.pow(absV, 2) * 0.015); // 1.0 -> ~1.14

        // --- DEPTH HIERARCHY ---
        let opacity = 1;
        let zIndex = 10;
        
        if (absV < 0.5) {
          zIndex = 10;
        } else if (absV < 1.5) {
          zIndex = 8;
        } else if (absV < 2.5) {
          zIndex = 6;
        } else if (absV < 3.5) {
          zIndex = 4;
        } else {
          // Fade hidden cards
          opacity = Math.max(0, 1 - (absV - 3.5));
          zIndex = 1;
        }

        const isHovered = card.classList.contains('is-hovered');
        
        // Combine the fisheye scaleX with the overall scale
        card.style.transform = `translate3d(${x}px, ${y}px, 0px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${overallScale}) scaleX(${scaleX})`;
        card.style.opacity = opacity;
        card.style.zIndex = isHovered ? 20 : zIndex;

        if (!isHovered) {
          const inner = card.querySelector('.orbit-card-inner');
          if (inner) {
            inner.style.boxShadow = absV < 0.5 ? '0 20px 50px rgba(0,0,0,0.10)' : '0 15px 35px rgba(0,0,0,0.07)';
          }
        }

        const vid = card.querySelector('video');
        if (vid) {
          if (opacity < 0.1) {
            if (!vid.paused) vid.pause();
          } else {
            if (vid.paused) vid.play().catch(()=>{});
          }
        }
      });

      reqId = requestAnimationFrame(render);
    };

    reqId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(reqId);
  }, []);

  return (
    <section 
      style={{
        minHeight: '100svh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#F7F5F2',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Naturally centers everything within viewport
        paddingTop: '80px', // Breathing room below Navbar
        paddingBottom: '40px'
      }}
    >
      {/* AMBIENT BACKGROUND LIGHTING */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: `
          radial-gradient(circle at 50% 60%, rgba(255, 190, 150, 0.22), transparent 45%),
          radial-gradient(circle at 20% 50%, rgba(170, 205, 255, 0.16), transparent 40%),
          radial-gradient(circle at 80% 45%, rgba(210, 180, 255, 0.14), transparent 40%)
        `
      }} />

      {/* 1. SEPARATE TEXT LAYER (Standard flow, guarantees NO overlap) */}
      <div 
        className="hero-content" 
        style={{ 
          position: 'relative', 
          zIndex: 20, 
          textAlign: 'center',
          width: '100%',
          flexShrink: 0
        }}
      >
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#666',
          textTransform: 'uppercase',
          marginBottom: '20px'
        }}>
          BEHIND THE WORK
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(48px, 5.5vw, 88px)',
          fontWeight: 650,
          letterSpacing: '-0.045em',
          lineHeight: 0.94,
          color: '#111',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          CURIOUS WHAT I'VE BEEN<br />CREATING?
        </h1>
        
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          lineHeight: 1.45,
          color: 'rgba(20,20,20,0.60)',
          maxWidth: '650px',
          margin: '30px auto 0 auto' // 30px gap
        }}>
          Films, short-form content, graphics and visual work<br />created for creators, brands and institutions.
        </p>

        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          color: '#111',
          cursor: 'pointer',
          display: 'inline-block',
          marginTop: '28px', // 28px gap
          transition: 'opacity 0.2s ease',
          textTransform: 'uppercase'
        }}
        onMouseEnter={(e) => e.target.style.opacity = 0.6}
        onMouseLeave={(e) => e.target.style.opacity = 1}
        >
          EXPLORE THE WORK ↗
        </div>
      </div>

      {/* GAP BETWEEN CONTENT AND ORBIT */}
      <div style={{ height: '80px', flexShrink: 0 }} />

      {/* 2. DEDICATED ORBIT CONTAINER (Occupies separate vertical region) */}
      <div 
        className="hero-orbit"
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100vw',
          height: '300px',
          perspective: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {orbitProjects.map((proj, idx) => (
          <OrbitCard
            key={proj.uid}
            project={proj}
            isHovered={hoveredIndex === idx}
            onHover={() => setHoveredIndex(idx)}
            onLeave={() => setHoveredIndex(null)}
          />
        ))}
      </div>

      {/* GAP BETWEEN ORBIT AND METADATA */}
      <div style={{ height: '45px', flexShrink: 0 }} />

      {/* 3. BOTTOM METADATA (Flows naturally below orbit) */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'var(--font-heading)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        color: '#666',
        textTransform: 'uppercase',
        flexShrink: 0
      }}>
        <div style={{ flex: 1, textAlign: 'left' }}>
          FILM / SHORT-FORM / GRAPHICS / THUMBNAILS
        </div>
        
        <div style={{ flex: 1, textAlign: 'center', color: '#111' }}>
          SCROLL TO EXPLORE ↓
        </div>
        
        <div style={{ flex: 1, textAlign: 'right' }}>
          07 SELECTED WORKS
        </div>
      </div>
    </section>
  );
}
