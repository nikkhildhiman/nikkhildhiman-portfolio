import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PORTFOLIO_DATA = [
  {
    id: 1,
    title: 'Nike Air Max - Defy Gravity',
    category: 'COMMERCIAL',
    client: 'Nike Global',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
    metric: '12M+ Views',
    videoUrl: '/assets/concept-jecrc.mp4'
  },
  {
    id: 2,
    title: 'The Art of Coffee',
    category: 'DOCUMENTARY',
    client: 'Blue Bottle',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop',
    metric: 'Staff Pick',
    videoUrl: '/assets/YEH_DIL_FOR_JECRC.mp4'
  },
  {
    id: 3,
    title: 'Tech Review Hook',
    category: 'REELS',
    client: 'Creator MKBHD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop',
    metric: '92% Retention',
    videoUrl: '/assets/Nikhil_x_Khushal.mp4'
  },
  {
    id: 4,
    title: 'Midnight Run',
    category: 'SHORT FILM',
    client: 'Independent',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535016120720-40c746a47ce4?q=80&w=2070&auto=format&fit=crop',
    metric: 'Award Winner',
    videoUrl: '/assets/girls-ree-4k.mp4'
  }
];

const CustomVideoCard = ({ project }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const progressRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        setIsPlaying(true); // Instant UI feedback
        if (!hasStarted) setHasStarted(true);
        
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Error attempting to play video:', error);
            setIsPlaying(false); // Revert UI if play fails
          });
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false); // Instant UI feedback
      }
    }
  };

  const handlePlay = (e) => {
    setIsPlaying(true);
    if (!hasStarted) setHasStarted(true);
    
    // Pause all other videos on the page
    document.querySelectorAll('video').forEach(vid => {
      if (vid !== e.target) {
        vid.pause();
      }
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const toggleMute = (e) => {
    e.stopPropagation(); // prevent triggering the play toggle
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      if (total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      videoRef.current.currentTime = percentage * videoRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div 
      className={`grid-card magnetic`}
      style={{
        width: '100%',
        aspectRatio: '4/3', // Standard aspect ratio for video thumbnails
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#111',
        boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
        border: '1px solid var(--glass-border)',
        cursor: 'pointer'
      }}
      onClick={togglePlay}
    >
      <video 
        ref={videoRef}
        src={project.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'}
        poster={project.thumbnailUrl}
        playsInline
        preload="metadata"
        muted={isMuted}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: 0.9,
          backgroundColor: '#000' // Ensure black background for letterboxing
        }}
      />
      
      {/* Centered Play/Pause Button */}
      {!isPlaying && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none', // Handled by outer div click
          border: '1px solid rgba(255,255,255,0.4)',
          zIndex: 10
        }}>
          <div style={{
            width: '0',
            height: '0',
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderLeft: '16px solid #fff',
            marginLeft: '4px' // Optical alignment
          }} />
        </div>
      )}

      {hasStarted && (
        <>
          {/* Top Right Mute/Unmute Toggle */}
          <div 
            onClick={toggleMute}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.15)',
              zIndex: 20
            }}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            )}
          </div>

          {/* Fullscreen Button */}
          <div 
            onClick={toggleFullscreen}
            style={{
              position: 'absolute',
              top: '16px',
              right: '60px', // Next to the mute button
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.15)',
              zIndex: 20
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </div>

          {/* Apple-Style Controllable Timeline */}
          <div 
            ref={progressRef}
            onClick={handleSeek}
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '60px',
              right: '60px',
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '4px',
              cursor: 'pointer',
              zIndex: 20
            }}
          >
            <div style={{
              position: 'relative',
              height: '100%',
              width: `${progress}%`,
              backgroundColor: '#fff',
              borderRadius: '4px',
              transition: 'width 0.1s linear'
            }}>
              {/* Playhead Scrubber */}
              <div style={{
                position: 'absolute',
                right: '-4px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '10px',
                height: '10px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function SelectedWork({ onOpenVideo }) {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    // Elegant fade-in animation for cards as you scroll down normally
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.grid-card');
      
      gsap.fromTo(cards, 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="work" 
      ref={sectionRef} 
      style={{ 
        backgroundColor: 'var(--color-surface)',
        paddingTop: '160px',
        paddingBottom: '160px',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* Intro Text Block */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
            Portfolio Showcase
          </div>
          <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--color-black)', margin: 0, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em', fontWeight: 800 }}>
            SELECTED <br/><span style={{ color: 'var(--text-muted)' }}>WORK</span>
          </h2>
        </div>

        {/* Normal Vertical CSS Grid */}
        <div 
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            width: '100%',
          }}
          className="portfolio-normal-grid"
        >
          {PORTFOLIO_DATA.map((project) => (
            <CustomVideoCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <style>{`
        .portfolio-normal-grid {
          grid-template-columns: repeat(2, 1fr) !important;
        }
        @media (max-width: 1024px) {
          .portfolio-normal-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .grid-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .grid-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.15);
        }
        .grid-card:hover .parallax-img {
          transform: scale(1.08);
        }
        .grid-card:hover .card-content {
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}
