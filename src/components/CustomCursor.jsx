import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorLabelRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  
  // Use a state to track whether device has a fine pointer (mouse)
  const [hasMouse, setHasMouse] = useState(true);

  useEffect(() => {
    // Check if device supports hover (ignores touch screens)
    if (window.matchMedia('(pointer: coarse)').matches) {
      setHasMouse(false);
      return;
    }

    const cursor = cursorRef.current;
    
    // GSAP quickTo for incredibly performant mouse tracking
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      
      // Determine if hovering over a specific interaction zone
      const videoHover = target.closest('.video-hover');
      const interactiveHover = target.closest('button, a, .interactive');

      if (videoHover) {
        setIsHovered(true);
        setCursorText('PLAY');
      } else if (interactiveHover) {
        setIsHovered(true);
        setCursorText('');
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    // Initial position fix (hide until first move)
    gsap.set(cursor, { x: -100, y: -100 });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!hasMouse) return null; // Don't render custom cursor on mobile/touch

  return (
    <>
      <div 
        ref={cursorRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-black)',
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.3s var(--ease-expo), height 0.3s var(--ease-expo), background-color 0.3s ease',
          mixBlendMode: 'difference',
          ...(isHovered && {
            width: cursorText ? '80px' : '40px',
            height: cursorText ? '80px' : '40px',
            backgroundColor: 'var(--color-black)',
            mixBlendMode: 'normal'
          })
        }}
      >
        <span 
          ref={cursorLabelRef}
          style={{
            color: 'var(--bg-main)',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            opacity: cursorText ? 1 : 0,
            transition: 'opacity 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          {cursorText}
        </span>
      </div>
      
      <style>{`
        /* Hide default cursor globally when using custom cursor */
        @media (pointer: fine) {
          body, a, button, .interactive, .video-hover {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
