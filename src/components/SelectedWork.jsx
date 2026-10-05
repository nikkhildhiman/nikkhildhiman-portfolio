import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggeredReveal } from '../utils/motion';

gsap.registerPlugin(ScrollTrigger);

const PORTFOLIO_DATA = [
  {
    id: 1,
    title: 'OLD CITY X JU',
    category: 'CAMPAIGN',
    thumbnailUrl: '/assets/concept-jecrc.jpg',
    videoUrl: '/assets/concept-jecrc.mp4'
  },
  {
    id: 2,
    title: 'YE DIL X JU',
    category: 'MUSIC VIDEO',
    thumbnailUrl: '/assets/YEH_DIL_FOR_JECRC.jpg',
    videoUrl: '/assets/YEH_DIL_FOR_JECRC.mp4'
  },
  {
    id: 3,
    title: 'CINEMATIC EDIT',
    category: 'CINEMATIC',
    thumbnailUrl: '/assets/Sequence_01_25.jpg',
    videoUrl: '/assets/Sequence_01_25.mp4'
  },
  {
    id: 4,
    title: 'SOCIALZ DOCUMENTARY',
    category: 'DOCUMENTARY',
    thumbnailUrl: '/assets/Nikkhil_x_socialz_2.jpg',
    videoUrl: '/assets/Nikkhil_x_socialz_2.MP4'
  },
  {
    id: 5,
    title: 'JAIPUR X CREATORS',
    category: 'ADS',
    thumbnailUrl: '/assets/Nikhil_x_Khushal.jpg',
    videoUrl: '/assets/Nikhil_x_Khushal.mp4'
  },
  {
    id: 6,
    title: 'MIDNIGHT RUN',
    category: 'SHORT FILM',
    thumbnailUrl: '/assets/girls-ree-4k.jpg',
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
  const [isLoaded, setIsLoaded] = useState(false);
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
      } else if (videoRef.current.webkitEnterFullscreen) {
        // iOS Safari specifically for video elements
        videoRef.current.webkitEnterFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
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
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.3)' : '0 12px 32px rgba(0,0,0,0.08)',
        border: isHovered ? '1px solid rgba(255,255,255,0.15)' : '1px solid var(--glass-border)',
        transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer'
      }}
      onClick={togglePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="smooth-spinner" style={{ opacity: isLoaded ? 0 : 1, transition: 'opacity 0.5s ease', zIndex: 1 }} />
      <video 
        ref={videoRef}
        src={project.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'}
        poster={project.videoUrl ? project.videoUrl.replace('.mp4', '.jpg') : undefined}
        playsInline
        preload="metadata"
        muted={isMuted}
        onLoadedData={() => setIsLoaded(true)}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: isLoaded ? 0.9 : 0,
          backgroundColor: 'transparent',
          zIndex: 2,
          position: 'relative',
          transition: 'opacity 0.8s ease'
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

      {/* Persistent Controls (Fade out when playing and not hovered/on mobile) */}
      <div style={{
        opacity: (isPlaying && (!isHovered || (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches))) ? 0.5 : 1,
        transition: 'opacity 0.4s ease',
        pointerEvents: (isPlaying && (!isHovered || (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches))) ? 'none' : 'auto'
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

const AccordionVideoItem = ({ project, isActive, onActivate, onOpenVideo, shouldAutoUnmute, forceMute }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const isDragging = useRef(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef(null);

  const resetIdle = () => {
    setIsIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), 3000);
  };

  useEffect(() => {
    if (isActive) {
      resetIdle();
      if (shouldAutoUnmute) {
        setIsMuted(false);
      }
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        if (shouldAutoUnmute) {
          videoRef.current.muted = false;
        }
        videoRef.current.play().catch(e => console.log(e));
        setIsPlaying(true);
      }
    } else {
      clearTimeout(idleTimer.current);
      setIsIdle(false);
      setIsMuted(true);
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(idleTimer.current);
  }, [isActive, shouldAutoUnmute]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = forceMute || isMuted;
    }
  }, [forceMute, isMuted]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!isActive) {
      onActivate();
      return;
    }
    if (videoRef.current) {
      if (videoRef.current.paused) {
        setIsPlaying(true);
        videoRef.current.play().catch(e => console.log(e));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitEnterFullscreen) {
        videoRef.current.webkitEnterFullscreen();
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
      onClick={(e) => {
        if (!isActive) {
          onActivate();
        }
      }}
      onMouseMove={isActive ? resetIdle : undefined}
      onMouseLeave={() => {
        if (isActive) {
          setIsIdle(true);
        }
      }}
      className={`accordion-item ${isActive ? 'active' : ''}`}
      style={{
        position: 'relative',
        flex: isActive ? 6 : 1,
        borderRadius: '24px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'flex 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        border: isActive ? '1px solid var(--color-black)' : '1px solid var(--glass-border)'
      }}
    >
      {/* Background Video with Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
        <video 
          ref={videoRef}
          src={project.videoUrl} 
          autoPlay 
          muted={isMuted} 
          loop 
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
          style={{
            width: '100%',
            height: '100%',
            objectFit: isActive ? 'contain' : 'cover',
            backgroundColor: '#000',
            transform: isActive ? 'scale(1)' : 'scale(1.2)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), filter 1.2s ease',
            filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)'
          }}
        />
        {/* Gradient Overlay for Text Readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(17,17,17,0.9) 0%, rgba(17,17,17,0.4) 40%, transparent 100%)',
          opacity: isActive ? 1 : 0.6,
          transition: 'opacity 0.8s ease',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Content Overlay */}
      <div className="accordion-content-overlay" style={{
        position: 'absolute',
        inset: 0,
        padding: '32px 32px 80px 32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 1,
        opacity: isActive ? (isIdle ? 0 : 1) : 1,
        transition: 'opacity 0.8s ease',
        pointerEvents: 'none'
      }}>
        
        {/* Category */}
        <div 
          className={`accordion-category ${isActive ? 'active' : ''}`}
          style={{
          fontFamily: "'Melodrama', serif",
          fontSize: '1rem',
          fontWeight: 600,
          fontStyle: 'italic',
          letterSpacing: '0.05em',
          color: '#E4FF00',
          textTransform: 'lowercase',
          transition: 'all 0.4s ease',
          alignSelf: 'center',
          textAlign: 'center'
        }}>
          {project.category}
        </div>

        {/* Bottom Content - Text made smaller and pushed down */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            margin: 0,
            color: 'var(--color-black)'
          }}>
            {project.title}
          </h3>
        </div>
      </div>

      {/* Video Controls (Only show when active) */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '32px',
        right: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 10,
        opacity: isActive ? (isIdle ? 0 : 1) : 0,
        pointerEvents: isActive ? (isIdle ? 'none' : 'auto') : 'none',
        transition: 'opacity 0.6s ease'
      }}>
        {/* Play/Pause Button */}
        <div 
          onClick={togglePlay}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#E4FF00" stroke="#E4FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#E4FF00" stroke="#E4FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          )}
        </div>

        {/* Progress Bar Container */}
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ 
            flex: 1,
            display: 'flex', 
            alignItems: 'center', 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)', 
            border: '1px solid rgba(255,255,255,0.2)', 
            borderRadius: '24px',
            padding: '12px 16px',
            cursor: 'pointer',
            touchAction: 'none'
          }}
        >
          <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', position: 'relative' }} ref={progressRef}>
            <div style={{ 
              width: `${progress}%`, 
              height: '100%', 
              backgroundColor: '#E4FF00',
              transition: 'width 0.1s linear',
              borderRadius: '4px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                backgroundColor: '#E4FF00',
                borderRadius: '50%',
              }} />
            </div>
          </div>
        </div>

        {/* Mute Toggle */}
        <div 
          onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          {isMuted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          )}
        </div>

        {/* Fullscreen Button */}
        <div 
          onClick={toggleFullscreen}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"></path><path d="M21 8V5a2 2 0 0 0-2-2h-3"></path><path d="M3 16v3a2 2 0 0 0 2 2h3"></path><path d="M16 21h3a2 2 0 0 0 2-2v-3"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default function SelectedWork({ onOpenVideo, isWorkPage = false }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const [showArchive, setShowArchive] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setIsInView(entry.isIntersecting);
      });
    }, { threshold: 0.1 });
    
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Elegant fade-in animation for cards as you scroll down normally
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.main-card');
      staggeredReveal(cards, 0.1, 0);

      // Letter Flip Animation
      gsap.fromTo('.title-char',
        { y: 30, rotationX: -90, opacity: 0 },
        {
          y: 0,
          rotationX: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.04,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
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
        <div ref={titleRef} style={{ marginBottom: '40px', overflow: 'hidden', paddingBottom: '10px', perspective: '800px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 700, display: 'flex', gap: '12px' }}>
            <span style={{ 
              display: 'inline-block', 
              color: 'var(--color-black)'
            }}>
              {"Selected".split("").map((char, i) => (
                <span key={`t1-${i}`} className="title-char" style={{ display: 'inline-block' }}>{char}</span>
              ))}
            </span>
            
            <span style={{ 
              display: 'inline-block', 
              color: '#ffffff',
              fontFamily: '"Instrument Serif", "Playfair Display", serif',
              fontStyle: 'italic',
              fontWeight: 400
            }}>
              {"works".split("").map((char, i) => (
                <span key={`t2-${i}`} className="title-char" style={{ display: 'inline-block' }}>{char}</span>
              ))}
            </span>
          </h2>
        </div>

        {isWorkPage ? (
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
        ) : (
          <div className="accordion-container">
            {PORTFOLIO_DATA.slice(0, 5).map((project, idx) => (
              <AccordionVideoItem 
                key={project.id}
                project={project}
                isActive={activeIdx === idx}
                shouldAutoUnmute={userHasInteracted}
                forceMute={!isInView}
                onActivate={() => {
                  setUserHasInteracted(true);
                  setActiveIdx(idx);
                }}
                onOpenVideo={onOpenVideo}
              />
            ))}
          </div>
        )}

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
        .accordion-container {
          flex: 1;
          display: flex;
          width: 100%;
          height: 75vh;
          gap: 12px;
          flex-direction: row;
        }
        .accordion-item {
          height: 100%;
          width: auto;
        }
        .accordion-category {
          writing-mode: vertical-rl;
        }
        .accordion-category.active {
          writing-mode: horizontal-tb;
        }
        @media (max-width: 1024px) {
          .portfolio-normal-grid {
            grid-template-columns: 1fr !important;
          }
          .accordion-container {
            flex-direction: column !important;
            height: 85vh !important;
          }
          .accordion-item {
            width: 100% !important;
            height: auto !important;
          }
          .accordion-category {
            writing-mode: horizontal-tb !important;
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
