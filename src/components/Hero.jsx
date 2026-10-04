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
        transform: `translate3d(${transformData.x}px, ${transformData.y}px, ${transformData.z}px) rotateX(${transformData.rotX || 0}deg) rotateZ(${transformData.rotZ}deg) rotateY(${transformData.rotY}deg) scale(${transformData.scale})`,
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
  const [elapsed, setElapsed] = useState(0);
  const [skipIntro, setSkipIntro] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSkipIntro(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Continuous unified clock for both the Intro sequence and the infinite orbit
  useEffect(() => {
    let reqId;
    let startTime = performance.now();
    
    const render = (now) => {
      setElapsed(now - startTime);
      reqId = requestAnimationFrame(render);
    };

    reqId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(reqId);
  }, []);

  // Time & Sequence Management
  const DURATION = 24000;
  const effectiveElapsed = skipIntro ? 99999 : elapsed;
  const timeProgress = (effectiveElapsed / DURATION) % 1;
  const isIntroActive = effectiveElapsed < 4000; // Extended to allow a long, luxurious settling tail

  // Math Utilities
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  // Premium smooth easing (equivalent to a deep cubic-bezier)
  const premiumEase = (t) => 1 - Math.pow(1 - t, 3.8);
  const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
  const lerp = (start, end, t) => start * (1 - t) + end * t;

  // Phase 7: Global Stage Settle Animation (Now extended for a buttery smooth landing)
  const settleRaw = clamp((effectiveElapsed - 2500) / 1200, 0, 1);
  const settleEase = premiumEase(settleRaw);
  const stageOffset = 1 - settleEase;
  
  const stageY = stageOffset * 8;
  const stageRotX = stageOffset * 1;
  const stageZ = stageOffset * 10;

  const getCardTransforms = () => {
    const total = orbitProjects.length;
    
    return orbitProjects.map((proj, idx) => {
      // 1. Calculate Continuous Engine Values
      let p = (timeProgress + (idx / total)) % 1;
      let v = (p - 0.5) * total; 
      
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

      // --- PREMIUM CINEMATIC LENS GEOMETRY ---
      const centerSwell = Math.exp(-(absX * absX) * 14);

      let edgeOpacity = 1;
      let edgeShrink = 1;
      let edgeZ = 0;
      let edgeBlur = 0;
      
      if (absX > 1.15) {
        const exitProgress = Math.min(1, (absX - 1.15) * 3.33); 
        edgeOpacity = 1 - exitProgress;
        edgeShrink = 1 - (exitProgress * 0.4); 
        edgeZ = -exitProgress * 180; 
        edgeBlur = exitProgress * 12; 
      }

      // Final Target Positions (from the continuous engine)
      const baseSpread = absX * 277;
      const centerRepulsion = 122 * (1 - Math.exp(-absX * 4.5));
      const finalX = Math.sign(xNormal) * (baseSpread + centerRepulsion) + neighborOffset;
      
      const yMorph = Math.sin(timeProgress * Math.PI * 2); 
      const finalY = yMorph * 50 * Math.pow(absX, 1.7);
      
      const finalZ = -113 * Math.pow(absX, 1.6) + (centerSwell * 9) + edgeZ;
      const finalRotX = 0; // Final individual cards have no X rotation
      const finalRotY = -xNormal * 42; 
      const finalRotZ = xNormal * 4;
      const finalScaleBase = (0.98 - (absX * 0.05) + (centerSwell * 0.32)) * edgeShrink;

      let finalZIndex = 10;
      if (absX < 0.25) finalZIndex = 50;
      else if (absX < 0.6) finalZIndex = 40;
      else if (absX < 1.0) finalZIndex = 30;
      else finalZIndex = 20;


      // --- INTRO DECK REVEAL SEQUENCE ---
      const d = Math.abs(idx - 4);
      const s = Math.sign(idx - 4);
      const order = d === 0 ? 0 : (d * 2 - (s < 0 ? 1 : 0));

      // Slightly wider staggering for better readability
      const delay = order === 0 ? 0 : 700 + (order - 1) * 180;
      const introDuration = 1100; // Ultra smooth, luxurious 1100ms glide
      
      const globalFadeRaw = clamp(effectiveElapsed / 800, 0, 1);
      const globalFadeEase = easeInOutSine(globalFadeRaw); // Soft S-curve fade
      
      const pRaw = clamp((effectiveElapsed - delay) / introDuration, 0, 1);
      const pEase = premiumEase(pRaw);

      // Stacked Initial State (Dramatic 3D fly-in from the bottom)
      const stackedX = 0;
      const stackedY = 400 * (1 - globalFadeEase); // Flies up from 400px below
      const stackedZ = -120 - (order * 6) - (200 * (1 - globalFadeEase)); // Starts deeper and physically pushes forward
      const stackedRotX = 40 * (1 - globalFadeEase); // Pitched backward as it flies up
      const stackedRotY = 0;
      const stackedRotZ = 15 * (1 - globalFadeEase); // Thrown with a slight 15-degree spin
      
      // Interpolate to final positions
      // Phase 5: The physical fan push arc
      // CRITICAL: We use pRaw (linear time) for the sine wave so the Z-axis push doesn't artificially accelerate, resulting in buttery smooth physics
      const zArc = Math.sin(pRaw * Math.PI) * 45; 
      
      const currentX = lerp(stackedX, finalX, pEase);
      const currentY = lerp(stackedY, finalY, pEase);
      const currentZ = lerp(stackedZ, finalZ, pEase) + (order > 0 ? zArc : 0);
      const currentRotX = lerp(stackedRotX, finalRotX, pEase);
      const currentRotY = lerp(stackedRotY, finalRotY, pEase);
      const currentRotZ = lerp(stackedRotZ, finalRotZ, pEase);
      const currentScale = lerp(0.94, finalScaleBase, pEase);
      
      // Phase 2: No fade in! The deck is fully solid and flies directly up from out of frame
      const currentOpacity = 1 * edgeOpacity;
      
      // Dynamic Motion Blur: High blur during the fast initial throw, sharpening as it lands
      const introMotionBlur = 10 * Math.pow(1 - globalFadeEase, 2);

      return {
        x: currentX, 
        y: currentY, 
        z: currentZ, 
        rotX: currentRotX,
        rotY: currentRotY, 
        rotZ: currentRotZ, 
        scale: currentScale, 
        opacity: currentOpacity, 
        blur: edgeBlur + introMotionBlur, 
        zIndex: finalZIndex, 
        isCenter: absX < 0.25
      };
    });
  };

  const transforms = getCardTransforms();

  // --- TYPOGRAPHY INTRO ANIMATIONS ---
  // Synchronized precisely with the mathematical frame loop
  const textFadeEase = easeInOutSine(clamp(effectiveElapsed / 1200, 0, 1));
  const subFadeEase = easeInOutSine(clamp((effectiveElapsed - 300) / 1200, 0, 1));

  return (
    <section 
      style={{
        minHeight: '100svh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#111', // Palette: Darkest Hour
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
          color: '#E4FF00',
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
          color: '#E4FF00', // Palette: Sun Glare
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          CURIOUS WHAT I'VE BEEN CREATING?
        </h1>

        <div style={{
          display: 'inline-block',
          marginTop: '24px',
          opacity: subFadeEase,
          transform: `translateY(${20 * (1 - subFadeEase)}px)`,
          willChange: 'opacity, transform'
        }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: '#E4FF00', // Palette: Sun Glare
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => e.target.style.opacity = 0.6}
          onMouseLeave={(e) => e.target.style.opacity = 1}
          >
            EXPLORE THE WORK ↗
          </div>
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
          pointerEvents: isIntroActive ? 'none' : 'auto',
          transform: `translate3d(0, ${stageY}px, ${stageZ}px) rotateX(${stageRotX}deg)`,
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

      {/* 4. PIXEL SCROLL INDICATOR */}
      <div style={{
        marginTop: '-12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity: isIntroActive ? 0 : 1,
        transition: 'opacity 1s ease',
        transitionDelay: '3.2s', // Wait for intro to finish before showing
        zIndex: 20
      }}>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Silkscreen&display=swap');
            .pixel-scroll-text {
              font-family: 'Silkscreen', monospace;
              font-size: 9px;
              letter-spacing: 0.15em;
              color: #E4FF00;
              text-transform: uppercase;
              animation: blink 2s infinite;
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
          `}
        </style>
        <span className="pixel-scroll-text">SCROLL DOWN</span>
        <div style={{ 
          width: '1px', 
          height: '16px', 
          backgroundColor: '#E4FF00', 
          animation: 'blink 2s infinite',
          animationDelay: '0.5s' 
        }}></div>
      </div>

    </section>
  );
}
