import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function NDLandingPreloader({ onComplete }) {
  const containerRef = useRef(null);
  const titleWrapperRef = useRef(null);
  const titleRef = useRef(null);
  const heroImageRef = useRef(null);
  const secondaryImagesRef = useRef([]);
  const topMetaRef = useRef(null);
  const bottomMetaRef = useRef(null);
  const infoCardRef = useRef(null);
  const badgeRef = useRef(null);
  const bgRef = useRef(null);
  const compositionRef = useRef(null);

  // Exact 5 curated images
  const images = [
    { src: '/assets/concept-jecrc.jpg', type: 'hero' }, // Dominant hero
    { src: '/assets/girls-ree-4k.jpg', type: 'secondary' },
    { src: '/assets/Nikkhil_x_socialz_2.jpg', type: 'secondary' },
    { src: '/assets/YEH_DIL_FOR_JECRC.jpg', type: 'secondary' },
    { src: '/assets/Sequence_01_25.jpg', type: 'secondary' },
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }
      });

      if (prefersReducedMotion) {
        tl.to(containerRef.current, { opacity: 0, duration: 0.5, delay: 1 });
        return;
      }

      // 1. Top & Bottom Meta fades in quickly
      tl.fromTo([topMetaRef.current, bottomMetaRef.current], 
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' },
        '+=0.1'
      );

      // 2. Slow mask reveal for the giant wordmark
      tl.fromTo(titleWrapperRef.current,
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', y: 50 },
        { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)', y: 0, duration: 1.5, ease: 'expo.out' },
        '-=0.5'
      );

      // 3. Reveal Hero Image
      tl.fromTo(heroImageRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' },
        '-=0.8'
      );

      // 4. Reveal Secondary Images with subtle stagger
      tl.fromTo(secondaryImagesRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power2.out' },
        '-=0.8'
      );

      // 5. Reveal small editorial details (info card, badge)
      tl.fromTo([infoCardRef.current, badgeRef.current],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power2.out' },
        '-=0.6'
      );

      // 6. Pause for admiration
      tl.to({}, { duration: 1.2 });

      // 7. Transition Out (Editorial up-shift and background wipe)
      tl.to(compositionRef.current, {
        y: '-10vh',
        opacity: 0,
        duration: 1.2,
        ease: 'power3.inOut'
      }, 'exit');

      tl.to(bgRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut'
      }, 'exit+=0.1');

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        pointerEvents: 'none',
        color: '#F7F5F2'
      }}
    >
      {/* Background */}
      <div 
        ref={bgRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: '#111111',
          zIndex: -1
        }}
      />

      <div 
        ref={compositionRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 32px'
        }}
      >
        
        {/* TOP METADATA */}
        <div 
          ref={topMetaRef}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: '#B8B5B0',
            fontFamily: 'var(--font-heading)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            width: '100%'
          }}
        >
          <div style={{ color: '#F7F5F2' }}>NDProductions</div>
          <div style={{ color: '#F7F5F2' }}>[ 2026 ]</div>
          <div>Creative Practice</div>
        </div>

        {/* CENTRAL EDITORIAL COMPOSITION */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%', // Takes up a massive chunk of viewport
          height: '80%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          {/* GIANT WORDMARK (Sitting in the middle, behind some elements, in front of others) */}
          <div 
            ref={titleWrapperRef} 
            style={{ 
              position: 'absolute', 
              zIndex: 3, 
              width: '100%', 
              textAlign: 'center' 
            }}
          >
            <h1 
              ref={titleRef}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(5rem, 13vw, 15vw)', // Huge
                fontWeight: 900,
                color: '#F7F5F2',
                margin: 0,
                lineHeight: 0.85,
                letterSpacing: '-0.06em',
                whiteSpace: 'nowrap',
                // Text shadow to help it lift if images are behind it
                textShadow: '0 10px 40px rgba(0,0,0,0.4)' 
              }}
            >
              NDProductions
            </h1>
          </div>

          {/* ARTWORK COLLAGE (Asymmetrical, integrated) */}

          {/* 1. Background Secondary (Left) */}
          <div
            ref={el => secondaryImagesRef.current[0] = el}
            style={{
              position: 'absolute',
              top: '15%',
              left: '5%',
              width: '20vw',
              height: '25vw',
              backgroundImage: `url(${images[1].src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1, // Behind title
              opacity: 0.8
            }}
          />

          {/* 2. Secondary Graphic (Right edge, behind title) */}
          <div
            ref={el => secondaryImagesRef.current[1] = el}
            style={{
              position: 'absolute',
              top: '20%',
              right: '2%',
              width: '18vw',
              height: '12vw',
              backgroundImage: `url(${images[3].src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 2, // Behind title
              border: '1px solid rgba(247,245,242,0.1)'
            }}
          />

          {/* 3. THE HERO IMAGE (Dominant, crossing the title) */}
          <div
            ref={heroImageRef}
            style={{
              position: 'absolute',
              top: '40%',
              left: '20%',
              width: '40vw', // Massive visual anchor
              height: '22.5vw', // 16:9 approx
              backgroundImage: `url(${images[0].src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 10, // In front of title
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid #F7F5F2'
            }}
          />

          {/* 4. Front Secondary (Overlapping Hero bottom right) */}
          <div
            ref={el => secondaryImagesRef.current[2] = el}
            style={{
              position: 'absolute',
              top: '60%',
              right: '20%',
              width: '15vw',
              height: '20vw',
              backgroundImage: `url(${images[2].src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 12, // In front of hero
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          />

          {/* 5. Front Tiny Secondary (Bottom left) */}
          <div
            ref={el => secondaryImagesRef.current[3] = el}
            style={{
              position: 'absolute',
              top: '70%',
              left: '15%',
              width: '12vw',
              height: '7vw',
              backgroundImage: `url(${images[4].src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 15,
              border: '1px solid rgba(247,245,242,0.2)'
            }}
          />

          {/* EDITORIAL DETAILS */}

          {/* Info Card (Tiny, physical index card) */}
          <div 
            ref={infoCardRef}
            style={{
              position: 'absolute',
              top: '25%',
              left: '28%',
              backgroundColor: '#F7F5F2',
              color: '#111111',
              padding: '12px 16px',
              width: '160px', // Exact spec
              zIndex: 20, // Top layer
            }}
          >
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '8px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#111111', // Black text on warm paper
              marginBottom: '10px'
            }}>
              NDPRODUCTIONS<br/>
              CREATIVE PRACTICE
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '9px',
              lineHeight: 1.6,
              fontWeight: 600,
              color: '#111111'
            }}>
              FILM<br/>
              SHORT-FORM<br/>
              GRAPHICS<br/>
              THUMBNAILS
            </div>
            {/* Tiny Terracotta Accent */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              width: '6px',
              height: '6px',
              backgroundColor: '#B5462A'
            }} />
          </div>

          {/* Editorial Year Stamp */}
          <div 
            ref={badgeRef}
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              color: '#B8B5B0',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '10px', color: '#F7F5F2', letterSpacing: '0.05em' }}>
              2026
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '9px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Selected Work
            </span>
          </div>

        </div>

        {/* BOTTOM METADATA */}
        <div 
          ref={bottomMetaRef}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: '#B8B5B0',
            fontFamily: 'var(--font-heading)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            width: '100%',
            marginTop: 'auto'
          }}
        >
          <div>Creative Archive</div>
          <div style={{ color: '#F7F5F2' }}>[ Selected ]</div>
          <div>NDProductions</div>
        </div>

      </div>
    </div>
  );
}
