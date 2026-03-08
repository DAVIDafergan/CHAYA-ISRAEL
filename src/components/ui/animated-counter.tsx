'use client';

import { useEffect, useState } from 'react';

type AnimatedCounterProps = {
  value: number;
};

export function AnimatedCounter({ value }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
      let start = 0;
      const end = value;
      if (start === end) {
        setCount(end);
        return;
      };

      const duration = 2000; // Animate over 2 seconds
      const range = end - start;
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentVal = Math.floor(progress * range + start);
        setCount(currentVal);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}
