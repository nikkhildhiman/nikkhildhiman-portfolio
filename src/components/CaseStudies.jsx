import React, { useState } from 'react';
import { Target, CheckCircle, ArrowRight } from 'lucide-react';
import { CASE_STUDIES_DATA } from '../data/portfolioData';

export default function CaseStudies({ onOpenBooking }) {
  const [activeStudyIndex, setActiveStudyIndex] = useState(0);
  const currentStudy = CASE_STUDIES_DATA[activeStudyIndex];
  const [viewState, setViewState] = useState('after'); // 'before' | 'after'

  return (
    <section id="case-studies" className="section-padding tile-light">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="display-lg" style={{ marginBottom: '12px' }}>
            Footage Transformation.
          </h2>
          <p className="lead" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Inside the exact post-production strategies that scaled creator retention and brand conversions.
          </p>
        </div>

        {/* Option Chips Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {CASE_STUDIES_DATA.map((study, idx) => {
            const isActive = activeStudyIndex === idx;
            return (
              <button
                key={study.id}
                onClick={() => setActiveStudyIndex(idx)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-pill)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  border: isActive ? '2px solid var(--primary-focus)' : '1px solid var(--hairline)',
                  backgroundColor: isActive ? 'var(--primary-blue)' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--color-ink)',
                  transition: 'var(--transition-fast)'
                }}
              >
                Case Study #{idx + 1}: {study.client}
              </button>
            );
          })}
        </div>

        {/* Apple Utility Card Frame */}
        <div className="apple-card" style={{ padding: '36px' }}>
          <div className="grid-12" style={{ alignItems: 'center' }}>
            
            {/* Left Column: Visual Before/After Transformation (Span 6) */}
            <div style={{ gridColumn: 'span 6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  FOOTAGE TRANSFORMATION
                </span>
                
                {/* Before/After Option Chips Toggle */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setViewState('before')}
                    className={viewState === 'before' ? 'btn-primary' : 'btn-pearl-capsule'}
                    style={{ padding: '4px 12px', fontSize: '12px' }}
                  >
                    Raw Unedited
                  </button>
                  <button
                    onClick={() => setViewState('after')}
                    className={viewState === 'after' ? 'btn-primary' : 'btn-pearl-capsule'}
                    style={{ padding: '4px 12px', fontSize: '12px' }}
                  >
                    Polished Final ✨
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative', height: '340px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--hairline)' }}>
                <img
                  src={viewState === 'before' ? currentStudy.beforeImage : currentStudy.afterImage}
                  alt={currentStudy.title}
                  className="img-apple"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', backgroundColor: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>
                  {viewState === 'before' ? '⚠️ RAW: Flat Log Profile' : '✨ FINAL: Color Graded Master'}
                </div>
              </div>

              {/* Metric Impact Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
                {currentStudy.results.map((res, i) => (
                  <div key={i} style={{ backgroundColor: 'var(--canvas-parchment)', padding: '14px', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--hairline)' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: 'var(--font-heading)', color: 'var(--primary-blue)' }}>
                      {res.value}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {res.metric}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Breakdown Narrative (Span 6) */}
            <div style={{ gridColumn: 'span 6' }}>
              <div style={{ fontSize: '13px', color: 'var(--primary-blue)', fontWeight: 600, marginBottom: '8px' }}>
                CLIENT: {currentStudy.client.toUpperCase()}
              </div>

              <h3 style={{ fontSize: '1.6rem', color: 'var(--color-ink)', marginBottom: '16px', fontWeight: 600, lineHeight: 1.25 }}>
                {currentStudy.title}
              </h3>

              {/* Challenge & Solution */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '14px' }}>
                  <strong style={{ color: '#d32f2f', display: 'block', fontSize: '13px', marginBottom: '2px' }}>
                    The Challenge:
                  </strong>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    {currentStudy.challenge}
                  </p>
                </div>

                <div>
                  <strong style={{ color: '#2e7d32', display: 'block', fontSize: '13px', marginBottom: '2px' }}>
                    The Creative Solution:
                  </strong>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    {currentStudy.solution}
                  </p>
                </div>
              </div>

              {/* Timeline Steps */}
              <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: '16px', marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '10px' }}>
                  Post-Production Steps Executed:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentStudy.timelineSteps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                      <CheckCircle size={15} color="var(--primary-blue)" style={{ flexShrink: 0 }} />
                      <div>
                        <span style={{ color: 'var(--color-ink)', fontWeight: 600 }}>{step.phase}: </span>
                        <span style={{ color: 'var(--text-muted)' }}>{step.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn-primary" onClick={onOpenBooking} style={{ width: '100%' }}>
                <span>Request Similar Transformation</span>
                <ArrowRight size={16} />
              </button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
