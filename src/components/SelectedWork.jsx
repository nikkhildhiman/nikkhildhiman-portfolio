import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
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

const ARCHIVE_DATA = [
  {
    id: 101,
    title: 'Event Cinematic Promo',
    category: 'COMMERCIAL',
    client: 'JECRC Foundation',
    videoUrl: '/assets/concept-jecrc.mp4'
  },
  {
    id: 102,
    title: 'Social Story Flow',
    category: 'SOCIAL',
    client: 'Creator Collab',
    videoUrl: '/assets/instagranstory-2.mp4'
  },
  {
    id: 103,
    title: 'Creator Documentary',
    category: 'VLOG',
    client: 'Nikhil x Khushal',
    videoUrl: '/assets/Nikhil_x_Khushal.mp4'
  },
  {
    id: 104,
    title: 'Cinematic B-Roll',
    category: 'FILM',
    client: 'Independent',
    videoUrl: '/assets/girls-ree-4k.mp4'
  }
];

const CustomVideoCard = ({ project, isArchive = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const isDragging = useRef(false);
  const [hasStarted, setHasStarted] = useState(false);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

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
      setCurrentTime(current);
      setDuration(total);
      if (total > 0) {
        setProgress((current / total) * 100);
      }
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video 
        ref={videoRef}
        src={project.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'}
        poster={project.videoUrl ? project.videoUrl.replace('.mp4', '.jpg') : undefined}
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

      {/* Persistent Controls (Fade out when playing and not hovered) */}
      <div style={{
        opacity: (isPlaying && !isHovered) ? 0.5 : 1,
        transition: 'opacity 0.4s ease',
        pointerEvents: (isPlaying && !isHovered) ? 'none' : 'auto'
      }}>
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
                right: '60px',
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
                zIndex: 20 
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
    </div>
  );
};

export default function SelectedWork({ onOpenVideo, isWorkPage = false }) {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    // Elegant fade-in animation for cards as you scroll down normally
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.main-card');
      
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

  useEffect(() => {
    if (showArchive) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.archive-anim', 
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.2 // Wait for container to smoothly open
          }
        );
      }, sectionRef);
      return () => ctx.revert();
    }
  }, [showArchive]);

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

        {/* Expandable Archive Section (Only on Work Page) */}
        {isWorkPage && (
          <div style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            
            {/* The "View Archive" Button (Smoothly collapses when open) */}
            <div style={{
              display: 'grid',
              gridTemplateRows: showArchive ? '0fr' : '1fr',
              transition: 'grid-template-rows 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
              opacity: showArchive ? 0 : 1,
              pointerEvents: showArchive ? 'none' : 'auto',
            }}>
              <div style={{ overflow: 'hidden', textAlign: 'center' }}>
                <button 
                  className="magnetic" 
                  onClick={() => {
                    setShowArchive(true);
                    setTimeout(() => ScrollTrigger.refresh(), 800);
                  }}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(0,0,0,0.1)',
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
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  View Video Archive <ChevronDown size={20} />
                </button>
              </div>
            </div>

            {/* The Archive Grid (Smoothly expands when open) */}
            <div style={{
              display: 'grid',
              gridTemplateRows: showArchive ? '1fr' : '0fr',
              transition: 'grid-template-rows 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
              opacity: showArchive ? 1 : 0,
              pointerEvents: showArchive ? 'auto' : 'none',
            }}>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ paddingTop: showArchive ? '20px' : '0px', paddingBottom: '20px' }}>
                  <div className="archive-anim" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-black)', margin: 0, lineHeight: 1, textTransform: 'uppercase', fontWeight: 800 }}>
                      VIDEO <span style={{ color: 'var(--text-muted)' }}>ARCHIVE</span>
                    </h3>
                  </div>
                  
                  <div 
                    className="archive-anim"
                    style={{
                      width: '100%',
                      height: '300px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      border: '1px dashed rgba(0,0,0,0.1)',
                      borderRadius: '24px',
                      marginBottom: '60px'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                      COMING SOON
                    </div>
                  </div>

                  <div className="archive-anim" style={{ textAlign: 'center' }}>
                    <button 
                      className="magnetic" 
                      onClick={() => {
                        // Smooth GSAP exit animation (staggered backwards)
                        gsap.to('.archive-anim', {
                          y: -20,
                          opacity: 0,
                          duration: 0.4,
                          stagger: -0.1, 
                          ease: 'power2.inOut'
                        });

                        setShowArchive(false);
                        setTimeout(() => ScrollTrigger.refresh(), 800);
                        
                        setTimeout(() => {
                          const section = document.getElementById('work');
                          if(section) section.scrollIntoView({ behavior: 'smooth' });
                        }, 500);
                      }}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(0,0,0,0.1)',
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
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Close Archive <ChevronUp size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
