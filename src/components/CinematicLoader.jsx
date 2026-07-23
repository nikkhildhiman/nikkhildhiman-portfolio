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
    const duration = 1000; // 1 second (faster animation)
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

      {/* Ultra Minimal Preloader Content */}
      {/* (The massive 450px 3D logo from App.jsx is rendered over this screen automatically) */}
      
      {/* Minimal Progress % Display at the bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '8vh', // Keep it near the bottom away from the huge logo
          fontFamily: 'var(--font-heading)',
          fontSize: '1rem',
          fontWeight: 700,
          color: '#111111',
          letterSpacing: '0.1em'
        }}
      >
        LOADING {progress}%
      </div>
    </div>
  );
}
