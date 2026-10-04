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

// Use 9 cards to fill the wide cinematic lens and ensure smooth edge recycling
export const orbitProjects = Array.from({ length: 9 }).map((_, i) => ({
  ...baseProjects[i % baseProjects.length],
  uid: `orb-${i}`,
}));

// ==========================================
// ORBIT CARD COMPONENT
// ==========================================
const OrbitCard = ({ project, transformData, isHovered, onHover, onLeave }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (transformData.opacity > 0.1) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [transformData.opacity]);

  const finalZIndex = isHovered ? 60 : transformData.zIndex;
  const innerBlur = isHovered ? 0 : transformData.blur;
  
  const shadow = isHovered 
    ? '0 18px 40px rgba(0,0,0,0.25)' 
    : (transformData.isCenter ? '0 12px 30px rgba(0,0,0,0.12)' : '0 6px 20px rgba(0,0,0,0.08)');

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '164px',
        height: '221px',
        marginTop: '-110.5px', // Half of height
        marginLeft: '-82px', // Half of width
        cursor: 'pointer',
        zIndex: finalZIndex,
        
        // OUTER WRAPPER: Pure mathematical 60fps continuous animation.
        // NO CSS TRANSITIONS HERE. This stops the blur lag and prevents 
        // ghost cards from flying across the screen when they recycle/wrap.
        willChange: 'transform, opacity, filter',
        transformOrigin: 'center center',
        transform: `translate3d(${transformData.x}px, ${transformData.y}px, ${transformData.z}px) rotateZ(${transformData.rotZ}deg) rotateY(${transformData.rotY}deg) scale(${transformData.scale})`,
        opacity: transformData.opacity,
        filter: `blur(${innerBlur}px)`,
      }}
    >
      {/* INNER WRAPPER: Handles the physical hover lift with CSS transitions */}
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '18px',
        backgroundColor: '#111', 
        boxShadow: shadow,
        overflow: 'hidden',
        willChange: 'transform, box-shadow',
        transition: 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 450ms cubic-bezier(0.16, 1, 0.3, 1)',
        // Hover: Lift from the physical deck +50px Z, -10px Y, scale 1.04
        transform: isHovered ? `translate3d(0, -10px, 50px) scale(1.04)` : `translate3d(0, 0, 0) scale(1)`,
      }}>
        {/* 100% OPACITY CRISP MEDIA */}
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
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const stageRef = useRef(null);
  const [timeProgress, setTimeProgress] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Continuous linear left-to-right orbit engine
  useEffect(() => {
    let reqId;
    let startTime = performance.now();
    
    // Smooth cinematic morphing duration (24 seconds)
    const DURATION = 24000;

    const render = (now) => {
      const elapsed = now - startTime;
      const progress = (elapsed / DURATION) % 1;
      setTimeProgress(progress);
      reqId = requestAnimationFrame(render);
    };

    reqId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(reqId);
  }, []);

  const getCardTransforms = () => {
    const total = orbitProjects.length;
    
    return orbitProjects.map((proj, idx) => {
      // p tracks infinite left-to-right movement
      let p = (timeProgress + (idx / total)) % 1;
      let v = (p - 0.5) * total; 
      
      // Normalize position (-1 is extreme left, +1 is extreme right)
      const xNormal = v / 3.0;
      const absX = Math.abs(xNormal);

      // Neighbor separation on hover
      let neighborOffset = 0;
      if (hoveredIndex !== null && hoveredIndex !== idx) {
        let diff = idx - hoveredIndex;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        if (Math.abs(diff) < 1.8) {
          neighborOffset = Math.sign(diff) * 8; 
        }
      }

      // --- PREMIUM CINEMATIC LENS GEOMETRY (SCALED DOWN ADDITIONAL 10%) ---
      
      const centerSwell = Math.exp(-(absX * absX) * 14);

      // --- SMOOTH CORNER ENTRY / EXIT ANIMATION ---
      let opacity = 1;
      let edgeShrink = 1;
      let edgeZ = 0;
      let edgeBlur = 0;
      
      if (absX > 1.15) {
        // Exit progress goes from 0 to 1 as the card moves from 1.15 to 1.45
        const exitProgress = Math.min(1, (absX - 1.15) * 3.33); 
        
        opacity = 1 - exitProgress;
        edgeShrink = 1 - (exitProgress * 0.4); 
        edgeZ = -exitProgress * 180; // Plunges backward 
        edgeBlur = exitProgress * 12; // Smoothly blurs out to 12px
      }

      // X: Fluid repulsion.
      const baseSpread = absX * 277;
      const centerRepulsion = 122 * (1 - Math.exp(-absX * 4.5));
      const x = Math.sign(xNormal) * (baseSpread + centerRepulsion) + neighborOffset;
      
      // Y: Morphing curve (U -> ∩ -> U). 
      const yMorph = Math.sin(timeProgress * Math.PI * 2); 
      const y = yMorph * 50 * Math.pow(absX, 1.7);
      
      // Z: Deep lens curve
      const z = -113 * Math.pow(absX, 1.6) + (centerSwell * 9) + edgeZ;
      
      // RotateY: Fisheye stretch
      const rotY = -xNormal * 42; 
      
      // RotateZ: Slight banking
      const rotZ = xNormal * 4;

      // Scale: Center card swells by +30%
      const scaleBase = (0.98 - (absX * 0.05) + (centerSwell * 0.32)) * edgeShrink;

      // Depth hierarchy
      let zIndex = 10;
      if (absX < 0.25) zIndex = 50;
      else if (absX < 0.6) zIndex = 40;
      else if (absX < 1.0) zIndex = 30;
      else zIndex = 20;

      return {
        x, y, z, rotY, rotZ, scale: scaleBase, opacity, blur: edgeBlur, zIndex, isCenter: absX < 0.25
      };
    });
  };

  const transforms = getCardTransforms();

  return (
    <section 
      style={{
        minHeight: '100svh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#F7F5F2', // Pure clean background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '110px', 
        paddingBottom: '40px'
      }}
    >
      {/* 1. SEPARATE TEXT LAYER */}
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
          marginBottom: '20px',
          visibility: 'hidden'
        }}>
          &nbsp;
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
          CURIOUS WHAT I'VE BEEN CREATING?
        </h1>

        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          color: '#111',
          cursor: 'pointer',
          display: 'inline-block',
          marginTop: '24px',
          transition: 'opacity 0.2s ease',
          textTransform: 'uppercase'
        }}
        onMouseEnter={(e) => e.target.style.opacity = 0.6}
        onMouseLeave={(e) => e.target.style.opacity = 1}
        >
          EXPLORE THE WORK ↗
        </div>
      </div>

      {/* COMPACT GAP */}
      <div style={{ height: '40px', flexShrink: 0 }} />

      {/* 2. CINEMATIC 3D LENS CONTAINER */}
      <div 
        className="hero-orbit-stage"
        ref={stageRef}
        style={{
          position: 'relative',
          width: '100vw',
          height: '380px',
          perspective: '1800px', // Stronger cinematic perspective
          perspectiveOrigin: '50% 50%',
          transformStyle: 'preserve-3d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transformStyle: 'preserve-3d',
          pointerEvents: 'auto'
        }}>
          {orbitProjects.map((proj, idx) => (
            <OrbitCard
              key={proj.uid}
              project={proj}
              transformData={transforms[idx]}
              isHovered={hoveredIndex === idx}
              onHover={() => setHoveredIndex(idx)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
