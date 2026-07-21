import React from 'react';
import { Calendar, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer({ onNavigate, onOpenBooking }) {
  return (
    <footer style={{ backgroundColor: 'var(--color-black)', color: '#ffffff', paddingTop: '100px', paddingBottom: '40px', borderTop: '2px solid var(--color-black)' }}>
      <div className="container">
        
        {/* Contact One Sentence Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '80px' }}>
          <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-blue)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
            START A PROJECT
          </div>

          <h2 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.8rem)', color: '#ffffff', lineHeight: 1.05, fontWeight: 800, textTransform: 'uppercase', marginBottom: '36px' }}>
            LET'S CREATE SOMETHING <br />
            <span style={{ color: 'var(--accent-blue)' }}>WORTH REMEMBERING.</span>
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-lime" onClick={onOpenBooking} style={{ borderRadius: '9999px', padding: '14px 32px' }}>
              <Calendar size={18} />
              <span>Book Project</span>
            </button>

            <a href="mailto:nikhil@studio.com" className="btn-primary" style={{ borderRadius: '9999px', padding: '14px 32px', backgroundColor: 'transparent', borderColor: '#ffffff', color: '#ffffff' }}>
              <Mail size={18} />
              <span>Email Direct</span>
            </a>

            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn-primary" style={{ borderRadius: '9999px', padding: '14px 32px', backgroundColor: 'transparent', borderColor: '#ffffff', color: '#ffffff' }}>
              <span>Instagram</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        {/* Minimal Footer Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.88rem', fontFamily: 'var(--font-heading)', color: '#888888' }}>
          <div style={{ fontWeight: 700, color: '#ffffff' }}>
            NIKHIL DHIMAN
          </div>

          <div>
            Creative Editor & Visual Storyteller
          </div>

          <div>
            Made with care. • 2026
          </div>
        </div>

      </div>
    </footer>
  );
}
