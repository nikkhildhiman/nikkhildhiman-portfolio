import React, { useEffect, useRef } from 'react';
import { RotateCcw, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REELS_DATA = [
  { id: 1, title: 'Viral Hook 01', views: '2.4M', src: '/reels/1.mp4' },
  { id: 2, title: 'Retention Edit 02', views: '1.1M', src: '/reels/2.mp4' },
  { id: 3, title: 'Storytelling 03', views: '800K', src: '/reels/3.mp4' },
  { id: 4, title: 'Product Showcase', views: '3.2M', src: '/reels/4.mp4' },
  { id: 5, title: 'Fast Paced Vlogs', views: '1.5M', src: '/reels/5.mp4' },
  { id: 6, title: 'Educational Value', views: '950K', src: '/reels/6.mp4' },
  { id: 7, title: 'Comedy Sketch', views: '4.1M', src: '/reels/7.mp4' },
  { id: 8, title: 'Cinematic Teaser', views: '1.8M', src: '/reels/8.mp4' },
  { id: 9, title: 'Behind the Scenes', views: '2.2M', src: '/reels/9.mp4' },
  { id: 10, title: 'Commercial Spot', views: '5.1M', src: '/reels/10.mp4' },
  { id: 11, title: 'Podcast Highlights', views: '1.9M', src: '/reels/11.mp4' },
  { id: 12, title: 'Event Recap', views: '3.4M', src: '/reels/12.mp4' },
  { id: 13, title: 'Brand Anthem', views: '2.8M', src: '/reels/13.mp4' },
  { id: 14, title: 'Launch Trailer', views: '4.5M', src: '/reels/14.mp4' },
];

const ReelCard = ({ reel }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const videoRef = React.useRef(null);
  const progressRef = React.useRef(null);
  const isDragging = React.useRef(false);
  const [hasStarted, setHasStarted] = React.useState(false);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        setIsPlaying(true);
        if (!hasStarted) setHasStarted(true);
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Error attempting to play video:', error);
            setIsPlaying(false);
          });
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handlePlay = (e) => {
    setIsPlaying(true);
    if (!hasStarted) setHasStarted(true);
    // Pause all other videos on page
    document.querySelectorAll('video').forEach(vid => {
      if (vid !== e.target) vid.pause();
    });
  };

  const handlePause = () => setIsPlaying(false);

  const toggleMute = (e) => {
    e.stopPropagation();
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
      setCurrentTime(current);
      setDuration(total);
      if (total > 0) setProgress((current / total) * 100);
    }
  };

  const handleSeek = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      videoRef.current.currentTime = percentage * videoRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    isDragging.current = true;
    handleSeek(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    handleSeek(e);
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className="video-hover magnetic"
      onClick={togglePlay}
      onMouseMove={(e) => {
        if (isPlaying) return; // Disable tilt while playing
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        gsap.to(e.currentTarget, { rotateX, rotateY, duration: 0.8, ease: 'power3.out' });
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        gsap.to(e.currentTarget, { scale: 1, rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' });
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (!isPlaying) {
          gsap.to(e.currentTarget, { scale: 1.05, duration: 0.4, ease: 'power2.out', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', transformPerspective: 1000 });
        }
      }}
      style={{
        width: '100%',
        aspectRatio: '9/16',
        borderRadius: '24px',
        backgroundColor: '#111',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.05)',
        willChange: 'transform'
      }}
    >
      <video
        ref={videoRef}
        src={reel.src}
        poster={reel.src.replace('.mp4', '.jpg')}
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
          objectFit: 'cover',
          opacity: (isPlaying || hasStarted) ? 1 : 0.6,
          transition: 'opacity 0.4s ease'
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
          pointerEvents: 'none',
          border: '1px solid rgba(255,255,255,0.4)',
          zIndex: 10
        }}>
          <div style={{
            width: '0',
            height: '0',
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderLeft: '16px solid #fff',
            marginLeft: '4px'
          }} />
        </div>
      )}

      {hasStarted && (
        <>
          {/* Top Right Mute/Unmute Toggle */}
          <div 
            onClick={toggleMute}
            style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', zIndex: 20 }}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            )}
          </div>

          {/* Fullscreen Button */}
          <div 
            onClick={toggleFullscreen}
            style={{ position: 'absolute', top: '16px', right: '60px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', zIndex: 20 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
              <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
              <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
              <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
            </svg>
          </div>

          {/* Progress Bar Container - Apple Premium Glass Style */}
          <div 
            style={{ 
              position: 'absolute', 
              bottom: '32px', 
              left: '50%',
              transform: 'translateX(-50%)',
              width: '85%', 
              display: 'flex', 
              flexDirection: 'column',
              gap: '8px',
              zIndex: 20,
              opacity: (isPlaying && !isHovered) ? 0.5 : 1,
              transition: 'opacity 0.4s ease',
              pointerEvents: (isPlaying && !isHovered) ? 'none' : 'auto'
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Small Timing Above (Left Side Only) */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '0 8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem', fontWeight: 500, fontFamily: 'var(--font-body)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.5px' }}>
                {formatTime(currentTime)} <span style={{ opacity: 0.5, margin: '0 4px' }}>/</span> {formatTime(duration)}
              </span>
            </div>

            {/* Glass Pill Container - Pure Glassmorphism */}
            <div 
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                background: 'rgba(255, 255, 255, 0.15)', // Lighter, pure glass
                backdropFilter: 'blur(20px)', 
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: '24px',
                padding: '10px 18px',
                cursor: 'pointer', // Make the whole glass pill a clickable scrub area
                touchAction: 'none' // Prevent scrolling when dragging on mobile
              }}>
              {/* Scrubber */}
              <div 
                style={{ flex: 1, height: '16px', display: 'flex', alignItems: 'center' }}
                ref={progressRef} // Keep ref here for perfect math calculation
              >
                <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', position: 'relative' }}>
                  <div style={{ 
                    width: `${progress}%`, 
                    height: '100%', 
                    backgroundColor: '#ffffff',
                    transition: 'width 0.1s linear',
                    borderRadius: '4px',
                    position: 'relative'
                  }}>
                    {/* Seek Thumb / Handle */}
                    <div style={{
                      position: 'absolute',
                      right: '-6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)', // Very subtle shadow just to separate white on white
                    }} />
                  </div>
                </div>
              </div>

              {/* Replay */}
              <RotateCcw 
                size={16} 
                color="#fff" 
                style={{ cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s ease' }} 
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play();
                    setIsPlaying(true);
                  }
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function Reels({ onOpenVideo, onNavigate }) {
  const [showAll, setShowAll] = React.useState(false);
  const initialReels = REELS_DATA.slice(0, 6);
  const extraReels = REELS_DATA.slice(6);

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

  useEffect(() => {
    if (showAll && extraReels.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.extra-reel-card', 
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'expo.out',
            delay: 0.3 // Wait for container accordion to expand
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [showAll, extraReels.length]);

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

      {/* Top Main Reel Grid */}
      <div 
        ref={gridRef}
        id="reels-grid-top"
        className="reels-grid"
      >
        {initialReels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>

      {extraReels.length > 0 && (
        <>
          {/* Smooth Collapsing "View More" Button */}
          <div style={{
            display: 'grid',
            gridTemplateRows: showAll ? '0fr' : '1fr',
            transition: 'grid-template-rows 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
            opacity: showAll ? 0 : 1,
            pointerEvents: showAll ? 'none' : 'auto',
            marginTop: showAll ? '0px' : '60px'
          }}>
            <div style={{ overflow: 'hidden', textAlign: 'center' }}>
              <button 
                className="magnetic" 
                onClick={() => {
                  setShowAll(true);
                  setTimeout(() => ScrollTrigger.refresh(), 800);
                }}
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
                  display: 'inline-flex',
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
                View More Reels <ChevronDown size={20} />
              </button>
            </div>
          </div>

          {/* Expanding Extra Reels Accordion */}
          <div style={{
            display: 'grid',
            gridTemplateRows: showAll ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
            opacity: showAll ? 1 : 0,
            pointerEvents: showAll ? 'auto' : 'none',
          }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ paddingTop: showAll ? '40px' : '0px' }}>
                <div 
                  className="reels-grid"
                  style={{ marginBottom: '60px' }}
                >
                  {extraReels.map((reel) => (
                    <div key={reel.id} className="extra-reel-card">
                      <ReelCard reel={reel} />
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <button 
                    className="magnetic" 
                    onClick={() => {
                      // Fire premium GSAP exit animation before/during collapse
                      gsap.to('.extra-reel-card', {
                        y: -30,
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.4,
                        stagger: -0.05, // Stagger backwards
                        ease: 'power2.inOut'
                      });

                      setShowAll(false);
                      setTimeout(() => ScrollTrigger.refresh(), 800);
                      
                      // Wait for accordion to start collapsing before scrolling
                      setTimeout(() => {
                        const reelsGrid = document.getElementById('reels-grid-top');
                        if(reelsGrid) reelsGrid.scrollIntoView({ behavior: 'smooth', block: 'end' });
                      }, 500);
                    }}
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
                      display: 'inline-flex',
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
                    Show Less Reels <ChevronUp size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Navigation Buttons to other sections */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '100px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '60px' }}>
        <button 
          onClick={() => {
            if (onNavigate) onNavigate('work');
            else window.location.hash = 'work';
          }}
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
          View Work <ArrowUpRight size={20} />
        </button>

        <button 
          onClick={() => {
            if (onNavigate) onNavigate('thumbnails');
            else window.location.hash = 'thumbnails';
          }}
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

      <style>{`
        .reels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 900px;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .reels-grid {
            grid-template-columns: repeat(2, 1fr);
            max-width: 600px;
          }
        }
        @media (max-width: 600px) {
          .reels-grid {
            grid-template-columns: 1fr;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
}
