import React, { useRef, useEffect } from 'react';

export default function SandText({ darkMode }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    let particles = [];
    let animationFrameId;
    
    let mouse = {
      x: null,
      y: null,
      radius: 60 // Smaller, tighter interaction radius
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    // Need to bind mousemove to window so it tracks even if hovering slightly outside canvas
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    class Particle {
      constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 40) + 5;
        this.size = size;
        this.color = color;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        // Draw slightly rounded particles
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      
      update() {
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;
            
            this.x -= directionX;
            this.y -= directionY;
          } else {
            // Return to base (slower reform for a cooler sand effect)
            if (this.x !== this.baseX) {
              let dxBase = this.x - this.baseX;
              this.x -= dxBase / 15;
            }
            if (this.y !== this.baseY) {
              let dyBase = this.y - this.baseY;
              this.y -= dyBase / 15;
            }
          }
        } else {
          // Return to base if mouse is not present
          if (this.x !== this.baseX) {
            let dxBase = this.x - this.baseX;
            this.x -= dxBase / 15;
          }
          if (this.y !== this.baseY) {
            let dyBase = this.y - this.baseY;
            this.y -= dyBase / 15;
          }
        }
      }
    }

    const init = () => {
      particles = [];
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Exact font sizing from the original CSS: clamp(4rem, 7.5vw, 8rem)
      // 4rem = 64px, 8rem = 128px
      let baseFontSize = Math.max(64, Math.min(rect.width * 0.075, 128));
      let lineHeight = baseFontSize * 0.9; // Original had lineHeight: 0.9
      
      // Scale canvas for high DPI displays so text is razor sharp (original texture)
      canvas.width = rect.width * dpr;
      canvas.height = (lineHeight * 3.2) * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${lineHeight * 3.2}px`;
      
      ctx.scale(dpr, dpr);
      
      const textBaseColor = darkMode ? '#ffffff' : '#0a0a0a';
      const highlightColor = '#0055ff'; 
      
      ctx.font = `800 ${baseFontSize}px "Inter", sans-serif`;
      ctx.textBaseline = 'top';
      // Apply the negative letter spacing from the original design if supported
      if ('letterSpacing' in ctx) {
        ctx.letterSpacing = '-0.03em';
      }

      // Draw text
      ctx.fillStyle = textBaseColor;
      ctx.fillText('I CREATE', 0, 0);
      
      ctx.fillStyle = highlightColor;
      // .stair-text had padding-left: 40px on desktop, 24px on mobile
      const stairOffset = rect.width < 992 ? 24 : 40; 
      ctx.fillText('VISUAL', stairOffset, lineHeight);
      
      ctx.fillStyle = textBaseColor;
      ctx.fillText('STORIES.', 0, lineHeight * 2);

      // Scan pixels
      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Adjust sample rate based on DPR so particle count remains reasonable
      const sampleRate = Math.max(Math.floor((baseFontSize * dpr) / 35), 2);
      const particleSize = (sampleRate * 0.7) / dpr; // Scale particles down visually
      
      for (let y = 0; y < textCoordinates.height; y += sampleRate) {
        for (let x = 0; x < textCoordinates.width; x += sampleRate) {
          const index = (y * 4 * textCoordinates.width) + (x * 4);
          const alpha = textCoordinates.data[index + 3];
          
          if (alpha > 128) {
            let r = textCoordinates.data[index];
            let g = textCoordinates.data[index + 1];
            let b = textCoordinates.data[index + 2];
            let color = `rgb(${r},${g},${b})`;
            // Store logical coordinates (divide by DPR)
            particles.push(new Particle(x / dpr, y / dpr, color, particleSize));
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // Ensure fonts are loaded before initializing canvas text
    document.fonts.ready.then(() => {
      init();
      animate();
    });

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        init();
      }, 200);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <div ref={containerRef} style={{ width: '100%', marginBottom: '32px' }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          display: 'block', 
          width: '100%', 
          cursor: 'default'
        }} 
      />
    </div>
  );
}
