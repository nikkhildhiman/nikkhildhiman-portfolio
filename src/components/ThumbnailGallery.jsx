import React from 'react';
import { THUMBNAIL_DATA } from '../data/portfolioData';

export default function ThumbnailGallery() {
  // Create an array of 12 mock thumbnails using the existing asset
  const thumbnails = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    img: THUMBNAIL_DATA.afterImg,
    title: `High-CTR Concept 0${i + 1}`
  }));

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-surface)', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-black)', margin: 0, lineHeight: 1, fontWeight: 900, textTransform: 'uppercase' }}>
            THE <span style={{ color: 'var(--color-hover)' }}>ARCHIVE</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '16px auto 0' }}>
            12 high-converting thumbnail cutouts engineered for maximum visual impact and click-through rates.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '32px' 
        }}>
          {thumbnails.map((thumb) => (
            <div 
              key={thumb.id}
              className="thumbnail-card"
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '16/9',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                e.currentTarget.querySelector('.thumbnail-overlay').style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                e.currentTarget.querySelector('.thumbnail-overlay').style.opacity = '0';
              }}
            >
              <img 
                src={thumb.img} 
                alt={thumb.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {/* Overlay on Hover */}
              <div 
                className="thumbnail-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '20px'
                }}
              >
                <div style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  {thumb.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
