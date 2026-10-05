import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function BookingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Commercial / Brand Ad',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSubmitted(false);
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500); // Wait for closing animation to finish
  };

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please agree to the processing of personal data.');
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: 'c9355b8d-0f35-4258-803d-a3b1ece7bc13',
          ...formData
        })
      });
      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        console.error(result);
        alert('Something went wrong. Please email directly.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please email directly.');
    }
  };

  const inputContainerStyle = {
    marginBottom: '40px'
  };

  const labelStyle = {
    display: 'block', 
    fontFamily: 'var(--font-heading)', 
    fontWeight: 600, 
    color: 'rgba(255,255,255,0.5)', 
    marginBottom: '8px', 
    fontSize: '0.8rem', 
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const inputStyle = {
    width: '100%', 
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent', 
    outline: 'none', 
    fontSize: '1.2rem', 
    color: '#fff', 
    fontFamily: 'var(--font-body)',
    paddingBottom: '12px',
    transition: 'border-color 0.3s ease'
  };

  return (
    <div
      className="booking-modal-wrapper"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        pointerEvents: isClosing ? 'none' : 'auto'
      }}
    >
      {/* Background layer */}
      <div 
        className="contact-bg"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#E4FF00',
          animation: isClosing ? 'fadeOut 0.5s ease forwards' : 'fadeIn 0.5s ease forwards',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '5%',
          overflow: 'hidden'
        }}
      >
        <div 
          className="contact-text"
          style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '0',
          fontSize: 'clamp(4rem, 14vh, 15rem)',
          fontWeight: 900,
          fontFamily: 'var(--font-heading)',
          color: '#111111',
          lineHeight: 0.8,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          marginLeft: '4vw'
        }}>
          {'CONTACT'.split('').map((char, i) => (
            <span key={i} style={{
              opacity: 0,
              animation: isClosing ? 'none' : `blissReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards ${i * 0.1}s`
            }}>{char}</span>
          ))}
        </div>
      </div>
      
      {/* Close Button */}
      <button 
        onClick={handleClose}
        style={{ position: 'absolute', top: '32px', right: '32px', background: 'transparent', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 30, transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)', animation: isClosing ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.8s ease forwards 0.4s', opacity: 0 }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.8)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <X size={40} strokeWidth={2} />
      </button>

      {/* Solid Black Form Panel */}
      <div 
        className="contact-form-panel"
        style={{
        backgroundColor: '#111111',
        width: '100%',
        maxWidth: '600px',
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 20,
        padding: '100px 60px 60px 60px',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        animation: isClosing ? 'slideOutRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        
        {submitted ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fff', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px auto', animation: 'scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              Message Sent
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', marginBottom: '40px' }}>
              Thanks {formData.name}. We'll reach out shortly.
            </p>
            <button onClick={handleClose} style={{ padding: '20px 40px', background: '#fff', color: '#111', border: 'none', borderRadius: '99px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 auto' }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', animation: isClosing ? 'none' : 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s', opacity: 0 }}>
            
            <div style={inputContainerStyle}>
              <label style={labelStyle}>Name</label>
              <input required type="text" value={formData.name} onChange={e => updateForm('name', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#fff'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'} />
            </div>

            <div style={inputContainerStyle}>
              <label style={labelStyle}>Email</label>
              <input required type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#fff'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'} />
            </div>

            <div style={inputContainerStyle}>
              <label style={labelStyle}>Project Type</label>
              <select value={formData.projectType} onChange={e => updateForm('projectType', e.target.value)} style={{...inputStyle, appearance: 'none', cursor: 'pointer'}} onFocus={e => e.target.style.borderColor = '#fff'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}>
                <option value="Commercial / Brand Ad" style={{ color: '#000' }}>Commercial / Brand Ad</option>
                <option value="YouTube Long-Form" style={{ color: '#000' }}>YouTube Long-Form</option>
                <option value="Reels / Shorts (9:16)" style={{ color: '#000' }}>Reels / Shorts (9:16)</option>
                <option value="Thumbnail Package" style={{ color: '#000' }}>Thumbnail Package</option>
                <option value="Event / Documentary" style={{ color: '#000' }}>Event / Documentary</option>
              </select>
            </div>

            <div style={inputContainerStyle}>
              <label style={labelStyle}>Message</label>
              <textarea rows="4" required value={formData.message} onChange={e => updateForm('message', e.target.value)} style={{ ...inputStyle, resize: 'none' }} onFocus={e => e.target.style.borderColor = '#fff'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}></textarea>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
              <input 
                type="checkbox" 
                id="agree" 
                checked={agreed} 
                onChange={e => setAgreed(e.target.checked)}
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  cursor: 'pointer',
                  accentColor: '#fff' 
                }} 
              />
              <label htmlFor="agree" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer' }}>
                I agree to the processing of <strong>Personal data</strong>
              </label>
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: 'center', marginTop: 'auto' }}>
              <button type="submit" style={{ width: '100%', backgroundColor: '#fff', color: '#111', padding: '20px 24px', borderRadius: '99px', fontSize: '1.2rem', fontWeight: 800, border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'transform 0.2s ease, opacity 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                SEND
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRightSoft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes blissReveal {
          0% { opacity: 0; filter: blur(20px); transform: translateY(40px) scale(0.9); }
          100% { opacity: 1; filter: blur(0px); transform: translateY(0) scale(1); }
        }
        @media (max-width: 900px) {
          .contact-bg {
            position: relative !important;
            height: auto !important;
            padding: 60px 20px !important;
            justify-content: center !important;
            order: 2; /* Put it at the bottom */
          }
          .contact-text {
            flex-direction: row !important;
            margin-left: 0 !important;
            font-size: clamp(3rem, 15vw, 6rem) !important;
            line-height: 1 !important;
          }
          .contact-form-panel {
            position: relative !important;
            max-width: 100% !important;
            height: auto !important;
            padding: 80px 30px 60px 30px !important;
            order: 1; /* Put it at the top */
            box-shadow: none !important;
            overflow-y: visible !important;
          }
          /* Make the main wrapper scrollable on mobile */
          .booking-modal-wrapper {
            flex-direction: column !important;
            overflow-y: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
