import React, { useState } from 'react';
import { Camera, Image, Layers, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';

const DIRECTION_PROJECTS = [
  {
    id: 'dir-1',
    title: 'Cyberpunk Tech Commercial',
    client: 'Nexus Tech Studio',
    moodboard: ['Neon Haze', 'Anamorphic Flares', 'Industrial Brutalism', 'Kodak 2383 LUT'],
    shotList: [
      'Shot 01: Low angle extreme close-up of camera lens',
      'Shot 02: 360-degree orbital camera move around hardware',
      'Shot 03: Whip pan to high-velocity typography reveal'
    ],
    storyboardImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    cameraSetup: 'RED V-Raptor 8K VV + Atlas Orion Anamorphic Primes',
    lighting: 'Aputure 600d Pro key light through 4x4 grid cloth + tube accents',
    outcome: '$1.4M Direct Pre-Orders within 48 hours of launch'
  },
  {
    id: 'dir-2',
    title: 'Iceland Wilderness Documentary',
    client: 'Nordic Explorers',
    moodboard: ['Glacial Blues', '35mm Film Grain', 'Natural Sunlight', 'Acoustic Soundscapes'],
    shotList: [
      'Shot 01: Top-down 8K drone sweep over volcanic black sand beach',
      'Shot 02: Slow-motion waterfall spray at 120fps',
      'Shot 03: Sunset silhouette tracking shot across glacier ridge'
    ],
    storyboardImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    cameraSetup: 'Sony FX6 + DJI Mavic 3 Cine (ProRes 422 HQ)',
    lighting: 'Pure golden hour natural ambient + reflector bounce',
    outcome: 'Vimeo Staff Pick & Featured on Travel Weekly'
  }
];

export default function BehindTheScenes() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = DIRECTION_PROJECTS[activeIndex];

  return (
    <section className="section-padding tile-light" style={{ borderTop: '2px solid #111111' }}>
      <div className="container">
        
        {/* Section Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', backgroundColor: '#111111', color: '#D9FF00', fontFamily: 'var(--font-heading)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px' }}>
            <Camera size={14} />
            <span>CREATIVE DIRECTION & PRE-PRODUCTION</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: '#111111', textTransform: 'uppercase' }}>
            BEHIND THE <span style={{ backgroundColor: '#D9FF00', color: '#111111', padding: '0 8px' }}>CRAFT</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#4A4A4A', maxWidth: '640px', margin: '8px auto 0 auto' }}>
            Inside the exact moodboards, shot lists, storyboards, camera setups, and lighting plots behind Nikhil's films.
          </p>
        </div>

        {/* Project Selector Chips */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
          {DIRECTION_PROJECTS.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => setActiveIndex(idx)}
              style={{
                padding: '10px 22px',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                border: '2px solid #111111',
                backgroundColor: activeIndex === idx ? '#111111' : 'transparent',
                color: activeIndex === idx ? '#D9FF00' : '#111111',
                cursor: 'pointer'
              }}
            >
              0{idx + 1} / {proj.client}
            </button>
          ))}
        </div>

        {/* Grid Blueprint */}
        <div className="grid-12" style={{ backgroundColor: '#ECE9E2', border: '2px solid #111111', padding: '36px' }}>
          
          {/* Moodboard & Shot List (Span 6) */}
          <div style={{ gridColumn: 'span 6' }}>
            <div style={{ marginBottom: '28px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#FF6A00', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                01. VISUAL MOODBOARD & AESTHETIC PALETTE
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {current.moodboard.map((tag, i) => (
                  <span key={i} style={{ backgroundColor: '#111111', color: '#D9FF00', padding: '6px 14px', fontFamily: 'var(--font-heading)', fontSize: '0.8rem', fontWeight: 700 }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '28px', borderTop: '2px solid #111111', paddingTop: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#111111', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                02. DIRECTORIAL SHOT LIST & CAMERA MOVES
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {current.shotList.map((shot, i) => (
                  <div key={i} style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', padding: '12px 16px', fontSize: '0.85rem', fontWeight: 600, color: '#111111' }}>
                    {shot}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '2px solid #111111', paddingTop: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#111111', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                03. CAMERA RIG & LIGHTING SCHEMATIC
              </span>
              <div style={{ fontSize: '0.9rem', color: '#111111', marginBottom: '4px' }}>
                <strong>Camera:</strong> {current.cameraSetup}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#4A4A4A' }}>
                <strong>Lighting:</strong> {current.lighting}
              </div>
            </div>
          </div>

          {/* Storyboard Visual Frame & Outcome (Span 6) */}
          <div style={{ gridColumn: 'span 6' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#111111', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                04. STORYBOARD PRE-VISUALIZATION FRAME
              </span>
              <div style={{ border: '2px solid #111111', height: '280px', overflow: 'hidden', position: 'relative' }}>
                <img src={current.storyboardImg} alt="Storyboard Frame" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: '#111111', color: '#D9FF00', padding: '4px 10px', fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 800 }}>
                  FRAME 03 B / DYNAMIC ZOOM
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#111111', color: '#F6F5F1', padding: '20px', border: '2px solid #111111' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#D9FF00', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                MEASURABLE CAMPAIGN OUTCOME
              </span>
              <div style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                {current.outcome}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
