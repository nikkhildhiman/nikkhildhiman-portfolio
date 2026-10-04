import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Film, MonitorPlay, Smartphone, Image as ImageIcon, Camera } from 'lucide-react';

export default function BookingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward'); // for animation direction
  
  const [formData, setFormData] = useState({
    projectType: '',
    budget: '',
    name: '',
    email: '',
    phone: '',
    details: ''
  });

  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1); // reset on open
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const nextStep = () => {
    setDirection('forward');
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection('backward');
    setStep(prev => prev - 1);
  };

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Auto-advance for multiple choice questions
    if (key === 'projectType' || key === 'budget') {
      setTimeout(nextStep, 300);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDirection('forward');
    setStep(4); // Success step
  };

  const PROJECT_TYPES = [
    { id: 'Commercial', icon: Film, label: 'Commercial / Brand Ad' },
    { id: 'YouTube', icon: MonitorPlay, label: 'YouTube Long-Form' },
    { id: 'Reels', icon: Smartphone, label: 'Reels / Shorts (9:16)' },
    { id: 'Thumbnails', icon: ImageIcon, label: 'Thumbnail Package' },
    { id: 'Documentary', icon: Camera, label: 'Event / Documentary' },
  ];

  const BUDGETS = [
    { id: 't1', label: '₹25,000 - ₹50,000', desc: 'Standard Edits' },
    { id: 't2', label: '₹50,000 - ₹1,00,000', desc: 'High-Impact Production' },
    { id: 't3', label: '₹1,00,000 - ₹2,50,000', desc: 'Cinematic Excellence' },
    { id: 't4', label: '₹2,50,000+', desc: 'Agency / Retainer' },
  ];

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
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {step > 1 && step < 4 && (
            <button onClick={prevStep} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
              <ArrowLeft size={24} />
            </button>
          )}
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {step < 4 ? `Step 0${step} / 03` : 'Transmission Complete'}
          </span>
        </div>
        
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
        <div style={{ width: '100%', maxWidth: '720px', position: 'relative' }}>
          
          {/* STEP 1: Project Type */}
          {step === 1 && (
            <div className="form-step-enter" style={{ width: '100%' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-black)', marginBottom: '16px', lineHeight: 1.1 }}>
                What type of visual story are we crafting?
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '48px' }}>Select the primary format for your project.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {PROJECT_TYPES.map(type => {
                  const Icon = type.icon;
                  const isSelected = formData.projectType === type.label;
                  return (
                    <button
                      key={type.id}
                      onClick={() => updateForm('projectType', type.label)}
                      style={{
                        padding: '24px',
                        background: isSelected ? 'var(--color-black)' : 'transparent',
                        border: isSelected ? '1px solid var(--color-black)' : '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        color: isSelected ? 'var(--bg-main)' : 'var(--color-black)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}
                      className="magnetic-form-card"
                    >
                      <Icon size={28} color={isSelected ? 'var(--accent-blue)' : 'var(--color-black)'} />
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem' }}>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Budget */}
          {step === 2 && (
            <div className="form-step-enter" style={{ width: '100%' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-black)', marginBottom: '16px', lineHeight: 1.1 }}>
                What is your estimated budget?
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '48px' }}>This helps us align production scale with expectations.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                {BUDGETS.map(tier => {
                  const isSelected = formData.budget === tier.label;
                  return (
                    <button
                      key={tier.id}
                      onClick={() => updateForm('budget', tier.label)}
                      style={{
                        padding: '24px 32px',
                        background: isSelected ? 'var(--color-black)' : 'transparent',
                        border: isSelected ? '1px solid var(--color-black)' : '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        color: isSelected ? 'var(--bg-main)' : 'var(--color-black)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem' }}>{tier.label}</span>
                      <span style={{ color: isSelected ? 'var(--text-muted)' : 'var(--text-muted)', fontSize: '0.9rem' }}>{tier.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Details */}
          {step === 3 && (
            <div className="form-step-enter" style={{ width: '100%' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-black)', marginBottom: '16px', lineHeight: 1.1 }}>
                Final details.
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '48px' }}>How should we reach out to you to discuss the vision?</p>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-black)' }}>Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => updateForm('name', e.target.value)}
                    placeholder="John Doe"
                    style={{ background: 'transparent', border: 'none', borderBottom: '2px solid var(--glass-border)', padding: '16px 0', fontSize: '1.5rem', color: 'var(--color-black)', outline: 'none', transition: 'border-color 0.3s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-black)'}
                    onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                  />
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '240px' }}>
                    <label style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-black)' }}>WhatsApp / Phone</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={e => updateForm('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{ background: 'transparent', border: 'none', borderBottom: '2px solid var(--glass-border)', padding: '16px 0', fontSize: '1.5rem', color: 'var(--color-black)', outline: 'none', transition: 'border-color 0.3s' }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-black)'}
                      onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '240px' }}>
                    <label style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-black)' }}>Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => updateForm('email', e.target.value)}
                      placeholder="john@studio.com"
                      style={{ background: 'transparent', border: 'none', borderBottom: '2px solid var(--glass-border)', padding: '16px 0', fontSize: '1.5rem', color: 'var(--color-black)', outline: 'none', transition: 'border-color 0.3s' }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-black)'}
                      onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-lime" style={{ marginTop: '24px', padding: '24px', fontSize: '1.2rem', justifyContent: 'space-between' }}>
                  Submit Project Brief <ArrowRight size={24} />
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="form-step-enter" style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px auto', animation: 'scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <CheckCircle2 size={40} />
              </div>
              <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-black)', marginBottom: '16px' }}>
                BRIEF RECEIVED.
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '40px', maxWidth: '400px', margin: '0 auto 40px auto' }}>
                Thanks, {formData.name || 'there'}. I'll review your brief and reach out via WhatsApp shortly to discuss the next steps.
              </p>
              <button onClick={onClose} className="btn-secondary">
                Return to Portfolio
              </button>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        .form-step-enter {
          animation: modalFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .magnetic-form-card:hover {
          border-color: var(--color-black) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
