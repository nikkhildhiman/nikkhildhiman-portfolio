import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { THUMBNAIL_SHOWCASE } from '../data/portfolioData';
import { Eye, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Sub-component for individual 3D Tilt Cards
const ThumbnailCard = ({ data, index }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !imageRef.current || !contentRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top;  // y position within the element.
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8; // Max 8 degree tilt
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(imageRef.current, {
      rotateX,
      rotateY,
      scale: 1.05,
      duration: 0.8,
      ease: 'power3.out',
      transformPerspective: 1000
    });

    // Subtly parallax the text overlay
    gsap.to(contentRef.current, {
      x: (x - centerX) * 0.05,
      y: (y - centerY) * 0.05,
      duration: 0.8,
      ease: 'power3.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to([imageRef.current, contentRef.current], {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  return (
    <div 
      ref={cardRef}
      className="project-card" // Hooks into Custom Cursor for "VIEW" label
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        position: 'relative', 
        borderRadius: 'var(--radius-md)', 
        overflow: 'hidden',
        cursor: 'none', // Managed by Custom Cursor
        aspectRatio: '16/9',
        backgroundColor: '#111'
      }}
    >
      {/* 3D Tilting Image */}
      <img
        ref={imageRef}
        src={data.afterImg}
        alt={data.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transformOrigin: 'center center',
          willChange: 'transform'
        }}
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
        pointerEvents: 'none'
      }} />

      {/* Floating Content Parallax Layer */}
      <div 
        ref={contentRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '32px',
          color: '#ffffff',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ backgroundColor: 'var(--primary-blue)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase' }}>
            {data.category}
          </span>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase' }}>
            {data.ctrBoost}
          </span>
        </div>
        
        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
          {data.title}
        </h3>

        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={14} /> {data.viewsGenerated}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><TrendingUp size={14} /> CTR Optimized</div>
        </div>
      </div>
    </div>
  );
};

export default function ThumbnailShowcase() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current || !sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      const cards = gridRef.current.children;
      
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding tile-light" style={{ backgroundColor: '#F8F8F6' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="apple-pill-tag" style={{ marginBottom: '16px', display: 'inline-block' }}>
            <span>Thumbnail Design Archive</span>
          </div>
          <h2 className="display-lg" style={{ marginBottom: '16px' }}>
            High-CTR Engine.
          </h2>
          <p className="lead" style={{ maxWidth: '640px', margin: '0 auto' }}>
            A curated archive of high-converting thumbnails engineered through color psychology, deep contrast, and narrative curiosity.
          </p>
        </div>

        {/* Animated Archive Grid */}
        <div 
          ref={gridRef}
          className="thumbnail-showcase-grid"
          style={{ 
            display: 'grid', 
            gap: '32px' 
          }}
        >
          {THUMBNAIL_SHOWCASE.map((item, idx) => (
            <ThumbnailCard key={item.id} data={item} index={idx} />
          ))}
        </div>

      </div>

      <style>{`
        .thumbnail-showcase-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 768px) {
          .thumbnail-showcase-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
