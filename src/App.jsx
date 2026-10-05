import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { Layers, Compass, User, Mail, Calendar, ArrowUpRight } from 'lucide-react';

import ParticleCanvas from './components/ParticleCanvas';
import CustomCursor from './components/CustomCursor';
import { pageTransitionOut, pageTransitionIn } from './utils/motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SelectedWork from './components/SelectedWork';
import ServicesSection from './components/ServicesSection';

import About from './components/About';

import BookingModal from './components/BookingModal';
import VideoModal from './components/VideoModal';
import ProjectCaseStudyModal from './components/ProjectCaseStudyModal';
import ThumbnailShowcase from './components/ThumbnailShowcase';
import ThumbnailGallery from './components/ThumbnailGallery';
import Reels from './components/Reels';
import Footer from './components/Footer';
import DotNavigation from './components/DotNavigation';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [morphingLogo, setMorphingLogo] = useState(false);
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'work', 'about', 'contact', 'thumbnails', 'reels'];
    return validPages.includes(hash) ? hash : 'home';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
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
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
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
      // Ignore if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
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

  // Morphing Logo FLIP Animation Logic Removed for New NDLandingPreloader

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['home', 'work', 'about', 'contact', 'thumbnails', 'reels'];
      const targetPage = validPages.includes(hash) ? hash : 'home';
      
      if (targetPage !== activePage && !isTransitioning) {
        setIsTransitioning(true);
        const mainContainer = document.querySelector('main');
        if (mainContainer) {
          pageTransitionOut(mainContainer, () => {
            setActivePage(targetPage);
            window.scrollTo(0, 0);
            if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
            
            setTimeout(() => {
              setIsTransitioning(false);
              pageTransitionIn(mainContainer);
              ScrollTrigger.refresh();
            }, 50);
          });
        } else {
          setActivePage(targetPage);
        }
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activePage, isTransitioning]);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleNavigate = (page) => {
    window.location.hash = page === 'home' ? '' : page;
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



      {/* Multi-Page Route Views */}
      <main style={{ position: 'relative', zIndex: 2 }}>
        
        {/* PAGE 1: STREAMLINED HOME FLOW */}
        {activePage === 'home' && (
          <div>
            <Hero onOpenBooking={handleOpenBooking} onPlayVideo={handlePlayVideo} onNavigate={handleNavigate} />
            <SelectedWork onPlayVideo={handlePlayVideo} onOpenCaseStudy={handleOpenCaseStudy} />
            <ServicesSection onOpenBooking={handleOpenBooking} onNavigate={handleNavigate} />
            <About />
            <DotNavigation />
          </div>
        )}

        {/* PAGE 2: WORK */}
        {activePage === 'work' && (
          <div style={{ paddingTop: '80px' }}>
            <SelectedWork onPlayVideo={handlePlayVideo} onOpenCaseStudy={handleOpenCaseStudy} isWorkPage={true} />
            

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
            <About />
          </div>
        )}





      </main>

      {/* 7. Contact & Footer */}
      <Footer onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} activePage={activePage} />

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
