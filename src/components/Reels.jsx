import React, { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REELS_DATA = [
  { id: 1, title: 'Viral Hook 01', views: '2.4M', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, title: 'Retention Edit 02', views: '1.1M', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 3, title: 'Storytelling 03', views: '800K', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 4, title: 'Product Showcase', views: '3.2M', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 5, title: 'Fast Paced Vlogs', views: '1.5M', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 6, title: 'Educational Value', views: '950K', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 7, title: 'Comedy Sketch', views: '4.1M', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 8, title: 'Cinematic Teaser', views: '1.8M', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 9, title: 'Behind the Scenes', views: '2.2M', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

export default function Reels({ onOpenVideo }) {
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(gridRef.current.children);
      
      // Initial hidden state
      gsap.set(cards, { opacity: 0, y: 100, filter: 'blur(5px)' });

      ScrollTrigger.batch(cards, {
        start: 'top 90%', // Trigger when entering from bottom
        end: 'bottom 10%', // Trigger when exiting from top
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.1, duration: 1.0, ease: 'power4.out', overwrite: true }),
        onLeave: batch => gsap.to(batch, { opacity: 0, y: -80, filter: 'blur(5px)', stagger: 0.1, duration: 0.8, ease: 'power3.out', overwrite: true }),
        onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.1, duration: 1.0, ease: 'power4.out', overwrite: true }),
        onLeaveBack: batch => gsap.to(batch, { opacity: 0, y: 80, filter: 'blur(5px)', stagger: 0.1, duration: 0.8, ease: 'power3.out', overwrite: true })
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        padding: '120px 5vw',
        backgroundColor: 'var(--color-surface)',
        minHeight: '100vh',
      }}
    >
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h2 className="display-lg" style={{ marginBottom: '16px' }}>
          9:16 REELS
        </h2>
        <p className="lead" style={{ maxWidth: '600px', margin: '0 auto' }}>
          High-retention short form content designed for TikTok, Shorts, and Reels. Engineered to maximize engagement.
        </p>
      </div>

      <div 
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '40px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}
      >
        {REELS_DATA.map((reel) => (
          <div 
            key={reel.id}
            className="video-hover"
            onClick={() => onOpenVideo(reel.src)}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector('video').play();
              gsap.to(e.currentTarget, { scale: 1.05, duration: 0.4, ease: 'power2.out', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', transformPerspective: 1000 });
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = ((y - centerY) / centerY) * -10; // 10 degree max tilt
              const rotateY = ((x - centerX) / centerX) * 10;
              
              gsap.to(e.currentTarget, {
                rotateX,
                rotateY,
                duration: 0.8, // Increased for smoother trailing
                ease: 'power3.out' // Smoother deceleration
              });
              
            }}
            onMouseLeave={(e) => {
              const video = e.currentTarget.querySelector('video');
              video.pause();
              video.currentTime = 0;
              gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.3)', boxShadow: 'none' });
            }}
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              cursor: 'none',
              aspectRatio: '9/16',
              backgroundColor: '#111',
              willChange: 'transform'
            }}
          >
            <video 
              src={reel.src}
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.7,
                transition: 'opacity 0.3s ease'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
