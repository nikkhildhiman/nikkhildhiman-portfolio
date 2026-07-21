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

  const navLinks = [
    { label: 'Work', page: 'work' },
    { label: 'About', page: 'about' },
    { label: 'Process', page: 'process' },
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
        padding: scrolled ? '12px 0' : '22px 0',
        transition: 'all 0.4s var(--ease-expo)'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: scrolled ? '8px 20px' : '12px 24px',
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
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: darkMode ? '#5B8CFF' : 'var(--color-black)',
                color: darkMode ? '#ffffff' : 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}
            >
              N
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: darkMode ? '#ffffff' : 'var(--color-black)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                  style={{
                    backgroundColor: isActive ? (darkMode ? '#FFFFFF' : 'var(--color-black)') : 'transparent',
                    color: isActive ? (darkMode ? '#111111' : '#FFFFFF') : (darkMode ? '#A0A0A5' : 'var(--color-black)'),
                    border: 'none',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                    padding: '6px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.25s var(--ease-expo)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.color = darkMode ? '#FFFFFF' : 'var(--accent-blue)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.color = darkMode ? '#A0A0A5' : 'var(--color-black)';
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Controls: Theme Switcher + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            {/* Dark Mode Switcher */}
            <button
              onClick={onToggleDarkMode}
              title="Toggle Dark Mode (Press 'P')"
              style={{
                width: '36px',
                height: '36px',
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
              {darkMode ? <Sun size={17} color="#5B8CFF" /> : <Moon size={17} color="#111111" />}
            </button>

            {/* Book Project Button */}
            <button
              className="btn-lime"
              onClick={onOpenBooking}
              style={{ padding: '9px 20px', fontSize: '0.84rem', borderRadius: '9999px' }}
            >
              <span>Book Project</span>
              <ArrowUpRight size={14} />
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                backgroundColor: darkMode ? '#ffffff' : 'var(--color-black)',
                color: darkMode ? '#111111' : '#ffffff',
                border: 'none',
                padding: '8px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'none'
              }}
              className="show-mobile"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: darkMode ? '#141418' : '#F8F8F6',
            borderBottom: darkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid var(--card-border)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            borderRadius: '0 0 20px 20px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
          }}
          className="show-mobile"
        >
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => {
                onNavigate(link.page);
                setMobileMenuOpen(false);
              }}
              style={{
                backgroundColor: activePage === link.page ? (darkMode ? '#ffffff' : 'var(--color-black)') : 'transparent',
                color: activePage === link.page ? (darkMode ? '#111111' : '#ffffff') : (darkMode ? '#ffffff' : 'var(--color-black)'),
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem',
                fontWeight: 700,
                padding: '12px 16px',
                textAlign: 'left'
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
