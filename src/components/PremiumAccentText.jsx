import React, { useEffect, useRef, useState } from 'react';

export default function PremiumAccentText({ text = "CREATIVE" }) {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animation immediately on mount
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        zIndex: 10,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        position: 'relative',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0) scaleY(1)' : 'translateY(25px) scaleY(0.94)',
        transition: 'opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'inline-block'
      }}>
        
        {/* The Base Stretch Shadows to simulate the "liquid stretch downward" */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          textAlign: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(80px, 15vw, 240px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: '#B5462A',
          transformOrigin: 'top center',
          transform: mounted ? 'scaleY(1.4) translateY(2%)' : 'scaleY(1) translateY(0)',
          transition: 'transform 2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          opacity: 0.15,
          filter: 'blur(8px)',
          maskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)',
        }}>
          {text}
        </div>
        
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          textAlign: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(80px, 15vw, 240px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: '#B5462A',
          transformOrigin: 'top center',
          transform: mounted ? 'scaleY(1.15) translateY(1%)' : 'scaleY(1) translateY(0)',
          transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          opacity: 0.3,
          filter: 'blur(3px)',
          maskImage: 'linear-gradient(to bottom, transparent 40%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 40%, black 100%)',
        }}>
          {text}
        </div>

        {/* Main Crisp Text */}
        <div style={{
          position: 'relative',
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(80px, 15vw, 240px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: '#B5462A',
          textShadow: `
            0px 20px 40px rgba(181, 70, 42, 0.2), 
            -1px 0px 1px rgba(0, 255, 255, 0.15), 
            1px 0px 1px rgba(255, 0, 0, 0.15)
          `,
          zIndex: 2,
        }}>
          {text}
        </div>
        
        {/* Grain Texture Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          opacity: 0.04,
          mixBlendMode: 'overlay',
          zIndex: 3,
          pointerEvents: 'none',
        }}></div>
      </div>
    </div>
  );
}
