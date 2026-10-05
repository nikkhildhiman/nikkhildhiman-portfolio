import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: '01',
    title: 'VIDEO / FILMS',
    desc: 'Commercial films, event films & cinematic videos',
    image: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=2070&auto=format&fit=crop',
    action: 'work'
  },
  {
    id: '02',
    title: 'REELS & SHORT-FORM',
    desc: 'Cinematic reels, social content & short-form films',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
    action: 'reels'
  },
  {
    id: '03',
    title: 'THUMBNAILS',
    desc: 'YouTube thumbnails, podcast covers & CTR-focused design',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop',
    action: 'thumbnails'
  }
];

export default function ServicesSection({ onNavigate }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.4 } // Trigger when 40% of the section is in view
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="services" 
      ref={sectionRef}
      style={{ 
        backgroundColor: '#0b0b0d', 
        minHeight: '100svh',
        width: '100vw',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 0',
        overflow: 'hidden'
      }}
    >
      {/* Background Image Previews Removed as per user request */}

      <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div className="services-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '80px',
          alignItems: 'flex-start'
        }}>
          
          {/* Left Column: Typography & Context */}
          <div className="services-sticky-col" style={{ position: 'sticky', top: '120px' }}>

            <h2 className="services-main-title" style={{ 
              fontSize: 'clamp(3rem, 7vw, 6rem)', 
              margin: '0 0 32px 0', 
              lineHeight: 0.85, 
              textTransform: 'uppercase', 
              letterSpacing: '-0.04em', 
              fontWeight: 800,
              fontFamily: 'var(--font-heading)'
            }}>
              <span style={{ 
                display: 'block',
                color: 'transparent',
                WebkitTextStroke: '2px var(--text-main)',
                opacity: isVisible ? 1 : 0, 
                transform: isVisible ? 'translateY(0)' : 'translateY(60px)', 
                transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)' 
              }}>
                WHAT <span style={{ fontFamily: "'Melodrama', serif", fontStyle: 'italic', WebkitTextStroke: 'none', color: 'var(--text-main)' }}>I</span>
              </span>
              <span className={isVisible ? "glitch-in-view services-create-text" : "glitch-hidden services-create-text"} style={{ 
                fontFamily: "'Melodrama', serif", 
                fontStyle: 'italic', 
                color: '#E4FF00', 
                fontWeight: 600, 
                textTransform: 'none',
                display: 'block',
                paddingLeft: '12%',
                marginTop: '-0.08em',
                fontSize: '1.15em',
              }}>
                Create
              </span>
            </h2>

          </div>

          {/* Right Column: Interactive Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '20px' }}>
            {CATEGORIES.map((cat, idx) => {
              const isHovered = hoveredIdx === idx;
              const isOtherHovered = hoveredIdx !== null && hoveredIdx !== idx;

              const baseOpacity = isOtherHovered ? 0.3 : 1;
              const targetOpacity = isVisible ? baseOpacity : 0;
              
              const baseTransform = isHovered ? 'translateX(20px)' : 'translateX(0)';
              const targetTransform = isVisible ? baseTransform : 'translateY(40px)';
              
              const delay = isVisible && hoveredIdx === null ? `${idx * 0.15 + 0.3}s` : '0s';

              return (
                <div 
                  key={cat.id}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => {
                    if (cat.action && onNavigate) onNavigate(cat.action);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '40px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: delay,
                    opacity: targetOpacity,
                    transform: targetTransform,
                  }}
                  className="service-row"
                >
                  {/* Number */}
                  <div style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: '1rem', 
                    fontWeight: 700, 
                    color: isHovered ? '#E4FF00' : 'var(--text-muted)',
                    marginRight: '40px',
                    transition: 'color 0.4s ease'
                  }}>
                    {cat.id}
                  </div>
                  
                  {/* Title & Desc */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                      fontWeight: 800,
                      margin: '0 0 8px 0',
                      color: isHovered ? '#E4FF00' : 'var(--text-main)',
                      transition: 'color 0.4s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em'
                    }}>
                      {cat.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1.1rem',
                      color: 'var(--text-muted)',
                      margin: 0,
                      transition: 'color 0.4s ease'
                    }}>
                      {cat.desc}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div style={{
                    transform: isHovered ? 'translateX(10px)' : 'translateX(0)',
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    color: isHovered ? '#E4FF00' : 'var(--text-muted)'
                  }}>
                    <ArrowRight size={28} strokeWidth={2} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <style>{`
        .glitch-hidden {
          opacity: 0;
        }
        .glitch-in-view {
          animation: pixel-glitch 1.5s steps(1) both;
          animation-delay: 0.15s;
        }

        @keyframes pixel-glitch {
          0% { opacity: 0; transform: translateY(60px); }
          4% { opacity: 1; transform: translate(-20px, 15px) skewX(50deg) scale(1.1); clip-path: inset(10% 0 80% 0); text-shadow: 15px 0 #ff003c, -15px 0 #00e5ff; }
          8% { opacity: 1; transform: translate(20px, -10px) skewX(-40deg) scale(0.9); clip-path: inset(80% 0 10% 0); text-shadow: -15px 0 #ff003c, 15px 0 #00e5ff; }
          12% { opacity: 1; transform: translate(-10px, 20px) skewX(20deg) scale(1.05); clip-path: inset(30% 0 50% 0); text-shadow: 8px 0 #E4FF00, -8px 0 #ff003c; }
          16% { opacity: 1; transform: translate(15px, -15px) skewX(-30deg) scale(0.95); clip-path: inset(50% 0 20% 0); text-shadow: -10px 0 #E4FF00, 10px 0 #00e5ff; }
          20% { opacity: 1; transform: translate(-5px, 5px) skewX(10deg); clip-path: inset(20% 0 70% 0); text-shadow: 10px 0 #ff003c, -10px 0 #00e5ff; }
          24% { opacity: 1; transform: translate(5px, -5px) skewX(-10deg); clip-path: inset(70% 0 20% 0); text-shadow: -5px 0 #E4FF00, 5px 0 #ff003c; }
          28% { opacity: 1; transform: translate(-10px, 10px) skewX(30deg); clip-path: inset(40% 0 40% 0); text-shadow: 10px 0 #00e5ff, -10px 0 #E4FF00; }
          32% { opacity: 1; transform: translate(10px, -10px) skewX(-20deg); clip-path: inset(10% 0 10% 0); text-shadow: -10px 0 #ff003c, 10px 0 #00e5ff; }
          36% { opacity: 1; transform: translate(0, 0) skewX(0); clip-path: inset(0 0 0 0); text-shadow: none; filter: hue-rotate(90deg); }
          40% { opacity: 1; transform: translateY(0) rotate(0deg); clip-path: inset(0 0 0 0); filter: hue-rotate(0deg); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg); clip-path: inset(0 0 0 0); }
        }

        @media (max-width: 900px) {
          .services-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .services-sticky-col {
            position: relative !important;
            top: 0 !important;
          }
          .services-main-title {
            font-size: clamp(4rem, 14vw, 5.5rem) !important;
          }
          .services-create-text {
            padding-left: 0 !important;
            margin-top: -0.08em !important;
          }
          .service-row {
            padding: 24px 0 !important;
            transform: none !important;
          }
          .service-row:hover {
            transform: translateX(10px) !important;
          }
        }
      `}</style>
    </section>
  );
}
