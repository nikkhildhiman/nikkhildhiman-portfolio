import React, { useEffect, useState, useRef } from 'react';
import { ArrowUpRight, Play, ArrowDown } from 'lucide-react';
import gsap from 'gsap';

export default function Hero({ onOpenVideo, onNavigate }) {
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

    // Parallax tracking for Hero Cards
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Interactive 3D Text Effect for Headline
    const h1Node = headlineRef.current;
    
    const handleTextMouseMove = (e) => {
      if (!h1Node) return;
      const rect = h1Node.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      
      // Subtle 3D tilt
      gsap.to(h1Node, {
        rotateX: y * -10,
        rotateY: x * 10,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.5
      });
      
      // Letter Repulsion Physics
      const chars = h1Node.querySelectorAll('.char');
      chars.forEach(char => {
        const charRect = char.getBoundingClientRect();
        const charX = charRect.left + charRect.width / 2;
        const charY = charRect.top + charRect.height / 2;
        const dx = e.clientX - charX;
        const dy = e.clientY - charY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120; // Repulsion radius
        
        if (distance < maxDist) {
          const force = (maxDist - distance) / maxDist;
          gsap.to(char, {
            x: -(dx / distance) * force * 50,
            y: -(dy / distance) * force * 50,
            scale: 1 + (force * 0.4),
            rotate: (dx / distance) * force * 30,
            color: 'var(--color-hover)', // Light up lime
            duration: 0.3,
            ease: 'power2.out'
          });
        } else {
          gsap.to(char, { 
            x: 0, y: 0, scale: 1, rotate: 0, color: '', 
            duration: 0.8, ease: 'elastic.out(1, 0.3)' 
          });
        }
      });
    };

    const handleTextMouseLeave = () => {
      gsap.to(h1Node, {
        rotateX: 0, rotateY: 0,
        ease: 'elastic.out(1, 0.3)', duration: 1.2
      });
      const chars = h1Node.querySelectorAll('.char');
      gsap.to(chars, {
        x: 0, y: 0, scale: 1, rotate: 0, color: '',
        ease: 'elastic.out(1, 0.3)', duration: 1.2
      });
    };

    if (h1Node) {
      h1Node.addEventListener('mousemove', handleTextMouseMove);
      h1Node.addEventListener('mouseleave', handleTextMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (h1Node) {
        h1Node.removeEventListener('mousemove', handleTextMouseMove);
        h1Node.removeEventListener('mouseleave', handleTextMouseLeave);
      }
    };
  }, []);

  const handleCardHover = (idx) => setHoveredCard(idx);
  const handleCardLeave = () => setHoveredCard(null);

  const CARDS = [
    { id: 0, video: '/assets/Nikhil_x_Khushal.mp4', title: 'COMMERCIAL' },
    { id: 1, video: '/assets/instagranstory-2.mp4', title: 'VERTICAL EDITING' },
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

            <h1 ref={headlineRef} style={{ 
              position: 'relative',
              zIndex: 40,
              fontSize: 'clamp(4rem, 7.5vw, 8rem)', 
              lineHeight: 0.9, 
              letterSpacing: '-0.03em', 
              color: 'var(--color-black)', 
              margin: '0 0 32px 0', 
              textTransform: 'uppercase',
              fontWeight: 800,
              transformStyle: 'preserve-3d',
              cursor: 'default'
            }}>
              <div className="text-layer" style={{ padding: '10px 0' }}><span style={{ display: 'block' }}>
                {'I CREATE'.split('').map((c, i) => <span key={i} className="char" style={{ display: 'inline-block', transformOrigin: 'center' }}>{c === ' ' ? '\u00A0' : c}</span>)}
              </span></div>
              <div className="text-layer" style={{ padding: '10px 0' }}><span className="stair-text" style={{ color: 'var(--accent-blue)', display: 'block' }}>
                {'VISUAL'.split('').map((c, i) => <span key={i} className="char" style={{ display: 'inline-block', transformOrigin: 'center' }}>{c}</span>)}
              </span></div>
              <div className="text-layer" style={{ padding: '10px 0' }}><span style={{ display: 'block' }}>
                {'STORIES.'.split('').map((c, i) => <span key={i} className="char" style={{ display: 'inline-block', transformOrigin: 'center' }}>{c}</span>)}
              </span></div>
            </h1>

            <div className="hero-buttons-container" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <button className="btn-lime magnetic" onClick={() => onNavigate('work')}>
                Explore Work <ArrowUpRight size={18} />
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
                  onClick={() => onOpenVideo(card.video ? card.video : '/assets/instagranstory-2.mp4')}
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
                  {card.video ? (
                    <video src={card.video} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <img src={card.img} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  
                  {/* Overlay Title */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    padding: '16px',
                    color: '#fff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    letterSpacing: '0.05em',
                    transform: 'translateY(0)',
                    opacity: 1,
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
        .stair-text { padding-left: 40px; }
        @media (max-width: 992px) {
          #hero { padding-top: 140px !important; min-height: auto !important; padding-bottom: 60px !important; }
          .hero-text-block { grid-column: span 12 !important; text-align: left !important; align-items: flex-start !important; padding-left: 12px !important; }
          .hero-text-block h1 { font-size: clamp(2.8rem, 11vw, 5rem) !important; margin-bottom: 32px !important; }
          .stair-text { padding-left: 24px !important; }
          .hero-text-block > div:last-child { justify-content: flex-start !important; flex-wrap: wrap !important; gap: 16px !important; width: 100%; padding-left: 4px !important; }
          .hero-visual-block { grid-column: span 12 !important; height: 440px !important; margin-top: 40px; transform: none !important; }
          .hero-visual-block > div { width: min(280px, 85vw) !important; height: 180px !important; left: 50% !important; margin: 0 !important; }
          .hero-visual-block > div:nth-child(1) { top: 0% !important; transform: translateX(-55%) rotate(-4deg) !important; }
          .hero-visual-block > div:nth-child(2) { top: 25% !important; transform: translateX(-40%) rotate(4deg) !important; }
          .hero-visual-block > div:nth-child(3) { top: 50% !important; transform: translateX(-55%) rotate(-2deg) !important; }
        }
      `}</style>
    </section>
  );
}
