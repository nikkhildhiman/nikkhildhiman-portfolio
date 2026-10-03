import React, { useEffect } from 'react';
import { X, Mail, Phone, Instagram, ArrowUpRight } from 'lucide-react';

export default function BookingModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-main)', // Full screen takeover
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        animation: 'modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'max(40px, calc(20px + env(safe-area-inset-top))) 24px 24px 24px', borderBottom: '1px solid var(--glass-border)' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          CONTACT & BOOKING
        </span>
        
        <button 
          onClick={onClose}
          style={{ 
            width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-black)', color: 'var(--bg-main)', 
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '720px', position: 'relative', textAlign: 'center' }}>
          <div className="form-step-enter" style={{ width: '100%' }}>
            
            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-black)', marginBottom: '16px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              LET'S TALK.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '64px', maxWidth: '400px', margin: '0 auto 64px auto', lineHeight: 1.5 }}>
              Currently accepting new projects. Reach out directly to discuss your next visual story.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              
              <a 
                href="mailto:hello@ndproductions.com"
                className="contact-card-link"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', maxWidth: '480px', padding: '24px 32px',
                  border: '1px solid var(--glass-border)', borderRadius: '100px',
                  textDecoration: 'none', color: 'var(--color-black)',
                  transition: 'all 0.3s ease', cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Mail size={24} />
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.2rem' }}>hello@ndproductions.com</span>
                </div>
                <ArrowUpRight size={20} />
              </a>

              <a 
                href="https://wa.me/919876543210"
                target="_blank" rel="noopener noreferrer"
                className="contact-card-link"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', maxWidth: '480px', padding: '24px 32px',
                  border: '1px solid var(--glass-border)', borderRadius: '100px',
                  textDecoration: 'none', color: 'var(--color-black)',
                  transition: 'all 0.3s ease', cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Phone size={24} />
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.2rem' }}>WhatsApp</span>
                </div>
                <ArrowUpRight size={20} />
              </a>

              <a 
                href="https://instagram.com/nikkhildhiman"
                target="_blank" rel="noopener noreferrer"
                className="contact-card-link"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', maxWidth: '480px', padding: '24px 32px',
                  border: '1px solid var(--glass-border)', borderRadius: '100px',
                  textDecoration: 'none', color: 'var(--color-black)',
                  transition: 'all 0.3s ease', cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Instagram size={24} />
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.2rem' }}>@nikkhildhiman</span>
                </div>
                <ArrowUpRight size={20} />
              </a>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-step-enter {
          animation: modalFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .contact-card-link:hover {
          border-color: var(--color-black) !important;
          background-color: var(--color-black) !important;
          color: var(--bg-main) !important;
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
}
