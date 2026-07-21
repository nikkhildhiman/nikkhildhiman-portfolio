import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Volume2, Video, Layers, Music, Image as ImageIcon, Lock, Eye, EyeOff, VolumeX, Mic2, Pause } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STAGES_DATA = [
  { id: 0, name: 'Discover', file: '01_Audience_Audit.mogrt', desc: 'Analyzing audience retention and mapping visual hooks.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' },
  { id: 1, name: 'Plan', file: '02_Storyboard.psd', desc: 'Pre-visualization, shot lists, and moodboard assembly.', image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, name: 'Edit', file: '03_RoughCut_v4.mp4', desc: 'A-Roll assembly, kinetic motion graphics, pacing passes.', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2070&auto=format&fit=crop' },
  { id: 3, name: 'Refine', file: '04_ColorGrade_2383.cube', desc: 'DaVinci 35mm film emulation, grain, and lighting masks.', image: 'https://images.unsplash.com/photo-1535016120720-40c746a47ce4?q=80&w=2070&auto=format&fit=crop' },
  { id: 4, name: 'Deliver', file: 'Master_4K.mov', desc: 'Final 4K UHD export, spatial foley sound mix applied.', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop' }
];

export default function CreativeProcess() {
  const timelineRef = useRef(null);
  const playheadRef = useRef(null);
  const playheadLineRef = useRef(null);
  const timecodeRef = useRef(null);
  
  // Interactive States
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackStates, setTrackStates] = useState({ v3: true, v2: true, v1: true, a1: true, a2: true });

  const TIMECODES = ['00:00:00:00', '00:00:05:00', '00:00:10:00', '00:00:15:00', '00:00:20:00', '00:00:25:00', '00:00:30:00'];

  useEffect(() => {
    if (timelineRef.current && playheadRef.current && playheadLineRef.current) {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 75%', 
          end: 'bottom 25%', 
          scrub: 0.5,
          onUpdate: (self) => {
            const totalFrames = 900;
            const currentFrame = Math.floor(self.progress * totalFrames);
            const seconds = Math.floor(currentFrame / 30);
            const frames = currentFrame % 30;
            const formattedTime = `00:00:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
            
            if (timecodeRef.current) timecodeRef.current.innerText = formattedTime;

            // Determine active stage based on progress
            if (self.progress < 0.2) setActiveStage(0);
            else if (self.progress < 0.35) setActiveStage(1);
            else if (self.progress < 0.75) setActiveStage(2);
            else if (self.progress < 0.9) setActiveStage(3);
            else setActiveStage(4);
            
            setIsPlaying(self.direction === 1 || self.direction === -1);
          },
          onScrubComplete: () => setIsPlaying(false)
        }
      });

      tl.fromTo([playheadRef.current, playheadLineRef.current], 
        { left: '2%' },
        { left: '98%', ease: 'none' }
      );

      return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }, []);

  const toggleTrack = (track) => {
    setTrackStates(prev => ({ ...prev, [track]: !prev[track] }));
  };

  const handleClipClick = (stageId, progressPercent) => {
    setActiveStage(stageId);
    const triggers = ScrollTrigger.getAll();
    const st = triggers.find(t => t.trigger === timelineRef.current);
    if (st && window.lenis) {
      const targetScroll = st.start + (st.end - st.start) * progressPercent;
      window.lenis.scrollTo(targetScroll, { 
        duration: 1.5, 
        ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
    }
  };

  const NLE = {
    bg: '#1e1e1e', panelBg: '#252526', border: '#333333', text: '#CCCCCC',
    trackHeader: '#2d2d2d', playhead: '#3182CE', clipBlue: '#3B6898',
    clipGreen: '#417551', clipMagenta: '#8B487A', clipOrange: '#A86A32',
    clipLabelBorder: 'rgba(0,0,0,0.3)'
  };

  return (
    <section id="process" className="section-padding" style={{ backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
      <div className="container">
        
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-black)', margin: 0, lineHeight: 1 }}>
            POST-PRODUCTION <span style={{ color: 'var(--text-muted)' }}>PIPELINE</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '16px' }}>Scroll to scrub the timeline or click a clip to jump.</p>
        </div>

        <div 
          ref={timelineRef}
          style={{
            backgroundColor: NLE.bg, borderRadius: '8px', border: `1px solid ${NLE.border}`,
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)', overflow: 'hidden', fontFamily: "'Inter', -apple-system, sans-serif",
            display: 'flex', flexDirection: 'column'
          }}
        >
          {/* OS Header */}
          <div style={{ display: 'flex', backgroundColor: NLE.panelBg, borderBottom: `1px solid ${NLE.border}`, padding: '8px 16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', marginRight: '24px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ED6A5E' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F4BF4F' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#61C554' }}></div>
              </div>
              <div style={{ padding: '4px 16px', backgroundColor: NLE.bg, borderTop: `2px solid ${NLE.playhead}`, borderLeft: `1px solid ${NLE.border}`, borderRight: `1px solid ${NLE.border}`, fontSize: '0.75rem', color: '#fff', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                Sequence_01_Master *
              </div>
            </div>
          </div>

          {/* Top Half: Program Monitor & Details */}
          <div style={{ display: 'flex', height: '300px', borderBottom: `1px solid ${NLE.border}`, backgroundColor: '#111' }}>
            
            {/* Left Panel: Project Bin / Description */}
            <div style={{ width: '30%', minWidth: '250px', borderRight: `1px solid ${NLE.border}`, backgroundColor: NLE.panelBg, padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: '#888', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>Project Bin // Active Stage</div>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', margin: '0 0 8px 0' }}>{STAGES_DATA[activeStage]?.name}</h3>
              <div style={{ color: NLE.playhead, fontSize: '0.8rem', fontFamily: "'SF Mono', monospace", marginBottom: '16px' }}>{STAGES_DATA[activeStage]?.file}</div>
              <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.5 }}>{STAGES_DATA[activeStage]?.desc}</p>
            </div>

            {/* Right Panel: Program Monitor */}
            <div style={{ flex: 1, backgroundColor: '#000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img 
                src={STAGES_DATA[activeStage]?.image} 
                alt="Stage Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, transition: 'opacity 0.3s ease' }} 
              />
              <div style={{ position: 'absolute', top: '16px', left: '16px', color: '#fff', fontSize: '0.7rem', backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px', fontFamily: "'SF Mono', monospace" }}>
                REC 4K UHD // LOG
              </div>
              <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', opacity: isPlaying ? 0 : 1, transition: 'opacity 0.3s' }}>
                <Play size={24} color="#fff" fill="#fff" style={{ marginLeft: '4px' }} />
              </div>
            </div>
          </div>

          {/* Sequence Toolbar & Timecode */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', backgroundColor: NLE.bg, borderBottom: `1px solid ${NLE.border}` }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <div style={{ width: '1px', height: '16px', backgroundColor: NLE.border }}></div>
              <span style={{ fontSize: '0.75rem', color: '#888' }}>Fit 100%</span>
            </div>
            <div ref={timecodeRef} style={{ color: NLE.playhead, fontSize: '0.9rem', fontFamily: "'SF Mono', monospace" }}>
              00:00:00:00
            </div>
          </div>

          {/* Timeline Panel */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Time Ruler */}
            <div style={{ display: 'flex', height: '24px', backgroundColor: NLE.panelBg, borderBottom: `1px solid ${NLE.border}`, position: 'relative' }}>
              <div style={{ width: '140px', borderRight: `1px solid ${NLE.border}`, backgroundColor: '#222' }}></div>
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4%', position: 'absolute', inset: 0, alignItems: 'flex-end' }}>
                  {TIMECODES.map((tc, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ color: '#888', fontSize: '0.6rem', fontFamily: "'SF Mono', monospace", marginBottom: '2px' }}>{tc}</span>
                      <div style={{ height: '4px', width: '1px', backgroundColor: '#666' }}></div>
                    </div>
                  ))}
                </div>
                <div ref={playheadRef} style={{ position: 'absolute', bottom: 0, left: '2%', width: '10px', height: '14px', backgroundColor: NLE.playhead, transform: 'translateX(-50%)', zIndex: 30, clipPath: 'polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)' }}></div>
              </div>
            </div>

            {/* Tracks Container */}
            <div style={{ display: 'flex' }}>
              
              {/* Track Headers Column */}
              <div style={{ width: '140px', backgroundColor: NLE.trackHeader, borderRight: `1px solid ${NLE.border}`, display: 'flex', flexDirection: 'column' }}>
                
                {['v3', 'v2', 'v1'].map((track, i) => (
                  <div key={track} style={{ height: '50px', borderBottom: track === 'v1' ? '2px solid #111' : `1px solid ${NLE.border}`, display: 'flex', alignItems: 'center', padding: '0 8px', gap: '8px', opacity: trackStates[track] ? 1 : 0.4 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Lock size={12} color="#666" style={{ cursor: 'pointer' }} />
                      <button onClick={() => toggleTrack(track)} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
                        {trackStates[track] ? <Eye size={12} color="#aaa" /> : <EyeOff size={12} color="#666" />}
                      </button>
                    </div>
                    <span style={{ color: '#ccc', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase' }}>{track}</span>
                  </div>
                ))}

                {['a1', 'a2'].map(track => (
                  <div key={track} style={{ height: '60px', borderBottom: `1px solid ${NLE.border}`, display: 'flex', alignItems: 'center', padding: '0 8px', gap: '8px', opacity: trackStates[track] ? 1 : 0.4 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button onClick={() => toggleTrack(track)} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
                        {trackStates[track] ? <Mic2 size={12} color="#aaa" /> : <VolumeX size={12} color="#666" />}
                      </button>
                    </div>
                    <span style={{ color: '#ccc', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase' }}>{track}</span>
                  </div>
                ))}
              </div>

              {/* Timeline Sequence Area */}
              <div style={{ flex: 1, backgroundColor: NLE.bg, position: 'relative', overflow: 'hidden', backgroundImage: 'linear-gradient(#222 1px, transparent 1px)', backgroundSize: '100% 50px' }}>
                
                <div ref={playheadLineRef} style={{ position: 'absolute', top: 0, bottom: 0, left: '2%', width: '1px', backgroundColor: NLE.playhead, transform: 'translateX(-50%)', zIndex: 20 }}></div>

                {/* --- V3 TRACK --- */}
                <div style={{ height: '50px', position: 'relative', opacity: trackStates.v3 ? 1 : 0 }}>
                  <div onClick={() => handleClipClick(0, 0.1)} className={`nle-clip ${activeStage === 0 ? 'active-clip' : ''}`} style={{ left: '2%', width: '18%', backgroundColor: NLE.clipMagenta }}>
                    <div className="clip-header">fx 01_Audience_Audit.mogrt</div>
                    <div className="clip-title">[01] Discover</div>
                  </div>
                  <div onClick={() => handleClipClick(1, 0.28)} className={`nle-clip ${activeStage === 1 ? 'active-clip' : ''}`} style={{ left: '21%', width: '15%', backgroundColor: NLE.clipMagenta }}>
                    <div className="clip-header">fx 02_Storyboard.psd</div>
                    <div className="clip-title">[02] Plan</div>
                  </div>
                </div>

                {/* --- V2 TRACK --- */}
                <div style={{ height: '50px', position: 'relative', opacity: trackStates.v2 ? 1 : 0 }}>
                  <div onClick={() => handleClipClick(2, 0.55)} className={`nle-clip ${activeStage === 2 ? 'active-clip' : ''}`} style={{ left: '37%', width: '38%', backgroundColor: NLE.clipBlue }}>
                    <div className="clip-header">fx 03_RoughCut_v4.mp4</div>
                    <div className="clip-title">[03] Edit & Pacing</div>
                  </div>
                </div>

                {/* --- V1 TRACK --- */}
                <div style={{ height: '50px', position: 'relative', borderBottom: '2px solid #111', opacity: trackStates.v1 ? 1 : 0 }}>
                  <div onClick={() => handleClipClick(3, 0.82)} className={`nle-clip ${activeStage === 3 ? 'active-clip' : ''}`} style={{ left: '76%', width: '14%', backgroundColor: NLE.clipOrange }}>
                    <div className="clip-header">fx 04_ColorGrade_2383.cube</div>
                    <div className="clip-title">[04] Refine (Color)</div>
                  </div>
                  <div onClick={() => handleClipClick(4, 0.95)} className={`nle-clip ${activeStage === 4 ? 'active-clip' : ''}`} style={{ left: '91%', width: '7%', backgroundColor: NLE.clipOrange }}>
                    <div className="clip-header">fx Master_4K.mov</div>
                    <div className="clip-title">[05] Deliver</div>
                  </div>
                </div>

                {/* --- A1 TRACK --- */}
                <div style={{ height: '60px', position: 'relative', opacity: trackStates.a1 ? 1 : 0 }}>
                  <div className="nle-clip" style={{ left: '2%', width: '96%', height: '50px', top: '5px', backgroundColor: NLE.clipGreen, display: 'flex', flexDirection: 'column' }}>
                    <div className="clip-header">fx Dialogue_Mix.wav</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 4px', gap: '1px', opacity: 0.6 }}>
                       {Array.from({ length: 80 }).map((_, i) => (
                         <div key={i} style={{ width: '2px', height: `${Math.random() * 80 + 10}%`, backgroundColor: '#fff', opacity: 0.8 }}></div>
                       ))}
                    </div>
                  </div>
                </div>

                {/* --- A2 TRACK --- */}
                <div style={{ height: '60px', position: 'relative', opacity: trackStates.a2 ? 1 : 0 }}>
                  <div className="nle-clip" style={{ left: '15%', width: '8%', height: '50px', top: '5px', backgroundColor: NLE.clipGreen }}><div className="clip-header">SFX_Swoosh.wav</div></div>
                  <div className="nle-clip" style={{ left: '42%', width: '12%', height: '50px', top: '5px', backgroundColor: NLE.clipGreen }}><div className="clip-header">SFX_Impact.wav</div></div>
                  <div className="nle-clip" style={{ left: '78%', width: '10%', height: '50px', top: '5px', backgroundColor: NLE.clipGreen }}><div className="clip-header">SFX_Riser.wav</div></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .nle-clip {
          position: absolute; height: 44px; top: 3px; border-radius: 4px;
          border: 1px solid rgba(0,0,0,0.5); box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
          overflow: hidden; cursor: pointer; transition: filter 0.2s, box-shadow 0.2s;
        }
        .nle-clip:hover, .active-clip {
          filter: brightness(1.3);
          box-shadow: 0 0 12px rgba(255,255,255,0.3), inset 0 1px 0 rgba(255,255,255,0.4);
          z-index: 10;
        }
        .clip-header {
          border-bottom: 1px solid rgba(0,0,0,0.3); padding: 2px 6px; fontSize: 0.6rem;
          color: #fff; background-color: rgba(0,0,0,0.1); white-space: nowrap; text-overflow: ellipsis; overflow: hidden;
        }
        .clip-title {
          padding: 4px 6px; font-size: 0.65rem; color: #fff; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;
        }
        @media (max-width: 768px) {
          .clip-header { display: none !important; }
          .nle-clip div:not(.clip-header) { font-size: 0.5rem !important; padding: 2px !important; }
        }
      `}</style>
    </section>
  );
}
