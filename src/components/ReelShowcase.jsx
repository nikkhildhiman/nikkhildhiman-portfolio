import React, { useRef, useState } from 'react';
import { Play, Eye, Smartphone, Zap } from 'lucide-react';

const REEL_ITEMS = [
  {
    id: 1,
    title: "Viral Creator Growth Reel",
    views: "8.9M",
    duration: "00:58",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
    niche: "Short-Form Growth"
  },
  {
    id: 2,
    title: "Commercial Kinetic Energy",
    views: "4.2M",
    duration: "00:45",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    niche: "Paid Meta Ad"
  },
  {
    id: 3,
    title: "Esports Tournament Hook",
    views: "3.5M",
    duration: "00:30",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    niche: "Event Promo"
  }
];

function IPhoneDeviceCard({ reel, onPlayVideo }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="interactive"
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
      onClick={() => onPlayVideo(reel.videoUrl, reel.title)}
      style={{
        gridColumn: 'span 4',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: isHovered ? 'scale(1.04) translateY(-6px)' : 'scale(1)',
        transition: 'transform 0.4s var(--ease-elastic)',
        cursor: 'pointer'
      }}
    >
      {/* Floating 9:16 iPhone Frame */}
      <div
        style={{
          width: '240px',
          height: '460px',
          backgroundColor: '#111111',
          borderRadius: '36px',
          padding: '10px',
          boxShadow: isHovered ? '0 20px 50px rgba(0,0,0,0.25)' : '0 10px 30px rgba(0,0,0,0.12)',
          border: '4px solid #111111',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Dynamic Island Notch */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70px',
            height: '18px',
            backgroundColor: '#000000',
            borderRadius: '12px',
            zIndex: 10
          }}
        />

        {/* Video Screen Container */}
        <div style={{ width: '100%', height: '100%', borderRadius: '28px', overflow: 'hidden', position: 'relative' }}>
          <img
            src={reel.poster}
            alt={reel.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: isHovered ? 'none' : 'block' }}
          />

          <video
            ref={videoRef}
            src={reel.videoUrl}
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: isHovered ? 'block' : 'none' }}
          />

          {/* Overlaid Details */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px 16px 16px 16px'
            }}
          >
            <div style={{ alignSelf: 'flex-start', backgroundColor: '#D9FF00', color: '#111111', padding: '3px 8px', borderRadius: 'var(--radius-pill)', fontSize: '10px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              ⚡ {reel.niche}
            </div>

            <div>
              <div style={{ color: '#ffffff', fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '6px' }}>
                {reel.title}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ECE9E2', fontFamily: 'var(--font-heading)' }}>
                <span>👁 {reel.views} Views</span>
                <span>⏱ {reel.duration}</span>
              </div>
            </div>
          </div>

          {/* Center Hover Play Icon */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.25s ease'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#D9FF00', color: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={22} fill="#111111" style={{ marginLeft: '2px' }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ReelShowcase({ onPlayVideo }) {
  return (
    <section className="section-padding tile-parchment" style={{ borderTop: '2px solid #111111' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', backgroundColor: '#111111', color: '#D9FF00', fontFamily: 'var(--font-heading)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px' }}>
            <Smartphone size={14} />
            <span>9:16 VERTICAL REELS ENGINE</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: '#111111', textTransform: 'uppercase' }}>
            REEL <span style={{ backgroundColor: '#D9FF00', color: '#111111', padding: '0 8px' }}>SHOWCASE</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#4A4A4A', maxWidth: '600px', margin: '8px auto 0 auto' }}>
            Hover to preview silent vertical loops. Click any device to launch the 4K video player.
          </p>
        </div>

        <div className="grid-12" style={{ alignItems: 'center' }}>
          {REEL_ITEMS.map((reel) => (
            <IPhoneDeviceCard key={reel.id} reel={reel} onPlayVideo={onPlayVideo} />
          ))}
        </div>

      </div>
    </section>
  );
}
