import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export default function Navbar({ activePage, onNavigate, onOpenBooking }) {
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
    { label: 'About', page: 'about' },
    { label: 'Services', page: 'services' }, // We'll add this later if needed, or link to section
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        padding: '24px 0',
        transition: 'background-color 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease',
        backgroundColor: scrolled ? 'rgba(247, 245, 242, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Mark */}
        <div
          onClick={() => onNavigate('home')}
          style={{ 
            cursor: 'pointer', 
            fontFamily: 'var(--font-heading)', 
            fontWeight: 800, 
            fontSize: '1.25rem', 
            color: 'var(--text-main)', 
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {/* Logo image if you want to use the true logo, else just text */}
          {/* <img src="/assets/logo-3d.png" alt="NDProductions" style={{ width: 24 }} /> */}
          NDProductions
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }} className="hide-mobile">
          <nav style={{ display: 'flex', gap: '32px' }}>
            {navLinks.map((link) => (
              <span
                key={link.page}
                onClick={() => onNavigate(link.page)}
                style={{
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: activePage === link.page ? 'var(--text-main)' : 'var(--text-muted)',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--text-main)')}
                onMouseLeave={(e) => {
                  if (activePage !== link.page) e.target.style.color = 'var(--text-muted)';
                }}
              >
                {link.label}
              </span>
            ))}
          </nav>

          <span
            onClick={onOpenBooking}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            Let's work ↗
          </span>
        </div>

        {/* Mobile Toggle */}
        <button
          className="show-mobile"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--bg-main)',
          zIndex: 8000,
          display: 'flex',
          flexDirection: 'column',
          padding: '100px 32px 32px 32px',
          gap: '32px'
        }}>
          {navLinks.map((link) => (
            <span
              key={link.page}
              onClick={() => {
                onNavigate(link.page);
                setMobileMenuOpen(false);
              }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 700,
                color: activePage === link.page ? 'var(--text-main)' : 'var(--text-muted)'
              }}
            >
              {link.label}
            </span>
          ))}
          <span
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            style={{
              alignSelf: 'flex-start',
              marginTop: 'auto',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            Let's work ↗
          </span>
        </div>
      )}
    </header>
  );
}
