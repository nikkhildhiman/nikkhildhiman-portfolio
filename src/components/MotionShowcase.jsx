import React, { useRef, useState } from 'react';
import { Play } from 'lucide-react';

const MOTION_ITEMS = [
  {
    id: 1,
    title: '3D Product Title Reveal & Kinetic MOGRT',
    category: '3D VFX & Motion Graphics',
    software: 'After Effects • Cinema 4D',
    duration: '00:15',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    description: 'Dynamic spatial typography with light sweeps and organic sound sync.'
  },
  {
    id: 2,
    title: 'Kinetic Text & Pattern Interrupt Animations',
    category: 'Retention Motion Design',
    software: 'Premiere Pro • Illustrator',
    duration: '00:22',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    description: 'Pacing interrupts engineered to prevent drop-off during complex narrative shifts.'
  },
  {
    id: 3,
    title: 'HUD Graphic Overlays & Sci-Fi Tracking',
    category: 'Commercial VFX',
    software: 'Davinci Resolve • Fusion',
    duration: '00:18',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    poster: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    description: 'Planar tracking with glow passes, custom UI indicators, and futuristic HUD elements.'
  }
];

function MotionCard({ item, onPlayVideo }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="apple-card interactive"
      style={{ gridColumn: 'span 4', padding: 0 }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (videoRef.current) videoRef.current.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <div
        onClick={() => onPlayVideo(item.videoUrl, item.title)}
        style={{ position: 'relative', height: '220px', overflow: 'hidden', cursor: 'pointer', borderBottom: '1px solid var(--hairline)' }}
      >
        <img src={item.poster} alt={item.title} className="img-apple" style={{ display: isHovered ? 'none' : 'block' }} />
        <video ref={videoRef} src={item.videoUrl} muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: isHovered ? 'block' : 'none' }} />

        <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '12px', fontWeight: 600 }}>
          {item.category}
        </div>

        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isHovered ? 1 : 0, transition: 'opacity 0.25s ease' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Play size={22} color="#ffffff" style={{ marginLeft: '3px' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '12px', color: 'var(--primary-blue)', fontWeight: 600, marginBottom: '6px' }}>
          {item.software}
        </div>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-ink)', fontWeight: 600, marginBottom: '8px' }}>
          {item.title}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function MotionShowcase({ onPlayVideo }) {
  return (
    <section className="section-padding tile-parchment">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="display-lg" style={{ marginBottom: '12px' }}>
            Motion Graphics & 3D Art.
          </h2>
          <p className="lead" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Custom kinetic elements, 3D title reveals, and pattern interrupts.
          </p>
        </div>

        <div className="grid-12">
          {MOTION_ITEMS.map((item) => (
            <MotionCard key={item.id} item={item} onPlayVideo={onPlayVideo} />
          ))}
        </div>
      </div>
    </section>
  );
}
