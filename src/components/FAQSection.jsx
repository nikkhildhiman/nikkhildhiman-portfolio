import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: "WHAT IS YOUR TYPICAL POST-PRODUCTION TURNAROUND TIME?",
    answer: "For short-form reels and commercial ads, initial rough cut assemblies are delivered within 48 to 72 hours. Long-form YouTube videos and documentary edits average 5 to 7 business days."
  },
  {
    question: "HOW DO WE TRANSFER RAW FOOTAGE AND ASSETS?",
    answer: "We utilize high-speed cloud workflows including Frame.io, Dropbox Transfer, or Google Drive for 8K ProRes/RAW camera footage ingest and review notes."
  },
  {
    question: "DO YOU HANDLE COLOR GRADING AND SOUND DESIGN?",
    answer: "Yes. Every edit includes custom DaVinci Resolve color correction/LUT grading and a 30+ layer spatial sound design mix (risers, foley, voice EQ, ambient pads)."
  },
  {
    question: "WHAT IS INCLUDED IN THE HIGH-CTR THUMBNAIL PACKAGE?",
    answer: "Each thumbnail is designed in Photoshop featuring 3D lighting cutouts, high-contrast rim glows, and psychological hook typography optimized for 3x higher CTR."
  },
  {
    question: "HOW DO RETAINER PARTNERSHIPS WORK?",
    answer: "We offer monthly studio retainers for creators and agencies requiring a dedicated post-production pipeline (e.g. 4-8 videos + reels + thumbnails per month)."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section-padding tile-light" style={{ borderTop: '2px solid #111111' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', backgroundColor: '#111111', color: '#D9FF00', fontFamily: 'var(--font-heading)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px' }}>
            <HelpCircle size={14} />
            <span>CLIENT FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: '#111111', textTransform: 'uppercase' }}>
            QUESTIONS & <span style={{ backgroundColor: '#D9FF00', color: '#111111', padding: '0 8px' }}>ANSWERS</span>
          </h2>
        </div>

        <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ECE9E2',
                  border: '2px solid #111111',
                  transition: 'var(--transition-fast)'
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    backgroundColor: isOpen ? '#111111' : 'transparent',
                    color: isOpen ? '#D9FF00' : '#111111',
                    border: 'none',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{faq.question}</span>
                  {isOpen ? <Minus size={20} color="#D9FF00" /> : <Plus size={20} color="#111111" />}
                </button>

                {isOpen && (
                  <div style={{ padding: '20px 24px', fontSize: '1rem', color: '#111111', lineHeight: 1.6, borderTop: '2px solid #111111', backgroundColor: '#F6F5F1' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
