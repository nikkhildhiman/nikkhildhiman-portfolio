import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

const CREATION_CATEGORIES = [
  {
    num: '01',
    title: 'Commercial Films',
    desc: 'High-velocity 4K commercial films engineered to drive direct customer acquisition.',
    image: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=2070&auto=format&fit=crop',
    action: 'work'
  },
  {
    num: '02',
    title: '9:16 Viral Shorts',
    desc: 'Short-form content for TikTok and Reels with aggressive pattern interrupts.',
    image: 'https://images.unsplash.com/photo-1596726268958-38cbcd577a79?q=80&w=1964&auto=format&fit=crop',
    action: 'reels'
  },
  {
    num: '03',
    title: 'Thumbnails & Design',
    desc: '3D lighting cutouts and psychological click drivers built to scale your CTR.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop',
    action: 'thumbnails'
  }
];

export default function ServicesSection({ onOpenBooking, onNavigate }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    // Auto-cycle the background image on mobile/tablet since the cards don't require hover
    const interval = setInterval(() => {
      if (window.innerWidth <= 1024) {
        setActiveIdx((prev) => (prev + 1) % CREATION_CATEGORIES.length);
      }
    }, 2000); // 2 seconds per image

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="services" style={{ backgroundColor: 'var(--color-surface)', paddingTop: '120px', paddingBottom: '120px', position: 'relative' }}>
      
      <div className="container">
        
        {/* Clean, Legible Header - Centered */}
        <div style={{ marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
            Studio Capabilities
          </div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--color-black)', textTransform: 'uppercase', margin: 0, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.02em' }}>
            WHAT WE <span style={{ color: 'var(--text-muted)' }}>CREATE</span>
          </h2>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }} className="services-layout">
          
          {/* Interactive List */}
          {CREATION_CATEGORIES.map((cat, idx) => {
            const isActive = activeIdx === idx;
            
            return (
              <div 
                key={idx}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => {
                  if (onNavigate && cat.action) {
                    onNavigate(cat.action);
                  }
                }}
                className="magnetic service-item" // Custom cursor hook
                style={{
                  padding: '32px 40px',
                  borderRadius: '16px',
                  backgroundColor: isActive ? 'var(--bg-main)' : 'transparent',
                  boxShadow: isActive ? '0 12px 24px rgba(0,0,0,0.05)' : 'none',
                  border: isActive ? '1px solid var(--glass-border)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '24px',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: isActive ? 1 : 0.6,
                  transform: isActive ? 'translateX(12px)' : 'translateX(0)'
                }}
              >
                <span className="service-num" style={{ 
                  fontSize: '1.2rem', 
                  fontFamily: 'var(--font-heading)', 
                  fontWeight: 700, 
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
                  marginTop: '4px' // align with heading
                }}>
                  {cat.num}
                </span>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', 
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    color: 'var(--color-black)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2
                  }}>
                    {cat.title}
                  </h3>
                  
                  {/* Smooth Expandable Description */}
                  <div className="service-desc" style={{
                    height: isActive ? 'auto' : 0,
                    overflow: 'hidden',
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    marginTop: isActive ? '12px' : 0
                  }}>
                    <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '500px', lineHeight: 1.6 }}>
                      {cat.desc}
                    </p>
                  </div>
                </div>

                {/* Clean Start Project Arrow */}
                <div 
                  className="arrow-btn"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (onNavigate && cat.action) {
                      onNavigate(cat.action);
                    }
                  }}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--accent-blue)' : 'var(--bg-main)',
                    border: isActive ? 'none' : '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    transform: isActive ? 'scale(1)' : 'scale(0.8)',
                    opacity: isActive ? 1 : 0,
                    flexShrink: 0
                  }}
                >
                  <ArrowUpRight size={20} color={isActive ? "#fff" : "var(--color-black)"} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .service-item {
            padding: 16px !important;
            gap: 12px !important;
            transform: none !important;
            border-radius: 12px !important;
            opacity: 1 !important;
          }
          .service-item h3 {
            font-size: 1.3rem !important;
          }
          .service-item p {
            font-size: 0.95rem !important;
          }
          .service-desc {
            height: auto !important;
            opacity: 1 !important;
            margin-top: 8px !important;
          }
          .service-num {
            color: var(--accent-blue) !important;
          }
          .service-item .arrow-btn {
            width: 36px !important;
            height: 36px !important;
            opacity: 1 !important;
            transform: scale(1) !important;
            background-color: var(--bg-main) !important;
            border: 1px solid var(--glass-border) !important;
          }
          .service-item .arrow-btn svg {
            width: 16px !important;
            height: 16px !important;
            stroke: var(--color-black) !important;
          }
        }
      `}</style>
    </section>
  );
}
