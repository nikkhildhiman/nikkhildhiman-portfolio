import React, { useEffect, useState, useRef } from 'react';
import { ArrowUpRight, Play, ArrowDown } from 'lucide-react';
import gsap from 'gsap';

export default function Hero({ onOpenVideo }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const cardsRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    // Entrance Animation
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    tl.fromTo(headlineRef.current.children, 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 1.2, delay: 0.1 }
    )
    .fromTo(cardsRef.current.children,
      { y: 60, opacity: 0, scale: 0.8, rotation: 5 },
      { y: 0, opacity: 1, scale: 1, rotation: (i) => [-6, 4, -2][i], stagger: 0.15, duration: 1.4 },
      "-=0.8"
    );

    // Parallax tracking
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCardHover = (idx) => setHoveredCard(idx);
  const handleCardLeave = () => setHoveredCard(null);

  const CARDS = [
    { id: 0, img: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=2070&auto=format&fit=crop', title: 'COMMERCIAL' },
    { id: 1, img: 'https://images.unsplash.com/photo-1517409252321-ba31697eeaf6?q=80&w=2070&auto=format&fit=crop', title: 'YOUTUBE' },
    { id: 2, img: 'https://images.unsplash.com/photo-1535016120720-40c746a47ce4?q=80&w=2070&auto=format&fit=crop', title: 'COLOR GRADE' }
  ];

  return (
    <section 
      id="hero" 
      ref={heroRef}
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative', 
        paddingTop: '80px',
        backgroundColor: 'var(--color-surface)',
        overflow: 'hidden'
      }}
    >
      
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Brutalist Asymmetrical Grid */}
        <div className="grid-12" style={{ alignItems: 'center' }}>
          
          {/* LEFT: Massive Parallax Typography */}
          <div 
            className="hero-text-block" 
            style={{ 
              gridColumn: 'span 7',
              transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', borderRadius: '9999px', width: 'fit-content', marginBottom: '32px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)', boxShadow: '0 0 10px var(--color-success)', animation: 'pulse 2s infinite' }}></span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-black)' }}>Accepting Projects for Q4</span>
            </div>

            <h1 ref={headlineRef} style={{ 
              fontSize: 'clamp(4rem, 7.5vw, 8rem)', 
              lineHeight: 0.9, 
              letterSpacing: '-0.03em', 
              color: 'var(--color-black)', 
              margin: '0 0 32px 0', 
              textTransform: 'uppercase',
              fontWeight: 800
            }}>
              <div style={{ overflow: 'hidden' }}><span style={{ display: 'block' }}>I CREATE</span></div>
              <div style={{ overflow: 'hidden' }}><span style={{ color: 'var(--accent-blue)', display: 'block' }}>VISUAL</span></div>
              <div style={{ overflow: 'hidden' }}><span style={{ display: 'block' }}>STORIES.</span></div>
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button className="btn-lime magnetic" onClick={() => document.getElementById('work').scrollIntoView({ behavior: 'smooth' })}>
                Explore Work <ArrowUpRight size={18} />
              </button>
              
              <button 
                className="btn-secondary magnetic" 
                onClick={() => onOpenVideo('https://www.w3schools.com/html/mov_bbb.mp4')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', borderRadius: '9999px', border: '1px solid var(--color-black)', color: 'var(--color-black)', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}
              >
                <Play size={18} fill="currentColor" /> Play Showreel
              </button>
            </div>
          </div>

          {/* RIGHT: Floating Interactive Video Cards */}
          <div 
            ref={cardsRef}
            className="hero-visual-block" 
            style={{ 
              gridColumn: 'span 5', 
              position: 'relative', 
              height: '600px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
              transition: 'transform 0.1s ease-out',
              perspective: '1000px'
            }}
          >
            
            {CARDS.map((card, idx) => {
              const isHovered = hoveredCard === idx;
              const isOtherHovered = hoveredCard !== null && hoveredCard !== idx;
              
              // Base transforms for the messy, stacked look
              const baseTransforms = [
                { top: '10%', left: '0%', rotation: -6, zIndex: 1 },
                { top: '35%', left: '20%', rotation: 4, zIndex: 2 },
                { top: '60%', left: '10%', rotation: -2, zIndex: 3 }
              ];

              return (
                <div 
                  key={card.id}
                  onMouseEnter={() => handleCardHover(idx)}
                  onMouseLeave={handleCardLeave}
                  onClick={() => onOpenVideo('https://www.w3schools.com/html/mov_bbb.mp4')}
                  style={{
                    position: 'absolute',
                    top: baseTransforms[idx].top,
                    left: baseTransforms[idx].left,
                    width: '320px',
                    height: '200px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: isHovered ? '0 32px 64px rgba(0,0,0,0.3)' : '0 16px 32px rgba(0,0,0,0.1)',
                    zIndex: isHovered ? 10 : baseTransforms[idx].zIndex,
                    transform: `rotate(${baseTransforms[idx].rotation}deg) scale(${isHovered ? 1.15 : (isOtherHovered ? 0.9 : 1)}) ${isHovered ? 'translateY(-20px)' : ''}`,
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <img src={card.img} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  
                  {/* Overlay Title */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    padding: '16px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    color: '#fff',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    letterSpacing: '0.05em',
                    transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                    opacity: isHovered ? 1 : 0,
                    transition: 'all 0.4s ease'
                  }}>
                    {card.title}
                  </div>

                  {/* Hover Play Button */}
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: `translate(-50%, -50%) scale(${isHovered ? 1 : 0.5})`,
                    opacity: isHovered ? 1 : 0,
                    width: '64px', height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    border: '1px solid rgba(255,255,255,0.4)'
                  }}>
                    <Play size={24} color="#fff" fill="#fff" style={{ marginLeft: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          #hero { padding-top: 120px !important; }
          .hero-text-block { grid-column: span 12 !important; text-align: center; display: flex; flexDirection: column; align-items: center; }
          .hero-text-block h1 { font-size: clamp(3.5rem, 12vw, 5rem) !important; margin-bottom: 40px !important; }
          .hero-text-block h1 span { padding-left: 0 !important; }
          .hero-text-block > div:last-child { justify-content: center !important; flex-wrap: wrap; }
          .hero-visual-block { grid-column: span 12 !important; height: 500px !important; margin-top: 20px; }
          .hero-visual-block > div { width: 280px !important; height: 180px !important; left: 50% !important; transform-origin: center center !important; }
          .hero-visual-block > div:nth-child(1) { top: 10% !important; margin-left: -140px !important; }
          .hero-visual-block > div:nth-child(2) { top: 35% !important; margin-left: -120px !important; }
          .hero-visual-block > div:nth-child(3) { top: 60% !important; margin-left: -160px !important; }
        }
      `}</style>
    </section>
  );
}
