import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ThumbnailGallery({ onNavigate }) {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current || !sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      const cards = gridRef.current.children;
      
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
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

  // Using the 10 real thumbnails provided from the archive folder + 2 new ones
  const thumbnails = [
    { id: 1, img: '/assets/thumbnails/141.jpg', title: 'High-CTR Concept 01' },
    { id: 2, img: '/assets/thumbnails/2025.jpg', title: 'High-CTR Concept 02' },
    { id: 3, img: '/assets/thumbnails/ANKUSH BIKE.jpg', title: 'High-CTR Concept 03' },
    
    // Second Row
    { id: 4, img: '/assets/thumbnails/kill chest fat (1).jpg', title: 'High-CTR Concept 04' },
    { id: 5, img: '/assets/thumbnails/Artboard 5 (1).jpg', title: 'High-CTR Concept 05' },
    { id: 6, img: '/assets/thumbnails/bestcollege-1 (3).jpg', title: 'High-CTR Concept 06' },
    
    // Rest of the grid
    { id: 7, img: '/assets/thumbnails/RAJAT.jpg', title: 'High-CTR Concept 07' },
    { id: 8, img: '/assets/thumbnails/giftsss.jpg', title: 'High-CTR Concept 08' },
    { id: 9, img: '/assets/thumbnails/khalisthani-2.jpg', title: 'High-CTR Concept 09' },
    { id: 10, img: '/assets/thumbnails/podcast22-final1.jpg', title: 'High-CTR Concept 10' },
    { id: 11, img: '/assets/thumbnails/podcastfinal.jpg', title: 'High-CTR Concept 11' },
    { id: 12, img: '/assets/thumbnails/tarun gill.jpg', title: 'High-CTR Concept 12' },
  ];

  return (
    <section ref={sectionRef} className="section-padding" style={{ backgroundColor: 'var(--color-surface)', minHeight: 'auto', paddingBottom: '0px' }}>
      <div className="container">


        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-white)', margin: 0, lineHeight: 1, fontWeight: 900, textTransform: 'uppercase' }}>
            THE <span style={{ color: '#E4FF00' }}>ARCHIVE</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '16px auto 0' }}>
            A curated archive of high-converting thumbnail cutouts engineered for maximum visual impact and click-through rates.
          </p>
        </div>

        <div 
          ref={gridRef}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '32px' 
          }}
        >
          {thumbnails.map((thumb) => (
            <div 
              key={thumb.id}
              className="thumbnail-card"
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                aspectRatio: '16/9',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                e.currentTarget.querySelector('.thumbnail-overlay').style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                e.currentTarget.querySelector('.thumbnail-overlay').style.opacity = '0';
              }}
            >
              <img 
                src={thumb.img} 
                alt={thumb.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
