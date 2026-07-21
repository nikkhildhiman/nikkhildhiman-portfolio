import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function VideoModal({ isOpen, videoUrl, title, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(17, 17, 17, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '960px',
          backgroundColor: '#111111',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.3)'
        }}
      >
        {/* Modal Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#111111', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-blue)' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: '#FFFFFF', textTransform: 'uppercase' }}>
              {title || 'VIDEO PLAYER'}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Player Frame */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000000' }}>
          <video
            src={videoUrl}
            controls
            autoPlay
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Modal Footer Info */}
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontFamily: 'var(--font-heading)', color: '#888888', backgroundColor: '#111111' }}>
          <span>4K ULTRA HD MASTER • NIKHIL DHIMAN STUDIO</span>
          <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>PRESS 'ESC' TO CLOSE</span>
        </div>
      </div>
    </div>
  );
}
