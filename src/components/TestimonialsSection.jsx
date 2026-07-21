import React from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS_DATA, CLIENT_LOGOS } from '../data/portfolioData';

// We duplicate the data arrays to create a seamless infinite loop
const MARQUEE_CARDS = [...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA];
const MARQUEE_LOGOS = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ 
      backgroundColor: 'var(--color-surface)', 
      paddingTop: '120px', 
      paddingBottom: '120px',
      overflow: 'hidden',
      borderTop: '2px solid var(--color-black)'
    }}>
      
      {/* Section Header */}
      <div className="container" style={{ marginBottom: '80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--color-black)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>
            [ PROVEN TRACK RECORD ]
          </div>
          <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--color-black)', textTransform: 'uppercase', margin: 0, lineHeight: 1, fontWeight: 900, letterSpacing: '-0.03em' }}>
            CLIENT <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--color-black)' }}>TRUST</span>
          </h2>
        </div>
      </div>

      {/* Marquee 1: Testimonial Cards (Scrolling Left) */}
      <div className="marquee-container" style={{ marginBottom: '40px' }}>
        <div className="marquee-track marquee-left">
          {MARQUEE_CARDS.map((t, idx) => (
            <div
              key={idx}
              className="testimonial-card"
              style={{
                width: 'min(80vw, 450px)',
                backgroundColor: '#ffffff',
                border: '2px solid var(--color-black)',
                borderRadius: '24px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexShrink: 0,
                boxShadow: '12px 12px 0 rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="var(--color-black)" color="var(--color-black)" />
                  ))}
                </div>

                <p style={{ fontSize: '1.25rem', color: 'var(--color-black)', fontStyle: 'italic', marginBottom: '40px', lineHeight: 1.5, fontWeight: 500 }}>
                  "{t.quote}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '2px solid var(--color-black)', paddingTop: '24px' }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-black)' }}
                />
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-black)', textTransform: 'uppercase' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee 2: Client Logos (Scrolling Right) */}
      <div className="marquee-container" style={{ borderTop: '2px solid var(--color-black)', borderBottom: '2px solid var(--color-black)', padding: '32px 0', backgroundColor: 'var(--color-black)' }}>
        <div className="marquee-track marquee-right">
          {MARQUEE_LOGOS.map((c, i) => (
            <div 
              key={i} 
              style={{ 
                fontFamily: 'var(--font-heading)', 
                fontWeight: 900, 
                fontSize: 'clamp(2rem, 4vw, 3rem)', 
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                flexShrink: 0,
                padding: '0 40px',
                display: 'flex',
                alignItems: 'center',
                gap: '80px'
              }}
            >
              {c.name}
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.5rem' }}>+</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .marquee-container {
          width: 100vw;
          overflow: hidden;
          position: relative;
          display: flex;
        }

        .marquee-track {
          display: flex;
          gap: 40px;
          padding: 0 20px;
          width: max-content;
        }

        .marquee-left {
          animation: marqueeLeft 40s linear infinite;
        }

        .marquee-right {
          animation: marqueeRight 30s linear infinite;
        }

        /* Pause animations on hover so users can read */
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }

        .testimonial-card:hover {
          transform: translateY(-8px);
          box-shadow: 20px 20px 0 rgba(0,0,0,0.1) !important;
        }

        /* 
         Since we duplicated the array 3 times, we translate by -33.33% 
         to loop back perfectly to the start of the second block.
        */
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.333% - 13.33px)); } /* accounting for gap */
        }

        @keyframes marqueeRight {
          0% { transform: translateX(calc(-33.333% - 13.33px)); }
          100% { transform: translateX(0); }
        }
      `}</style>

    </section>
  );
}
