import React, { useState, useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { THUMBNAIL_DATA } from '../data/portfolioData';

export default function ThumbnailShowcase() {
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);

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
    <section className="section-padding tile-light">
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="display-lg" style={{ marginBottom: '12px' }}>
            High-CTR Thumbnail Engine.
          </h2>
          <p className="lead" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Transforming raw vlog snapshots into high-converting Photoshop cutouts (+450% CTR boost).
          </p>
        </div>

        {/* Apple Utility Card Frame */}
        <div className="apple-card" style={{ padding: '36px' }}>
          <div className="grid-12" style={{ alignItems: 'center' }}>
            
            {/* Left: Interactive Drag Slider (Span 7) */}
            <div style={{ gridColumn: 'span 7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>BEFORE: Raw Vlog Still</span>
                <span style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>AFTER: Photoshop High-CTR Cutout</span>
              </div>

              <div
                ref={sliderRef}
                className="ba-slider-container"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onClick={(e) => handleMove(e.clientX)}
                style={{
                  position: 'relative',
                  height: '380px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  cursor: 'ew-resize',
                  border: '1px solid var(--hairline)',
                  userSelect: 'none'
                }}
              >
                <img
                  src={THUMBNAIL_DATA.beforeImg}
                  alt="Raw Frame"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: `${sliderPos}%`,
                    overflow: 'hidden',
                    borderRight: '2px solid #ffffff'
                  }}
                >
                  <img
                    src={THUMBNAIL_DATA.afterImg}
                    alt="High CTR Cutout"
                    style={{
                      width: sliderRef.current ? `${sliderRef.current.offsetWidth}px` : '100%',
                      height: '100%',
                      objectFit: 'cover',
                      maxWidth: 'none'
                    }}
                  />
                </div>

                {/* Slider Handle */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${sliderPos}%`,
                    width: '2px',
                    backgroundColor: '#ffffff',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-blue)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}
                  >
                    <SlidersHorizontal size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Metrics & Science (Span 5) */}
            <div style={{ gridColumn: 'span 5' }}>
              <div className="apple-pill-tag" style={{ marginBottom: '16px' }}>
                <span>Photoshop Masterclass</span>
              </div>

              <h3 style={{ fontSize: '1.8rem', color: 'var(--color-ink)', fontWeight: 600, marginBottom: '16px' }}>
                {THUMBNAIL_DATA.title}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {THUMBNAIL_DATA.stats.map((st, idx) => (
                  <div key={idx} style={{ backgroundColor: 'var(--canvas-parchment)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--hairline)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, fontFamily: 'var(--font-heading)', color: 'var(--primary-blue)' }}>
                      {st.value}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Every thumbnail is built on psychological click drivers: high-contrast rim lighting, exaggerated emotion cutouts, and zero clutter typography.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
