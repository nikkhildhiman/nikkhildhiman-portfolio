import React, { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';

export default function PremiereTimelineBar({ activePage, onNavigate }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    // Press 'T' keyboard shortcut to toggle Premiere Timeline
    const handleKeyDown = (e) => {
      if (e.key === 't' || e.key === 'T') {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const timelineMarkers = [
    { label: 'WORK', targetId: 'work', page: 'work', pos: 15 },
    { label: 'SERVICES', targetId: 'services', page: 'process', pos: 38 },
    { label: 'ABOUT', targetId: 'about', page: 'about', pos: 78 },
    { label: 'CONTACT', targetId: 'contact', page: 'contact', pos: 100 },
  ];

  const handleMarkerClick = (marker) => {
    // 1. Try smooth scroll to element on current page
    const el = document.getElementById(marker.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // 2. Switch page using onNavigate
      onNavigate(marker.page);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '920px',
        backgroundColor: '#111111',
        color: '#ffffff',
        borderRadius: '9999px',
        padding: '10px 20px',
        zIndex: 8000,
        boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}
      className="hide-mobile"
    >
      {/* Top Scrubber Metadata */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontFamily: 'var(--font-heading)', color: '#6D6D6D' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', backgroundColor: '#5B8CFF', borderRadius: '50%', display: 'inline-block' }} />
          <span style={{ color: '#ffffff', fontWeight: 700 }}>PREMIERE PRO SCRUBBER</span>
          <span>(PRESS 'T' TO TOGGLE)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ color: '#ffffff', fontWeight: 600 }}>PLAYHEAD: <strong style={{ color: '#5B8CFF' }}>00:00:{Math.floor((scrollProgress / 100) * 60).toString().padStart(2, '0')}:12</strong></span>
          <button onClick={() => setIsVisible(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Timeline Ruler & Interactive Markers Bar */}
      <div style={{ position: 'relative', height: '24px', backgroundColor: '#222222', borderRadius: '9999px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        {/* Progress Playhead Track */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${scrollProgress}%`,
            backgroundColor: 'rgba(91, 140, 255, 0.25)',
            borderRight: '2px solid #5B8CFF',
            transition: 'width 0.1s linear'
          }}
        />

        {/* Interactive Markers */}
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px' }}>
          {timelineMarkers.map((marker) => (
            <button
              key={marker.label}
              onClick={() => handleMarkerClick(marker)}
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: 'none',
                fontFamily: 'var(--font-heading)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                padding: '2px 8px',
                cursor: 'pointer',
                zIndex: 2,
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.target.style.color = '#5B8CFF')}
              onMouseLeave={(e) => (e.target.style.color = '#ffffff')}
            >
              ♦ {marker.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
