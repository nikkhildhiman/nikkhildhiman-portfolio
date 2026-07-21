import React, { useState, useRef, useEffect } from 'react';
import { X, Play, SlidersHorizontal, CheckCircle2, Clock, Eye, Film, Sparkles, ArrowUpRight } from 'lucide-react';

export default function ProjectCaseStudyModal({ project, isOpen, onClose, onOpenBooking }) {
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const handleMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) handleMove(e.touches[0].clientX);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(17, 17, 17, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1040px',
          maxHeight: '92vh',
          backgroundColor: '#F8F8F6',
          borderRadius: '24px',
          border: '1px solid var(--card-border)',
          overflowY: 'auto',
          position: 'relative',
          padding: '40px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.25)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            backgroundColor: 'rgba(0,0,0,0.05)',
            color: 'var(--color-black)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* 01. Case Study Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-blue)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            CINEMATIC CASE STUDY // 08-PART BREAKDOWN
          </div>

          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: 'var(--color-black)', fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase' }}>
            {project.title}
          </h2>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span><strong>Client:</strong> {project.client || 'Redline Media'}</span>
            <span><strong>Role:</strong> {project.role}</span>
            <span><strong>Tools:</strong> {project.software ? project.software.join(' • ') : 'Premiere • After Effects • DaVinci'}</span>
          </div>
        </div>

        {/* 02. Video Hero Frame */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--card-border)', aspectRatio: '16/9', marginBottom: '36px', position: 'relative' }}>
          <video src={project.videoUrl} controls autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* 03. Challenge & Solution Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '36px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-black)', marginBottom: '8px', fontWeight: 800 }}>
              THE RETENTION CHALLENGE
            </h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {project.problem || 'Initial rough cuts suffered from a 42% retention drop at the 00:45 mark due to static narrative pacing.'}
            </p>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--accent-blue)', marginBottom: '8px', fontWeight: 800 }}>
              POST-PRODUCTION SOLUTION
            </h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {project.solution || 'Engineered kinetic pattern interrupts, DaVinci 35mm LUT color grading, and spatial audio risers every 3-5 seconds.'}
            </p>
          </div>
        </div>

        {/* 04. Before / After Interactive Split Drag Slider */}
        <div style={{ marginBottom: '36px' }}>
          <h4 style={{ fontSize: '1.1rem', color: 'var(--color-black)', marginBottom: '12px', fontWeight: 800 }}>
            RAW LOG VS GRADED 4K MASTER
          </h4>

          <div
            ref={sliderRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: '16px',
              overflow: 'hidden',
              userSelect: 'none',
              cursor: 'ew-resize',
              border: '1px solid var(--card-border)'
            }}
          >
            {/* Graded Image */}
            <img
              src={project.poster}
              alt="Graded Master"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Flat Log Image */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: `${sliderPos}%`,
                overflow: 'hidden',
                borderRight: '3px solid #5B8CFF'
              }}
            >
              <img
                src={project.poster}
                alt="Flat Log"
                style={{
                  width: sliderRef.current ? `${sliderRef.current.getBoundingClientRect().width}px` : '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(60%) contrast(70%) brightness(110%)'
                }}
              />
            </div>

            {/* Badges */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'var(--color-black)', color: '#ffffff', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
              FLAT LOG CAM
            </div>

            <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'var(--accent-blue)', color: '#ffffff', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
              4K MASTER GRADE
            </div>
          </div>
        </div>

        {/* 05. Measured Outcome & CTA */}
        <div style={{ backgroundColor: 'var(--color-black)', color: '#ffffff', padding: '32px', borderRadius: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-blue)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            MEASURABLE CAMPAIGN OUTCOME
          </span>

          <h3 style={{ fontSize: '1.8rem', color: '#ffffff', fontWeight: 800, marginBottom: '20px' }}>
            {project.outcome || '3.4M Organic Views • +450% Subscriber Conversion'}
          </h3>

          <button className="btn-lime" onClick={() => { onClose(); onOpenBooking(); }} style={{ borderRadius: '9999px', padding: '14px 32px' }}>
            <span>Book a Similar Project Strategy Session</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
