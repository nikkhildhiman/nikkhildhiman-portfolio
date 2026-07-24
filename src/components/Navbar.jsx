import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({ activePage, onNavigate, onOpenBooking, darkMode, onToggleDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Work', page: 'work' },
    { label: 'Reels', page: 'reels' },
    { label: 'Thumbnails', page: 'thumbnails' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header
      className="main-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        transition: 'all 0.4s var(--ease-expo)'
      }}
    >
      <div className="container">
        <div
          className={`navbar-inner ${scrolled ? 'scrolled' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 9000,
            backgroundColor: scrolled
              ? (darkMode ? 'rgba(18, 18, 22, 0.88)' : 'rgba(248, 248, 246, 0.88)')
              : (darkMode ? 'rgba(18, 18, 22, 0.5)' : 'rgba(255, 255, 255, 0.5)'),
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid var(--glass-border)',
            borderRadius: '9999px',
            boxShadow: scrolled ? '0 12px 32px rgba(0,0,0,0.1)' : '0 4px 16px rgba(0,0,0,0.03)',
            transition: 'all 0.4s var(--ease-expo)'
          }}
        >
          {/* Brand Mark - NIKHIL */}
          <div
            onClick={() => onNavigate('home')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div
              id="hero-logo-target"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                color: darkMode ? '#ffffff' : 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1rem',
                position: 'relative'
              }}
            >
              <img 
                id="hero-logo-true" 
                src="/assets/logo-3d.png" 
                alt="Logo" 
                style={{ opacity: 0, width: '28px', height: '28px', objectFit: 'contain' }} 
              />
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: darkMode ? '#ffffff' : 'var(--color-black)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>NIKHIL</span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#7BC47F', display: 'inline-block' }} />
            </div>
          </div>

          {/* Floating Pill Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', padding: '4px', borderRadius: '9999px' }} className="hide-mobile">
            {navLinks.map((link) => {
              const isActive = activePage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => onNavigate(link.page)}
                  className={`nav-link magnetic ${isActive ? 'active' : ''}`}
                  style={{
                    backgroundColor: 'transparent',
                    color: isActive ? (darkMode ? '#ffffff' : 'var(--color-black)') : (darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'),
                    border: 'none',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 800 : 600,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {link.label}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '12px',
                      height: '2px',
                      backgroundColor: darkMode ? '#ffffff' : 'var(--color-black)',
                      borderRadius: '2px',
                      animation: 'navUnderline 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Controls: Theme Switcher + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {/* Dark Mode Switcher */}
            <button
              onClick={onToggleDarkMode}
              title="Toggle Dark Mode (Press 'P')"
              className="magnetic"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.08)',
                color: darkMode ? '#5B8CFF' : 'var(--color-black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s var(--ease-expo)'
              }}
            >
              {darkMode ? <Sun size={18} color="#5B8CFF" /> : <Moon size={18} color="#111111" />}
            </button>

            {/* Book Project Button (Hidden on Mobile) */}
            <button
              className="btn-lime magnetic hide-mobile"
              onClick={onOpenBooking}
              style={{ padding: '10px 24px', fontSize: '0.9rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Book Project</span>
              <ArrowUpRight size={16} style={{ transition: 'transform 0.3s ease' }} className="btn-icon" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: darkMode ? '#ffffff' : 'var(--color-black)',
                color: darkMode ? '#111111' : '#ffffff',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="show-mobile-flex"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* Premium Full-Screen Mobile Menu */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 8999,
          backgroundColor: darkMode ? 'rgba(11, 11, 13, 0.98)' : 'rgba(248, 248, 246, 0.98)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '100px 24px max(40px, env(safe-area-inset-bottom)) 24px',
          gap: '4px',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          opacity: mobileMenuOpen ? 1 : 0,
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
          transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
          className="show-mobile-flex"
        >
          {navLinks.map((link, idx) => (
            <button
              key={link.page}
              onClick={() => {
                onNavigate(link.page);
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'transparent',
                color: activePage === link.page ? (darkMode ? '#ffffff' : 'var(--color-black)') : (darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'),
                border: 'none',
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 10vw, 3.5rem)',
                fontWeight: 800,
                textAlign: 'center',
                padding: '2px 0',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                transition: 'color 0.3s ease'
              }}
            >
              {link.label}
            </button>
          ))}
          
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button className="btn-lime" onClick={() => { onOpenBooking(); setMobileMenuOpen(false); }} style={{ width: '100%', padding: '20px', fontSize: '1.1rem', borderRadius: '9999px' }}>
              Book Project
            </button>
          </div>
        </div>
      {/* CSS for specific interactions */}
      <style>{`
        @keyframes navUnderline {
          from { width: 0px; opacity: 0; }
          to { width: 12px; opacity: 1; }
        }
        .btn-lime:hover .btn-icon {
          transform: translate(2px, -2px) rotate(15deg);
        }
      `}</style>
    </header>
  );
}
