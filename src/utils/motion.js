import gsap from 'gsap';

// Check for reduced motion preferences
export const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

// ==========================================
// 1. REUSABLE TIMING CONFIGS
// ==========================================
export const EASING = {
  smooth: 'power4.out',
  cinematic: 'expo.inOut',
  bounce: 'back.out(1.5)',
  magnetic: 'elastic.out(1, 0.3)'
};

export const DURATION = {
  fast: 0.4,
  normal: 0.8,
  slow: 1.2,
  epic: 1.6
};

// ==========================================
// 2. REUSABLE ANIMATION VARIANTS
// ==========================================

/**
 * Standard Awwwards-style section reveal:
 * Starts blurred, translated down, and fades in smoothly.
 */
export const revealSection = (element, delay = 0) => {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0, filter: 'blur(0px)' });
    return;
  }

  gsap.fromTo(element, 
    { opacity: 0, y: 40, filter: 'blur(10px)' },
    { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)', 
      duration: DURATION.slow, 
      ease: EASING.smooth,
      delay,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
};

/**
 * Elegant staggered entry for groups of items (cards, images)
 */
export const staggeredReveal = (elements, staggerTime = 0.1, delay = 0) => {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0, filter: 'blur(0px)' });
    return;
  }

  gsap.fromTo(elements,
    { opacity: 0, y: 40, filter: 'blur(8px)' },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: DURATION.normal,
      ease: EASING.smooth,
      stagger: staggerTime,
      delay,
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
};

/**
 * Split-text line-by-line reveal for cinematic headlines.
 * Assumes the text is already split into lines (e.g., using SplitType or manual spans with overflow: hidden).
 */
export const revealTextLines = (lines, delay = 0) => {
  if (prefersReducedMotion()) {
    gsap.set(lines, { y: '0%', opacity: 1 });
    return;
  }

  gsap.fromTo(lines,
    { y: '100%', opacity: 0 },
    {
      y: '0%',
      opacity: 1,
      duration: DURATION.normal,
      ease: EASING.smooth,
      stagger: 0.08,
      delay,
      scrollTrigger: {
        trigger: lines[0]?.parentElement || lines[0],
        start: 'top 90%'
      }
    }
  );
};

// ==========================================
// 3. INTERACTIVE MICRO-ANIMATIONS
// ==========================================

/**
 * Adds a premium magnetic effect to buttons.
 * Elements will pull towards the cursor and spring back when left.
 */
export const initMagneticEffect = (element, strength = 0.3) => {
  if (prefersReducedMotion() || !element) return () => {};

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center (-1 to 1)
    const distanceX = (e.clientX - centerX) / (rect.width / 2);
    const distanceY = (e.clientY - centerY) / (rect.height / 2);

    // Subtle magnetic pull
    gsap.to(element, {
      x: distanceX * rect.width * strength,
      y: distanceY * rect.height * strength,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    // Spring back to center
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: EASING.magnetic
    });
  };

  const handleMouseDown = () => {
    // Compress on click
    gsap.to(element, { scale: 0.95, duration: 0.1 });
  };

  const handleMouseUp = () => {
    // Spring back
    gsap.to(element, { scale: 1, duration: 0.6, ease: EASING.magnetic });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
  element.addEventListener('mousedown', handleMouseDown);
  element.addEventListener('mouseup', handleMouseUp);
  element.addEventListener('mouseleave', handleMouseUp); // Ensure scale resets if dragged off

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
    element.removeEventListener('mousedown', handleMouseDown);
    element.removeEventListener('mouseup', handleMouseUp);
    element.removeEventListener('mouseleave', handleMouseUp);
  };
};

/**
 * Premium Page Transition Fade
 * Sequence: Soft fade out -> Blur -> Mount new -> Fade in
 */
export const pageTransitionOut = (container, onComplete) => {
  if (prefersReducedMotion()) {
    onComplete();
    return;
  }
  gsap.to(container, {
    opacity: 0,
    filter: 'blur(8px)',
    scale: 0.98,
    duration: 0.4,
    ease: 'power2.inOut',
    onComplete
  });
};

export const pageTransitionIn = (container) => {
  if (prefersReducedMotion()) {
    gsap.set(container, { opacity: 1, filter: 'blur(0px)', scale: 1 });
    return;
  }
  gsap.fromTo(container,
    { opacity: 0, filter: 'blur(8px)', scale: 1.02 },
    { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.6, ease: EASING.smooth, clearProps: 'all' }
  );
};
