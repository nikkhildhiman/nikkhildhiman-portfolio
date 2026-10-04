import React, { useState, useEffect } from 'react';
import { Compass, Layers, Calendar, User, Mail } from 'lucide-react';

export default function DotNavigation() {
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = React.useRef(null);

  const sections = [
    { id: 'home', label: 'Home', Icon: Compass },
    { id: 'work', label: 'Selected Work', Icon: Layers },
    { id: 'services', label: 'Services', Icon: Calendar },
    { id: 'about', label: 'About Me', Icon: User },
    { id: 'contact', label: 'Contact', Icon: Mail }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { 
      threshold: 0.2, // Lowered threshold to ensure long sections trigger
      rootMargin: '-10% 0px -10% 0px' 
    });

    sections.forEach(section => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Smart Wheel Snapping Logic
  useEffect(() => {
    let isScrolling = false;

    const wakeUp = () => {
      setIsVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    };

    const handleWheel = (e) => {
      wakeUp();

      if (isScrolling) {
        e.preventDefault();
        return;
      }

      // Find current active section
      const currentIndex = sections.findIndex(s => s.id === activeSection);
      if (currentIndex === -1) return;

      const currentEl = document.getElementById(sections[currentIndex].id);
      if (!currentEl) return;

      const rect = currentEl.getBoundingClientRect();
      
      // Determine if we are using trackpad or mouse wheel (optional, but deltaY gives direction)
      // Ignore horizontal scrolling or tiny micro-scrolls
      if (Math.abs(e.deltaY) < 10) return;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      let shouldSnap = false;
      
      if (direction > 0) {
        // Scrolling DOWN
        // Snap if we are at or past the bottom of the current section
        if (rect.bottom <= window.innerHeight + 15) {
          shouldSnap = true;
        }
      } else {
        // Scrolling UP
        // Snap if we are at or past the top of the current section
        if (rect.top >= -15) {
          shouldSnap = true;
        }
      }

      if (shouldSnap) {
        const nextIndex = currentIndex + direction;
        
        if (nextIndex >= 0 && nextIndex < sections.length) {
          e.preventDefault(); 
          isScrolling = true;
          const targetId = sections[nextIndex].id;
          
          const el = document.getElementById(targetId);
          if (el && window.lenis) {
            window.lenis.scrollTo(el, { 
              offset: 0, 
              duration: 1.2, 
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
            });
          }
          
          setTimeout(() => {
            isScrolling = false;
          }, 1200);
        }
      }
    }; // Added missing closing bracket here

    const handleScroll = () => {
      wakeUp();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial show
    wakeUp();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [activeSection]); // Removed sections from dependency array

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el && window.lenis) {
      window.lenis.scrollTo(el, { offset: 0, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.85)',
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(16px)',
        zIndex: 9999,
        transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1), filter 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isVisible ? 'auto' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#111111',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2), 0 0 0 1px #E4FF00',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const Icon = section.Icon;
          
          return (
            <div
              key={section.id}
              style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1) rotate(0deg)' : 'scale(0.2) rotate(-90deg)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                color: '#E4FF00',
              }}
            >
              <Icon size={14} strokeWidth={2} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
