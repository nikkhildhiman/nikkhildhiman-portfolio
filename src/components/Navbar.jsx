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
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: scrolled ? 0 : 1,
        transform: scrolled ? 'translateY(-20px)' : 'translateY(0)',
        pointerEvents: scrolled ? 'none' : 'auto',
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
            color: '#E4FF00', 
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

        {/* Let's Work CTA */}
        <span
          onClick={onOpenBooking}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#E4FF00',
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
    </header>
  );
}
