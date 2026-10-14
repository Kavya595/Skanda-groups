import React, { useState, useEffect, useRef } from 'react';

/**
 * Animated counter that counts from 0 to end when entering the viewport
 */
export default function CountUp({
  end = 0,
  decimals = 0,
  duration = 1800,
  prefix = '',
  suffix = '',
  className = ''
}) {
  const [value, setValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();

          let startTime = null;
          const target = parseFloat(end);

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease-out cubic curve: 1 - Math.pow(1 - progress, 3)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = easeOut * target;

            setValue(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setValue(target);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  const formattedValue = decimals > 0 ? value.toFixed(decimals) : Math.round(value);

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
