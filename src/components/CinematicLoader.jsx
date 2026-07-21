import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';

export default function CinematicLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const steps = [
    "IMPORTING ASSETS...",
    "LOADING TIMELINE TRACKS...",
    "SYNCHRONIZING AUDIO FOLEY...",
    "COLOR GRADING 4K FRAMES...",
    "EXPORT COMPLETE"
  ];

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const intervalTime = 25;
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(100, Math.round((currentStep / totalSteps) * 100));
      setProgress(nextProgress);

      const nextStepIdx = Math.min(steps.length - 1, Math.floor((nextProgress / 100) * steps.length));
      setStepIndex(nextStepIdx);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 400);
        }, 250);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#F8F8F6',
        color: '#111111',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'auto',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Subtle Noise Canvas Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        
        {/* Studio Branding Tag */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px', backgroundColor: 'rgba(0,0,0,0.04)', padding: '6px 16px', borderRadius: '9999px', border: '1px solid rgba(0,0,0,0.08)' }}>
          <Film size={16} color="#5B8CFF" />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', letterSpacing: '0.08em', color: '#111111', textTransform: 'uppercase', fontWeight: 800 }}>
            NIKHIL DHIMAN STUDIO
          </span>
        </div>

        {/* Progress % Display */}
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1,
            color: '#5B8CFF',
            marginBottom: '16px',
            letterSpacing: '-0.04em'
          }}
        >
          {progress}%
        </div>

        {/* Step Label */}
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', letterSpacing: '0.08em', color: '#6D6D6D', textTransform: 'uppercase', marginBottom: '24px', height: '24px', fontWeight: 700 }}>
          [ 0{stepIndex + 1} / 05 ] {steps[stepIndex]}
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(0,0,0,0.08)',
            borderRadius: '2px',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${progress}%`,
              backgroundColor: '#5B8CFF',
              transition: 'width 0.05s linear'
            }}
          />
        </div>

        {/* Timecode Ticks */}
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888888', fontSize: '0.7rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
          <span>00:00:00:00</span>
          <span>00:00:15:00</span>
          <span>00:00:30:00</span>
          <span>00:01:00:00</span>
        </div>

      </div>
    </div>
  );
}
