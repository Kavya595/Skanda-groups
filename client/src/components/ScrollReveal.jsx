import React, { useState, useEffect, useRef } from 'react';

/**
 * ScrollReveal wrapper that triggers smooth fade-and-slide animation on scroll entry
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.15
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getDirectionClasses = () => {
    switch (direction) {
      case 'down':
        return isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0';
      case 'left':
        return isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0';
      case 'right':
        return isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0';
      case 'up':
      default:
        return isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: '700ms',
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`transition-all transform will-change-transform ${getDirectionClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
