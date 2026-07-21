import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const CREATION_CATEGORIES = [
  {
    num: '01',
    title: 'Commercial Films',
    desc: 'High-velocity 4K commercial films engineered to drive direct customer acquisition.',
    image: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=2070&auto=format&fit=crop'
  },
  {
    num: '02',
    title: 'YouTube Series',
    desc: 'Retention-optimized long-form videos with zero drop-off pacing and narrative hooks.',
    image: 'https://images.unsplash.com/photo-1517409252321-ba31697eeaf6?q=80&w=2070&auto=format&fit=crop'
  },
  {
    num: '03',
    title: '9:16 Viral Shorts',
    desc: 'Short-form content for TikTok and Reels with aggressive pattern interrupts.',
    image: 'https://images.unsplash.com/photo-1596726268958-38cbcd577a79?q=80&w=1964&auto=format&fit=crop'
  },
  {
    num: '04',
    title: 'Thumbnails & Design',
    desc: '3D lighting cutouts and psychological click drivers built to scale your CTR.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop'
  }
];

export default function ServicesSection({ onOpenBooking }) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="services" style={{ backgroundColor: 'var(--color-surface)', paddingTop: '120px', paddingBottom: '120px', position: 'relative' }}>
      
      <div className="container">
        
        {/* Clean, Legible Header */}
        <div style={{ marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
            Studio Capabilities
          </div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--color-black)', textTransform: 'uppercase', margin: 0, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.02em' }}>
            WHAT WE <span style={{ color: 'var(--text-muted)' }}>CREATE</span>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '64px', flexDirection: 'row', alignItems: 'center' }} className="services-layout">
          
          {/* Left: Clean Interactive List */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {CREATION_CATEGORIES.map((cat, idx) => {
              const isActive = activeIdx === idx;
              
              return (
                <div 
                  key={idx}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className="magnetic" // Custom cursor hook
                  style={{
                    padding: '24px 32px',
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
                  <span style={{ 
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
                    <div style={{
                      height: isActive ? 'auto' : 0,
                      overflow: 'hidden',
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 0.4s ease',
                      marginTop: isActive ? '12px' : 0
                    }}>
                      <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.6 }}>
                        {cat.desc}
                      </p>
                    </div>
                  </div>

                  {/* Clean Start Project Arrow */}
                  <div 
                    onClick={(e) => { e.stopPropagation(); onOpenBooking(); }}
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
                      opacity: isActive ? 1 : 0
                    }}
                  >
                    <ArrowUpRight size={20} color={isActive ? "#fff" : "var(--color-black)"} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Elegant Visual Stage */}
          <div className="services-stage" style={{ 
            flex: 1, 
            height: '600px', 
            position: 'relative', 
            borderRadius: '24px', 
            overflow: 'hidden',
            boxShadow: '0 24px 48px rgba(0,0,0,0.08)'
          }}>
            {CREATION_CATEGORIES.map((cat, idx) => (
              <img 
                key={idx}
                src={cat.image}
                alt={cat.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: activeIdx === idx ? 1 : 0,
                  transform: activeIdx === idx ? 'scale(1)' : 'scale(1.05)',
                  transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: activeIdx === idx ? 1 : 0
                }}
              />
            ))}
            
            {/* Soft Gradient Overlay for depth, not overpowering */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 40%)',
              zIndex: 2,
              pointerEvents: 'none'
            }}></div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .services-layout {
            flex-direction: column-reverse !important;
          }
          .services-stage {
            width: 100% !important;
            height: 400px !important;
            flex: none !important;
            margin-bottom: 24px;
          }
        }
        @media (max-width: 768px) {
          .services-stage {
            height: 300px !important;
          }
        }
      `}</style>
    </section>
  );
}
