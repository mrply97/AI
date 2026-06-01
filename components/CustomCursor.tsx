'use client';

import { useEffect, useState } from 'react';
import {
  useMotionValue,
  useSpring,
  motion,
} from 'framer-motion';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Inner dot — fast spring
  const dotX = useSpring(mouseX, { stiffness: 600, damping: 35 });
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 35 });

  // Outer ring — slow spring
  const ringX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const ringY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const dotOpacity = useMotionValue(0);
  const ringOpacity = useMotionValue(0);

  const dotSpringOpacity = useSpring(dotOpacity, { stiffness: 300, damping: 30 });
  const ringSpringOpacity = useSpring(ringOpacity, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) return;
    setIsPointerFine(true);

    document.body.classList.add('custom-cursor-active');

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
      dotOpacity.set(1);
      ringOpacity.set(1);
    };

    const onLeave = () => {
      dotOpacity.set(0);
      ringOpacity.set(0);
    };

    const onEnter = () => {
      dotOpacity.set(1);
      ringOpacity.set(1);
    };

    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isPointerFine) return null;

  return (
    <>
      {/* Inner dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: 'var(--gold)',
          boxShadow: '0 0 8px rgba(160,133,88,0.6)',
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: dotSpringOpacity,
        }}
      />

      {/* Outer ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 34,
          height: 34,
          borderRadius: '50%',
          border: '1px solid rgba(160,133,88,0.45)',
          mixBlendMode: 'multiply',
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: ringSpringOpacity,
        }}
      />
    </>
  );
}
