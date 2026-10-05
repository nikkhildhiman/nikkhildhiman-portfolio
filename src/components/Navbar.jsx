import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Menu, X, Home, Briefcase, Clapperboard, Image as ImageIcon, Mail } from 'lucide-react';

const menuItems = [
  { label: 'Home', page: 'home', icon: Home },
  { label: 'My Work', page: 'work', icon: Briefcase },
  { label: 'Reels', page: 'reels', icon: Clapperboard },
  { label: 'Thumbnails', page: 'thumbnails', icon: ImageIcon },
  { label: 'Contact', page: null, icon: Mail },
];

export default function Navbar({ activePage, onNavigate, onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleItem = (item) => {
    setMenuOpen(false);
    if (item.page) {
      onNavigate(item.page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onOpenBooking();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      if (window.scrollY > 30) setMenuOpen(false);
    };
    
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
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
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: (!isMobile && scrolled) ? 0 : 1,
        transform: (!isMobile && scrolled) ? 'translateY(-20px)' : 'translateY(0)',
        pointerEvents: (!isMobile && scrolled) ? 'none' : 'auto',
        padding: (isMobile && scrolled) ? '16px 0' : '24px 0',
        background: (isMobile && scrolled) ? 'rgba(16, 16, 16, 0.85)' : 'transparent',
        backdropFilter: (isMobile && scrolled) ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: (isMobile && scrolled) ? 'blur(20px)' : 'none',
        borderBottom: (isMobile && scrolled) ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
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

          {/* Dropdown Menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              id="nav-menu-toggle"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen((o) => !o); }}
              onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen((o) => !o); }}
              className={`nav-menu-btn ${menuOpen ? 'open' : ''}`}
            >
              {menuOpen ? <X size={18} strokeWidth={2.4} style={{ pointerEvents: 'none' }} /> : <Menu size={18} strokeWidth={2.4} style={{ pointerEvents: 'none' }} />}
            </button>

            <div className={`nav-dropdown ${menuOpen ? 'open' : ''}`} role="menu">
              {menuItems.map((item, i) => (
                <button
                  key={item.label}
                  id={`nav-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  role="menuitem"
                  className={`nav-dropdown-item ${item.page && activePage === item.page ? 'active' : ''}`}
                  style={{ transitionDelay: menuOpen ? `${i * 40}ms` : '0ms' }}
                  onClick={() => handleItem(item)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleItem(item);
                  }}
                >
                  <span className="nav-dropdown-label" style={{ pointerEvents: 'none' }}>
                    <span className="nav-dropdown-icon"><item.icon size={15} strokeWidth={2} /></span>
                    {item.label}
                  </span>
                  <ArrowUpRight size={16} className="nav-dropdown-arrow" style={{ pointerEvents: 'none' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
