import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// --- Utility: Linear Interpolation ---
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

export default function CustomCursor() {
  const cursorWrapperRef = useRef(null);
  const cursorIconRef = useRef(null);
  const cursorLabelRef = useRef(null);
  const trailsRef = useRef([]);

  const [hasPointer, setHasPointer] = useState(true);
  const [cursorState, setCursorState] = useState({ active: false, text: '', type: 'default' });

  // Physics State
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const vel = useRef({ x: 0, y: 0 });
  
  // Magnetic Cache
  const magneticCache = useRef([]);

  // Trail state
  const trailPositions = useRef(Array.from({ length: 6 }, () => ({ x: -100, y: -100 })));

  useEffect(() => {
    // 1. Accessibility Check
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHasPointer(false);
      return;
    }

    let rafId;
    let isHoveringMagnetic = false;
    let activeMagneticEl = null;

    // 2. Cache Magnetic Elements
    const updateMagneticCache = () => {
      const elements = document.querySelectorAll('.magnetic');
      magneticCache.current = Array.from(elements).map(el => {
        const rect = el.getBoundingClientRect();
        return {
          el,
          rect: {
            top: rect.top + window.scrollY, // Absolute document position
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
            centerX: rect.left + window.scrollX + rect.width / 2,
            centerY: rect.top + window.scrollY + rect.height / 2
          }
        };
      });
    };

    updateMagneticCache();
    window.addEventListener('resize', updateMagneticCache);
    // Observe DOM mutations to refresh cache (lazy simple version)
    const observer = new MutationObserver(updateMagneticCache);
    observer.observe(document.body, { childList: true, subtree: true });

    // 3. Event Listeners
    const handlePointerMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      const target = e.target;
      const videoHover = target.closest('.video-hover');
      const projectHover = target.closest('.project-card');
      const contactBtn = target.closest('.btn-lime');
      const dragHover = target.closest('.draggable');
      const interactiveHover = target.closest('button, a, .interactive, .magnetic');

      if (videoHover) {
        setCursorState({ active: true, text: 'PLAY', type: 'video' });
      } else if (projectHover) {
        setCursorState({ active: true, text: 'VIEW', type: 'project' });
      } else if (contactBtn) {
        setCursorState({ active: true, text: 'LET\'S TALK', type: 'contact' });
      } else if (dragHover) {
        setCursorState({ active: true, text: 'DRAG', type: 'drag' });
      } else if (interactiveHover) {
        setCursorState({ active: true, text: '', type: 'interactive' });
      } else {
        setCursorState({ active: false, text: '', type: 'default' });
      }
    };

    const handlePointerDown = () => setCursorState(prev => ({ ...prev, clicked: true }));
    const handlePointerUp = () => setCursorState(prev => ({ ...prev, clicked: false }));

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // 4. Physics Engine Loop (60FPS Target)
    const render = () => {
      // Current scroll position to offset absolute cached coordinates
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      // --- Magnetic Calculation ---
      let targetX = mouse.current.x;
      let targetY = mouse.current.y;
      
      const MAGNETIC_RADIUS = 120;
      const MAX_PULL = 16;
      let closestDist = Infinity;
      let currentMagnetic = null;

      magneticCache.current.forEach(item => {
        // Calculate dynamic screen space center
        const screenCenterX = item.rect.centerX - scrollX;
        const screenCenterY = item.rect.centerY - scrollY;
        
        const dx = mouse.current.x - screenCenterX;
        const dy = mouse.current.y - screenCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNETIC_RADIUS && dist < closestDist) {
          closestDist = dist;
          currentMagnetic = item;
        }
      });

      if (currentMagnetic) {
        if (activeMagneticEl !== currentMagnetic.el) {
          // Snap return old element
          if (activeMagneticEl) {
            gsap.to(activeMagneticEl, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
          }
          activeMagneticEl = currentMagnetic.el;
        }

        const screenCenterX = currentMagnetic.rect.centerX - scrollX;
        const screenCenterY = currentMagnetic.rect.centerY - scrollY;
        
        // Pull cursor slightly toward button center
        const pullFactor = 1 - (closestDist / MAGNETIC_RADIUS);
        targetX = lerp(mouse.current.x, screenCenterX, pullFactor * 0.5);
        targetY = lerp(mouse.current.y, screenCenterY, pullFactor * 0.5);

        // Pull button gently toward cursor
        const buttonPullX = ((mouse.current.x - screenCenterX) / MAGNETIC_RADIUS) * MAX_PULL;
        const buttonPullY = ((mouse.current.y - screenCenterY) / MAGNETIC_RADIUS) * MAX_PULL;
        
        gsap.to(activeMagneticEl, {
          x: buttonPullX,
          y: buttonPullY,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        if (activeMagneticEl) {
          gsap.to(activeMagneticEl, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
          activeMagneticEl = null;
        }
      }

      // --- Cursor Physics ---
      const prevX = pos.current.x;
      const prevY = pos.current.y;
      
      // Smooth follow (Premium floating easing 0.15)
      pos.current.x = lerp(pos.current.x, targetX, 0.15);
      pos.current.y = lerp(pos.current.y, targetY, 0.15);
      
      // Calculate Velocity for Rotation
      vel.current.x = pos.current.x - prevX;
      vel.current.y = pos.current.y - prevY;
      
      // Rotation: Leans into movement, max 3 degrees
      const rotation = Math.max(-3, Math.min(3, vel.current.x * 0.15));

      // Apply transforms directly for zero layout shift
      if (cursorWrapperRef.current) {
        cursorWrapperRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      if (cursorIconRef.current) {
        cursorIconRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      }

      // --- Trail Physics ---
      let leadX = pos.current.x;
      let leadY = pos.current.y;
      
      trailPositions.current.forEach((pt, index) => {
        pt.x = lerp(pt.x, leadX, 0.3);
        pt.y = lerp(pt.y, leadY, 0.3);
        leadX = pt.x;
        leadY = pt.y;
        
        const trailEl = trailsRef.current[index];
        if (trailEl) {
          trailEl.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;
          // Trail only visible when moving fast enough
          const speed = Math.abs(vel.current.x) + Math.abs(vel.current.y);
          trailEl.style.opacity = speed > 2 ? (0.08 * (1 - index / 6)) : 0;
        }
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', updateMagneticCache);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!hasPointer) return null;

  // Determine scaling based on state
  let iconScale = 1; // Default 32px
  if (cursorState.clicked) iconScale = 28 / 32;
  else if (cursorState.active || cursorState.text) iconScale = 40 / 32;
  
  // Drag state stretches horizontally slightly
  const stretchX = cursorState.type === 'drag' ? 1.15 : 1;

  return (
    <>
      {/* 1. Trailing Particles */}
      {trailPositions.current.map((_, i) => (
        <div
          key={i}
          ref={el => trailsRef.current[i] = el}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#111111',
            pointerEvents: 'none',
            zIndex: 9998,
            marginTop: '-3px',
            marginLeft: '-3px',
            opacity: 0,
            transition: 'opacity 0.2s ease-out'
          }}
        />
      ))}

      {/* 2. Main Cursor Wrapper */}
      <div 
        ref={cursorWrapperRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform'
        }}
      >
        
        {/* The SVG Triangle Icon */}
        <div
          ref={cursorIconRef}
          style={{
            position: 'absolute',
            width: '32px',
            height: '32px',
            color: '#111111', // Solid black-grey
            transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease',
            transform: `translate(-50%, -50%) scale(${iconScale * stretchX}, ${iconScale})`
          }}
        >
          {/* Custom Sleek Arrowhead SVG */}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="#FFFFFF" strokeWidth="1.2" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.15))' }}>
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L5.5 3.21z" />
          </svg>
        </div>

        {/* 3. Frosted Glass Contextual Label (Normal Blend Mode) */}
        <div
          ref={cursorLabelRef}
          style={{
            position: 'absolute',
            left: '24px', // Offset from the cursor
            top: '-50%',
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
            padding: '6px 14px',
            borderRadius: '9999px',
            color: '#111111',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            opacity: cursorState.text ? 1 : 0,
            transform: cursorState.text ? 'scale(1) translateY(-50%)' : 'scale(0.8) translateY(-50%)',
            transformOrigin: 'left center',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {cursorState.text}
        </div>

      </div>
    </>
  );
}
