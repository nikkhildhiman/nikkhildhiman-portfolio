import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Mail, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { staggeredReveal } from '../utils/motion';

export default function Footer({ onNavigate, onOpenBooking, activePage }) {
  const footerRef = useRef(null);
  const [activeFolder, setActiveFolder] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray('.footer-reveal');
      if (elements.length) {
        staggeredReveal(elements, 0.2, 0);
      }
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const btnStylePrimary = {
    borderRadius: '9999px', background: '#111111', color: '#E4FF00', border: 'none',
    padding: '16px 36px', fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase',
    display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.3s ease'
  };

  const btnStyleOutline = {
    borderRadius: '9999px', color: '#111111', background: 'transparent', border: '2px solid #111111',
    padding: '16px 36px', fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'none',
    display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s ease'
  };

  let folders;

  if (activePage === 'reels' || activePage === 'thumbnails' || activePage === 'work') {
    const showWork = activePage !== 'work';
    const showThumbnails = activePage !== 'thumbnails';
    const showReels = activePage !== 'reels';

    let linkText = 'more.';
    if (activePage === 'reels') linkText = 'work & thumbnails.';
    if (activePage === 'thumbnails') linkText = 'work & reels.';
    if (activePage === 'work') linkText = 'reels & thumbnails.';

    folders = [
      {
        id: 0,
        tab: 'EXPLORE MORE',
        content: (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#111111', lineHeight: 1.05, fontWeight: 800, textTransform: 'uppercase', marginBottom: '36px', marginTop: 0 }}>
              EXPLORE THE <br />
              <span style={{ color: '#111111', fontFamily: "'Melodrama', serif", fontStyle: 'italic', textTransform: 'none', fontWeight: 600 }}>{linkText}</span>
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {showWork && (
                <button 
                  className="magnetic" 
                  onClick={() => onNavigate ? onNavigate('work') : (window.location.hash = 'work')}
                  style={btnStylePrimary}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <span>View Work</span>
                  <ArrowUpRight size={18} />
                </button>
              )}
              
              {showThumbnails && (
                <button 
                  className="magnetic" 
                  onClick={() => onNavigate ? onNavigate('thumbnails') : (window.location.hash = 'thumbnails')}
                  style={showWork ? btnStyleOutline : btnStylePrimary}
                  onMouseEnter={(e) => { 
                    if (showWork) {
                      e.currentTarget.style.background = '#111111'; 
                      e.currentTarget.style.color = 'var(--text-main)'; 
                    }
                    e.currentTarget.style.transform = 'translateY(-3px)'; 
                  }}
                  onMouseLeave={(e) => { 
                    if (showWork) {
                      e.currentTarget.style.background = 'transparent'; 
                      e.currentTarget.style.color = '#111111'; 
                    }
                    e.currentTarget.style.transform = 'translateY(0)'; 
                  }}
                >
                  <span>View Thumbnails</span>
                  <ArrowUpRight size={18} />
                </button>
              )}

              {showReels && (
                <button 
                  className="magnetic" 
                  onClick={() => onNavigate ? onNavigate('reels') : (window.location.hash = 'reels')}
                  style={btnStyleOutline}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#111111'; e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111111'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <span>View Reels</span>
                  <ArrowUpRight size={18} />
                </button>
              )}
            </div>
          </div>
        )
      }
    ];
  } else {
    folders = [
    {
      id: 0,
      tab: 'START A PROJECT',
      content: (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#111111', lineHeight: 1.05, fontWeight: 800, textTransform: 'uppercase', marginBottom: '36px', marginTop: 0 }}>
            LET'S CREATE SOMETHING <br />
            <span style={{ color: '#111111', fontFamily: "'Melodrama', serif", fontStyle: 'italic', textTransform: 'none', fontWeight: 600 }}>worth remembering.</span>
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              className="magnetic" 
              onClick={onOpenBooking} 
              style={btnStylePrimary}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <Calendar size={18} />
              <span>Book Project</span>
            </button>

            <a 
              href="mailto:nikhil@studio.com" 
              className="magnetic" 
              style={btnStyleOutline}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#111111'; e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111111'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Mail size={18} />
              <span>Email Direct</span>
            </a>
          </div>
        </div>
      )
    },
    {
      id: 1,
      tab: 'SOCIALS',
      content: (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#111111', lineHeight: 1.05, fontWeight: 800, textTransform: 'uppercase', marginBottom: '36px', marginTop: 0 }}>
            CONNECT WITH <br />
            <span style={{ color: '#111111', fontFamily: "'Melodrama', serif", fontStyle: 'italic', textTransform: 'none', fontWeight: 600 }}>the vision.</span>
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a 
              href="https://www.instagram.com/nikkhildhiman/" 
              target="_blank" 
              rel="noreferrer" 
              className="magnetic" 
              style={btnStyleOutline}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#111111'; e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111111'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span>Instagram</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )
    }
  ];
}

  return (
    <footer id="contact" ref={footerRef} style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', paddingTop: '80px', paddingBottom: '120px', overflow: 'hidden' }}>
      <div className="container footer-reveal">
        
        {/* We use a height that comfortably fits the content and allows the bottom to show */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto', height: '520px' }}>
          {folders.map((folder) => {
            const isActive = activeFolder === folder.id;
            
            // Calculate stacking positions for 2 folders
            let y, z;
            if (isActive) {
              y = 60;
              z = 10;
            } else {
              y = 30;
              z = 5;
            }

            const isSolid = isActive;

            return (
              <div 
                key={folder.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transform: `translateY(${y}px)`,
                  zIndex: z,
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), z-index 0s',
                  pointerEvents: 'none'
                }}
              >
                {/* Tab */}
                <div 
                  onClick={() => setActiveFolder(folder.id)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: folder.id === 0 ? '10%' : '55%', 
                    width: '35%',
                    height: '48px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    pointerEvents: 'auto'
                  }}
                >
                  <div className="footer-tab-shape" style={{
                    background: isSolid ? 'var(--text-main)' : 'var(--bg-main)',
                    border: isSolid ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    borderBottom: 'none',
                  }} />
                  
                  {/* Hide the bottom line to connect seamlessly with body */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: '2px',
                    right: '2px',
                    height: '4px',
                    background: isSolid ? 'var(--text-main)' : 'var(--bg-main)',
                    zIndex: 3
                  }} />

                  <span style={{ 
                    position: 'relative', 
                    zIndex: 4, 
                    color: isSolid ? '#111111' : 'var(--text-muted)', 
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    transition: 'color 0.4s ease'
                  }}>
                    {folder.tab}
                  </span>
                </div>

                {/* Folder Body */}
                <div style={{
                  position: 'absolute',
                  top: '47px', // overlaps tab by 1px
                  left: 0,
                  width: '100%',
                  height: 'calc(100% - 47px)',
                  background: isSolid ? 'var(--text-main)' : 'var(--bg-main)',
                  border: isSolid ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '24px', // Fully rounded corners
                  transition: 'background 0.5s ease, border 0.5s ease, border-radius 0.5s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '60px 8%',
                  overflow: 'hidden',
                  zIndex: 1,
                  pointerEvents: 'auto'
                }}>
                  
                  <div style={{ 
                    opacity: isSolid ? 1 : 0, 
                    transform: isSolid ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
                    pointerEvents: isSolid ? 'auto' : 'none',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    {/* Decorative Star Icon */}
                    <div 
                      onClick={() => setIsSpinning(prev => !prev)}
                      style={{ 
                      position: 'absolute', 
                      top: '40px', 
                      right: '40px', 
                      width: '48px', 
                      height: '48px',
                      borderRadius: '50%',
                      background: '#111111',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E4FF00',
                      cursor: 'pointer',
                      animation: isSpinning ? 'starSpin 4s linear infinite' : 'none',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSpinning) e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSpinning) e.currentTarget.style.transform = 'scale(1)';
                    }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                      </svg>
                    </div>

                    {folder.content}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Footer Row moved out of the folders */}
        <div className="footer-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.88rem', fontFamily: 'var(--font-heading)', color: 'var(--text-muted)', marginTop: '100px' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
            NIKHIL DHIMAN
          </div>

          <div>
            ndproductions • {new Date().getFullYear()}
          </div>
        </div>

      </div>

      <style>{`
        .footer-tab-shape {
          position: absolute;
          inset: 0;
          transform: perspective(60px) rotateX(15deg);
          transform-origin: bottom;
          border-radius: 12px 12px 0 0;
          transition: all 0.5s ease;
        }
        @keyframes starSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </footer>
  );
}
