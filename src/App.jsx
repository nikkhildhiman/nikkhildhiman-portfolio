import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { Layers, Compass, User, Mail, Calendar, ArrowUpRight } from 'lucide-react';

import ParticleCanvas from './components/ParticleCanvas';
import CinematicLoader from './components/CinematicLoader';

import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SelectedWork from './components/SelectedWork';
import ServicesSection from './components/ServicesSection';
import CreativeProcess from './components/CreativeProcess';
import About from './components/About';
import TestimonialsSection from './components/TestimonialsSection';
import BookingModal from './components/BookingModal';
import VideoModal from './components/VideoModal';
import ProjectCaseStudyModal from './components/ProjectCaseStudyModal';
import ThumbnailShowcase from './components/ThumbnailShowcase';
import ThumbnailGallery from './components/ThumbnailGallery';
import Reels from './components/Reels';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [morphingLogo, setMorphingLogo] = useState(false);
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'work', 'about', 'process', 'contact', 'thumbnails', 'reels'];
    return validPages.includes(hash) ? hash : 'home';
  });
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState({ isOpen: false, url: '', title: '' });
  const [activeCaseStudy, setActiveCaseStudy] = useState({ isOpen: false, project: null });
  const [darkMode, setDarkMode] = useState(false);

  // Synchronize Dark Mode Data Attribute on Document Element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Initialize Lenis Smooth Scroll & GSAP Global Timelines
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 2,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Magnetic logic is now handled by CustomCursor's dedicated physics engine.

    // Keyboard Easter Egg: Press 'P' for Cinema Dark Mode
    const handleKeyDown = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        setDarkMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      lenis.destroy();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Morphing Logo FLIP Animation Logic
  useEffect(() => {
    if (morphingLogo) {
      const target = document.getElementById('hero-logo-target');
      const globalLogo = document.getElementById('global-logo');
      const trueLogo = document.getElementById('hero-logo-true');
      
      if (target && globalLogo && trueLogo) {
        // Instant morph without any delay
        const targetRect = target.getBoundingClientRect();
        
        gsap.to(globalLogo, {
          top: targetRect.top + targetRect.height / 2, // center X
          left: targetRect.left + targetRect.width / 2, // center Y
          width: targetRect.width,
          height: targetRect.height,
          duration: 1.4, // Cinematic, buttery smooth morph
          ease: 'expo.inOut',
          onComplete: () => {
            gsap.to(globalLogo, { 
              opacity: 0, 
              duration: 0.4, 
              onComplete: () => setMorphingLogo(false) 
            });
            gsap.to(trueLogo, { opacity: 1, duration: 0.4 });
          }
        });
      } else {
        setMorphingLogo(false);
      }
    }
  }, [morphingLogo]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['home', 'work', 'about', 'process', 'contact', 'thumbnails', 'reels'];
      setActivePage(validPages.includes(hash) ? hash : 'home');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleNavigate = (page) => {
    // Instead of setting activePage directly, we update the hash.
    // The hashchange listener will catch this and update activePage automatically.
    window.location.hash = page === 'home' ? '' : page;

    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // GSAP Page Transition Fade
    gsap.fromTo(
      'main',
      { opacity: 0.4, y: 15 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.4, 
        ease: 'power2.out',
        onComplete: () => {
          // Fixes the GSAP pin-spacer blank space issue when routing
          ScrollTrigger.refresh();
        }
      }
    );
  };

  const handleOpenBooking = () => {
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handlePlayVideo = (url, title) => {
    setActiveVideo({ isOpen: true, url, title });
  };

  const handleCloseVideo = () => {
    setActiveVideo({ isOpen: false, url: '', title: '' });
  };

  const handleOpenCaseStudy = (project) => {
    setActiveCaseStudy({ isOpen: true, project });
  };

  const handleCloseCaseStudy = () => {
    setActiveCaseStudy({ isOpen: false, project: null });
  };

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      <CustomCursor />
      
      {loading && (
        <CinematicLoader onComplete={() => {
          setLoading(false);
          setMorphingLogo(true);
        }} />
      )}

      {/* Global FLIP Logo */}
      {(loading || morphingLogo) && (
        <div 
          id="global-logo"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '450px',
            height: '450px',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999999,
            pointerEvents: 'none',
          }}
        >
          <img 
            src="/assets/logo-3d.png" 
            alt="3D Logo" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              animation: 'spin3D 3s linear infinite', // Same fast spin as preloader
              transformStyle: 'preserve-3d'
            }}
          />
        </div>
      )}

      {/* 0. Floating Dust Particle Canvas & Render */}
      <ParticleCanvas darkMode={darkMode} />

      {/* 3. Live Premiere Pro Editing Scrubber Bar (Press 'T' to toggle) */}


      {/* 4. Header Navigation with Dark Mode Toggle */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Global Sticky Conversion CTA */}
      <div className="sticky-cta-container">
        <button 
          className="btn-lime magnetic" 
          onClick={handleOpenBooking}
          style={{ 
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.1)'
          }}
        >
          START A PROJECT <ArrowUpRight size={20} />
        </button>
      </div>

      {/* Multi-Page Route Views */}
      <main style={{ position: 'relative', zIndex: 2 }}>
        
        {/* PAGE 1: STREAMLINED HOME FLOW */}
        {activePage === 'home' && (
          <div>
            <Hero onOpenBooking={handleOpenBooking} onPlayVideo={handlePlayVideo} onNavigate={handleNavigate} />
            <SelectedWork onPlayVideo={handlePlayVideo} onOpenCaseStudy={handleOpenCaseStudy} />
            <ServicesSection onOpenBooking={handleOpenBooking} onNavigate={handleNavigate} />
            <CreativeProcess onOpenBooking={handleOpenBooking} />
            <About />
            <TestimonialsSection />
          </div>
        )}

        {/* PAGE 2: WORK */}
        {activePage === 'work' && (
          <div style={{ paddingTop: '80px' }}>
            <SelectedWork onPlayVideo={handlePlayVideo} onOpenCaseStudy={handleOpenCaseStudy} isWorkPage={true} />
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              padding: '0 4vw 120px 4vw',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => handleNavigate('reels')}
                className="magnetic"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  color: 'var(--color-black)',
                  padding: '16px 40px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                View Reels <ArrowUpRight size={20} />
              </button>
              <button 
                onClick={() => handleNavigate('thumbnails')}
                className="magnetic"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  color: 'var(--color-black)',
                  padding: '16px 40px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                View Thumbnails <ArrowUpRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* PAGE 3: THUMBNAILS */}
        {activePage === 'thumbnails' && (
          <div style={{ paddingTop: '100px' }}>
            <ThumbnailShowcase />
            <ThumbnailGallery onNavigate={handleNavigate} />
          </div>
        )}

        {/* PAGE 4: REELS */}
        {activePage === 'reels' && (
          <div style={{ paddingTop: '100px' }}>
            <Reels onOpenVideo={handlePlayVideo} onNavigate={handleNavigate} />
          </div>
        )}

        {/* PAGE 3: ABOUT */}
        {activePage === 'about' && (
          <div style={{ paddingTop: '100px' }}>
            <div style={{ 
              height: '50vh', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              padding: '0 4vw',
              borderBottom: '2px solid var(--color-black)'
            }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                [ PAGE / BEHIND THE CRAFT ]
              </div>
              <h1 style={{ 
                fontSize: 'clamp(2.5rem, 10vw, 8rem)', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                color: 'transparent',
                WebkitTextStroke: '2px var(--color-black)',
                lineHeight: 0.9,
                margin: 0,
                textTransform: 'uppercase'
              }}>
                BEHIND THE <br/><span style={{ color: 'var(--color-black)', WebkitTextStroke: 'none' }}>CRAFT</span>
              </h1>
            </div>

            <About />
            <TestimonialsSection />
          </div>
        )}

        {/* PAGE 4: PROCESS */}
        {activePage === 'process' && (
          <div style={{ paddingTop: '100px' }}>
            <div style={{ 
              height: '50vh', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              padding: '0 4vw',
              borderBottom: '2px solid var(--color-black)',
              marginBottom: '40px'
            }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                [ PAGE / THE WORKFLOW ]
              </div>
              <h1 style={{ 
                fontSize: 'clamp(2.5rem, 10vw, 8rem)', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                color: 'transparent',
                WebkitTextStroke: '2px var(--color-black)',
                lineHeight: 0.9,
                margin: 0,
                textTransform: 'uppercase'
              }}>
                CREATIVE <br/><span style={{ color: 'var(--color-black)', WebkitTextStroke: 'none' }}>BLUEPRINT</span>
              </h1>
            </div>

            <CreativeProcess onOpenBooking={handleOpenBooking} />
            <ServicesSection onOpenBooking={handleOpenBooking} onNavigate={handleNavigate} />
          </div>
        )}

        {/* PAGE 5: CONTACT */}
        {activePage === 'contact' && (
          <div style={{ paddingTop: '100px' }}>
            <div style={{ 
              height: '60vh', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0 4vw',
              borderBottom: '2px solid var(--color-black)',
              backgroundColor: 'var(--color-secondary)'
            }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                [ INQUIRIES & BOOKING ]
              </div>
              <h1 style={{ 
                fontSize: 'clamp(2.5rem, 10vw, 8rem)', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                color: 'transparent',
                WebkitTextStroke: '2px var(--color-black)',
                lineHeight: 0.9,
                margin: '0 0 40px 0',
                textTransform: 'uppercase'
              }}>
                LET'S <span style={{ color: 'var(--color-black)', WebkitTextStroke: 'none' }}>CREATE</span>
              </h1>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  className="btn-lime"
                  onClick={handleOpenBooking}
                  style={{ padding: '18px 48px', fontSize: '1.1rem', borderRadius: '9999px' }}
                >
                  <Calendar size={20} />
                  <span>LAUNCH BOOKING & CALENDLY INTAKE</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 7. Contact & Footer */}
      <Footer onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />

      {/* Conversion Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={handleCloseBooking} />

      {/* Full 8-Part Cinematic Case Study Modal */}
      <ProjectCaseStudyModal
        isOpen={activeCaseStudy.isOpen}
        project={activeCaseStudy.project}
        onClose={handleCloseCaseStudy}
        onOpenBooking={handleOpenBooking}
      />

      {/* Video Player Modal */}
      <VideoModal
        isOpen={activeVideo.isOpen}
        videoUrl={activeVideo.url}
        title={activeVideo.title}
        onClose={handleCloseVideo}
      />
    </div>
  );
}
